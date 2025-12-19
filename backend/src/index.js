// Import required packages
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

// Create Express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const taskRoutes = require('./routes/taskRoutes');
const goalRoutes = require('./routes/goalRoutes');

// Use routes
app.use('/api/tasks', taskRoutes);
app.use('/api/goals', goalRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to TaskFlow Pro API!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});