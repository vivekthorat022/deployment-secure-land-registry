const express = require('express');
const router = express.Router();
const Land = require('../models/Land');

// =========================
// @route   POST /api/lands
// @desc    Submit land listing (pending admin approval)
// @access  Public
// =========================
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      title,
      description,
      type,
      location,
      availableFor,
      images,
      contactName,
      contactPhone,
      contactEmail,
      price,
      size
    } = req.body;

    // Validate required fields
    if (
      !userId || !title || !description || !type ||
      !location?.state || !location?.district || !location?.city || !location?.pincode ||
      !availableFor || !price || !size ||
      !contactName || !contactPhone || !contactEmail
    ) {
      return res.status(400).json({ error: 'Please fill all required fields correctly' });
    }

    // Validate base64 images if provided
    const validImages = Array.isArray(images) ? images.filter(img => /^data:image\/(jpeg|png|jpg);base64,/.test(img)) : [];

    const newLand = new Land({
      user: userId,
      title,
      description,
      type,
      location,
      availableFor: Array.isArray(availableFor) ? availableFor : [availableFor],
      images: validImages,
      contactName,
      contactPhone,
      contactEmail,
      price,
      size,
      isApproved: false // Always false initially
    });

    await newLand.save();
    res.status(201).json({ message: '✅ Land listing submitted. Awaiting admin approval.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Server error while submitting land listing' });
  }
});

// =========================
// @route   GET /api/lands
// @desc    Fetch all approved land listings
// @access  Public
// =========================
router.get('/', async (req, res) => {
  try {
    const lands = await Land.find({ isApproved: true }).populate("user");
    res.status(200).json(lands);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Server error while fetching land listings' });
  }
});

// GET /api/lands/approved
router.get('/approved', async (req, res) => {
  try {
    const approvedLands = await Land.find({ isApproved: true }).populate("user");
    res.status(200).json(approvedLands);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Failed to fetch approved lands' });
  }
});

// =========================
// @route   GET /api/lands/:id
// @desc    Get details of a specific land
// @access  Public
// =========================
router.get('/:id', async (req, res) => {
  try {
    const land = await Land.findById(req.params.id).populate("user");
    if (!land) return res.status(404).json({ error: "❌ Land not found" });
    res.status(200).json(land);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Server error while fetching land details" });
  }
});

module.exports = router;
