require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Models
const Heart = mongoose.model('Heart', {
  image: String,
  createdAt: { type: Date, default: Date.now }
});

const Gratitude = mongoose.model('Gratitude', {
  text: String,
  createdAt: { type: Date, default: Date.now }
});

// Routes
// Get all hearts
app.get('/api/hearts', async (req, res) => {
  try {
    const hearts = await Heart.find().sort({ createdAt: -1 }).limit(50);
    res.json(hearts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching hearts' });
  }
});

// Add a new heart
app.post('/api/hearts', async (req, res) => {
  try {
    const heart = new Heart({ image: req.body.image });
    await heart.save();
    res.status(201).json(heart);
  } catch (error) {
    res.status(500).json({ error: 'Error saving heart' });
  }
});

// Get all gratitude entries
app.get('/api/gratitude', async (req, res) => {
  try {
    const entries = await Gratitude.find().sort({ createdAt: -1 }).limit(50);
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching gratitude entries' });
  }
});

// Add a new gratitude entry
app.post('/api/gratitude', async (req, res) => {
  try {
    const entry = new Gratitude({ text: req.body.text });
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Error saving gratitude entry' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Serve the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
}); 