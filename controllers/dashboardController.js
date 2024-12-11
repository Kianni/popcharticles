import articleService from '../services/articleService.js';

const fetchByKeyword = async (req, res) => {
  try {
    let { keyword, fromDate, toDate, howManyArticles } = req.query;
    const articles = await articleService.callGuardianAPI(
      keyword,
      fromDate,
      toDate,
      howManyArticles
    );

    const searchId = await articleService.saveSearch({
      periodOfSearch: { dateFrom: fromDate, dateTo: toDate },
      keyword: keyword,
      userId: req.user._id,
    });
    
    await articleService.saveArticles(articles, searchId, req.user._id);

    res.redirect(`/keyword-articles-partial?searchId=${searchId}`);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const fetchTopPopular = async (req, res) => {
  try {
    const searchId = req.query.searchId;
    const articles = await articleService.prepareDataForWordCloud(searchId);
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

const fetchTopArticlesFromAPIandSavetoDB = async (req, res) => {
  try {
    const { popularityPeriod } = req.query;
    // console.log('popularityPeriod in controller:', popularityPeriod); // Debugging log
    const data = await articleService.callNYTimesAPI(popularityPeriod);
    const searchId = await articleService.saveSearch({
      userId: req.user._id,
      popularityPeriod: popularityPeriod,
    });
    await articleService.saveArticles(data.results, searchId, req.user._id);
    res.redirect(`/top-articles-partial?searchId=${searchId}`);
    // res.json(data.results);
  } catch (error) {
    console.error('Error fetching top articles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateArticles = async (req, res) => {
  try {
    const { searchId, deleteArticles } = req.body;
    await articleService.deleteArticles(deleteArticles);
    const updatedArticles = await articleService.getArticlesBySearchId(
      searchId
    );
    res.render('nytimes-most-popular', {
      username: req.user.username,
      articles: updatedArticles,
      searchId: searchId,
      title: 'Updated list',
    });
  } catch (error) {
    console.error('Error updating articles:', error);
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

const serveKeywordArticlesPartial = async (req, res) => {
  try {
    const searchId = req.query.searchId;
    const articles = await articleService.getArticlesBySearchId(searchId);
    res.render('guardian-search', {
      username: req.user.username,
      articles: articles,
      searchId: searchId,
      title: 'Guardian Search',
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
  serveGuardianSearch,
  serveArchive,
  serveTopArticlesPartial,
  serveTopArticlesWordcloudPartial,
  fetchTopArticlesFromAPIandSavetoDB,
  updateArticles,
  serveKeywordArticlesPartial
};