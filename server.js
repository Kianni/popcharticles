import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/popcharticles')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Route to serve the home page
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Use user routes
app.use(authRoutes);

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});
