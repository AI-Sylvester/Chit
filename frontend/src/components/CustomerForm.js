import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Checkbox,
  FormControlLabel, Typography, Paper,
  AppBar, Toolbar, Select, MenuItem, InputLabel, FormControl
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
    state: 'Tamil Nadu', // default state
    mobile1: '',
    mobile2: '',
    username: '',
    password: '',
    active: true,
  });

  useEffect(() => {
    const fetchNextCusId = async () => {
      try {
        const res = await api.get('/customers/nextCusId');
        setCustomer((prev) => ({ ...prev, cusId: res.data.nextCusId }));
      } catch (error) {
        console.error('Failed to fetch next customer ID', error);
      }
    };
    fetchNextCusId();
  }, []);

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
      handleClear();
      const res = await api.get('/customers/nextCusId');
      setCustomer((prev) => ({ ...prev, cusId: res.data.nextCusId }));
    } catch (error) {
      console.error(error);
      alert('Failed to add customer');
    }
  };

  const handleClear = () => {
    setCustomer({
      cusId: customer.cusId,
      name: '',
      grade: '',
      number: '',
      PID: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: 'Tamil Nadu',
      mobile1: '',
      mobile2: '',
      username: '',
      password: '',
      active: true,
    });
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <AppBar position="static" sx={{ backgroundColor: '#FFD700', color: 'black', mb: 3 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Add Customer</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Customer ID: {customer.cusId || '-'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField label="Name" name="name" value={customer.name} onChange={handleChange} required fullWidth />
            
            <FormControl fullWidth required>
              <InputLabel id="grade-label">Grade</InputLabel>
              <Select
                labelId="grade-label"
                name="grade"
                value={customer.grade}
                onChange={handleChange}
                label="Grade"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="Premium">Premium</MenuItem>
                <MenuItem value="Premium+">Premium+</MenuItem>
              </Select>
            </FormControl>

            <TextField label="PID" name="PID" value={customer.PID} onChange={handleChange} required fullWidth />
            <TextField label="Door No" name="number" value={customer.number} onChange={handleChange} required fullWidth />
            <TextField label="Address Line 1" name="addressLine1" value={customer.addressLine1} onChange={handleChange} required fullWidth />
            <TextField label="Address Line 2" name="addressLine2" value={customer.addressLine2} onChange={handleChange} required fullWidth />
            <TextField label="City" name="city" value={customer.city} onChange={handleChange} required fullWidth />
            <TextField label="State" name="state" value={customer.state} onChange={handleChange} required fullWidth />
            <TextField label="Mobile 1" name="mobile1" value={customer.mobile1} onChange={handleChange} required fullWidth />
            <TextField label="Mobile 2" name="mobile2" value={customer.mobile2} onChange={handleChange} required fullWidth />
            <TextField label="Username" name="username" value={customer.username} onChange={handleChange} required fullWidth />
            <TextField type="password" label="Password" name="password" value={customer.password} onChange={handleChange} required fullWidth />

            <FormControlLabel
              control={<Checkbox checked={customer.active} onChange={handleChange} name="active" />}
              label="Active"
              sx={{ mt: 1 }}
            />

            <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
              <Button variant="outlined" onClick={handleClear}>
                Clear
              </Button>
              <Button variant="contained" type="submit">
                Add Customer
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default CustomerForm;
