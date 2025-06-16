import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, TextField, Button, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent,
  DialogActions, Snackbar, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import api from '../services/api';

function TodayRateManager() {
  const [rates, setRates] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRate, setNewRate] = useState({ date: '', todayRate: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const res = await api.get('/todayrates');
      const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRates(sorted);
    } catch {
      setSnackbar({ open: true, message: 'Failed to load rates.', severity: 'error' });
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleRateChange = (index, value) => {
    const updated = [...rates];
    updated[index].todayRate = value;
    setRates(updated);
  };

  const handleSaveEdit = async (index) => {
    const { _id, todayRate } = rates[index];
    try {
      await api.put(`/todayrates/${_id}`, { todayRate: Number(todayRate) });
      setSnackbar({ open: true, message: 'Rate updated.', severity: 'success' });
      setEditingIndex(null);
      fetchRates();
    } catch {
      setSnackbar({ open: true, message: 'Failed to update rate.', severity: 'error' });
    }
  };

  const handleDialogOpen = () => {
    const today = new Date().toISOString().split('T')[0];
    setNewRate({ date: today, todayRate: '' });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleNewRateSubmit = async () => {
    try {
      await api.post('/todayrates', {
        date: newRate.date,
        todayRate: Number(newRate.todayRate)
      });
      setSnackbar({ open: true, message: 'Rate added.', severity: 'success' });
      setDialogOpen(false);
      fetchRates();
    } catch {
      setSnackbar({ open: true, message: 'Failed to add rate.', severity: 'error' });
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Today Rates</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleDialogOpen}>
            Add Rate
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Today Rate (₹)</strong></TableCell>
              <TableCell align="center"><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {rates.map((rate, index) => {
    const isToday =
      new Date(rate.date).toDateString() === new Date().toDateString();

    return (
      <TableRow
        key={rate._id}
        sx={{
  backgroundColor: isToday ? '#FFE082' : 'inherit', // Amber 200
  fontWeight: isToday ? 'bold' : 'normal'
}}
      >
        <TableCell>
  {new Date(rate.date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })}
</TableCell>
        <TableCell>
          {editingIndex === index ? (
            <TextField
              type="number"
              size="small"
              value={rate.todayRate}
              onChange={(e) => handleRateChange(index, e.target.value)}
            />
          ) : (
            `₹${rate.todayRate}`
          )}
        </TableCell>
        <TableCell align="center">
          {editingIndex === index ? (
            <IconButton onClick={() => handleSaveEdit(index)} color="success">
              <SaveIcon />
            </IconButton>
          ) : (
            <IconButton onClick={() => handleEdit(index)} color="primary">
              <EditIcon />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
    );
  })}
</TableBody>
        </Table>
      </TableContainer>

      {/* Add Rate Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add Today Rate</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={newRate.date}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
            disabled
          />
          <TextField
            fullWidth
            label="Today Rate"
            type="number"
            value={newRate.todayRate}
            onChange={(e) => setNewRate({ ...newRate, todayRate: e.target.value })}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleNewRateSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(p => ({ ...p, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default TodayRateManager;
