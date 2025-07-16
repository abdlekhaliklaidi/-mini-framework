const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;

const server = http.createServer((req, res) => {
  console.log(`Requête reçue : ${req.method} ${req.url}`);

  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.txt': 'text/plain'
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        if (!path.extname(filePath)) {
          fs.readFile('./index.html', (err, content) => {
            if (err) {
              res.writeHead(500);
              res.end(`Erreur du serveur: ${err.code}`);
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(content, 'utf-8');
            }
          });
        } else {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('<h1>404 - Not Found</h1>', 'utf-8');
        }
      } else {
        res.writeHead(500);
        res.end(`Erreur du serveur: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
