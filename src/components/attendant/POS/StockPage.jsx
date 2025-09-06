import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Package,
  AlertTriangle,
  TrendingDown,
  Calendar,
  Barcode,
  Eye,
  Edit,
  RefreshCw,
  Download,
  Upload,
} from "lucide-react";

const StockPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const tabs = [
    { id: "all", label: "All Items", count: 245 },
    { id: "low", label: "Low Stock", count: 18 },
    { id: "expired", label: "Expired", count: 5 },
    { id: "expiring", label: "Expiring Soon", count: 12 },
  ];

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "antibiotics", label: "Antibiotics" },
    { id: "painkillers", label: "Pain Killers" },
    { id: "vitamins", label: "Vitamins" },
    { id: "diabetes", label: "Diabetes Care" },
    { id: "cardiac", label: "Cardiac" },
    { id: "respiratory", label: "Respiratory" },
  ];

  const mockStockItems = [
    {
      id: "MED001",
      name: "Amoxicillin 500mg",
      category: "Antibiotics",
      brand: "Cipla",
      currentStock: 45,
      minStock: 20,
      maxStock: 200,
      unitPrice: 15.50,
      expiryDate: "2025-06-15",
      batchNumber: "AMX2024001",
      supplier: "PharmaCorp Ltd",
      location: "A-1-01",
      status: "good"
    },
    {
      id: "MED002",
      name: "Paracetamol 500mg",
      category: "Pain Killers",
      brand: "GSK",
      currentStock: 8,
      minStock: 25,
      maxStock: 150,
      unitPrice: 5.00,
      expiryDate: "2024-12-30",
      batchNumber: "PAR2024002",
      supplier: "MedSupply Co",
      location: "B-2-05",
      status: "low"
    },
    {
      id: "MED003",
      name: "Insulin Glargine",
      category: "Diabetes Care",
      brand: "Sanofi",
      currentStock: 12,
      minStock: 10,
      maxStock: 50,
      unitPrice: 85.00,
      expiryDate: "2024-03-15",
      batchNumber: "INS2024003",
      supplier: "DiabetesCare Ltd",
      location: "C-1-02",
      status: "expiring"
    },
    {
      id: "MED004",
      name: "Aspirin 100mg",
      category: "Cardiac",
      brand: "Bayer",
      currentStock: 0,
      minStock: 30,
      maxStock: 100,
      unitPrice: 8.50,
      expiryDate: "2024-01-10",
      batchNumber: "ASP2023004",
      supplier: "CardioMed",
      location: "D-3-01",
      status: "expired"
    },
    {
      id: "MED005",
      name: "Vitamin D3 1000IU",
      category: "Vitamins",
      brand: "Nature's Bounty",
      currentStock: 78,
      minStock: 25,
      maxStock: 120,
      unitPrice: 12.00,
      expiryDate: "2026-08-20",
      batchNumber: "VIT2024005",
      supplier: "VitaSuppliers",
      location: "E-1-03",
      status: "good"
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "low":
        return <TrendingDown size={16} className="status-icon low" />;
      case "expired":
        return <AlertTriangle size={16} className="status-icon expired" />;
      case "expiring":
        return <Calendar size={16} className="status-icon expiring" />;
      default:
        return <Package size={16} className="status-icon good" />;
    }
  };

  const getStatusClass = (status) => {
    return `status-badge ${status}`;
  };

  const getStockStatus = (item) => {
    if (item.currentStock === 0) return "expired";
    if (item.currentStock <= item.minStock) return "low";
    if (new Date(item.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) return "expiring";
    return "good";
  };

  const filteredItems = mockStockItems.filter(item => {
    const itemStatus = getStockStatus(item);
    const matchesTab = activeTab === "all" || 
      (activeTab === "low" && itemStatus === "low") ||
      (activeTab === "expired" && itemStatus === "expired") ||
      (activeTab === "expiring" && itemStatus === "expiring");
    
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category.toLowerCase() === selectedCategory;
    
    return matchesTab && matchesSearch && matchesCategory;
  });

  return (
    <div className="stock-page">
      {/* Header Section */}
      <div className="stock-header">
        <div className="stock-title-section">
          <h1 className="stock-title">Stock Management</h1>
          <p className="stock-subtitle">Monitor and manage your pharmacy inventory</p>
        </div>
        
        <div className="stock-actions">
          <button className="action-btn secondary">
            <Upload size={18} />
            Import
          </button>
          <button className="action-btn secondary">
            <Download size={18} />
            Export
          </button>
          <button className="add-stock-btn">
            <Plus size={18} />
            Add Item
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stock-stats">
        <div className="stat-card">
          <div className="stat-icon good">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">245</div>
            <div className="stat-label">Total Items</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon low">
            <TrendingDown size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">18</div>
            <div className="stat-label">Low Stock</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon expiring">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">12</div>
            <div className="stat-label">Expiring Soon</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon expired">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">5</div>
            <div className="stat-label">Expired</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="stock-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="stock-filters">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-filter"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.label}</option>
          ))}
        </select>

        <button className="filter-btn">
          <Filter size={18} />
          More Filters
        </button>
      </div>

      {/* Stock Items Table */}
      <div className="stock-table-container">
        <div className="stock-table">
          <div className="table-header">
            <div className="col-item">Item Details</div>
            <div className="col-stock">Stock Level</div>
            <div className="col-price">Unit Price</div>
            <div className="col-expiry">Expiry Date</div>
            <div className="col-location">Location</div>
            <div className="col-actions">Actions</div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="empty-state">
              <Package size={48} className="empty-icon" />
              <h3>No items found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            filteredItems.map(item => {
              const itemStatus = getStockStatus(item);
              return (
                <div key={item.id} className="table-row">
                  <div className="col-item">
                    <div className="item-info">
                      <div className="item-header">
                        <span className="item-name">{item.name}</span>
                        <div className={getStatusClass(itemStatus)}>
                          {getStatusIcon(itemStatus)}
                        </div>
                      </div>
                      <div className="item-details">
                        <span className="item-id">
                          <Barcode size={12} />
                          {item.id}
                        </span>
                        <span className="item-brand">{item.brand}</span>
                        <span className="item-category">{item.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-stock">
                    <div className="stock-info">
                      <div className={`current-stock ${itemStatus}`}>
                        {item.currentStock} units
                      </div>
                      <div className="stock-range">
                        Min: {item.minStock} | Max: {item.maxStock}
                      </div>
                    </div>
                  </div>

                  <div className="col-price">
                    KES {item.unitPrice.toFixed(2)}
                  </div>

                  <div className="col-expiry">
                    <div className="expiry-info">
                      <div className="expiry-date">{item.expiryDate}</div>
                      <div className="batch-number">Batch: {item.batchNumber}</div>
                    </div>
                  </div>

                  <div className="col-location">
                    {item.location}
                  </div>

                  <div className="col-actions">
                    <button className="action-btn small">
                      <Eye size={14} />
                    </button>
                    <button className="action-btn small">
                      <Edit size={14} />
                    </button>
                    <button className="action-btn small">
                      <RefreshCw size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default StockPage;