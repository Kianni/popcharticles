import express from 'express';
import dashboardController from '../controllers/dashboardController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to serve the dashboard
router.get('/dashboard', authMiddleware, dashboardController.serveDashboard);

// Route to fetch articles by keyword
router.get('/articles', authMiddleware, dashboardController.fetchByKeyword);

// Route to fetch top popular articles
router.get('/top-popular', authMiddleware, dashboardController.fetchTopPopular);

export default router;