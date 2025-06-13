import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button } from '@mui/material';
import api from '../services/api';

function TodayRateForm() {
  const [todayRate, setTodayRate] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/todayrates', { date, todayRate: Number(todayRate) });
      alert('Today Rate saved successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to save Today Rate');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Add Today Rate
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            label="Today Rate"
            type="number"
            value={todayRate}
            onChange={(e) => setTodayRate(e.target.value)}
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" sx={{ mt: 3 }}>
            Save Rate
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default TodayRateForm;
