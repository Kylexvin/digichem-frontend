// src/components/shared/Inventory/ProductManager.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} from '../../../store/slices/inventorySlice';
import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import SearchBox from '../../common/Forms/SearchBox/SearchBox';
import Button from '../../common/UI/Button/Button';
import Loading from '../../common/UI/Loading/Loading';
import Alert from '../../common/UI/Alert/Alert';
import Card from '../../common/UI/Card/Card';
import './ProductManager.css';

const ProductManager = () => {
  const dispatch = useDispatch();
  const { products, loading, error, searchResults } = useSelector(state => state.inventory);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLowStock, setFilterLowStock] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    dispatch(searchProducts(term));
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await dispatch(deleteProduct(productId));
    }
  };

  const handleSubmitForm = async (productData) => {
    if (editingProduct) {
      await dispatch(updateProduct({ id: editingProduct.id, data: productData }));
    } else {
      await dispatch(addProduct(productData));
    }
    handleCloseForm();
  };

  // Get unique categories for filter
  const categories = ['all', ...new Set(products.map(product => product.category))];

  // Filter products based on current filters
  const filteredProducts = (searchTerm ? searchResults : products).filter(product => {
    const categoryMatch = filterCategory === 'all' || product.category === filterCategory;
    const lowStockMatch = !filterLowStock || product.stock <= product.minStock;
    return categoryMatch && lowStockMatch;
  });

  if (loading) return <Loading message="Loading products..." />;

  return (
    <div className="product-manager">
      <div className="product-manager-header">
        <h2>Product Inventory</h2>
        <p>Manage your pharmacy products and inventory levels</p>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => {}} />
      )}

      <div className="product-manager-controls">
        <div className="controls-left">
          <SearchBox
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search products by name, SKU, or category..."
            delay={300}
          />
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>

          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={filterLowStock}
              onChange={(e) => setFilterLowStock(e.target.checked)}
            />
            Show Low Stock Only
          </label>
        </div>

        <div className="controls-right">
          <Button
            variant="primary"
            onClick={() => setShowForm(true)}
            icon="plus"
          >
            Add Product
          </Button>
        </div>
      </div>

      <Card className="product-summary-card">
        <div className="summary-item">
          <span className="summary-label">Total Products</span>
          <span className="summary-value">{products.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Low Stock Items</span>
          <span className="summary-value warning">
            {products.filter(p => p.stock <= p.minStock).length}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Out of Stock</span>
          <span className="summary-value danger">
            {products.filter(p => p.stock === 0).length}
          </span>
        </div>
      </Card>

      <ProductTable
        products={filteredProducts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={loading}
      />

      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleCloseForm}
          onSubmit={handleSubmitForm}
          isOpen={showForm}
        />
      )}
    </div>
  );
};

export default ProductManager;