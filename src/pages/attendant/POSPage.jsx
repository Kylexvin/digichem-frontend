import React from 'react';
import { useNavigate } from 'react-router-dom';
import './POSPage.css';

const POSPage = () => {
  const navigate = useNavigate();

  return (
    <div className="pos-page">
      <h1>POS Interface</h1>
      <p>Welcome, Attendant! This is a dummy POS page.</p>
      <button onClick={() => navigate('/login')}>Logout</button>
    </div>
  );
};

export default POSPage;
