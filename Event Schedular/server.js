// 1. Install necessary package: npm install express cors
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware setup
app.use(cors());
app.use(express.json());

// Simple in-memory storage for events
let events = [
    { id: 1, title: 'Team Meeting', date: '2025-11-15', time: '10:00' },
    { id: 2, title: 'Project Demo', date: '2025-11-20', time: '14:30' }
];
let nextId = 3;

// --- REST API Endpoints ---

// GET /api/events - Retrieve all events
app.get('/api/events', (req, res) => {
    console.log('GET /api/events called');
    res.json(events);
});

// POST /api/events - Create a new event
app.post('/api/events', (req, res) => {
    const newEvent = {
        id: nextId++,
        title: req.body.title,
        date: req.body.date,
        time: req.body.time || null // Allow time to be optional
    };

    if (!newEvent.title || !newEvent.date) {
        return res.status(400).json({ message: 'Title and Date are required.' });
    }

    events.push(newEvent);
    console.log('POST /api/events called. New event:', newEvent);
    res.status(201).json(newEvent);
});

// DELETE /api/events/:id - Delete an event
app.delete('/api/events/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = events.length;
    
    events = events.filter(event => event.id !== id);

    if (events.length < initialLength) {
        console.log(`DELETE /api/events/${id} called. Event deleted.`);
        res.status(204).send(); // 204 No Content for successful deletion
    } else {
        console.log(`DELETE /api/events/${id} called. Event not found.`);
        res.status(404).json({ message: 'Event not found.' });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('The API is ready for requests.');
});