import fetch from 'node-fetch';
import guardianApiKey from '../config/guardianApiKey.js';
import nyTimesApiKey from '../config/nyTimesApiKey.js';

// Base URL for The Guardian API
const BASE_URL = 'https://content.guardianapis.com/search';

// Function to fetch articles by keyword
const fetchArticlesByKeyword = async (keyword, fromDate = null, toDate = null) => {
  const params = new URLSearchParams({
    q: keyword,
    'api-key': guardianApiKey,
    'from-date': fromDate,
    'to-date': toDate,
    'show-fields': 'trailText', // Include abstracts
    'page-size': '5', // Limit to 5 articles
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  const data = await response.json();
  return data.response.results;
};

// Example: Fetch articles about "climate change"
const getArticles = async () => {
  try {
    const articles = await fetchArticlesByKeyword("climate change", "2024-01-01", "2024-12-31");

    // Log the results to the console
    articles.forEach(article => {
      console.log(`Title: ${article.webTitle}`);
      console.log(`Published: ${article.webPublicationDate}`);
      console.log(`Abstract: ${article.fields.trailText}`);
      console.log(`URL: ${article.webUrl}`);
      console.log();
    });

    return articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

const getTopPopular = async () => {
  const BASE_URL = 'https://api.nytimes.com/svc/mostpopular/v2/viewed/7.json';

  const params = new URLSearchParams({
    'api-key': nyTimesApiKey,
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  const textForWordCloud = concatenateTextForWordCloud(data.results);
  return textForWordCloud;
};

const concatenateTextForWordCloud = (articles) => {
  return articles
    .map((article) => {
      const abstract = article.abstract || '';
      const adxKeywords = article.adx_keywords || '';
      const desFacet = (article.des_facet || []).join(' ');
      const title = article.title || '';

      return `${abstract} ${adxKeywords} ${desFacet} ${title}`;
    })
    .join(' ');
};

export default { getArticles, getTopPopular };