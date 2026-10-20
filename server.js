const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10kb" }));

// Connect to PostgreSQL using Render's DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false
});

// Create the books table if it does not exist
const initializeDatabase = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      author VARCHAR(150) NOT NULL,
      year INTEGER NOT NULL CHECK (year BETWEEN 1 AND 9999)
    )
  `);
};

// Serve the frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// GET all books
app.get("/api/books", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM books ORDER BY id"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch books" });
  }
});

// GET one book
app.get("/api/books/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM books WHERE id = $1",
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch book" });
  }
});

// Validate book details
function validBook(body) {
  return (
    typeof body.title === "string" &&
    body.title.trim().length > 0 &&
    body.title.trim().length <= 200 &&
    typeof body.author === "string" &&
    body.author.trim().length > 0 &&
    body.author.trim().length <= 150 &&
    String(body.year ?? "").trim() !== "" &&
    Number.isInteger(Number(body.year)) &&
    Number(body.year) >= 1 &&
    Number(body.year) <= 9999
  );
}

// POST a new book
app.post("/api/books", async (req, res) => {
  if (!validBook(req.body)) {
    return res.status(400).json({
      error: "Enter a valid title, author and year"
    });
  }

  try {
    const { title, author, year } = req.body;
    const result = await pool.query(
      `INSERT INTO books (title, author, year)
       VALUES ($1, $2, $3) RETURNING *`,
      [title.trim(), author.trim(), Number(year)]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to add book" });
  }
});

// PUT: update a book
app.put("/api/books/:id", async (req, res) => {
  if (!validBook(req.body)) {
    return res.status(400).json({
      error: "Enter a valid title, author and year"
    });
  }

  try {
    const { title, author, year } = req.body;
    const result = await pool.query(
      `UPDATE books
       SET title = $1, author = $2, year = $3
       WHERE id = $4 RETURNING *`,
      [title.trim(), author.trim(), Number(year), req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to update book" });
  }
});

// DELETE a book
app.delete("/api/books/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM books WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({
      message: "Book deleted successfully",
      book: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to delete book" });
  }
});

// Unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

async function startServer() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL environment variable is missing");
    process.exit(1);
  }

  try {
    await initializeDatabase();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Books API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
}

startServer();
