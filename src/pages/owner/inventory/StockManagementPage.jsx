import React, { useState, useEffect } from 'react';
import { Package, RefreshCw } from 'lucide-react';
import apiClient from '../../../services/utils/apiClient';
import Swal from 'sweetalert2';
import './StockManagementPage.css';

const StockManagementPage = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch products from backend
  const fetchStockData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/inventory/products'); // GET endpoint
      if (response.data.success) {
        setStockData(response.data.data);
      } else {
        Swal.fire('Error', 'Failed to fetch products', 'error');
      }
    } catch (err) {
      Swal.fire('Error', err.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  // Update stock handler
  const handleUpdateStock = async (productId) => {
    const { value: quantity } = await Swal.fire({
      title: 'Update Stock',
      input: 'number',
      inputLabel: 'Enter number of packs to add',
      inputAttributes: { min: 0 },
      showCancelButton: true
    });

    if (quantity !== undefined && quantity !== null && quantity !== '') {
      try {
        const res = await apiClient.put(`/inventory/products/${productId}`, {
          stock: { fullPacks: Number(quantity) }
        });

        if (res.data.success) {
          Swal.fire('Success', 'Stock updated', 'success');
          fetchStockData(); // Refresh data
        } else {
          Swal.fire('Error', 'Failed to update stock', 'error');
        }
      } catch (err) {
        Swal.fire('Error', err.message || 'Something went wrong', 'error');
      }
    }
  };

  return (
    <div className="stock-management-page">
      <div className="page-header">
        <h1>Stock Management</h1>
        <button className="btn btn-secondary" onClick={fetchStockData}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="stock-grid">
          {stockData.map(item => (
            <div key={item._id} className="stock-card">
              <div className="stock-header">
                <h3>{item.name}</h3>
                <Package size={20} />
              </div>
              
              <div className="stock-levels">
                <div className="stock-info">
                  <span>Current: {item.stock.totalUnits}</span>
                  <span>Min: {item.stock.minStockLevel}</span>
                  <span>Max: {item.stock.maxStockLevel}</span>
                </div>
                
                <div className="stock-bar">
                  <div 
                    className="stock-progress"
                    style={{ 
                      width: `${(item.stock.totalUnits / item.stock.maxStockLevel) * 100}%`,
                      backgroundColor: item.stock.totalUnits === 0 
                        ? '#ff0000' 
                        : item.stock.totalUnits < item.stock.minStockLevel 
                          ? '#dc3545' 
                          : '#28a745'
                    }}
                  />
                </div>
              </div>

              <div className="stock-actions">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleUpdateStock(item._id)}
                >
                  Update Stock
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
 
export default StockManagementPage;
