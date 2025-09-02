import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/shared/LoginPage';
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage';
import StaffManagementPage from './pages/owner/StaffManagementPage';
import InventoryPage from './pages/owner/InventoryPage';
import ProductsPage from './pages/owner/inventory/ProductsPage';
import AddProductPage from './pages/owner/inventory/AddProductPage';
import StockManagementPage from './pages/owner/inventory/StockManagementPage';
import LowStockAlertsPage from './pages/owner/inventory/LowStockAlertsPage';
import StockReconciliationPage from './pages/owner/inventory/StockReconciliationPage';
import InventoryReportsPage from './pages/owner/inventory/InventoryReportsPage';
import ReportsPage from './pages/owner/ReportsPage';
import SettingsPage from './pages/owner/SettingsPage';
import WebsitePage from './pages/owner/WebsitePage';
import POSPage from './pages/attendant/POSPage';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';
import './App.css';
import MembersPage from './pages/owner/staff/MembersPage';
import AddMemberPage from './pages/owner/staff/AddMemberPage';
import AttendancePage from './pages/owner/staff/AttendancePage';
import SchedulesPage from './pages/owner/staff/SchedulesPage';
import AlertsPage from './pages/owner/staff/AlertsPage';
import ReportsPageStaff from './pages/owner/staff/ReportsPage';

const AppRoutes = () => {
  const { isLoading, brandingData } = useAuth();

  if (isLoading) {
    return (
      <div className="owner-dashboard" style={{
        '--primary-color': brandingData?.branding?.primaryColor || '#ffa600ff',
        '--secondary-color': brandingData?.branding?.secondaryColor || '#ec0606ff'
      }}>
        <div className="loading-container">
          <div className="pharmacy-loading">
            <div className="loading-pills">
              <div className="pill pill-1"></div>
              <div className="pill pill-2"></div>
              <div className="pill pill-3"></div>
            </div>
            <p>Loading ...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Owner Routes */}
      <Route path="/owner/dashboard" element={<ProtectedRoute requiredRole="pharmacy_owner"><OwnerDashboardPage /></ProtectedRoute>} />
      <Route path="/owner/staff" element={<ProtectedRoute requiredRole="pharmacy_owner"><StaffManagementPage /></ProtectedRoute>} />

      {/* Inventory routes */}
      <Route path="/owner/inventory" element={<ProtectedRoute requiredRole="pharmacy_owner"><InventoryPage /></ProtectedRoute>} />
      <Route path="/owner/inventory/products" element={<ProtectedRoute requiredRole="pharmacy_owner"><ProductsPage /></ProtectedRoute>} />
      <Route path="/owner/inventory/add-product" element={<ProtectedRoute requiredRole="pharmacy_owner"><AddProductPage /></ProtectedRoute>} />
      <Route path="/owner/inventory/stock-management" element={<ProtectedRoute requiredRole="pharmacy_owner"><StockManagementPage /></ProtectedRoute>} />
      <Route path="/owner/inventory/low-stock-alerts" element={<ProtectedRoute requiredRole="pharmacy_owner"><LowStockAlertsPage /></ProtectedRoute>} />
      <Route path="/owner/inventory/stock-reconciliation" element={<ProtectedRoute requiredRole="pharmacy_owner"><StockReconciliationPage /></ProtectedRoute>} />
      <Route path="/owner/inventory/reports" element={<ProtectedRoute requiredRole="pharmacy_owner"><InventoryReportsPage /></ProtectedRoute>} />

      <Route path="/owner/reports" element={<ProtectedRoute requiredRole="pharmacy_owner"><ReportsPage /></ProtectedRoute>} />
      <Route path="/owner/settings" element={<ProtectedRoute requiredRole="pharmacy_owner"><SettingsPage /></ProtectedRoute>} />
      <Route path="/owner/website" element={<ProtectedRoute requiredRole="pharmacy_owner"><WebsitePage /></ProtectedRoute>} />
      <Route path="/owner/pos" element={<ProtectedRoute requiredRole="pharmacy_owner"><POSPage /></ProtectedRoute>} />
      <Route path="/owner/subscriptions" element={<ProtectedRoute requiredRole="pharmacy_owner"><div>Subscriptions Page (to be implemented)</div></ProtectedRoute>} />
      <Route path="/owner/support" element={<ProtectedRoute requiredRole="pharmacy_owner"><div>Support Page (to be implemented)</div></ProtectedRoute>} />

      {/* Staff Management routes */}
      <Route path="/owner/staff/members" element={<ProtectedRoute requiredRole="pharmacy_owner"><MembersPage /></ProtectedRoute>} />
      <Route path="/owner/staff/add-member" element={<ProtectedRoute requiredRole="pharmacy_owner"><AddMemberPage /></ProtectedRoute>} />
      <Route path="/owner/staff/attendance" element={<ProtectedRoute requiredRole="pharmacy_owner"><AttendancePage /></ProtectedRoute>} />
      <Route path="/owner/staff/schedules" element={<ProtectedRoute requiredRole="pharmacy_owner"><SchedulesPage /></ProtectedRoute>} />
      <Route path="/owner/staff/alerts" element={<ProtectedRoute requiredRole="pharmacy_owner"><AlertsPage /></ProtectedRoute>} />
      <Route path="/owner/staff/reports" element={<ProtectedRoute requiredRole="pharmacy_owner"><ReportsPageStaff /></ProtectedRoute>} />
      
      {/* Attendant route */}
      <Route path="/attendant/pos" element={<ProtectedRoute requiredRole="attendant"><POSPage /></ProtectedRoute>} />

      <Route path="/unauthorized" element={<div>Access Denied</div>} />
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
