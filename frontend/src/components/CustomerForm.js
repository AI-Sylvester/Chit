import { useState } from 'react';
import api from '../services/api';

function CustomerForm() {
  const [customer, setCustomer] = useState({
    cusId: '',
    name: '',
    grade: '',
    number: '',
    PID: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    mobile1: '',
    mobile2: '',
    username: '',
    password: '',
    active: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCustomer(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/customers', customer);
      alert('Customer added successfully');
      // Reset form if you want
      setCustomer({
        cusId: '',
        name: '',
        grade: '',
        number: '',
        PID: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        mobile1: '',
        mobile2: '',
        username: '',
        password: '',
        active: true
      });
    } catch (error) {
      console.error(error);
      alert('Failed to add customer');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: 'auto' }}>
      <h2>Add Customer</h2>

      <label>
        Customer ID:
        <input
          type="text"
          name="cusId"
          value={customer.cusId}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Name:
        <input
          type="text"
          name="name"
          value={customer.name}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Grade:
        <input
          type="text"
          name="grade"
          value={customer.grade}
          onChange={handleChange}
        />
      </label>

      <label>
        Number:
        <input
          type="text"
          name="number"
          value={customer.number}
          onChange={handleChange}
        />
      </label>

      <label>
        PID:
        <input
          type="text"
          name="PID"
          value={customer.PID}
          onChange={handleChange}
        />
      </label>

      <label>
        Address Line 1:
        <input
          type="text"
          name="addressLine1"
          value={customer.addressLine1}
          onChange={handleChange}
        />
      </label>

      <label>
        Address Line 2:
        <input
          type="text"
          name="addressLine2"
          value={customer.addressLine2}
          onChange={handleChange}
        />
      </label>

      <label>
        City:
        <input
          type="text"
          name="city"
          value={customer.city}
          onChange={handleChange}
        />
      </label>

      <label>
        State:
        <input
          type="text"
          name="state"
          value={customer.state}
          onChange={handleChange}
        />
      </label>

      <label>
        Mobile 1:
        <input
          type="tel"
          name="mobile1"
          value={customer.mobile1}
          onChange={handleChange}
        />
      </label>

      <label>
        Mobile 2:
        <input
          type="tel"
          name="mobile2"
          value={customer.mobile2}
          onChange={handleChange}
        />
      </label>

      <label>
        Username:
        <input
          type="text"
          name="username"
          value={customer.username}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Password:
        <input
          type="password"
          name="password"
          value={customer.password}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Active:
        <input
          type="checkbox"
          name="active"
          checked={customer.active}
          onChange={handleChange}
        />
      </label>

      <button type="submit" style={{ marginTop: 10 }}>
        Add Customer
      </button>
    </form>
  );
}

export default CustomerForm;
