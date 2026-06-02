const express = require('express');
const Registration = require('../models/Registration');
const router = express.Router();

const validateGuest = (guest, label) => {
  const errors = [];
  if (!guest.name?.trim()) errors.push(`${label}: name is required`);
  if (!guest.phone?.trim()) errors.push(`${label}: phone is required`);
  if (!guest.email?.trim() || !/^\S+@\S+\.\S+$/.test(guest.email))
    errors.push(`${label}: valid email is required`);
  if (!guest.company?.trim()) errors.push(`${label}: company is required`);
  return errors;
};

// POST /api/register
router.post('/', async (req, res) => {
  try {
    const { primaryGuest, additionalGuests = [] } = req.body;

    // Validate primary guest
    const errors = validateGuest(primaryGuest || {}, 'Primary guest');

    // Validate additional guests
    additionalGuests.forEach((g, i) => {
      errors.push(...validateGuest(g, `Guest ${i + 1}`));
    });

    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    // Check duplicate email
    const email = primaryGuest.email.toLowerCase().trim();
    const existing = await Registration.findOne({ 'primaryGuest.email': email });
    if (existing)
      return res.status(409).json({ message: 'This email is already registered for the event' });

    const registration = new Registration({
      primaryGuest,
      additionalGuests,
    });

    await registration.save();

    res.status(201).json({
      message: 'Registration successful!',
      registrationCode: registration.registrationCode,
      id: registration._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
