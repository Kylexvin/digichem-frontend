import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { apiClient } from '../../../services/utils/apiClient';
import {
  ArrowLeft,
  Package,
  Tag,
  DollarSign,
  Archive,
  AlertTriangle,
  Check,
  X,
  Save,
  RotateCcw
} from 'lucide-react';
import './AddProductPage.css';

const AddProductPage = () => {
  const { user } = useAuth();
  
  // Mock navigation function for demo
  const navigate = (path) => {
    console.log('Navigate to:', path);
    alert(`Would navigate to: ${path}`);
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    drugType: 'OTC',
    unitType: 'Tablets',
    pricing: {
      costPerPack: '',
      sellingPricePerPack: '',
      unitsPerPack: 1
    },
    stock: {
      fullPacks: 0,
      minStockLevel: 5
    }
  });

  const [validationErrors, setValidationErrors] = useState({});

  const categories = [
    'Pain Relief',
    'Antibiotics',
    'Asthma',
    'Diabetes',
    'Heart',
    'Skin Care',
    'Digestive Health',
    'Cold & Flu',
    'Vitamins',
    'First Aid'
  ];

  const unitTypes = [
    'Tablets',
    'Capsules',
    'Bottles',
    'Tubes',
    'Units',
    'Vials',
    'Sachets',
    'Boxes'
  ];

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    }
    
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    
    if (!formData.pricing.costPerPack || formData.pricing.costPerPack <= 0) {
      errors.costPerPack = 'Valid cost per pack is required';
    }
    
    if (!formData.pricing.sellingPricePerPack || formData.pricing.sellingPricePerPack <= 0) {
      errors.sellingPricePerPack = 'Valid selling price is required';
    }
    
    if (formData.pricing.sellingPricePerPack <= formData.pricing.costPerPack) {
      errors.sellingPricePerPack = 'Selling price must be higher than cost price';
    }
    
    if (!formData.pricing.unitsPerPack || formData.pricing.unitsPerPack <= 0) {
      errors.unitsPerPack = 'Valid units per pack is required';
    }
    
    if (formData.stock.minStockLevel < 0) {
      errors.minStockLevel = 'Minimum stock level cannot be negative';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const keys = name.split('.');
    
    if (keys.length === 2) {
      setFormData(prev => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: type === 'number' ? parseFloat(value) || '' : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || '' : value
      }));
    }
    
    // Clear validation error for this field
    if (validationErrors[name] || validationErrors[keys[1]]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        delete newErrors[keys[1]];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await apiClient.post('/api/inventory/products', formData);
      
      if (response.data.success) {
        setSuccess('Product added successfully!');
        // Reset form
        setFormData({
          name: '',
          category: '',
          drugType: 'OTC',
          unitType: 'Tablets',
          pricing: {
            costPerPack: '',
            sellingPricePerPack: '',
            unitsPerPack: 1
          },
          stock: {
            fullPacks: 0,
            minStockLevel: 5
          }
        });
        
        // Navigate back after delay
        setTimeout(() => {
          navigate('/products');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
      console.error('Error adding product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      category: '',
      drugType: 'OTC',
      unitType: 'Tablets',
      pricing: {
        costPerPack: '',
        sellingPricePerPack: '',
        unitsPerPack: 1
      },
      stock: {
        fullPacks: 0,
        minStockLevel: 5
      }
    });
    setValidationErrors({});
    setError('');
    setSuccess('');
  };

  const calculateProfitMargin = () => {
    const cost = parseFloat(formData.pricing.costPerPack);
    const selling = parseFloat(formData.pricing.sellingPricePerPack);
    
    if (cost && selling && selling > cost) {
      return (((selling - cost) / selling) * 100).toFixed(1);
    }
    return 0;
  };

  const calculatePricePerUnit = () => {
    const selling = parseFloat(formData.pricing.sellingPricePerPack);
    const units = parseFloat(formData.pricing.unitsPerPack);
    
    if (selling && units) {
      return (selling / units).toFixed(2);
    }
    return 0;
  };

  return (
    <div className="add-product-page">
      <div className="add-product-header">
        <div className="header-nav">
          <button 
            className="back-btn"
            onClick={() => navigate('/products')}
          >
            <ArrowLeft size={18} />
            Back to Products
          </button>
        </div>
        <div className="header-content">
          <h1>Add New Product</h1>
          <p>Add a new product to your pharmacy inventory</p>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <AlertTriangle size={20} />
          {error}
        </div>
      )}

      {success && (
        <div className="success-banner">
          <Check size={20} />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="add-product-form">
        {/* Basic Information */}
        <div className="form-section">
          <div className="section-header">
            <Package size={24} />
            <div>
              <h2>Basic Information</h2>
              <p>Essential product details</p>
            </div>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={validationErrors.name ? 'error' : ''}
                placeholder="Enter product name"
              />
              {validationErrors.name && (
                <span className="error-message">{validationErrors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={validationErrors.category ? 'error' : ''}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {validationErrors.category && (
                <span className="error-message">{validationErrors.category}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="drugType">Drug Type *</label>
              <select
                id="drugType"
                name="drugType"
                value={formData.drugType}
                onChange={handleInputChange}
              >
                <option value="OTC">Over the Counter</option>
                <option value="Prescription">Prescription</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="unitType">Unit Type *</label>
              <select
                id="unitType"
                name="unitType"
                value={formData.unitType}
                onChange={handleInputChange}
              >
                {unitTypes.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="form-section">
          <div className="section-header">
            <DollarSign size={24} />
            <div>
              <h2>Pricing Information</h2>
              <p>Cost and selling price details</p>
            </div>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="costPerPack">Cost per Pack (KES) *</label>
              <input
                type="number"
                id="costPerPack"
                name="pricing.costPerPack"
                value={formData.pricing.costPerPack}
                onChange={handleInputChange}
                className={validationErrors.costPerPack ? 'error' : ''}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {validationErrors.costPerPack && (
                <span className="error-message">{validationErrors.costPerPack}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="sellingPricePerPack">Selling Price per Pack (KES) *</label>
              <input
                type="number"
                id="sellingPricePerPack"
                name="pricing.sellingPricePerPack"
                value={formData.pricing.sellingPricePerPack}
                onChange={handleInputChange}
                className={validationErrors.sellingPricePerPack ? 'error' : ''}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {validationErrors.sellingPricePerPack && (
                <span className="error-message">{validationErrors.sellingPricePerPack}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="unitsPerPack">Units per Pack *</label>
              <input
                type="number"
                id="unitsPerPack"
                name="pricing.unitsPerPack"
                value={formData.pricing.unitsPerPack}
                onChange={handleInputChange}
                className={validationErrors.unitsPerPack ? 'error' : ''}
                placeholder="1"
                min="1"
              />
              {validationErrors.unitsPerPack && (
                <span className="error-message">{validationErrors.unitsPerPack}</span>
              )}
            </div>

            <div className="form-group readonly">
              <label>Price per Unit (KES)</label>
              <input
                type="text"
                value={calculatePricePerUnit()}
                readOnly
                className="readonly-input"
              />
            </div>
          </div>

          {/* Profit Margin Display */}
          <div className="profit-margin">
            <div className="profit-margin-content">
              <Tag size={20} />
              <span>Profit Margin: <strong>{calculateProfitMargin()}%</strong></span>
            </div>
          </div>
        </div>

        {/* Stock Information */}
        <div className="form-section">
          <div className="section-header">
            <Archive size={24} />
            <div>
              <h2>Stock Information</h2>
              <p>Initial stock and inventory settings</p>
            </div>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="fullPacks">Initial Stock (Packs)</label>
              <input
                type="number"
                id="fullPacks"
                name="stock.fullPacks"
                value={formData.stock.fullPacks}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="minStockLevel">Minimum Stock Level *</label>
              <input
                type="number"
                id="minStockLevel"
                name="stock.minStockLevel"
                value={formData.stock.minStockLevel}
                onChange={handleInputChange}
                className={validationErrors.minStockLevel ? 'error' : ''}
                placeholder="5"
                min="0"
              />
              {validationErrors.minStockLevel && (
                <span className="error-message">{validationErrors.minStockLevel}</span>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn reset"
            onClick={handleReset}
            disabled={loading}
          >
            <RotateCcw size={18} />
            Reset Form
          </button>
          
          <button
            type="submit"
            className="btn submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Adding Product...
              </>
            ) : (
              <>
                <Save size={18} />
                Add Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;