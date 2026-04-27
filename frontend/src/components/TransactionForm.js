import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Paper, MenuItem,
  FormControl, InputLabel, Select, Grid, Typography,
  Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete,
  Card, CardContent, Divider, Stack
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Print as PrintIcon,
  CheckCircle as CheckCircleIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import api from '../services/api';
import QRCode from 'qrcode';

function TransactionForm() {
  const theme = useTheme();
  const today = new Date().toISOString().split('T')[0];
  const todayFormatted = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const [transaction, setTransaction] = useState({
    regId: '', EID: '', cusId: '', name: '', number: '', city: '', PID: '', ChitID: '',
    date: today, todayAmount: '', receivedAmount: '', goldGram: '', payMode: '', status: 'Received',
  });

  const [regIds, setRegIds] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [savedData, setSavedData] = useState(null);
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

      const monthYear = new Date().toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
      }).replace(' ', '-');

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
      regId: '', EID: prev.EID, cusId: '', name: '', number: '', city: '', PID: '', ChitID: '',
      maturityDate: '', date: prev.date, todayAmount: prev.todayAmount, receivedAmount: '',
      goldGram: '', payMode: '', paidFor:'', status: 'Received',
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { regId, receivedAmount, payMode } = transaction;

    if (!regId || !receivedAmount || Number(receivedAmount) <= 0 || !payMode) {
      return setSnackbar({ open: true, message: 'Please complete all required fields.', severity: 'warning' });
    }

    try {
      const payload = {
        ...transaction,
        todayAmount: Number(transaction.todayAmount) || 0,
        receivedAmount: Number(transaction.receivedAmount) || 0,
        goldGram: Number(transaction.goldGram) || 0,
      };

      const res = await api.post('/transactions', payload);
      setSnackbar({ open: true, message: 'Transaction saved successfully!', severity: 'success' });
      setSavedData(res.data || transaction);
      setDialogOpen(true);
      fetchNextEID(transaction.date);
      handleClear();
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || 'Failed to save transaction.', 
        severity: 'error' 
      });
    }
  };

  useEffect(() => {
    const rate = parseFloat(transaction.todayAmount);
    const received = parseFloat(transaction.receivedAmount);
    if (!isNaN(rate) && rate > 0 && !isNaN(received)) {
      setTransaction(prev => ({ ...prev, goldGram: (received / rate).toFixed(4) }));
    } else {
      setTransaction(prev => ({ ...prev, goldGram: '' }));
    }
  }, [transaction.todayAmount, transaction.receivedAmount]);

  const handlePrint = async () => {
    if (!savedData) return;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [80, 150] });
    const pageWidth = 80;
    let y = 10;

    pdf.setFont('courier', 'bold').setFontSize(14);
    pdf.text('CHITSYS RECEIPT', pageWidth / 2, y, { align: 'center' });
    y += 10;

    pdf.setFont('courier', 'normal').setFontSize(8);
    pdf.text(`Date: ${new Date(savedData.date).toLocaleDateString()}`, 4, y);
    pdf.text(`EID: ${savedData.EID}`, pageWidth - 4, y, { align: 'right' });
    y += 8;

    pdf.text('-----------------------------------', 4, y); y += 5;
    pdf.text(`Customer: ${savedData.name}`, 4, y); y += 5;
    pdf.text(`Reg ID: ${savedData.regId}`, 4, y); y += 8;

    pdf.setFont('courier', 'bold');
    pdf.text(`Received: INR ${savedData.receivedAmount}`, 4, y); y += 5;
    pdf.text(`Gold Gram: ${savedData.goldGram} g`, 4, y); y += 5;
    pdf.text(`Rate: INR ${savedData.todayAmount}`, 4, y); y += 10;

    try {
      const qrDataUrl = await QRCode.toDataURL(`https://chitsys.com/verify/${savedData.EID}`);
      pdf.addImage(qrDataUrl, 'PNG', (pageWidth - 25) / 2, y, 25, 25);
    } catch (err) { console.error(err); }

    pdf.save(`Receipt_${savedData.EID}.pdf`);
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', py: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-1px' }}>New Installment</Typography>
          <Typography variant="body2" color="text.secondary">Record a new gold chit transaction for {todayFormatted}</Typography>
        </Box>
        <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.warning.main, 0.1), borderRadius: 3, border: '1px solid', borderColor: alpha(theme.palette.warning.main, 0.2) }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'warning.dark', textTransform: 'uppercase', display: 'block' }}>Current Gold Rate</Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'warning.dark' }}>₹{transaction.todayAmount || '-'}</Typography>
        </Paper>
      </Stack>

      {isFormDisabled && (
        <Alert severity="warning" variant="outlined" sx={{ mb: 3, borderRadius: 3, bgcolor: alpha(theme.palette.warning.main, 0.02) }}>
          {maturityDatePassed ? 'Maturity date has passed for this registration. Transactions are disabled.' : 'Gold rate is not available for today. Please set the rate before proceeding.'}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Transaction Details</Typography>
              
              <Box sx={{ mb: 4 }}>
                <Autocomplete
                  options={regIds}
                  value={transaction.regId || null}
                  onChange={(e, val) => {
                    setTransaction(prev => ({ ...prev, regId: val || '' }));
                    if (val) fetchDetailsByRegId(val);
                  }}
                  disabled={isFormDisabled && !maturityDatePassed}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Registration ID" required fullWidth variant="outlined" />
                  )}
                />
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Received Amount (INR)" name="receivedAmount" type="number" value={transaction.receivedAmount} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Gold Gram (Calculated)" value={transaction.goldGram} disabled InputProps={{ sx: { bgcolor: 'action.hover', fontWeight: 700 } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Payment Mode</InputLabel>
                    <Select name="payMode" value={transaction.payMode} label="Payment Mode" onChange={handleChange}>
                      <MenuItem value="Cash">Cash Payment</MenuItem>
                      <MenuItem value="Online">Online Transfer</MenuItem>
                      <MenuItem value="Bank">Bank Deposit</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Paid For Month" value={transaction.paidFor} disabled InputProps={{ sx: { bgcolor: 'action.hover' } }} />
                </Grid>
              </Grid>

              <Box sx={{ mt: 5, display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={handleSubmit} 
                  disabled={isFormDisabled}
                  startIcon={<CheckCircleIcon />}
                  sx={{ flexGrow: 2, py: 1.5, borderRadius: 3 }}
                >
                  Confirm & Save
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  size="large" 
                  onClick={handleClear}
                  startIcon={<ClearIcon />}
                  sx={{ flexGrow: 1, borderRadius: 3 }}
                >
                  Clear
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 4, bgcolor: alpha(theme.palette.secondary.main, 0.02) }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Customer Snapshot</Typography>
              <Stack spacing={2.5}>
                {[
                  { label: 'Customer Name', value: transaction.name || '-' },
                  { label: 'Customer ID', value: transaction.cusId || '-' },
                  { label: 'Mobile Number', value: transaction.number || '-' },
                  { label: 'City', value: transaction.city || '-' },
                  { label: 'Chit ID', value: transaction.ChitID || '-' },
                  { label: 'Maturity Date', value: transaction.maturityDate || '-' },
                ].map((item) => (
                  <Box key={item.label}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>{item.label}</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{item.value}</Typography>
                    <Divider sx={{ mt: 1, borderStyle: 'dashed' }} />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar(p => ({ ...p, open: false }))}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: 3, boxShadow: 3 }}>{snackbar.message}</Alert>
      </Snackbar>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} PaperProps={{ sx: { borderRadius: 5, p: 2 } }}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>Success!</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography align="center" color="text.secondary">The transaction has been recorded. EID: <b>{savedData?.EID}</b></Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
          <Button variant="outlined" onClick={() => setDialogOpen(false)} sx={{ borderRadius: 10 }}>Close</Button>
          <Button variant="contained" color="success" onClick={handlePrint} startIcon={<PrintIcon />} sx={{ borderRadius: 10 }}>Print Receipt</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TransactionForm;
