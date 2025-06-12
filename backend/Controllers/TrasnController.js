const Transaction = require('../Models/Transaction');
const TodayRate = require('../Models/TodayRate');

exports.createTransaction = async (req, res) => {
  const todayRate = await TodayRate.findOne({ date: new Date() });
  const todayAmount = todayRate ? todayRate.todayRate : 0;
  const newTransaction = new Transaction({
    ...req.body,
    todayAmount,
    status: 'Open'
  });
  await newTransaction.save();
  res.status(201).json(newTransaction);
};

exports.getTransactionsByChitId = async (req, res) => {
  const transactions = await Transaction.find({ ChitID: req.params.chitId });
  res.json(transactions);
};