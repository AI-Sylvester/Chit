const mongoose = require('mongoose');

const chitIdSchema = new mongoose.Schema({
  chitId: String
});

module.exports = mongoose.model('ChitId', chitIdSchema);
