import React, { useState } from 'react';
import {
  AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem,
  ListItemText, ListItemIcon, Box, CssBaseline, Button, Stack, Divider, 
  Tooltip, ListSubheader, useMediaQuery, Avatar, Menu, MenuItem, Fade, Paper
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Receipt as ReceiptIcon,
  ListAlt as ListAltIcon,
  Assignment as AssignmentIcon,
  Today as TodayIcon,
  HowToReg as HowToRegIcon,
  Logout as LogoutIcon,
  PlaylistAddCheck as PlaylistAddCheckIcon,
  Description as DescriptionIcon,
  ExitToApp as ExitToAppIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme, alpha } from '@mui/material/styles';

const drawerWidth = 260;

function Layout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.name || user.username || 'Admin';

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  
  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const groupedMenu = {
    Master: [
      { label: 'Customer Master', path: '/customer', icon: <PersonIcon /> },
      { label: 'Chit ID Master', path: '/chitids', icon: <AssignmentIcon /> },
      { label: 'Today Rate Master', path: '/todayrate', icon: <TodayIcon /> },
    ],
    Operations: [
      { label: 'Chit Registration', path: '/chitregister', icon: <HowToRegIcon /> },
      { label: 'Transaction Entry', path: '/transaction', icon: <ReceiptIcon /> },
      { label: 'Chit Closure', path: '/chitregisterlist', icon: <ExitToAppIcon /> },
    ],
    Analysis: [
      { label: 'Installments', path: '/chittable', icon: <ListAltIcon /> },
      { label: 'Register Report', path: '/chitview', icon: <PlaylistAddCheckIcon /> },
      { label: 'Transaction History', path: '/transview', icon: <DescriptionIcon /> },
    ],
  };

  const isActive = (path) => location.pathname === path;

  const NavItem = ({ label, path, icon }) => (
    <Tooltip title={!drawerOpen ? label : ''} placement="right" arrow>
      <ListItem 
        button 
        onClick={() => navigate(path)}
        sx={{
          mx: 1.5,
          my: 0.5,
          width: 'calc(100% - 24px)',
          borderRadius: 2,
          backgroundColor: isActive(path) ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
          color: isActive(path) ? theme.palette.primary.main : theme.palette.text.secondary,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            color: theme.palette.primary.main,
            '& .MuiListItemIcon-root': {
              color: theme.palette.primary.main,
            }
          },
        }}
      >
        <ListItemIcon sx={{ 
          minWidth: 40, 
          color: isActive(path) ? theme.palette.primary.main : theme.palette.text.secondary,
          transition: 'color 0.2s'
        }}>
          {icon}
        </ListItemIcon>
        {drawerOpen && (
          <ListItemText 
            primary={label} 
            primaryTypographyProps={{ 
              fontSize: '0.875rem', 
              fontWeight: isActive(path) ? 600 : 500 
            }} 
          />
        )}
      </ListItem>
    </Tooltip>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      
      {/* AppBar */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
          width: { md: `calc(100% - ${drawerOpen ? drawerWidth : 80}px)` },
          ml: { md: `${drawerOpen ? drawerWidth : 80}px` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
              {location.pathname === '/home' ? 'Dashboard' : 'Management Console'}
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, color: 'text.secondary', fontWeight: 500 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </Typography>
            <Box 
              onClick={handleProfileMenuOpen}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                cursor: 'pointer',
                p: 0.5,
                pr: 1.5,
                borderRadius: 10,
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) }
              }}
            >
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  bgcolor: theme.palette.primary.main,
                  fontSize: '0.875rem',
                  fontWeight: 700
                }}
              >
                {userName.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="subtitle2" sx={{ lineHeight: 1 }}>{userName}</Typography>
                <Typography variant="caption" color="text.secondary">Administrator</Typography>
              </Box>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: drawerOpen ? drawerWidth : 80,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerOpen ? drawerWidth : 80,
            boxSizing: 'border-box',
            borderRight: `1px solid ${theme.palette.divider}`,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            bgcolor: 'background.paper',
          },
        }}
      >
        <Box sx={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          px: 3,
          gap: 2,
          color: theme.palette.primary.main
        }}>
          <HowToRegIcon sx={{ fontSize: 32 }} />
          {drawerOpen && (
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
              CHIT<span style={{ color: theme.palette.text.primary }}>SYS</span>
            </Typography>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        <List sx={{ px: 0 }}>
          <NavItem label="Home Dashboard" path="/home" icon={<HomeIcon />} />
        </List>

        {Object.entries(groupedMenu).map(([section, items]) => (
          <Box key={section} sx={{ mt: 2 }}>
            {drawerOpen && (
              <ListSubheader 
                sx={{ 
                  bgcolor: 'transparent', 
                  lineHeight: '24px', 
                  fontSize: '0.7rem', 
                  fontWeight: 700, 
                  textTransform: 'uppercase', 
                  color: 'text.secondary',
                  letterSpacing: '1px',
                  mb: 1,
                  px: 3
                }}
              >
                {section}
              </ListSubheader>
            )}
            <List sx={{ px: 0 }}>
              {items.map((item) => (
                <NavItem key={item.label} {...item} />
              ))}
            </List>
          </Box>
        ))}

        <Box sx={{ mt: 'auto', mb: 2, px: 2 }}>
          {drawerOpen && (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 3,
                textAlign: 'center'
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Need Assistance?
              </Typography>
              <Button variant="outlined" size="small" fullWidth>
                Support
              </Button>
            </Paper>
          )}
          <ListItem 
            button 
            onClick={handleLogout}
            sx={{
              mt: 2,
              mx: 1.5,
              width: 'calc(100% - 24px)',
              borderRadius: 2,
              color: 'error.main',
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.05),
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <LogoutIcon />
            </ListItemIcon>
            {drawerOpen && <ListItemText primary="Sign Out" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }} />}
          </ListItem>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3 }, 
          width: { md: `calc(100% - ${drawerOpen ? drawerWidth : 80}px)` },
          mt: 8,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {children}
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 3,
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: `1px solid ${theme.palette.divider}`
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2">{userName}</Typography>
          <Typography variant="caption" color="text.secondary">{user.username || 'admin'}</Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleProfileMenuClose}>Profile Settings</MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>Security</MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default Layout;
