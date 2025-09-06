import React, { useState } from "react";
import {
  Home,
  FileText,
  Clipboard,
  Package,
  ShoppingCart,
  Settings,
} from "lucide-react";

import Sidebar from "./AttendantSidebar";
import AttendantTopbar from "./AttendantTopbar";

// Import all pages
import POSHomePage from "./POS/POSHomePage";
import ReportsPage from "./POS/ReportsPage";
import PrescriptionsPage from "./POS/PrescriptionsPage";
import StockPage from "./POS/StockPage";
import SalesHistory from "./POS/SalesHistory";
import SettingsPage from "./POS/SettingsPage";

import "./AttendantLayout.css";

const menuItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "prescriptions", label: "Prescriptions", icon: Clipboard },
  { id: "stock", label: "Stock", icon: Package },
  { id: "sales", label: "Sales", icon: ShoppingCart },
  { id: "settings", label: "Settings", icon: Settings },
];

const AttendantLayout = ({ children }) => {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <POSHomePage />;
      case "reports":
        return <ReportsPage />;
      case "prescriptions":
        return <PrescriptionsPage />;
      case "stock":
        return <StockPage />;
      case "sales":
        return <SalesHistory />;
      case "settings":
        return <SettingsPage />;
      default:
        return <div className="placeholder">Select a menu option</div>;
    }
  };

  return (
    <>
      <Sidebar items={menuItems} onTabChange={setActiveTab} />
      <AttendantTopbar />
      <div className="pos-content-container">
        {children || renderContent()}
      </div>
    </>
  );
};

export default AttendantLayout;
