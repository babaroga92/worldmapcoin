// api/index.js
const path = require('path');
const fs = require('fs');

module.exports = (req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    const filePath = path.join(__dirname, '..', 'public', 'index.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Error loading page');
      } else {
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      }
    });
  } else if (req.method === 'POST' && req.url === '/submit-address') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const { city, walletAddress } = JSON.parse(body);
        if (city && walletAddress) {
          console.log(`Received address for ${city}: ${walletAddress}`);
          res.end('Address received! Tokens will be sent after verification.');
        } else {
          res.statusCode = 400;
          res.end('Invalid request: Missing city or wallet address.');
        }
      } catch (err) {
        res.statusCode = 400;
        res.end('Invalid JSON');
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
};
