import React, { useEffect, useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, TextField,
  CircularProgress
} from '@mui/material';
import api from '../services/api'; // adjust your import as needed

function CustomerTable() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get('/customers'); // Make sure endpoint matches
        setCustomers(res.data);
        setFilteredCustomers(res.data);
      } catch (err) {
        console.error('Error fetching customers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(lower) ||
        c.cusId?.toLowerCase().includes(lower) ||
        c.mobile1?.includes(lower) ||
        c.city?.toLowerCase().includes(lower)
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  return (
    <Box sx={{ maxWidth: '95%', mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Customer Records
      </Typography>

      <TextField
        label="Search by name, ID, mobile or city"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <Box textAlign="center" mt={4}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Customer ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Mobile</strong></TableCell>
                <TableCell><strong>City</strong></TableCell>
                <TableCell><strong>Grade</strong></TableCell>
                <TableCell><strong>Active</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((cust) => (
                <TableRow key={cust._id}>
                  <TableCell>{cust.cusId}</TableCell>
                  <TableCell>{cust.name}</TableCell>
                  <TableCell>{cust.mobile1}</TableCell>
                  <TableCell>{cust.city}</TableCell>
                  <TableCell>{cust.grade}</TableCell>
                  <TableCell>{cust.active ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              ))}
              {filteredCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No matching records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default CustomerTable;
