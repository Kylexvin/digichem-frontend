import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { apiClient } from '../../../services/utils/apiClient';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  Package,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';
import './ProductsPage.css';

const ProductsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDrugType, setFilterDrugType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0
  });

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, filterCategory, filterDrugType, filterStatus, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 20,
        ...(searchTerm && { search: searchTerm }),
        ...(filterCategory && { category: filterCategory }),
        ...(filterDrugType && { drugType: filterDrugType }),
        ...(filterStatus && { status: filterStatus }),
        sortBy,
        sortOrder
      });

      console.log('Fetching products with params:', queryParams.toString());
      const response = await apiClient.get(`/inventory/products?${queryParams}`);
      
      if (response.data.success) {
        setProducts(response.data.data);
        setTotalPages(response.data.pagination.pages);
        
        // Calculate stats
        const totalProducts = response.data.data.length;
        const lowStockProducts = response.data.data.filter(p => p.isLowStock).length;
        const outOfStockProducts = response.data.data.filter(p => p.stockStatus === 'out_of_stock').length;
        const totalValue = response.data.data.reduce((sum, p) => sum + (p.stockValue || 0), 0);
        
        setStats({
          total: totalProducts,
          lowStock: lowStockProducts,
          outOfStock: outOfStockProducts,
          totalValue: totalValue
        });
        
        console.log(`✅ Loaded ${totalProducts} products`);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch products';
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      console.log('Deleting product:', productId);
      const response = await apiClient.delete(`/inventory/products/${productId}`);
      
      if (response.data.success) {
        setProducts(products.filter(p => p._id !== productId));
        setShowDeleteModal(false);
        setProductToDelete(null);
        console.log('✅ Product deleted successfully');
        
        // Refresh to get updated stats
        fetchProducts();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete product';
      setError(errorMessage);
      console.error('Error deleting product:', err);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    setSelectedProducts(
      selectedProducts.length === products.length 
        ? [] 
        : products.map(p => p._id)
    );
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'in_stock': return 'green';
      case 'low_stock': return 'orange';
      case 'out_of_stock': return 'red';
      default: return 'gray';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <div className="header-content">
          <h1>Product Management</h1>
          <p>Manage your pharmacy inventory and product catalog</p>
        </div>
        <div className="header-actions">
          <button 
            className="refresh-btn"
            onClick={fetchProducts}
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? 'spinner' : ''} />
            Refresh
          </button>
          <button 
            className="add-product-btn"
            onClick={() => navigate('/owner/inventory/add-product')}

          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <AlertTriangle size={20} />
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="products-stats">
        <div className="stat-card">
          <div className="stat-header">
            <Package size={24} />
          </div>
          <span className="stat-number">{stats.total}</span>
          <p className="stat-label">Total Products</p>
        </div>
        <div className="stat-card warning">
          <div className="stat-header">
            <TrendingDown size={24} />
          </div>
          <span className="stat-number">{stats.lowStock}</span>
          <p className="stat-label">Low Stock Items</p>
        </div>
        <div className="stat-card danger">
          <div className="stat-header">
            <AlertTriangle size={24} />
          </div>
          <span className="stat-number">{stats.outOfStock}</span>
          <p className="stat-label">Out of Stock</p>
        </div>
        <div className="stat-card info">
          <div className="stat-header">
            <TrendingUp size={24} />
          </div>
          <span className="stat-number">{formatCurrency(stats.totalValue)}</span>
          <p className="stat-label">Total Stock Value</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="products-controls">
        <div className="search-section">
          <div className="search-input">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="filters-section">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            <option value="Pain Relief">Pain Relief</option>
            <option value="Antibiotics">Antibiotics</option>
            <option value="Asthma">Asthma</option>
            <option value="Diabetes">Diabetes</option>
            <option value="Heart">Heart</option>
          </select>
          
          <select
            value={filterDrugType}
            onChange={(e) => setFilterDrugType(e.target.value)}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="OTC">Over the Counter</option>
            <option value="Prescription">Prescription</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        <div className="bulk-actions">
          {selectedProducts.length > 0 && (
            <div className="bulk-controls">
              <span>{selectedProducts.length} selected</span>
              <button className="bulk-btn delete">
                <Trash2 size={16} />
                Delete Selected
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <RefreshCw size={24} className="spinner" />
          <p>Loading products...</p>
        </div>
      )}

      {/* Products Table */}
      {!loading && (
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Product</th>
                <th>Category</th>
                <th>Type</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Value</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className={selectedProducts.includes(product._id) ? 'selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => handleSelectProduct(product._id)}
                    />
                  </td>
                  <td>
                    <div className="product-info">
                      <div className="product-name">{product.name}</div>
                      <div className="product-sku">SKU: {product.sku}</div>
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">{product.category}</span>
                  </td>
                  <td>
                    <span className={`drug-type-badge ${product.drugType.toLowerCase()}`}>
                      {product.drugType}
                    </span>
                  </td>
                  <td>
                    <div className="stock-info">
                      <div className="stock-numbers">
                        {product.stock.totalUnits} {product.unitType}
                      </div>
                      <div className="pack-info">
                        {product.stock.fullPacks} packs, {product.stock.looseUnits || 0} loose
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="price-info">
                      <div className="selling-price">{formatCurrency(product.pricing.sellingPricePerPack)}</div>
                      <div className="cost-price">Cost: {formatCurrency(product.pricing.costPerPack)}</div>
                    </div>
                  </td>
                  <td>
                    <span className="stock-value">{formatCurrency(product.stockValue || 0)}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStockStatusColor(product.stockStatus)}`}>
                      {product.stockStatus.replace('_', ' ')}
                    </span>
                    {product.isLowStock && (
                      <div className="low-stock-warning">
                        <AlertTriangle size={14} />
                        Low Stock
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn view"
                        onClick={() => navigate(`/inventory/products/${product._id}`)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="action-btn edit"
                        onClick={() => navigate(`owner/inventory/products/${product._id}/edit`)}
                        title="Edit Product"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => {
                          setProductToDelete(product);
                          setShowDeleteModal(true);
                        }}
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && !loading && (
            <div className="empty-state">
              <Package size={64} />
              <h3>No Products Found</h3>
              <p>Start by adding your first product to the inventory.</p>
              <button 
                className="add-product-btn"
                onClick={() => navigate('/inventory/add-product')}
              >
                <Plus size={18} />
                Add First Product
              </button>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={currentPage === page ? 'active' : ''}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <div className="modal-header">
              <h3>Delete Product</h3>
            </div>
            <div className="modal-content">
              <div className="warning-icon">
                <AlertTriangle size={48} />
              </div>
              <p>
                Are you sure you want to delete <strong>{productToDelete.name}</strong>? 
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-actions">
              <button
                className="btn cancel"
                onClick={() => {
                  setShowDeleteModal(false);
                  setProductToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn delete"
                onClick={() => handleDeleteProduct(productToDelete._id)}
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;