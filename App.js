import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000';

function App() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', date: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await fetch(`${API_URL}/events`);
    const data = await res.json();
    setEvents(data);
  };

  const handleChange = e => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (editId) {
      // Update event
      await fetch(`${API_URL}/events/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setEditId(null);
    } else {
      // Create event
      await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setForm({ title: '', description: '', date: '' });
    fetchEvents();
  };

  const handleEdit = (event) => {
    setForm({ title: event.title, description: event.description, date: event.date.slice(0, 10) });
    setEditId(event._id);
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/events/${id}`, { method: 'DELETE' });
    fetchEvents();
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Event Scheduler</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input 
          name="title" 
          placeholder="Title" 
          value={form.title} 
          onChange={handleChange} 
          required 
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <textarea 
          name="description" 
          placeholder="Description" 
          value={form.description} 
          onChange={handleChange} 
          required 
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <input 
          type="date" 
          name="date" 
          value={form.date} 
          onChange={handleChange} 
          required 
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <button type="submit">{editId ? 'Update Event' : 'Add Event'}</button>
      </form>

      <h2>Upcoming Events</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {events.map(event => (
          <li key={event._id} style={{ marginBottom: 15, border: '1px solid #ccc', padding: 10 }}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <button onClick={() => handleEdit(event)} style={{ marginRight: 10 }}>Edit</button>
            <button onClick={() => handleDelete(event._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
