import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress,
  FormControl, InputLabel, Select, MenuItem,
  AppBar, Toolbar, Divider, Paper,
} from '@mui/material';
import api from '../services/api';

function ChitRegisterTable() {
  const [regIds, setRegIds] = useState([]);
  const [selectedRegId, setSelectedRegId] = useState('');
  const [chitDetails, setChitDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const res = await api.get(`/chitregisters`);
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
  api.get(`/chitregisters/all-status/${selectedRegId}`),  // updated endpoint here
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
            Chit Installments
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
  <DetailRow label="Scheme" value={chitDetails.schemeName} />
<DetailRow label="Period" value={`${chitDetails.period} months`} />
<DetailRow label="Installment" value={`₹${chitDetails.installAmount?.toFixed(2)}`} />
  {chitDetails.maturityDate && (
    <DetailRow label="Maturity Date" value={formatDate(chitDetails.maturityDate)} />
  )}
  {chitDetails.closedOn && (
    <>
      <DetailRow label="Closed On" value={formatDate(chitDetails.closedOn)} />
      <DetailRow label="Pay ID" value={chitDetails.payId} />
      <DetailRow label="Pay Mode" value={chitDetails.payMode} />
    </>
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
{/* Installments */}
<Box mt={3}>
  <Typography variant="subtitle2" fontWeight="bold" mb={1} color="text.secondary">
    Installments
  </Typography>

  <TableContainer component={Paper} variant="outlined" sx={{ width: '100%', overflowX: 'auto' }}>
    <Table size="small" sx={{ minWidth: 950 }}>
      <TableHead>
        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
          <TableCell><strong>Month</strong></TableCell>
          <TableCell><strong>Value</strong></TableCell>
          <TableCell><strong>EID</strong></TableCell>
          <TableCell><strong>Paid On</strong></TableCell>
          <TableCell align="right"><strong>Amount (₹)</strong></TableCell>
          <TableCell><strong>Pay Mode</strong></TableCell>
          <TableCell align="right"><strong>Gold Gram</strong></TableCell>
          <TableCell><strong>Status</strong></TableCell>
        </TableRow>
      </TableHead>

  <TableBody>
  {chitDetails &&
    [...Array(12)].map((_, i) => {
      const monthKey = `month${i + 1}`;
      const paidForValue = chitDetails[monthKey];
      if (!paidForValue) return null;

      const tx = transactions.find(t => t.paidFor === paidForValue && t.regId === selectedRegId);

      const eid = tx?.EID || '—';
      const paidOn = tx?.date ? new Date(tx.date).toLocaleDateString('en-GB') : '—';
      const amount = tx?.receivedAmount?.toFixed(2) || '—';
      const payMode = tx?.payMode || '—';
      const goldGram = tx?.goldGram?.toFixed(2) || '—';
      const status = tx?.status || '—';

      return (
        <TableRow
          key={monthKey}
          sx={{ '&:hover': { backgroundColor: '#fafafa' } }}
        >
          <TableCell>{`Month ${i + 1}`}</TableCell>
          <TableCell>{paidForValue}</TableCell>
          <TableCell>{eid}</TableCell>
          <TableCell>{paidOn}</TableCell>
          <TableCell align="right">{amount}</TableCell>
          <TableCell>{payMode}</TableCell>
          <TableCell align="right">{goldGram}</TableCell>
          <TableCell>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color:
                  status === 'Received'
                    ? 'green'
                    : status === 'Settled'
                    ? 'blue'
                    : 'text.secondary',
              }}
            >
              {status}
            </Typography>
          </TableCell>
        </TableRow>
      );
    })}

  {/* Totals Row */}
  <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
    <TableCell colSpan={4}><strong>Total</strong></TableCell>
    <TableCell align="right"><strong>{totalAmount.toFixed(2)}</strong></TableCell>
    <TableCell />
    <TableCell align="right"><strong>{totalGrams.toFixed(2)}</strong></TableCell>
    <TableCell />
  </TableRow>
</TableBody>

    </Table>
  </TableContainer>
</Box>
    
          
        </>
      )}
    </Box>
  );
}

export default ChitRegisterTable;
