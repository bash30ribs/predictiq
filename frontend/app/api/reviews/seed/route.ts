import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const body = await request.json().catch(() => ({}));
    const userIdParam = searchParams.get('user_id') || body.user_id;
    const userId = userIdParam ? parseInt(userIdParam, 10) : 1;
    const organization = body.organization || 'Enterprise Org';

    const db = getDb();

    // Check existing count for this user
    const existing = db.prepare('SELECT COUNT(*) as count FROM customer_reviews WHERE user_id = ?').get(userId) as { count: number };
    if (existing.count > 0) {
      return NextResponse.json({
        message: 'Workspace already contains customer reviews.',
        count: existing.count,
      });
    }

    const insertReview = db.prepare(`
      INSERT INTO customer_reviews (user_id, organization, customer_id, customer_name, review_text, sentiment, sentiment_score, churn_risk_delta, adjusted_probability, friction_keywords, recommended_playbook, source)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const sampleReviews = [
      {
        customer_id: `C${userId}01`,
        customer_name: 'Quantum Analytics Corp',
        review_text: 'We had multiple unresolved outages this month. If this SLA problem continues into our renewal, we will cancel and switch to an alternative vendor.',
        sentiment: 'CRITICAL_FRICTION',
        sentiment_score: -0.82,
        churn_risk_delta: 0.35,
        adjusted_probability: 0.88,
        friction_keywords: JSON.stringify(['unresolved outages', 'SLA problem', 'renewal', 'cancel', 'switch to alternative']),
        recommended_playbook: 'Executive CS Escalation: Assign dedicated Architect within 24h & propose 1-Year lock with 15% discount credit.',
        source: 'Zendesk Ticket #892',
      },
      {
        customer_id: `C${userId}05`,
        customer_name: 'Starlight Retail Group',
        review_text: 'The platform capability is solid, but the recent monthly price increase feels too expensive for our current budget.',
        sentiment: 'NEGATIVE',
        sentiment_score: -0.45,
        churn_risk_delta: 0.15,
        adjusted_probability: 0.49,
        friction_keywords: JSON.stringify(['price increase', 'expensive', 'budget']),
        recommended_playbook: 'Pricing Review: Propose annual payment conversion with 10% price guarantee.',
        source: 'NPS Survey Free-Text',
      },
      {
        customer_id: `C${userId}08`,
        customer_name: 'Meridian Global Advisors',
        review_text: 'Our team is extremely impressed by the new features and responsive support team. We look forward to renewing our multi-year agreement!',
        sentiment: 'POSITIVE',
        sentiment_score: 0.85,
        churn_risk_delta: -0.20,
        adjusted_probability: 0.12,
        friction_keywords: JSON.stringify(['extremely impressed', 'responsive support', 'renewing']),
        recommended_playbook: 'Account Expansion: Identify additional team seats and initiate upsell discussions.',
        source: 'Executive QBR Note',
      },
    ];

    const insertMany = db.transaction(() => {
      for (const r of sampleReviews) {
        insertReview.run(
          userId,
          organization,
          r.customer_id,
          r.customer_name,
          r.review_text,
          r.sentiment,
          r.sentiment_score,
          r.churn_risk_delta,
          r.adjusted_probability,
          r.friction_keywords,
          r.recommended_playbook,
          r.source
        );
      }
    });

    insertMany();

    return NextResponse.json({
      success: true,
      message: `Successfully seeded 3 sample reviews for user ${userId}.`,
      count: sampleReviews.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to seed sample reviews' }, { status: 500 });
  }
}
