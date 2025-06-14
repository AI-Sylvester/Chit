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
exports.getNextCusId = async (req, res) => {
  try {
    const lastCustomer = await Customer.findOne().sort({ cusId: -1 }).select('cusId').lean();
    const prefix = 'CS';

    let nextCusId = 'CS00000001';
    if (lastCustomer && lastCustomer.cusId) {
      const lastNumber = parseInt(lastCustomer.cusId.slice(2), 10);
      const nextNumber = lastNumber + 1;
      nextCusId = prefix + nextNumber.toString().padStart(8, '0');
    }

    res.json({ nextCusId });
  } catch (error) {
    console.error('Error generating next customer ID:', error);
    res.status(500).json({ error: 'Failed to generate customer ID' });
  }
};
