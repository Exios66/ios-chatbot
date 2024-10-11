import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

let port;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..')));

function findAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const tryPort = (p) => {
      server.listen(p, 'localhost', () => {
        server.once('close', () => resolve(p));
        server.close();
      });
      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          tryPort(p + 1);
        } else {
          reject(err);
        }
      });
    };
    tryPort(startPort);
  });
}

findAvailablePort(3000).then((availablePort) => {
  port = availablePort;
  server.listen(port, 'localhost', () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}).catch((err) => {
  console.error('Failed to find an available port:', err);
});

// Serve the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});
