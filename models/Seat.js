const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  day: {
    type: Number,
    required: true,
    min: 1,
  },
  seat: {
    type: Number,
    required: true,
    min: 1,
  },
  client: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model('Seat', seatSchema);
