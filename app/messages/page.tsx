// app/messages/page.tsx
"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import AdminLayout from "../components/AdminLayout";

type Message = {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  content: string;
  timestamp: string;
  flagged: boolean;
  flagReason?: string;
  aiScore?: number;
  type: "text" | "image" | "video";
  status: "normal" | "warning" | "danger";
};

type Conversation = {
  id: number;
  user1: { id: number; name: string; email: string };
  user2: { id: number; name: string; email: string };
  lastMessage: string;
  messageCount: number;
  flaggedCount: number;
  lastActivity: string;
  status: "active" | "monitored" | "blocked";
};

type FilterOptions = {
  status: string;
  dateRange: string;
  severity: string;
};

export default function MessagesMonitoring() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
    dateRange: "all",
    severity: "all",
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockConversations: Conversation[] = [
        {
          id: 1,
          user1: { id: 101, name: "Sarah Johnson", email: "sarah.j@example.com" },
          user2: { id: 102, name: "Mike Chen", email: "mike.chen@example.com" },
          lastMessage: "Can you send me your phone number?",
          messageCount: 47,
          flaggedCount: 3,
          lastActivity: "2024-01-15T14:30:00Z",
          status: "monitored",
        },
        {
          id: 2,
          user1: { id: 103, name: "Emily Davis", email: "emily.d@example.com" },
          user2: { id: 104, name: "Alex Rodriguez", email: "alex.r@example.com" },
          lastMessage: "That's inappropriate!",
          messageCount: 12,
          flaggedCount: 5,
          lastActivity: "2024-01-15T13:15:00Z",
          status: "blocked",
        },
        {
          id: 3,
          user1: { id: 105, name: "Jessica Williams", email: "jessica.w@example.com" },
          user2: { id: 106, name: "David Kim", email: "david.kim@example.com" },
          lastMessage: "Looking forward to our date!",
          messageCount: 89,
          flaggedCount: 0,
          lastActivity: "2024-01-15T15:45:00Z",
          status: "active",
        },
        {
          id: 4,
          user1: { id: 107, name: "Brian Taylor", email: "brian.t@example.com" },
          user2: { id: 108, name: "Amanda Lee", email: "amanda.l@example.com" },
          lastMessage: "I need your bank details for verification",
          messageCount: 23,
          flaggedCount: 8,
          lastActivity: "2024-01-14T16:20:00Z",
          status: "monitored",
        },
      ];

      setConversations(mockConversations);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const fetchMessages = async (conversationId: number) => {
    setIsLoadingMessages(true);
    setSelectedConversation(conversations.find(c => c.id === conversationId) || null);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockMessages: Message[] = [
      {
        id: 1,
        conversationId,
        senderId: 101,
        senderName: "Sarah Johnson",
        receiverId: 102,
        receiverName: "Mike Chen",
        content: "Hi Mike! How are you doing?",
        timestamp: "2024-01-15T14:00:00Z",
        flagged: false,
        type: "text",
        status: "normal",
      },
      {
        id: 2,
        conversationId,
        senderId: 102,
        senderName: "Mike Chen",
        receiverId: 101,
        receiverName: "Sarah Johnson",
        content: "I'm good! Can you send me your phone number? I want to call you",
        timestamp: "2024-01-15T14:05:00Z",
        flagged: true,
        flagReason: "Request for personal contact information",
        aiScore: 0.87,
        type: "text",
        status: "warning",
      },
      {
        id: 3,
        conversationId,
        senderId: 101,
        senderName: "Sarah Johnson",
        receiverId: 102,
        receiverName: "Mike Chen",
        content: "I prefer to chat here first",
        timestamp: "2024-01-15T14:10:00Z",
        flagged: false,
        type: "text",
        status: "normal",
      },
      {
        id: 4,
        conversationId,
        senderId: 102,
        senderName: "Mike Chen",
        receiverId: 101,
        receiverName: "Sarah Johnson",
        content: "Come on, don't be shy. I can send you money if you need",
        timestamp: "2024-01-15T14:15:00Z",
        flagged: true,
        flagReason: "Financial scam pattern detected",
        aiScore: 0.92,
        type: "text",
        status: "danger",
      },
      {
        id: 5,
        conversationId,
        senderId: 101,
        senderName: "Sarah Johnson",
        receiverId: 102,
        receiverName: "Mike Chen",
        content: "That makes me uncomfortable",
        timestamp: "2024-01-15T14:20:00Z",
        flagged: false,
        type: "text",
        status: "normal",
      },
    ];

    setMessages(mockMessages);
    setIsLoadingMessages(false);
  };

  const getStatusColor = (status: Conversation["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "monitored":
        return "bg-yellow-100 text-yellow-800";
      case "blocked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMessageColor = (status: Message["status"]) => {
    switch (status) {
      case "normal":
        return "bg-white border-gray-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "danger":
        return "bg-red-50 border-red-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  const getSeverityIcon = (status: Message["status"]) => {
    switch (status) {
      case "normal":
        return "⚪";
      case "warning":
        return "🟡";
      case "danger":
        return "🔴";
      default:
        return "⚪";
    }
  };

  const blockUser = (userId: number) => {
    alert(`User ${userId} has been blocked`);
    // Implement block logic
  };

  const deleteMessage = (messageId: number) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const blockConversation = (conversationId: number) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId ? { ...conv, status: "blocked" } : conv
    ));
    alert(`Conversation ${conversationId} has been blocked`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const filteredConversations = conversations.filter(conv => {
    if (filters.status !== "all" && conv.status !== filters.status) return false;
    if (filters.severity === "flagged" && conv.flaggedCount === 0) return false;
    return true;
  });

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Messages Monitoring | MpenziMatch Admin</title>
        <meta name="description" content="Monitor and manage user conversations" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Messages Monitoring</h1>
              <p className="text-gray-600">Monitor chat conversations and detect inappropriate content</p>
            </div>
            <div className="text-sm text-gray-500">
              AI Monitoring: <span className="text-green-600">Active</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Conversations Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Filters */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Filters</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="monitored">Monitored</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      value={filters.severity}
                      onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
                    >
                      <option value="all">All Chats</option>
                      <option value="flagged">Flagged Only</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Conversations List */}
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">💬</div>
                    <p className="text-gray-600 text-sm">No conversations found</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                        selectedConversation?.id === conv.id ? "bg-purple-50" : ""
                      }`}
                      onClick={() => fetchMessages(conv.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(conv.status)}`}>
                              {conv.status.toUpperCase()}
                            </span>
                            {conv.flaggedCount > 0 && (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                                🚩 {conv.flaggedCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {conv.user1.name} & {conv.user2.name}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-2">
                        {conv.lastMessage}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{conv.messageCount} messages</span>
                        <span>{new Date(conv.lastActivity).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Monitoring Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Conversations:</span>
                  <span className="font-medium">{conversations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Flagged Today:</span>
                  <span className="font-medium text-red-600">
                    {conversations.reduce((sum, conv) => sum + conv.flaggedCount, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Blocked Chats:</span>
                  <span className="font-medium">
                    {conversations.filter(c => c.status === 'blocked').length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
              {!selectedConversation ? (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                  <div className="text-gray-400 text-6xl mb-4">💭</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Conversation</h3>
                  <p className="text-gray-600">Choose a conversation from the list to view messages</p>
                </div>
              ) : isLoadingMessages ? (
                <div className="flex justify-center items-center h-96">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                  <span className="ml-3 text-gray-600">Loading messages...</span>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  {/* Conversation Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {selectedConversation.user1.name} & {selectedConversation.user2.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {selectedConversation.messageCount} messages • 
                          {selectedConversation.flaggedCount > 0 && (
                            <span className="text-red-600 ml-1">
                              {selectedConversation.flaggedCount} flagged
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => blockUser(selectedConversation.user1.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                        >
                          Block User 1
                        </button>
                        <button
                          onClick={() => blockUser(selectedConversation.user2.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                        >
                          Block User 2
                        </button>
                        <button
                          onClick={() => blockConversation(selectedConversation.id)}
                          className="px-3 py-1 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700"
                        >
                          Block Chat
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages Container */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`border rounded-lg p-3 ${getMessageColor(message.status)}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                              {message.senderName}
                            </span>
                            <span className="text-xs text-gray-500">
                              to {message.receiverName}
                            </span>
                            {message.flagged && (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                                🚩 Flagged
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {message.aiScore && (
                              <span className={`text-xs ${
                                message.aiScore > 0.8 ? 'text-red-600' : 
                                message.aiScore > 0.6 ? 'text-yellow-600' : 'text-green-600'
                              }`}>
                                AI: {(message.aiScore * 100).toFixed(0)}%
                              </span>
                            )}
                            <span className={getSeverityIcon(message.status)}></span>
                          </div>
                        </div>

                        <p className="text-gray-800 mb-2">{message.content}</p>

                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {formatDate(message.timestamp)}
                          </span>
                          <div className="flex space-x-2">
                            {message.flagged && (
                              <button
                                onClick={() => deleteMessage(message.id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Delete
                              </button>
                            )}
                            <button
                              onClick={() => blockUser(message.senderId)}
                              className="text-orange-600 hover:text-orange-800 text-sm"
                            >
                              Block User
                            </button>
                          </div>
                        </div>

                        {message.flagReason && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                            <strong>Flag Reason:</strong> {message.flagReason}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* AI Detection Alerts */}
                  <div className="p-4 border-t border-gray-200 bg-yellow-50">
                    <h4 className="font-semibold text-gray-900 mb-2">AI Detection Alerts</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between p-2 bg-white rounded border">
                        <span>Personal information requests</span>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                          {messages.filter(m => m.flagReason?.includes('personal')).length} detected
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded border">
                        <span>Financial scam patterns</span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                          {messages.filter(m => m.flagReason?.includes('financial')).length} detected
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded border">
                        <span>Inappropriate content</span>
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                          {messages.filter(m => m.flagReason?.includes('inappropriate')).length} detected
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
    </AdminLayout>
  );
}