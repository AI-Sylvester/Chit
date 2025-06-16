const mongoose = require('mongoose');

const chitRegisterSchema = new mongoose.Schema({
  regId: {
    type: String,
    required: true,
    unique: true,
  },
  cusId: {
    type: String,
    required: true,
  },
  name: String,
  city: String,
  number: String,
  PID: String,
  chitId: {
    type: String,
    required: true,
  },
  startedOn: {
    type: Date,
    required: true,
  },
  schemeName: { type: String, required: true },
  period: { type: Number, required: true },

  installAmount: { type: Number, required: true }, // ✅ Added

  maturityDate: Date, 
  closedOn: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Open', 'Closed'],
    default: 'Open',
  },
  payId: {
    type: String,
    unique: true,
    sparse: true,
  },
  payMode: { type: String },
  refNo: { type: String },
  nomineeName: String,
  relation: String,
  nomineeNumber: String,
  nomineeCity: String,

  // Monthly fields
  month1: { type: String },
  month2: { type: String },
  month3: { type: String },
  month4: { type: String },
  month5: { type: String },
  month6: { type: String },
  month7: { type: String },
  month8: { type: String },
  month9: { type: String },
  month10: { type: String },
  month11: { type: String },
  month12: { type: String },

}, {
  timestamps: true,
});

module.exports = mongoose.model('ChitRegister', chitRegisterSchema);
