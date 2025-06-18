const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const todayRateRoutes = require('./Routes/todayRateRoutes');
const customerRoutes = require('./Routes/Cusroutes');
const transactionRoutes = require('./Routes/Transroutes');
const chitCloseRoutes = require('./Routes/Chitcloseroutes');
const chitIdRoutes = require('./Routes/chitidroute');
const chitRegisterRoutes = require('./Routes/ChitRegisterRoutes');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI )
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));


app.use('/api/customers', customerRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/chitclose', chitCloseRoutes);
app.use('/api/chitids', chitIdRoutes);
app.use('/api/todayrates', todayRateRoutes);
app.use('/api/chitregisters', chitRegisterRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));