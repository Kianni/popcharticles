import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

// Route to serve the registration form
router.get('/registration', userController.serveRegistrationForm);

// Route to handle user registration
router.post('/register', userController.registerUser);

export default router;