'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ReviewSentimentAnalyzer } from '@/components/customer/ReviewSentimentAnalyzer';

export default function CustomerReviewsPage() {
  return (
    <AppShell>
      <ReviewSentimentAnalyzer />
    </AppShell>
  );
}
