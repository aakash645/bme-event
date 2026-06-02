const express = require('express');
const Registration = require('../models/Registration');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

// GET /api/checkin/search?q=
router.get('/search', async (req, res) => {
  try {
    const { q = '' } = req.query;
    if (!q.trim()) return res.json([]);

    const regex = new RegExp(q.trim(), 'i');
    const results = await Registration.find({
      $or: [
        { 'primaryGuest.name': regex },
        { 'primaryGuest.email': regex },
        { 'primaryGuest.phone': regex },
        { registrationCode: regex.source.toUpperCase() },
      ],
    }).limit(10);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Search failed' });
  }
});

// PATCH /api/checkin/:registrationId/primary — check in primary guest
router.patch('/:registrationId/primary', async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.registrationId);
    if (!reg) return res.status(404).json({ message: 'Registration not found' });

    if (reg.primaryGuest.checkedIn)
      return res.status(400).json({ message: 'Already checked in' });

    reg.primaryGuest.checkedIn = true;
    reg.primaryGuest.checkInTime = new Date();
    await reg.save();

    res.json({ message: 'Checked in successfully', registration: reg });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/checkin/:registrationId/guest/:guestIndex — check in additional guest
router.patch('/:registrationId/guest/:guestIndex', async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.registrationId);
    if (!reg) return res.status(404).json({ message: 'Registration not found' });

    const idx = Number(req.params.guestIndex);
    if (idx < 0 || idx >= reg.additionalGuests.length)
      return res.status(404).json({ message: 'Guest not found' });

    if (reg.additionalGuests[idx].checkedIn)
      return res.status(400).json({ message: 'Guest already checked in' });

    reg.additionalGuests[idx].checkedIn = true;
    reg.additionalGuests[idx].checkInTime = new Date();
    await reg.save();

    res.json({ message: 'Guest checked in successfully', registration: reg });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
