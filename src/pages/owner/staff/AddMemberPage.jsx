// src/pages/owner/staff/AddMemberPage.jsx
import React, { useState } from 'react';
import apiClient from '../../../services/utils/apiClient';
import './AddMemberPage.css';

const defaultPermissions = {
  sales: true,
  inventory: 'view',
  reports: false,
  customers: 'view',
  settings: false,
  refunds: false,
  discounts: 'none',
  overrideStock: false
};

const AddMemberPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [permissions, setPermissions] = useState(defaultPermissions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [tempPassword, setTempPassword] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePermission = (key) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectChange = (key, value) => {
    setPermissions(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await apiClient.post('/staff', { ...formData, permissions });
      if (response.data.success) {
        setTempPassword(response.data.data.tempPassword);
        setSuccessMessage('Staff created successfully! Copy the temporary password now—it will disappear forever.');
        setFormData({ firstName: '', lastName: '', email: '', phone: '' });
        setPermissions(defaultPermissions);
      } else {
        setError(response.data.message || 'Failed to create staff.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create staff.');
    } finally {
      setLoading(false);
    }
  };

  const copyPassword = () => {
    if (tempPassword) {
      navigator.clipboard.writeText(tempPassword);
      alert('Temporary password copied to clipboard!');
    }
  };

  return (
    <div className="add-member-page">
      <h1>Add Staff Member</h1>
      {error && <p className="error">{error}</p>}
      {successMessage && (
        <div className="success-message">
          <p>{successMessage}</p>
          <p>
            <strong>Password:</strong> {tempPassword}{' '}
            <button onClick={copyPassword}>Copy</button>
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="staff-form">
        <label>
          First Name
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </label>
        <label>
          Last Name
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <label>
          Phone
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
        </label>

        <fieldset className="permissions">
          <legend>Permissions</legend>
          <label>
            <input type="checkbox" checked={permissions.sales} onChange={() => togglePermission('sales')} />
            Sales
          </label>
          <label>
            <input type="checkbox" checked={permissions.refunds} onChange={() => togglePermission('refunds')} />
            Refunds
          </label>
          <label>
            Customers:
            <select value={permissions.customers} onChange={(e) => handleSelectChange('customers', e.target.value)}>
              <option value="view">View</option>
              <option value="edit">Edit</option>
              <option value="none">None</option>
            </select>
          </label>
          <label>
            Inventory:
            <select value={permissions.inventory} onChange={(e) => handleSelectChange('inventory', e.target.value)}>
              <option value="view">View</option>
              <option value="edit">Edit</option>
              <option value="none">None</option>
            </select>
          </label>
          <label>
            Discounts:
            <select value={permissions.discounts} onChange={(e) => handleSelectChange('discounts', e.target.value)}>
              <option value="none">None</option>
              <option value="limited">Limited</option>
              <option value="full">Full</option>
            </select>
          </label>
        </fieldset>

        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Staff'}</button>
      </form>
    </div>
  );
};

export default AddMemberPage;
