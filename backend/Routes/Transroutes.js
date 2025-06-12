const express = require('express');
const { createTransaction, getTransactionsByChitId } = require('../Controllers/TrasnController');
const router = express.Router();

router.post('/', createTransaction);
router.get('/:chitId', getTransactionsByChitId);

module.exports = router;