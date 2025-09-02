// src/pages/owner/staff/MembersPage.jsx
import React, { useEffect, useState } from 'react';
import apiClient from '../../../services/utils/apiClient';
import './MembersPage.css';

const MembersPage = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/staff');
      console.log('Fetched staff:', response.data);
      if (response.data?.success) {
        setStaffList(response.data.data);
      }
    } catch (err) {
      console.error('Fetch staff error:', err);
      setError('Failed to load staff list.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (staffId, newStatus) => {
    try {
      console.log(`Updating status of ${staffId} to ${newStatus}`);
      const response = await apiClient.patch(`/staff/${staffId}/status`, { status: newStatus });
      console.log('Update status response:', response.data);
      fetchStaff();
    } catch (err) {
      console.error('Failed to update staff status:', err.response || err);
      alert(err.response?.data?.message || 'Failed to update staff status.');
    }
  };

  const deleteStaff = async (staffId) => {
    if (!window.confirm('Are you sure you want to delete this staff?')) return;

    try {
      console.log(`Deleting staff ${staffId}`);
      const response = await apiClient.delete(`/staff/${staffId}`);
      console.log('Delete staff response:', response.data);
      fetchStaff();
    } catch (err) {
      console.error('Failed to delete staff:', err.response || err);
      alert(err.response?.data?.message || 'Failed to delete staff.');
    }
  };

  return (
    <div className="members-page">
      <h1>Staff Members</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <table className="members-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff) => (
            <tr key={staff._id}>
              <td>{`${staff.firstName} ${staff.lastName}`}</td>
              <td>{staff.email}</td>
              <td>{staff.phone}</td>
              <td>{staff.status}</td>
              <td>
                {staff.status === 'active' ? (
                  <button
                    className="btn-warning"
                    onClick={() => updateStatus(staff._id, 'suspended')}
                  >
                    Suspend
                  </button>
                ) : (
                  <button
                    className="btn-success"
                    onClick={() => updateStatus(staff._id, 'active')}
                  >
                    Activate
                  </button>
                )}
                <button
                  className="btn-danger"
                  onClick={() => deleteStaff(staff._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {staffList.length === 0 && !loading && (
            <tr>
              <td colSpan="5">No staff found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MembersPage;
