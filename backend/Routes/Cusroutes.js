const express = require('express');
const {
  createCustomer,
  getCustomerById,
  getAllCustomers,
  getNextCusId,
  loginCustomer,
  getCusCustomer
} = require('../Controllers/CusController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', loginCustomer);

// Public routes (if any, maybe nextCusId should be protected too?)
router.get('/nextCusId', getNextCusId);

// Protected routes
router.use(protect);

router.post('/', createCustomer);
router.get('/', getAllCustomers);
router.get('/:cusId', getCusCustomer); // Using the one with selected fields for security

module.exports = router;
