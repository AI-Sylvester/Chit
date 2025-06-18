import axios from 'axios';

// Axios instance for local backend
export const localAPI = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Axios instance for deployed backend
export const renderAPI = axios.create({
  baseURL: 'https://my-ecom-hdyc.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
});

export default api;