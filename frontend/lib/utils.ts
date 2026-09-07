import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number, decimals: number = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export function formatPercent(value: number, decimals: number = 1): string {
  // If value is between 0 and 1, multiply by 100
  const normalized = value > 1 ? value : value * 100;
  return `${normalized.toFixed(decimals)}%`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function getRiskColorStyles(level: 'LOW' | 'MEDIUM' | 'HIGH') {
  switch (level) {
    case 'LOW':
      return {
        badge: 'bg-[#EBF5F0] text-[#2E6B4E] border-[#A3D9BE]',
        text: 'text-[#2E6B4E]',
        border: 'border-[#A3D9BE]',
        bg: 'bg-[#EBF5F0]',
        dot: 'bg-[#2E6B4E]',
        hex: '#2E6B4E',
      };
    case 'MEDIUM':
      return {
        badge: 'bg-[#FEF7ED] text-[#C77D2E] border-[#F8D29F]',
        text: 'text-[#C77D2E]',
        border: 'border-[#F8D29F]',
        bg: 'bg-[#FEF7ED]',
        dot: 'bg-[#C77D2E]',
        hex: '#C77D2E',
      };
    case 'HIGH':
    default:
      return {
        badge: 'bg-[#FDF2F2] text-[#9E2A2B] border-[#F5B8B9]',
        text: 'text-[#9E2A2B]',
        border: 'border-[#F5B8B9]',
        bg: 'bg-[#FDF2F2]',
        dot: 'bg-[#9E2A2B]',
        hex: '#9E2A2B',
      };
  }
}
