"use client"

import React from 'react';
import "./Sidebar.css";
import { CogIcon, Folder, Info, Menu, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation'

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {

    const router = useRouter();

    const handleClick = ( path: string ) => {
      router.push(path);
    }

    return (
      <>
        {/* Sidebar structure */}
        <div className={`main-sidebar ${isOpen ? "open" : "closed"}`}>
          <div className="sidebar-header">
            <div className="sidebar-title">Menu</div>
          </div>
          <div className="sidebar-items">
            <div className="sidebar-item" onClick={() => handleClick('/settings')}><CogIcon className="sidebar-item-icon"/>Settings</div>
            <div className="sidebar-item"><Folder className="sidebar-item-icon"/>Projects</div>
            <div className="sidebar-item"><Phone className="sidebar-item-icon"/>Contact Us</div>
            <div className="sidebar-item"><Info className="sidebar-item-icon"/>About</div>
          </div>

        </div>
        
        {/* Menu icon should be outside the sidebar */}
        <Menu className={`menu-icon ${isOpen ? "open" : "closed"}`} onClick={toggleSidebar} />
      </>
    );
  };

export default Sidebar;
