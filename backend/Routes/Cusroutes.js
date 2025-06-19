const express = require('express');
const {
  createCustomer,
  getCustomerById,
  getAllCustomers,
  getNextCusId,loginCustomer,getCusCustomer
} = require('../Controllers/CusController');

const router = express.Router();
router.post('/login', loginCustomer);
router.post('/', createCustomer);
router.get('/nextCusId', getNextCusId);   // ✅ Fixed position before dynamic route
router.get('/', getAllCustomers);
router.get('/:cusId', getCustomerById);   // ✅ Placed after specific routes
router.get('/:cusId', getCusCustomer);
module.exports = router;
