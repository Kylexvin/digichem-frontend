import React, { useState } from "react";
import {
  User,
  Store,
  Bell,
  Shield,
  Printer,
  Database,
  Wifi,
  CreditCard,
  Users,
  Package,
  Receipt,
  Save,
  RefreshCw,
  Download,
  Upload,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    lowStock: true,
    expiring: true,
    sales: false,
    system: true,
  });
  const [formData, setFormData] = useState({
    storeName: "Pharmacy POS",
    storeAddress: "123 Main Street, Nairobi",
    storePhone: "+254 700 000 000",
    storeEmail: "info@pharmacy.com",
    taxRate: "16",
    currency: "KES",
  });

  const settingsCategories = [
    { id: "profile", label: "Profile", icon: User },
    { id: "store", label: "Store Settings", icon: Store },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "printer", label: "Printer Setup", icon: Printer },
    { id: "backup", label: "Data & Backup", icon: Database },
    { id: "integrations", label: "Integrations", icon: Wifi },
    { id: "payments", label: "Payment Methods", icon: CreditCard },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderProfileSettings = () => (
    <div className="settings-section">
      <h2 className="section-title">Profile Settings</h2>
      
      <div className="profile-avatar-section">
        <div className="avatar-container">
          <div className="profile-avatar-large">
            <User size={48} />
          </div>
          <button className="avatar-change-btn">Change Photo</button>
        </div>
      </div>

      <div className="settings-form">
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" defaultValue="John Kamau" className="form-input" />
        </div>
        
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" defaultValue="john.kamau@pharmacy.com" className="form-input" />
        </div>
        
        <div className="form-group">
          <label>Phone Number</label>
          <input type="tel" defaultValue="+254 700 123 456" className="form-input" />
        </div>
        
        <div className="form-group">
          <label>Role</label>
          <select className="form-input" defaultValue="attendant">
            <option value="admin">Administrator</option>
            <option value="manager">Manager</option>
            <option value="attendant">Attendant</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStoreSettings = () => (
    <div className="settings-section">
      <h2 className="section-title">Store Configuration</h2>
      
      <div className="settings-form">
        <div className="form-group">
          <label>Store Name</label>
          <input 
            type="text" 
            value={formData.storeName}
            onChange={(e) => handleInputChange('storeName', e.target.value)}
            className="form-input" 
          />
        </div>
        
        <div className="form-group">
          <label>Store Address</label>
          <textarea 
            value={formData.storeAddress}
            onChange={(e) => handleInputChange('storeAddress', e.target.value)}
            className="form-textarea"
            rows="3"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              value={formData.storePhone}
              onChange={(e) => handleInputChange('storePhone', e.target.value)}
              className="form-input" 
            />
          </div>
          
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={formData.storeEmail}
              onChange={(e) => handleInputChange('storeEmail', e.target.value)}
              className="form-input" 
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Tax Rate (%)</label>
            <input 
              type="number" 
              value={formData.taxRate}
              onChange={(e) => handleInputChange('taxRate', e.target.value)}
              className="form-input" 
            />
          </div>
          
          <div className="form-group">
            <label>Currency</label>
            <select 
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className="form-input"
            >
              <option value="KES">KES - Kenyan Shilling</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <h2 className="section-title">Notification Preferences</h2>
      
      <div className="notification-settings">
        <div className="notification-item">
          <div className="notification-info">
            <h3>Low Stock Alerts</h3>
            <p>Get notified when items are running low</p>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={notifications.lowStock}
              onChange={() => handleNotificationChange('lowStock')}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="notification-item">
          <div className="notification-info">
            <h3>Expiring Products</h3>
            <p>Alerts for products nearing expiry</p>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={notifications.expiring}
              onChange={() => handleNotificationChange('expiring')}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="notification-item">
          <div className="notification-info">
            <h3>Daily Sales Reports</h3>
            <p>Receive end-of-day sales summaries</p>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={notifications.sales}
              onChange={() => handleNotificationChange('sales')}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="notification-item">
          <div className="notification-info">
            <h3>System Updates</h3>
            <p>Important system and security updates</p>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={notifications.system}
              onChange={() => handleNotificationChange('system')}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="settings-section">
      <h2 className="section-title">Security Settings</h2>
      
      <div className="settings-form">
        <div className="form-group">
          <label>Current Password</label>
          <div className="password-input">
            <input 
              type={showPassword ? "text" : "password"} 
              className="form-input" 
              placeholder="Enter current password"
            />
            <button 
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <div className="form-group">
          <label>New Password</label>
          <input type="password" className="form-input" placeholder="Enter new password" />
        </div>
        
        <div className="form-group">
          <label>Confirm New Password</label>
          <input type="password" className="form-input" placeholder="Confirm new password" />
        </div>
        
        <div className="security-options">
          <div className="security-item">
            <div className="security-info">
              <h3>Two-Factor Authentication</h3>
              <p>Add an extra layer of security to your account</p>
            </div>
            <button className="action-btn secondary">Enable 2FA</button>
          </div>
          
          <div className="security-item">
            <div className="security-info">
              <h3>Login Sessions</h3>
              <p>Manage your active login sessions</p>
            </div>
            <button className="action-btn secondary">View Sessions</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataBackup = () => (
    <div className="settings-section">
      <h2 className="section-title">Data Management & Backup</h2>
      
      <div className="backup-section">
        <div className="backup-status">
          <div className="backup-info">
            <h3>Last Backup</h3>
            <p>January 15, 2024 at 2:30 PM</p>
            <span className="backup-status-badge success">
              <Check size={14} />
              Successful
            </span>
          </div>
        </div>
        
        <div className="backup-actions">
          <button className="action-btn primary">
            <Download size={18} />
            Create Backup
          </button>
          <button className="action-btn secondary">
            <Upload size={18} />
            Restore Backup
          </button>
          <button className="action-btn secondary">
            <RefreshCw size={18} />
            Auto Backup Settings
          </button>
        </div>
      </div>
      
      <div className="data-export">
        <h3>Export Data</h3>
        <p>Download your data in various formats</p>
        
        <div className="export-options">
          <button className="export-btn">
            <Receipt size={18} />
            Sales Data (CSV)
          </button>
          <button className="export-btn">
            <Package size={18} />
            Inventory (Excel)
          </button>
          <button className="export-btn">
            <Users size={18} />
            Customer Data (CSV)
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return renderProfileSettings();
      case "store":
        return renderStoreSettings();
      case "notifications":
        return renderNotificationSettings();
      case "security":
        return renderSecuritySettings();
      case "backup":
        return renderDataBackup();
      default:
        return (
          <div className="settings-section">
            <h2 className="section-title">{settingsCategories.find(cat => cat.id === activeSection)?.label}</h2>
            <div className="coming-soon">
              <p>This section is coming soon...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        {/* Settings Navigation */}
        <div className="settings-nav">
          <h1 className="settings-title">Settings</h1>
          <div className="settings-categories">
            {settingsCategories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  className={`category-btn ${activeSection === category.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(category.id)}
                >
                  <Icon size={18} />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {renderContent()}
          
          {/* Save Button */}
          {(activeSection === 'profile' || activeSection === 'store' || activeSection === 'notifications' || activeSection === 'security') && (
            <div className="settings-footer">
              <button className="save-btn">
                <Save size={18} />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;