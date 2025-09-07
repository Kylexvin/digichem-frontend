import React, { useEffect, useState } from "react";
import { LogOut, Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../services/utils/apiClient";
import "./AttendantTopbar.css";

const AttendantTopbar = () => {
  const { logout } = useAuth();
  const [branding, setBranding] = useState(null);
  const [pharmacyInfo, setPharmacyInfo] = useState(null);

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const res = await apiClient.get("/pharmacy/branding");
        if (res.data.success) {
          setBranding(res.data.data.branding);
          setPharmacyInfo(res.data.data.pharmacyInfo);
        }
      } catch (err) {
        console.error("Failed to fetch branding:", err);
      }
    };

    fetchBranding();
  }, []);

  const handleLogout = () => {
    logout(); // Uses context logout logic
  };

  return (
    <div
      className="attendant-topbar"
      style={{
        backgroundColor: branding?.primaryColor || "#ffffff",
        color: branding?.theme === "dark" ? "#fff" : "#1f2937",
      }}
    >
      <div className="topbar-left">
        {branding?.logo && (
          <img
            src={branding.logo}
            alt="Pharmacy Logo"
            className="pharmacy-logo"
          />
        )}
        <h2 className="shop-name">
          {pharmacyInfo?.name || "Pharmacy POS"}
        </h2>
      </div>

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
