import React, { useState } from 'react';
import {
  AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem,
  ListItemText, ListItemIcon, Box, CssBaseline, Button, Stack, Divider,Tooltip, ListSubheader, useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TodayIcon from '@mui/icons-material/Today';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useTheme  } from '@mui/material/styles';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import DescriptionIcon from '@mui/icons-material/Description';

const drawerWidth = 240;
const appBarHeight = 64;

function Layout({ children }) {
const [drawerOpen, setDrawerOpen] = useState(false); // default closed
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);


  const groupedMenu = {
    Master: [
      { label: 'Customer Master', path: '/customer', icon: <PersonIcon /> },
      { label: 'Chit ID Master', path: '/chitids', icon: <AssignmentIcon /> },
      { label: 'Today Rate Master', path: '/todayrate', icon: <TodayIcon /> },
    ],
    Transaction: [
   { label: 'Chit Registrtaion', path: '/chitregister', icon: <HowToRegIcon /> },
      { label: 'Transaction', path: '/transaction', icon: <ReceiptIcon /> },
        { label: 'Chit Close', path: '/chitregisterlist', icon: <LogoutIcon /> },
    ],
    Reports: [
             { label: 'Chit Installments', path: '/chittable', icon: <ListAltIcon /> }, 
             { label: 'Chit Register Report', path: '/chitview', icon: <PlaylistAddCheckIcon /> },
      { label: 'Transaction Report', path: '/transview', icon: <DescriptionIcon /> },
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
              Chit Management 
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


<Drawer
  variant="permanent"
  open={drawerOpen}
  sx={{
    width: drawerOpen ? drawerWidth : 60,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    '& .MuiDrawer-paper': {
      width: drawerOpen ? drawerWidth : 60,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      overflowX: 'hidden',
      backgroundColor: '#000',
      color: '#fff',
      top: `${appBarHeight}px`,
      height: `calc(100% - ${appBarHeight}px)`,
    },
  }}
>
   <Box sx={{ textAlign: 'center', py: 1 }}>
    {drawerOpen && (
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 'bold',
          fontSize: '1rem',
          color: '#f5f5f5',
        }}
      >
        Chit Management
      </Typography>
    )}
  </Box>

  <Divider />

  <List>
    <Tooltip title={!drawerOpen ? 'Home' : ''} placement="right" arrow>
      <ListItem button onClick={() => navigate('/home')}>
        <ListItemIcon sx={{ color: '#fff' }}>
          <HomeIcon />
        </ListItemIcon>
        {drawerOpen && (
          <ListItemText
            primary="Home"
            sx={{ '& .MuiTypography-root': { fontSize: '0.875rem' } }}
          />
        )}
      </ListItem>
    </Tooltip>
  </List>

  <Divider />

  {Object.entries(groupedMenu).map(([section, items]) => (
    <List
      key={section}
      subheader={
        drawerOpen && (
          <ListSubheader component="div" sx={{ background: '#1a1a1a', color: '#aaa' }}>
            {section}
          </ListSubheader>
        )
      }
    >
      {items.map(({ label, path, icon }) => (
        <Tooltip title={!drawerOpen ? label : ''} placement="right" arrow key={label}>
          <ListItem button onClick={() => navigate(path)}>
            <ListItemIcon sx={{ color: '#fff' }}>{icon}</ListItemIcon>
            {drawerOpen && (
              <ListItemText
                primary={label}
                sx={{ '& .MuiTypography-root': { fontSize: '0.875rem' } }}
              />
            )}
          </ListItem>
        </Tooltip>
      ))}
    </List>
  ))}
</Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
