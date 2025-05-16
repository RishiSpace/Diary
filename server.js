const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const dbPath = path.join(__dirname, 'diary.db');
const db = new sqlite3.Database(dbPath);

app.use(cors());
app.use(bodyParser.json());

// Create tables if not exist
// Accounts: id (TEXT PRIMARY KEY), username (TEXT), publicKey (TEXT), privateKey (TEXT)
db.run(`CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  username TEXT,
  publicKey TEXT,
  privateKey TEXT
)`);
// Entries: id (TEXT PRIMARY KEY), accountId (TEXT), date (TEXT), content (TEXT)
db.run(`CREATE TABLE IF NOT EXISTS entries (
  id TEXT PRIMARY KEY,
  accountId TEXT,
  date TEXT,
  content TEXT
)`);

// API: Get all accounts
app.get('/api/accounts', (req, res) => {
  db.all('SELECT * FROM accounts', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API: Add account
app.post('/api/accounts', (req, res) => {
  const { id, username, publicKey, privateKey } = req.body;
  db.run(
    'INSERT INTO accounts (id, username, publicKey, privateKey) VALUES (?, ?, ?, ?)',
    [id, username, JSON.stringify(publicKey), JSON.stringify(privateKey)],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// API: Get entries for account
app.get('/api/entries/:accountId', (req, res) => {
  db.all('SELECT * FROM entries WHERE accountId = ?', [req.params.accountId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API: Add entry
app.post('/api/entries', (req, res) => {
  const { id, accountId, date, content } = req.body;
  db.run(
    'INSERT INTO entries (id, accountId, date, content) VALUES (?, ?, ?, ?)',
    [id, accountId, date, content],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Diary backend server running at http://localhost:${PORT}`);
});