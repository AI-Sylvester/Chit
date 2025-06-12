import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import api from '../services/api';

function ChitCloseForm() {
  const [form, setForm] = useState({
    cusId: '',
    ChitID: '',
    name: '',
    PID: '',
    number: '',
    city: '',
    goldRedeemed: '',
    voucher: ''
  });

  const [closed, setClosed] = useState(null);
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCloseChit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/chitclose', {
        ...form,
        goldRedeemed: parseFloat(form.goldRedeemed) || 0,
        date: new Date()
      });
      setClosed(res.data);
      setForm({
        cusId: '',
        ChitID: '',
        name: '',
        PID: '',
        number: '',
        city: '',
        goldRedeemed: '',
        voucher: ''
      });
    } catch (err) {
      console.error(err);
      setError('Error closing chit');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Chit Close
        </Typography>
        <form onSubmit={handleCloseChit} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Customer ID"
            name="cusId"
            value={form.cusId}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Chit ID"
            name="ChitID"
            value={form.ChitID}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="PID"
            name="PID"
            value={form.PID}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Number"
            name="number"
            value={form.number}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Gold Redeemed"
            name="goldRedeemed"
            value={form.goldRedeemed}
            onChange={handleChange}
            type="number"
            inputProps={{ step: "0.01" }}
            fullWidth
          />
          <TextField
            label="Voucher"
            name="voucher"
            value={form.voucher}
            onChange={handleChange}
            fullWidth
          />
          <Button variant="contained" type="submit" sx={{ mt: 2 }}>
            Close Chit
          </Button>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {closed && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Chit Closed Successfully
            </Typography>
            <Paper sx={{ p: 2, backgroundColor: '#f5f5f5', maxHeight: 300, overflow: 'auto' }}>
              <pre style={{ margin: 0 }}>
                {JSON.stringify(closed, null, 2)}
              </pre>
            </Paper>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default ChitCloseForm;
