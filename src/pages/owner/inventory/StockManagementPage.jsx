import React, { useState } from 'react';
import { Package, TrendingUp, RefreshCw } from 'lucide-react';
import './StockManagementPage.css';

const StockManagementPage = () => {
  const [stockData] = useState([
    { id: 1, name: 'Paracetamol 500mg', current: 45, min: 10, max: 100 },
    { id: 2, name: 'Amoxicillin 250mg', current: 12, min: 15, max: 80 },
    { id: 3, name: 'Vitamin C 1000mg', current: 78, min: 20, max: 150 },
    { id: 4, name: 'Ibuprofen 400mg', current: 5, min: 10, max: 50 },
    { id: 5, name: 'Omeprazole 20mg', current: 23, min: 15, max: 60 }
  ]);

  return (
    <div className="stock-management-page">
      <div className="page-header">
        <h1>Stock Management</h1>
        <button className="btn btn-secondary">
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="stock-grid">
        {stockData.map(item => (
          <div key={item.id} className="stock-card">
            <div className="stock-header">
              <h3>{item.name}</h3>
              <Package size={20} />
            </div>
            
            <div className="stock-levels">
              <div className="stock-info">
                <span>Current: {item.current}</span>
                <span>Min: {item.min}</span>
                <span>Max: {item.max}</span>
              </div>
              
              <div className="stock-bar">
                <div 
                  className="stock-progress"
                  style={{ 
                    width: `${(item.current / item.max) * 100}%`,
                    backgroundColor: item.current < item.min ? '#dc3545' : '#28a745'
                  }}
                />
              </div>
            </div>

            <div className="stock-actions">
              <button className="btn btn-sm btn-primary">
                Update Stock
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockManagementPage;