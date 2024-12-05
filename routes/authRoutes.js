import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

// Route to serve the registration form
router.get('/registration', authController.serveRegistrationForm);

// Route to handle user registration
router.post('/register', authController.registerUser);

// Route to serve the login form
router.get('/login', authController.serveLoginForm);

export default router;