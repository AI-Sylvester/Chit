import React, { useState } from 'react';
import {
  Box, TextField, Button, Checkbox,
  FormControlLabel, Typography, Paper
} from '@mui/material';
import api from '../services/api';

function CustomerForm() {
  const [customer, setCustomer] = useState({
    cusId: '',
    name: '',
    grade: '',
    number: '',
    PID: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    mobile1: '',
    mobile2: '',
    username: '',
    password: '',
    active: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCustomer((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/customers', customer);
      alert('Customer added successfully');
      setCustomer({
        cusId: '',
        name: '',
        grade: '',
        number: '',
        PID: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        mobile1: '',
        mobile2: '',
        username: '',
        password: '',
        active: true,
      });
    } catch (error) {
      console.error(error);
      alert('Failed to add customer');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Add Customer
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth margin="normal" label="Customer ID" name="cusId" value={customer.cusId} onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Name" name="name" value={customer.name} onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Grade" name="grade" value={customer.grade} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Number" name="number" value={customer.number} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="PID" name="PID" value={customer.PID} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Address Line 1" name="addressLine1" value={customer.addressLine1} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Address Line 2" name="addressLine2" value={customer.addressLine2} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="City" name="city" value={customer.city} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="State" name="state" value={customer.state} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Mobile 1" name="mobile1" value={customer.mobile1} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Mobile 2" name="mobile2" value={customer.mobile2} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Username" name="username" value={customer.username} onChange={handleChange} required />
          <TextField fullWidth margin="normal" type="password" label="Password" name="password" value={customer.password} onChange={handleChange} required />
          <FormControlLabel
            control={
              <Checkbox checked={customer.active} onChange={handleChange} name="active" />
            }
            label="Active"
            sx={{ mt: 2 }}
          />
          <Button variant="contained" type="submit" sx={{ mt: 3 }}>
            Add Customer
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default CustomerForm;
