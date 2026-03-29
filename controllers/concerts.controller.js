const mongoose = require('mongoose');
const Concert = require('../models/Concert');

const getAllConcerts = async (req, res) => {
  try {
    const concerts = await Concert.find();
    return res.json(concerts);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getConcertById = async (req, res) => {
  try {
    const { _id } = req.params;

    if (!mongoose.isValidObjectId(_id)) {
      return res.status(404).json({ message: 'Concert not found' });
    }

    const concert = await Concert.findById(_id);

    if (!concert) {
      return res.status(404).json({ message: 'Concert not found' });
    }

    return res.json(concert);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createConcert = async (req, res) => {
  try {
    const { performer, genre, price, day, image } = req.body;
    const priceNumber = Number(price);
    const dayNumber = Number(day);

    if (!performer || !genre || !price || !day || !image) {
      return res
        .status(400)
        .json({ message: 'performer, genre, price, day and image required' });
    }

    const newConcert = new Concert({
      performer,
      genre,
      price: priceNumber,
      day: dayNumber,
      image,
    });

    await newConcert.save();

    return res.json({ message: 'OK' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateConcert = async (req, res) => {
  try {
    const { _id } = req.params;
    const { performer, genre, price, day, image } = req.body;
    const priceNumber = Number(price);
    const dayNumber = Number(day);

    if (!mongoose.isValidObjectId(_id)) {
      return res.status(404).json({ message: 'Concert not found' });
    }

    const concert = await Concert.findById(_id);

    if (!concert) {
      return res.status(404).json({ message: 'Concert not found' });
    }

    if (!performer || !genre || !price || !day || !image) {
      return res
        .status(400)
        .json({ message: 'performer, genre, price, day and image required' });
    }

    await Concert.findByIdAndUpdate(_id, {
      performer,
      genre,
      price: priceNumber,
      day: dayNumber,
      image,
    });

    return res.json({ message: 'OK' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteConcert = async (req, res) => {
  try {
    const { _id } = req.params;

    if (!mongoose.isValidObjectId(_id)) {
      return res.status(404).json({ message: 'Concert not found' });
    }

    const deletedConcert = await Concert.findByIdAndDelete(_id);

    if (!deletedConcert) {
      return res.status(404).json({ message: 'Concert not found' });
    }

    return res.json({ message: 'OK' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllConcerts,
  getConcertById,
  createConcert,
  updateConcert,
  deleteConcert,
};
