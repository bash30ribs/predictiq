import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const body = await request.json().catch(() => ({}));
    const userIdParam = searchParams.get('user_id') || body.user_id;
    const userId = userIdParam ? parseInt(userIdParam, 10) : 1;

    const db = getDb();

    // Check existing count for this user
    const existing = db.prepare('SELECT COUNT(*) as count FROM customers WHERE user_id = ?').get(userId) as { count: number };
    if (existing.count > 0) {
      return NextResponse.json({
        message: 'Workspace already contains customer records.',
        count: existing.count,
      });
    }

    const insertCust = db.prepare(`
      INSERT INTO customers (user_id, customer_id, name, segment, contract, tenure, monthly_charges, support_calls, probability, risk_level, confidence, primary_driver)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const sampleAccounts = [
      { id: `C${userId}01`, name: "Quantum Analytics Corp", segment: "Enterprise B2B", tenure: 6, monthly: 1550, contract: "Month-to-month", calls: 5, prob: 0.88, risk: "HIGH", conf: "HIGH", driver: "Contract Type" },
      { id: `C${userId}02`, name: "Apex Media Cloud", segment: "Media & Telecom", tenure: 4, monthly: 2100, contract: "Month-to-month", calls: 7, prob: 0.93, risk: "HIGH", conf: "HIGH", driver: "Support Calls" },
      { id: `C${userId}03`, name: "Vertex Global Logistics", segment: "Logistics", tenure: 10, monthly: 2850, contract: "Month-to-month", calls: 4, prob: 0.82, risk: "HIGH", conf: "HIGH", driver: "Monthly Charges" },
      { id: `C${userId}04`, name: "Horizon Biotech Labs", segment: "Healthcare", tenure: 7, monthly: 3200, contract: "Month-to-month", calls: 6, prob: 0.86, risk: "HIGH", conf: "HIGH", driver: "Support Calls" },
      { id: `C${userId}05`, name: "Starlight Retail Group", segment: "Retail & E-commerce", tenure: 14, monthly: 1250, contract: "One year", calls: 3, prob: 0.49, risk: "MEDIUM", conf: "HIGH", driver: "Support Calls" },
      { id: `C${userId}06`, name: "Crestview Financial", segment: "Financial Services", tenure: 18, monthly: 1950, contract: "One year", calls: 2, prob: 0.42, risk: "MEDIUM", conf: "MEDIUM", driver: "Contract Type" },
      { id: `C${userId}07`, name: "Blue Ridge Capital", segment: "Financial Services", tenure: 22, monthly: 2400, contract: "One year", calls: 3, prob: 0.46, risk: "MEDIUM", conf: "HIGH", driver: "Tenure" },
      { id: `C${userId}08`, name: "Meridian Global Advisors", segment: "Enterprise B2B", tenure: 42, monthly: 3800, contract: "Two year", calls: 1, prob: 0.12, risk: "LOW", conf: "HIGH", driver: "Contract Type" },
      { id: `C${userId}09`, name: "Solstice Energy Grid", segment: "Energy & Utilities", tenure: 36, monthly: 4100, contract: "Two year", calls: 0, prob: 0.08, risk: "LOW", conf: "HIGH", driver: "Tenure" },
      { id: `C${userId}10`, name: "Pacifica Robotics", segment: "Hardware & IoT", tenure: 30, monthly: 2900, contract: "Two year", calls: 1, prob: 0.15, risk: "LOW", conf: "HIGH", driver: "Contract Type" },
    ];

    const insertMany = db.transaction(() => {
      for (const c of sampleAccounts) {
        insertCust.run(userId, c.id, c.name, c.segment, c.contract, c.tenure, c.monthly, c.calls, c.prob, c.risk, c.conf, c.driver);
      }
    });

    insertMany();

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${sampleAccounts.length} sample accounts for user ${userId}.`,
      count: sampleAccounts.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to seed sample customers' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get('user_id');
    const userId = userIdParam ? parseInt(userIdParam, 10) : 1;

    // Do not allow deleting demo user 1
    if (userId === 1) {
      return NextResponse.json({ error: 'Cannot clear demo user 1 workspace.' }, { status: 400 });
    }

    const db = getDb();
    db.prepare('DELETE FROM customers WHERE user_id = ?').run(userId);
    db.prepare('DELETE FROM customer_reviews WHERE user_id = ?').run(userId);
    db.prepare('DELETE FROM user_datasets WHERE user_id = ?').run(userId);

    return NextResponse.json({
      success: true,
      message: `Cleared all workspace records for user ${userId}.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to clear workspace' }, { status: 500 });
  }
}
