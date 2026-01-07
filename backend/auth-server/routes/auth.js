const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Badge tiers (server-side canonical list)
const BADGE_TIERS = [
  { key: 'quick_spark', threshold: 50 },
  { key: 'skill_surfer', threshold: 100 },
  { key: 'prime_prodigy', threshold: 200 }
];

// Helper: award badges based on current xp for a given user id
const awardBadgesForUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;
    const currentBadges = Array.isArray(user.badges) ? user.badges : [];
    const toAward = BADGE_TIERS.filter(t => (user.xp || 0) >= t.threshold && !currentBadges.includes(t.key)).map(t => t.key);
    if (!toAward.length) return null;

    // Add all missing badges atomically using $addToSet + $each
    const updated = await User.findByIdAndUpdate(userId, { $addToSet: { badges: { $each: toAward } } }, { new: true });
    console.log(`🏅 Awarded badges to ${updated.email}: ${toAward.join(',')}`);
    return updated;
  } catch (err) {
    console.error('awardBadgesForUser error', err);
    return null;
  }
};

// Helper function to check and reset daily word completion
const checkAndResetDailyWord = async (user) => {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  // If completed today, keep the flag
  if (user.dailyWordCompletedDate === today) {
    user.dailyWordCompleted = true;
    await user.save();
    return true;
  }

  // If completed yesterday, keep streak but mark not completed for today
  if (user.dailyWordCompletedDate === yesterday) {
    user.dailyWordCompleted = false;
    // keep dailyWordCompletedDate (yesterday) for streak checks
    await user.save();
    return false;
  }

  // If last completed before yesterday (or null) the streak is broken — reset
  if (user.streak && user.streak !== 0) {
    user.streak = 0;
    console.log(`🔄 Reset streak for user: ${user.email}`);
  }
  user.dailyWordCompleted = false;
  user.dailyWordCompletedDate = null;
  await user.save();
  return false;
};

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    console.log('📝 Signup attempt:', { fullName, email });

    // Validate input
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('⚠️ User already exists:', email);
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = await User.create({
      fullName,
      email,
      password
    });

    console.log('✅ User created successfully:', user.email);

    // Generate token
    const token = generateToken(user._id);

    // Send response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        level: user.level,
        xp: user.xp,
        badges: user.badges,
        streak: user.streak,
        bestStreak: user.bestStreak || 0
      }
    });

  } catch (error) {
    console.error('Signup Error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt for:', email);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user by email (include password for comparison)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('✅ User found:', user.email);

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    
    console.log('🔑 Password correct:', isPasswordCorrect);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Check and reset daily word if it's a new day
    const isDailyWordCompletedToday = await checkAndResetDailyWord(user);

    // Send response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        level: user.level,
        xp: user.xp,
        badges: user.badges,
        streak: user.streak,
        bestStreak: user.bestStreak || 0,
        quizzesTaken: user.quizzesTaken,
        dailyWordCompleted: isDailyWordCompletedToday
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

// @route   GET /api/auth/verify
// @desc    Verify JWT token and get user data
// @access  Protected
router.get('/verify', async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user data
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check and reset daily word if it's a new day
    const isDailyWordCompletedToday = await checkAndResetDailyWord(user);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        level: user.level,
        xp: user.xp,
        badges: user.badges,
        streak: user.streak,
        bestStreak: user.bestStreak || 0,
        quizzesTaken: user.quizzesTaken,
        dailyWordCompleted: isDailyWordCompletedToday
      }
    });

  } catch (error) {
    console.error('Verify Error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message
    });
  }
});

// @route   POST /api/auth/complete-daily
// @desc    Mark daily word as completed
// @access  Protected
router.post('/complete-daily', async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Compute streak and update user accordingly
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    let user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // If already completed today, return current state
    if (user.dailyWordCompletedDate === today) {
      return res.status(200).json({
        success: true,
        message: 'Daily word already completed today',
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          xp: user.xp,
          streak: user.streak,
          bestStreak: user.bestStreak || 0,
          dailyWordCompleted: true
        }
      });
    }

    // Determine new streak: increment if last play was yesterday, otherwise start at 1
    const newStreak = (user.dailyWordCompletedDate === yesterday) ? ((user.streak || 0) + 1) : 1;
    const newBest = Math.max(user.bestStreak || 0, newStreak);

    // Persist update: mark completed today, update streaks and award xp
    user = await User.findByIdAndUpdate(
      decoded.id,
      {
        $set: {
          dailyWordCompleted: true,
          dailyWordCompletedDate: today,
          streak: newStreak,
          bestStreak: newBest
        },
        $inc: { xp: 50 }
      },
      { new: true }
    );

    // Award badges if thresholds hit
    try {
      await awardBadgesForUser(user._id);
    } catch (e) {
      console.warn('Failed to auto-award badges after daily completion', e);
    }

    console.log('✅ Daily word completed for user:', user.email);

    res.status(200).json({
      success: true,
      message: 'Daily word marked as completed',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        xp: user.xp,
        streak: user.streak,
        bestStreak: user.bestStreak || 0,
        dailyWordCompleted: true
      }
    });

  } catch (error) {
    console.error('Complete Daily Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/auth/update-score
// @desc    Update user's xp/score by delta (requires auth)
// @access  Protected
router.post('/update-score', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { delta } = req.body;
    if (typeof delta !== 'number') {
      return res.status(400).json({ success: false, message: 'Invalid delta' });
    }

    // Update xp atomically
    const user = await User.findByIdAndUpdate(
      decoded.id,
      { $inc: { xp: delta } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log(`🔔 Updated score for ${user.email}: delta=${delta}, new xp=${user.xp}`);

    // After xp update, award any badges the user qualifies for
    try {
      await awardBadgesForUser(user._id);
    } catch (e) {
      console.warn('Failed to auto-award badges after score update', e);
    }

    res.status(200).json({ success: true, user: { id: user._id, fullName: user.fullName, email: user.email, xp: user.xp } });
  } catch (error) {
    console.error('Update Score Error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// GET /api/auth/leaderboard
// Returns cached top-5 leaderboard from leaderboard_cache collection
router.get('/leaderboard', async (req, res) => {
  try {
    // Use mongoose connection's db to access leaderboard_cache collection
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    if (!db) {
      // DB not ready yet; return empty entries so client can retry
      return res.status(200).json({ success: true, entries: [] });
    }
    const cache = await db.collection('leaderboard_cache').findOne({ _id: 'top5' });
    let entries = (cache && cache.entries) || [];
    // Ensure ids are plain strings for frontend compatibility
    entries = entries.map(e => ({
      ...e,
      id: (e.id && e.id.toString) ? e.id.toString() : e.id
    }));
    res.status(200).json({ success: true, entries });
  } catch (err) {
    console.error('Leaderboard fetch error', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// @route   POST /api/auth/update-badges
// @desc    Add a badge to the user's badges array (idempotent)
// @access  Protected
router.post('/update-badges', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { badge } = req.body;
    if (!badge || typeof badge !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid badge' });
    }

    // Add badge if not present
    const user = await User.findByIdAndUpdate(
      decoded.id,
      { $addToSet: { badges: badge } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log(`🏅 Badge added for ${user.email}: ${badge}`);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        xp: user.xp,
        badges: user.badges
      }
    });
  } catch (error) {
    console.error('Update Badges Error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
