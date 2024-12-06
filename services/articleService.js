import fetch from 'node-fetch';

// Replace 'your_api_key_here' with your actual Guardian API key
const API_KEY = 'a96f679f-208f-4903-9ffa-654022cab934';

// Base URL for The Guardian API
const BASE_URL = 'https://content.guardianapis.com/search';

// Function to fetch articles by keyword
const fetchArticlesByKeyword = async (keyword, fromDate = null, toDate = null) => {
  const params = new URLSearchParams({
    'q': keyword,
    'api-key': API_KEY,
    'from-date': fromDate,
    'to-date': toDate,
    'show-fields': 'trailText',  // Include abstracts
    'page-size': '5'  // Limit to 5 articles
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
  // const params = new URLSearchParams({
  //   'api-key': API_KEY,
  //   'show-fields': 'trailText',  // Include abstracts
  //   'page-size': '5',  // Limit to 5 articles
  //   'order-by': 'relevance'  // Order by relevance
  // });

  // const response = await fetch(`${BASE_URL}?${params.toString()}`);
  // const data = await response.json();
  // return data.response.results;

  return ["Article 1", "Article 2", "Article 3", "Article 4", "Article 5"];
};

export default { getArticles, getTopPopular };