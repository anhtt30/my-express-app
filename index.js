const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 4000;

// Middleware to parse JSON
app.use(express.json());

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
    // response with json 123
  res.json({ message: 'Hello from Express123!' });
});

// Sample route
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});