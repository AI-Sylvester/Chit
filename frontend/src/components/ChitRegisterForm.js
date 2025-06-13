import React, { useEffect, useState } from 'react';
import {
  Box, TextField, Button, Typography, Paper, MenuItem,
  FormControl, InputLabel, Select
} from '@mui/material';
import api from '../services/api';

function ChitRegisterForm() {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({

    cusId: '',
    name: '',
    city: '',
    number: '',
    PID: '',
    chitId: '',
    startedOn: today,
    closedOn: '',
    status: 'Open',
    nomineeName: '',
    relation: '',
    nomineeNumber: '',
    nomineeCity: '',
  });

  const [customers, setCustomers] = useState([]);
  const [chitIds, setChitIds] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get('/customers');
        setCustomers(res.data);
      } catch (err) {
        console.error('Error fetching customers:', err);
      }
    };

    const fetchChits = async () => {
      try {
        const res = await api.get('/chitids');
        setChitIds(res.data);
      } catch (err) {
        console.error('Error fetching chit IDs:', err);
      }
    };

    fetchCustomers();
    fetchChits();
  }, []);

  const fetchCustomerDetails = async (cusId) => {
    try {
      const res = await api.get(`/customers/${cusId}`);
      const { name, city, mobile1, PID } = res.data;
      setFormData((prev) => ({
        ...prev,
        name,
        city,
        number: mobile1,
        PID
      }));
    } catch (err) {
      console.error('Customer not found:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'cusId') {
        fetchCustomerDetails(value);
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post('/chitregisters', formData);
    alert('Chit registered successfully');

    // Reset form after successful submission
    setFormData({
      cusId: '',
      name: '',
      city: '',
      number: '',
      PID: '',
      chitId: '',
      startedOn: new Date().toISOString().split('T')[0],
      closedOn: '',
      status: 'Open',
      nomineeName: '',
      relation: '',
      nomineeNumber: '',
      nomineeCity: '',
      regId: res.data.regId, // If you still want to show the generated ID
    });
  } catch (err) {
    console.error('Failed to create chit register:', err);
    alert('Error creating chit register');
  }
};


  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4 }} elevation={3}>
        <Typography variant="h5" gutterBottom>
          Register New Chit
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Register ID"
            name="regId"
            value={formData.regId}
            disabled
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="cusId-label">Customer ID</InputLabel>
            <Select
              labelId="cusId-label"
              name="cusId"
              value={formData.cusId}
              label="Customer ID"
              onChange={handleChange}
              required
            >
              {customers.map((cust) => (
                <MenuItem key={cust.cusId} value={cust.cusId}>
                  {cust.cusId}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField fullWidth margin="normal" label="Name" name="name" value={formData.name} disabled />
          <TextField fullWidth margin="normal" label="Mobile" name="number" value={formData.number} disabled />
          <TextField fullWidth margin="normal" label="City" name="city" value={formData.city} disabled />
          <TextField fullWidth margin="normal" label="PID" name="PID" value={formData.PID} disabled />

          <FormControl fullWidth margin="normal">
            <InputLabel id="chitId-label">Chit ID</InputLabel>
            <Select
              labelId="chitId-label"
              name="chitId"
              value={formData.chitId}
              label="Chit ID"
              onChange={handleChange}
              required
            >
              {chitIds.map((chit) => (
                <MenuItem key={chit._id} value={chit.chitId}>
                  {chit.chitId}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            type="date"
            label="Started On"
            name="startedOn"
            value={formData.startedOn}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />

   {formData.status === 'Closed' && (
  <TextField
    fullWidth
    margin="normal"
    type="date"
    label="Closed On"
    name="closedOn"
    value={formData.closedOn}
    onChange={handleChange}
    InputLabelProps={{ shrink: true }}
    required
  />
)}
         <FormControl fullWidth margin="normal" disabled>
  <InputLabel id="status-label">Status</InputLabel>
  <Select
    labelId="status-label"
    name="status"
    value={formData.status}
    label="Status"
    onChange={handleChange}
    required
  >
    <MenuItem value="Open">Open</MenuItem>
    <MenuItem value="Closed">Closed</MenuItem>
  </Select>
</FormControl>

          <Typography variant="h6" sx={{ mt: 3 }}>
            Nominee Details
          </Typography>

          <TextField
            fullWidth
            margin="normal"
            label="Nominee Name"
            name="nomineeName"
            value={formData.nomineeName}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Relation"
            name="relation"
            value={formData.relation}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Nominee Number"
            name="nomineeNumber"
            value={formData.nomineeNumber}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Nominee City"
            name="nomineeCity"
            value={formData.nomineeCity}
            onChange={handleChange}
          />

          <Button type="submit" variant="contained" sx={{ mt: 3 }}>
            Submit
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default ChitRegisterForm;
