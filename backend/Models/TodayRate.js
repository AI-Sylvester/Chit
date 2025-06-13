const mongoose = require('mongoose');

const todayRateSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  todayRate: { type: Number, required: true },
});

// Fix to avoid OverwriteModelError:
module.exports = mongoose.models.TodayRate || mongoose.model('TodayRate', todayRateSchema);
