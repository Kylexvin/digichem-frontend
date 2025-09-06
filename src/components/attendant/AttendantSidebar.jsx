import React, { useState } from "react";
import { User } from "lucide-react";
import "./Sidebar.css";

const Sidebar = ({ items = [], onTabChange }) => {
  const [activeTab, setActiveTab] = useState("home");

  const handleClick = (id) => {
    setActiveTab(id);
    if (onTabChange) onTabChange(id);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-nav">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`sidebar-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => handleClick(item.id)}
              title={item.label}
            >
              <Icon size={24} />
            </button>
          );
        })}
      </div>
      <div className="sidebar-profile">
        <div className="profile-avatar">
          <User size={24} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
