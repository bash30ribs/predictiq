'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  MessageSquareQuote,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Search,
  Filter,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Clock,
  Send,
  Database,
} from 'lucide-react';
import { CustomerReviewAnalysisResponse, SentimentType } from '@/lib/types';
import { useAppStore } from '@/store/useAppStore';

interface StoredReview {
  id: number;
  customer_id: string;
  customer_name: string;
  review_text: string;
  sentiment: SentimentType;
  sentiment_score: number;
  churn_risk_delta: number;
  adjusted_probability: number;
  friction_keywords: string[];
  recommended_playbook: string;
  source: string;
  created_at: string;
}

const ACCOUNT_PRESETS = [
  { id: 'C1024', name: 'Apex Digital Labs' },
  { id: 'C1002', name: 'Starlight Media Group' },
  { id: 'C3005', name: 'Meridian Global Advisors' },
  { id: 'C1088', name: 'NexaCloud Systems' },
  { id: 'C1012', name: 'Horizon Financial Corp' },
];

const SAMPLE_TEMPLATES = [
  {
    label: 'Critical API Outage Escalation',
    text: 'We experienced 6 unresolved outage incidents this month with slow API latency. If this SLA failure continues into our contract renewal next month, we have decided to cancel and switch to an alternative vendor.',
  },
  {
    label: 'Pricing & Budget Friction',
    text: 'The software capability is good, but the recent monthly price increase feels too expensive and unsustainable for our quarterly budget. We need an annual discount or we must downsize seats.',
  },
  {
    label: 'Positive Expansion Praise',
    text: 'Our team is extremely impressed by the recent platform improvements and responsive support team. We are excited to renew our contract and expand our license by 50 additional seats next quarter.',
  },
];

export const ReviewSentimentAnalyzer: React.FC = () => {
  const { user, isEasyMode } = useAppStore();
  const [reviews, setReviews] = useState<StoredReview[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(true);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [filterSentiment, setFilterSentiment] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form State
  const [selectedAccount, setSelectedAccount] = useState(ACCOUNT_PRESETS[0]);
  const [source, setSource] = useState<string>('Support Ticket');
  const [reviewText, setReviewText] = useState<string>(SAMPLE_TEMPLATES[0].text);
  const [latestAnalysis, setLatestAnalysis] = useState<CustomerReviewAnalysisResponse | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoadingList(true);
      const userId = user?.id || 1;
      const res = await fetch(`/api/reviews?user_id=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [user?.id]);

  const handleAnalyzeAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    setAnalyzing(true);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/reviews/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: selectedAccount.id,
          customer_name: selectedAccount.name,
          review_text: reviewText,
          source,
          user_id: user?.id || 1,
          organization: user?.organization || 'Enterprise Org',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to analyze review');
      }

      const result: CustomerReviewAnalysisResponse = await res.json();
      setLatestAnalysis(result);
      setSuccessMessage(`Analysis complete! Stored in SQLite database for ${selectedAccount.name}.`);
      await fetchReviews();
    } catch (err: any) {
      alert(err.message || 'Error running NLP analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  // Aggregated KPIs
  const totalReviews = reviews.length;
  const criticalCount = reviews.filter((r) => r.sentiment === 'CRITICAL_FRICTION').length;
  const positiveCount = reviews.filter((r) => r.sentiment === 'POSITIVE').length;
  const avgSentiment =
    totalReviews > 0
      ? reviews.reduce((acc, r) => acc + (r.sentiment_score || 0), 0) / totalReviews
      : 0;

  // Filtered reviews
  const filteredReviews = reviews.filter((r) => {
    const matchesSentiment =
      filterSentiment === 'ALL' || r.sentiment === filterSentiment;
    const matchesSearch =
      r.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customer_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.review_text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSentiment && matchesSearch;
  });

  const renderSentimentBadge = (sentiment: SentimentType) => {
    switch (sentiment) {
      case 'CRITICAL_FRICTION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
            <AlertTriangle className="w-3 h-3 text-red-700" />
            {isEasyMode ? "Very Unhappy" : "Critical Friction"}
          </span>
        );
      case 'NEGATIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-700" />
            {isEasyMode ? "Frustrated" : "Negative"}
          </span>
        );
      case 'POSITIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            {isEasyMode ? "Happy & Satisfied" : "Positive"}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {isEasyMode ? "Neutral" : "Neutral"}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Easy Mode Banner */}
      {isEasyMode && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 via-amber-50/70 to-emerald-50 border border-amber-200/90 shadow-xs flex items-start gap-3.5 animate-fadeIn">
          <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-amber-800 text-sm font-bold shadow-2xs">
            💡
          </div>
          <div className="flex-1 text-xs">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>Easy Mode: Customer Tone Reader</span>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">Plain English</span>
            </div>
            <p className="text-slate-700 mt-1 leading-relaxed">
              In plain English: When customers leave reviews or talk to support, our AI reads their message and figures out: <strong>Are they happy or upset?</strong>, <strong>Will this make them cancel?</strong>, and <strong>What should you do today to help them?</strong>
            </p>
          </div>
        </div>
      )}

      {/* Top Header Banner */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/90 rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#12233D] text-white flex items-center justify-center font-bold text-sm">
              <MessageSquareQuote className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {isEasyMode
                ? `Customer Feedback Reader (${user?.organization || 'Your Team'})`
                : "Customer Voice & NLP Intelligence"}
            </h1>
            <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              {isEasyMode ? "Saved in Local Database" : "Live SQLite WAL"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl font-normal">
            {isEasyMode
              ? `Read what customers from ${user?.organization || 'your company'} are saying in support tickets and surveys, and get instant recommendations on how to keep them happy.`
              : "Ingest qualitative customer feedback (NPS surveys, Zendesk tickets, QBR logs). Extract customer friction drivers and adjust quantitative churn probabilities in real time."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={fetchReviews}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loadingList ? 'animate-spin' : ''}`} />}
          >
            {isEasyMode ? "Refresh List" : "Refresh Database"}
          </Button>
        </div>
      </div>

      {/* KPI Cards Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">
            {isEasyMode ? "Reviews Scanned" : "Audited Reviews"}
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalReviews}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {isEasyMode ? `Saved for ${user?.name || 'you'}` : "Stored in SQLite"}
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">
            {isEasyMode ? "Unhappy Customers" : "Critical Friction Signals"}
          </div>
          <div className="text-2xl font-bold text-[#9E2A2B] mt-1">{criticalCount}</div>
          <div className="text-[11px] text-red-600 mt-0.5">
            {isEasyMode ? "Needs quick help" : "Immediate intervention needed"}
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">
            {isEasyMode ? "Average Happiness" : "Avg Sentiment Score"}
          </div>
          <div
            className={`text-2xl font-bold mt-1 font-mono ${
              avgSentiment >= 0 ? 'text-[#2E6B4E]' : 'text-[#9E2A2B]'
            }`}
          >
            {avgSentiment > 0 ? '+' : ''}
            {avgSentiment.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {isEasyMode ? "(-1 is angry, +1 is happy)" : "Scale: -1.00 to +1.00"}
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">
            {isEasyMode ? "Ready to Buy More" : "Expansion Candidates"}
          </div>
          <div className="text-2xl font-bold text-[#2E6B4E] mt-1">{positiveCount}</div>
          <div className="text-[11px] text-emerald-600 mt-0.5">
            {isEasyMode ? "Happy customers" : "Upsell playbooks active"}
          </div>
        </div>
      </div>

      {/* Ingestion Sandbox & Real-Time Analyzer Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Ingestion Form */}
        <div className="lg:col-span-6 bg-white/85 backdrop-blur-xl border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C77D2E]" />
              <h2 className="text-sm font-bold text-slate-900">
                Ingest & Process Customer Feedback
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">NLP Classifier</span>
          </div>

          {/* Quick Template Switchers */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Quick Test Templates
            </label>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setReviewText(tmpl.text)}
                  className="text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium transition-colors"
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAnalyzeAndSave} className="space-y-4">
            {/* Account Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Target Customer Account
                </label>
                <select
                  value={selectedAccount.id}
                  onChange={(e) => {
                    const found = ACCOUNT_PRESETS.find((a) => a.id === e.target.value);
                    if (found) setSelectedAccount(found);
                  }}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-[#12233D] focus:ring-1 focus:ring-[#12233D] focus:outline-none bg-white text-slate-800"
                >
                  {ACCOUNT_PRESETS.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Feedback Source</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-[#12233D] focus:ring-1 focus:ring-[#12233D] focus:outline-none bg-white text-slate-800"
                >
                  <option value="Support Ticket">Zendesk / Support Ticket</option>
                  <option value="NPS Survey">NPS Survey Free-Text</option>
                  <option value="Executive QBR">Executive QBR Note</option>
                  <option value="Exit Survey">Cancellation Exit Survey</option>
                </select>
              </div>
            </div>

            {/* Review Text Body */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Customer Verbatim Feedback
              </label>
              <textarea
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Paste customer comments or ticket conversation here..."
                required
                className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:border-[#12233D] focus:ring-1 focus:ring-[#12233D] focus:outline-none bg-white text-slate-800 resize-none"
              />
            </div>

            {successMessage && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={analyzing || !reviewText.trim()}
              variant="primary"
              size="md"
              className="w-full shadow-xs"
              rightIcon={analyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            >
              {analyzing ? 'Processing NLP & Updating SQLite...' : 'Analyze Sentiment & Save to SQLite'}
            </Button>
          </form>
        </div>

        {/* Real-Time Extraction Result Card */}
        <div className="lg:col-span-6 bg-white/85 backdrop-blur-xl border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#12233D]" />
              <h2 className="text-sm font-bold text-slate-900">
                Live NLP Extraction & Churn Model Impact
              </h2>
            </div>
            {latestAnalysis && renderSentimentBadge(latestAnalysis.sentiment)}
          </div>

          {latestAnalysis ? (
            <div className="space-y-4">
              {/* Account Header */}
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-900">{latestAnalysis.customer_name}</div>
                  <div className="text-[11px] text-slate-500">Account ID: {latestAnalysis.customer_id}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Database Record ID</span>
                  <span className="text-xs font-mono font-bold text-slate-700">#{latestAnalysis.id}</span>
                </div>
              </div>

              {/* Metric Impact Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">NLP Sentiment Score</span>
                  <div
                    className={`text-xl font-bold font-mono mt-0.5 ${
                      latestAnalysis.sentiment_score < 0 ? 'text-[#9E2A2B]' : 'text-[#2E6B4E]'
                    }`}
                  >
                    {latestAnalysis.sentiment_score > 0 ? '+' : ''}
                    {latestAnalysis.sentiment_score.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Scale: -1.00 to +1.00</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">Churn Risk Delta</span>
                  <div
                    className={`text-xl font-bold font-mono mt-0.5 ${
                      latestAnalysis.churn_risk_delta > 0 ? 'text-[#9E2A2B]' : 'text-[#2E6B4E]'
                    }`}
                  >
                    {latestAnalysis.churn_risk_delta > 0 ? '+' : ''}
                    {(latestAnalysis.churn_risk_delta * 100).toFixed(0)}%
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Adjusted Prob: {(latestAnalysis.adjusted_probability * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Extracted Keywords */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-700 block">
                  Extracted Friction & Sentiment Drivers
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {latestAnalysis.friction_keywords.map((kw, i) => (
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
                  <span>Prescriptive Retention Intervention</span>
                </div>
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  {latestAnalysis.recommended_playbook}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center space-y-2">
              <Database className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-xs font-medium text-slate-500">
                No new review analyzed in this session yet.
              </div>
              <div className="text-[11px] text-slate-400">
                Click &quot;Analyze Sentiment & Save to SQLite&quot; to test the live model.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Review Audit Log Table */}
      <div className="bg-white/85 backdrop-blur-xl border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Audited Customer Feedback Repository
            </h2>
            <p className="text-xs text-slate-500">
              Persistent records retrieved from SQLite database (<code className="font-mono text-[11px]">frontend/data/predictiq.db</code>)
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search account or text..."
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:border-[#12233D] focus:outline-none"
              />
            </div>

            {/* Sentiment Filter */}
            <select
              value={filterSentiment}
              onChange={(e) => setFilterSentiment(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Sentiments</option>
              <option value="CRITICAL_FRICTION">Critical Friction</option>
              <option value="NEGATIVE">Negative</option>
              <option value="POSITIVE">Positive</option>
              <option value="NEUTRAL">Neutral</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                <th className="py-2.5 px-3">Account</th>
                <th className="py-2.5 px-3">Sentiment</th>
                <th className="py-2.5 px-3">Score / Delta</th>
                <th className="py-2.5 px-3">Customer Verbatim</th>
                <th className="py-2.5 px-3">Detected Keywords</th>
                <th className="py-2.5 px-3">Playbook Action</th>
                <th className="py-2.5 px-3">Source / Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No matching customer reviews found.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-900 whitespace-nowrap">
                      <div>{rev.customer_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{rev.customer_id}</div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {renderSentimentBadge(rev.sentiment)}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap font-mono font-semibold">
                      <div
                        className={
                          rev.sentiment_score < 0 ? 'text-[#9E2A2B]' : 'text-[#2E6B4E]'
                        }
                      >
                        Score: {rev.sentiment_score > 0 ? '+' : ''}
                        {rev.sentiment_score.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Δ: {rev.churn_risk_delta > 0 ? '+' : ''}
                        {(rev.churn_risk_delta * 100).toFixed(0)}%
                      </div>
                    </td>
                    <td className="py-3 px-3 max-w-xs truncate text-slate-700" title={rev.review_text}>
                      {rev.review_text}
                    </td>
                    <td className="py-3 px-3 max-w-[160px]">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(rev.friction_keywords) &&
                          rev.friction_keywords.slice(0, 2).map((k, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200"
                            >
                              {k}
                            </span>
                          ))}
                        {Array.isArray(rev.friction_keywords) && rev.friction_keywords.length > 2 && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            +{rev.friction_keywords.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 max-w-[200px] text-[11px] text-slate-600 truncate" title={rev.recommended_playbook}>
                      {rev.recommended_playbook}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-[11px] text-slate-500">
                      <div>{rev.source}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(rev.created_at).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
