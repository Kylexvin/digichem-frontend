import React, { useState } from 'react';
import apiClient from '../../../services/utils/apiClient';
import Swal from 'sweetalert2';
import { ArrowLeft, Save, RotateCcw } from 'lucide-react';
import './AddProductPage.css';

const AddProductPage = () => {
  const navigate = (path) => {
    console.log('Navigate to:', path);
  };

  const [loading, setLoading] = useState(false);
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
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.name.trim()) errors.push('Product name is required');
    if (!formData.category.trim()) errors.push('Category is required');
    if (!formData.pricing.costPerPack || formData.pricing.costPerPack <= 0)
      errors.push('Cost per pack must be greater than 0');
    if (!formData.pricing.sellingPricePerPack || formData.pricing.sellingPricePerPack <= 0)
      errors.push('Selling price must be greater than 0');
    if (formData.pricing.sellingPricePerPack <= formData.pricing.costPerPack)
      errors.push('Selling price must be higher than cost price');
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        html: errors.join('<br/>')
      });
      return;
    }

    setLoading(true);

    const payload = {
      name: formData.name,
      category: formData.category,
      drugType: formData.drugType,
      unitType: formData.unitType,
      pricing: {
        costPerPack: formData.pricing.costPerPack,
        sellingPricePerPack: formData.pricing.sellingPricePerPack,
        unitsPerPack: formData.pricing.unitsPerPack || 1
      },
      stock: {
        fullPacks: formData.stock.fullPacks || 0,
        minStockLevel: formData.stock.minStockLevel || 5
      }
    };

    try {
      const response = await apiClient.post('/inventory/products', payload);
      if (response.data?.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Product added successfully'
        });
        setFormData({
          name: '',
          category: '',
          drugType: 'OTC',
          unitType: 'Tablets',
          pricing: { costPerPack: '', sellingPricePerPack: '', unitsPerPack: 1 },
          stock: { fullPacks: 0, minStockLevel: 5 }
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: err.response?.data?.message || 'Server error'
      });
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
      pricing: { costPerPack: '', sellingPricePerPack: '', unitsPerPack: 1 },
      stock: { fullPacks: 0, minStockLevel: 5 }
    });
  };

  return (
    <div className="add-product-page">
      <button className="back-btn" onClick={() => navigate('/products')}>
        <ArrowLeft size={18} /> Back
      </button>

      <h1>Add New Product</h1>

      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-group">
          <label>Product Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <input type="text" name="category" value={formData.category} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label>Drug Type *</label>
          <select name="drugType" value={formData.drugType} onChange={handleInputChange}>
            <option value="OTC">OTC</option>
            <option value="Prescription">Prescription</option>
          </select>
        </div>

        <div className="form-group">
          <label>Unit Type *</label>
          <select name="unitType" value={formData.unitType} onChange={handleInputChange}>
            <option value="Tablets">Tablets</option>
            <option value="Capsules">Capsules</option>
            <option value="Bottles">Bottles</option>
            <option value="Tubes">Tubes</option>
            <option value="Units">Units</option>
          </select>
        </div>

        <div className="form-group">
          <label>Cost per Pack (KES) *</label>
          <input type="number" name="pricing.costPerPack" value={formData.pricing.costPerPack} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label>Selling Price per Pack (KES) *</label>
          <input type="number" name="pricing.sellingPricePerPack" value={formData.pricing.sellingPricePerPack} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label>Units per Pack *</label>
          <input type="number" name="pricing.unitsPerPack" value={formData.pricing.unitsPerPack} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label>Initial Stock (Packs)</label>
          <input type="number" name="stock.fullPacks" value={formData.stock.fullPacks} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label>Minimum Stock Level *</label>
          <input type="number" name="stock.minStockLevel" value={formData.stock.minStockLevel} onChange={handleInputChange} />
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleReset} disabled={loading}>
            <RotateCcw size={18} /> Reset
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : <><Save size={18} /> Add Product</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
