import React, { useState, useEffect, useRef } from 'react';
import {
  Box, TextField, Button, Paper, MenuItem,
  FormControl, InputLabel, Select, Grid, Typography,
  Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions,AppBar,Toolbar
} from '@mui/material';
import jsPDF from 'jspdf';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import api from '../services/api';
import QRCode from 'qrcode';

function TransactionForm() {
  const today = new Date().toISOString().split('T')[0];
  const todayFormatted = new Date().toLocaleDateString();

  const [transaction, setTransaction] = useState({
    regId: '', EID: '', cusId: '', name: '', number: '', city: '', PID: '', ChitID: '',
    date: today, todayAmount: '', receivedAmount: '', goldGram: '', payMode: '', status: 'Received',
  });

  const [regIds, setRegIds] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [savedData, setSavedData] = useState(null);
  const printRef = useRef();
const [maturityDatePassed, setMaturityDatePassed] = useState(false);
  const isFormDisabled = !transaction.todayAmount || isNaN(Number(transaction.todayAmount)) || Number(transaction.todayAmount) === 0 || maturityDatePassed;

  useEffect(() => {
    api.get('/chitregisters', { params: { status: 'Open' } })
      .then(res => {
        const unique = [...new Set(res.data.map(item => item.regId))];
        setRegIds(unique);
      })
      .catch(() => {
        setSnackbar({ open: true, message: 'Failed to load Registration IDs.', severity: 'error' });
      });

    fetchTodayRate(today);
    fetchNextEID(today);
  }, [today]);

  const fetchTodayRate = async (dateValue) => {
    try {
      const res = await api.get('/todayrates/by-date', { params: { date: dateValue } });
      setTransaction(prev => ({ ...prev, todayAmount: res.data.todayRate.toString() }));
    } catch {
      setTransaction(prev => ({ ...prev, todayAmount: '' }));
    }
  };

  const fetchNextEID = async (dateValue) => {
    try {
      const res = await api.get('/transactions/next-eid', { params: { date: dateValue } });
      setTransaction(prev => ({ ...prev, EID: res.data.nextEID }));
    } catch {
      setSnackbar({ open: true, message: 'Failed to fetch next EID.', severity: 'error' });
    }
  };

const fetchDetailsByRegId = async (regId) => {
  try {
    const res = await api.get(`/chitregisters/${regId}`);
    if (!res.data.length) {
      setSnackbar({ open: true, message: 'No data found for Registration ID.', severity: 'warning' });
      setMaturityDatePassed(false);
      return;
    }

   const [data] = res.data;
const maturityDateISO = data.maturityDate ? new Date(data.maturityDate).toISOString().split('T')[0] : null;

// Format "MMM-yyyy"
const monthYear = new Date().toLocaleDateString('en-GB', {
  year: 'numeric',
  month: 'short',
}).replace(' ', '-');

// Make sure it matches "Jun-2025"
const formattedMonthYear = monthYear.charAt(0).toUpperCase() + monthYear.slice(1).toLowerCase();

setMaturityDatePassed(maturityDateISO && maturityDateISO < today);

setTransaction(prev => ({
  ...prev,
  regId,
  cusId: data.cusId || '',
  name: data.name || '',
  city: data.city || '',
  number: data.number || '',
  PID: data.PID || '',
  ChitID: data.chitId || '',
  maturityDate: maturityDateISO || '',
  receivedAmount: data.installAmount || '',
 paidFor: formattedMonthYear
}));

  } catch {
    setSnackbar({ open: true, message: 'Error fetching customer details.', severity: 'error' });
    setMaturityDatePassed(false);
  }
};
  const handleClear = () => {
    setTransaction(prev => ({
      regId: '',
      EID: prev.EID,
      cusId: '',
      name: '',
      number: '',
      city: '',
      PID: '',
      ChitID: '',
      maturityDate: '',
      date: prev.date,
      todayAmount: prev.todayAmount,
      receivedAmount: '',
      goldGram: '',
      payMode: '',
      status: 'Received',
    }));
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'regId') fetchDetailsByRegId(value);
      if (name === 'date') {
        fetchTodayRate(value);
        fetchNextEID(value);
      }
     
      return updated;
    });
  };


const handleSubmit = async () => {
  const { regId, receivedAmount, payMode } = transaction;

  // Basic validations
  if (!regId || !receivedAmount || Number(receivedAmount) <= 0 || !payMode) {
    return setSnackbar({
      open: true,
      message: 'Please complete all required fields.',
      severity: 'warning',
    });
  }

  try {
    // 📦 Prepare payload with correct types
    const payload = {
      ...transaction,
      todayAmount: Number(transaction.todayAmount) || 0,
      receivedAmount: Number(transaction.receivedAmount) || 0,
      goldGram: Number(transaction.goldGram) || 0,
    };

    const res = await api.post('/transactions', payload);

    setSnackbar({
      open: true,
      message: 'Transaction saved!',
      severity: 'success',
    });

    setSavedData(res.data || transaction);
    setDialogOpen(true);
    fetchNextEID(transaction.date);

    // ♻ Clear form (preserve date, gold rate, EID)
    setTransaction(prev => ({
      regId: '',
      cusId: '',
      name: '',
      number: '',
      city: '',
      PID: '',
      ChitID: '',
      maturityDate: '',
      paidFor: '',
      EID: prev.EID,
      date: prev.date,
      todayAmount: prev.todayAmount,
      receivedAmount: '',
      goldGram: '',
      payMode: '',
      status: 'Received',
    }));

  } catch (err) {
  console.error('Transaction submission error:', err);

  const errorMsg = err.response?.data?.message || '';

  if (err.response?.status === 400 && errorMsg.toLowerCase().includes('already exists')) {
    return setSnackbar({
      open: true,
      message: errorMsg,
      severity: 'error',
    });
  }

  setSnackbar({
    open: true,
    message: 'Failed to save transaction. Please try again.',
    severity: 'error',
  });
}
};

const { todayAmount, receivedAmount } = transaction;

useEffect(() => {
  const rate = parseFloat(todayAmount);
  const received = parseFloat(receivedAmount);

  if (!isNaN(rate) && rate > 0 && !isNaN(received)) {
    const calculatedGoldGram = (received / rate).toFixed(4);
    setTransaction(prev => ({ ...prev, goldGram: calculatedGoldGram }));
  } else {
    setTransaction(prev => ({ ...prev, goldGram: '' }));
  }
}, [todayAmount, receivedAmount]);

  const handlePrint = async () => {
    if (!savedData) return;

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [80, 150] });
    const pageWidth = 80;
    let y = 10;

    pdf.setFont('courier', 'normal');
    pdf.setFontSize(13).setFont(undefined, 'bold');
    pdf.text('TRANSACTION RECEIPT', pageWidth / 2, y, { align: 'center' });
    y += 8;

    pdf.setFontSize(7).setFont(undefined, 'normal');
    pdf.text(`Date: ${new Date(savedData.date).toLocaleDateString()}`, 4, y);
    pdf.text(`EID: ${savedData.EID}`, pageWidth - 4, y, { align: 'right' });
    y += 6;

    pdf.setFont(undefined, 'bold');
    pdf.text('Customer Info', 4, y);
    y += 5;
    pdf.setFont(undefined, 'normal');
    pdf.text(`Name: ${savedData.name}`, 4, y); y += 5;
    pdf.text(`Mobile: ${savedData.number}`, 4, y); y += 5;
    pdf.text(`City: ${savedData.city}`, 4, y); y += 8;

    pdf.setFont(undefined, 'bold');
    pdf.text('Transaction Details', 4, y); y += 6;
    pdf.setFont(undefined, 'normal');
    // Add Today Gold Rate here
pdf.text(`Today Gold Rate: ${savedData.todayAmount}`, 4, y);
y += 5;
    pdf.text(`Received Amount: ${savedData.receivedAmount}`, 4, y); y += 5;
    pdf.text(`Gold Gram: ${savedData.goldGram}`, 4, y); y += 5;
    pdf.text(`Pay Mode: ${savedData.payMode}`, 4, y); y += 10;

    try {
      const qrUrl = `https://yourdomain.com/transaction/${savedData.regId}`;
      const qrDataUrl = await QRCode.toDataURL(qrUrl);
      pdf.addImage(qrDataUrl, 'PNG', (pageWidth - 30) / 2, y, 30, 30);
      y += 34;
      pdf.setFontSize(6);
      pdf.setFont(undefined, 'italic');
      pdf.text('Scan QR to view transaction details', pageWidth / 2, y, { align: 'center' });
    } catch (err) {
      console.error('QR generation failed:', err);
    }

    pdf.save(`Transaction_${savedData.EID || savedData.regId}.pdf`);
  };


  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 1, fontFamily: `'Segoe UI', 'Roboto', sans-serif` }}>
       {isFormDisabled && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Gold rate is not available for today. Please try again later.
        </Alert>
      )}
      {maturityDatePassed && (
  <Alert severity="warning" sx={{ mb: 2 }}>
    Maturity date has passed for this Registration ID. Transactions are disabled.
  </Alert>
)}
<AppBar
  position="static"
  sx={{
    backgroundColor: '#FFD700', // Gold
    color: 'black',
    mb: 3,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
    borderRadius: 2,
  }}
>
  <Toolbar
    sx={{
      p: 2,
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
    }}
  >
    <Typography variant="h5" sx={{ fontWeight: 600 }}>
      New Transaction Entry
    </Typography>
    <Box textAlign="right">
      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
        Date: {todayFormatted}
      </Typography>
      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
        Today Gold Rate: ₹{transaction.todayAmount || '-'}
      </Typography>
    </Box>
  </Toolbar>
</AppBar>

      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth required>
          <InputLabel>Registration ID</InputLabel>
          <Select
            name="regId"
            value={transaction.regId}
            onChange={handleChange}
            label="Registration ID"
            sx={{ fontSize: 15, fontWeight: 600 }}
            disabled={isFormDisabled}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {regIds.map((id) => (
              <MenuItem key={id} value={id}>{id}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

  <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: '0 3px 8px rgba(0,0,0,0.08)', bgcolor: '#f5f7fa' }}>
  <Grid container spacing={3}>
    {[
  { label: 'Customer ID', field: 'cusId' },
  { label: 'Chit ID', field: 'ChitID' },
  { label: 'Maturity ', field: 'maturityDate' }, // Good label// ✅ Cleaned up label
  { label: 'PID', field: 'PID' },
  { label: 'Customer Name', field: 'name' },
  { label: 'City', field: 'city' },
  { label: 'Mobile', field: 'number' },
 
].map(({ label, field }) => (
      <Grid item xs={12} sm={4} key={field}>
   <TextField
  fullWidth
  label={label}
  name={field}
  type={field === 'maturityDate' ? 'date' : 'text'}
  value={transaction[field]}
  disabled
  InputLabelProps={field === 'maturityDate' ? { shrink: true } : undefined}
  InputProps={{ sx: { fontWeight: 600 } }}
/>
      </Grid>
    ))}
  </Grid>
</Paper>

     <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: '0 3px 8px rgba(0,0,0,0.08)', bgcolor: '#f5f7fa' }}>
  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
    {/* Received Amount */}
    <Box sx={{ flex: 1 }}>
      <TextField
        fullWidth
        type="number"
        label="Received Amount"
        name="receivedAmount"
        value={transaction.receivedAmount}
        onChange={handleChange}
        inputProps={{ min: 0 }}
      />
    </Box>

    {/* Gold Gram */}
    <Box sx={{ flex: 1 }}>
      <TextField
        fullWidth
        type="number"
        label="Gold Gram"
        name="goldGram"
        value={transaction.goldGram}
        onChange={handleChange}
       InputProps={{
    readOnly: true,
    sx: { fontWeight: 600, bgcolor: '#e0e0e0' }
  }}
      />
    </Box>
    {/* Paid For */}
   <Box sx={{ flex: 1 }}>
 <TextField
  fullWidth
  label="Paid For"
  name="paidFor"
  value={transaction.paidFor}
          onChange={handleChange}
  InputProps={{
    readOnly: true,
    sx: { fontWeight: 600, bgcolor: '#e0e0e0' }
  }}
/>
</Box>
<Box sx={{ flex: 1 }}>
      <FormControl fullWidth required disabled={isFormDisabled}>
        <InputLabel>Pay Mode</InputLabel>
        <Select
          name="payMode"
          value={transaction.payMode}
          label="Pay Mode"
          onChange={handleChange}
          sx={{ fontWeight: 600 }}
        >
          <MenuItem value="Cash">Cash</MenuItem>
          <MenuItem value="Online">Online</MenuItem>
          <MenuItem value="Bank">Bank</MenuItem>
        </Select>
      </FormControl>
    </Box>
  </Box>
</Paper>

    
      <Box textAlign="center" mt={4} sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button variant="contained" onClick={handleSubmit} disabled={isFormDisabled}>
          ✅ Add Transaction
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleClear}>
          ✖ Clear
        </Button>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(p => ({ ...p, open: false }))}>
        <Alert onClose={() => setSnackbar(p => ({ ...p, open: false }))} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 3 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main', fontWeight: 'bold' }}>
          <CheckCircleOutlineIcon fontSize="large" /> Transaction Saved!
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>Your transaction has been successfully recorded.</Typography>
          <Typography><strong>EID:</strong> {savedData?.EID || '-'}</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button onClick={() => setDialogOpen(false)} variant="outlined" color="secondary">Close</Button>
          <Button variant="contained" color="success" onClick={handlePrint} startIcon={<CheckCircleOutlineIcon />}>Print Receipt</Button>
        </DialogActions>
      </Dialog>

      <Box ref={printRef} sx={{ display: 'none', p: 3 }}>
        <Typography variant="h6">Transaction Receipt</Typography>
        {Object.entries(savedData || {}).map(([key, val]) => (
          <Typography key={key}><strong>{key}</strong>: {val}</Typography>
        ))}
      </Box>
    </Box>
  );
}

export default TransactionForm;
