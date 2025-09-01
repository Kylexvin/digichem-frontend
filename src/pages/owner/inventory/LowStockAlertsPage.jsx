// src/pages/owner/inventory/LowStockAlertsPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../services/utils/apiClient';

const LowStockAlertsPage = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        const response = await apiClient.get('/products');
        const products = response.data || [];

        // filter products below minStockLevel
        const lowStock = products.filter(
          (p) =>
            p.stock &&
            (p.stock.fullPacks || 0) < (p.stock.minStockLevel || 0)
        );

        setLowStockProducts(lowStock);
      } catch (error) {
        console.error('Error fetching low stock products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockProducts();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Low Stock Alerts</h2>
        <button
          onClick={() => navigate('/owner/inventory/stock-management')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700"
        >
          Go to Stock Management
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : lowStockProducts.length === 0 ? (
        <p className="text-green-600">All products are above minimum stock levels.</p>
      ) : (
        <div className="grid gap-4">
          {lowStockProducts.map((product) => (
            <div
              key={product._id}
              className="p-4 border rounded-lg bg-red-50 border-red-300"
            >
              <h3 className="text-lg font-semibold text-red-700">{product.name}</h3>
              <p>
                Current: <span className="font-bold text-red-600">{product.stock?.fullPacks || 0}</span>
              </p>
              <p>Minimum Required: {product.stock?.minStockLevel || 0}</p>
              <p>Maximum: {product.stock?.maxStockLevel || '-'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LowStockAlertsPage;
