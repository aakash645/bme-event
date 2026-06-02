const express = require('express');
const { Parser } = require('json2csv');
const Registration = require('../models/Registration');
const auth = require('../middleware/auth');
const router = express.Router();

// All admin routes are protected
router.use(auth);

// GET /api/admin/registrations
router.get('/registrations', async (req, res) => {
  try {
    const { search = '', status = 'all', page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query = {};

    if (search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { 'primaryGuest.name': regex },
        { 'primaryGuest.email': regex },
        { 'primaryGuest.company': regex },
        { 'primaryGuest.phone': regex },
      ];
    }

    if (status === 'checkedIn') query['primaryGuest.checkedIn'] = true;
    if (status === 'pending') query['primaryGuest.checkedIn'] = false;

    const [registrations, total] = await Promise.all([
      Registration.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Registration.countDocuments(query),
    ]);

    // Stats
    const stats = await Registration.aggregate([
      {
        $group: {
          _id: null,
          totalRegistrations: { $sum: 1 },
          totalGuests: { $sum: { $add: [1, { $size: '$additionalGuests' }] } },
          checkedIn: { $sum: { $cond: ['$primaryGuest.checkedIn', 1, 0] } },
        },
      },
    ]);

    res.json({
      registrations,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      stats: stats[0] || { totalRegistrations: 0, totalGuests: 0, checkedIn: 0 },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/export — download all check-in data as CSV
router.get('/export', async (req, res) => {
  try {
    const { type = 'all' } = req.query;
    let query = {};
    if (type === 'checkedIn') query['primaryGuest.checkedIn'] = true;

    const registrations = await Registration.find(query).sort({ createdAt: -1 });

    const rows = [];
    registrations.forEach((r) => {
      const base = {
        'Registration Code': r.registrationCode,
        Type: 'Primary',
        Name: r.primaryGuest.name,
        Email: r.primaryGuest.email,
        Phone: r.primaryGuest.phone,
        Company: r.primaryGuest.company,
        'Checked In': r.primaryGuest.checkedIn ? 'Yes' : 'No',
        'Check-in Time': r.primaryGuest.checkInTime
          ? new Date(r.primaryGuest.checkInTime).toLocaleString('en-IN')
          : '',
        'Registered At': new Date(r.createdAt).toLocaleString('en-IN'),
      };
      rows.push(base);
      r.additionalGuests.forEach((g, i) => {
        rows.push({
          'Registration Code': r.registrationCode,
          Type: `Guest ${i + 1}`,
          Name: g.name,
          Email: g.email,
          Phone: g.phone,
          Company: g.company,
          'Checked In': g.checkedIn ? 'Yes' : 'No',
          'Check-in Time': g.checkInTime
            ? new Date(g.checkInTime).toLocaleString('en-IN')
            : '',
          'Registered At': new Date(r.createdAt).toLocaleString('en-IN'),
        });
      });
    });

    const parser = new Parser();
    const csv = parser.parse(rows);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="event-registrations-${Date.now()}.csv"`
    );
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Export failed' });
  }
});

// DELETE /api/admin/registrations/:id
router.delete('/registrations/:id', async (req, res) => {
  try {
    await Registration.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
