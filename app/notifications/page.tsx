// app/notifications/page.tsx
"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import AdminLayout from "../components/AdminLayout";

type Notification = {
  id: number;
  title: string;
  message: string;
  target: "all" | "specific" | "segment";
  targetUsers?: number[];
  targetSegment?: "active" | "inactive" | "new" | "premium";
  scheduled: boolean;
  scheduledTime?: string;
  status: "draft" | "scheduled" | "sent" | "failed";
  sentAt?: string;
  createdAt: string;
  opened: number;
  totalSent: number;
  platform: "all" | "android" | "ios" | "web";
  imageUrl?: string;
  deepLink?: string;
};

type UserSegment = {
  id: string;
  name: string;
  description: string;
  userCount: number;
  criteria: string;
};

type NotificationStats = {
  totalSent: number;
  totalOpened: number;
  openRate: number;
  scheduled: number;
  failed: number;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<"compose" | "history" | "segments">("compose");

  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
    target: "all" as "all" | "specific" | "segment",
    targetUsers: [] as number[],
    targetSegment: "active" as "active" | "inactive" | "new" | "premium",
    scheduled: false,
    scheduledTime: "",
    platform: "all" as "all" | "android" | "ios" | "web",
    imageUrl: "",
    deepLink: "",
  });

  const [userSegments, setUserSegments] = useState<UserSegment[]>([
    {
      id: "active",
      name: "Active Users",
      description: "Users active in the last 7 days",
      userCount: 1250,
      criteria: "last_active > 7 days ago"
    },
    {
      id: "inactive",
      name: "Inactive Users",
      description: "Users not active for 30+ days",
      userCount: 890,
      criteria: "last_active > 30 days ago"
    },
    {
      id: "new",
      name: "New Users",
      description: "Users who joined in the last 30 days",
      userCount: 340,
      criteria: "join_date > 30 days ago"
    },
    {
      id: "premium",
      name: "Premium Members",
      description: "Users with active premium subscriptions",
      userCount: 156,
      criteria: "subscription_status = active"
    },
    {
      id: "kenya",
      name: "Kenyan Users",
      description: "Users located in Kenya",
      userCount: 980,
      criteria: "country = Kenya"
    },
    {
      id: "international",
      name: "International Users",
      description: "Users outside Kenya",
      userCount: 670,
      criteria: "country != Kenya"
    }
  ]);

  const [stats, setStats] = useState<NotificationStats>({
    totalSent: 0,
    totalOpened: 0,
    openRate: 0,
    scheduled: 0,
    failed: 0
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockNotifications: Notification[] = [
        {
          id: 1,
          title: "New Matches Waiting!",
          message: "You have new potential matches in your area. Check them out now!",
          target: "all",
          scheduled: false,
          status: "sent",
          sentAt: "2024-01-15T14:30:00Z",
          createdAt: "2024-01-15T14:25:00Z",
          opened: 1240,
          totalSent: 2500,
          platform: "all",
          deepLink: "mpenzimatch://matches"
        },
        {
          id: 2,
          title: "Complete Your Profile",
          message: "Add more photos to get 3x more matches!",
          target: "segment",
          targetSegment: "new",
          scheduled: true,
          scheduledTime: "2024-01-16T10:00:00Z",
          status: "scheduled",
          createdAt: "2024-01-15T10:15:00Z",
          opened: 0,
          totalSent: 0,
          platform: "all"
        },
        {
          id: 3,
          title: "Weekend Special",
          message: "Get 50% off premium features this weekend only!",
          target: "segment",
          targetSegment: "inactive",
          scheduled: false,
          status: "sent",
          sentAt: "2024-01-14T09:00:00Z",
          createdAt: "2024-01-14T08:45:00Z",
          opened: 230,
          totalSent: 890,
          platform: "all",
          deepLink: "mpenzimatch://premium"
        },
        {
          id: 4,
          title: "Security Update",
          message: "Please update your app for the latest security features",
          target: "all",
          scheduled: false,
          status: "failed",
          createdAt: "2024-01-13T16:20:00Z",
          opened: 0,
          totalSent: 0,
          platform: "android"
        },
        {
          id: 5,
          title: "Event Invitation",
          message: "Join our virtual dating event this Friday at 8 PM!",
          target: "segment",
          targetSegment: "active",
          scheduled: false,
          status: "sent",
          sentAt: "2024-01-12T15:30:00Z",
          createdAt: "2024-01-12T15:00:00Z",
          opened: 890,
          totalSent: 1250,
          platform: "all",
          imageUrl: "https://example.com/event-image.jpg"
        }
      ];

      setNotifications(mockNotifications);
      
      // Calculate stats
      const totalSent = mockNotifications.reduce((sum, n) => sum + n.totalSent, 0);
      const totalOpened = mockNotifications.reduce((sum, n) => sum + n.opened, 0);
      const openRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
      const scheduled = mockNotifications.filter(n => n.status === 'scheduled').length;
      const failed = mockNotifications.filter(n => n.status === 'failed').length;

      setStats({
        totalSent,
        totalOpened,
        openRate,
        scheduled,
        failed
      });

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setNotificationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const sendNotification = async () => {
    if (!notificationForm.title || !notificationForm.message) {
      alert("Please fill in title and message");
      return;
    }

    setIsSending(true);

    try {
      // Simulate API call to Firebase
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newNotification: Notification = {
        id: notifications.length + 1,
        title: notificationForm.title,
        message: notificationForm.message,
        target: notificationForm.target,
        targetUsers: notificationForm.targetUsers,
        targetSegment: notificationForm.targetSegment,
        scheduled: notificationForm.scheduled,
        scheduledTime: notificationForm.scheduledTime,
        status: notificationForm.scheduled ? "scheduled" : "sent",
        sentAt: notificationForm.scheduled ? undefined : new Date().toISOString(),
        createdAt: new Date().toISOString(),
        opened: 0,
        totalSent: getEstimatedRecipients(),
        platform: notificationForm.platform,
        imageUrl: notificationForm.imageUrl,
        deepLink: notificationForm.deepLink
      };

      setNotifications(prev => [newNotification, ...prev]);
      setShowCreateModal(false);
      resetForm();

      // Update stats
      if (!notificationForm.scheduled) {
        setStats(prev => ({
          ...prev,
          totalSent: prev.totalSent + newNotification.totalSent,
          totalOpened: prev.totalOpened,
          openRate: prev.totalSent > 0 ? (prev.totalOpened / prev.totalSent) * 100 : 0
        }));
      } else {
        setStats(prev => ({
          ...prev,
          scheduled: prev.scheduled + 1
        }));
      }

      alert("Notification sent successfully!");
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification");
    } finally {
      setIsSending(false);
    }
  };

  const getEstimatedRecipients = () => {
    switch (notificationForm.target) {
      case "all":
        return 2500; // Total user count
      case "segment":
        const segment = userSegments.find(s => s.id === notificationForm.targetSegment);
        return segment?.userCount || 0;
      case "specific":
        return notificationForm.targetUsers?.length || 0;
      default:
        return 0;
    }
  };

  const resetForm = () => {
    setNotificationForm({
      title: "",
      message: "",
      target: "all",
      targetUsers: [],
      targetSegment: "active",
      scheduled: false,
      scheduledTime: "",
      platform: "all",
      imageUrl: "",
      deepLink: "",
    });
  };

  const cancelScheduledNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setStats(prev => ({ ...prev, scheduled: prev.scheduled - 1 }));
  };

  const getStatusColor = (status: Notification["status"]) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: Notification["status"]) => {
    switch (status) {
      case "sent":
        return "✅";
      case "scheduled":
        return "⏰";
      case "failed":
        return "❌";
      case "draft":
        return "📝";
      default:
        return "⚪";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateOpenRate = (opened: number, total: number) => {
    return total > 0 ? ((opened / total) * 100).toFixed(1) : "0.0";
  };

  const CreateNotificationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Send Notification</h2>
            <button
              onClick={() => setShowCreateModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Notification Content */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Content</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={notificationForm.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter notification title"
                    maxLength={65}
                  />
                  <p className="text-xs text-gray-500 mt-1">{notificationForm.title.length}/65 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    value={notificationForm.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter notification message"
                    maxLength={240}
                  />
                  <p className="text-xs text-gray-500 mt-1">{notificationForm.message.length}/240 characters</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={notificationForm.imageUrl}
                      onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deep Link (Optional)
                    </label>
                    <input
                      type="text"
                      value={notificationForm.deepLink}
                      onChange={(e) => handleInputChange("deepLink", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="mpenzimatch://screen"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Target Audience</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Send To
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "all", label: "All Users", count: 2500 },
                      { value: "segment", label: "Segment", count: getEstimatedRecipients() },
                      { value: "specific", label: "Specific Users", count: notificationForm.targetUsers?.length || 0 }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleInputChange("target", option.value)}
                        className={`p-3 border rounded-lg text-center transition-colors ${
                          notificationForm.target === option.value
                            ? "border-purple-500 bg-purple-50 text-purple-700"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.count} users</div>
                      </button>
                    ))}
                  </div>
                </div>

                {notificationForm.target === "segment" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User Segment
                    </label>
                    <select
                      value={notificationForm.targetSegment}
                      onChange={(e) => handleInputChange("targetSegment", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {userSegments.map(segment => (
                        <option key={segment.id} value={segment.id}>
                          {segment.name} ({segment.userCount} users)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {notificationForm.target === "specific" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User IDs (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="123, 456, 789"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onChange={(e) => handleInputChange("targetUsers", e.target.value.split(',').map(id => parseInt(id.trim())))}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Options */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Options</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Schedule Notification
                    </label>
                    <p className="text-sm text-gray-500">Send at a specific time instead of immediately</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInputChange("scheduled", !notificationForm.scheduled)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                      notificationForm.scheduled ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        notificationForm.scheduled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {notificationForm.scheduled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Schedule Time
                    </label>
                    <input
                      type="datetime-local"
                      value={notificationForm.scheduledTime}
                      onChange={(e) => handleInputChange("scheduledTime", e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform
                  </label>
                  <select
                    value={notificationForm.platform}
                    onChange={(e) => handleInputChange("platform", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Platforms</option>
                    <option value="android">Android Only</option>
                    <option value="ios">iOS Only</option>
                    <option value="web">Web Only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Preview & Send */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-900">Estimated Reach</h4>
                  <p className="text-sm text-gray-600">{getEstimatedRecipients().toLocaleString()} users</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowPreviewModal(true)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={sendNotification}
                    disabled={isSending || !notificationForm.title || !notificationForm.message}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? "Sending..." : notificationForm.scheduled ? "Schedule" : "Send Now"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PreviewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-sm w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-gray-900">Notification Preview</h3>
            <button
              onClick={() => setShowPreviewModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 text-white">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">MP</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-white">{notificationForm.title || "Notification Title"}</h4>
                  <span className="text-gray-400 text-xs">now</span>
                </div>
                <p className="text-gray-300 text-sm mt-1">
                  {notificationForm.message || "Notification message will appear here"}
                </p>
                {notificationForm.imageUrl && (
                  <div className="mt-2 bg-gray-700 rounded h-20 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Image Preview</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">This is how your notification will appear on user devices</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
        <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Notifications | MpenziMatch Admin</title>
        <meta name="description" content="Manage push notifications for MpenziMatch" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Push Notifications</h1>
              <p className="text-gray-600">Send messages to your users through Firebase</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Notification
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{stats.totalSent.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Sent</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{stats.totalOpened.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Opened</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{stats.openRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Open Rate</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">{stats.scheduled}</div>
            <div className="text-sm text-gray-600">Scheduled</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "compose", name: "Compose", icon: "✉️" },
                { id: "history", name: "History", icon: "📋" },
                { id: "segments", name: "Segments", icon: "👥" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "compose" && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📱</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Create a New Notification</h3>
                <p className="text-gray-600 mb-6">Send push notifications to engage with your users</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Compose Notification
                </button>
              </div>
            )}

            {activeTab === "history" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification History</h3>
                {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📨</div>
                    <p className="text-gray-600">No notifications sent yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
                                {getStatusIcon(notification.status)} {notification.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>To: {notification.target === 'all' ? 'All Users' : notification.targetSegment}</span>
                              <span>Platform: {notification.platform}</span>
                              {notification.sentAt && (
                                <span>Sent: {formatDate(notification.sentAt)}</span>
                              )}
                              {notification.scheduledTime && (
                                <span>Scheduled: {formatDate(notification.scheduledTime)}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {calculateOpenRate(notification.opened, notification.totalSent)}% Open Rate
                            </div>
                            <div className="text-xs text-gray-500">
                              {notification.opened.toLocaleString()}/{notification.totalSent.toLocaleString()} opened
                            </div>
                            {notification.status === 'scheduled' && (
                              <button
                                onClick={() => cancelScheduledNotification(notification.id)}
                                className="mt-2 text-red-600 hover:text-red-800 text-sm"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "segments" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Segments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userSegments.map((segment) => (
                    <div key={segment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h4 className="font-semibold text-gray-900 mb-2">{segment.name}</h4>
                      <p className="text-gray-600 text-sm mb-3">{segment.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{segment.userCount.toLocaleString()} users</span>
                        <button
                          onClick={() => {
                            setActiveTab("compose");
                            setShowCreateModal(true);
                            handleInputChange("target", "segment");
                            handleInputChange("targetSegment", segment.id as any);
                          }}
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          Send to Segment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {showCreateModal && <CreateNotificationModal />}
      {showPreviewModal && <PreviewModal />}
    </div>
    </AdminLayout>
  );
}