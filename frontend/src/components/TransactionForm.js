import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Paper,
  MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import api from '../services/api';

function TransactionForm() {
  const today = new Date().toISOString().split('T')[0];

  const [transaction, setTransaction] = useState({
    regId: '',
    EID: '',
    cusId: '',
    name: '',
    number: '',
    city: '',
    PID: '',
    ChitID: '',
    date: today,           // default date set to today
    todayAmount: '',
    receivedAmount: '',
    goldGram: '',
    payMode: '',
    status: 'Received',    // status set internally, hidden in UI
  });

  const [regIds, setRegIds] = useState([]);       // For RegID dropdown options


  // Fetch regIds, chit ids, and customers on mount
  useEffect(() => {
    const fetchRegIds = async () => {
      try {
        const res = await api.get('/chitregisters'); // fetch all chit registers
        // Extract unique regIds for dropdown
        const uniqueRegIds = [...new Set(res.data.map(item => item.regId))];
        setRegIds(uniqueRegIds);
      } catch (error) {
        console.error('Error fetching registration IDs:', error);
      }
    };

   

   

    fetchRegIds();
   
  }, []);

  // Fetch next EID for a given date
  const fetchNextEID = async (dateValue) => {
    try {
      const res = await api.get('/transactions/next-eid', {
        params: { date: dateValue },
      });
      setTransaction((prev) => ({
        ...prev,
        EID: res.data.nextEID,
      }));
    } catch (error) {
      console.error('Error fetching next EID:', error);
    }
  };

  useEffect(() => {
    fetchNextEID(today);
  }, [today]);

  // Fetch today's gold rate on mount
  useEffect(() => {
    const fetchTodayRate = async () => {
      try {
        const res = await api.get('/todayrates/by-date', {
          params: { date: today },
        });
        setTransaction((prev) => ({
          ...prev,
          todayAmount: res.data.todayRate.toString(),
        }));
      } catch (error) {
        console.warn('No today rate found on load:', error?.response?.data?.message || error.message);
      }
    };
    fetchTodayRate();
  }, [today]);

  // Fetch chitregister details by regId, populate transaction data and chitids dropdown for that regId
  const fetchDetailsByRegId = async (regId) => {
    try {
      const res = await api.get(`/chitregisters/${regId}`);

      if (!res.data.length) {
        alert('No record found for given RegID');
        return;
      }

      const first = res.data[0];
      
      setTransaction((prev) => ({
        ...prev,
        regId,
        cusId: first.cusId,
        name: first.name,
        city: first.city,
        number: first.number,
        PID: first.PID,
        ChitID: first.chitId, // Reset until user selects chit id
      }));

     
    } catch (err) {
      console.error('Error fetching data by regId:', err);
      alert('Failed to fetch data for RegID');
    }
  };

  // Fetch today rate if selected date is today
  const checkAndFetchTodayRate = async (selectedDate) => {
    const selectedFormatted = new Date(selectedDate).toISOString().split('T')[0];
    const todayFormatted = new Date().toISOString().split('T')[0];

    if (selectedFormatted === todayFormatted) {
      try {
        const res = await api.get('/todayrates/by-date', {
          params: { date: selectedFormatted },
        });
        const rate = res.data.todayRate;

        setTransaction((prev) => ({
          ...prev,
          todayAmount: rate.toString(),
        }));
      } catch (error) {
        console.warn('No today rate found:', error?.response?.data?.message || error.message);
        setTransaction((prev) => ({
          ...prev,
          todayAmount: '',
        }));
      }
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setTransaction((prev) => {
      let updated = { ...prev, [name]: value };

      if (name === 'regId') {
        // Fetch details when regId changes
        if (value) fetchDetailsByRegId(value);
      }

      if (name === 'date') {
        checkAndFetchTodayRate(value);
        fetchNextEID(value);
      }

      if (
        (name === 'receivedAmount' || name === 'todayAmount') &&
        updated.todayAmount &&
        updated.receivedAmount &&
        !isNaN(updated.todayAmount) &&
        !isNaN(updated.receivedAmount) &&
        Number(updated.todayAmount) > 0
      ) {
        updated.goldGram = (Number(updated.receivedAmount) / Number(updated.todayAmount)).toFixed(4);
      }

      return updated;
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions', {
        ...transaction,
        todayAmount: Number(transaction.todayAmount),
        receivedAmount: Number(transaction.receivedAmount),
        goldGram: Number(transaction.goldGram),
        status: 'Received',
      });

      alert('Transaction created successfully');

      const newDate = transaction.date;

      // Fetch the next EID for the same date
      await fetchNextEID(newDate);

      // Reset form but retain today's date and today's rate
      setTransaction((prev) => ({
        ...prev,
        regId: '',
        cusId: '',
        name: '',
        number: '',
        city: '',
        PID: '',
        ChitID: '',
        date: newDate,
        todayAmount: prev.todayAmount,
        receivedAmount: '',
        goldGram: '',
        payMode: '',
        status: 'Received',
        EID: '',  // reset EID so it will update after fetchNextEID
      }));

    } catch (err) {
      console.error(err);
      alert('Failed to create transaction');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Add Transaction
        </Typography>
        <form onSubmit={handleSubmit}>

          {/* EID field - disabled */}
          <TextField
            fullWidth
            margin="normal"
            label="EID"
            name="EID"
            value={transaction.EID}
            disabled
          />

          {/* Registration ID as Select dropdown */}
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="regId-label">Registration ID</InputLabel>
            <Select
              labelId="regId-label"
              name="regId"
              value={transaction.regId}
              label="Registration ID"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {regIds.map((regId) => (
                <MenuItem key={regId} value={regId}>
                  {regId}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

        {/* Chit ID as disabled text field */}
<TextField
  fullWidth
  margin="normal"
  label="Chit ID"
  name="ChitID"
  value={transaction.ChitID}
  disabled
/>

{/* Customer ID as disabled text field */}
<TextField
  fullWidth
  margin="normal"
  label="Customer ID"
  name="cusId"
  value={transaction.cusId}
  disabled
/>
          {/* Disabled text fields populated automatically */}
          <TextField fullWidth margin="normal" label="Name" name="name" value={transaction.name} disabled />
          <TextField fullWidth margin="normal" label="Mobile" name="number" value={transaction.number} disabled />
          <TextField fullWidth margin="normal" label="PID" name="PID" value={transaction.PID} disabled />
          <TextField fullWidth margin="normal" label="City" name="city" value={transaction.city} disabled />

          {/* Date */}
          <TextField
            fullWidth
            margin="normal"
            label="Date"
            type="date"
            name="date"
            value={transaction.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />

          {/* Today Gold Rate */}
          <TextField
            fullWidth
            margin="normal"
            label="Today Gold Rate"
            type="number"
            name="todayAmount"
            value={transaction.todayAmount}
            onChange={handleChange}
            required
            InputProps={{
              readOnly: transaction.date === today,
            }}
          />

          {/* Received Amount */}
          <TextField
            fullWidth
            margin="normal"
            label="Received Amount"
            type="number"
            name="receivedAmount"
            value={transaction.receivedAmount}
            onChange={handleChange}
          />

          {/* Gold Gram */}
          <TextField
            fullWidth
            margin="normal"
            label="Gold Gram"
            type="number"
            name="goldGram"
            value={transaction.goldGram}
            onChange={handleChange}
          />

          {/* Pay Mode */}
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="payMode-label">Pay Mode</InputLabel>
            <Select
              labelId="payMode-label"
              name="payMode"
              value={transaction.payMode}
              label="Pay Mode"
              onChange={handleChange}
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Bank">Bank</MenuItem>
            </Select>
          </FormControl>

          {/* Submit Button */}
          <Button variant="contained" type="submit" sx={{ mt: 3 }}>
            Add Transaction
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default TransactionForm;
