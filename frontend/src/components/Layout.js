import React, { useState } from 'react';
import {
  AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem,
  ListItemText, ListItemIcon, Box, CssBaseline, Button, Stack, Divider, ListSubheader, useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TodayIcon from '@mui/icons-material/Today';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

function Layout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const handleNavigate = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const groupedMenu = {
    Master: [
      { label: 'Customer Master', path: '/customer', icon: <PersonIcon /> },
      { label: 'Chit ID Master', path: '/chitids', icon: <AssignmentIcon /> },
      { label: 'Today Rate Master', path: '/todayrate', icon: <TodayIcon /> },
    ],
    Transaction: [
      { label: 'Transaction', path: '/transaction', icon: <ReceiptIcon /> },
      { label: 'Chit Register', path: '/chitregister', icon: <FolderOpenIcon /> },
      { label: 'Chit Close', path: '/chitregisterlist', icon: <LockIcon /> },
    ],
    Reports: [
             { label: 'Chit Installments', path: '/chittable', icon: <ListAltIcon /> }, 
             { label: 'Chit Register Report', path: '/chitview', icon: <ListAltIcon /> },
      { label: 'Transaction Report', path: '/transview', icon: <ListAltIcon /> },
    ],
  };

  const glossyButtonStyle = (gradientColor) => ({
    background: gradientColor,
    color: '#fff',
    fontWeight: 'bold',
    borderRadius: 3,
    px: 3,
    py: 1.5,
    boxShadow: '0 3px 6px rgba(0,0,0,0.3)',
    textTransform: 'none',
    transition: '0.3s',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
      transform: 'scale(1.03)',
    },
  });

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar position="fixed" sx={{ backgroundColor: '#FFD700', color: 'black' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Box display="flex" alignItems="center">
            <IconButton color="inherit" onClick={toggleDrawer} edge="start" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 'bold',
                fontSize: '1.5rem',
                letterSpacing: '0.5px',
                color: 'black',
              }}
            >
              Chit Management App
            </Typography>
          </Box>

          {/* Glossy Action Buttons */}
          {!isMobile && (
            <Stack direction="row" spacing={1}>
              <Button
                sx={glossyButtonStyle('linear-gradient(to right, #1976d2, #42a5f5)')}
                onClick={() => navigate('/transaction')}
              >
                Transaction
              </Button>
              <Button
                sx={glossyButtonStyle('linear-gradient(to right, #d32f2f, #f44336)')}
                onClick={() => navigate('/chitview')}
              >
                Chit Register
              </Button>
              <Button
                sx={glossyButtonStyle('linear-gradient(to right, #616161, #9e9e9e)')}
                onClick={() => navigate('/todayrate')}
              >
                Today Rate
              </Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      {/* Side Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer}>
          <List>
            <ListItem button onClick={() => handleNavigate('/home')}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
          </List>
          <Divider />

          {Object.entries(groupedMenu).map(([section, items]) => (
            <List
              key={section}
              subheader={
                <ListSubheader component="div" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                  {section}
                </ListSubheader>
              }
            >
              {items.map(item => (
                <ListItem button key={item.label} onClick={() => handleNavigate(item.path)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
              <Divider />
            </List>
          ))}
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
