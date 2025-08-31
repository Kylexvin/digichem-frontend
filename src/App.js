// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';
import LoginPage from './pages/shared/LoginPage';
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage';
import InventoryPage from './pages/owner/InventoryPage';
import ProductsPage from './pages/owner/inventory/ProductsPage';
import AddProductPage from './pages/owner/inventory/AddProductPage';
import StockManagementPage from './pages/owner/inventory/StockManagementPage';
import LowStockAlertsPage from './pages/owner/inventory/LowStockAlertsPage';
import StockReconciliationPage from './pages/owner/inventory/StockReconciliationPage';
import InventoryReportsPage from './pages/owner/inventory/InventoryReportsPage';
import NotFoundPage from './pages/shared/NotFoundPage';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [brandingData, setBrandingData] = useState(null);

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/pharmacy/branding');
        const data = await res.json();
        if (data.success && data.data?.branding) {
          setBrandingData(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch branding, using default', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBranding();
  }, []);

  if (loading) {
    return (
      <div
        className="owner-dashboard"
        style={{
          '--primary-color': brandingData?.branding?.primaryColor || '#ffa600ff',
          '--secondary-color': brandingData?.branding?.secondaryColor || '#ec0606ff'
        }}
      >
        <div className="loading-container">
          <div className="pharmacy-loading">
            <div className="loading-pills">
              <div className="pill pill-1"></div>
              <div className="pill pill-2"></div>
              <div className="pill pill-3"></div>
            </div>
            <p>Loading your pharmacy dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route
              path="/unauthorized"
              element={
                <div className="unauthorized-page">
                  <h1>Unauthorized</h1>
                  <p>You don't have permission to access this resource.</p>
                  <Navigate to="/login" replace />
                </div>
              }
            />
            <Route
              path="/owner/*"
              element={
                <ProtectedRoute requiredRoles={['pharmacy_owner']}>
                  <Routes>
                    <Route path="dashboard" element={<OwnerDashboardPage />} />

                    {/* Inventory nested routes */}
                    <Route path="inventory" element={<InventoryPage />} />
                    <Route path="inventory/products" element={<ProductsPage />} />
                    <Route path="inventory/add-product" element={<AddProductPage />} />
                    <Route path="inventory/stock-management" element={<StockManagementPage />} />
                    <Route path="inventory/low-stock-alerts" element={<LowStockAlertsPage />} />
                    <Route path="inventory/stock-reconciliation" element={<StockReconciliationPage />} />
                    <Route path="inventory/reports" element={<InventoryReportsPage />} />

                    <Route path="*" element={<Navigate to="/owner/dashboard" replace />} />
                  </Routes>
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendant/*"
              element={
                <ProtectedRoute requiredRoles={['pharmacy_attendant']}>
                  <div>Attendant Dashboard - To be implemented</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to="/owner/dashboard" replace />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
