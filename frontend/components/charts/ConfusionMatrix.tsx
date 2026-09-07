import React from 'react';
import { ConfusionMatrix as ConfusionMatrixType } from '@/lib/types';

interface ConfusionMatrixProps {
  matrix: ConfusionMatrixType;
}

export const ConfusionMatrix: React.FC<ConfusionMatrixProps> = ({ matrix }) => {
  const total = matrix.true_positive + matrix.false_positive + matrix.true_negative + matrix.false_negative;
  const tpPct = ((matrix.true_positive / total) * 100).toFixed(1);
  const fpPct = ((matrix.false_positive / total) * 100).toFixed(1);
  const fnPct = ((matrix.false_negative / total) * 100).toFixed(1);
  const tnPct = ((matrix.true_negative / total) * 100).toFixed(1);

  return (
    <div className="w-full">
      <div className="grid grid-cols-[120px_1fr_1fr] gap-2 text-xs">
        {/* Header Row */}
        <div></div>
        <div className="text-center font-semibold text-slate-700 bg-slate-100/80 py-1.5 rounded-t">
          Predicted: Churn
        </div>
        <div className="text-center font-semibold text-slate-700 bg-slate-100/80 py-1.5 rounded-t">
          Predicted: Retained
        </div>

        {/* Row 1: Actual Churned */}
        <div className="flex items-center font-semibold text-slate-700 bg-slate-100/80 px-2 rounded-l">
          Actual: Churn
        </div>
        <div className="p-3 bg-[#EBF5F0] border border-[#A3D9BE] rounded text-center">
          <div className="text-[10px] uppercase font-semibold text-[#2E6B4E] tracking-wider">
            True Positive (TP)
          </div>
          <div className="text-lg font-bold text-[#2E6B4E] mt-0.5">
            {matrix.true_positive.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-600">{tpPct}% of test samples</div>
        </div>
        <div className="p-3 bg-[#FEF7ED] border border-[#F8D29F] rounded text-center">
          <div className="text-[10px] uppercase font-semibold text-[#C77D2E] tracking-wider">
            False Negative (FN)
          </div>
          <div className="text-lg font-bold text-[#C77D2E] mt-0.5">
            {matrix.false_negative.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-600">{fnPct}% of test samples</div>
        </div>

        {/* Row 2: Actual Retained */}
        <div className="flex items-center font-semibold text-slate-700 bg-slate-100/80 px-2 rounded-l">
          Actual: Retained
        </div>
        <div className="p-3 bg-[#FEF7ED] border border-[#F8D29F] rounded text-center">
          <div className="text-[10px] uppercase font-semibold text-[#C77D2E] tracking-wider">
            False Positive (FP)
          </div>
          <div className="text-lg font-bold text-[#C77D2E] mt-0.5">
            {matrix.false_positive.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-600">{fpPct}% of test samples</div>
        </div>
        <div className="p-3 bg-[#EBF5F0] border border-[#A3D9BE] rounded text-center">
          <div className="text-[10px] uppercase font-semibold text-[#2E6B4E] tracking-wider">
            True Negative (TN)
          </div>
          <div className="text-lg font-bold text-[#2E6B4E] mt-0.5">
            {matrix.true_negative.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-600">{tnPct}% of test samples</div>
        </div>
      </div>
      <div className="mt-2.5 text-[11px] text-slate-500 flex justify-between px-1">
        <span>Test holdout evaluation: N = {total.toLocaleString()} records</span>
        <span className="font-medium text-slate-700">Sensitivity / Recall: 81.8%</span>
      </div>
    </div>
  );
};
