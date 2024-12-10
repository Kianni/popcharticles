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
    res.render('guardian-search', {
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

const serveNYTimesMostPopular = (req, res) => {
  res.render('nytimes-most-popular', {
    username: req.user.username,
    articles: [],
    title: 'NY Times Most Popular',
  });
}

const serveGuardianSearch = (req, res) => {
  res.render('guardian-search', {
    username: req.user.username,
    articles: [],
    title: 'Guardian Search',
  });
}

const serveArchive = (req, res) => {
  res.render('archive', {
    username: req.user.username,
    articles: [],
    title: 'Archive',
  });
}

export default { serveDashboard, fetchByKeyword, fetchTopPopular, serveNYTimesMostPopular, serveGuardianSearch, serveArchive };