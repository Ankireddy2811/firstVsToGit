const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3010;

const db = new sqlite3.Database('crypto.db');

app.use(express.static('public'));

app.get('/fetch-data', async (req, res) => {
  try {
    const fetch = await import('node-fetch');
    const response = await fetch.default('https://api.wazirx.com/api/v2/tickers');
    const data = await response.json();

    const top10Data = Object.values(data).slice(0, 10);
    db.serialize(() => {
      db.run('CREATE TABLE IF NOT EXISTS crypto_data (name TEXT, last REAL, buy REAL, sell REAL, volume REAL, base_unit TEXT)');
      const stmt = db.prepare('INSERT INTO crypto_data VALUES (?, ?, ?, ?, ?, ?)');
      top10Data.forEach(item => {
        stmt.run(item.name, item.last, item.buy, item.sell, item.volume, item.base_unit);
      });
      stmt.finalize();
    });

    res.json({ message: 'Data fetched and stored successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
});



app.get('/get-data', async (req, res) => {
  try {
    db.all('SELECT * FROM crypto_data', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred.' });
      } else {
        res.json(data);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
