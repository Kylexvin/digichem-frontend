import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ADD THIS IMPORT
import { useAuth } from '../../../context/AuthContext';

import apiClient from "../../../services/utils/apiClient";
import { 
  BarChart3, 
  Users, 
  Package, 
  DollarSign, 
  Activity, 
  Settings,
  FileText,
  CreditCard,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Zap,
  LifeBuoy,
  Shield
} from 'lucide-react';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // ADD THIS HOOK
  const [dashboardData, setDashboardData] = useState(null);
  const [salesAnalytics, setSalesAnalytics] = useState(null);
  const [quickStats, setQuickStats] = useState(null);
  const [brandingData, setBrandingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all dashboard data concurrently including branding
      const [overviewRes, analyticsRes, quickRes, brandingRes] = await Promise.all([
        apiClient.get(`/pharmacy/dashboard/overview?timeRange=${timeRange}`),
        apiClient.get('/pharmacy/dashboard/sales-analytics?period=month&groupBy=day'),
        apiClient.get('/pharmacy/dashboard/quick-stats?compareWith=yesterday'),
        apiClient.get('/pharmacy/branding')
      ]);

      if (overviewRes.data?.success) setDashboardData(overviewRes.data.data);
      if (analyticsRes.data?.success) setSalesAnalytics(analyticsRes.data.data);
      if (quickRes.data?.success) setQuickStats(quickRes.data.data);
      if (brandingRes.data?.success) setBrandingData(brandingRes.data.data);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleNavigation = (path) => {
    navigate(path); // UPDATE THIS FUNCTION
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getChangeClass = (change) => {
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
  };

  const getPlanBadgeColor = (plan) => {
    switch(plan) {
      case 'BASIC': return 'plan-basic';
      case 'STANDARD': return 'plan-standard';
      case 'PREMIUM': return 'plan-premium';
      default: return 'plan-basic';
    }
  };

  const quickActions = [
    { icon: Package, label: 'Inventory', path: '/owner/inventory', color: 'blue', description: 'Manage products & stock' },
    { icon: Users, label: 'Staff', path: '/owner/staff', color: 'green', description: 'Manage team members' },
    { icon: FileText, label: 'Reports', path: '/owner/reports', color: 'purple', description: 'Analytics & insights' },
    { icon: ShoppingCart, label: 'POS', path: '/owner/pos', color: 'red', description: 'Point of sale system' },
    { icon: CreditCard, label: 'Billing', path: '/owner/subscriptions', color: 'yellow', description: 'Subscription & billing' },
    { icon: Settings, label: 'Settings', path: '/owner/settings', color: 'gray', description: 'System configuration' },
    { icon: LifeBuoy, label: 'Support', path: '/owner/support', color: 'lime', description: 'Help & customer support' },
    { icon: Globe, label: 'Website', path: '/owner/website', color: 'lime', description: 'Manage your website' }
  ];



  if (error) {
    return (
      <div className="owner-dashboard" style={{
        '--primary-color': brandingData?.branding?.primaryColor || '#007bff',
        '--secondary-color': brandingData?.branding?.secondaryColor || '#ec0606ff'
      }}>
        <div className="error-container">
          <AlertTriangle className="error-icon" />
          <h3>Error Loading Dashboard</h3>
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="owner-dashboard" style={{
      '--primary-color': brandingData?.branding?.primaryColor || '#007bff',
      '--secondary-color': brandingData?.branding?.secondaryColor || '#ec0606ff'
    }}>
      {/* Enhanced Header with Pharmacy Branding */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="pharmacy-branding">
            {brandingData?.branding?.logo && (
              <div className="pharmacy-logo">
                <img src={brandingData.branding.logo} alt={brandingData?.pharmacyInfo?.name} />
              </div>
            )}
            <div className="pharmacy-info">
              <h1>{brandingData?.pharmacyInfo?.name || 'Pharmacy Dashboard'}</h1>
              {/* <div className="pharmacy-meta">
                <span className="welcome-text">Welcome back, {user?.firstName}!</span>
                <div className="pharmacy-location">
                  <MapPin size={14} />
                  <span>{brandingData?.pharmacyInfo?.address?.city}, {brandingData?.pharmacyInfo?.address?.county}</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        
        <div className="header-right">
          <div className="subscription-badge">
            <div className={`plan-badge ${getPlanBadgeColor(brandingData?.subscription?.plan)}`}>
              <Star size={14} />
              <span>{brandingData?.subscription?.plan || 'BASIC'}</span>
            </div>
            <div className="subscription-status">
              <div className={`status-indicator ${brandingData?.subscription?.status}`}></div>
              <span>Active</span>
            </div>
          </div>
          
          <div className="user-profile">         
           
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Pharmacy Quick Info Card */}
        <section className="pharmacy-info-section">
          <div className="pharmacy-info-card">
            <div className="info-grid">
              <div className="info-item">
                <Phone size={16} />
                <span>{brandingData?.pharmacyInfo?.contact?.phone}</span>
              </div>
              <div className="info-item">
                <Mail size={16} />
                <span>{brandingData?.pharmacyInfo?.contact?.email}</span>
              </div>
              <div className="info-item">
                <Globe size={16} />
                <span>{brandingData?.pharmacyInfo?.websiteUrl}</span>
              </div>
             
            </div>
            {brandingData?.features?.websiteEnabled && (
              <div className="feature-badge">
                <Zap size={14} />
                <span>Website Enabled</span>
              </div>
            )}
          </div>
        </section>

        {/* Enhanced Quick Actions */}
        <section className="quick-actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(action.path)}
                className={`quick-action-card ${action.color}`}
              >
                <div className="action-content">
                  <div className="action-icon">
                    <action.icon />
                  </div>
                  <div className="action-text">
                    <span className="action-label">{action.label}</span>
                    <span className="action-description">{action.description}</span>
                  </div>
                </div>
                <div className="action-arrow">→</div>
              </button>
            ))}
          </div>
        </section>

        {/* Enhanced Stats Overview */}
        <section className="stats-section">
          <h2 className="section-title">Business Overview</h2>
          <div className="stats-grid">
            {/* Total Sales */}
            <div className="stat-card primary">
              <div className="stat-content">
                <div className="stat-info">
                  <div className="stat-header">
                    <h3>Total Sales</h3>
                    <DollarSign className="stat-icon" />
                  </div>
                  <p className="stat-value">
                    {formatCurrency(dashboardData?.sales?.total || 0)}
                  </p>
                  <div className={`stat-change ${getChangeClass(quickStats?.salesChange)}`}>
                    <TrendingUp className="change-icon" />
                    <span>
                      {quickStats?.salesChange !== undefined ? `${quickStats.salesChange}%` : 'N/A'} vs yesterday
                    </span>
                  </div>
                </div>
                <div className="stat-visual">
                  <div className="stat-chart"></div>
                </div>
              </div>
            </div>

            {/* Transactions */}
            <div className="stat-card secondary">
              <div className="stat-content">
                <div className="stat-info">
                  <div className="stat-header">
                    <h3>Transactions</h3>
                    <Activity className="stat-icon" />
                  </div>
                  <p className="stat-value">
                    {dashboardData?.sales?.transactions || 0}
                  </p>
                  <div className={`stat-change ${getChangeClass(quickStats?.transactionChange)}`}>
                    <BarChart3 className="change-icon" />
                    <span>
                      {quickStats?.transactionChange !== undefined ? `${quickStats.transactionChange}%` : 'N/A'} vs yesterday
                    </span>
                  </div>
                </div>
                <div className="stat-visual">
                  <div className="stat-pulse"></div>
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="stat-card success">
              <div className="stat-content">
                <div className="stat-info">
                  <div className="stat-header">
                    <h3>Products in Stock</h3>
                    <Package className="stat-icon" />
                  </div>
                  <p className="stat-value">
                    {dashboardData?.inventory?.totalProducts || 0}
                  </p>
                  <p className="stat-subtitle">
                    Value: {formatCurrency(dashboardData?.inventory?.totalValue || 0)}
                  </p>
                </div>
                <div className="inventory-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{
                        width: `${Math.min(((dashboardData?.inventory?.totalProducts || 0) / (brandingData?.features?.maxProducts || 1000)) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {dashboardData?.inventory?.totalProducts || 0} / {brandingData?.features?.maxProducts || 1000}
                  </span>
                </div>
              </div>
            </div>

            {/* Stock Alerts */}
            <div className="stat-card warning">
              <div className="stat-content">
                <div className="stat-info">
                  <div className="stat-header">
                    <h3>Stock Alerts</h3>
                    <AlertTriangle className="stat-icon" />
                  </div>
                  <p className="stat-value alert">
                    {dashboardData?.inventory?.lowStockCount || 0}
                  </p>
                  <div className="alert-details">
                    <div className="alert-item">
                      <span className="alert-dot low"></span>
                      <span>Low Stock: {dashboardData?.inventory?.lowStockCount || 0}</span>
                    </div>
                    <div className="alert-item">
                      <span className="alert-dot out"></span>
                      <span>Out of Stock: {dashboardData?.inventory?.outOfStockCount || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="dashboard-grid">
          {/* Enhanced Recent Sales */}
          <section className="recent-sales-section">
            <div className="section-header">
              <h2>Recent Sales Activity</h2>
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="time-range-select"
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div className="section-content">
              {dashboardData?.recentSales?.length > 0 ? (
                <div className="sales-list">
                  {dashboardData.recentSales.map((sale) => (
                    <div key={sale._id} className="sale-item">
                      <div className="sale-info">
                        <div className="sale-icon">
                          <DollarSign />
                        </div>
                        <div className="sale-details">
                          <h4>Receipt #{sale.formattedReceipt}</h4>
                          <p className="attendant-info">
                            <Users size={14} />
                            Served by {sale.attendant?.firstName} {sale.attendant?.lastName}
                          </p>
                        </div>
                      </div>
                      <div className="sale-amount">
                        <span className="amount">{formatCurrency(sale.totalAmount)}</span>
                        <span className="date">
                          <Clock size={12} />
                          {formatDate(sale.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-illustration">
                    <Activity className="empty-icon" />
                  </div>
                  <h3>No sales recorded yet</h3>
                  <p>Sales will appear here once customers start making purchases</p>
                </div>
              )}
            </div>
          </section>

          {/* Enhanced Analytics Sidebar */}
          <aside className="analytics-sidebar">
            {/* Top Products */}
            <div className="analytics-card">
              <div className="card-header">
                <h3>Top Selling Products</h3>
                <TrendingUp size={18} />
              </div>
              <div className="card-content">
                {salesAnalytics?.topProducts?.length > 0 ? (
                  <div className="products-list">
                    {salesAnalytics.topProducts.map((product, index) => (
                      <div key={product._id} className="product-item">
                        <div className="product-rank">
                          <span className={`rank ${index < 3 ? 'top-three' : ''}`}>
                            {index + 1}
                          </span>
                        </div>
                        <div className="product-info">
                          <div className="product-details">
                            <h4>{product.productName}</h4>
                            <div className="product-stats">
                              <span className="quantity">Qty: {product.totalQuantity}</span>
                              <span className="revenue">{formatCurrency(product.totalRevenue)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state small">
                    <Package className="empty-icon" />
                    <p>No product data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="analytics-card">
              <div className="card-header">
                <h3>Payment Methods</h3>
                <CreditCard size={18} />
              </div>
              <div className="card-content">
                {salesAnalytics?.paymentMethods?.length > 0 ? (
                  <div className="payment-methods-list">
                    {salesAnalytics.paymentMethods.map((method) => (
                      <div key={method._id} className="payment-method-item">
                        <div className="method-info">
                          <div className={`method-indicator ${method._id.toLowerCase()}`}></div>
                          <span className="method-name">{method._id}</span>
                        </div>
                        <div className="method-stats">
                          <span className="method-amount">
                            {formatCurrency(method.totalAmount)}
                          </span>
                          <span className="method-count">
                            {method.count} transactions
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state small">
                    <CreditCard className="empty-icon" />
                    <p>No payment data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* System Status */}
            <div className="analytics-card system-status">
              <div className="card-header">
                <h3>System Status</h3>
                <Shield size={18} />
              </div>
              <div className="card-content">
                <div className="status-items">
                  <div className="status-item">
                    <div className="status-indicator active"></div>
                    <span>POS System</span>
                    <span className="status-text">Online</span>
                  </div>
                  <div className="status-item">
                    <div className="status-indicator active"></div>
                    <span>Inventory Sync</span>
                    <span className="status-text">Active</span>
                  </div>
                  <div className="status-item">
                    <div className={`status-indicator ${brandingData?.features?.websiteEnabled ? 'active' : 'inactive'}`}></div>
                    <span>Website</span>
                    <span className="status-text">
                      {brandingData?.features?.websiteEnabled ? 'Live' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;  