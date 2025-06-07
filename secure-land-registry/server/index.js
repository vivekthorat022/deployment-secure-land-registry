const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // ✅ Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Configuration — allows requests from your deployed frontend
app.use(cors({
  origin: "https://land-registry-frontend.onrender.com",
  credentials: true,
}));

// ✅ Middleware to parse JSON and URL-encoded data
app.use(express.json({ limit: '10mb' })); // Increased JSON body limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Handle URL-encoded data too

// ✅ Connect to MongoDB Atlas using .env variable
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB Connected to Atlas');
}).catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
});

// ✅ Routes
app.use('/api', require('./routes/authRoutes'));
app.use('/api/lands', require('./routes/landRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/messages', require('./routes/chatRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

// ✅ Default route for root
app.get("/", (req, res) => {
  res.send("✅ Secure Land Registry Backend is Running!");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
