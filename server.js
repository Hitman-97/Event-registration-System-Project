// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/event_registration', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define schemas and models
const eventSchema = new mongoose.Schema({
    name: String,
    date: Date,
    location: String,
    description: String
});

const registrationSchema = new mongoose.Schema({
    eventId: mongoose.Schema.Types.ObjectId,
    userName: String,
    userEmail: String
});

const Event = mongoose.model('Event', eventSchema);
const Registration = mongoose.model('Registration', registrationSchema);

// Route to create a new event
app.post('/events', async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to view event details
app.get('/events/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to register for an event
app.post('/registrations', async (req, res) => {
    try {
        const registration = new Registration(req.body);
        await registration.save();
        res.status(201).json(registration);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to view all registrations for an event
app.get('/events/:id/registrations', async (req, res) => {
    try {
        const registrations = await Registration.find({ eventId: req.params.id });
        res.json(registrations);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to view all registrations by a user
app.get('/registrations/user/:email', async (req, res) => {
    try {
        const registrations = await Registration.find({ userEmail: req.params.email });
        res.json(registrations);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
