const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
console.log('🔄 Connecting to MongoDB Atlas...');
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('✅ MongoDB Atlas Connected Successfully');
  console.log('📊 Database:', mongoose.connection.name);
})
.catch((err) => {
  console.error('❌ MongoDB Connection Error:', err.message);
  console.error('🔍 Check your connection string in .env file');
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth server is running',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Auth Server running on http://localhost:${PORT}`);
});
