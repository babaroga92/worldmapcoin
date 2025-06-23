const express = require('express');
const app = express();
const path = require('path');

// Dodaj parsiranje JSON tela zahteva
app.use(express.json());

// Služenje statičkih datoteka iz 'public' foldera
app.use(express.static(path.join(__dirname, 'public')));

// Ruta za koren (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta za slanje adrese
app.post('/submit-address', (req, res) => {
  const { city, walletAddress } = req.body;
  if (city && walletAddress) {
    console.log(`Received address for ${city}: ${walletAddress}`);
    res.send('Address received! Tokens will be sent after verification.');
  } else {
    res.status(400).send('Invalid request: Missing city or wallet address.');
  }
});

// Dinamički port koji Render traži
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
