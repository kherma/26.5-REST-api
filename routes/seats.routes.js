const express = require('express');
const {
  getAllSeats,
  getSeatById,
  createSeat,
  updateSeat,
  deleteSeat,
} = require('../controllers/seats.controller');

const router = express.Router();

router.get('/seats', getAllSeats);

router.get('/seats/:_id', getSeatById);

router.post('/seats', createSeat);

router.put('/seats/:_id', updateSeat);

router.delete('/seats/:_id', deleteSeat);

module.exports = router;
