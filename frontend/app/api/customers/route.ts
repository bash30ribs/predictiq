import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get('user_id');
    const requestedUserId = userIdParam ? parseInt(userIdParam, 10) : 1;

    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const search = searchParams.get('search') || '';
    const riskLevel = searchParams.get('riskLevel') || 'ALL';
    const sortBy = searchParams.get('sortBy') || 'probability';
    const sortDir = searchParams.get('sortDir') === 'asc' ? 'ASC' : 'DESC';

    const db = getDb();

    // Check if the requested user has customers in the database
    let activeUserId = requestedUserId;
    const userCustCount = db.prepare('SELECT COUNT(*) as count FROM customers WHERE user_id = ?').get(requestedUserId) as { count: number };
    if (userCustCount.count === 0) {
      // Fallback to demo portfolio (user_id 1) so charts and tables never break
      activeUserId = 1;
    }

    // Build SQL query
    let baseQuery = 'FROM customers WHERE user_id = ?';
    const queryParams: any[] = [activeUserId];

    if (search.trim()) {
      baseQuery += ' AND (name LIKE ? OR customer_id LIKE ?)';
      queryParams.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }

    if (riskLevel && riskLevel !== 'ALL') {
      baseQuery += ' AND risk_level = ?';
      queryParams.push(riskLevel);
    }

    // Total count
    const totalRow = db.prepare(`SELECT COUNT(*) as total ${baseQuery}`).get(...queryParams) as { total: number };
    const total = totalRow.total;
    const totalPages = Math.ceil(total / pageSize) || 1;

    // Validate sort column
    const allowedSortCols = ['probability', 'name', 'monthly_charges', 'tenure', 'support_calls'];
    const safeSortCol = allowedSortCols.includes(sortBy) ? sortBy : 'probability';

    // Fetch paginated customers
    const offset = (page - 1) * pageSize;
    const dataQuery = `
      SELECT id, customer_id, name, segment, contract, tenure, monthly_charges, support_calls, probability, risk_level, confidence, primary_driver, created_at
      ${baseQuery}
      ORDER BY ${safeSortCol} ${sortDir}
      LIMIT ? OFFSET ?
    `;

    const customers = db.prepare(dataQuery).all(...queryParams, pageSize, offset) as any[];

    return NextResponse.json({
      customers,
      total,
      page,
      page_size: pageSize,
      total_pages: totalPages,
    });
  } catch (err: any) {
    console.error('Customers API error:', err);
    return NextResponse.json(
      { error: err?.message || 'Database error fetching customer directory.' },
      { status: 500 }
    );
  }
}
