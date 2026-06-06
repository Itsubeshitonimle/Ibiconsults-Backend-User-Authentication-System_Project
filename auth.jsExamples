/**
 * Authentication Usage Examples
 * 
 * This file demonstrates how to use the backend authentication system.
 * You can test these endpoints using tools like Postman, cURL, or a frontend application.
 */

// ============================================
// API ENDPOINTS
// ============================================

/*
1. REGISTER A NEW USER
   POST /register
   
   Request Body:
   {
     "username": "john_doe",
     "email": "john@example.com",
     "password": "securePassword123"
   }
   
   Response (201 Created):
   {
     "success": true,
     "message": "User registered successfully",
     "user": {
       "id": 1,
       "username": "john_doe",
       "email": "john@example.com",
       "createdAt": "2026-06-06T10:30:00.000Z"
     }
   }
*/

/*
2. LOGIN USER
   POST /login
   
   Request Body:
   {
     "email": "john@example.com",
     "password": "securePassword123"
   }
   
   Response (200 OK):
   {
     "success": true,
     "message": "Login successful",
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "id": 1,
       "username": "john_doe",
       "email": "john@example.com",
       "createdAt": "2026-06-06T10:30:00.000Z"
     }
   }
*/

/*
3. GET USER PROFILE (Protected Route)
   GET /profile
   
   Headers:
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   Response (200 OK):
   {
     "success": true,
     "message": "Profile retrieved",
     "user": {
       "id": 1,
       "email": "john@example.com",
       "username": "john_doe"
     }
   }
*/

/*
4. LOGOUT
   POST /logout
   
   Headers:
   Authorization: Bearer <token>
   
   Response (200 OK):
   {
     "success": true,
     "message": "Logout successful"
   }
*/

// ============================================
// CURL EXAMPLES
// ============================================

/*
// Register
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'

// Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'

// Get Profile (replace TOKEN with actual token)
curl -X GET http://localhost:3000/profile \
  -H "Authorization: Bearer TOKEN"

// Logout
curl -X POST http://localhost:3000/logout \
  -H "Authorization: Bearer TOKEN"
*/

// ============================================
// JAVASCRIPT FETCH EXAMPLES (Frontend)
// ============================================

// Register function
async function registerUser(username, email, password) {
  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Registration failed:', error);
  }
}

// Login function
async function loginUser(email, password) {
  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    
    // Store token in localStorage
    if (data.success) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  } catch (error) {
    console.error('Login failed:', error);
  }
}

// Get user profile (protected)
async function getUserProfile() {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('http://localhost:3000/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to get profile:', error);
  }
}

// Logout function
async function logoutUser() {
  try {
    const token = localStorage.getItem('authToken');
    
    await fetch('http://localhost:3000/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    console.log('Logout successful');
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

// ============================================
// USAGE IN NODEJS
// ============================================

/*
const auth = require('./auth');

// Register
(async () => {
  const registerResult = await auth.register(
    'john_doe',
    'john@example.com',
    'securePassword123'
  );
  console.log(registerResult);

  // Login
  const loginResult = await auth.login(
    'john@example.com',
    'securePassword123'
  );
  console.log(loginResult);

  // Verify token
  const verification = auth.verifyToken(loginResult.token);
  console.log(verification);
})();
*/

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser
};
