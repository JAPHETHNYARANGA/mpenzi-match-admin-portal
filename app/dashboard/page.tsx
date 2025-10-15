// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import AdminLayout from "../components/AdminLayout";

type DashboardStats = {
  totalUsers: number;
  activeUsersToday: number;
  activeUsersThisWeek: number;
  newSignups: number;
  reportsReceived: number;
  matchesMade: number;
  userGrowth: number;
  engagementRate: number;
  revenue: {
    total: number;
    monthly: number;
    daily: number;
    growth: number;
  };
  subscriptions: {
    premium: number;
    gold: number;
    basic: number;
    total: number;
  };
};

type Alert = {
  id: number;
  type: "warning" | "error" | "info" | "success";
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
};

type UserActivity = {
  date: string;
  users: number;
  matches: number;
  messages: number;
  revenue: number;
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsersToday: 0,
    activeUsersThisWeek: 0,
    newSignups: 0,
    reportsReceived: 0,
    matchesMade: 0,
    userGrowth: 0,
    engagementRate: 0,
    revenue: {
      total: 0,
      monthly: 0,
      daily: 0,
      growth: 0,
    },
    subscriptions: {
      premium: 0,
      gold: 0,
      basic: 0,
      total: 0,
    },
  });

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock stats data
      setStats({
        totalUsers: 15427,
        activeUsersToday: 1243,
        activeUsersThisWeek: 8562,
        newSignups: 187,
        reportsReceived: 23,
        matchesMade: 542,
        userGrowth: 12.5,
        engagementRate: 68.3,
        revenue: {
          total: 452300,
          monthly: 38750,
          daily: 1250,
          growth: 8.2,
        },
        subscriptions: {
          premium: 3456,
          gold: 1234,
          basic: 567,
          total: 5257,
        },
      });

      // Mock alerts
      setAlerts([
        {
          id: 1,
          type: "warning",
          title: "High Report Volume",
          message: "5 profiles reported in the last 2 hours",
          timestamp: "2024-01-15T14:30:00Z",
          resolved: false,
        },
        {
          id: 2,
          type: "error",
          title: "Server Latency",
          message: "API response times above threshold",
          timestamp: "2024-01-15T13:15:00Z",
          resolved: false,
        },
        {
          id: 3,
          type: "info",
          title: "System Update",
          message: "Scheduled maintenance tonight at 2 AM",
          timestamp: "2024-01-15T10:00:00Z",
          resolved: true,
        },
        {
          id: 4,
          type: "success",
          title: "Revenue Milestone",
          message: "Monthly revenue target achieved",
          timestamp: "2024-01-15T09:00:00Z",
          resolved: true,
        },
      ]);

      // Mock user activity data
      setUserActivity([
        { date: "Jan 8", users: 1200, matches: 450, messages: 3200, revenue: 1150 },
        { date: "Jan 9", users: 1350, matches: 520, messages: 3800, revenue: 1280 },
        { date: "Jan 10", users: 1420, matches: 480, messages: 4100, revenue: 1210 },
        { date: "Jan 11", users: 1560, matches: 610, messages: 4700, revenue: 1320 },
        { date: "Jan 12", users: 1680, matches: 590, messages: 5200, revenue: 1290 },
        { date: "Jan 13", users: 1720, matches: 630, messages: 5800, revenue: 1350 },
        { date: "Jan 14", users: 1840, matches: 670, messages: 6200, revenue: 1420 },
      ]);

      setIsLoading(false);
    };

    fetchDashboardData();
  }, [timeRange]);

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "error":
        return "🔴";
      case "warning":
        return "🟡";
      case "info":
        return "🔵";
      case "success":
        return "🟢";
      default:
        return "⚪";
    }
  };

  const getAlertColor = (type: Alert["type"]) => {
    switch (type) {
      case "error":
        return "border-red-200 bg-red-50";
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      case "info":
        return "border-blue-200 bg-blue-50";
      case "success":
        return "border-green-200 bg-green-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const resolveAlert = (alertId: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <AdminLayout> 
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout> 
      <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Admin Dashboard | MpenziMatch</title>
        <meta name="description" content="MpenziMatch Admin Dashboard" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, Administrator</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+{stats.userGrowth}%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">🔥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsersToday.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              {stats.activeUsersThisWeek.toLocaleString()} this week
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.revenue.monthly)}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+{stats.revenue.growth}%</span>
              <span className="text-gray-500 ml-1">growth</span>
            </div>
          </div>

          {/* Matches Made */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-pink-100 rounded-lg">
                <span className="text-2xl">💞</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Matches Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.matchesMade}</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              {stats.newSignups} new signups today
            </div>
          </div>
        </div>

        {/* Second Row - Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Subscription Metrics */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Premium Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.subscriptions.premium.toLocaleString()}</p>
              </div>
              <span className="text-2xl">⭐</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {Math.round((stats.subscriptions.premium / stats.subscriptions.total) * 100)}% of total
            </div>
          </div>

          {/* Daily Revenue */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Daily Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.revenue.daily)}</p>
              </div>
              <span className="text-2xl">📈</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Average per day
            </div>
          </div>

          {/* Total Subscriptions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.subscriptions.total.toLocaleString()}</p>
              </div>
              <span className="text-2xl">📋</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {Math.round((stats.subscriptions.total / stats.totalUsers) * 100)}% conversion
            </div>
          </div>

          {/* Reports */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reports Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.reportsReceived}</p>
              </div>
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="mt-2 text-sm text-red-600 font-medium">
              Requires attention
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Growth Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Platform Activity</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setTimeRange("7d")}
                    className={`px-3 py-1 text-sm rounded-lg ${
                      timeRange === "7d"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    7D
                  </button>
                  <button
                    onClick={() => setTimeRange("30d")}
                    className={`px-3 py-1 text-sm rounded-lg ${
                      timeRange === "30d"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    30D
                  </button>
                  <button
                    onClick={() => setTimeRange("90d")}
                    className={`px-3 py-1 text-sm rounded-lg ${
                      timeRange === "90d"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    90D
                  </button>
                </div>
              </div>
              
              {/* Simple Bar Chart */}
              <div className="h-64">
                <div className="flex items-end justify-between h-48 space-x-1">
                  {userActivity.map((day, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="text-xs text-gray-500 mb-2">{day.date}</div>
                      <div className="flex space-x-1 w-full justify-center">
                        <div 
                          className="bg-blue-500 rounded-t w-1/4"
                          style={{ height: `${(day.users / 2000) * 100}%` }}
                          title={`Users: ${day.users}`}
                        ></div>
                        <div 
                          className="bg-green-500 rounded-t w-1/4"
                          style={{ height: `${(day.matches / 800) * 100}%` }}
                          title={`Matches: ${day.matches}`}
                        ></div>
                        <div 
                          className="bg-purple-500 rounded-t w-1/4"
                          style={{ height: `${(day.messages / 7000) * 100}%` }}
                          title={`Messages: ${day.messages}`}
                        ></div>
                        <div 
                          className="bg-yellow-500 rounded-t w-1/4"
                          style={{ height: `${(day.revenue / 2000) * 100}%` }}
                          title={`Revenue: ${formatCurrency(day.revenue)}`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                    <span className="text-xs text-gray-600">Users</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                    <span className="text-xs text-gray-600">Matches</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
                    <span className="text-xs text-gray-600">Messages</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                    <span className="text-xs text-gray-600">Revenue</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue & Engagement Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Total Revenue</span>
                      <span className="text-lg font-bold text-gray-900">{formatCurrency(stats.revenue.total)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Monthly</span>
                      <span className="font-medium text-gray-900">{formatCurrency(stats.revenue.monthly)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Daily Average</span>
                      <span className="font-medium text-gray-900">{formatCurrency(stats.revenue.daily)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h2>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{stats.engagementRate}%</div>
                    <div className="text-sm text-gray-600 mt-1">Engagement Rate</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${stats.engagementRate}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-gray-900">{stats.subscriptions.total}</div>
                      <div className="text-xs text-gray-600">Subscribers</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-900">{stats.matchesMade}</div>
                      <div className="text-xs text-gray-600">Matches Today</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Alerts & Quick Actions */}
          <div className="space-y-6">
            {/* Alerts Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">System Alerts</h2>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {alerts.filter(a => !a.resolved).length} Active
                </span>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`border rounded-lg p-4 ${getAlertColor(alert.type)} ${
                      alert.resolved ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <span className="text-lg mt-0.5">{getAlertIcon(alert.type)}</span>
                        <div className="flex-1">
                          <h3 className={`font-medium ${
                            alert.resolved ? "text-gray-600" : "text-gray-900"
                          }`}>
                            {alert.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {!alert.resolved && (
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="text-gray-400 hover:text-gray-600 text-sm flex-shrink-0 ml-2"
                        >
                          Mark as resolved
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => window.location.href = '/users'}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <div className="font-medium text-gray-900 group-hover:text-purple-600">Manage Users</div>
                  <div className="text-sm text-gray-600">View and manage user accounts</div>
                </button>
                <button 
                  onClick={() => window.location.href = '/media'}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <div className="font-medium text-gray-900 group-hover:text-purple-600">Media Moderation</div>
                  <div className="text-sm text-gray-600">Review photos and videos</div>
                </button>
                <button 
                  onClick={() => window.location.href = '/analytics'}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <div className="font-medium text-gray-900 group-hover:text-purple-600">Analytics</div>
                  <div className="text-sm text-gray-600">Detailed platform analytics</div>
                </button>
                <button 
                  onClick={() => window.location.href = '/reports'}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <div className="font-medium text-gray-900 group-hover:text-purple-600">Revenue Reports</div>
                  <div className="text-sm text-gray-600">View financial reports</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </AdminLayout>
  );
}