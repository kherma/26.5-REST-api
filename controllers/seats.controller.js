const mongoose = require('mongoose');
const Seat = require('../models/Seat');

const isSlotTaken = async (day, seatNumber, excludedId = null) => {
  const query = {
    day,
    seat: seatNumber,
  };

  if (excludedId !== null) {
    query._id = { $ne: excludedId };
  }

  const existingSeat = await Seat.findOne(query);

  return Boolean(existingSeat);
};

const getAllSeats = async (req, res) => {
  try {
    const seats = await Seat.find();
    return res.json(seats);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getSeatById = async (req, res) => {
  try {
    const { _id } = req.params;

    if (!mongoose.isValidObjectId(_id)) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    const seat = await Seat.findById(_id);

    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    return res.json(seat);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createSeat = async (req, res) => {
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

    const newSeat = new Seat({
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
};

const updateSeat = async (req, res) => {
  try {
    const { _id } = req.params;
    const { day, seat, client, email } = req.body;
    const dayNumber = Number(day);
    const seatNumber = Number(seat);

    if (!mongoose.isValidObjectId(_id)) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    const existingSeat = await Seat.findById(_id);

    if (!existingSeat) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    if (!day || !seat || !client || !email) {
      return res
        .status(400)
        .json({ message: 'day, seat, client and email required' });
    }

    if (await isSlotTaken(dayNumber, seatNumber, _id)) {
      return res.status(409).json({ message: 'The slot is already taken...' });
    }

    await Seat.findByIdAndUpdate(_id, {
      day: dayNumber,
      seat: seatNumber,
      client,
      email,
    });

    return res.json({ message: 'OK' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteSeat = async (req, res) => {
  try {
    const { _id } = req.params;

    if (!mongoose.isValidObjectId(_id)) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    const deletedSeat = await Seat.findByIdAndDelete(_id);

    if (!deletedSeat) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    return res.json({ message: 'OK' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllSeats,
  getSeatById,
  createSeat,
  updateSeat,
  deleteSeat,
};
