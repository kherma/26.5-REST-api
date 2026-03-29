const mongoose = require('mongoose');

const concertSchema = new mongoose.Schema({
  performer: {
    type: String,
    required: true,
    trim: true,
  },
  genre: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  day: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model('Concert', concertSchema);
