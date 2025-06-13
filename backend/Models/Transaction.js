const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  regId:String,
  EID: String,
  cusId: String,
  name: String,
  number: String,
  city: String,
  PID: String,
  ChitID: String,
  date: Date,
  todayAmount: Number,
  receivedAmount: Number,
  goldGram: Number,
  payMode: String,
  status: String
});

module.exports = mongoose.model('Transaction', transactionSchema);