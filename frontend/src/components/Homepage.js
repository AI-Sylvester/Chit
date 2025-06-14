import React, { useState } from 'react';
import { Tabs, Tab, Box, Paper, Typography } from '@mui/material';
import CustomerForm from './CustomerForm';
import TransactionForm from './TransactionForm';
import TransactionTable from './TransactionView';
import ChitIdForm from './ChitIdForm';

function Homepage() {
  const [activeTab, setActiveTab] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'customer':
        return <CustomerForm />;
      case 'transaction':
        return <TransactionForm />;
      case 'transview':
        return <TransactionTable />;
      case 'chitids':
        return <ChitIdForm />;
      default:
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="body1">Please select a form from the tabs above.</Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom color="primary">
        Welcome to Chit Management
      </Typography>

      <Paper elevation={2} sx={{ borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
          aria-label="form navigation"
          sx={{ px: 2 }}
        >
          <Tab label="Customer Form" value="customer" />
          <Tab label="Transaction Form" value="transaction" />
          <Tab label="Transaction View" value="transview" />
          <Tab label="Chit ID Form" value="chitids" />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 4 }}>
        {renderActiveComponent()}
      </Box>
    </Box>
  );
}

export default Homepage;
