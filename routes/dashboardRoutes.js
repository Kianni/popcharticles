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
router.get('/top-popular-fetch-and-save', authMiddleware, dashboardController.fetchTopArticlesFromAPIandSavetoDB);
router.get('/top-articles-partial', authMiddleware, dashboardController.serveTopArticlesPartial);
router.get('/top-articles-wordcloud-partial', authMiddleware, dashboardController.serveTopArticlesWordcloudPartial);
router.post('/update-articles', authMiddleware, dashboardController.updateArticles);


router.get('/nytimes-most-popular', authMiddleware, dashboardController.serveTopArticlesPartial);
router.get('/guardian-search', authMiddleware, dashboardController.serveGuardianSearch);
router.get('/keyword-articles-partial', authMiddleware, dashboardController.serveKeywordArticlesPartial);
router.get('/archive', authMiddleware, dashboardController.serveArchive);

export default router;