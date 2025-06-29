const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/register
router.post('/register', async (req, res) => {
    try {
        const { email, password, confirmPassword, fullName } = req.body;


        if (!email || !password || !confirmPassword)
            return res.status(400).json({ error: 'Please fill all fields' });

        if (password !== confirmPassword)
            return res.status(400).json({ error: 'Passwords do not match' });

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(409).json({ error: 'Email already registered' });

        const newUser = new User({
            email,
            password,
            fullName,
            isApproved: false
        });

        await newUser.save();
        res.status(201).json({
            message: 'User registered. Awaiting admin approval.',
            userId: newUser._id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ error: 'Please provide email and password' });

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not registered' });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: 'User credentials do not match, try again' });
        }

        // if (!user.isApproved) {
        //     return res.status(403).json({ error: 'User not approved by admin yet' });
        // }

        res.status(200).json({
            message: 'Login successful',
            userId: user._id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ GET /api/profile/:userId
router.get('/profile/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const { fullName, email, phone, isApproved, walletAddress, state, city, pincode } = user;
        res.status(200).json({ fullName, email, phone, isApproved, walletAddress, state, city, pincode });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ PUT /api/profile/:userId
router.put('/profile/:userId', async (req, res) => {
    try {
        const updates = (({
            phone,
            walletAddress,
            state,
            city,
            pincode
        }) => ({ phone, walletAddress, state, city, pincode }))(req.body);

        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $set: updates },
            { new: true }
        );

        if (!user) return res.status(404).json({ error: 'User not found' });

        const { fullName, email, isApproved } = user;
        res.status(200).json({ fullName, email, ...updates, isApproved });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/admin/approve/:userId
router.put('/admin/approve/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.isApproved = true;
        await user.save();

        res.status(200).json({ message: 'User approved successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
