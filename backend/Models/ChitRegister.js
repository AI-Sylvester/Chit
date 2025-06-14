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
  
    maturityDate: Date, 
  closedOn: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Open', 'Closed'],
    default: 'Open',
  },payId: {
  type: String,
  unique: true,
  sparse: true, // Allows null values if not yet closed
},  payMode: { type: String },
  refNo: { type: String },
  nomineeName: String,
  relation: String,
  nomineeNumber: String,
  nomineeCity: String,
}, {
  timestamps: true,
}
);

module.exports = mongoose.model('ChitRegister', chitRegisterSchema);
