import fetch from 'node-fetch';
import guardianApiKey from '../config/guardianApiKey.js';
import nyTimesApiKey from '../config/nyTimesApiKey.js';
import Article from '../models/Article.js';
import Search from '../models/Search.js';

// Function to fetch articles by keyword
const callGuardianAPI = async (keyword, fromDate, toDate, howManyArticles) => {

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
  // console.log(data.response);
  return data.response.results;
};

const saveArticles = async (articles, searchId, userId) => {
  try {
    const articleDocs = articles.map((article) => ({
      title: article.webTitle || article.title,
      webUrl: article.webUrl || article.url,
      abstract: article.fields?.trailText || article.abstract,
      webPublicationDate: new Date(
        article.webPublicationDate || article.published_date
      ),
      adxKeywords: article.adx_keywords,
      desFacet: article.des_facet,
      source: article.source || 'Unknown',
      searchId: searchId,
      user: userId,
    }));

    await Article.insertMany(articleDocs);
    console.log('Articles saved to the database');
  } catch (error) {
    console.error('Error saving articles:', error);
  }
};

const saveSearch = async ({
  popularityPeriod=null,
  periodOfSearch= { dateFrom: null, dateTo: null },
  keyword=null,
  wordFrequencyThreshold=null,
  includedTopWordsNumber=null,
  userId=null}
) => {
  try {
    const search = new Search({
      popularityPeriod: popularityPeriod,
      periodOfSearch: periodOfSearch,
      keyword: keyword,
      wordFrequencyThreshold: wordFrequencyThreshold,
      includedTopWordsNumber: includedTopWordsNumber,
      user: userId,
    });
    await search.save();
    console.log('Search saved to the database');
    return search._id;
  } catch (error) {
    console.error('Error saving search:', error);
  }
};

const getArticlesByKeyword = async (
  keyword,
  fromDate,
  toDate,
  howManyArticles,
  userId
) => {
  try {
    const searchId = await saveSearch({
      periodOfSearch: { dateFrom: fromDate, dateTo: toDate },
      keyword: keyword,
      userId: userId,
    });

    const articles = await callGuardianAPI(
      keyword,
      fromDate,
      toDate,
      howManyArticles
    );
    await saveArticles(articles, searchId, userId);
    return articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
};

const getTopPopular = async (      
      popularityPeriod,
      dateOfSearch,
      wordFrequencyThreshold,
      includedTopWordsNumber,
      userId) => {
        let data = [];
        try {
          const searchId = await saveSearch({
            popularityPeriod: popularityPeriod,
            dateOfSearch: dateOfSearch,
            wordFrequencyThreshold: wordFrequencyThreshold,
            includedTopWordsNumber: includedTopWordsNumber,
            userId: userId,
          });
          data = await callNYTimesAPI();
          await saveArticles(data.results, searchId, userId);
        } catch (error) {
          console.error('Error fetching top popular articles:', error);
          return [];
        }
  
  const rawText = concatenateTextForWordCloud(data.results);
  const cleanerText = cleanText(rawText);
  const wordCloudData = wordFreq(
    cleanerText,
    null,
    includedTopWordsNumber
  );
  return wordCloudData;
};

const callNYTimesAPI = async () => {
  const BASE_URL = 'https://api.nytimes.com/svc/mostpopular/v2/viewed/7.json';

  const params = new URLSearchParams({
    'api-key': nyTimesApiKey,
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json(); // Store the result of response.json()
  // console.log(data); // Log the data
  return data; // Return the data
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

const getUserSearches = async (userId) => {
  try {
    const searches = await Search.find({ user: userId }).sort({ dateOfSearch: -1 });
    return searches;
  } catch (error) {
    console.error('Error fetching user searches:', error);
    return [];
  }
};

const getArticlesBySearchId = async (searchId) => {
  try {
    const articles = await Article.find({ searchId });
    return articles;
  } catch (error) {
    console.error('Error fetching articles by searchId:', error);
    throw new Error('Internal server error');
  }
};

export default {
  getArticlesByKeyword,
  getTopPopular,
  getUserSearches,
  callNYTimesAPI,
  getArticlesBySearchId,
  saveSearch,
  saveArticles
};