// app/users/page.tsx
"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import AdminLayout from "../components/AdminLayout";

type User = {
  id: number;
  name: string;
  email: string;
  age: number;
  gender: string;
  location: string;
  status: "active" | "inactive" | "suspended" | "banned";
  verified: boolean;
  profileCompleted: boolean;
  lastActive: string;
  joinDate: string;
  profileImage?: string;
  bio?: string;
  interests: string[];
  reports: number;
};

type FilterOptions = {
  status: string;
  verified: string;
  gender: string;
  ageMin: number;
  ageMax: number;
  search: string;
};

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"ban" | "suspend" | "delete" | "reset" | "">("");
  const [bulkAction, setBulkAction] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
    verified: "all",
    gender: "all",
    ageMin: 18,
    ageMax: 80,
    search: "",
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockUsers: User[] = [
        {
          id: 1,
          name: "Sarah Johnson",
          email: "sarah.j@example.com",
          age: 28,
          gender: "female",
          location: "New York, NY",
          status: "active",
          verified: true,
          profileCompleted: true,
          lastActive: "2024-01-15T14:30:00Z",
          joinDate: "2024-01-10T00:00:00Z",
          profileImage: "/images/profile1.jpg",
          bio: "Adventure seeker and coffee lover. Looking for meaningful connections.",
          interests: ["Hiking", "Photography", "Coffee", "Travel"],
          reports: 0,
        },
        {
          id: 2,
          name: "Mike Chen",
          email: "mike.chen@example.com",
          age: 32,
          gender: "male",
          location: "San Francisco, CA",
          status: "active",
          verified: true,
          profileCompleted: true,
          lastActive: "2024-01-15T13:15:00Z",
          joinDate: "2024-01-08T00:00:00Z",
          bio: "Software engineer who loves hiking and trying new restaurants.",
          interests: ["Technology", "Hiking", "Food", "Movies"],
          reports: 1,
        },
        {
          id: 3,
          name: "Emily Davis",
          email: "emily.d@example.com",
          age: 25,
          gender: "female",
          location: "Chicago, IL",
          status: "inactive",
          verified: false,
          profileCompleted: false,
          lastActive: "2024-01-10T09:45:00Z",
          joinDate: "2024-01-05T00:00:00Z",
          bio: "Art student passionate about painting and museum visits.",
          interests: ["Art", "Museums", "Painting", "Reading"],
          reports: 0,
        },
        {
          id: 4,
          name: "Alex Rodriguez",
          email: "alex.r@example.com",
          age: 35,
          gender: "male",
          location: "Miami, FL",
          status: "suspended",
          verified: true,
          profileCompleted: true,
          lastActive: "2024-01-14T16:20:00Z",
          joinDate: "2024-01-03T00:00:00Z",
          bio: "Fitness trainer and beach enthusiast. Love outdoor activities.",
          interests: ["Fitness", "Beach", "Sports", "Nutrition"],
          reports: 3,
        },
        {
          id: 5,
          name: "Jessica Williams",
          email: "jessica.w@example.com",
          age: 29,
          gender: "female",
          location: "Austin, TX",
          status: "banned",
          verified: true,
          profileCompleted: true,
          lastActive: "2024-01-12T11:30:00Z",
          joinDate: "2024-01-02T00:00:00Z",
          bio: "Music producer and dog mom. Always up for concerts and adventures.",
          interests: ["Music", "Dogs", "Concerts", "Travel"],
          reports: 5,
        },
        {
          id: 6,
          name: "David Kim",
          email: "david.kim@example.com",
          age: 31,
          gender: "male",
          location: "Seattle, WA",
          status: "active",
          verified: true,
          profileCompleted: true,
          lastActive: "2024-01-15T15:45:00Z",
          joinDate: "2024-01-12T00:00:00Z",
          bio: "Coffee roaster and mountain biker. Love exploring the Pacific Northwest.",
          interests: ["Coffee", "Biking", "Nature", "Photography"],
          reports: 0,
        },
      ];

      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setIsLoading(false);
    };

    fetchUsers();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = users;

    if (filters.status !== "all") {
      filtered = filtered.filter(user => user.status === filters.status);
    }

    if (filters.verified !== "all") {
      filtered = filtered.filter(user => 
        filters.verified === "verified" ? user.verified : !user.verified
      );
    }

    if (filters.gender !== "all") {
      filtered = filtered.filter(user => user.gender === filters.gender);
    }

    filtered = filtered.filter(user => 
      user.age >= filters.ageMin && user.age <= filters.ageMax
    );

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.location.toLowerCase().includes(searchLower) ||
        user.interests.some(interest => interest.toLowerCase().includes(searchLower))
      );
    }

    setFilteredUsers(filtered);
  }, [users, filters]);

  const getStatusColor = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-orange-100 text-orange-800";
      case "banned":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "🟢";
      case "inactive":
        return "🟡";
      case "suspended":
        return "🟠";
      case "banned":
        return "🔴";
      default:
        return "⚪";
    }
  };

  const handleUserAction = (action: "ban" | "suspend" | "delete" | "reset", userId?: number) => {
    const user = userId ? users.find(u => u.id === userId) : selectedUser;
    if (!user) return;

    switch (action) {
      case "ban":
        setUsers(prev => prev.map(u => 
          u.id === user.id ? { ...u, status: "banned" } : u
        ));
        break;
      case "suspend":
        setUsers(prev => prev.map(u => 
          u.id === user.id ? { ...u, status: "suspended" } : u
        ));
        break;
      case "delete":
        setUsers(prev => prev.filter(u => u.id !== user.id));
        setFilteredUsers(prev => prev.filter(u => u.id !== user.id));
        break;
      case "reset":
        // In a real app, this would trigger a password reset email
        alert(`Password reset email sent to ${user.email}`);
        break;
    }

    setShowActionModal(false);
    setSelectedAction("");
  };

  const handleBulkAction = () => {
    if (!bulkAction || selectedUsers.length === 0) return;

    switch (bulkAction) {
      case "ban":
        setUsers(prev => prev.map(u => 
          selectedUsers.includes(u.id) ? { ...u, status: "banned" } : u
        ));
        break;
      case "suspend":
        setUsers(prev => prev.map(u => 
          selectedUsers.includes(u.id) ? { ...u, status: "suspended" } : u
        ));
        break;
      case "delete":
        setUsers(prev => prev.filter(u => !selectedUsers.includes(u.id)));
        setFilteredUsers(prev => prev.filter(u => !selectedUsers.includes(u.id)));
        break;
      case "verify":
        setUsers(prev => prev.map(u => 
          selectedUsers.includes(u.id) ? { ...u, verified: true } : u
        ));
        break;
    }

    setSelectedUsers([]);
    setBulkAction("");
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const UserProfileModal = () => {
    if (!selectedUser) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="bg-gray-100 rounded-lg h-48 w-full flex items-center justify-center">
                  {selectedUser.profileImage ? (
                    <img
                      src={selectedUser.profileImage}
                      alt={selectedUser.name}
                      className="h-full w-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-4xl text-gray-400">
                      {selectedUser.gender === "female" ? "👩" : "👨"}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedUser.status)}`}>
                      {getStatusIcon(selectedUser.status)} {selectedUser.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Verified:</span>
                    <span className={selectedUser.verified ? "text-green-600" : "text-red-600"}>
                      {selectedUser.verified ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Profile Complete:</span>
                    <span className={selectedUser.profileCompleted ? "text-green-600" : "text-yellow-600"}>
                      {selectedUser.profileCompleted ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Reports:</span>
                    <span className={selectedUser.reports > 0 ? "text-red-600" : "text-green-600"}>
                      {selectedUser.reports}
                    </span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-lg font-semibold">{selectedUser.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Age</label>
                    <p className="text-lg">{selectedUser.age}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Gender</label>
                    <p className="text-lg capitalize">{selectedUser.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Location</label>
                    <p className="text-lg">{selectedUser.location}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-lg">{selectedUser.email}</p>
                </div>

                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-600">Bio</label>
                  <p className="text-gray-700 mt-1">{selectedUser.bio || "No bio provided"}</p>
                </div>

                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-600">Interests</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedUser.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-gray-600">Last Active</label>
                    <p>{formatDate(selectedUser.lastActive)}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">Join Date</label>
                    <p>{formatDate(selectedUser.joinDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <button
                onClick={() => {
                  setSelectedAction("reset");
                  setShowActionModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Reset Password
              </button>
              <button
                onClick={() => {
                  setSelectedAction("suspend");
                  setShowActionModal(true);
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Suspend Account
              </button>
              <button
                onClick={() => {
                  setSelectedAction("ban");
                  setShowActionModal(true);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Ban Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ActionModal = () => {
    if (!selectedAction || !selectedUser) return null;

    const actionText = {
      ban: "ban",
      suspend: "suspend",
      delete: "delete",
      reset: "reset password for"
    }[selectedAction];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Confirm Action
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to {actionText} <strong>{selectedUser.name}</strong>?
            {selectedAction === "delete" && " This action cannot be undone."}
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowActionModal(false);
                setSelectedAction("");
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleUserAction(selectedAction)}
              className={`px-4 py-2 text-white rounded-lg ${
                selectedAction === "delete" 
                  ? "bg-red-600 hover:bg-red-700"
                  : selectedAction === "ban"
                  ? "bg-red-600 hover:bg-red-700"
                  : selectedAction === "suspend"
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
      <Head>
        <title>User Management | MpenziMatch Admin</title>
        <meta name="description" content="Manage MpenziMatch users" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600">Manage and monitor user accounts</p>
            </div>
            <div className="text-sm text-gray-500">
              {filteredUsers.length} users found
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Name, email, location..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="banned">Banned</option>
              </select>
            </div>

            {/* Verification Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verification</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filters.verified}
                onChange={(e) => setFilters(prev => ({ ...prev, verified: e.target.value }))}
              >
                <option value="all">All</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filters.gender}
                onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          {/* Age Range Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age Range: {filters.ageMin} - {filters.ageMax}
              </label>
              <div className="flex space-x-4">
                <input
                  type="range"
                  min="18"
                  max="80"
                  value={filters.ageMin}
                  onChange={(e) => setFilters(prev => ({ ...prev, ageMin: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <input
                  type="range"
                  min="18"
                  max="80"
                  value={filters.ageMax}
                  onChange={(e) => setFilters(prev => ({ ...prev, ageMax: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Bulk Actions */}
            <div className="flex items-end space-x-3">
              <select
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
              >
                <option value="">Bulk Actions</option>
                <option value="verify">Verify Selected</option>
                <option value="suspend">Suspend Selected</option>
                <option value="ban">Ban Selected</option>
                <option value="delete">Delete Selected</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction || selectedUsers.length === 0}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              <span className="ml-3 text-gray-600">Loading users...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={selectAllUsers}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Age/Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verification
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {user.profileImage ? (
                              <img
                                src={user.profileImage}
                                alt={user.name}
                                className="h-10 w-10 rounded-full"
                              />
                            ) : (
                              <span className="text-lg">
                                {user.gender === "female" ? "👩" : "👨"}
                              </span>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {getStatusIcon(user.status)} {user.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.age} years</div>
                        <div className="text-sm text-gray-500">{user.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.verified 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {user.verified ? "Verified" : "Unverified"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.lastActive)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setSelectedAction("reset");
                              setShowActionModal(true);
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            Reset PW
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setSelectedAction(user.status === "suspended" ? "ban" : "suspend");
                              setShowActionModal(true);
                            }}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            {user.status === "suspended" ? "Ban" : "Suspend"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showUserModal && <UserProfileModal />}
      {showActionModal && <ActionModal />}
    </div>
    </AdminLayout>
  );
}