const express = require('express');
const Concert = require('../models/Concert');

const router = express.Router();

router.get('/concerts', async (req, res) => {
  try {
    const concerts = await Concert.find();
    return res.json(concerts);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/concerts/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const concert = await Concert.findOne({ id });

    if (!concert) {
      return res.status(404).json({ message: 'Concert not found' });
    }

    return res.json(concert);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/concerts', async (req, res) => {
  try {
    const { performer, genre, price, day, image } = req.body;
    const priceNumber = Number(price);
    const dayNumber = Number(day);

    if (!performer || !genre || !price || !day || !image) {
      return res
        .status(400)
        .json({ message: 'performer, genre, price, day and image required' });
    }

    const lastConcert = await Concert.findOne().sort({ id: -1 }).select('id -_id');
    const newId = lastConcert ? lastConcert.id + 1 : 1;
    const newConcert = new Concert({
      id: newId,
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
});

router.put('/concerts/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { performer, genre, price, day, image } = req.body;
    const priceNumber = Number(price);
    const dayNumber = Number(day);
    const concert = await Concert.findOne({ id });

    if (!concert) {
      return res.status(404).json({ message: 'Concert not found' });
    }

    if (!performer || !genre || !price || !day || !image) {
      return res
        .status(400)
        .json({ message: 'performer, genre, price, day and image required' });
    }

    await Concert.findByIdAndUpdate(concert._id, {
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
});

router.delete('/concerts/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deletedConcert = await Concert.findOneAndDelete({ id });

    if (!deletedConcert) {
      return res.status(404).json({ message: 'Concert not found' });
    }

    return res.json({ message: 'OK' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
