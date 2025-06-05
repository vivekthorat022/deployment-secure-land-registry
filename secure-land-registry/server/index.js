const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/landRegistryDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB Connected');
}).catch(err => {
  console.log('❌ DB Connection Error:', err);
});

// Routes
app.use('/api', require('./routes/authRoutes'));
app.use('/api/lands', require('./routes/landRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/messages', require('./routes/chatRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
