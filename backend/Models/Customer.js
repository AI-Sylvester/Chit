const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  cusId: String,
  name: String,
  grade: String,
  number: String,
  PID: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  mobile1: String,
  mobile2: String,
  username: String,
  password: String,
  active: Boolean
});

module.exports = mongoose.model('Customer', customerSchema);