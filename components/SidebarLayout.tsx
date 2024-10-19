"use client"; // Make this a Client Component

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar"; // Your Sidebar component
import "./Sidebar.css";
import { usePathname } from 'next/navigation';

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');

  if (isAuthPage) {
    return <>{children}</>;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };



  return (
    <div className="sidebar-layout">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {children}
    </div>
  );
};

export default SidebarLayout;
