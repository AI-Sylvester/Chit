const Customer = require('../Models/Customer');

exports.getCustomerById = async (req, res) => {
  const customer = await Customer.findOne({ cusId: req.params.cusId });
  res.json(customer);
};

exports.createCustomer = async (req, res) => {
  const newCustomer = new Customer(req.body);
  await newCustomer.save();
  res.status(201).json(newCustomer);
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({}, 'cusId'); // Only return cusId
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};