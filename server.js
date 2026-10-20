const express = require("express");

const app = express();
app.use(express.json());

let records = [
  { id: 1, name: "Tamil", course: "BCA" }
];
let nextId = 2;

app.get("/", (req, res) => {
  res.json({ message: "REST API is working!" });
});

app.get("/api/records", (req, res) => {
  res.status(200).json(records);
});

app.get("/api/records/:id", (req, res) => {
  const record = records.find(
    item => item.id === Number(req.params.id)
  );

  if (!record) {
    return res.status(404).json({ error: "Record not found" });
  }

  res.json(record);
});

app.post("/api/records", (req, res) => {
  const { name, course } = req.body;

  if (typeof name !== "string" || !name.trim() ||
      typeof course !== "string" || !course.trim()) {
    return res.status(400).json({
      error: "Name and course are required"
    });
  }

  const record = {
    id: nextId++,
    name: name.trim(),
    course: course.trim()
  };

  records.push(record);
  res.status(201).json(record);
});

app.put("/api/records/:id", (req, res) => {
  const record = records.find(
    item => item.id === Number(req.params.id)
  );

  if (!record) {
    return res.status(404).json({ error: "Record not found" });
  }

  const { name, course } = req.body;

  if (typeof name !== "string" || !name.trim() ||
      typeof course !== "string" || !course.trim()) {
    return res.status(400).json({
      error: "Name and course are required"
    });
  }

  record.name = name.trim();
  record.course = course.trim();
  res.json(record);
});

app.delete("/api/records/:id", (req, res) => {
  const index = records.findIndex(
    item => item.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({ error: "Record not found" });
  }

  const deleted = records.splice(index, 1)[0];
  res.json({ message: "Record deleted", record: deleted });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
