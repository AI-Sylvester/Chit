const Customer = require('../Models/Customer');

exports.createCustomer = async (req, res) => {
  const newCustomer = new Customer(req.body);
  await newCustomer.save();
  res.status(201).json(newCustomer);
};

exports.getCustomerById = async (req, res) => {
  const customer = await Customer.findOne({ cusId: req.params.cusId });
  res.json(customer);
};