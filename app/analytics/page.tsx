// app/analytics/page.tsx
"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import AdminLayout from "../components/AdminLayout";

type AnalyticsData = {
  users: {
    total: number;
    newToday: number;
    active: number;
    verified: number;
    demographics: {
      ageGroups: { range: string; count: number; percentage: number }[];
      gender: { type: string; count: number; percentage: number }[];
      location: { country: string; count: number; percentage: number }[];
    };
    growth: { date: string; count: number }[];
  };
  engagement: {
    matches: { total: number; daily: number; trend: number };
    messages: { total: number; daily: number; trend: number };
    likes: { total: number; daily: number; trend: number };
    sessions: { average: number; trend: number };
    retention: { day1: number; day7: number; day30: number };
  };
  media: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    flagged: number;
    types: { type: string; count: number; percentage: number }[];
  };
  revenue: {
    total: number;
    monthly: number;
    subscriptions: { plan: string; count: number; revenue: number }[];
    growth: { month: string; revenue: number }[];
  };
  reports: {
    total: number;
    resolved: number;
    pending: number;
    types: { type: string; count: number; percentage: number }[];
    trending: { type: string; increase: number }[];
  };
  performance: {
    responseTime: number;
    uptime: number;
    errors: number;
    peakHours: { hour: string; users: number }[];
  };
};

type DateRange = "7d" | "30d" | "90d" | "1y" | "all";

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockData: AnalyticsData = {
        users: {
          total: 15427,
          newToday: 187,
          active: 3241,
          verified: 8923,
          demographics: {
            ageGroups: [
              { range: "18-24", count: 3214, percentage: 21 },
              { range: "25-34", count: 7856, percentage: 51 },
              { range: "35-44", count: 2890, percentage: 19 },
              { range: "45+", count: 1467, percentage: 9 }
            ],
            gender: [
              { type: "Male", count: 8234, percentage: 53 },
              { type: "Female", count: 6543, percentage: 42 },
              { type: "Other", count: 650, percentage: 4 }
            ],
            location: [
              { country: "Kenya", count: 6543, percentage: 42 },
              { country: "Nigeria", count: 3214, percentage: 21 },
              { country: "South Africa", count: 2890, percentage: 19 },
              { country: "Ghana", count: 1567, percentage: 10 },
              { country: "Other", count: 1213, percentage: 8 }
            ]
          },
          growth: [
            { date: "Jan 1", count: 12000 },
            { date: "Jan 8", count: 12500 },
            { date: "Jan 15", count: 13200 },
            { date: "Jan 22", count: 14000 },
            { date: "Jan 29", count: 15427 }
          ]
        },
        engagement: {
          matches: { total: 45231, daily: 1234, trend: 12 },
          messages: { total: 289456, daily: 5678, trend: 8 },
          likes: { total: 156789, daily: 3456, trend: 15 },
          sessions: { average: 8.2, trend: 5 },
          retention: { day1: 85, day7: 62, day30: 38 }
        },
        media: {
          total: 89234,
          approved: 72345,
          pending: 4567,
          rejected: 8923,
          flagged: 2345,
          types: [
            { type: "Profile Photos", count: 65432, percentage: 73 },
            { type: "Gallery Photos", count: 18765, percentage: 21 },
            { type: "Videos", count: 5037, percentage: 6 }
          ]
        },
        revenue: {
          total: 452300,
          monthly: 38750,
          subscriptions: [
            { plan: "Premium", count: 3456, revenue: 345600 },
            { plan: "Gold", count: 1234, revenue: 98700 },
            { plan: "Basic", count: 567, revenue: 8000 }
          ],
          growth: [
            { month: "Oct", revenue: 35200 },
            { month: "Nov", revenue: 36800 },
            { month: "Dec", revenue: 37500 },
            { month: "Jan", revenue: 38750 }
          ]
        },
        reports: {
          total: 2345,
          resolved: 1876,
          pending: 469,
          types: [
            { type: "Inappropriate Content", count: 892, percentage: 38 },
            { type: "Fake Profile", count: 567, percentage: 24 },
            { type: "Harassment", count: 345, percentage: 15 },
            { type: "Spam", count: 289, percentage: 12 },
            { type: "Other", count: 252, percentage: 11 }
          ],
          trending: [
            { type: "Fake Profile", increase: 25 },
            { type: "Spam", increase: 18 },
            { type: "Harassment", increase: 12 }
          ]
        },
        performance: {
          responseTime: 142,
          uptime: 99.8,
          errors: 23,
          peakHours: [
            { hour: "20:00", users: 2345 },
            { hour: "21:00", users: 2876 },
            { hour: "22:00", users: 3123 },
            { hour: "23:00", users: 2987 },
            { hour: "00:00", users: 2456 }
          ]
        }
      };

      setData(mockData);
      setIsLoading(false);
    };

    fetchAnalytics();
  }, [dateRange]);

  const downloadReport = (type: string) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `mpenzimatch-${type}-report-${timestamp}.csv`;
    
    // Simulate CSV data generation
    let csvContent = "";
    
    switch (type) {
      case "users":
        csvContent = "Age Group,Count,Percentage\n" +
          data?.users.demographics.ageGroups.map(g => `${g.range},${g.count},${g.percentage}%`).join("\n");
        break;
      case "engagement":
        csvContent = "Metric,Total,Daily,Trend\n" +
          `Matches,${data?.engagement.matches.total},${data?.engagement.matches.daily},${data?.engagement.matches.trend}%\n` +
          `Messages,${data?.engagement.messages.total},${data?.engagement.messages.daily},${data?.engagement.messages.trend}%\n` +
          `Likes,${data?.engagement.likes.total},${data?.engagement.likes.daily},${data?.engagement.likes.trend}%`;
        break;
      case "revenue":
        csvContent = "Plan,Subscribers,Revenue\n" +
          data?.revenue.subscriptions.map(s => `${s.plan},${s.count},$${s.revenue}`).join("\n");
        break;
      case "reports":
        csvContent = "Report Type,Count,Percentage\n" +
          data?.reports.types.map(t => `${t.type},${t.count},${t.percentage}%`).join("\n");
        break;
      default:
        csvContent = "Metric,Value\n" +
          `Total Users,${data?.users.total}\n` +
          `Active Users,${data?.users.active}\n` +
          `New Today,${data?.users.newToday}`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadFullReport = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `mpenzimatch-comprehensive-report-${timestamp}.pdf`;
    
    // Simulate PDF download
    alert(`Downloading comprehensive report: ${filename}`);
    // In real implementation, this would generate a PDF with all analytics data
  };

  const StatCard = ({ title, value, change, icon, color }: any) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value?.toLocaleString()}</p>
          {change && (
            <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↗' : '↘'} {Math.abs(change)}% from last period
            </p>
          )}
        </div>
        <div className={`text-2xl p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const ProgressBar = ({ percentage, color }: any) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full ${color}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>Analytics | MpenziMatch Admin</title>
          <meta name="description" content="Comprehensive analytics and reports" />
        </Head>

        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
                <p className="text-gray-600">Comprehensive insights and data analysis</p>
              </div>
              <div className="flex space-x-3">
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as DateRange)}
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                  <option value="all">All time</option>
                </select>
                <button
                  onClick={downloadFullReport}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  📊 Full Report
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl shadow-sm p-1 border border-gray-200 mb-6">
            <nav className="flex space-x-1">
              {["overview", "users", "engagement", "revenue", "reports", "performance"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    activeTab === tab
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && data && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Users"
                  value={data.users.total}
                  change={12}
                  icon="👥"
                  color="bg-blue-100 text-blue-600"
                />
                <StatCard
                  title="Active Users"
                  value={data.users.active}
                  change={8}
                  icon="🔥"
                  color="bg-green-100 text-green-600"
                />
                <StatCard
                  title="Daily Matches"
                  value={data.engagement.matches.daily}
                  change={15}
                  icon="💞"
                  color="bg-pink-100 text-pink-600"
                />
                <StatCard
                  title="Monthly Revenue"
                  value={`$${data.revenue.monthly.toLocaleString()}`}
                  change={5}
                  icon="💰"
                  color="bg-yellow-100 text-yellow-600"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Demographics */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">User Demographics</h3>
                    <button
                      onClick={() => downloadReport("users")}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                    >
                      📥 Export
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Age Groups</h4>
                      {data.users.demographics.ageGroups.map((group, index) => (
                        <div key={index} className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 w-16">{group.range}</span>
                          <div className="flex-1 mx-3">
                            <ProgressBar 
                              percentage={group.percentage} 
                              color="bg-purple-500"
                            />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">
                            {group.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Engagement Metrics */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Engagement Overview</h3>
                    <button
                      onClick={() => downloadReport("engagement")}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                    >
                      📥 Export
                    </button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "Matches", value: data.engagement.matches.total, trend: data.engagement.matches.trend },
                      { label: "Messages", value: data.engagement.messages.total, trend: data.engagement.messages.trend },
                      { label: "Likes", value: data.engagement.likes.total, trend: data.engagement.likes.trend },
                    ].map((metric, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">{metric.label}</span>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{metric.value.toLocaleString()}</div>
                          <div className={`text-sm ${metric.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {metric.trend >= 0 ? '+' : ''}{metric.trend}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reports Summary */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Reports Summary</h3>
                  <button
                    onClick={() => downloadReport("reports")}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    📥 Export
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{data.reports.total}</div>
                    <div className="text-sm text-red-700">Total Reports</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{data.reports.resolved}</div>
                    <div className="text-sm text-green-700">Resolved</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{data.reports.pending}</div>
                    <div className="text-sm text-yellow-700">Pending</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && data && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                  <div className="space-y-3">
                    {data.users.growth.map((point, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{point.date}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${(point.count / data.users.total) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-16 text-right">
                            {point.count.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Gender Distribution</h3>
                  {data.users.demographics.gender.map((item, index) => (
                    <div key={index} className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">{item.type}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Revenue Tab */}
          {activeTab === "revenue" && data && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Subscription Revenue</h3>
                  <button
                    onClick={() => downloadReport("revenue")}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    📥 Export
                  </button>
                </div>
                <div className="space-y-4">
                  {data.revenue.subscriptions.map((plan, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-gray-900">{plan.plan}</div>
                        <div className="text-sm text-gray-600">{plan.count} subscribers</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">${plan.revenue.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">
                          ${Math.round(plan.revenue / plan.count)} avg
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && data && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Types</h3>
                  {data.reports.types.map((type, index) => (
                    <div key={index} className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-600 flex-1">{type.type}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${type.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-16 text-right">
                          {type.count} ({type.percentage}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Reports</h3>
                  {data.reports.trending.map((trend, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg mb-3">
                      <span className="font-medium text-orange-800">{trend.type}</span>
                      <span className="text-sm font-bold text-orange-600">
                        +{trend.increase}% increase
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Download Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Reports</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => downloadReport("users")}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
              >
                <div className="text-2xl mb-2">👥</div>
                <div className="font-medium text-gray-900">User Report</div>
                <div className="text-sm text-gray-600">CSV</div>
              </button>
              <button
                onClick={() => downloadReport("engagement")}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
              >
                <div className="text-2xl mb-2">💬</div>
                <div className="font-medium text-gray-900">Engagement</div>
                <div className="text-sm text-gray-600">CSV</div>
              </button>
              <button
                onClick={() => downloadReport("revenue")}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
              >
                <div className="text-2xl mb-2">💰</div>
                <div className="font-medium text-gray-900">Revenue</div>
                <div className="text-sm text-gray-600">CSV</div>
              </button>
              <button
                onClick={() => downloadReport("reports")}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
              >
                <div className="text-2xl mb-2">📋</div>
                <div className="font-medium text-gray-900">Moderation</div>
                <div className="text-sm text-gray-600">CSV</div>
              </button>
            </div>
          </div>
        </main>
      </div>
    </AdminLayout>
  );
}