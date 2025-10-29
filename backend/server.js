const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 4000;
const DB_PATH = process.env.YUGA_DB || path.join(process.cwd(), 'yuga.db');

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Init DB
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.exec(`
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  data TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
`);

// Health
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// List projects (summary)
app.get('/api/projects', (req, res) => {
  const rows = db.prepare('SELECT id, name, updated_at FROM projects ORDER BY updated_at DESC').all();
  res.json(rows);
});

// Get one project
app.get('/api/projects/:id', (req, res) => {
  const row = db.prepare('SELECT id, name, data, updated_at FROM projects WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  row.data = JSON.parse(row.data);
  res.json(row);
});

// Upsert project
app.post('/api/projects', (req, res) => {
  const body = req.body;
  if (!body || !body.id || !body.name || !body.data) return res.status(400).json({ error: 'id, name, data required' });
  const now = Date.now();
  const stmt = db.prepare(`
    INSERT INTO projects (id, name, data, updated_at) VALUES (@id, @name, @data, @updated_at)
    ON CONFLICT(id) DO UPDATE SET name=@name, data=@data, updated_at=@updated_at
  `);
  stmt.run({ id: body.id, name: body.name, data: JSON.stringify(body.data), updated_at: now });
  res.json({ ok: true, updated_at: now });
});

// Delete project
app.delete('/api/projects/:id', (req, res) => {
  const info = db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.json({ ok: true, changes: info.changes });
});

app.listen(PORT, () => {
  console.log(`YUGA API listening on http://localhost:${PORT}`);
});


