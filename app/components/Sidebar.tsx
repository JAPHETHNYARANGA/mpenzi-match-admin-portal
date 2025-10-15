// components/Sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItem = {
  name: string;
  href: string;
  icon: string;
  badge?: number;
};

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

const menuItems: MenuItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: "📊" },
  { name: "Users", href: "/users", icon: "👥" },
  { name: "Media", href: "/media", icon: "🖼️" },
  { name: "Messages", href: "/messages", icon: "💬", badge: 12 },
  { name: "Notifications", href: "/notifications", icon: "🔔" },
  { name: "Analytics", href: "/analytics", icon: "📈" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
];

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    return pathname === href;
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setMobileOpen(false);
      onClose?.();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-purple-600 text-white rounded-lg shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen bg-gradient-to-b from-purple-900 to-purple-800 text-white
        transform transition-transform duration-300 ease-in-out z-40
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64 lg:w-72
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-purple-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold text-lg">MP</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">MpenziMatch</h1>
              <p className="text-purple-200 text-sm">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-purple-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center border-2 border-purple-400">
              <span className="text-white font-semibold">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">Administrator</p>
              <p className="text-purple-200 text-sm truncate">admin@mpenzimatch.com</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleNavClick}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
                ${isActive(item.href)
                  ? 'bg-white text-purple-700 shadow-lg transform scale-105'
                  : 'text-purple-100 hover:bg-purple-700 hover:text-white hover:translate-x-1'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium flex-1">{item.name}</span>
              
              {item.badge && (
                <span className={`
                  px-2 py-1 rounded-full text-xs font-bold min-w-6 text-center
                  ${isActive(item.href)
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-red-500 text-white'
                  }
                `}>
                  {item.badge}
                </span>
              )}

              {/* Active indicator */}
              {isActive(item.href) && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="p-4 mt-8">
          <div className="bg-purple-700/50 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-purple-200 text-sm">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-purple-200">Online Users</span>
                <span className="text-white font-semibold">1.2K</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-purple-200">New Today</span>
                <span className="text-white font-semibold">187</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-purple-200">Reports</span>
                <span className="text-red-300 font-semibold">23</span>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-6 right-6">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-purple-200 hover:bg-purple-700 rounded-xl transition-colors group">
            <span className="text-xl">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}