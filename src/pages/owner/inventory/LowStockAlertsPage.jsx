import React from 'react';
import { AlertTriangle, Package, Plus } from 'lucide-react';
import './LowStockAlertsPage.css';

const LowStockAlertsPage = () => {
  const lowStockItems = [
    { id: 1, name: 'Ibuprofen 400mg', current: 5, min: 10, needed: 45 },
    { id: 2, name: 'Amoxicillin 250mg', current: 12, min: 15, needed: 38 },
    { id: 3, name: 'Aspirin 75mg', current: 8, min: 12, needed: 42 }
  ];

  return (
    <div className="low-stock-page">
      <div className="page-header">
        <h1>Low Stock Alerts</h1>
        <div className="alert-count">
          <AlertTriangle size={20} />
          <span>{lowStockItems.length} items need restocking</span>
        </div>
      </div>

      <div className="alerts-grid">
        {lowStockItems.map(item => (
          <div key={item.id} className="alert-card critical">
            <div className="alert-header">
              <AlertTriangle size={24} />
              <h3>{item.name}</h3>
            </div>
            
            <div className="alert-details">
              <div className="stock-info">
                <span>Current: {item.current}</span>
                <span>Minimum: {item.min}</span>
                <span>Needed: {item.needed}</span>
              </div>
              
              <div className="urgency-badge">
                {item.current === 0 ? 'OUT OF STOCK' : 'LOW STOCK'}
              </div>
            </div>

            <div className="alert-actions">
              <button className="btn btn-primary">
                <Plus size={16} />
                Restock Now
              </button>
              <button className="btn btn-secondary">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStockAlertsPage;