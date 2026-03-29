const express = require('express');
const Testimonial = require('../models/Testimonial');

const router = express.Router();

router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/testimonials/random', async (req, res) => {
  try {
    const documentsCount = await Testimonial.countDocuments();
    if (documentsCount <= 0)
      return res.status(404).json({ message: 'No testimonials to display' });

    const randomDocumentNumber = Math.floor(Math.random() * documentsCount);
    const randomTestimonial =
      await Testimonial.findOne().skip(randomDocumentNumber);
    res.json(randomTestimonial);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/testimonials/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const testimonial = await Testimonial.findOne({ id: Number(id) });
    if (!testimonial)
      return res.status(404).json({ message: 'Testimonial not found' });
    res.json(testimonial);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/testimonials', async (req, res) => {
  try {
    const { author, text } = req.body;
    if (!author || !text)
      return res.status(400).json({ message: 'author and text required' });

    const lastTestimonial = await Testimonial.findOne()
      .sort({ id: -1 })
      .select('id -_id');

    const newId = lastTestimonial ? lastTestimonial.id + 1 : 1;
    const newTestimonial = new Testimonial({ id: newId, author, text });
    await newTestimonial.save();
    return res.json({ message: 'OK' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/testimonials/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { author, text } = req.body;

    if (!author || !text) {
      return res.status(400).json({ message: 'author and text required' });
    }

    const testimonial = await Testimonial.findOne({ id });

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    await Testimonial.findByIdAndUpdate(testimonial._id, { author, text });

    return res.json({ message: 'OK' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/testimonials/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deletedTestimonial = await Testimonial.findOneAndDelete({ id });

    if (!deletedTestimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    return res.json({ message: 'OK' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
