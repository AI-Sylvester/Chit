import React, { useEffect, useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Paper, Typography,AppBar,Toolbar
} from '@mui/material';
import api from '../services/api'; // Make sure the path is correct

function TransactionTable() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    EID: '',
    regId: '',
    cusId: '',
    receivedAmount: '',
    goldGram: '',
    payMode: '',
    status: '',
  });

  const fetchData = async () => {
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (field) => (event) => {
    setFilters((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const filteredData = transactions.filter((tx) => {
    return Object.keys(filters).every((key) => {
      const value = filters[key].toLowerCase();
      return !value || String(tx[key] || '').toLowerCase().includes(value);
    });
  });

  // ✅ Calculate totals
  const totalReceivedAmount = filteredData.reduce((sum, tx) => sum + parseFloat(tx.receivedAmount || 0), 0);
  const totalGoldGram = filteredData.reduce((sum, tx) => sum + parseFloat(tx.goldGram || 0), 0);

  return (
    <Box sx={{ flexGrow: 1 }}>
  <AppBar position="static" sx={{ backgroundColor: '#FFD700', color: '#000' }}>
  <Toolbar>
    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
      Transaction Records
    </Typography>
  </Toolbar>
</AppBar>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>
                <TextField label="EID" value={filters.EID} onChange={handleFilterChange('EID')} variant="standard" size="small" />
              </TableCell>
              <TableCell>
                <TextField label="Reg ID" value={filters.regId} onChange={handleFilterChange('regId')} variant="standard" size="small" />
              </TableCell>
              <TableCell>
                <TextField label="Customer ID" value={filters.cusId} onChange={handleFilterChange('cusId')} variant="standard" size="small" />
              </TableCell>
              <TableCell>
                <TextField label="Amount" value={filters.receivedAmount} onChange={handleFilterChange('receivedAmount')} variant="standard" size="small" />
              </TableCell>
              <TableCell>
                <TextField label="Gold Gram" value={filters.goldGram} onChange={handleFilterChange('goldGram')} variant="standard" size="small" />
              </TableCell>
              <TableCell>
                <TextField label="Pay Mode" value={filters.payMode} onChange={handleFilterChange('payMode')} variant="standard" size="small" />
              </TableCell>
              <TableCell>
                <TextField label="Status" value={filters.status} onChange={handleFilterChange('status')} variant="standard" size="small" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((tx) => (
              <TableRow key={tx._id}>
                <TableCell>{tx.EID}</TableCell>
                <TableCell>{tx.regId}</TableCell>
                <TableCell>{tx.cusId}</TableCell>
                <TableCell>{tx.receivedAmount}</TableCell>
                <TableCell>{tx.goldGram}</TableCell>
                <TableCell>{tx.payMode}</TableCell>
                <TableCell>{tx.status}</TableCell>
              </TableRow>
            ))}

            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">No transactions found.</TableCell>
              </TableRow>
            )}

            {/* ✅ Totals Row */}
            {filteredData.length > 0 && (
              <TableRow sx={{ backgroundColor: '#e0f7fa' }}>
                <TableCell colSpan={3}><strong>Total</strong></TableCell>
                <TableCell><strong>{totalReceivedAmount.toFixed(2)}</strong></TableCell>
                <TableCell><strong>{totalGoldGram.toFixed(2)}</strong></TableCell>
                <TableCell colSpan={2} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default TransactionTable;
