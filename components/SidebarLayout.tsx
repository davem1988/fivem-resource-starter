"use client"; // Make this a Client Component

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar"; // Your Sidebar component

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
