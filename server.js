const express = require('express');
const path = require('path');
const app = express();
const PORT = 3002;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Sweat Pets server running at http://localhost:${PORT}`);
}); 