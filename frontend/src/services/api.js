import axios from 'axios';

const api = axios.create({
  baseURL:
    'http://localhost:5000/api' || 'https://my-ecom-hdyc.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;