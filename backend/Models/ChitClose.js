const mongoose = require('mongoose');

const chitCloseSchema = new mongoose.Schema({
  date: Date,
  cusId: String,
  name: String,
  ChitID: String,
  PID: String,
  number: String,
  city: String,
  totalAmount: Number,
  receivedAmount: Number,
  goldGained: Number,
  goldRedeemed: Number,
  balGold: Number,
  voucher: String,
  balAmt: Number
});

module.exports = mongoose.model('ChitClose', chitCloseSchema);