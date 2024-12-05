import express from 'express';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from './models/User.js';

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

// Route to serve the registration form
app.get('/registration', (req, res) => {
  res.sendFile('registration_form.html', { root: 'public' });
});

// Route to handle user registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Server-side validation
  const usernameRegex = /^[a-zA-Z_]+$/;
  const passwordRegex = /^[0-9]{4,}$/;

  if (!usernameRegex.test(username)) {
    return res.status(400).json({ message: 'Username can only contain letters and underscores.' });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: 'Password must be at least 4 characters long and contain only numbers.' });
  }

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(200).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error during user registration:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});
