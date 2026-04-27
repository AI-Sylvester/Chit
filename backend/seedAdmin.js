const mongoose = require('mongoose');
const Customer = require('./Models/Customer');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Check if admin already exists
    const adminExists = await Customer.findOne({ username: 'admin' });

    if (adminExists) {
      console.log('Admin already exists. Updating password to "1234" and role to "admin"...');
      adminExists.password = '1234';
      adminExists.role = 'admin';
      adminExists.active = true;
      // We must use 'save' so the pre-save hook hashes the password
      await adminExists.save();
      console.log('Admin updated successfully.');
    } else {
      console.log('Creating new admin user...');
      await Customer.create({
        cusId: 'ADMIN001',
        name: 'System Admin',
        username: 'admin',
        password: '1234',
        role: 'admin',
        active: true
      });
      console.log('Admin created successfully.');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
};

seedAdmin();
