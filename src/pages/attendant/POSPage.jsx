import React, { useState } from 'react';
import { Search, Settings, Bell, User, Home, FileText, Clipboard, Package, ShoppingCart, UserCircle } from 'lucide-react';
import './POSPage.css';

const POSPage = () => {
  const [activeTab, setActiveTab] = useState('home');

  const sidebarItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'prescriptions', icon: Clipboard, label: 'Prescriptions' },
    { id: 'stock', icon: Package, label: 'Stock' },
    { id: 'sales', icon: ShoppingCart, label: 'Sales' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];


  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-nav">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
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

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
       

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Top Left Quarter - Medicine Info Chart */}
         

          {/* Top Right Quarter - Recent Sales */}


          {/* Bottom Left Quarter - Split into two sections */}
          

          {/* Bottom Right Quarter - Split into two sections */}
          <div className="bottom-right-section">
            {/* Quick Stats */}
            

            {/* Additional section - can be customized */}

          </div>
        </div>

        {/* Footer Stats */}

      </div>
    </div>
  );
};

export default POSPage;