import articleService from '../services/articleService.js';

const serveDashboard = (req, res) => {
  const username = req.user.username;
  res.render('dashboard', { username });
};

const fetchArticles = async (req, res) => {
  try {
    const articles = await articleService.getArticles();
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default { serveDashboard, fetchArticles };