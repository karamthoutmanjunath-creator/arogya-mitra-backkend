const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️  MONGODB_URI not set — running without database.');
    console.warn('   Endpoints that need the DB will return errors.');
    console.warn('   Set MONGODB_URI in .env to enable full functionality.');
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.warn('   Server will continue without database.');
  }
}

module.exports = connectDB;
