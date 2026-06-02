const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  company: { type: String, required: true, trim: true },
  checkedIn: { type: Boolean, default: false },
  checkInTime: { type: Date, default: null },
});

const registrationSchema = new mongoose.Schema(
  {
    primaryGuest: { type: guestSchema, required: true },
    additionalGuests: { type: [guestSchema], default: [] },
    registrationCode: { type: String, unique: true },
  },
  { timestamps: true }
);

// Auto-generate a short registration code before saving
registrationSchema.pre('save', function (next) {
  if (!this.registrationCode) {
    this.registrationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

// Virtual: total guest count including primary
registrationSchema.virtual('totalGuests').get(function () {
  return 1 + this.additionalGuests.length;
});

// Text index for search
registrationSchema.index({
  'primaryGuest.name': 'text',
  'primaryGuest.email': 'text',
  'primaryGuest.company': 'text',
  'additionalGuests.name': 'text',
  'additionalGuests.email': 'text',
});

module.exports = mongoose.model('Registration', registrationSchema);
