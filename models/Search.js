import mongoose from 'mongoose';

const searchSchema = new mongoose.Schema({
  popularityPeriod: { type: Number }, // 1, 7, or 30 days
  dateOfSearch: { type: Date, default: Date.now },
  periodOfSearch: {
    dateFrom: { type: Date },
    dateTo: { type: Date },
  },
  keyword: { type: String },
  wordFrequencyThreshold: { type: Number },
  includedTopWordsNumber: { type: Number },
  articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }], // Reference to Articles
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
});

const Search = mongoose.model('Search', searchSchema);

export default Search;