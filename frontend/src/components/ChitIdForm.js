import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Paper, List, ListItem, ListItemText, Divider
} from '@mui/material';
import api from '../services/api';

function ChitIdForm() {
  const [chitId, setChitId] = useState('');
  const [chitList, setChitList] = useState([]);

  const fetchChits = async () => {
    try {
      const res = await api.get('/chitids');
      setChitList(res.data);
    } catch (err) {
      console.error('Failed to fetch Chit IDs', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/chitids', { chitId });
      setChitId('');
      fetchChits();
    } catch (err) {
      console.error('Failed to add Chit ID', err);
    }
  };

  useEffect(() => {
    fetchChits();
  }, []);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Add Chit ID
        </Typography>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <TextField
            fullWidth
            label="Enter Chit ID"
            value={chitId}
            onChange={(e) => setChitId(e.target.value)}
            required
          />
          <Button type="submit" variant="contained">
            Add
          </Button>
        </form>

        <Typography variant="h6" gutterBottom>
          Existing Chit IDs
        </Typography>
        <List dense>
          {chitList.map((chit) => (
            <React.Fragment key={chit._id}>
              <ListItem>
                <ListItemText primary={chit.chitId} />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default ChitIdForm;
