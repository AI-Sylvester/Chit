const express = require('express');
const {
  createCustomer,
  getCustomerById,
  getAllCustomers   // ✅ Make sure this is imported
} = require('../Controllers/CusController'); // ✅ points to the correct file

const router = express.Router();

router.post('/', createCustomer);
router.get('/:cusId', getCustomerById);
router.get('/', getAllCustomers); // ✅ This must be a function

module.exports = router;