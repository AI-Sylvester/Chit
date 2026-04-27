import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  Container,
  Stack,
  Tabs,
  Tab
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Diamond as DiamondIcon,
  AdminPanelSettings as AdminIcon,
  Group as CustomerIcon
} from '@mui/icons-material';
import api from '../services/api';
import { useTheme, alpha } from '@mui/material/styles';

function LoginPage() {
  const [loginType, setLoginType] = useState(0); // 0 for Admin, 1 for Customer
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const payload = loginType === 0 
        ? { username: identifier, password } 
        : { cusId: identifier, password };

      const response = await api.post('/customers/login', payload);
      const { token, data } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: `radial-gradient(circle at 20% 30%, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 40%), 
                     radial-gradient(circle at 80% 70%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 40%),
                     #f8fafc`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 4, sm: 6 }, 
            borderRadius: 6, 
            textAlign: 'center',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)',
            border: '1px solid',
            borderColor: 'divider',
            background: alpha('#ffffff', 0.8),
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box 
            sx={{ 
              width: 64, 
              height: 64, 
              bgcolor: theme.palette.primary.main, 
              color: 'white',
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: '0 8px 16px rgba(245, 158, 11, 0.3)'
            }}
          >
            <DiamondIcon sx={{ fontSize: 32 }} />
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-1px' }}>
            CHITSYS Portal
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Please select your account type to continue
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
            <Tabs 
              value={loginType} 
              onChange={(e, val) => {
                setLoginType(val);
                setIdentifier('');
                setPassword('');
                setError('');
              }} 
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': { py: 2, fontWeight: 700, fontSize: '0.9rem' },
                '& .Mui-selected': { color: theme.palette.primary.main }
              }}
            >
              <Tab icon={<AdminIcon />} iconPosition="start" label="Admin Login" />
              <Tab icon={<CustomerIcon />} iconPosition="start" label="Customer Login" />
            </Tabs>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={3}>
            <TextField
              fullWidth
              label={loginType === 0 ? "Admin Username" : "Customer ID"}
              placeholder={loginType === 0 ? "e.g., admin" : "e.g., CS00000001"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onKeyDown={handleKeyDown}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleLogin}
              disabled={isLoading || !identifier || !password}
              sx={{ 
                py: 1.8, 
                fontSize: '1rem',
                boxShadow: '0 10px 20px -5px rgba(245, 158, 11, 0.4)'
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Log In Now'}
            </Button>
          </Stack>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Need technical support?
            </Typography>
            <Typography variant="body2" color="primary" sx={{ fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
              Contact Us
            </Typography>
          </Box>
        </Paper>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 4, display: 'block', textAlign: 'center' }}>
          &copy; {new Date().getFullYear()} CHITSYS Management. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default LoginPage;
