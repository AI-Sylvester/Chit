const express = require('express');
const {
  createCustomer,
  getCustomerById,
  getAllCustomers,
  getNextCusId
} = require('../Controllers/CusController');

const router = express.Router();

router.post('/', createCustomer);
router.get('/nextCusId', getNextCusId);   // ✅ Fixed position before dynamic route
router.get('/', getAllCustomers);
router.get('/:cusId', getCustomerById);   // ✅ Placed after specific routes

module.exports = router;
