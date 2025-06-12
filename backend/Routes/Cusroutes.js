const express = require('express');
const { createCustomer, getCustomerById } = require('../Controllers/CusController');
const router = express.Router();

router.post('/', createCustomer);
router.get('/:cusId', getCustomerById);

module.exports = router;