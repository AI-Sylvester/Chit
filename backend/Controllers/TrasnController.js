const Transaction = require('../Models/Transaction');
const TodayRate = require('../Models/TodayRate');

// Helper to format date as YYYYMMDD
function formatDate(date) {
  return date.toISOString().split('T')[0].replace(/-/g, '');
}

exports.createTransaction = async (req, res) => {
  try {
    const today = new Date();
    const todayStr = formatDate(today); // e.g., "20250616"
    const prefix = "SS";

    // 🔍 Get last transaction to compute sequence
    const lastTransaction = await Transaction.findOne({
      EID: { $regex: `^${prefix}${todayStr}` }
    }).sort({ EID: -1 });

    let seqNumber = 1;
    if (lastTransaction?.EID) {
      const lastSeqStr = lastTransaction.EID.slice(-5);
      seqNumber = parseInt(lastSeqStr, 10) + 1;
    }

    const newEID = `${prefix}${todayStr}${String(seqNumber).padStart(5, '0')}`;

    // 🟡 Get today's rate (use only date part to compare)
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const todayRateDoc = await TodayRate.findOne({ date: { $gte: startOfDay, $lte: endOfDay } });

    const todayAmount = todayRateDoc?.todayRate || 0;

    // 📦 Create and save transaction
    const newTransaction = new Transaction({
      ...req.body,
      EID: newEID,
      todayAmount,
      status: 'Received',
    });

    await newTransaction.save();

    return res.status(201).json(newTransaction);

  } catch (error) {
    // ❗ Handle duplicate key (regId + paidFor)
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'A transaction already exists for this Registration ID and month.',
      });
    }

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
exports.checkTransactionExists = async (req, res) => {
  try {
    const { regId, paidFor } = req.query;

    if (!regId || !paidFor) {
      return res.status(400).json({ message: 'regId and paidFor are required' });
    }

    const existing = await Transaction.findOne({ regId, paidFor });

    if (existing) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (err) {
    console.error('Error checking transaction existence:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getTransactionsByCusId = async (req, res) => {
  try {
    const { cusId } = req.params;
    const transactions = await Transaction.find({ cusId });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions by cusId:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};