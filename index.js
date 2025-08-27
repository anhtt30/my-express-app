const express = require('express');
const sqlite3 = require("sqlite3").verbose();
const mongoose = require('mongoose');
const Question = require("./models/Question");
const app = express();
const PORT = 4000;

// Middleware to parse JSON
app.use(express.json());

// --- Connect to SQLite database ---
const db = new sqlite3.Database("./exam.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/express', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Example schema 123
const UserSchema = new mongoose.Schema({
  name: String,
  age: Number
});

const User = mongoose.model('User', UserSchema);

// Sample route
app.get('/api/hello', (req, res) => {
    // response with json 123 sdfdsfdsfdsfsddsfsdfsdf
  res.json({ message: 'Hello from Express123!' });
});

// Sample route olalasdfs
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Get all questions
app.get("/api/questions", (req, res) => {
  const itemsPerPage = 20;
  Question.all(req.query.page ?? 1, itemsPerPage, req.query.searchParam, (err, questions) => {
    if (err) return res.status(500).json({ error: err.message });
    Question.count(req.query.searchParam, (err, count) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(
        { 
          data: questions,
          totalPage: Math.ceil(count / itemsPerPage)
        }
      );
    });
  });
});

// Get one question
app.get("/api/questions/:id", (req, res) => {
  Question.find(req.params.id, (err, question) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!question) return res.status(404).json({ error: "Not found" });
    res.json(question);
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});