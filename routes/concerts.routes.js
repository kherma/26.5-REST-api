const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

const router = express.Router();

router.get('/concerts', (req, res) => {
  res.json(db.concerts);
});

router.get('/concerts/:id', (req, res) => {
  const id = req.params.id;
  const item = db.concerts.find((concert) => String(concert.id) === id);

  if (!item) {
    return res.status(404).json({ message: 'Not found' });
  }

  res.json(item);
});

router.post('/concerts', (req, res) => {
  const { performer, genre, price, day, image } = req.body;

  if (!performer || !genre || !price || !day || !image) {
    return res
      .status(400)
      .json({ message: 'performer, genre, price, day and image required' });
  }

  const newItem = { id: uuidv4(), performer, genre, price, day, image };
  db.concerts.push(newItem);

  res.json({ message: 'OK' });
});

router.put('/concerts/:id', (req, res) => {
  const id = req.params.id;
  const { performer, genre, price, day, image } = req.body;
  const item = db.concerts.find((concert) => String(concert.id) === id);

  if (!item) {
    return res.status(404).json({ message: 'Not found' });
  }

  if (!performer || !genre || !price || !day || !image) {
    return res
      .status(400)
      .json({ message: 'performer, genre, price, day and image required' });
  }

  item.performer = performer;
  item.genre = genre;
  item.price = price;
  item.day = day;
  item.image = image;

  res.json({ message: 'OK' });
});

router.delete('/concerts/:id', (req, res) => {
  const id = req.params.id;
  const index = db.concerts.findIndex((concert) => String(concert.id) === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Not found' });
  }

  db.concerts.splice(index, 1);

  res.json({ message: 'OK' });
});

module.exports = router;
