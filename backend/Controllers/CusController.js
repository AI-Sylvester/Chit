const jwt = require('jsonwebtoken');
const Customer = require('../Models/Customer');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d'
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.getCustomerById = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findOne({ cusId: req.params.cusId });
  if (!customer) {
    return next(new AppError('No customer found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { customer }
  });
});

exports.createCustomer = asyncHandler(async (req, res, next) => {
  const newCustomer = await Customer.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { customer: newCustomer }
  });
});

exports.getAllCustomers = asyncHandler(async (req, res, next) => {
  const customers = await Customer.find();
  res.status(200).json({
    status: 'success',
    results: customers.length,
    data: { customers }
  });
});

exports.getNextCusId = asyncHandler(async (req, res, next) => {
  const lastCustomer = await Customer.findOne().sort({ cusId: -1 }).select('cusId').lean();
  const prefix = 'CS';

  let nextCusId = 'CS00000001';
  if (lastCustomer && lastCustomer.cusId) {
    const lastNumber = parseInt(lastCustomer.cusId.slice(2), 10);
    const nextNumber = lastNumber + 1;
    nextCusId = prefix + nextNumber.toString().padStart(8, '0');
  }

  res.status(200).json({
    status: 'success',
    nextCusId
  });
});

exports.loginCustomer = asyncHandler(async (req, res, next) => {
  const { cusId, password } = req.body;
  const identifier = cusId || req.body.username;
  if (!identifier || !password) {
    return next(new AppError('Please provide login ID and password!', 400));
  }

  // 2) Check if user exists && password is correct
  // Search by either cusId or username
  const customer = await Customer.findOne({ 
    $or: [{ cusId: identifier }, { username: identifier }] 
  }).select('+password');

  if (!customer || !(await customer.correctPassword(password, customer.password))) {
    return next(new AppError('Incorrect credentials', 401));
  }

  // 3) Check if user is active
  if (!customer.active) {
    return next(new AppError('This account is inactive', 403));
  }

  // 4) If everything ok, send token to client
  createSendToken(customer, 200, res);
});

exports.getCusCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findOne({ cusId: req.params.cusId }).select(
    'cusId name grade number PID addressLine1 addressLine2 city state mobile1 mobile2 active'
  );

  if (!customer) {
    return next(new AppError('No customer found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { customer }
  });
});
