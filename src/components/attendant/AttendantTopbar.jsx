import React from "react";
import { LogOut, Bell } from "lucide-react";
import "./AttendantTopbar.css";

const AttendantTopbar = () => {
  const handleLogout = () => {
    console.log("Logging out..."); 
    // later: hook to your auth/logout logic
  };

  return (
    <div className="attendant-topbar">
      <h2 className="shop-name">Pharmacy POS</h2>

      <div className="topbar-actions">
        <button className="icon-btn" title="Notifications">
          <Bell size={20} />
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} /> 
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AttendantTopbar;
