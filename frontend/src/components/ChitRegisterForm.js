import React, { useEffect, useState } from 'react';
import {
  Box, TextField, Button, Typography, Paper, MenuItem, AppBar,
  Toolbar, Select, InputLabel, FormControl, Dialog,
  DialogTitle, DialogContent, DialogActions, Divider
} from '@mui/material';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import api from '../services/api';

function ChitRegisterForm() {
  const today = new Date().toISOString().split('T')[0];
const calculateMaturityDate = (startDate, period) => {
  if (!startDate || isNaN(new Date(startDate))) return '';
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + Number(period || 0));
  return date.toISOString().split('T')[0];
};
  const formatDateToDDMMMYYYY = (dateStr) => {
    if (!dateStr) return '';
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dateObj = new Date(dateStr);
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const mmm = months[dateObj.getMonth()];
    const yyyy = dateObj.getFullYear();
    return `${dd}-${mmm}-${yyyy}`;
  };

  const [formData, setFormData] = useState({
  cusId: '',
  name: '',
  city: '',
  number: '',
  PID: '',
  chitId: '',
  schemeName: '',
  period: '',
  installAmount: '', // ✅ Added here
  startedOn: today,
  maturityDate: calculateMaturityDate(today, 12),
  closedOn: '',
  status: 'Open',
  nomineeName: '',
  relation: '',
  nomineeNumber: '',
  nomineeCity: '',
});


  const [customers, setCustomers] = useState([]);
  const [chitIds, setChitIds] = useState([]);
  const [savedData, setSavedData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

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
  let updated = { ...formData, [name]: value };

  if (name === 'cusId') {
    fetchCustomerDetails(value);
  }

  if (name === 'startedOn') {
    updated.maturityDate = calculateMaturityDate(value);
  }

  if (name === 'chitId') {
    const selectedChit = chitIds.find((chit) => chit.chitId === value);
    if (selectedChit) {
      updated.schemeName = selectedChit.schemeName;
      updated.period = selectedChit.period;
        updated.maturityDate = calculateMaturityDate(formData.startedOn, selectedChit.period);
    }
  }
  if (name === 'startedOn') {
    updated.maturityDate = calculateMaturityDate(value, formData.period || 12);
  }
  setFormData(updated);
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/chitregisters', formData);
      setSavedData(res.data);
      setOpenDialog(true);
    } catch (err) {
      console.error('Failed to create chit register:', err);
      alert('Error creating chit register');
    }
  };

  const handleClear = () => {
    setFormData({
      cusId: '',
      name: '',
      city: '',
      number: '',
      PID: '',
      chitId: '',
        schemeName: '',
  period: '',
      startedOn: today,
     maturityDate: calculateMaturityDate(today, 12),
      closedOn: '',
      status: 'Open',
      nomineeName: '',
      relation: '',
      nomineeNumber: '',
      nomineeCity: '',
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSavedData(null);
    handleClear();
  };

  const handlePrint = async () => {
    if (!savedData) return;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [80, 150] });
    const pageWidth = 80;
    let y = 10;

    pdf.setFont('courier', 'normal');
    pdf.setFontSize(13).setFont(undefined, 'bold');
    pdf.text('Registration', pageWidth / 2, y, { align: 'center' });
    y += 8;

    pdf.setFontSize(8).setFont(undefined, 'normal');
    const addLine = (label, val) => {
      pdf.text(`${label}: ${val || ''}`, 4, y);
      y += 6;
    };

    addLine('Register ID', savedData.regId);
    addLine('Customer ID', savedData.cusId);
    addLine('Name', savedData.name);
    addLine('Mobile', savedData.number);
    addLine('City', savedData.city);
    addLine('PID', savedData.PID);
    addLine('Chit ID', savedData.chitId);
    addLine('Scheme', savedData.schemeName);
addLine('Period', `${savedData.period} months`);
    addLine('Started On', formatDateToDDMMMYYYY(savedData.startedOn));
    addLine('Maturity Date', formatDateToDDMMMYYYY(savedData.maturityDate));
    if (savedData.status === 'Closed') {
      addLine('Closed On', formatDateToDDMMMYYYY(savedData.closedOn));
    }

    pdf.text('Nominee Details', 4, y); y += 6;
    addLine('Name', savedData.nomineeName);
    addLine('Relation', savedData.relation);
    addLine('Number', savedData.nomineeNumber);
    addLine('City', savedData.nomineeCity);
    y += 10;

    try {
      const qrUrl = `https://yourdomain.com/chitregister/${savedData.regId}`;
      const qrDataUrl = await QRCode.toDataURL(qrUrl);
      pdf.addImage(qrDataUrl, 'PNG', (pageWidth - 30) / 2, y, 30, 30);
      y += 34;
      pdf.setFontSize(6);
      pdf.setFont(undefined, 'italic');
      pdf.text('Scan QR to view registration details', pageWidth / 2, y, { align: 'center' });
    } catch (err) {
      console.error('QR generation failed:', err);
    }

    pdf.save(`Registration_${savedData.regId || 'unknown'}.pdf`);
  };

  return (
   <Box sx={{ maxWidth: 900, mx: 'auto', mt: 1 }}>
  {/* Always visible Chit ID selector */}
  <AppBar
    position="static"
    sx={{
      borderRadius: 1,
      backgroundColor: 'gold',
      color: 'black'
    }}
  >
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Chit Registration Form
      </Typography>
      <FormControl size="small" sx={{ minWidth: 150 }}>
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
    </Toolbar>
  </AppBar>
{!formData.chitId && (
  <Box mt={2} textAlign="center">
    <Typography variant="subtitle1" color="error">
      ⚠️ Please select a Chit ID to proceed.
    </Typography>
  </Box>
)}
  {/* Show form only if chitId is selected */}
  {formData.chitId && (
    <Paper elevation={3} sx={{ p: 4, mt: 3, borderRadius: 2 }}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom color="primary">Customer Details</Typography>
        <Divider sx={{ mb: 3 }} />

        <Box display="flex" gap={2} flexWrap="wrap">
          <FormControl fullWidth sx={{ flex: 1, minWidth: 250 }} required>
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
          <TextField label="PID" value={formData.PID} fullWidth sx={{ flex: 1, minWidth: 250 }} disabled />
        </Box>

        <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
          <TextField label="Name" value={formData.name} fullWidth sx={{ flex: 1, minWidth: 250 }} disabled />
          <TextField label="Mobile" value={formData.number} fullWidth sx={{ flex: 1, minWidth: 250 }} disabled />
        </Box>

        <TextField label="City" value={formData.city} fullWidth sx={{ mt: 2 }} disabled />
<Box display="flex" gap={2} flexWrap="wrap" mt={2}>
  <TextField
  required
  label="Installment Amount"
  name="installAmount"
  type="number"
  value={formData.installAmount}
  onChange={handleChange}
  fullWidth
  sx={{ mt: 2 }}
/>
  <TextField
    label="Scheme Name"
    value={formData.schemeName}
    fullWidth
    disabled
    sx={{ flex: 1, minWidth: 250 }}
  />
  <TextField
    label="Period (Months)"
    value={formData.period}
    fullWidth
    disabled
    sx={{ flex: 1, minWidth: 250 }}
  />
</Box>

        <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
          <TextField
            type="date"
            label="Started On"
            name="startedOn"
            value={formData.startedOn}
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
            fullWidth
            sx={{ flex: 1, minWidth: 250 }}
          />
          <TextField
            type="date"
            label="Maturity Date"
            name="maturityDate"
            value={formData.maturityDate}
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
            fullWidth
            sx={{ flex: 1, minWidth: 250 }}
          />
        </Box>

        <Typography variant="h6" sx={{ mt: 4 }} color="primary">Nominee Details</Typography>
        <Divider sx={{ mb: 2 }} />

        <Box display="flex" flexWrap="wrap" gap={2}>
          <TextField required label="Nominee Name" name="nomineeName" value={formData.nomineeName} onChange={handleChange} fullWidth sx={{ flex: 1, minWidth: 250 }} />
          <TextField required label="Relation" name="relation" value={formData.relation} onChange={handleChange} fullWidth sx={{ flex: 1, minWidth: 250 }} />
          <TextField required label="Nominee Number" name="nomineeNumber" value={formData.nomineeNumber} onChange={handleChange} fullWidth sx={{ flex: 1, minWidth: 250 }} />
          <TextField required label="Nominee City" name="nomineeCity" value={formData.nomineeCity} onChange={handleChange} fullWidth sx={{ flex: 1, minWidth: 250 }} />
        </Box>

        <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
          <Button variant="outlined" onClick={handleClear}>Clear</Button>
          <Button variant="contained" type="submit">Submit</Button>
        </Box>
      </form>
    </Paper>
  )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Registration Successful</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom><strong>Register ID:</strong> {savedData?.regId}</Typography>
          <Typography gutterBottom><strong>Name:</strong> {savedData?.name}</Typography>
          <Typography gutterBottom><strong>Chit ID:</strong> {savedData?.chitId}</Typography>
          <Typography gutterBottom><strong>Started:</strong> {formatDateToDDMMMYYYY(savedData?.startedOn)}</Typography>
          <Typography gutterBottom><strong>Maturity:</strong> {formatDateToDDMMMYYYY(savedData?.maturityDate)}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button onClick={handlePrint} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ChitRegisterForm;
