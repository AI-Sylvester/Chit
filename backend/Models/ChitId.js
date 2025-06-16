const mongoose = require('mongoose');

const chitIdSchema = new mongoose.Schema({
  chitId: { type: String, required: true },
  schemeName: { type: String, required: true },
  period: { type: Number, enum: [6, 12], required: true }
});

module.exports = mongoose.model('ChitId', chitIdSchema);