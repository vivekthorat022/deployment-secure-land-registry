const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const setupSocket = require('./socket');
const chatRoutes = require('./routes/chatRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/landRegistryDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB Connected');
}).catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
});

app.use('/api/chats', chatRoutes);
app.use('/api/messages', chatRoutes);
app.use('/api', require('./routes/authRoutes'));
app.use('/api/lands', require('./routes/landRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

app.get("/", (req, res) => {
  res.send("Secure Land Registry Backend is Running!");
});

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Single socket setup
setupSocket(io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
