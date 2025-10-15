// app/media/page.tsx
"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import AdminLayout from "../components/AdminLayout";

type MediaItem = {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  type: "image" | "video";
  url: string;
  status: "pending" | "approved" | "rejected" | "flagged";
  uploadedAt: string;
  aiScore?: number;
  rejectionReason?: string;
  userAge: number;
  userGender: string;
  // Dating-specific fields
  userProfileId: string;
  isProfilePicture: boolean;
  mediaPosition: number;
  reports?: number;
  userVerificationStatus: "verified" | "pending" | "unverified";
  datingPreferences?: string;
  lastActive?: string;
};

type FilterOptions = {
  status: string;
  type: string;
  dateRange: string;
  verification: string;
  reports: string;
  profilePicture: string;
};

export default function MediaManagement() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [bulkAction, setBulkAction] = useState("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [aiScanning, setAiScanning] = useState(false);

  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
    type: "all",
    dateRange: "all",
    verification: "all",
    reports: "all",
    profilePicture: "all"
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchMedia = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockMedia: MediaItem[] = [
        {
          id: 1,
          userId: 101,
          userName: "Sarah Johnson",
          userEmail: "sarah.j@example.com",
          type: "image",
          url: "/images/profile1.jpg",
          status: "approved",
          uploadedAt: "2024-01-15T10:30:00Z",
          aiScore: 0.95,
          userAge: 28,
          userGender: "female",
          userProfileId: "profile_101",
          isProfilePicture: true,
          mediaPosition: 1,
          reports: 0,
          userVerificationStatus: "verified",
          datingPreferences: "Men, 25-35, Serious relationships",
          lastActive: "2024-01-15T14:20:00Z"
        },
        {
          id: 2,
          userId: 102,
          userName: "Mike Chen",
          userEmail: "mike.chen@example.com",
          type: "image",
          url: "/images/profile2.jpg",
          status: "pending",
          uploadedAt: "2024-01-15T14:20:00Z",
          aiScore: 0.78,
          userAge: 32,
          userGender: "male",
          userProfileId: "profile_102",
          isProfilePicture: true,
          mediaPosition: 1,
          reports: 2,
          userVerificationStatus: "pending",
          datingPreferences: "Women, 25-30, Long-term",
          lastActive: "2024-01-15T12:30:00Z"
        },
        {
          id: 3,
          userId: 103,
          userName: "Emily Davis",
          userEmail: "emily.d@example.com",
          type: "video",
          url: "/videos/intro1.mp4",
          status: "flagged",
          uploadedAt: "2024-01-14T16:45:00Z",
          aiScore: 0.35,
          userAge: 25,
          userGender: "female",
          userProfileId: "profile_103",
          isProfilePicture: false,
          mediaPosition: 3,
          reports: 5,
          userVerificationStatus: "unverified",
          datingPreferences: "Men, 24-32, Casual dating",
          lastActive: "2024-01-14T18:20:00Z"
        },
        {
          id: 4,
          userId: 104,
          userName: "Alex Rodriguez",
          userEmail: "alex.r@example.com",
          type: "image",
          url: "/images/profile3.jpg",
          status: "rejected",
          uploadedAt: "2024-01-14T09:15:00Z",
          aiScore: 0.42,
          rejectionReason: "Inappropriate content",
          userAge: 35,
          userGender: "male",
          userProfileId: "profile_104",
          isProfilePicture: true,
          mediaPosition: 1,
          reports: 3,
          userVerificationStatus: "verified",
          datingPreferences: "Women, 28-40, Marriage minded",
          lastActive: "2024-01-14T10:45:00Z"
        },
        {
          id: 5,
          userId: 105,
          userName: "Jessica Williams",
          userEmail: "jessica.w@example.com",
          type: "image",
          url: "/images/profile4.jpg",
          status: "approved",
          uploadedAt: "2024-01-13T11:30:00Z",
          aiScore: 0.92,
          userAge: 29,
          userGender: "female",
          userProfileId: "profile_105",
          isProfilePicture: false,
          mediaPosition: 2,
          reports: 0,
          userVerificationStatus: "verified",
          datingPreferences: "Men, 30-40, Serious relationships",
          lastActive: "2024-01-15T09:15:00Z"
        },
        {
          id: 6,
          userId: 106,
          userName: "David Kim",
          userEmail: "david.kim@example.com",
          type: "video",
          url: "/videos/intro2.mp4",
          status: "pending",
          uploadedAt: "2024-01-15T08:45:00Z",
          aiScore: 0.85,
          userAge: 31,
          userGender: "male",
          userProfileId: "profile_106",
          isProfilePicture: false,
          mediaPosition: 4,
          reports: 1,
          userVerificationStatus: "verified",
          datingPreferences: "Women, 25-35, Friendship first",
          lastActive: "2024-01-15T16:30:00Z"
        },
        {
          id: 7,
          userId: 107,
          userName: "Amanda Smith",
          userEmail: "amanda.s@example.com",
          type: "image",
          url: "/images/profile5.jpg",
          status: "pending",
          uploadedAt: "2024-01-15T11:20:00Z",
          aiScore: 0.67,
          userAge: 26,
          userGender: "female",
          userProfileId: "profile_107",
          isProfilePicture: true,
          mediaPosition: 1,
          reports: 0,
          userVerificationStatus: "unverified",
          datingPreferences: "Men, 25-35, Casual",
          lastActive: "2024-01-15T13:45:00Z"
        }
      ];

      setMedia(mockMedia);
      setFilteredMedia(mockMedia);
      setIsLoading(false);
    };

    fetchMedia();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = media;

    if (filters.status !== "all") {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    if (filters.type !== "all") {
      filtered = filtered.filter(item => item.type === filters.type);
    }

    if (filters.verification !== "all") {
      filtered = filtered.filter(item => item.userVerificationStatus === filters.verification);
    }

    if (filters.reports !== "all") {
      if (filters.reports === "reported") {
        filtered = filtered.filter(item => (item.reports || 0) > 0);
      } else if (filters.reports === "none") {
        filtered = filtered.filter(item => (item.reports || 0) === 0);
      }
    }

    if (filters.profilePicture !== "all") {
      filtered = filtered.filter(item => 
        filters.profilePicture === "profile" ? item.isProfilePicture : !item.isProfilePicture
      );
    }

    setFilteredMedia(filtered);
  }, [media, filters]);

  const getStatusColor = (status: MediaItem["status"]) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "flagged":
        return "bg-orange-100 text-orange-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: MediaItem["status"]) => {
    switch (status) {
      case "approved":
        return "✅";
      case "pending":
        return "⏳";
      case "flagged":
        return "🚩";
      case "rejected":
        return "❌";
      default:
        return "⚪";
    }
  };

  const getVerificationColor = (status: MediaItem["userVerificationStatus"]) => {
    switch (status) {
      case "verified":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "unverified":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getAiScoreColor = (score: number) => {
    if (score >= 0.8) return "text-green-600";
    if (score >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const handleApprove = (mediaId: number) => {
    setMedia(prev => prev.map(item =>
      item.id === mediaId ? { ...item, status: "approved" } : item
    ));
    setShowModal(false);
  };

  const handleReject = (mediaId: number, reason: string) => {
    setMedia(prev => prev.map(item =>
      item.id === mediaId ? { ...item, status: "rejected", rejectionReason: reason } : item
    ));
    setShowModal(false);
  };

  const handleBulkAction = () => {
    if (!bulkAction || selectedItems.length === 0) return;

    switch (bulkAction) {
      case "approve":
        setMedia(prev => prev.map(item =>
          selectedItems.includes(item.id) ? { ...item, status: "approved" } : item
        ));
        break;
      case "reject":
        setMedia(prev => prev.map(item =>
          selectedItems.includes(item.id) ? { ...item, status: "rejected", rejectionReason: "Bulk rejection" } : item
        ));
        break;
      case "delete":
        setMedia(prev => prev.filter(item => !selectedItems.includes(item.id)));
        setFilteredMedia(prev => prev.filter(item => !selectedItems.includes(item.id)));
        break;
    }

    setSelectedItems([]);
    setBulkAction("");
  };

  const runAiScan = async () => {
    setAiScanning(true);
    // Simulate AI scanning process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Update AI scores randomly for demo
    setMedia(prev => prev.map(item => ({
      ...item,
      aiScore: Math.random()
    })));
    
    setAiScanning(false);
  };

  const toggleItemSelection = (itemId: number) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAllItems = () => {
    if (selectedItems.length === filteredMedia.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredMedia.map(item => item.id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewProfile = (userId: number) => {
    // Navigate to user profile in admin
    window.open(`/admin/users/${userId}`, '_blank');
  };

  const handleSuspendUser = (userId: number, userName: string) => {
    if (confirm(`Suspend user account for ${userName}? This will hide their profile and prevent matching.`)) {
      // API call to suspend user
      console.log('Suspending user:', userId);
      // Implement actual suspension logic here
    }
  };

  const handleVerifyUser = (userId: number) => {
    setMedia(prev => prev.map(item =>
      item.userId === userId ? { ...item, userVerificationStatus: "verified" } : item
    ));
  };

  const MediaModal = () => {
    if (!selectedMedia) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Media Review</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Media Preview */}
              <div className="space-y-6">
                <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
                  {selectedMedia.type === "image" ? (
                    <img
                      src={selectedMedia.url}
                      alt="User media"
                      className="max-w-full max-h-96 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-center p-8">
                      <div className="text-6xl mb-4">🎥</div>
                      <p className="text-gray-600">Video Preview</p>
                      <p className="text-sm text-gray-500 mt-2">{selectedMedia.url}</p>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-gray-700">AI Confidence</label>
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            (selectedMedia.aiScore || 0) >= 0.8 ? "bg-green-500" :
                            (selectedMedia.aiScore || 0) >= 0.6 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${(selectedMedia.aiScore || 0) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`font-medium ${getAiScoreColor(selectedMedia.aiScore || 0)}`}>
                        {((selectedMedia.aiScore || 0) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Status</label>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getStatusColor(selectedMedia.status)}`}>
                      {getStatusIcon(selectedMedia.status)} {selectedMedia.status.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Dating Profile Context */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3">Dating Profile Context</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-blue-600">Profile Status:</span>
                      <span className={`ml-2 font-medium ${
                        selectedMedia.userVerificationStatus === 'verified' ? 'text-green-600' : 
                        selectedMedia.userVerificationStatus === 'pending' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {selectedMedia.userVerificationStatus.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600">Gallery Position:</span>
                      <span className="ml-2 font-medium">{selectedMedia.mediaPosition}</span>
                    </div>
                    <div>
                      <span className="text-blue-600">Profile Picture:</span>
                      <span className="ml-2 font-medium">
                        {selectedMedia.isProfilePicture ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600">User Reports:</span>
                      <span className={`ml-2 font-medium ${(selectedMedia.reports || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {selectedMedia.reports || 0}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-blue-600">Dating Preferences:</span>
                      <p className="mt-1 text-blue-800 font-medium">{selectedMedia.datingPreferences}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-blue-600">Last Active:</span>
                      <span className="ml-2 font-medium">{formatDateTime(selectedMedia.lastActive || selectedMedia.uploadedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Info and Actions */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">User Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedMedia.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedMedia.userEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age/Gender:</span>
                      <span className="font-medium">{selectedMedia.userAge} • {selectedMedia.userGender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profile ID:</span>
                      <span className="font-medium">{selectedMedia.userProfileId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Uploaded:</span>
                      <span className="font-medium">{formatDateTime(selectedMedia.uploadedAt)}</span>
                    </div>
                  </div>
                </div>

                {selectedMedia.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">Rejection Reason</h4>
                    <p className="text-red-700 text-sm">{selectedMedia.rejectionReason}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">User Management</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleViewProfile(selectedMedia.userId)}
                      className="bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      👤 View Profile
                    </button>
                    <button
                      onClick={() => handleSuspendUser(selectedMedia.userId, selectedMedia.userName)}
                      className="bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      ⚠️ Suspend User
                    </button>
                  </div>
                  {selectedMedia.userVerificationStatus !== 'verified' && (
                    <button
                      onClick={() => handleVerifyUser(selectedMedia.userId)}
                      className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      ✅ Verify User
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Moderation Actions</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleApprove(selectedMedia.id)}
                      className="bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleReject(selectedMedia.id, "Inappropriate content")}
                      className="bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      ❌ Reject
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Rejection Reasons (Quick Select)</label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        "Inappropriate content",
                        "Low quality/blurry",
                        "Not a real person",
                        "Contains contact information",
                        "Watermarked/professional photos",
                        "Group photos only",
                        "No face visible",
                        "Violates dating guidelines",
                        "Suspicious/spam content",
                        "Underage appearance"
                      ].map((reason) => (
                        <button
                          key={reason}
                          onClick={() => handleReject(selectedMedia.id, reason)}
                          className="text-left px-3 py-2 text-sm bg-gray-100 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          {reason}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Media Management | MpenziMatch Admin</title>
        <meta name="description" content="Manage and moderate user media" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Media Management</h1>
              <p className="text-gray-600">Moderate user profile photos and videos</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={runAiScan}
                disabled={aiScanning}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center"
              >
                {aiScanning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Scanning...
                  </>
                ) : (
                  "🔄 AI Scan All"
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="flagged">Flagged</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Media Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
              </select>
            </div>

            {/* Verification Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verification</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filters.verification}
                onChange={(e) => setFilters(prev => ({ ...prev, verification: e.target.value }))}
              >
                <option value="all">All Users</option>
                <option value="verified">Verified Only</option>
                <option value="pending">Pending Verification</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>

            {/* Reports Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reports</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filters.reports}
                onChange={(e) => setFilters(prev => ({ ...prev, reports: e.target.value }))}
              >
                <option value="all">Any Reports</option>
                <option value="reported">Reported Media</option>
                <option value="none">No Reports</option>
              </select>
            </div>

            {/* Profile Picture Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Picture Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filters.profilePicture}
                onChange={(e) => setFilters(prev => ({ ...prev, profilePicture: e.target.value }))}
              >
                <option value="all">All Media</option>
                <option value="profile">Profile Pictures</option>
                <option value="gallery">Gallery Only</option>
              </select>
            </div>

            {/* Bulk Actions */}
            <div className="flex items-end space-x-2">
              <select
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
              >
                <option value="">Bulk Actions</option>
                <option value="approve">Approve Selected</option>
                <option value="reject">Reject Selected</option>
                <option value="delete">Delete Selected</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction || selectedItems.length === 0}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-gray-900">{media.filter(m => m.status === 'pending').length}</div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-gray-900">{media.filter(m => m.status === 'flagged').length}</div>
            <div className="text-sm text-gray-600">Flagged</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-green-600">{media.filter(m => m.status === 'approved').length}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-red-600">{media.filter(m => m.status === 'rejected').length}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">
              {media.filter(m => m.userVerificationStatus === 'verified').length}
            </div>
            <div className="text-sm text-gray-600">Verified Users</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-orange-600">
              {media.filter(m => (m.reports || 0) > 0).length}
            </div>
            <div className="text-sm text-gray-600">Reported Media</div>
          </div>
        </div>

        {/* Selection Header */}
        {selectedItems.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-purple-700 font-medium">
                  {selectedItems.length} media selected
                </span>
                <button
                  onClick={selectAllItems}
                  className="text-purple-600 hover:text-purple-800 text-sm"
                >
                  {selectedItems.length === filteredMedia.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-purple-600">Bulk action:</span>
                <select
                  className="px-3 py-1 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                >
                  <option value="">Choose action...</option>
                  <option value="approve">Approve Selected</option>
                  <option value="reject">Reject Selected</option>
                  <option value="delete">Delete Selected</option>
                </select>
                <button
                  onClick={handleBulkAction}
                  disabled={!bulkAction}
                  className="px-4 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Media Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              <span className="ml-3 text-gray-600">Loading media...</span>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📸</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No media found</h3>
              <p className="text-gray-600">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white"
                >
                  {/* Selection Checkbox */}
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </div>

                  {/* Media Preview */}
                  <div 
                    className="aspect-square bg-gray-100 flex items-center justify-center cursor-pointer relative"
                    onClick={() => {
                      setSelectedMedia(item);
                      setShowModal(true);
                    }}
                  >
                    {item.type === "image" ? (
                      <div className="text-4xl">🖼️</div>
                    ) : (
                      <div className="text-4xl">🎥</div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                      {item.isProfilePicture && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Profile</span>
                      )}
                      {item.userVerificationStatus === 'verified' && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Verified</span>
                      )}
                      {(item.reports || 0) > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {item.reports} Report{item.reports !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Media Info */}
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.userName}</h3>
                        <p className="text-sm text-gray-600">{item.userEmail}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {item.type === "image" ? "Image" : "Video"} • Pos: {item.mediaPosition}
                      </span>
                      <span className={`font-medium ${getAiScoreColor(item.aiScore || 0)}`}>
                        AI: {((item.aiScore || 0) * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="text-xs text-gray-500">
                      Uploaded: {formatDate(item.uploadedAt)}
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={() => {
                          setSelectedMedia(item);
                          setShowModal(true);
                        }}
                        className="flex-1 bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700"
                      >
                        Review
                      </button>
                      <button
                        onClick={() => handleViewProfile(item.userId)}
                        className="px-3 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                        title="View User Profile"
                      >
                        👤
                      </button>
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="px-3 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        ✅
                      </button>
                      <button
                        onClick={() => handleReject(item.id, "Quick rejection")}
                        className="px-3 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && <MediaModal />}
    </div>
    </AdminLayout>
  );
}