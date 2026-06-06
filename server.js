// ====== SERVER ENDPOINTS ======
const express = require('express');
const auth = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes

/**
 * POST /register
 * Register a new user
 */
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  const result = await auth.register(username, email, password);

  if (result.success) {
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: result.user
    });
  } else {
    res.status(400).json({
      success: false,
      error: result.error
    });
  }
});

/**
 * POST /login
 * Login user and get JWT token
 */
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const result = await auth.login(email, password);

  if (result.success) {
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: result.token,
      user: result.user
    });
  } else {
    res.status(401).json({
      success: false,
      error: result.error
    });
  }
});

/**
 * GET /profile
 * Get current user profile (protected route)
 */
app.get('/profile', auth.authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Profile retrieved',
    user: req.user
  });
});

/**
 * POST /logout
 * Logout user (token invalidation handled client-side)
 */
app.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Authentication server running on port ${PORT}`);
});

module.exports = app;
