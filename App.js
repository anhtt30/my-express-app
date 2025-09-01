const express = require('express');
const Database = require('better-sqlite3');
const Question = require("./models/piModels/Question");
const app = express();
const PORT = 4000;

// Middleware to parse JSON
app.use(express.json());

// --- Connect to SQLite database ---
const db = new Database("./exam.db");

// Sample route
app.get('/api/hello', (req, res) => {
    // response with json 123 sdfdsfdsfdsfsddsfsdfsdf
  res.json({ message: 'Hello from Express123!' });
});

// Get all questions
app.get("/api/questions", (req, res) => {
  const itemsPerPage = 20;
  const questions = Question.all(req.query.page ?? 1, itemsPerPage, req.query.searchParam);
  if (!questions) return res.status(500).json({ error: "Failed to retrieve questions" });
  const count = Question.count(req.query.searchParam);
  if (count === undefined) return res.status(500).json({ error: "Failed to count questions" });
  res.json({
          data: questions,
          totalPage: Math.ceil(count / itemsPerPage)
        });
});

// Get one question
app.get("/api/questions/:id", (req, res) => {
  const question = Question.find(req.params.id);
  if (!question) return res.status(404).json({ error: "Not found" });
  res.json(question);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});