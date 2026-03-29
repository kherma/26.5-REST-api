const express = require('express');
const {
  getAllConcerts,
  getConcertById,
  createConcert,
  updateConcert,
  deleteConcert,
} = require('../controllers/concerts.controller');

const router = express.Router();

router.get('/concerts', getAllConcerts);

router.get('/concerts/:id', getConcertById);

router.post('/concerts', createConcert);

router.put('/concerts/:id', updateConcert);

router.delete('/concerts/:id', deleteConcert);

module.exports = router;
