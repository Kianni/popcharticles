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

const fetchTopArticles = async (req, res) => {
  try {
    const data = await articleService.callNYTimesAPI();
    // console.log("data", data);
    return data.results;
  } catch (error) {
    console.error('Error fetching top articles:', error);
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

const serveNYTimesMostPopular = async (req, res) => {
  try {
    const articles = await fetchTopArticles();
    const wordcloudData = [{title: "HABABABA"}];
    const searchId = await articleService.saveSearch({
      userId: req.user._id,
      // Add other search parameters if needed
    });
    await articleService.saveArticles(articles, searchId, req.user._id);
    res.render('nytimes-most-popular', {
      username: req.user.username,
      articles: articles,
      wordcloud: wordcloudData,
      searchId: searchId,
      title: 'NY Times Most Popular',
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
};

const serveTopArticlesPartial = async (req, res) => {
  try {
    const searchId = req.query.searchId;
    const articles = await articleService.getArticlesBySearchId(searchId);
    // console.log("articles", articles);
    res.render('nytimes-most-popular', {
      username: req.user.username,
      articles: articles,
      searchId: searchId,
      wordcloud: [{title: "Wordcloud"}],//req.wordcloud, // Pass existing wordcloud data if needed
      title: 'NY Times Most Popular',
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const serveTopArticlesWordcloudPartial = async (req, res) => {
  try {
    const wordcloudData = "what kind of data?" // Adjust if different data source
    const searchId = req.query.searchId;
    const articles = await articleService.getArticlesBySearchId(searchId);
    res.render('nytimes-most-popular', {
      username: req.user.username,
      articles: articles, // Pass existing articles data if needed
      searchId: searchId,
      wordcloud: wordcloudData,
      title: 'NY Times Most Popular',
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const serveGuardianSearch = (req, res) => {
  res.render('guardian-search', {
    username: req.user.username,
    articles: [],
    title: 'Guardian Search',
  });
}

const serveArchive = async (req, res) => {
  try {
    const searches = await articleService.getUserSearches(req.user._id);
    res.render('archive', {
      username: req.user.username,
      searches,
      title: 'Archive',
    });
  } catch (error) {
    console.error('Error fetching user searches:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default { 
  serveDashboard, 
  fetchByKeyword, 
  fetchTopPopular, 
  serveNYTimesMostPopular, 
  serveGuardianSearch, 
  serveArchive, 
  serveTopArticlesPartial,
  serveTopArticlesWordcloudPartial 
};