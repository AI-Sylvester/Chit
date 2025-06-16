import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Paper, List, ListItem, ListItemText, Divider, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import api from '../services/api';

function ChitIdForm() {
  const [chitList, setChitList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedChit, setSelectedChit] = useState(null);

  const [chitId, setChitId] = useState('');
  const [schemeName, setSchemeName] = useState('');
  const [period, setPeriod] = useState('');

  const fetchChits = async () => {
    try {
      const res = await api.get('/chitids');
      setChitList(res.data);
    } catch (err) {
      console.error('Failed to fetch Chit IDs', err);
    }
  };

  useEffect(() => {
    fetchChits();
  }, []);

  const handleOpen = (chit = null) => {
    if (chit) {
      setEditMode(true);
      setSelectedChit(chit);
      setChitId(chit.chitId);
      setSchemeName(chit.schemeName);
      setPeriod(chit.period);
    } else {
      setEditMode(false);
      setChitId('');
      setSchemeName('');
      setPeriod('');
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedChit(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode && selectedChit) {
        await api.put(`/chitids/${selectedChit._id}`, { chitId, schemeName, period });
      } else {
        await api.post('/chitids', { chitId, schemeName, period });
      }
      fetchChits();
      handleClose();
    } catch (err) {
      console.error('Failed to save Chit ID', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/chitids/${id}`);
      fetchChits();
    } catch (err) {
      console.error('Failed to delete Chit ID', err);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
  <Typography variant="h5">Chit ID List</Typography>
  <Button
    variant="contained"
    startIcon={<Add />}
    onClick={() => handleOpen()}
    sx={{ alignSelf: 'flex-end' }}
  >
    Add New Chit ID
  </Button>
</Box>
        <List dense>
          {chitList.map((chit) => (
            <React.Fragment key={chit._id}>
              <ListItem
                secondaryAction={
                  <>
                    <IconButton onClick={() => handleOpen(chit)} edge="end" aria-label="edit">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(chit._id)} edge="end" aria-label="delete">
                      <Delete />
                    </IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={`Chit ID: ${chit.chitId}`}
                  secondary={`Scheme: ${chit.schemeName}, Period: ${chit.period} months`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>

       
      </Paper>

      {/* Dialog Form */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editMode ? 'Edit Chit ID' : 'Add Chit ID'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Chit ID"
              value={chitId}
              onChange={(e) => setChitId(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Scheme Name"
              value={schemeName}
              onChange={(e) => setSchemeName(e.target.value)}
              required
            />
            <TextField
              fullWidth
              select
              label="Period (Months)"
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              required
            >
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={12}>12</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit} variant="contained">
            {editMode ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ChitIdForm;
