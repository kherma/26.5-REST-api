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
    const id = Number(req.params.id);
    const testimonial = await Testimonial.findOne({ id });

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
};

const updateTestimonial = async (req, res) => {
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
};

const deleteTestimonial = async (req, res) => {
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
};

module.exports = {
  getAllTestimonials,
  getRandomTestimonial,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
