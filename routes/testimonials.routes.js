const express = require('express');
const {
  getAllTestimonials,
  getRandomTestimonial,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require('../controllers/testimonials.controller');

const router = express.Router();

router.get('/testimonials', getAllTestimonials);

router.get('/testimonials/random', getRandomTestimonial);

router.get('/testimonials/:id', getTestimonialById);

router.post('/testimonials', createTestimonial);

router.put('/testimonials/:id', updateTestimonial);

router.delete('/testimonials/:id', deleteTestimonial);

module.exports = router;
