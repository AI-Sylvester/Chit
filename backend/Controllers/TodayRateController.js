const TodayRate = require('../models/TodayRate');

// Get all rates (optionally latest only)
exports.getTodayRates = async (req, res) => {
  try {
    const rates = await TodayRate.find().sort({ date: -1 }); // sorted newest first
    res.json(rates);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching rates' });
  }
};

// Create a new today rate entry
exports.createTodayRate = async (req, res) => {
  try {
    const { date, todayRate } = req.body;
    if (!date || !todayRate) {
      return res.status(400).json({ message: 'Date and todayRate are required' });
    }

    const newRate = new TodayRate({ date, todayRate });
    await newRate.save();
    res.status(201).json(newRate);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating today rate' });
  }
};
exports.getTodayRateForDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const start = new Date(new Date(date).setHours(0, 0, 0, 0));
    const end = new Date(new Date(date).setHours(23, 59, 59, 999));

    const rate = await TodayRate.findOne({ date: { $gte: start, $lte: end } });

    if (!rate) {
      return res.status(404).json({ message: 'No rate found for this date' });
    }

    res.json(rate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching rate' });
  }
};