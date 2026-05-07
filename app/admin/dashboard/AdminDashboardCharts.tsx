"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ActivityPoint = { label: string; value: number };
type RiskPoint = { label: string; value: number; color: string };
type RevenuePoint = { label: string; value: number };

type AdminMetrics = {
  suppliers: number;
  products: number;
  orders: number;
  quotes: number;
  inquiries: number;
  revenue: number;
  pendingApplications?: number;
};

type Props = {
  activity: ActivityPoint[];
  risk: RiskPoint[];
  revenue: RevenuePoint[];
  lastUpdatedLabel: string;
};

type ApiResponse = { success: boolean; data?: AdminMetrics; error?: string };

function money(value: number) {
  return `$${value.toLocaleString()}`;
}

export function AdminDashboardCharts({ activity, risk, revenue, lastUpdatedLabel }: Props) {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activityData = useMemo(() => {
    if (!metrics) return activity;
    return [
      { label: "Suppliers", value: metrics.suppliers },
      { label: "Products", value: metrics.products },
      { label: "Orders", value: metrics.orders },
      { label: "Quotes", value: metrics.quotes },
      { label: "Inquiries", value: metrics.inquiries },
      { label: "Pending apps", value: metrics.pendingApplications ?? 0 },
    ];
  }, [activity, metrics]);

  const revenueData = useMemo(() => {
    if (!metrics) return revenue;
    const base = Math.max(metrics.revenue, 1);
    return [
      { label: "Pipeline", value: Math.round(base * 0.42) },
      { label: "Escrow", value: Math.round(base * 0.29) },
      { label: "GMV", value: base },
    ];
  }, [metrics, revenue]);

  async function refresh() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/metrics", { cache: "no-store" });
      const json = (await response.json()) as ApiResponse;
      if (json.success && json.data) setMetrics(json.data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="dashboard-card p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl">Command Centre Trends</h2>
            <p className="mt-1 text-sm text-[#5a5a54]">Live admin metrics from the current data layer.</p>
          </div>
          <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={refresh} disabled={loading} type="button">
            {loading ? "Refreshing..." : "Refresh Metrics"}
          </button>
        </div>
        <div className="mt-6 h-[260px]">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid stroke="rgba(26,26,24,0.1)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#5a5a54", fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "#5a5a54", fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: "rgba(82,101,63,0.08)" }} />
                <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="#52653f" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full rounded-[24px] bg-[rgba(82,101,63,0.08)]" />
          )}
        </div>
      </div>

      <div className="dashboard-card p-4 sm:p-5">
        <h2 className="text-2xl sm:text-3xl">Risk Mix</h2>
        <p className="mt-1 text-sm text-[#5a5a54]">Open queues by operational pressure.</p>
        <div className="mt-6 h-[260px]">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={risk} dataKey="value" nameKey="label" innerRadius={58} outerRadius={92} paddingAngle={3}>
                  {risk.map((entry) => (
                    <Cell fill={entry.color} key={entry.label} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full rounded-[24px] bg-[rgba(82,101,63,0.08)]" />
          )}
        </div>
        <div className="grid gap-2">
          {risk.map((item) => (
            <div className="flex items-center justify-between text-sm" key={item.label}>
              <span>{item.label}</span>
              <span className="metric-numeral">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-card p-4 sm:p-5 xl:col-span-2">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl">Commercial Exposure</h2>
            <p className="mt-1 text-sm text-[#5a5a54]">Pipeline, escrow, and GMV signals for finance review.</p>
          </div>
          <p className="small-caps text-xs">Updated {lastUpdatedLabel}</p>
        </div>
        <div className="mt-6 h-[260px]">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid stroke="rgba(26,26,24,0.1)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#5a5a54", fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis
                  tick={{ fill: "#5a5a54", fontSize: 12 }}
                  tickFormatter={(value) => money(Number(value))}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip formatter={(value) => money(Number(value))} />
                <Line type="monotone" dataKey="value" stroke="#52653f" strokeWidth={3} dot={{ r: 5, fill: "#52653f" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full rounded-[24px] bg-[rgba(82,101,63,0.08)]" />
          )}
        </div>
      </div>
    </section>
  );
}
