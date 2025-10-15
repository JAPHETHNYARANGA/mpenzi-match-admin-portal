// components/AdminLayout.tsx
"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main content */}
      <main className="flex-1 lg:ml-0 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}