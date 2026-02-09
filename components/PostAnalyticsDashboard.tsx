"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Globe, Monitor, Clock, TrendingUp, Users, Eye } from "lucide-react";

interface PostAnalyticsData {
  summary: {
    totalViews: number;
    uniqueVisitors: number;
    avgTimeOnPage: number;
    avgScrollDepth: number;
    completionRate: number;
    avgExitDepth: number;
  };
  countries: Array<{ country: string; countryCode: string; views: number }>;
  devices: Array<{ device: string; views: number }>;
  browsers: Array<{ browser: string; views: number }>;
  dailyViews: Array<{ date: string; views: number }>;
  topReferrers: Array<{ referrer: string; views: number }>;
}

const COLORS = ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

export function PostAnalyticsDashboard({ slug }: { slug: string }) {
  const [data, setData] = useState<PostAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [slug, days]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/posts/${slug}/analytics?days=${days}`);
      if (res.ok) {
        const analytics = await res.json();
        setData(analytics);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <GlassCard className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </GlassCard>
    );
  }

  if (!data) {
    return (
      <GlassCard className="p-6">
        <p className="text-muted-foreground">No analytics data available yet.</p>
      </GlassCard>
    );
  }

  const { summary, countries, devices, browsers, dailyViews, topReferrers } = data;

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex gap-2 flex-wrap">
        {[7, 30, 90].map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${days === d
              ? "bg-primary text-white"
              : "bg-muted hover:bg-muted/80"
              }`}
          >
            Last {d} days
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Eye className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Views</p>
              <p className="text-2xl font-bold">{summary.totalViews.toLocaleString()}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/10 rounded-lg">
              <Users className="text-cyan-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unique Visitors</p>
              <p className="text-2xl font-bold">{summary.uniqueVisitors.toLocaleString()}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <Clock className="text-emerald-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Time</p>
              <p className="text-2xl font-bold">
                {Math.floor(summary.avgTimeOnPage / 60)}:{String(Math.floor(summary.avgTimeOnPage % 60)).padStart(2, "0")}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <TrendingUp className="text-amber-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Scroll</p>
              <p className="text-2xl font-bold">{Math.round(summary.avgScrollDepth)}%</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/10 rounded-lg">
              <TrendingUp className="text-indigo-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completion</p>
              <p className="text-2xl font-bold">{Math.round(summary.completionRate || 0)}%</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-500/10 rounded-lg">
              <TrendingUp className="text-rose-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Exit</p>
              <p className="text-2xl font-bold">{Math.round(summary.avgExitDepth || 0)}%</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Daily Views Chart */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp size={20} className="text-primary" />
          Views Over Time
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyViews}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
            />
            <Legend />
            <Line type="monotone" dataKey="views" stroke="#4F46E5" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Countries */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Globe size={20} className="text-primary" />
            Top Countries
          </h3>
          <div className="space-y-3">
            {countries.slice(0, 8).map((country, index) => (
              <div key={country.country} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{country.countryCode !== "XX" ? `${country.countryCode}` : "🌍"}</span>
                  <span className="font-medium">{country.country}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full"
                      style={{
                        width: `${(country.views / countries[0].views) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="font-semibold w-12 text-right">{country.views}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Devices */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Monitor size={20} className="text-primary" />
            Device Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={devices}
                dataKey="views"
                nameKey="device"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {devices.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Browsers */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold mb-6">Top Browsers</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={browsers}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="browser" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
              />
              <Bar dataKey="views" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Top Referrers */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold mb-6">Top Referrers</h3>
          {topReferrers.length > 0 ? (
            <div className="space-y-3">
              {topReferrers.map((referrer) => (
                <div key={referrer.referrer} className="flex items-center justify-between">
                  <span className="font-medium truncate flex-1">{referrer.referrer}</span>
                  <span className="font-semibold ml-4">{referrer.views}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No referrer data available</p>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
