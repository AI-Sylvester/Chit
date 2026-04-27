import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Paper, Typography, Card, CardContent, 
  Stack, Button
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  People as PeopleIcon,
  AccountBalance as BankIcon,
  TrendingUp as TrendingUpIcon,
  EventNote as EventIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Homepage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    customers: 0,
    chits: 0,
    todayRate: 0,
    collections: 0
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.name || user.username || 'Admin';

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const [cusRes, chitRes, rateRes] = await Promise.all([
          api.get('/customers'),
          api.get('/chitregisters'),
          api.get('/todayrates/by-date', { params: { date: new Date().toISOString().split('T')[0] } })
        ]);

        setStats({
          customers: cusRes.data.results || 0,
          chits: chitRes.data.length || 0,
          todayRate: rateRes.data.todayRate || 0,
          collections: 0 // Placeholder for real collection logic
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color, trend }) => (
    <Card elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 3, 
            bgcolor: alpha(color, 0.1), 
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
          {trend && (
            <Box sx={{ 
              px: 1, 
              py: 0.5, 
              borderRadius: 10, 
              bgcolor: alpha(theme.palette.success.main, 0.1), 
              color: 'success.main',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              {trend}
            </Box>
          )}
        </Stack>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>{value}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{title}</Typography>
      </CardContent>
    </Card>
  );

  const QuickAction = ({ title, description, icon, path, color }) => (
    <Paper 
      elevation={0}
      onClick={() => navigate(path)}
      sx={{ 
        p: 3, 
        borderRadius: 4, 
        border: '1px solid', 
        borderColor: 'divider',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          borderColor: color,
          transform: 'translateY(-4px)',
          boxShadow: `0 10px 20px ${alpha(color, 0.1)}`
        }
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: alpha(color, 0.1), color: color }}>
          {icon}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>{title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{description}</Typography>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: color, fontWeight: 600, fontSize: '0.875rem' }}>
            <span>Launch Action</span>
            <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-1.5px' }}>
          Hello, {userName.split(' ')[0]} 👋
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
          Welcome to your management dashboard. Here's what's happening today.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Customers" 
            value={stats.customers} 
            icon={<PeopleIcon />} 
            color={theme.palette.primary.main}
            trend="+12%" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Active Chits" 
            value={stats.chits} 
            icon={<BankIcon />} 
            color={theme.palette.info.main}
            trend="+5" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Gold Rate (Today)" 
            value={`₹${stats.todayRate}`} 
            icon={<TrendingUpIcon />} 
            color={theme.palette.warning.main} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Today's Collections" 
            value="₹45,200" 
            icon={<EventIcon />} 
            color={theme.palette.success.main}
            trend="New" 
          />
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Quick Actions</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <QuickAction 
            title="New Transaction" 
            description="Record a gold chit installment payment from a customer."
            icon={<AddIcon />}
            path="/transaction"
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <QuickAction 
            title="Register Customer" 
            description="Add a new member to the system and assign categories."
            icon={<PeopleIcon />}
            path="/customer"
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <QuickAction 
            title="Update Gold Rate" 
            description="Set the daily gold gram rate for transactions."
            icon={<TrendingUpIcon />}
            path="/todayrate"
            color={theme.palette.warning.main}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 8 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 6, 
            bgcolor: 'secondary.main', 
            color: 'white',
            backgroundImage: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>System Insights</Typography>
            <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 600, mb: 4 }}>
              Check out the comprehensive reports to track the financial health of your chit funds and customer performance over time.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => navigate('/transview')}
              endIcon={<ArrowForwardIcon />}
              sx={{ borderRadius: 10, px: 4 }}
            >
              View Reports
            </Button>
          </Box>
          {/* Decorative element */}
          <Box sx={{ 
            position: 'absolute', 
            right: -20, 
            bottom: -20, 
            width: 200, 
            height: 200, 
            borderRadius: '50%', 
            bgcolor: alpha('#fff', 0.05),
            zIndex: 0
          }} />
        </Paper>
      </Box>
    </Box>
  );
}

export default Homepage;
