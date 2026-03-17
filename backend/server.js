require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Connect to MongoDB ──────────────────────────────────────────────
connectDB();

// ── Middleware ───────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────────────────────
app.use('/api/health',        require('./routes/health'));
app.use('/api/prescriptions', require('./routes/prescriptions'));
app.use('/api/schedules',     require('./routes/schedules'));

// ── Root ────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    name: 'Arogya Mitra API',
    version: '1.0.0',
    docs: {
      health:        'GET  /api/health',
      symptoms:      'GET  /api/symptoms',
      scanRx:        'POST /api/prescriptions/scan',
      prescriptions: 'GET  /api/prescriptions',
      schedules:     'GET  /api/schedules'
    }
  });
});

// ── Error handler ───────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🩺 Arogya Mitra API running on port ${PORT}`);
});
