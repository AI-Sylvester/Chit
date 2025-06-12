import React, { useState } from 'react';
import api from '../services/api';

function ChitCloseForm() {
  const [form, setForm] = useState({
    cusId: '',
    ChitID: '',
    name: '',
    PID: '',
    number: '',
    city: '',
    goldRedeemed: 0,
    voucher: ''
  });

  const [closed, setClosed] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCloseChit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/chitclose', {
        ...form,
        date: new Date()
      });
      setClosed(res.data);
    } catch (err) {
      console.error(err);
      alert('Error closing chit');
    }
  };

  return (
    <div>
      <h3>Chit Close</h3>
      <form onSubmit={handleCloseChit}>
        <input name="cusId" placeholder="Customer ID" onChange={handleChange} required />
        <input name="ChitID" placeholder="Chit ID" onChange={handleChange} required />
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="PID" placeholder="PID" onChange={handleChange} />
        <input name="number" placeholder="Number" onChange={handleChange} />
        <input name="city" placeholder="City" onChange={handleChange} />
        <input name="goldRedeemed" placeholder="Gold Redeemed" onChange={handleChange} />
        <input name="voucher" placeholder="Voucher" onChange={handleChange} />
        <button type="submit">Close Chit</button>
      </form>

      {closed && (
        <div>
          <h4>Chit Closed</h4>
          <pre>{JSON.stringify(closed, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default ChitCloseForm;
