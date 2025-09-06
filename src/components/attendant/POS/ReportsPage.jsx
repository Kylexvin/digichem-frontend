import React, { useState } from "react";
import {
  BarChart,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  Eye,
} from "lucide-react";

const ReportsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [selectedReport, setSelectedReport] = useState("sales");

  const reportTypes = [
    { id: "sales", label: "Sales Report", icon: TrendingUp },
    { id: "inventory", label: "Inventory Report", icon: BarChart },
    { id: "customers", label: "Customer Report", icon: PieChart },
    { id: "financial", label: "Financial Report", icon: LineChart },
  ];

  const periods = [
    { id: "today", label: "Today" },
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
    { id: "quarter", label: "This Quarter" },
    { id: "year", label: "This Year" },
  ];

  const mockSalesData = [
    { metric: "Total Sales", value: "KES 47,200", change: "+12.5%", trend: "up" },
    { metric: "Transactions", value: "127", change: "+8.2%", trend: "up" },
    { metric: "Avg. Sale", value: "KES 1,850", change: "-2.1%", trend: "down" },
    { metric: "Items Sold", value: "234", change: "+15.3%", trend: "up" },
  ];

  const topProducts = [
    { name: "Paracetamol 500mg", sold: 45, revenue: "KES 4,500" },
    { name: "Amoxicillin 250mg", sold: 32, revenue: "KES 6,400" },
    { name: "Ibuprofen 400mg", sold: 28, revenue: "KES 2,800" },
    { name: "Aspirin 100mg", sold: 23, revenue: "KES 2,300" },
  ];

  return (
    <div className="reports-page">
      {/* Header Section */}
      <div className="reports-header">
        <div className="reports-title-section">
          <h1 className="reports-title">Reports & Analytics</h1>
          <p className="reports-subtitle">Comprehensive business insights and performance metrics</p>
        </div>
        
        <div className="reports-actions">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-select"
          >
            {periods.map(period => (
              <option key={period.id} value={period.id}>{period.label}</option>
            ))}
          </select>
          
          <button className="action-btn">
            <Filter size={18} />
            Filter
          </button>
          
          <button className="action-btn primary">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="report-selector">
        {reportTypes.map(type => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              className={`report-type-btn ${selectedReport === type.id ? 'active' : ''}`}
              onClick={() => setSelectedReport(type.id)}
            >
              <Icon size={20} />
              {type.label}
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="reports-content">
        {/* Key Metrics Grid */}
        <div className="metrics-grid">
          {mockSalesData.map((metric, index) => (
            <div key={index} className="metric-card">
              <div className="metric-header">
                <h3 className="metric-title">{metric.metric}</h3>
                <div className={`metric-trend ${metric.trend}`}>
                  {metric.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                </div>
              </div>
              <div className="metric-value">{metric.value}</div>
              <div className={`metric-change ${metric.trend}`}>
                {metric.change} from last period
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-container">
            <div className="chart-header">
              <h3>Sales Trend</h3>
              <button className="view-btn">
                <Eye size={16} />
                View Details
              </button>
            </div>
            <div className="chart-placeholder">
              <BarChart size={64} className="chart-icon" />
              <p>Sales trend chart would be displayed here</p>
            </div>
          </div>

          <div className="chart-container">
            <div className="chart-header">
              <h3>Revenue Distribution</h3>
              <button className="view-btn">
                <Eye size={16} />
                View Details
              </button>
            </div>
            <div className="chart-placeholder">
              <PieChart size={64} className="chart-icon" />
              <p>Revenue distribution chart would be displayed here</p>
            </div>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="top-products-section">
          <div className="section-header">
            <h3>Top Selling Products</h3>
            <span className="period-label">{periods.find(p => p.id === selectedPeriod)?.label}</span>
          </div>
          
          <div className="products-table">
            <div className="table-header">
              <div className="col-product">Product</div>
              <div className="col-sold">Units Sold</div>
              <div className="col-revenue">Revenue</div>
            </div>
            
            {topProducts.map((product, index) => (
              <div key={index} className="table-row">
                <div className="col-product">
                  <div className="product-rank">#{index + 1}</div>
                  <div className="product-name">{product.name}</div>
                </div>
                <div className="col-sold">{product.sold}</div>
                <div className="col-revenue">{product.revenue}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;