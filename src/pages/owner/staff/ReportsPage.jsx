import React, { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, Award, Activity, Calendar, BarChart3, PieChart } from 'lucide-react';
import apiClient from '../../../services/utils/apiClient';
import './ReportsPageStaff.css';

const ReportsPageStaff = () => {
  const [staffStats, setStaffStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');

  useEffect(() => {
    fetchStaffStats();
  }, [selectedTimeRange]);

  const fetchStaffStats = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/staff/stats?timeRange=${selectedTimeRange}`);
      
      // Parse the actual API response structure
      const apiData = response.data?.data || response.data;
      
      // Transform the API data to match component expectations
      const transformedData = {
        staff: apiData.staff || [],
        timeRange: apiData.timeRange,
        // Calculate totals from staff array
        totalStaff: apiData.staff?.length || 0,
        activeStaff: apiData.staff?.filter(s => s.status === 'active').length || 0,
        totalSales: apiData.staff?.reduce((sum, s) => sum + (s.performance?.totalSales || 0), 0) || 0,
        totalTransactions: apiData.staff?.reduce((sum, s) => sum + (s.performance?.totalTransactions || 0), 0) || 0,
        // Get top performers (staff with sales > 0)
        topPerformers: apiData.staff?.filter(s => s.performance?.totalSales > 0)
          .sort((a, b) => (b.performance?.totalSales || 0) - (a.performance?.totalSales || 0))
          .map(staff => ({
            id: staff._id,
            name: staff.name,
            email: staff.email,
            totalSales: staff.performance?.totalSales || 0,
            totalTransactions: staff.performance?.totalTransactions || 0,
            avgTransaction: staff.performance?.averageTransaction || 0
          })) || []
      };
      
      setStaffStats(transformedData);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch staff statistics');
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
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Custom Bar Chart Component
  const BarChart = ({ data, title, valueKey, labelKey, color = '#3b82f6' }) => {
    if (!data || data.length === 0) {
      return (
        <div className="chart-empty">
          <BarChart3 size={48} />
          <p>No data available</p>
        </div>
      );
    }

    const maxValue = Math.max(...data.map(item => item[valueKey] || 0));

    return (
      <div className="custom-chart">
        <h3 className="chart-title">{title}</h3>
        <div className="bar-chart">
          {data.map((item, index) => (
            <div key={index} className="bar-item">
              <div className="bar-label">{item[labelKey]}</div>
              <div className="bar-container">
                <div 
                  className="bar-fill"
                  style={{ 
                    width: `${maxValue > 0 ? (item[valueKey] / maxValue) * 100 : 0}%`,
                    backgroundColor: color,
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <span className="bar-value">
                    {valueKey.includes('sales') || valueKey.includes('Sales') 
                      ? formatCurrency(item[valueKey]) 
                      : item[valueKey]}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Custom Pie Chart Component
  const CustomPieChart = ({ data, title }) => {
    if (!data || data.length === 0) return null;

    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
    let currentAngle = 0;

    return (
      <div className="custom-chart">
        <h3 className="chart-title">{title}</h3>
        <div className="pie-chart-container">
          <div className="pie-chart">
            <svg width="200" height="200" viewBox="0 0 200 200">
              {data.map((item, index) => {
                const percentage = total > 0 ? (item.value / total) * 100 : 0;
                const angle = (percentage / 100) * 360;
                
                const startAngle = currentAngle;
                const endAngle = currentAngle + angle;
                
                const startAngleRad = (startAngle * Math.PI) / 180;
                const endAngleRad = (endAngle * Math.PI) / 180;
                
                const largeArcFlag = angle > 180 ? 1 : 0;
                
                const x1 = 100 + 80 * Math.cos(startAngleRad);
                const y1 = 100 + 80 * Math.sin(startAngleRad);
                const x2 = 100 + 80 * Math.cos(endAngleRad);
                const y2 = 100 + 80 * Math.sin(endAngleRad);
                
                const pathData = [
                  `M 100 100`,
                  `L ${x1} ${y1}`,
                  `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  `Z`
                ].join(' ');
                
                currentAngle += angle;
                
                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={item.color}
                    className="pie-slice"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  />
                );
              })}
            </svg>
          </div>
          <div className="pie-legend">
            {data.map((item, index) => (
              <div key={index} className="legend-item">
                <div 
                  className="legend-color" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="legend-label">{item.label}</span>
                <span className="legend-value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <h2>Loading Staff Reports...</h2>
          <p>Fetching performance data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>Error Loading Reports</h2>
          <p>{error}</p>
          <button onClick={fetchStaffStats} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Prepare data for charts (assuming API structure)
  const totalStaff = staffStats?.totalStaff || 0;
  const activeStaff = staffStats?.activeStaff || 0;
  const totalSales = staffStats?.totalSales || 0;
  const totalTransactions = staffStats?.totalTransactions || 0;
  
  const topPerformers = staffStats?.topPerformers || [];
  const performanceData = staffStats?.performanceData || [];
  const statusDistribution = [
    { label: 'Active Staff', value: activeStaff, color: '#10b981' },
    { label: 'Inactive Staff', value: totalStaff - activeStaff, color: '#6b7280' }
  ];

  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="header-section">
        <div className="header-content">
          <h1 className="page-title">Staff Performance Reports</h1>
          <p className="page-subtitle">
            Comprehensive analytics and performance metrics for your team
          </p>
        </div>
        
        <div className="time-range-selector">
          <label htmlFor="timeRange">Time Range:</label>
          <select 
            id="timeRange"
            value={selectedTimeRange} 
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="time-select"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-section">
        <div className="metrics-grid">
          <div className="metric-card primary">
            <div className="metric-icon">
              <Users size={24} />
            </div>
            <div className="metric-content">
              <h3>Total Staff</h3>
              <div className="metric-value">{totalStaff}</div>
              <div className="metric-change positive">
                +{activeStaff} active
              </div>
            </div>
          </div>

          <div className="metric-card success">
            <div className="metric-icon">
              <DollarSign size={24} />
            </div>
            <div className="metric-content">
              <h3>Total Sales</h3>
              <div className="metric-value">{formatCurrency(totalSales)}</div>
              <div className="metric-change positive">
                {totalTransactions} transactions
              </div>
            </div>
          </div>

          <div className="metric-card warning">
            <div className="metric-icon">
              <TrendingUp size={24} />
            </div>
            <div className="metric-content">
              <h3>Avg. Performance</h3>
              <div className="metric-value">
                {totalStaff > 0 ? formatCurrency(totalSales / totalStaff) : formatCurrency(0)}
              </div>
              <div className="metric-change neutral">
                per staff member
              </div>
            </div>
          </div>

          <div className="metric-card info">
            <div className="metric-icon">
              <Activity size={24} />
            </div>
            <div className="metric-content">
              <h3>Activity Rate</h3>
              <div className="metric-value">
                {totalStaff > 0 ? Math.round((activeStaff / totalStaff) * 100) : 0}%
              </div>
              <div className="metric-change neutral">
                staff active
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="charts-grid">
          <div className="chart-card">
            <BarChart 
              data={topPerformers}
              title="Top Performers by Sales"
              valueKey="totalSales"
              labelKey="name"
              color="#10b981"
            />
          </div>

          <div className="chart-card">
            <CustomPieChart 
              data={statusDistribution}
              title="Staff Status Distribution"
            />
          </div>
        </div>

        <div className="chart-card full-width">
          <BarChart 
            data={performanceData}
            title="Performance by Department"
            valueKey="performance"
            labelKey="department"
            color="#3b82f6"
          />
        </div>
      </div>

      {/* Top Performers Table */}
      <div className="table-section">
        <div className="table-card">
          <div className="table-header">
            <h2>Top Performers</h2>
            <div className="table-actions">
              <button className="export-btn">Export Report</button>
            </div>
          </div>
          
          <div className="table-container">
            <table className="performance-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Staff Member</th>
                  <th>Total Sales</th>
                  <th>Transactions</th>
                  <th>Avg. Transaction</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                {topPerformers.map((staff, index) => (
                  <tr key={staff.id || index} className="table-row">
                    <td>
                      <div className="rank-badge">#{index + 1}</div>
                    </td>
                    <td>
                      <div className="staff-info">
                        <div className="staff-avatar">
                          {staff.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="staff-details">
                          <div className="staff-name">{staff.name}</div>
                          <div className="staff-email">{staff.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="currency">{formatCurrency(staff.totalSales)}</td>
                    <td>{staff.totalTransactions || 0}</td>
                    <td className="currency">
                      {formatCurrency(staff.avgTransaction || 0)}
                    </td>
                    <td>
                      <div className="performance-bar">
                        <div 
                          className="performance-fill"
                          style={{ 
                            width: `${Math.min((staff.totalSales / Math.max(...topPerformers.map(p => p.totalSales || 0))) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="summary-section">
        <div className="summary-card">
          <div className="summary-header">
            <Award size={24} />
            <h3>Performance Summary</h3>
          </div>
          <div className="summary-content">
            <div className="summary-item">
              <label>Report Period:</label>
              <span>{selectedTimeRange.charAt(0).toUpperCase() + selectedTimeRange.slice(1)}</span>
            </div>
            <div className="summary-item">
              <label>Generated:</label>
              <span>{formatDate(new Date().toISOString())}</span>
            </div>
            <div className="summary-item">
              <label>Total Revenue:</label>
              <span className="highlight">{formatCurrency(totalSales)}</span>
            </div>
            <div className="summary-item">
              <label>Active Staff:</label>
              <span className="highlight">{activeStaff} of {totalStaff}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPageStaff;