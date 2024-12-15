import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
const secretKey = process.env.SECRET_KEY;

const userService = {
  findUserByUsername: async (username) => {
    return await User.findOne({ username });
  },

  createUser: async (userData) => {
    const newUser = new User(userData);
    return await newUser.save();
  },

  setTokenCookie: (res, userId) => {
    const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
  }
};

export default userService;