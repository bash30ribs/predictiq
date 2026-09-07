import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { CustomerReviewAnalysisResponse, SentimentType } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      review_text,
      customer_id = 'C1024',
      customer_name = 'Apex Digital Labs',
      source = 'NPS Survey',
      user_id = 1,
      organization = 'Enterprise Org',
    } = body;

    if (!review_text || !review_text.trim()) {
      return NextResponse.json(
        { error: 'Customer review text is required for sentiment analysis.' },
        { status: 400 }
      );
    }

    const text = review_text.toLowerCase();

    // Friction keyword dictionaries
    const highFrictionTokens = [
      'unresolved', 'unresponsive', 'outage', 'broken', 'escalate',
      'terrible', 'worst', 'cancel', 'cancellation', 'leaving', 'switch',
      'alternative', 'competitor', 'frustrated', 'failed', 'delay'
    ];

    const mediumFrictionTokens = [
      'expensive', 'pricing', 'costly', 'budget', 'steep', 'slow',
      'difficult', 'confusing', 'missing', 'lack of', 'poor'
    ];

    const positiveTokens = [
      'great', 'love', 'satisfied', 'excellent', 'responsive', 'seamless',
      'helpful', 'expand', 'renew', 'amazing', 'impressed', 'recommend'
    ];

    // Detect matched keywords
    const detectedHigh = highFrictionTokens.filter((kw) => text.includes(kw));
    const detectedMed = mediumFrictionTokens.filter((kw) => text.includes(kw));
    const detectedPos = positiveTokens.filter((kw) => text.includes(kw));

    const frictionKeywords = [...detectedHigh, ...detectedMed];

    // Scoring heuristics
    let sentimentScore = 0.0;
    let sentiment: SentimentType = 'NEUTRAL';
    let churnDelta = 0.0;
    let recommendedPlaybook = '';

    if (detectedHigh.length > 0) {
      sentiment = 'CRITICAL_FRICTION';
      sentimentScore = Math.max(-0.95, -0.5 - (detectedHigh.length * 0.15));
      churnDelta = Math.min(0.45, 0.20 + (detectedHigh.length * 0.08));
      recommendedPlaybook = 'Executive CS Escalation: Assign Senior Solutions Architect within 24h & propose 1-Year contract lock with 15% SLA billing credit.';
    } else if (detectedMed.length > 0) {
      sentiment = 'NEGATIVE';
      sentimentScore = Math.max(-0.6, -0.2 - (detectedMed.length * 0.12));
      churnDelta = 0.15;
      recommendedPlaybook = 'Commercial Alignment: Offer migration from month-to-month to discounted annual tier.';
    } else if (detectedPos.length > 0) {
      sentiment = 'POSITIVE';
      sentimentScore = Math.min(0.95, 0.4 + (detectedPos.length * 0.15));
      churnDelta = -0.20;
      recommendedPlaybook = 'Account Expansion Playbook: Schedule Executive QBR to propose seat tier upgrade.';
    } else {
      sentiment = 'NEUTRAL';
      sentimentScore = 0.05;
      churnDelta = 0.0;
      recommendedPlaybook = 'Routine CS Health Check: Send quarterly satisfaction survey.';
    }

    // Baseline probability (default 0.65 if unknown)
    const baseProb = 0.70;
    const adjustedProbability = Math.min(0.98, Math.max(0.05, Math.round((baseProb + churnDelta) * 100) / 100));

    // Persist into SQLite
    const db = getDb();
    const insertStmt = db.prepare(`
      INSERT INTO customer_reviews (user_id, organization, customer_id, customer_name, review_text, sentiment, sentiment_score, churn_risk_delta, adjusted_probability, friction_keywords, recommended_playbook, source)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertStmt.run(
      user_id,
      organization,
      customer_id,
      customer_name,
      review_text.trim(),
      sentiment,
      sentimentScore,
      churnDelta,
      adjustedProbability,
      JSON.stringify(frictionKeywords.length > 0 ? frictionKeywords : ['general tone']),
      recommendedPlaybook,
      source
    );

    const responseData: CustomerReviewAnalysisResponse = {
      id: Number(result.lastInsertRowid),
      customer_id,
      customer_name,
      review_text: review_text.trim(),
      sentiment,
      sentiment_score: sentimentScore,
      churn_risk_delta: churnDelta,
      adjusted_probability: adjustedProbability,
      friction_keywords: frictionKeywords.length > 0 ? frictionKeywords : ['neutral sentiment'],
      recommended_playbook: recommendedPlaybook,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json(responseData);
  } catch (err: any) {
    console.error('Review sentiment API error:', err);
    return NextResponse.json(
      { error: err?.message || 'Database error during sentiment analysis.' },
      { status: 500 }
    );
  }
}
