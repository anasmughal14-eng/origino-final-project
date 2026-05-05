"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { month: "Dec", inquiries: 12, conversion: 20, response: 91 },
  { month: "Jan", inquiries: 18, conversion: 24, response: 93 },
  { month: "Feb", inquiries: 22, conversion: 28, response: 95 },
  { month: "Mar", inquiries: 19, conversion: 31, response: 92 },
  { month: "Apr", inquiries: 27, conversion: 35, response: 96 },
  { month: "May", inquiries: 31, conversion: 38, response: 96 },
];

const metrics = [
  { label: "Response rate 30d", value: "96%", benchmark: "Platform avg 82%" },
  { label: "Avg response time", value: "5h", benchmark: "Target under 8h" },
  { label: "Inquiry to quote", value: "42%", benchmark: "Platform avg 31%" },
  { label: "Quote to order", value: "18%", benchmark: "Platform avg 14%" },
  { label: "Profile views 30d", value: "1,240", benchmark: "+18% vs last month" },
  { label: "Orders 30d", value: "2", benchmark: "$18,400 confirmed" },
];

const healthBreakdown = [
  { label: "Response rate", value: 29, max: 30 },
  { label: "Response speed", value: 18, max: 20 },
  { label: "Profile completeness", value: 18, max: 20 },
  { label: "Review rating", value: 13, max: 15 },
  { label: "Completion rate", value: 14, max: 15 },
];

export default function SellerPerformancePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const healthScore = healthBreakdown.reduce((total, item) => total + item.value, 0);

  return (
    <div>
      <div className="border-b border-[rgba(26,26,24,0.12)] pb-6">
        <p className="badge-patch mb-3">Seller health</p>
        <h1 className="text-4xl">Performance</h1>
        <p className="mt-2 max-w-3xl text-sm text-[#5a5a54]">Response rate, quote conversion, health score, and platform benchmarks from the original seller performance spec.</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {metrics.map((item) => (
          <div className="border p-5" key={item.label}>
            <p className="metric-numeral text-2xl">{item.value}</p>
            <p className="mt-1 text-sm">{item.label}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[#8a8a82]">{item.benchmark}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-80 border p-4">
            <h2 className="text-2xl">Monthly Inquiries</h2>
            {mounted && <ResponsiveContainer width="100%" height={240}><LineChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line dataKey="inquiries" stroke="#2d4a3e" /></LineChart></ResponsiveContainer>}
          </div>
          <div className="h-80 border p-4">
            <h2 className="text-2xl">Quote Conversion Rate</h2>
            {mounted && <ResponsiveContainer width="100%" height={240}><BarChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="conversion" fill="#2d4a3e" /></BarChart></ResponsiveContainer>}
          </div>
        </div>
        <aside className="border bg-[#f7f3ee] p-5">
          <p className="badge-patch">Health score</p>
          <p className="metric-numeral mt-4 text-5xl">{healthScore}</p>
          <p className="mt-2 text-sm text-[#5a5a54]">Score out of 100 using the response, completeness, rating, and completion formula.</p>
          <div className="mt-5 space-y-4">
            {healthBreakdown.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm"><span>{item.label}</span><span className="metric-numeral">{item.value}/{item.max}</span></div>
                <div className="mt-2 h-2 bg-[#ede7dc]"><div className="h-2 bg-[#2d4a3e]" style={{ width: `${(item.value / item.max) * 100}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="mt-5 border border-[#c8c3bc] p-4 text-sm text-[#5a5a54]">
            Tip: replying inside 4 hours increases inquiry conversion, so keep templates ready for repeat buyer questions.
          </div>
        </aside>
      </div>
    </div>
  );
}
