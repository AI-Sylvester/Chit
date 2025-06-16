const express = require('express');
const router = express.Router();

// ✅ Import all controller functions, including getNextEID
const transactionController = require('../Controllers/TrasnController');

// ✅ Destructure if you want, or just use transactionController.method
const {
  createTransaction,
  getTransactionsByChitId,
  getNextEID,getTransactionsByRegId,settleTransactionsByRegId,getAllTransactions,checkTransactionExists
} = transactionController;

// Routes
router.post('/', createTransaction);
router.get('/next-eid', getNextEID); // ✅ Must come before :chitId route
router.get('/:chitId', getTransactionsByChitId);
router.get('/by-regid/:regId', getTransactionsByRegId);
router.put('/settle/:regId', settleTransactionsByRegId);
router.get('/', getAllTransactions);
router.get('/check-exists', checkTransactionExists);
module.exports = router;
