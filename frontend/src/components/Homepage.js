import React, { useState } from 'react';
import { Tabs, Tab, Box, Paper, Typography } from '@mui/material';
import TransactionTable from './TransactionView';
import ChitIdForm from './ChitIdForm';
import CustomerTable from './CustomerTable';
import ChitRecord  from './ChitRecord';
function Homepage() {
  const [activeTab, setActiveTab] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'custable':
        return <CustomerTable />;
      case 'chitrecord':
        return <ChitRecord />;
      case 'transview':
        return <TransactionTable />;
      case 'chitids':
        return <ChitIdForm />;
      default:
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="body1">Please select the tabs above.</Typography>
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
          <Tab label="Customer List" value="custable" />
          <Tab label="Chit Register List" value="chitrecord" />
          <Tab label="Transaction List" value="transview" />
          <Tab label="Chit ID " value="chitids" />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 4 }}>
        {renderActiveComponent()}
      </Box>
    </Box>
  );
}

export default Homepage;
