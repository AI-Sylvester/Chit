import React from 'react';
import { useNavigate } from 'react-router-dom';

function Homepage() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Welcome to Chit Management</h2>
      <div style={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/customer')}>Customer Form</button>
        <button onClick={() => navigate('/transaction')}>Transaction Form</button>
        <button onClick={() => navigate('/chitclose')}>Chit Close Form</button>
        <button onClick={() => navigate('/chitids')}>Chit ID Form</button> {/* ✅ New button */}
      </div>
    </div>
  );
}

export default Homepage;
