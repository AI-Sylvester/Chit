const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const customerRoutes = require('./routes/cusroutes');
const transactionRoutes = require('./routes/Transroutes');
const chitCloseRoutes = require('./routes/Chitcloseroutes');

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));