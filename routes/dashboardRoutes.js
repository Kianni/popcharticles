import express from 'express';
import dashboardController from '../controllers/dashboardController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to serve the dashboard
router.get('/dashboard', authMiddleware, dashboardController.serveDashboard);

// Route to fetch articles
router.get('/articles', dashboardController.fetchArticles);

// Route to update dashboard with fetched articles
// router.post('/update-dashboard', dashboardController.updateDashboard);

export default router;