const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const customerSchema = new mongoose.Schema({
  cusId: { type: String, unique: true, required: true },
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
  password: { type: String, required: true },
  active: { type: Boolean, default: true }
});

// Hash password before saving
customerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare password
customerSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('Customer', customerSchema);