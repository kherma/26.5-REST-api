const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

const router = express.Router();

const isSlotTaken = (day, seat, excludedId = null) =>
  db.seats.some(
    (seatItem) =>
      String(seatItem.day) === String(day) &&
      String(seatItem.seat) === String(seat) &&
      (excludedId === null || String(seatItem.id) !== String(excludedId))
  );

router.get('/seats', (req, res) => {
  res.json(db.seats);
});

router.get('/seats/:id', (req, res) => {
  const id = req.params.id;
  const item = db.seats.find((seat) => String(seat.id) === id);

  if (!item) {
    return res.status(404).json({ message: 'Not found' });
  }

  res.json(item);
});

router.post('/seats', (req, res) => {
  const { day, seat, client, email } = req.body;

  if (!day || !seat || !client || !email) {
    return res
      .status(400)
      .json({ message: 'day, seat, client and email required' });
  }

  if (isSlotTaken(day, seat)) {
    return res.status(409).json({ message: 'The slot is already taken...' });
  }

  const newItem = { id: uuidv4(), day, seat, client, email };
  db.seats.push(newItem);

  res.json({ message: 'OK' });
});

router.put('/seats/:id', (req, res) => {
  const id = req.params.id;
  const { day, seat, client, email } = req.body;
  const item = db.seats.find((seatItem) => String(seatItem.id) === id);

  if (!item) {
    return res.status(404).json({ message: 'Not found' });
  }

  if (!day || !seat || !client || !email) {
    return res
      .status(400)
      .json({ message: 'day, seat, client and email required' });
  }

  if (isSlotTaken(day, seat, id)) {
    return res.status(409).json({ message: 'The slot is already taken...' });
  }

  item.day = day;
  item.seat = seat;
  item.client = client;
  item.email = email;

  res.json({ message: 'OK' });
});

router.delete('/seats/:id', (req, res) => {
  const id = req.params.id;
  const index = db.seats.findIndex((seat) => String(seat.id) === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Not found' });
  }

  db.seats.splice(index, 1);

  res.json({ message: 'OK' });
});

module.exports = router;
