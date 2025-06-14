import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress,
  FormControl, InputLabel, Select, MenuItem, Button,
  TextField, AppBar, Toolbar, Divider, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import api from '../services/api';
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

function ChitRegisterList() {
  const [regIds, setRegIds] = useState([]);
  const [selectedRegId, setSelectedRegId] = useState('');
  const [chitDetails, setChitDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payMode, setPayMode] = useState('');
  const [refNo, setRefNo] = useState('');

  // State for popup
  const [showPayIdPopup, setShowPayIdPopup] = useState(false);
  const [closedPayId, setClosedPayId] = useState('');
  const [savedData, setSavedData] = useState(null);

  const totalAmount = transactions.reduce((sum, tx) => sum + (tx.receivedAmount || 0), 0);
  const totalGrams = transactions.reduce((sum, tx) => sum + (tx.goldGram || 0), 0);

  const DetailRow = ({ label, value }) => (
    <Box display="flex" mb={1}>
      <Typography width={130} fontWeight={500}>{label}:</Typography>
      <Typography color="text.secondary">{value || '—'}</Typography>
    </Box>
  );

  useEffect(() => {
    const fetchAllRegIds = async () => {
      try {
        const res = await api.get('/chitregisters/open');
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

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).replace(/ /g, '-');
  };

  const handleCloseChit = async () => {
    if (!payMode || !refNo) {
      return alert("Please enter Pay Mode and Reference No.");
    }

    const confirmed = window.confirm("Are you sure you want to close this chit?");
    if (!confirmed) return;

    try {
      const closeDate = new Date();

      // Close chit API call
      const closeRes = await api.put(`/chitregisters/close/${selectedRegId}`, {
        totalAmount,
        totalGrams,
        payMode,
        refNo,
        closedOn: closeDate,
      });

      // Settle transactions API call
      await api.put(`/transactions/settle/${selectedRegId}`, {
        onDate: closeDate,
      });

      // Use updated chit details from API response or fallback
      const updatedChit = closeRes.data || chitDetails;

      const dataForPdf = {
        date: closeDate,
        regId: updatedChit.regId,
        name: updatedChit.name,
        number: updatedChit.nomineeNumber,
        city: updatedChit.nomineeCity,
        todayAmount: 'N/A',
        receivedAmount: totalAmount.toFixed(2),
        goldGram: totalGrams.toFixed(2),
        payMode,
        payId: updatedChit.payId || '—',
        openedOn: updatedChit.startedOn,
        closedOn: closeDate,
      };

      setSavedData(dataForPdf);
      setClosedPayId(updatedChit.payId || '—');
      setShowPayIdPopup(true);

    } catch (err) {
      console.error('Error closing chit:', err);
      alert("Failed to close chit.");
    }
  };

  const handlePrint = async (savedData) => {
    if (!savedData) return;

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [80, 150] });
    const pageWidth = 80;
    let y = 10;

    pdf.setFont('courier', 'normal');
    pdf.setFontSize(13).setFont(undefined, 'bold');
    pdf.text('PAYMENT RECEIPT', pageWidth / 2, y, { align: 'center' }); // changed header
    y += 8;

    pdf.setFontSize(7).setFont(undefined, 'normal');
    pdf.text(`Date: ${new Date(savedData.date).toLocaleDateString()}`, 4, y);
    pdf.text(`Pay ID: ${savedData.payId}`, pageWidth - 4, y, { align: 'right' }); // replaced EID with Pay ID
    y += 6;

    pdf.setFont(undefined, 'bold');
    pdf.text('Customer Info', 4, y);
    y += 5;
    pdf.setFont(undefined, 'normal');
    pdf.text(`Name: ${savedData.name}`, 4, y); y += 5;
    pdf.text(`Mobile: ${savedData.number}`, 4, y); y += 5;
    pdf.text(`City: ${savedData.city}`, 4, y); y += 8;

    pdf.setFont(undefined, 'bold');
    pdf.text('Transaction Summary', 4, y); y += 5;

    pdf.setFont(undefined, 'bold');
    pdf.text('Date         Gold   Amount', 4, y); y += 4;
    pdf.setFont(undefined, 'normal');

    transactions.forEach(tx => {
      const date = new Date(tx.date).toLocaleDateString('en-GB');
      const gold = tx.goldGram?.toFixed(2) || '0.00';
      const amount = tx.receivedAmount?.toFixed(2) || '0.00';
      pdf.text(`${date}   ${gold}   ${amount}`, 4, y);
      y += 4;
    });

    y += 2;
    pdf.setFont(undefined, 'bold');
    pdf.text(`Total:        ${savedData.goldGram}   ${savedData.receivedAmount}`, 4, y);
    y += 8;

    pdf.setFont(undefined, 'bold');
    pdf.text('Payment Info', 4, y); y += 5;
    pdf.setFont(undefined, 'normal');
    pdf.text(`Pay ID: ${savedData.payId}`, 4, y); y += 5;
    pdf.text(`Reg ID: ${savedData.regId}`, 4, y); y += 5;
    pdf.text(`Opened On: ${new Date(savedData.openedOn).toLocaleDateString()}`, 4, y); y += 5;
    pdf.text(`Closed On: ${new Date(savedData.closedOn).toLocaleDateString()}`, 4, y); y += 5;
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

    pdf.save(`PaymentReceipt_${savedData.payId}.pdf`);
  };

  const handlePrintClick = async () => {
    await handlePrint(savedData);
    setShowPayIdPopup(false);
    setSelectedRegId('');
    setPayMode('');
    setRefNo('');
  };

  // Popup component
  const PayIdPopup = ({ open, onClose, payId, onPrint }) => (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Chit Closed Successfully</DialogTitle>
      <DialogContent>
        <Typography>Your Pay ID: <strong>{payId}</strong></Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onPrint} variant="contained" color="primary">Print Receipt</Button>
        <Button onClick={onClose} color="inherit">Close</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ maxWidth: '95%', mx: 'auto', mt: 4 }}>
      <AppBar
        position="static"
        elevation={1}
        sx={{
          mb: 3,
          backgroundColor: '#FFD700',
          color: 'black',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Chit Closure-Form
          </Typography>

          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <FormControl size="small" sx={{ minWidth: 140 }}>
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
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Pay Mode</InputLabel>
                  <Select
                    value={payMode}
                    label="Pay Mode"
                    onChange={(e) => setPayMode(e.target.value)}
                  >
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Cheque">Cheque</MenuItem>
                    <MenuItem value="UPI">UPI</MenuItem>
                    <MenuItem value="Voucher">Voucher</MenuItem>
                  </Select>
                </FormControl>

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
        </Toolbar>
      </AppBar>

      {loading ? (
        <Box textAlign="center" mt={4}><CircularProgress /></Box>
      ) : (
        <>
          {chitDetails && (
            <Box mb={4}>
              <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
                gap={3}
                sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2, backgroundColor: '#fafafa' }}
              >
                {/* Left Box */}
                <Box flex={1} minWidth={300}>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1} color="text.secondary">
                    Chit Info
                  </Typography>
                  <DetailRow label="Name" value={chitDetails.name} />
                  <DetailRow label="Chit ID" value={chitDetails.chitId} />
                  <DetailRow label="Status" value={chitDetails.status} />
                  <DetailRow label="Started On" value={formatDate(chitDetails.startedOn)} />
                  {chitDetails.closedOn && (
                    <DetailRow label="Closed On" value={formatDate(chitDetails.closedOn)} />
                  )}
                  {chitDetails.maturityDate && (
                    <DetailRow label="Maturity Date" value={formatDate(chitDetails.maturityDate)} />
                  )}
                </Box>

                {/* Right Box */}
                <Box flex={1} minWidth={300}>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1} color="text.secondary">
                    Nominee Details
                  </Typography>
                  <DetailRow label="Name" value={chitDetails.nomineeName} />
                  <DetailRow label="Relation" value={chitDetails.relation} />
                  <DetailRow label="Contact" value={chitDetails.nomineeNumber} />
                  <DetailRow label="City" value={chitDetails.nomineeCity} />
                </Box>
              </Box>

              <Divider sx={{ mt: 3 }} />
            </Box>
          )}

          <Typography variant="h6" mt={4}>Transactions</Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>EID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount (₹)</TableCell>
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
                {transactions.length > 0 && (
                  <TableRow sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                    <TableCell colSpan={2}><strong>Total</strong></TableCell>
                    <TableCell><strong>{totalAmount.toFixed(2)}</strong></TableCell>
                    <TableCell><strong>{totalGrams.toFixed(2)}</strong></TableCell>
                    <TableCell colSpan={2}></TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      <PayIdPopup
        open={showPayIdPopup}
        onClose={() => setShowPayIdPopup(false)}
        payId={closedPayId}
        onPrint={handlePrintClick}
      />
    </Box>
  );
}

export default ChitRegisterList;
