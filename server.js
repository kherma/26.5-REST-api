const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const Seat = require('./models/Seat');

const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');

const app = express();
const port = process.env.PORT || 8000;
const mongoUri = 'mongodb://127.0.0.1:27017/NewWaveDB';
const httpServer = http.createServer(app);
const collectionsWithLegacyId = ['testimonials', 'concerts', 'seats'];
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const cleanupLegacyIdUsage = async () => {
  for (const collectionName of collectionsWithLegacyId) {
    const collection = mongoose.connection.collection(collectionName);
    const indexes = await collection.indexes();
    const hasLegacyIdIndex = indexes.some((index) => index.name === 'id_1');

    if (hasLegacyIdIndex) {
      await collection.dropIndex('id_1');
      console.log(`Dropped legacy index id_1 from ${collectionName}`);
    }

    const result = await collection.updateMany(
      { id: { $exists: true } },
      { $unset: { id: '' } }
    );

    if (result.modifiedCount > 0) {
      console.log(`Removed legacy id field from ${result.modifiedCount} docs in ${collectionName}`);
    }
  }
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/client/build')));
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', testimonialsRoutes);
app.use('/api', concertsRoutes);
app.use('/api', seatsRoutes);

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
});

io.on('connection', async (socket) => {
  console.log('New socket!');

  try {
    const seats = await Seat.find();
    socket.emit('seatsUpdated', seats);
  } catch (error) {
    console.error('Error loading seats for socket connection:', error);
  }

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

mongoose
  .connect(mongoUri)
  .then(async () => {
    console.log(`Connected to MongoDB: ${mongoUri}`);
    await cleanupLegacyIdUsage();
    httpServer.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
