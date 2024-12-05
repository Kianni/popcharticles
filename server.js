import express from 'express';
import connectToDatabase from './db.js';

const app = express();
const hostname = '127.0.0.1';
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Route to serve the registration form
app.get('/registration', (req, res) => {
  res.sendFile('registration_form.html', { root: 'public' });
});

// Route to handle user registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const db = await connectToDatabase();
  const collection = db.collection('users');

  // Check if the username already exists
  const existingUser = await collection.findOne({ username });
  if (existingUser) {
    res.status(400).json({ message: 'Username already exists' });
  } else {
    // Insert the new user
    await collection.insertOne({ username, password });
    res.status(200).json({ message: 'User registered successfully' });
  }
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
