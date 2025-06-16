import React, { useEffect, useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, CircularProgress,
  TextField
} from '@mui/material';
import api from '../services/api'; // Adjust this import according to your setup

// Helper to format date as DDMMMYYYY, e.g. 16Jun2025
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day}${month}${year}`;
}

function ChitRecord() {
  const [chits, setChits] = useState([]);
  const [filteredChits, setFilteredChits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function fetchChits() {
      try {
        const res = await api.get('/chitregisters'); // Adjust endpoint as needed
        setChits(res.data);
        setFilteredChits(res.data);
      } catch (error) {
        console.error('Failed to fetch chit registers:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchChits();
  }, []);

  useEffect(() => {
    const lowerFilter = filter.toLowerCase();
    const filtered = chits.filter(
      chit =>
        chit.regId.toLowerCase().includes(lowerFilter) ||
        (chit.name && chit.name.toLowerCase().includes(lowerFilter))
    );
    setFilteredChits(filtered);
  }, [filter, chits]);

  return (
    <Box sx={{ maxWidth: '95%', mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Chit Register Records
      </Typography>

      <TextField
        label="Filter by Reg ID or Customer Name"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {loading ? (
        <Box textAlign="center" mt={4}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Reg ID</strong></TableCell>
                <TableCell><strong>Customer Name</strong></TableCell>
                <TableCell><strong>City</strong></TableCell>
                <TableCell><strong>Started On</strong></TableCell>
                <TableCell><strong>Maturity Date</strong></TableCell>
                <TableCell><strong>Period</strong></TableCell>
                <TableCell><strong>Install Amount</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredChits.length > 0 ? filteredChits.map((chit) => (
                <TableRow key={chit._id}>
                  <TableCell>{chit.regId}</TableCell>
                  <TableCell>{chit.name}</TableCell>
                  <TableCell>{chit.city}</TableCell>
                  <TableCell>{formatDate(chit.startedOn)}</TableCell>
                  <TableCell>{formatDate(chit.maturityDate)}</TableCell>
                  <TableCell>{chit.period}</TableCell>
                  <TableCell>{chit.installAmount}</TableCell>
                  <TableCell>{chit.status}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">No records found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default ChitRecord;
