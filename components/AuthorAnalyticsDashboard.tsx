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
import { Globe, Eye, Users, Clock, TrendingUp, FileText, Monitor } from "lucide-react";
import Link from "next/link";

interface AuthorAnalyticsData {
  summary: {
    totalPosts: number;
    totalViews: number;
    uniqueVisitors: number;
    avgTimeOnPage: number;
    avgScrollDepth: number;
  };
  countries: Array<{ country: string; countryCode: string; views: number }>;
  devices: Array<{ device: string; views: number }>;
  browsers: Array<{ browser: string; views: number }>;
  dailyViews: Array<{ date: string; views: number }>;
  topPosts: Array<{
    slug: string;
    title: string;
    views: number;
    avgTimeOnPage: number;
    avgScrollDepth: number;
  }>;
}

const COLORS = ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

export function AuthorAnalyticsDashboard() {
  const [data, setData] = useState<AuthorAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/author/analytics?days=${days}`);
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
      <div className="space-y-6">
        <GlassCard className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (!data) {
    return (
      <GlassCard className="p-6">
        <p className="text-muted-foreground">No analytics data available yet. Start publishing posts!</p>
      </GlassCard>
    );
  }

  const { summary, countries, devices, browsers, dailyViews, topPosts } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Your Analytics</h2>
          <p className="text-muted-foreground mt-1">Track your content performance across all posts</p>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2 flex-wrap">
        {[7, 30, 90].map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              days === d
                ? "bg-primary text-white"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            Last {d} days
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Posts</p>
              <p className="text-2xl font-bold">{summary.totalPosts}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Eye className="text-purple-600" size={24} />
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

      {/* Top Posts */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold mb-6">Top Performing Posts</h3>
        <div className="space-y-4">
          {topPosts.map((post, index) => (
            <div key={post.slug} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="text-2xl font-bold text-primary w-8">{index + 1}</div>
              <div className="flex-1">
                <Link href={`/blog/${post.slug}`} className="font-semibold hover:text-primary transition-colors">
                  {post.title}
                </Link>
                <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye size={14} />
                    {post.views.toLocaleString()} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {Math.floor(post.avgTimeOnPage / 60)}m {Math.floor(post.avgTimeOnPage % 60)}s
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp size={14} />
                    {Math.round(post.avgScrollDepth)}% scroll
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Distribution */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Globe size={20} className="text-primary" />
            Geographic Distribution
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {countries.map((country, index) => (
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

        {/* Device & Browser Stats */}
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Monitor size={20} className="text-primary" />
              Device Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={devices}
                  dataKey="views"
                  nameKey="device"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
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

          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-6">Top Browsers</h3>
            <div className="space-y-2">
              {browsers.map((browser, index) => (
                <div key={browser.browser} className="flex items-center justify-between">
                  <span className="font-medium">{browser.browser}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          width: `${(browser.views / browsers[0].views) * 100}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>
                    </div>
                    <span className="font-semibold w-12 text-right">{browser.views}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
