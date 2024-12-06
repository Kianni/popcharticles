import express from 'express';
import dashboardController from '../controllers/dashboardController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to serve the dashboard
router.get('/dashboard', authMiddleware, dashboardController.serveDashboard);

// Route to fetch articles by keyword
router.get('/articles', dashboardController.fetchArticles);

// Route to fetch top popular articles
router.get('/top-popular', dashboardController.fetchTopPopular);

// Route to update dashboard with fetched articles
// router.post('/update-dashboard', dashboardController.updateDashboard);

export default router;