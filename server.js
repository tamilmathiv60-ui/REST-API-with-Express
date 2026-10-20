const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // JSON in
app.use(express.static(path.join(__dirname, 'public'))); // demo page

// In-memory store for the "books" resource
let books = [
  { id: 1, title: 'Clean Code', author: 'Robert C. Martin', year: 2008 },
  { id: 2, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', year: 1999 },
];
let nextId = 3;

function validate(body, partial = false) {
  const errors = [];
  const { title, author, year } = body || {};
  if (!partial || title !== undefined)
    if (typeof title !== 'string' || !title.trim()) errors.push('title must be a non-empty string');
  if (!partial || author !== undefined)
    if (typeof author !== 'string' || !author.trim()) errors.push('author must be a non-empty string');
  if (year !== undefined && !Number.isInteger(year)) errors.push('year must be an integer');
  return errors;
}

// GET all
app.get('/api/books', (req, res) => {
  res.status(200).json(books);
});

// GET one
app.get('/api/books/:id', (req, res) => {
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.status(200).json(book);
});

// POST create
app.post('/api/books', (req, res) => {
  const errors = validate(req.body);
  if (errors.length) return res.status(400).json({ errors });
  const { title, author, year } = req.body;
  const book = { id: nextId++, title: title.trim(), author: author.trim(), year };
  books.push(book);
  res.status(201).location(`/api/books/${book.id}`).json(book);
});

// PUT update (full replace of title/author/year)
app.put('/api/books/:id', (req, res) => {
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: 'Book not found' });
  const errors = validate(req.body);
  if (errors.length) return res.status(400).json({ errors });
  const { title, author, year } = req.body;
  book.title = title.trim();
  book.author = author.trim();
  book.year = year;
  res.status(200).json(book);
});

// DELETE
app.delete('/api/books/:id', (req, res) => {
  const idx = books.findIndex((b) => b.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Book not found' });
  const [removed] = books.splice(idx, 1);
  res.status(200).json({ message: 'Book deleted', book: removed });
});

// Unknown API routes -> JSON 404
app.use('/api', (req, res) => res.status(404).json({ error: 'Route not found' }));

// Malformed JSON and other errors -> JSON
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON body' });
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
