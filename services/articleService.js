import fetch from 'node-fetch';
import guardianApiKey from '../config/guardianApiKey.js';
import nyTimesApiKey from '../config/nyTimesApiKey.js';

// Function to fetch articles by keyword
const fetchArticlesByKeyword = async (keyword, fromDate, toDate, howManyArticles) => {

  // Base URL for The Guardian API
  const BASE_URL = 'https://content.guardianapis.com/search';

  const params = new URLSearchParams({
    q: keyword,
    'api-key': guardianApiKey,
    'from-date': fromDate,
    'to-date': toDate,
    'show-fields': 'trailText', // Include abstracts
    'page-size': howManyArticles,
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  const data = await response.json();
  if (!data.response || !data.response.results) {
    // throw new Error('No articles found');
    data.response.results = [];
  }
  return data.response.results;
};

// Example: Fetch articles about "cybersecurity"
const getArticles = async (keyword, fromDate, toDate, howManyArticles) => {
  try {
    return await fetchArticlesByKeyword(
      keyword,
      fromDate,
      toDate,
      howManyArticles
    );
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

const getTopPopular = async () => {
  const data = await fetchTopPopularFromAPI();
  const rawText = concatenateTextForWordCloud(data.results);
  const cleanerText = cleanText(rawText);
  const wordCloudData = wordFreq(cleanerText);
  return wordCloudData;
};

const fetchTopPopularFromAPI = async () => {
  const BASE_URL = 'https://api.nytimes.com/svc/mostpopular/v2/viewed/7.json';

  const params = new URLSearchParams({
    'api-key': nyTimesApiKey,
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const concatenateTextForWordCloud = (articles) => {
  return articles
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
};

const wordFreq = (wordsByCommas, minFrequency = null, topN = null) => {
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

  // Filter words by minimum frequency
  if (minFrequency !== null){
    wordArray = wordArray.filter(([word, freq]) => freq >= minFrequency);
  }

  // Sort the word array by frequency in descending order
  wordArray.sort((a, b) => b[1] - a[1]);

  // If topN is specified, take only the top N words
  if (topN !== null) {
    wordArray = wordArray.slice(0, topN);
  }

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
    .map(word => word.replace(/[^a-zA-Z-]/g, '').toLowerCase()) // Remove non-alphabetic characters except dashes and convert to lowercase
    .filter(word => word.length > 2 && !stopWords.has(word)); // Filter stop words and short words
}

export default { getArticles, getTopPopular };