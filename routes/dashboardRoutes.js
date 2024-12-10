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
router.get('/fetch-top-articles', authMiddleware, dashboardController.fetchTopArticles);

router.get('/nytimes-most-popular', authMiddleware, dashboardController.serveNYTimesMostPopular);
router.get('/guardian-search', authMiddleware, dashboardController.serveGuardianSearch);
router.get('/archive', authMiddleware, dashboardController.serveArchive);

export default router;