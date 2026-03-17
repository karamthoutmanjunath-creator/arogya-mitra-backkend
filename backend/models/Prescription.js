const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  dosage:     { type: String, default: '' },
  frequency:  { type: String, default: '' },
  mealTiming: { type: String, default: '' },
  duration:   { type: String, default: '' }
});

const prescriptionSchema = new mongoose.Schema({
  originalText: { type: String, required: true },
  medicines:    [medicineSchema],
  language:     { type: String, default: 'en' },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
