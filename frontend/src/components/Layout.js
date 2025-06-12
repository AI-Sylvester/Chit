// src/components/Layout.js
import React, { useState } from 'react';
import {
  AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText,
  Box, CssBaseline
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { label: 'Home', path: '/home' },
  { label: 'Customer Form', path: '/customer' },
  { label: 'Transaction Form', path: '/transaction' },
  { label: 'Chit Close Form', path: '/chitclose' },
  { label: 'Chit ID Form', path: '/chitids' },
];

function Layout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar position="fixed">
        <Toolbar>
          <IconButton color="inherit" onClick={toggleDrawer} edge="start">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            Chit Management App
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Side Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <List>
          {menuItems.map((item) => (
            <ListItem button key={item.label} onClick={() => handleNavigate(item.path)}>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main content below AppBar */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
