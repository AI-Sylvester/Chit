import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ChitIdForm() {
  const [chitId, setChitId] = useState('');
  const [chitList, setChitList] = useState([]);

  const fetchChits = async () => {
    try {
      const res = await api.get('/chitids');
      setChitList(res.data);
    } catch (err) {
      console.error('Failed to fetch Chit IDs', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/chitids', { chitId });
      setChitId('');
      fetchChits();
    } catch (err) {
      console.error('Failed to add Chit ID', err);
    }
  };

  useEffect(() => {
    fetchChits();
  }, []);

  return (
    <div>
      <h2>Add Chit ID</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={chitId}
          onChange={(e) => setChitId(e.target.value)}
          placeholder="Enter Chit ID"
          required
        />
        <button type="submit">Add</button>
      </form>

      <h3>Existing Chit IDs</h3>
      <ul>
        {chitList.map((chit) => (
          <li key={chit._id}>{chit.chitId}</li>
        ))}
      </ul>
    </div>
  );
}

export default ChitIdForm;