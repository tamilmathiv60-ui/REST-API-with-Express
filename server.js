const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve the website files
app.use(express.static(__dirname));

// Temporary books collection
let books = [
  { id: 1, title: "Wings of Fire", author: "A. P. J. Abdul Kalam", year: 1999 }
];

let nextId = 2;

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// GET all books
app.get("/api/books", (req, res) => {
  res.status(200).json(books);
});

// GET one book
app.get("/api/books/:id", (req, res) => {
  const book = books.find(b => b.id === Number(req.params.id));

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  res.status(200).json(book);
});

// POST a new book
app.post("/api/books", (req, res) => {
  const { title, author, year } = req.body;

  if (
    typeof title !== "string" || !title.trim() ||
    typeof author !== "string" || !author.trim() ||
    !Number.isInteger(Number(year)) ||
    String(year).trim() === ""
  ) {
    return res.status(400).json({
      error: "Valid title, author and year are required"
    });
  }

  const book = {
    id: nextId++,
    title: title.trim(),
    author: author.trim(),
    year: Number(year)
  };

  books.push(book);
  res.status(201).json(book);
});

// PUT: Update a book
app.put("/api/books/:id", (req, res) => {
  const book = books.find(b => b.id === Number(req.params.id));

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  const { title, author, year } = req.body;

  if (
    typeof title !== "string" || !title.trim() ||
    typeof author !== "string" || !author.trim() ||
    !Number.isInteger(Number(year)) ||
    String(year).trim() === ""
  ) {
    return res.status(400).json({
      error: "Valid title, author and year are required"
    });
  }

  book.title = title.trim();
  book.author = author.trim();
  book.year = Number(year);

  res.status(200).json(book);
});

// DELETE a book
app.delete("/api/books/:id", (req, res) => {
  const index = books.findIndex(
    b => b.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  const deleted = books.splice(index, 1)[0];
  res.status(200).json({
    message: "Book deleted successfully",
    book: deleted
  });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Books API running on port ${PORT}`);
});
