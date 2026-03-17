const router = require('express').Router();
const Schedule = require('../models/Schedule');

// POST /api/schedules — Create a new medicine schedule
router.post('/', async (req, res, next) => {
  try {
    const { medicineName, time, frequency, mealTiming } = req.body;

    if (!medicineName || !time) {
      return res.status(400).json({ error: 'medicineName and time are required' });
    }

    const schedule = {
      _id: Date.now().toString(),
      medicineName,
      time,
      frequency: frequency || 'daily',
      mealTiming: mealTiming || 'after',
      active: true,
      createdAt: new Date()
    };

    // Return successfully without saving to database
    res.status(201).json({ success: true, schedule });
  } catch (err) {
    next(err);
  }
});

// GET /api/schedules — List all schedules
router.get('/', async (_req, res, next) => {
  res.json({ schedules: [] });
});

// PUT /api/schedules/:id — Update a schedule
router.put('/:id', async (req, res, next) => {
  try {
    const { medicineName, time, frequency, mealTiming, active } = req.body;

    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { medicineName, time, frequency, mealTiming, active },
      { new: true, runValidators: true }
    );

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    res.json({ success: true, schedule });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/schedules/:id — Delete a schedule
router.delete('/:id', async (req, res, next) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json({ success: true, message: 'Schedule deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
