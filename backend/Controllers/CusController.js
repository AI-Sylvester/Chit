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
    const customers = await Customer.find(); // fetch all fields
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
exports.loginCustomer = async (req, res) => {
  const { cusId, password } = req.body;

  try {
    const customer = await Customer.findOne({ cusId, password });

    if (!customer) {
      return res.status(401).json({ error: 'Invalid customer ID or password' });
    }

    if (!customer.active) {
      return res.status(403).json({ error: 'Account is inactive' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        cusId: customer.cusId,
        name: customer.name,
        username: customer.username,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getCusCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({ cusId: req.params.cusId }).select(
      'cusId name grade number PID addressLine1 addressLine2 city state mobile1 mobile2 active'
    );

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer details' });
  }
};
