import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'predictiq.db');

// Singleton database connection
let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    initTables(db);
  }
  return db;
}

function initTables(database: Database.Database) {
  // 1. Users Table
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      organization TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Customer Reviews & Sentiment Analysis Table (User Scoped)
  database.exec(`
    CREATE TABLE IF NOT EXISTS customer_reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER DEFAULT 1,
      organization TEXT DEFAULT 'Apex Enterprise Telecom',
      customer_id TEXT,
      customer_name TEXT,
      review_text TEXT NOT NULL,
      sentiment TEXT NOT NULL,
      sentiment_score REAL NOT NULL,
      churn_risk_delta REAL NOT NULL,
      adjusted_probability REAL NOT NULL,
      friction_keywords TEXT,
      recommended_playbook TEXT,
      source TEXT DEFAULT 'NPS Survey',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);

  // 3. User Datasets Table (Multi-Tenant Datasets)
  database.exec(`
    CREATE TABLE IF NOT EXISTS user_datasets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      file_name TEXT NOT NULL,
      row_count INTEGER NOT NULL,
      feature_count INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);

  // 4. Customers Table (Persistent Customer Risk Records)
  database.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL DEFAULT 1,
      customer_id TEXT NOT NULL,
      name TEXT NOT NULL,
      segment TEXT NOT NULL DEFAULT 'Enterprise B2B',
      contract TEXT NOT NULL,
      tenure INTEGER NOT NULL,
      monthly_charges REAL NOT NULL,
      support_calls INTEGER NOT NULL DEFAULT 0,
      probability REAL NOT NULL DEFAULT 0.0,
      risk_level TEXT NOT NULL DEFAULT 'LOW',
      confidence TEXT NOT NULL DEFAULT 'HIGH',
      primary_driver TEXT NOT NULL DEFAULT 'Contract Type',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);

  // Check columns for migration
  const reviewCols = database.prepare("PRAGMA table_info(customer_reviews)").all() as Array<{ name: string }>;
  const reviewColNames = reviewCols.map(c => c.name);
  if (!reviewColNames.includes('user_id')) {
    database.exec("ALTER TABLE customer_reviews ADD COLUMN user_id INTEGER DEFAULT 1;");
  }
  if (!reviewColNames.includes('organization')) {
    database.exec("ALTER TABLE customer_reviews ADD COLUMN organization TEXT DEFAULT 'Apex Enterprise Telecom';");
  }

  // Pre-seed default demo executive user if not exists
  const existingElena = database.prepare('SELECT id FROM users WHERE email = ?').get('elena.rostova@predictiq.io');
  if (!existingElena) {
    const hashedPw = bcrypt.hashSync('Password123!', 10);
    const insertUser = database.prepare(`
      INSERT INTO users (name, email, password_hash, organization, role)
      VALUES (?, ?, ?, ?, ?)
    `);
    insertUser.run(
      'Elena Rostova',
      'elena.rostova@predictiq.io',
      hashedPw,
      'Apex Enterprise Telecom',
      'VP of Customer Success'
    );
  }

  // Pre-seed demo dataset for User 1 if not exists
  const elenaUser = database.prepare('SELECT id FROM users WHERE email = ?').get('elena.rostova@predictiq.io') as { id: number } | undefined;
  if (elenaUser) {
    const datasetCount = database.prepare('SELECT COUNT(*) as count FROM user_datasets WHERE user_id = ?').get(elenaUser.id) as { count: number };
    if (datasetCount.count === 0) {
      const insertDataset = database.prepare(`
        INSERT INTO user_datasets (user_id, file_name, row_count, feature_count, status)
        VALUES (?, ?, ?, ?, ?)
      `);
      insertDataset.run(elenaUser.id, 'telecom_churn_q3_enterprise.csv', 7043, 21, 'ACTIVE');
    }
  }

  // Pre-seed customers for User 1 if empty
  const customerCount = database.prepare('SELECT COUNT(*) as count FROM customers WHERE user_id = 1').get() as { count: number };
  if (customerCount.count === 0) {
    const insertCust = database.prepare(`
      INSERT INTO customers (user_id, customer_id, name, segment, contract, tenure, monthly_charges, support_calls, probability, risk_level, confidence, primary_driver)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialCustomers = [
      { id: "C1024", name: "Apex Digital Labs", segment: "Enterprise B2B", tenure: 8, monthly: 1299, contract: "Month-to-month", calls: 6, prob: 0.87, risk: "HIGH", conf: "HIGH", driver: "Contract Type" },
      { id: "C1002", name: "Starlight Media Group", segment: "Enterprise B2B", tenure: 4, monthly: 1850, contract: "Month-to-month", calls: 7, prob: 0.92, risk: "HIGH", conf: "HIGH", driver: "Support Calls" },
      { id: "C1015", name: "Vanguard Logistics", segment: "Enterprise B2B", tenure: 12, monthly: 2400, contract: "Month-to-month", calls: 5, prob: 0.84, risk: "HIGH", conf: "HIGH", driver: "Monthly Charges" },
      { id: "C1033", name: "Helios Cloud Networks", segment: "Enterprise B2B", tenure: 6, monthly: 3100, contract: "Month-to-month", calls: 8, prob: 0.89, risk: "HIGH", conf: "HIGH", driver: "Support Calls" },
      { id: "C1045", name: "Crestview Financial", segment: "Financial Services", tenure: 9, monthly: 1450, contract: "Month-to-month", calls: 4, prob: 0.76, risk: "HIGH", conf: "HIGH", driver: "Contract Type" },
      { id: "C2001", name: "Blue Ridge Capital", segment: "Financial Services", tenure: 24, monthly: 2100, contract: "One year", calls: 2, prob: 0.44, risk: "MEDIUM", conf: "HIGH", driver: "Tenure" },
      { id: "C2018", name: "Quantum Health Systems", segment: "Healthcare", tenure: 18, monthly: 1650, contract: "One year", calls: 3, prob: 0.51, risk: "MEDIUM", conf: "MEDIUM", driver: "Support Calls" },
      { id: "C2034", name: "Pacifica Retailers", segment: "Retail & E-commerce", tenure: 15, monthly: 980, contract: "Month-to-month", calls: 2, prob: 0.48, risk: "MEDIUM", conf: "HIGH", driver: "Contract Type" },
      { id: "C3005", name: "Meridian Global Advisors", segment: "Enterprise B2B", tenure: 48, monthly: 3400, contract: "Two year", calls: 0, prob: 0.14, risk: "LOW", conf: "HIGH", driver: "Contract Type" },
      { id: "C3022", name: "Solstice Energy Corp", segment: "Energy & Utilities", tenure: 36, monthly: 4200, contract: "Two year", calls: 1, prob: 0.08, risk: "LOW", conf: "HIGH", driver: "Tenure" },
    ];

    for (const c of initialCustomers) {
      insertCust.run(1, c.id, c.name, c.segment, c.contract, c.tenure, c.monthly, c.calls, c.prob, c.risk, c.conf, c.driver);
    }
  }

  // Pre-seed sample customer reviews specifically for User 1 if empty
  const reviewCount = database.prepare('SELECT COUNT(*) as count FROM customer_reviews WHERE user_id = 1').get() as { count: number };
  if (reviewCount.count === 0) {
    const insertReview = database.prepare(`
      INSERT INTO customer_reviews (user_id, organization, customer_id, customer_name, review_text, sentiment, sentiment_score, churn_risk_delta, adjusted_probability, friction_keywords, recommended_playbook, source)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertReview.run(
      1,
      'Apex Enterprise Telecom',
      'C1024',
      'Apex Digital Labs',
      'We had 6 unresolved tickets this month regarding slow API response times. If this continues into our renewal next month, we are forced to migrate to an alternative provider.',
      'CRITICAL_FRICTION',
      -0.78,
      0.32,
      0.87,
      JSON.stringify(['unresolved tickets', 'slow API response', 'renewal', 'migrate to alternative']),
      'Initiate emergency Solutions Architect audit and offer 1-year contract lock with 15% SLA billing credit.',
      'Support Ticket'
    );

    insertReview.run(
      1,
      'Apex Enterprise Telecom',
      'C1002',
      'Starlight Media Group',
      'The software features are great, but the monthly price tier without annual discount feels unsustainable for our current budget.',
      'NEGATIVE',
      -0.45,
      0.18,
      0.72,
      JSON.stringify(['monthly price tier', 'unsustainable budget', 'annual discount']),
      'Propose 1-year commitment migrating account off month-to-month terms.',
      'Executive QBR'
    );

    insertReview.run(
      1,
      'Apex Enterprise Telecom',
      'C3005',
      'Meridian Global Advisors',
      'Our team is very satisfied with the platform stability and responsive support. We plan to double our seat count at annual renewal.',
      'POSITIVE',
      0.85,
      -0.22,
      0.14,
      JSON.stringify(['platform stability', 'responsive support', 'double seat count']),
      'Trigger Expansion Playbook for enterprise tier upsell.',
      'NPS Survey'
    );
  }
}
