'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UploadCloud,
  Cpu,
  Users,
  Sliders,
  TrendingDown,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    label: "Executive Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    label: "Customer Risk Directory",
    href: "/customers",
    icon: Users,
    badge: "864 at-risk",
  },
  {
    label: "What-If Simulator",
    href: "/simulation",
    icon: Sliders,
    badge: null,
  },
  {
    label: "Revenue at Risk & ROI",
    href: "/impact",
    icon: TrendingDown,
    badge: "$412k MRR",
  },
  {
    label: "Dataset Upload & Audit",
    href: "/upload",
    icon: UploadCloud,
    badge: null,
  },
  {
    label: "Model Training & Eval",
    href: "/training",
    icon: Cpu,
    badge: "v2.1",
  },
];

export const AppSidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#12233D] text-slate-300 flex flex-col shrink-0 min-h-screen select-none border-r border-[#0a1424]">
      {/* Brand Header */}
      <div className="h-14 flex items-center px-5 border-b border-white/10 gap-2.5">
        <div className="w-7 h-7 rounded bg-white text-[#12233D] flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
          P
        </div>
        <div>
          <span className="font-semibold text-white tracking-tight text-sm">PredictIQ</span>
          <span className="ml-1.5 text-[10px] text-slate-400 font-normal uppercase tracking-wider">Enterprise</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Decision Intelligence
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors group",
                isActive
                  ? "bg-white/12 text-white shadow-xs font-semibold"
                  : "text-slate-300 hover:bg-white/8 hover:text-white"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-medium",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-white/8 text-slate-300 group-hover:bg-white/15"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Model & System Status in Sidebar Footer */}
      <div className="p-3 m-3 rounded-md bg-white/5 border border-white/10 text-xs">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A3D9BE]" />
            ML Engine Status
          </span>
          <span className="w-2 h-2 rounded-full bg-[#A3D9BE]" />
        </div>
        <div className="text-[11px] text-slate-400">
          Model: <span className="text-white font-medium">XGBoost v2.1</span>
        </div>
        <div className="text-[11px] text-slate-400">
          ROC-AUC: <span className="text-white font-medium">0.923</span>
        </div>
      </div>
    </aside>
  );
};
