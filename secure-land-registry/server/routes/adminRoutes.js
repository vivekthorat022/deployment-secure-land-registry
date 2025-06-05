const express = require('express');
const router = express.Router();
const Land = require('../models/Land');

// @route   PUT /api/admin/approve-land/:landId
// @desc    Approve land listing
// @access  Admin (no auth here for now)
router.put('/approve-land/:landId', async (req, res) => {
  try {
    const landId = req.params.landId;

    const updatedLand = await Land.findByIdAndUpdate(
      landId,
      { isApproved: true },
      { new: true }
    );

    if (!updatedLand) {
      return res.status(404).json({ error: 'Land not found' });
    }

    res.status(200).json({ message: 'Land listing approved successfully' });
  } catch (error) {
    console.error('Approval Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
