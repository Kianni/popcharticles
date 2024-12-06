import articleService from '../services/articleService.js';

const fetchArticles = async (req, res) => {
  try {
    const articles = await articleService.getArticles();
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const fetchTopPopular = async (req, res) => {
  try {
    const articles = await articleService.getTopPopular();
    res.json(articles);
  } catch (error) {
    console.error('Error fetching top popular articles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const serveDashboard = (req, res) => {
  res.render('dashboard', { username: req.user.username, articles: [] });
};

// const updateDashboard = (req, res) => {
//   const { articles } = req.body;
//   console.log('Articles received from client:', articles);
//   res.render('dashboard', { username: "req.user.username", articles });
// };

export default { serveDashboard, fetchArticles, fetchTopPopular };