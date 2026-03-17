const router = require('express').Router();
const upload = require('../middleware/upload');
const { extractText, parseMedicines } = require('../services/ocrService');
const Prescription = require('../models/Prescription');

// POST /api/prescriptions/scan — Upload image → OCR → parsed medicines
router.post('/scan', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided. Send as form-data with key "image".' });
    }

    const lang = req.body.language || 'eng'; // 'eng', 'hin', 'tel'
    console.log(`📷 Scanning prescription (lang: ${lang}, size: ${(req.file.size / 1024).toFixed(1)} KB)...`);

    // Run OCR
    const rawText = await extractText(req.file.buffer, lang);

    if (!rawText) {
      return res.status(422).json({ error: 'Could not extract any text from the image. Try a clearer photo.' });
    }

    // Parse medicine info from the OCR text
    const medicines = parseMedicines(rawText);

    // We are bypassing MongoDB entirely, so we won't save it.
    // Just return the OCR text and parsed structured data back to the frontend.
    res.json({
      success: true,
      id: Date.now().toString(), // Mock ID
      originalText: rawText,
      medicines,
      language: lang
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/prescriptions — List all prescriptions
router.get('/', async (_req, res, next) => {
  res.json({ prescriptions: [] });
});

// GET /api/prescriptions/:id — Get one prescription
router.get('/:id', async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    res.json({ prescription });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/prescriptions/:id — Delete a prescription
router.delete('/:id', async (req, res, next) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    res.json({ success: true, message: 'Prescription deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
