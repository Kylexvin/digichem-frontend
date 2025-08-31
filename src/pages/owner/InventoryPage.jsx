import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Plus, 
  TrendingUp, 
  AlertTriangle,
  BarChart3,
  RefreshCw,
  AlertCircle,
  Activity,
  DollarSign,
  ShoppingCart,
  
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/utils/apiClient';
import './InventoryPage.css';

const InventoryPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const inventoryActions = [
    {
      icon: Package,
      label: 'View Products',
      path: '/owner/inventory/products',
      color: 'blue',
      description: 'Browse and manage all products'
    },
    {
      icon: Plus,
      label: 'Add Product',
      path: '/owner/inventory/add-product',
      color: 'green',
      description: 'Create new product entries'
    },
    {
      icon: TrendingUp,
      label: 'Stock Management',
      path: '/owner/inventory/stock-management',
      color: 'purple',
      description: 'Update stock levels and track inventory'
    },
    {
      icon: AlertTriangle,
      label: 'Low Stock Alerts',
      path: '/owner/inventory/low-stock-alerts',
      color: 'orange',
      description: 'View products needing restock'
    },
    {
      icon: BarChart3,
      label: 'Stock Reconciliation',
      path: '/owner/inventory/stock-reconciliation',
      color: 'red',
      description: 'Manage stock counts and adjustments'
    },
    {
      icon: Activity,
      label: 'Inventory Reports',
      path: '/owner/inventory/reports',
      color: 'indigo',
      description: 'Analytics and inventory insights'
    }
  ];

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the actual API endpoint
      const response = await apiClient.get('/inventory/overview');
      
      if (response.data && response.data.success) {
        setDashboardData(response.data.data);
      } else {
        throw new Error('Invalid response format');
      }

    } catch (error) {
      console.error('Error fetching inventory data:', error);
      setError('Failed to load inventory data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (actionType) => {
    switch(actionType) {
      case 'sale':
        return <ShoppingCart size={20} />;
      case 'create':
        return <Plus size={20} />;
      case 'stock_adjustment':
        return <RefreshCw size={20} />;
      case 'low_stock_alert':
        return <AlertCircle size={20} />;
      case 'reconciliation':
        return <BarChart3 size={20} />;
      default:
        return <Package size={20} />;
    }
  };

  const getActivityColor = (actionType) => {
    switch(actionType) {
      case 'sale':
        return 'green';
      case 'create':
        return 'blue';
      case 'stock_adjustment':
        return 'orange';
      case 'low_stock_alert':
        return 'orange';
      case 'reconciliation':
        return 'blue';
      default:
        return 'gray';
    }
  };

 

  return (
    <div className="inventory-overview">
      {/* Header */}
      <div className="inventory-header">
        <div className="header-content">
          <h1>Inventory Management</h1>
          <p>Manage your products, stock levels, and inventory analytics</p>
        </div>
        <div className="header-actions">
          <button 
            onClick={fetchInventoryData}
            className="refresh-btn"
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh Data
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="header-stats">
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <span className="stat-number">{dashboardData?.products?.total || 0}</span>
              <p className="stat-label">Total Products</p>
            </div>
            <Package size={24} />
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <div>
              <span className="stat-number">{dashboardData?.products?.lowStock || 0}</span>
              <p className="stat-label">Low Stock Items</p>
            </div>
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-header">
            <div>
              <span className="stat-number">{dashboardData?.reconciliations?.pending || 0}</span>
              <p className="stat-label">Pending Reconciliations</p>
            </div>
            <BarChart3 size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <span className="stat-number">{formatCurrency(dashboardData?.products?.totalValue)}</span>
              <p className="stat-label">Total Inventory Value</p>
            </div>
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="inventory-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          {inventoryActions.map((action, index) => {
            let badge = null;
            if (action.label === 'Stock Reconciliation' && dashboardData?.reconciliations?.pending > 0) {
              badge = dashboardData.reconciliations.pending;
            }
            if (action.label === 'Low Stock Alerts' && dashboardData?.products?.lowStock > 0) {
              badge = dashboardData.products.lowStock;
            }

            return (
              <Link
                key={index}
                to={action.path}
                className={`action-card ${action.color}`}
              >
                <div className="action-icon">
                  <action.icon size={24} />
                  {badge && badge > 0 && (
                    <span className="action-badge">{badge}</span>
                  )}
                </div>
                <div className="action-content">
                  <h3>{action.label}</h3>
                  <p>{action.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="recent-activity">
        <div className="activity-header">
          <h2>Recent Activity</h2>
          <Link to="/owner/inventory/logs" className="view-all-link">
            View All Activity →
          </Link>
        </div>
        
        {dashboardData?.recentLogs && dashboardData.recentLogs.length > 0 ? (
          <div className="activity-list">
            {dashboardData.recentLogs.slice(0, 5).map((activity, index) => (
              <div key={activity._id || index} className="activity-item">
                <div className={`activity-icon ${getActivityColor(activity.action)}`}>
                  {getActivityIcon(activity.action)}
                </div>
                <div className="activity-details">
                  <p className="activity-description">
                    <strong>{activity.action.toUpperCase()}</strong> - {activity.product?.name || activity.details?.productName || 'Unknown Product'}
                    {activity.details?.quantity && ` (Qty: ${activity.details.quantity})`}
                  </p>
                  <span className="activity-time">
                    {formatDate(activity.createdAt)}
                  </span>
                </div>
                <div className="activity-meta">
                  {activity.details?.totalAmount && (
                    <span className="product-name">
                      {formatCurrency(activity.details.totalAmount)}
                    </span>
                  )}
                  {activity.details?.receiptNumber && (
                    <span className="quantity-change positive">
                      #{activity.details.receiptNumber}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="activity-placeholder">
            <Activity size={48} />
            <p>No recent activity</p>
            <span>Inventory changes will appear here</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;