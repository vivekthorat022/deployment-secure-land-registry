const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// @route   POST /api/messages
// @desc    Send a message
// @access  Public (but ideally should be protected)
router.post('/', async (req, res) => {
  try {
    const { sender, receiver, land, content } = req.body;

    if (!sender || !receiver || !land || !content) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newMessage = new Message({
      sender,
      receiver,
      land,
      content
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while sending message' });
  }
});

// @route   GET /api/messages/:landId/:user1Id/:user2Id
// @desc    Fetch all messages between two users about a land
// @access  Public (but ideally should be protected)
router.get('/:landId/:user1Id/:user2Id', async (req, res) => {
  try {
    const { landId, user1Id, user2Id } = req.params;

    const messages = await Message.find({
      land: landId,
      $or: [
        { sender: user1Id, receiver: user2Id },
        { sender: user2Id, receiver: user1Id }
      ]
    }).sort({ createdAt: 1 }); // Sort oldest to newest

    res.status(200).json(messages);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while fetching messages' });
  }
});

module.exports = router;
