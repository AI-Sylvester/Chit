const Transaction = require('../models/Transaction');
const ChitClose = require('../models/ChitClose');

exports.closeChit = async (req, res) => {
  const { cusId, chitId } = req.body;
  const transactions = await Transaction.find({ cusId, ChitID: chitId, status: 'Open' });
  const totalAmount = transactions.reduce((acc, txn) => acc + txn.todayAmount, 0);
  const receivedAmount = transactions.reduce((acc, txn) => acc + txn.receivedAmount, 0);
  const goldGained = transactions.reduce((acc, txn) => acc + txn.goldGram, 0);

  const chitClose = new ChitClose({
    ...req.body,
    totalAmount,
    receivedAmount,
    goldGained,
    goldRedeemed: 0,
    balGold: goldGained,
    voucher: '',
    balAmt: totalAmount - receivedAmount
  });

  await chitClose.save();
  await Transaction.updateMany({ cusId, ChitID: chitId, status: 'Open' }, { status: 'Closed' });
  res.status(201).json(chitClose);
};