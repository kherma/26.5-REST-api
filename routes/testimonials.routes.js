const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

const router = express.Router();

router.get('/testimonials', (req, res) => {
  res.json(db.testimonials);
});

router.get('/testimonials/random', (req, res) => {
  const index = Math.floor(Math.random() * db.testimonials.length);
  res.json(db.testimonials[index]);
});

router.get('/testimonials/:id', (req, res) => {
  const id = req.params.id;
  const item = db.testimonials.find((t) => String(t.id) === id);

  if (!item) {
    return res.status(404).json({ message: 'Not found' });
  }

  res.json(item);
});

router.post('/testimonials', (req, res) => {
  const { author, text } = req.body;

  if (!author || !text) {
    return res.status(400).json({ message: 'author and text required' });
  }

  const newItem = { id: uuidv4(), author, text };
  db.testimonials.push(newItem);

  res.json({ message: 'OK' });
});

router.put('/testimonials/:id', (req, res) => {
  const id = req.params.id;
  const { author, text } = req.body;
  const item = db.testimonials.find((t) => String(t.id) === id);

  if (!item) {
    return res.status(404).json({ message: 'Not found' });
  }

  if (!author || !text) {
    return res.status(400).json({ message: 'author and text required' });
  }

  item.author = author;
  item.text = text;

  res.json({ message: 'OK' });
});

router.delete('/testimonials/:id', (req, res) => {
  const id = req.params.id;
  const index = db.testimonials.findIndex((t) => String(t.id) === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Not found' });
  }

  db.testimonials.splice(index, 1);

  res.json({ message: 'OK' });
});

module.exports = router;
