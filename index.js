const express = require('express');
const constants = require('./constants');
const understat = require('./understat');

const app = express();

app.get('/', (req, res) => {
  res.send('🚀 Understat API (Node.js) est en ligne sur Render');
});

app.get('/constants', (req, res) => {
  res.json(constants);
});

// simple endpoint to proxy understat get_stats (example)
app.get('/stats', async (req, res) => {
  try {
    const data = await understat.getStats(req.query);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => {
  console.log('Server listening on port', port);
});
