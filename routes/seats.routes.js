const express = require('express');
const Seat = require('../models/Seat');

const router = express.Router();

const isSlotTaken = async (day, seatNumber, excludedId = null) => {
  const query = {
    day,
    seat: seatNumber,
  };

  if (excludedId !== null) {
    query.id = { $ne: excludedId };
  }

  const existingSeat = await Seat.findOne(query);

  return Boolean(existingSeat);
};

router.get('/seats', async (req, res) => {
  try {
    const seats = await Seat.find();
    res.json(seats);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/seats/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const seat = await Seat.findOne({ id });

    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    return res.json(seat);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/seats', async (req, res) => {
  try {
    const { day, seat, client, email } = req.body;
    const dayNumber = Number(day);
    const seatNumber = Number(seat);

    if (!day || !seat || !client || !email) {
      return res
        .status(400)
        .json({ message: 'day, seat, client and email required' });
    }

    if (await isSlotTaken(dayNumber, seatNumber)) {
      return res.status(409).json({ message: 'The slot is already taken...' });
    }

    const lastSeat = await Seat.findOne().sort({ id: -1 }).select('id -_id');
    const newId = lastSeat ? lastSeat.id + 1 : 1;
    const newSeat = new Seat({
      id: newId,
      day: dayNumber,
      seat: seatNumber,
      client,
      email,
    });

    await newSeat.save();

    if (req.io) {
      const seats = await Seat.find();
      req.io.emit('seatsUpdated', seats);
    }

    return res.json({ message: 'OK' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/seats/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { day, seat, client, email } = req.body;
    const dayNumber = Number(day);
    const seatNumber = Number(seat);
    const existingSeat = await Seat.findOne({ id });

    if (!existingSeat) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    if (!day || !seat || !client || !email) {
      return res
        .status(400)
        .json({ message: 'day, seat, client and email required' });
    }

    if (await isSlotTaken(dayNumber, seatNumber, id)) {
      return res.status(409).json({ message: 'The slot is already taken...' });
    }

    await Seat.findByIdAndUpdate(existingSeat._id, {
      day: dayNumber,
      seat: seatNumber,
      client,
      email,
    });

    return res.json({ message: 'OK' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/seats/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deletedSeat = await Seat.findOneAndDelete({ id });

    if (!deletedSeat) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    return res.json({ message: 'OK' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
