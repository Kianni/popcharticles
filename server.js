import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import expressLayouts from 'express-ejs-layouts';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine the appropriate MongoDB URI
const mongoUri = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI_PRODUCTION : process.env.MONGODB_URI_LOCAL;

// Connect to MongoDB
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

// Middleware to parse JSON bodies
app.use(express.json());
app.use(methodOverride('_method'));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse cookies
app.use(cookieParser());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware to set user variable
app.use((req, res, next) => {
  res.locals.isAuthenticated = !!req.cookies.token;
  res.locals.currentRoute = req.path;
  next();
});

// Route to serve the home page
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// Use user routes
app.use(authRoutes);
app.use('/', dashboardRoutes);

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});
