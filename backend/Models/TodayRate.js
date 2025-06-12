const mongoose = require('mongoose');

const todayRateSchema = new mongoose.Schema({
  date: Date,
  todayRate: Number
});

module.exports = mongoose.model('TodayRate', todayRateSchema);