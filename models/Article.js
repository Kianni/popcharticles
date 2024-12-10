import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  webTitle: { type: String, required: true },
  webUrl: { type: String, required: true },
  trailText: { type: String },
  webPublicationDate: { type: Date, required: true },
  adxKeywords: { type: String },
  desFacet: { type: [String] },
  source: { type: String },
  searchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Search' }, // Reference to Search
});

const Article = mongoose.model('Article', articleSchema);

export default Article;
