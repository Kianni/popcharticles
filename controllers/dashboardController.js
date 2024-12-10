import articleService from '../services/articleService.js';

const fetchByKeyword = async (req, res) => {
  try {
    let { keyword, fromDate, toDate, howManyArticles } = req.query;
    // Set default values if parameters are undefined or empty (form is empty)
    // keyword = keyword || 'cybersecurity';
    // fromDate = fromDate || '2023-01-01';
    // toDate = toDate || '2023-12-31';
    // howManyArticles = howManyArticles || 5;

    const articles = await articleService.getArticlesByKeyword(
      keyword,
      fromDate,
      toDate,
      howManyArticles,
      req.user._id
    );
    res.render('dashboard', {
      title: 'Articles',
      articles,
      username: req.user.username,
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const fetchTopPopular = async (req, res) => {
  try {
    let {popularityPeriod, dateOfSearch, wordFrequencyThreshold, includedTopWordsNumber} = req.query;
    const articles = await articleService.getTopPopular(
      popularityPeriod=7,
      dateOfSearch,
      wordFrequencyThreshold,
      includedTopWordsNumber=50,
      req.user._id
    );
    res.json(articles);
  } catch (error) {
    console.error('Error fetching top popular articles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const serveDashboard = (req, res) => {
  res.render('dashboard', {
    username: req.user.username,
    articles: [],
    title: 'Dashboard',
  });
};

export default { serveDashboard, fetchByKeyword, fetchTopPopular };