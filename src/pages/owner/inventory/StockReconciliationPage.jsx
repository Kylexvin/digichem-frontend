import React, { useEffect, useState } from 'react';
import apiClient from '../../../services/utils/apiClient';
import Swal from 'sweetalert2';
import './StockReconciliationPage.css';

const StockReconciliationPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending reconciliations
const fetchRecords = async () => {
  try {
    setLoading(true);
    const response = await apiClient.get('/inventory/reconciliations/pending');
    setRecords(response.data?.data || []); 
  } catch (error) {
    console.error('Error fetching reconciliations:', error);
    Swal.fire('Error', 'Failed to fetch reconciliation records', 'error');
  } finally {
    setLoading(false);
  }
};


  // Solve reconciliation
  const solveRecord = async (id) => {
    try {
      const confirm = await Swal.fire({
        title: 'Mark as solved?',
        text: 'This will mark the reconciliation as resolved.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, solve it',
      });

      if (!confirm.isConfirmed) return;

      await apiClient.put(`/inventory/reconciliations/${id}`, { status: 'resolved' });

      Swal.fire('Solved', 'Reconciliation has been marked as resolved', 'success');
      fetchRecords(); // refresh list
    } catch (error) {
      console.error('Error solving reconciliation:', error);
      Swal.fire('Error', 'Failed to resolve reconciliation', 'error');
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  if (loading) {
    return <div className="stock-reconciliation-page">Loading...</div>;
  }

  return (
    <div className="stock-reconciliation-page">
      <h2>Stock Reconciliation</h2>
      {records.length === 0 ? (
        <p>No pending reconciliations 🎉</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity Sold</th>
              <th>Available</th>
              <th>Deficit</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec._id}>
                <td>{rec.productName}</td>
                <td>{rec.quantitySold}</td>
                <td>{rec.availableStock}</td>
                <td>{rec.deficit}</td>
                <td>
                  <button onClick={() => solveRecord(rec._id)}>Solve</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockReconciliationPage;
