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
  status: String,
   paidFor: String, // 👈 Add this
  
});
 transactionSchema.index({ regId: 1, paidFor: 1 }, { unique: true });
module.exports = mongoose.model('Transaction', transactionSchema);