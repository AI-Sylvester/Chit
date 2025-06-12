import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Alert
} from '@mui/material';
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

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const payload = {
        ...form,
        receivedAmount: parseFloat(form.receivedAmount) || 0,
        goldGram: parseFloat(form.goldGram) || 0,
        date: new Date(),
        status: 'Open'
      };
      await api.post('/transactions', payload);
      setSuccess('Transaction saved successfully.');
      setForm({
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
    } catch (err) {
      console.error(err);
      setError('Failed to save transaction');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Transaction Entry
        </Typography>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TextField name="EID" label="EID" value={form.EID} onChange={handleChange} required />
          <TextField name="cusId" label="Customer ID" value={form.cusId} onChange={handleChange} required />
          <TextField name="name" label="Name" value={form.name} onChange={handleChange} />
          <TextField name="number" label="Number" value={form.number} onChange={handleChange} />
          <TextField name="city" label="City" value={form.city} onChange={handleChange} />
          <TextField name="PID" label="PID" value={form.PID} onChange={handleChange} />
          <TextField name="ChitID" label="Chit ID" value={form.ChitID} onChange={handleChange} required />
          <TextField
            name="receivedAmount"
            label="Received Amount"
            type="number"
            value={form.receivedAmount}
            onChange={handleChange}
            inputProps={{ step: '0.01' }}
          />
          <TextField
            name="goldGram"
            label="Gold Gram"
            type="number"
            value={form.goldGram}
            onChange={handleChange}
            inputProps={{ step: '0.01' }}
          />
          <TextField
            name="payMode"
            label="Pay Mode"
            value={form.payMode}
            onChange={handleChange}
            select
          >
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Online">Online</MenuItem>
            <MenuItem value="Cheque">Cheque</MenuItem>
          </TextField>

          <Button type="submit" variant="contained">
            Submit Transaction
          </Button>
        </form>

        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
    </Box>
  );
}

export default TransactionForm;
