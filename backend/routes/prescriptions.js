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

    // Save to database if connected
    let saved = null;
    try {
      const prescription = new Prescription({
        originalText: rawText,
        medicines,
        language: lang
      });
      saved = await prescription.save();
    } catch (dbErr) {
      console.warn('⚠️  Could not save to DB:', dbErr.message);
    }

    res.json({
      success: true,
      id: saved ? saved._id : null,
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
  try {
    const prescriptions = await Prescription.find().sort({ createdAt: -1 }).limit(50);
    res.json({ prescriptions });
  } catch (err) {
    next(err);
  }
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
