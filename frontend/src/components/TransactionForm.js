import React, { useState } from 'react';
import api from '../services/api';

function TransactionForm() {
  const [form, setForm] = useState({
    EID: '',
    cusId: '',
    name: '',
    number: '',
    city: '',
    PID: '',
    ChitID: '',
    receivedAmount: '',
    goldGram: '',
    payMode: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        date: new Date()
      };
      await api.post('/transactions', payload);
      alert('Transaction saved');
    } catch (err) {
      console.error(err);
      alert('Failed to save transaction');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Transaction Entry</h3>
      <input name="EID" placeholder="EID" onChange={handleChange} required />
      <input name="cusId" placeholder="Customer ID" onChange={handleChange} required />
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="number" placeholder="Number" onChange={handleChange} />
      <input name="city" placeholder="City" onChange={handleChange} />
      <input name="PID" placeholder="PID" onChange={handleChange} />
      <input name="ChitID" placeholder="Chit ID" onChange={handleChange} required />
      <input name="receivedAmount" type="number" placeholder="Received Amount" onChange={handleChange} />
      <input name="goldGram" type="number" placeholder="Gold Gram" onChange={handleChange} />
      <input name="payMode" placeholder="Pay Mode" onChange={handleChange} />
      <button type="submit">Submit Transaction</button>
    </form>
  );
}

export default TransactionForm;
