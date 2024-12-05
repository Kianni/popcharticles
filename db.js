import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'popcharticles';

let db;

const connectToDatabase = async () => {
  if (db) return db;
  const client = new MongoClient(url);
  await client.connect();
  db = client.db(dbName);
  console.log('Connected to MongoDB');
  return db;
};

export default connectToDatabase;