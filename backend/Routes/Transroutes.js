const express = require('express');
const router = express.Router();
const transactionController = require('../Controllers/TrasnController');
const { protect } = require('../middleware/authMiddleware');

const {
  createTransaction,
  getTransactionsByChitId,
  getNextEID,
  getTransactionsByRegId,
  settleTransactionsByRegId,
  getAllTransactions,
  checkTransactionExists,
  getTransactionsByCusId
} = transactionController;

router.use(protect);

router.post('/', createTransaction);
router.get('/next-eid', getNextEID);
router.get('/:chitId', getTransactionsByChitId);
router.get('/by-regid/:regId', getTransactionsByRegId);
router.put('/settle/:regId', settleTransactionsByRegId);
router.get('/', getAllTransactions);
router.get('/check-exists', checkTransactionExists);
router.get('/by-cusid/:cusId', getTransactionsByCusId);

module.exports = router;
