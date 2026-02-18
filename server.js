const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Return all testimonials
app.get('/testimonials', (req, res) => {
  res.json(db.testimonials);
});

// Return a random testimonial
app.get('/testimonials/random', (req, res) => {
  const index = Math.floor(Math.random() * db.testimonials.length);
  res.json(db.testimonials[index]);
});

// Return testimonial by id
app.get('/testimonials/:id', (req, res) => {
  const id = req.params.id;
  const item = db.testimonials.find((t) => String(t.id) === id);
  if (!item) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.json(item);
});

// Create a new testimonial
app.post('/testimonials', (req, res) => {
  const { author, text } = req.body;
  if (!author || !text) {
    return res.status(400).json({ message: 'author and text required' });
  }
  const id = uuidv4();
  const newItem = { id, author, text };
  db.testimonials.push(newItem);
  res.json({ message: 'OK' });
});

// Update testimonial by id
app.put('/testimonials/:id', (req, res) => {
  const idParam = req.params.id;
  const { author, text } = req.body;
  const item = db.testimonials.find((t) => String(t.id) === idParam);
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

// Delete testimonial by id
app.delete('/testimonials/:id', (req, res) => {
  const idParam = req.params.id;
  const index = db.testimonials.findIndex((t) => String(t.id) === idParam);
  if (index === -1) {
    return res.status(404).json({ message: 'Not found' });
  }
  db.testimonials.splice(index, 1);
  res.json({ message: 'OK' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
