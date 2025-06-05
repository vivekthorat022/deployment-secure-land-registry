const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Land = require('../models/Land');
const User = require('../models/User');

// =========================
// @route   POST /api/transactions
// @desc    Initiate land transaction
// =========================
router.post('/', async (req, res) => {
  try {
    const { landId, buyerId, agreedPrice } = req.body;

    if (!landId || !buyerId || !agreedPrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const land = await Land.findById(landId).populate('user');
    if (!land) return res.status(404).json({ error: 'Land not found' });
    if (!land.isApproved) return res.status(403).json({ error: 'Land not approved' });

    const transaction = new Transaction({
      land: landId,
      buyer: buyerId,
      seller: land.user._id,
      agreedPrice,
      status: 'initiated'
    });

    await transaction.save();

    res.status(201).json({ message: 'Transaction initiated', transactionId: transaction._id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while initiating transaction' });
  }
});

// =========================
// @route   POST /api/transactions/finalize
// @desc    Finalize transaction after blockchain confirmation
// =========================
router.post('/finalize', async (req, res) => {
  try {
    const {
      transactionId,
      transactionHash,
      blockHash
    } = req.body;

    if (!transactionId || !transactionHash || !blockHash) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updated = await Transaction.findByIdAndUpdate(
      transactionId,
      {
        transactionHash,
        blockHash,
        status: 'completed'
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json({ message: 'Transaction finalized', transaction: updated });
  } catch (err) {
    console.error('Transaction finalize error:', err);
    res.status(500).json({ error: 'Server error while finalizing transaction' });
  }
});

// =========================
// @route   GET /api/transactions/:userId
// @desc    Get all transactions for a user
// =========================
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const transactions = await Transaction.find({
      $or: [{ buyer: userId }, { seller: userId }]
    })
      .populate('land')
      .populate('buyer', 'fullName email')
      .populate('seller', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json(transactions);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router;
