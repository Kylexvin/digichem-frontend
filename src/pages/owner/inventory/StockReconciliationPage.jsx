import React, { useState } from 'react';
import { BarChart3, CheckCircle, Clock, FileText } from 'lucide-react';
import './StockReconciliationPage.css';

const StockReconciliationPage = () => {
  const [reconciliations] = useState([
    { id: 1, date: '2024-01-15', items: 45, status: 'completed', variance: 2 },
    { id: 2, date: '2024-01-08', items: 38, status: 'completed', variance: 5 },
    { id: 3, date: '2024-01-01', items: 42, status: 'pending', variance: null }
  ]);

  return (
    <div className="reconciliation-page">
      <div className="page-header">
        <h1>Stock Reconciliation</h1>
        <button className="btn btn-primary">
          <BarChart3 size={16} />
          New Reconciliation
        </button>
      </div>

      <div className="reconciliation-list">
        <h2>Recent Reconciliations</h2>
        
        <div className="reconciliation-table">
          <div className="table-header">
            <span>Date</span>
            <span>Items Count</span>
            <span>Status</span>
            <span>Variance</span>
            <span>Actions</span>
          </div>

          {reconciliations.map(recon => (
            <div key={recon.id} className="table-row">
              <span>{recon.date}</span>
              <span>{recon.items} items</span>
              <span className={`status ${recon.status}`}>
                {recon.status === 'completed' ? <CheckCircle size={16} /> : <Clock size={16} />}
                {recon.status}
              </span>
              <span className={recon.variance > 0 ? 'variance positive' : 'variance'}>
                {recon.variance !== null ? `${recon.variance} items` : '-'}
              </span>
              <span className="actions">
                <button className="btn-icon">
                  <FileText size={16} />
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockReconciliationPage;