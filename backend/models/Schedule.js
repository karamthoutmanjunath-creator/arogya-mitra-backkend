const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  medicineName: { type: String, required: true },
  time:         { type: String, required: true },   // e.g. "08:00"
  frequency:    { type: String, default: 'daily' }, // daily, twice, thrice, weekly
  mealTiming:   { type: String, default: 'after' }, // before, after, with, empty
  active:       { type: Boolean, default: true },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Schedule', scheduleSchema);
