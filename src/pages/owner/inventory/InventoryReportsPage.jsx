import React from 'react';
import { BarChart3, Download, Filter, Calendar } from 'lucide-react';
import './InventoryReportsPage.css';

const InventoryReportsPage = () => {
  const reports = [
    { id: 1, title: 'Inventory Valuation Report', date: '2024-01-15', type: 'Financial' },
    { id: 2, title: 'Stock Movement Analysis', date: '2024-01-14', type: 'Analytics' },
    { id: 3, title: 'Slow Moving Items', date: '2024-01-13', type: 'Performance' },
    { id: 4, title: 'Expiry Date Tracking', date: '2024-01-12', type: 'Compliance' }
  ];

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Inventory Reports</h1>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <Filter size={16} />
            Filter
          </button>
          <button className="btn btn-secondary">
            <Calendar size={16} />
            Date Range
          </button>
        </div>
      </div>

      <div className="reports-grid">
        {reports.map(report => (
          <div key={report.id} className="report-card">
            <div className="report-icon">
              <BarChart3 size={32} />
            </div>
            
            <div className="report-content">
              <h3>{report.title}</h3>
              <p className="report-type">{report.type}</p>
              <p className="report-date">Generated: {report.date}</p>
            </div>

            <div className="report-actions">
              <button className="btn btn-primary">
                <Download size={16} />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-stats">
        <h2>Quick Statistics</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">KES 1,245,800</span>
            <span className="stat-label">Total Inventory Value</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">156</span>
            <span className="stat-label">Total Products</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">12</span>
            <span className="stat-label">Low Stock Items</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">KES 45,200</span>
            <span className="stat-label">Monthly Movement</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryReportsPage;