import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PredictIQ | Churn Intelligence & Retention Dashboard",
  description: "Executive customer churn prediction, risk explainability, and retention strategy platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-50 antialiased">
      <body className="min-h-full flex flex-col font-sans text-slate-900 bg-slate-50">
        {children}
      </body>
    </html>
  );
}
