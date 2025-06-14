const Transaction = require('../Models/Transaction');
const TodayRate = require('../Models/TodayRate');

// Helper to format date as YYYYMMDD
function formatDate(date) {
  return date.toISOString().split('T')[0].replace(/-/g, '');
}

exports.createTransaction = async (req, res) => {
  try {
    const today = new Date();
    const todayStr = formatDate(today); // e.g. "20250613"
    const prefix = "SS";

    // Find last transaction for today to get last sequence number
    const lastTransaction = await Transaction.findOne({
      EID: { $regex: `^${prefix}${todayStr}` }
    }).sort({ EID: -1 }).exec();

    let seqNumber = 1;
    if (lastTransaction) {
      const lastEID = lastTransaction.EID; // e.g. "ss2025061300001"
      const lastSeqStr = lastEID.slice(-5); // last 5 digits as string
      seqNumber = parseInt(lastSeqStr, 10) + 1;
    }
    const newSeqStr = seqNumber.toString().padStart(5, '0'); // "00001", "00002", etc.
    const newEID = `${prefix}${todayStr}${newSeqStr}`;

    // Fetch today rate (fallback to 0)
    const todayRateDoc = await TodayRate.findOne({ date: today });
    const todayAmount = todayRateDoc ? todayRateDoc.todayRate : 0;

    // Create new transaction with generated EID and todayAmount, and default status 'Received'
    const newTransaction = new Transaction({
      ...req.body,
      EID: newEID,
      todayAmount,
      status: 'Received',
    });

    await newTransaction.save();

    return res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getTransactionsByChitId = async (req, res) => {
  try {
    const transactions = await Transaction.find({ ChitID: req.params.chitId });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


function formatDate(date) {
  return date.toISOString().split('T')[0].replace(/-/g, '');
}

exports.getNextEID = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'Date is required' });

    const dateObj = new Date(date);
    const dateStr = formatDate(dateObj); // "DDMMYYYY"
    const prefix = "SS";

    const last = await Transaction.findOne({
      EID: { $regex: `^${prefix}${dateStr}` },
    }).sort({ EID: -1 });

    let nextSeq = 1;
    if (last) {
      const lastSeq = parseInt(last.EID.slice(-5), 10);
      nextSeq = lastSeq + 1;
    }

    const nextEID = `${prefix}${dateStr}${nextSeq.toString().padStart(5, '0')}`;
    res.json({ nextEID });
  } catch (err) {
    console.error('Error getting next EID:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getTransactionsByRegId = async (req, res) => {
  try {
    const { regId } = req.params;
    const transactions = await Transaction.find({ regId });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions by regId:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.settleTransactionsByRegId = async (req, res) => {
  const { regId } = req.params;
  const { onDate } = req.body;

  try {
    const result = await Transaction.updateMany(
      { regId },
      {
        $set: {
          status: 'Settled',
          date: new Date(onDate)
        }
      }
    );

    res.json({ message: 'Transactions updated successfully', modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error('Error updating transactions:', err);
    res.status(500).json({ message: 'Failed to update transactions', error: err.message });
  }
};
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({});
    res.json(transactions);
  } catch (err) {
    console.error('Error fetching all transactions:', err);
    res.status(500).json({ message: 'Server error' });
  }
};