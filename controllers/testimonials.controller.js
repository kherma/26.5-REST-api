const mongoose = require('mongoose');
const Testimonial = require('../models/Testimonial');

const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    return res.json(testimonials);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getRandomTestimonial = async (req, res) => {
  try {
    const documentsCount = await Testimonial.countDocuments();

    if (documentsCount <= 0) {
      return res.status(404).json({ message: 'No testimonials to display' });
    }

    const randomDocumentNumber = Math.floor(Math.random() * documentsCount);
    const randomTestimonial = await Testimonial.findOne().skip(randomDocumentNumber);

    return res.json(randomTestimonial);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getTestimonialById = async (req, res) => {
  try {
    const { _id } = req.params;

    if (!mongoose.isValidObjectId(_id)) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    const testimonial = await Testimonial.findById(_id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    return res.json(testimonial);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createTestimonial = async (req, res) => {
  try {
    const { author, text } = req.body;

    if (!author || !text) {
      return res.status(400).json({ message: 'author and text required' });
    }

    const newTestimonial = new Testimonial({ author, text });

    await newTestimonial.save();

    return res.json({ message: 'OK' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const { _id } = req.params;
    const { author, text } = req.body;

    if (!mongoose.isValidObjectId(_id)) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    if (!author || !text) {
      return res.status(400).json({ message: 'author and text required' });
    }

    const testimonial = await Testimonial.findById(_id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    await Testimonial.findByIdAndUpdate(_id, { author, text });

    return res.json({ message: 'OK' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const { _id } = req.params;

    if (!mongoose.isValidObjectId(_id)) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    const deletedTestimonial = await Testimonial.findByIdAndDelete(_id);

    if (!deletedTestimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    return res.json({ message: 'OK' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllTestimonials,
  getRandomTestimonial,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
