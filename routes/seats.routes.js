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

router.get('/seats/:id', getSeatById);

router.post('/seats', createSeat);

router.put('/seats/:id', updateSeat);

router.delete('/seats/:id', deleteSeat);

module.exports = router;
