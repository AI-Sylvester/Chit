const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./middleware/errorMiddleware');

const todayRateRoutes = require('./Routes/todayRateRoutes');
const customerRoutes = require('./Routes/Cusroutes');
const transactionRoutes = require('./Routes/Transroutes');
const chitCloseRoutes = require('./Routes/Chitcloseroutes');
const chitIdRoutes = require('./Routes/chitidroute');
const chitRegisterRoutes = require('./Routes/ChitRegisterRoutes');

dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000', 'https://sschit.netlify.app', 'https://sschitcustomerportal.netlify.app'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.use('/api/customers', customerRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/chitclose', chitCloseRoutes);
app.use('/api/chitids', chitIdRoutes);
app.use('/api/todayrates', todayRateRoutes);
app.use('/api/chitregisters', chitRegisterRoutes);

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));