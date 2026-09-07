'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import {
  MessageSquareQuote,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { CustomerReviewAnalysisResponse, SentimentType } from '@/lib/types';

const SAMPLE_REVIEWS = [
  {
    title: 'Apex Digital Labs (Support Escalation)',
    customer_id: 'C1024',
    customer_name: 'Apex Digital Labs',
    text: 'We had 6 unresolved tickets this month regarding slow API response times. If this continues into our renewal next month, we are forced to migrate to an alternative provider.',
  },
  {
    title: 'Starlight Media (Pricing Pushback)',
    customer_id: 'C1002',
    customer_name: 'Starlight Media Group',
    text: 'The software features are great, but the monthly price tier without annual discount feels unsustainable for our current budget.',
  },
  {
    title: 'Meridian Global (Expansion Praise)',
    customer_id: 'C3005',
    customer_name: 'Meridian Global Advisors',
    text: 'Our team is very satisfied with the platform stability and responsive support. We plan to double our seat count at annual renewal.',
  },
];

export const CustomerVoiceSection: React.FC = () => {
  const [inputText, setInputText] = useState<string>(SAMPLE_REVIEWS[0].text);
  const [customerId, setCustomerId] = useState<string>(SAMPLE_REVIEWS[0].customer_id);
  const [customerName, setCustomerName] = useState<string>(SAMPLE_REVIEWS[0].customer_name);
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<CustomerReviewAnalysisResponse | null>({
    id: 1,
    customer_id: 'C1024',
    customer_name: 'Apex Digital Labs',
    review_text: SAMPLE_REVIEWS[0].text,
    sentiment: 'CRITICAL_FRICTION',
    sentiment_score: -0.78,
    churn_risk_delta: 0.32,
    adjusted_probability: 0.87,
    friction_keywords: ['unresolved tickets', 'slow API response', 'renewal', 'migrate to alternative'],
    recommended_playbook:
      'Executive CS Escalation: Assign Senior Solutions Architect within 24h & propose 1-Year contract lock with 15% SLA billing credit.',
    created_at: new Date().toISOString(),
  });

  const handleSelectSample = (sample: typeof SAMPLE_REVIEWS[0]) => {
    setInputText(sample.text);
    setCustomerId(sample.customer_id);
    setCustomerName(sample.customer_name);
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/reviews/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          review_text: inputText,
          customer_id: customerId,
          customer_name: customerName,
          source: 'Landing Page Interactive Sandbox',
        }),
      });
      if (!res.ok) throw new Error('Analysis failed');
      const data: CustomerReviewAnalysisResponse = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error('NLP Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentBadge = (sentiment: SentimentType) => {
    switch (sentiment) {
      case 'CRITICAL_FRICTION':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200 inline-flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-red-700" />
            Critical Friction Alert
          </span>
        );
      case 'NEGATIVE':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            Negative Sentiment
          </span>
        );
      case 'POSITIVE':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            Expansion Sentiment
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
            Neutral Tone
          </span>
        );
    }
  };

  return (
    <section id="voice" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto relative">
      {/* Background Gaussian ambient orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#12233D]/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-[#2E6B4E]/10 blur-[130px] pointer-events-none" />

      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-800 border border-slate-200">
          <MessageSquareQuote className="w-3.5 h-3.5 text-[#2E6B4E]" />
          <span>Qualitative AI Engine</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Read What Customers Actually Say, Not Just What They Click
        </h2>
        <p className="text-slate-600 text-sm sm:text-base font-normal">
          Numbers only tell half the story. PredictIQ uses natural language processing (NLP) to parse NPS feedback, support tickets, and executive QBR notes—feeding sentiment directly into the predictive churn score.
        </p>
      </div>

      {/* Interactive Sandbox Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Sample Switcher & Textarea */}
        <div className="lg:col-span-6 bg-white/85 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Select or Paste Real Customer Feedback
              </span>
              <span className="text-[11px] text-slate-400 font-medium">NLP Sandbox</span>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2">
              {SAMPLE_REVIEWS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(sample)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                    customerName === sample.customer_name
                      ? 'bg-[#12233D] text-white border-[#12233D] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sample.title}
                </button>
              ))}
            </div>

            {/* Account Info */}
            <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 font-medium">Account: </span>
                <span className="font-bold text-slate-900">{customerName}</span>
                <span className="text-slate-400 font-mono text-[11px] ml-1.5">({customerId})</span>
              </div>
              <span className="text-[11px] text-slate-500">Source: Support / NPS</span>
            </div>

            {/* Textarea */}
            <div className="space-y-1.5">
              <label htmlFor="customer-review-text" className="text-xs font-semibold text-slate-700">
                Customer Message / Ticket Body
              </label>
              <textarea
                id="customer-review-text"
                rows={4}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type customer review, support ticket text, or NPS comments here..."
                className="w-full text-xs sm:text-sm p-3 rounded-lg border border-slate-200 focus:border-[#12233D] focus:ring-1 focus:ring-[#12233D] focus:outline-none transition-all resize-none text-slate-800 bg-white"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={handleAnalyze}
              disabled={loading || !inputText.trim()}
              variant="primary"
              size="md"
              className="w-full shadow-xs"
              rightIcon={loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
            >
              {loading ? 'Analyzing Sentiment & Calculating Delta...' : 'Run Real-Time NLP Churn Analysis'}
            </Button>
          </div>
        </div>

        {/* Right Column: Instant Live NLP Extraction Result */}
        <div className="lg:col-span-6 bg-white/85 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                2. Real-Time Model Impact Output
              </span>
              {analysisResult && getSentimentBadge(analysisResult.sentiment)}
            </div>

            {analysisResult ? (
              <div className="space-y-4">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 font-medium block">NLP Sentiment Score</span>
                    <span
                      className={`text-xl font-mono font-bold ${
                        analysisResult.sentiment_score < 0 ? 'text-[#9E2A2B]' : 'text-[#2E6B4E]'
                      }`}
                    >
                      {analysisResult.sentiment_score > 0 ? '+' : ''}
                      {analysisResult.sentiment_score.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Scale: -1.00 (Crisis) to +1.00</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 font-medium block">Churn Risk Delta</span>
                    <span
                      className={`text-xl font-mono font-bold ${
                        analysisResult.churn_risk_delta > 0 ? 'text-[#9E2A2B]' : 'text-[#2E6B4E]'
                      }`}
                    >
                      {analysisResult.churn_risk_delta > 0 ? '+' : ''}
                      {(analysisResult.churn_risk_delta * 100).toFixed(0)}%
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Adjusted Prob: {(analysisResult.adjusted_probability * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Detected Keywords */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-700 block">
                    Extracted Friction & Intent Keywords (NLP Entity Mining)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.friction_keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Prescriptive Playbook */}
                <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#C77D2E] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Automated Retention Playbook Trigger</span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {analysisResult.recommended_playbook}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Select a sample review or enter text to run analysis.
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/reviews"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#12233D] hover:text-[#2E6B4E] transition-colors"
            >
              <span>Open Dedicated Customer Reviews Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-[11px] text-slate-400 font-medium">Persistent SQLite Storage</span>
          </div>
        </div>
      </div>
    </section>
  );
};
