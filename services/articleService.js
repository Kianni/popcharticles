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
  const result = articles
    .map((article) => {
      const abstract = article.abstract || '';
      const adxKeywords = article.adx_keywords || '';
      const desFacet = (article.des_facet || []).join(' ');
      const title = article.title || '';

      // const cleanedText = cleanText(`${abstract} ${adxKeywords} ${desFacet} ${title}`);
      // const wordCloudData = cleanedText.join(' ');
      // console.log(cleanedText);
      return `${abstract} ${adxKeywords} ${desFacet} ${title}`;
    })
    .join(' ');
    const cleanerText = cleanText(result);
    const wordCloudData = wordFreq(cleanerText);
    console.log(wordCloudData);
    return wordCloudData;
};

const wordFreq = (wordsByCommas) => {
  let wordFreq = {};
  wordsByCommas.forEach((word) => {
    word = word.trim().toLowerCase(); // Normalize case and trim spaces
    if (wordFreq[word]) {
      wordFreq[word]++;
    } else {
      wordFreq[word] = 1;
    }
  });
  let wordArray = Object.entries(wordFreq);
  return wordArray;
};

const cleanText = (text) => {
  // Define stop words
  const stopWords = new Set([
    'and', 'the', 'to', 'of', 'in', 'on', 'for', 'she', 'he', 'it', 'a', 'an',
    'this', 'that', 'his', 'her', 'about', 'which', 'with', 'our', 'is', 'was',
    'were', 'be', 'been', 'are', 'at', 'by', 'from', 'as', 'or', 'but', 'if',
    'not', 'they', 'their', 'them', 'we', 'us', 'you', 'your', 'i', 'me', 'my',
    'mine', 'all', 'can', 'will', 'would', 'there', 'what', 'when', 'where',
    'who', 'how', 'why', 'so', 'up', 'down', 'out', 'over', 'under', 'again',
    'then', 'once', 'here', 'just', 'also', 'more', 'no', 'yes', 'than', 'too',
    'very', 'some', 'any', 'each', 'other', 'such', 'only', 'own', 'same',
    'both', 'few', 'many', 'most', 'much', 'do', 'does', 'did', 'doing', 'has',
    'have', 'having', 'had', 'should', 'could', 'might', 'must', 'shall', 'may',
    'now', 'these', 'those', 'because', 'been', 'being', 'into', 'through',
    'during', 'before', 'after', 'above', 'below', 'between', 'while', 'where',
    'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other',
    'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than',
    'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'
  ]);

  return text
    .split(/[\s,;]+/)
    .map(word => word.replace(/[^a-zA-Z-]/g, '')) // Remove non-alphabetic characters except dashes
    .filter(word => word.length > 2 && !stopWords.has(word)); // Filter stop words and short words
}

export default { getArticles, getTopPopular };