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

router.get('/concerts/:_id', getConcertById);

router.post('/concerts', createConcert);

router.put('/concerts/:_id', updateConcert);

router.delete('/concerts/:_id', deleteConcert);

module.exports = router;
