// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/event-registration', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(bodyParser.json());

// Define models
const Event = mongoose.model('Event', new mongoose.Schema({
    title: String,
    description: String,
    date: Date,
    location: String
}));

const Registration = mongoose.model('Registration', new mongoose.Schema({
    userName: String,
    eventId: mongoose.Schema.Types.ObjectId,
    registrationDate: { type: Date, default: Date.now }
}));

// Routes

// Register for an event
app.post('/register', async (req, res) => {
    const { userName, eventId } = req.body;
    if (!userName || !eventId) {
        return res.status(400).json({ error: 'User name and event ID are required' });
    }

    try {
        const registration = new Registration({ userName, eventId });
        await registration.save();
        res.status(201).json(registration);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// View event details
app.get('/events/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// List all events
app.get('/events', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Manage registrations
app.get('/registrations', async (req, res) => {
    try {
        const registrations = await Registration.find().populate('eventId');
        res.json(registrations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// List registrations for a specific event
app.get('/events/:id/registrations', async (req, res) => {
    try {
        const registrations = await Registration.find({ eventId: req.params.id });
        res.json(registrations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create an event
app.post('/events', async (req, res) => {
    const { title, description, date, location } = req.body;
    if (!title || !description || !date || !location) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const event = new Event({ title, description, date, location });
        await event.save();
        res.status(201).json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
