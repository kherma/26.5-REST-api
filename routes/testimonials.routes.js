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

router.get('/testimonials/:_id', getTestimonialById);

router.post('/testimonials', createTestimonial);

router.put('/testimonials/:_id', updateTestimonial);

router.delete('/testimonials/:_id', deleteTestimonial);

module.exports = router;
