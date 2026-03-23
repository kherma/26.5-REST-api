const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
