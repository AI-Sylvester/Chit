import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress,
  FormControl, InputLabel, Select, MenuItem, Button, TextField, 
} from '@mui/material';
import api from '../services/api'; // Axios instance

function ChitRegisterList() {
  const [regIds, setRegIds] = useState([]);
  const [selectedRegId, setSelectedRegId] = useState('');
  const [chitDetails, setChitDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payMode, setPayMode] = useState('');
  const [refNo, setRefNo] = useState('');

  const totalAmount = transactions.reduce((sum, tx) => sum + (tx.receivedAmount || 0), 0);
  const totalGrams = transactions.reduce((sum, tx) => sum + (tx.goldGram || 0), 0);

  // Fetch all regIds
  useEffect(() => {
    const fetchAllRegIds = async () => {
      try {
        const res = await api.get('/chitregisters');
        const ids = [...new Set(res.data.map(item => item.regId))];
        setRegIds(ids);
      } catch (err) {
        console.error('Failed to fetch regIds:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllRegIds();
  }, []);

  // Fetch chit and transactions
  useEffect(() => {
    if (!selectedRegId) {
      setChitDetails(null);
      setTransactions([]);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [chitRes, txRes] = await Promise.all([
          api.get(`/chitregisters/${selectedRegId}`),
          api.get(`/transactions/by-regid/${selectedRegId}`)
        ]);
        setChitDetails(chitRes.data[0]);
        setTransactions(txRes.data || []);
      } catch (err) {
        console.error('Error fetching details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [selectedRegId]);

  const handleCloseChit = async () => {
    if (!payMode || !refNo) {
      return alert("Please enter Pay Mode and Reference No.");
    }

    try {
      const closeDate = new Date();

      // 1. Update ChitRegister
      await api.put(`/chitregisters/close/${selectedRegId}`, {
        totalAmount,
        totalGrams,
        payMode,
        refNo,
        closedOn: closeDate,
      });

      // 2. Update Transactions
      await api.put(`/transactions/settle/${selectedRegId}`, {
        onDate: closeDate,
      });

      alert("Chit closed successfully!");

      // Refresh state
      setSelectedRegId('');
    } catch (err) {
      console.error('Error closing chit:', err);
      alert("Failed to close chit.");
    }
  };

  return (
    <Box sx={{ maxWidth: '95%', mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Chit Register & Transactions</Typography>

          <Box display="flex" gap={2}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Reg ID</InputLabel>
              <Select
                value={selectedRegId}
                label="Reg ID"
                onChange={(e) => setSelectedRegId(e.target.value)}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {regIds.map((id) => (
                  <MenuItem key={id} value={id}>{id}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {chitDetails?.status === 'Open' && (
              <>
                <TextField
                  label="Pay Mode"
                  size="small"
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value)}
                />
                <TextField
                  label="Ref No"
                  size="small"
                  value={refNo}
                  onChange={(e) => setRefNo(e.target.value)}
                />
                <Button variant="contained" color="error" onClick={handleCloseChit}>
                  Close Chit
                </Button>
              </>
            )}
          </Box>
        </Box>

        {loading ? (
          <Box textAlign="center"><CircularProgress /></Box>
        ) : (
          <>
            {chitDetails ? (
              <Box mb={3}>
                <Typography variant="h6">Chit Register Details</Typography>
                <Typography><strong>Name:</strong> {chitDetails.name}</Typography>
                <Typography><strong>Chit ID:</strong> {chitDetails.chitId}</Typography>
                <Typography><strong>Status:</strong> {chitDetails.status}</Typography>
                <Typography><strong>Started On:</strong> {new Date(chitDetails.startedOn).toLocaleDateString()}</Typography>
                {chitDetails.closedOn && (
                  <Typography><strong>Closed On:</strong> {new Date(chitDetails.closedOn).toLocaleDateString()}</Typography>
                )}
              </Box>
            ) : selectedRegId ? (
              <Typography>No chit register found for selected Reg ID.</Typography>
            ) : (
              <Typography>Select a Reg ID to view details.</Typography>
            )}

            <Box display="flex" justifyContent="flex-end" gap={4} my={2}>
              <Typography><strong>Total Amount:</strong> ₹{totalAmount.toFixed(2)}</Typography>
              <Typography><strong>Total Gold:</strong> {totalGrams.toFixed(2)}g</Typography>
            </Box>

            <Typography variant="h6" mt={4}>Transactions</Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>EID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Gold Gram</TableCell>
                    <TableCell>Pay Mode</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map(tx => (
                    <TableRow key={tx._id}>
                      <TableCell>{tx.EID}</TableCell>
                      <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                      <TableCell>{tx.receivedAmount}</TableCell>
                      <TableCell>{tx.goldGram}</TableCell>
                      <TableCell>{tx.payMode}</TableCell>
                      <TableCell>{tx.status}</TableCell>
                    </TableRow>
                  ))}
                  {transactions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">No transactions found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Paper>
    </Box>
  );
}

export default ChitRegisterList;
