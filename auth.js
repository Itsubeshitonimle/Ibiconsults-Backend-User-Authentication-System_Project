// ====== CORE AUTHENTACTION ======
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 10;

// In-memory user database (replace with real DB in production)
const users = [];

/**
 * Register a new user
 * @param {string} username - User's username
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {object} - Registered user object or error
 */
async function register(username, email, password) {
  try {
    // Validate input
    if (!username || !email || !password) {
      throw new Error('Username, email, and password are required');
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create new user
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Login user and generate JWT token
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {object} - Token and user info or error
 */
async function login(email, password) {
  try {
    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return token and user info
    const { password: _, ...userWithoutPassword } = user;
    return { 
      success: true, 
      token, 
      user: userWithoutPassword 
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {object} - Decoded token or error
 */
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Middleware to verify token from request headers
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const verification = verifyToken(token);
  if (!verification.success) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  req.user = verification.data;
  next();
}

module.exports = {
  register,
  login,
  verifyToken,
  authenticateToken,
  users // For testing purposes only
};
