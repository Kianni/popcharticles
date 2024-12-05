import http from 'http';
import connectToDatabase from './db.js';

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(async (req, res) => {
    // if needed to ensure that only one request is handled at a time
    if (req.url === '/') {
          const db = await connectToDatabase();
          const collection = db.collection('articles');

          // Insert a document to ensure the database and collection are created
          await collection.insertOne({
            title: 'Hello, 3. World!',
            content: 'This is a test article.',
          });

          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end('こんにちは, World!\n');
    }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
