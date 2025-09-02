import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  TrendingUp, 
  AlertTriangle,
  BarChart3,
  RefreshCw,
  AlertCircle,
  Activity,
  DollarSign,
  UserCheck,
  Clock,
  Calendar,
  UserPlus,
  Settings,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import  apiClient  from '../../services/utils/apiClient';
import './InventoryPage.css'; // Reusing the same CSS file

const StaffManagementPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const staffActions = [
    {
      icon: Users,
      label: 'View Staff',
      path: '/owner/staff/members',
      color: 'blue',
      description: 'Browse and manage all staff members'
    },
    {
      icon: UserPlus,
      label: 'Add Staff Member',
      path: '/owner/staff/add-member',
      color: 'green',
      description: 'Register new staff members'
    },
    
    {
      icon: BarChart3,
      label: 'Performance Reports',
      path: '/owner/staff/reports',
      color: 'red',
      description: 'Analytics and staff performance insights'
    }
  ];

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the actual API endpoint for staff data
      const response = await apiClient.get('/staff/overview');
      
      if (response.data && response.data.success) {
        setDashboardData(response.data.data);
      } else {
        throw new Error('Invalid response format');
      }

    } catch (error) {
      console.error('Error fetching staff data:', error);
      setError('Failed to load staff data. Please try again.');
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
      case 'clock_in':
        return <UserCheck size={20} />;
      case 'clock_out':
        return <Clock size={20} />;
      case 'staff_added':
        return <UserPlus size={20} />;
      case 'schedule_updated':
        return <Calendar size={20} />;
      case 'performance_review':
        return <Award size={20} />;
      case 'attendance_alert':
        return <AlertCircle size={20} />;
      default:
        return <Users size={20} />;
    }
  };

  const getActivityColor = (actionType) => {
    switch(actionType) {
      case 'clock_in':
        return 'green';
      case 'clock_out':
        return 'blue';
      case 'staff_added':
        return 'blue';
      case 'schedule_updated':
        return 'purple';
      case 'performance_review':
        return 'indigo';
      case 'attendance_alert':
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <div className="inventory-overview">
      {/* Header */}
      <div className="inventory-header">
        <div className="header-content">
          <h1>Staff Management</h1>
          <p>Manage your team members, attendance, and staff analytics</p>
        </div>
        <div className="header-actions">
          <button 
            onClick={fetchStaffData}
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
     {/* Stats Cards */}
<div className="header-stats">
  <div className="stat-card">
    <div className="stat-header">
      <div>
        <span className="stat-number">{dashboardData?.summary?.totalStaff || 0}</span>
        <p className="stat-label">Total Staff</p>
      </div>
      <Users size={24} />
    </div>
  </div>

  <div className="stat-card info">
    <div className="stat-header">
      <div>
        <span className="stat-number">{dashboardData?.summary?.activeStaff || 0}</span>
        <p className="stat-label">Active Staff</p>
      </div>
      <UserCheck size={24} />
    </div>
  </div>

  <div className="stat-card warning">
    <div className="stat-header">
      <div>
        <span className="stat-number">{dashboardData?.summary?.staffUtilization || 0}%</span>
        <p className="stat-label">Staff Utilization</p>
      </div>
      <AlertTriangle size={24} />
    </div>
  </div>

  <div className="stat-card">
    <div className="stat-header">
      <div>
        <span className="stat-number">{formatCurrency(dashboardData?.summary?.totalSales)}</span>
        <p className="stat-label">Total Sales</p>
      </div>
      <DollarSign size={24} />
    </div>
  </div>
</div>


      {/* Quick Actions Grid */}
      <div className="inventory-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          {staffActions.map((action, index) => {
            let badge = null;
            if (action.label === 'Staff Alerts' && dashboardData?.staff?.alerts > 0) {
              badge = dashboardData.staff.alerts;
            }
            if (action.label === 'Schedule Management' && dashboardData?.schedules?.pending > 0) {
              badge = dashboardData.schedules.pending;
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
          <Link to="/owner/staff/logs" className="view-all-link">
            View All Activity →
          </Link>
        </div>
        
{dashboardData?.staffMembers?.length > 0 ? (
  <div className="activity-list">
    {dashboardData.staffMembers.map(staff => (
      <React.Fragment key={staff._id}>
        {staff.recentActivities.slice(0, 5).map((activity, index) => (
          <div key={index} className="activity-item">
            <div className={`activity-icon ${getActivityColor(activity.action)}`}>
              {getActivityIcon(activity.action)}
            </div>
            <div className="activity-details">
              <p className="activity-description">
                <strong>{activity.action.replace('_', ' ').toUpperCase()}</strong> - {staff.name}
              </p>
              <span className="activity-time">{formatDate(activity.createdAt)}</span>
            </div>
            <div className="activity-meta">
              {activity.details?.totalAmount && (
                <span className="product-name">{formatCurrency(activity.details.totalAmount)}</span>
              )}
            </div>
          </div>
        ))}
      </React.Fragment>
    ))}
  </div>
) : (
  <div className="activity-placeholder">
    <Activity size={48} />
    <p>No recent activity</p>
    <span>Staff activities will appear here</span>
  </div>
)}

      </div>
    </div>
  );
};

export default StaffManagementPage;