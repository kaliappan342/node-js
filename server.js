const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/event-scheduler', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Event Schema
const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', eventSchema);

// Routes
app.get('/events', async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  res.json(events);
});

app.post('/events', async (req, res) => {
  const { title, description, date } = req.body;
  const event = new Event({ title, description, date });
  await event.save();
  res.status(201).json(event);
});

app.put('/events/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, date } = req.body;
  const updatedEvent = await Event.findByIdAndUpdate(id, { title, description, date }, { new: true });
  res.json(updatedEvent);
});

app.delete('/events/:id', async (req, res) => {
  const { id } = req.params;
  await Event.findByIdAndDelete(id);
  res.json({ message: 'Event deleted' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
