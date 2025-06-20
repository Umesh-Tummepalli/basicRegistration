import { MongoClient, ObjectId } from 'mongodb';
import express from 'express'
import multer from "multer"
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();

// JWT Secret Key (in production, use environment variable)
const JWT_SECRET = 'your-secret-key-change-this-in-production';

// Middleware
app.use(express.json());
app.use(cors());
const upload = multer();

// MongoDB Connection
const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'clothingApp';
const USERS_COLLECTION = 'users';

let db;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// JWT Middleware for protected routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Initialize MongoDB connection
connectToMongoDB();

// ROUTES

// 1. User Registration
app.post('/api/register', upload.none(), async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Basic validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ 
        error: 'Full name, email, and password are required' 
      });
    }

    // Check if user already exists
    const existingUser = await db.collection(USERS_COLLECTION).findOne({ 
      email: email.toLowerCase() 
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create user document
    const newUser = {
      fullName: fullName.trim(),
      email: email.toLowerCase(),
      password: password, // Storing plain password (not recommended for production)
      createdAt: new Date(),
      profileCompleted: false,
      // Initialize empty profile data
      profile: {
        gender: '',
        dateOfBirth: '',
        stylePreferences: [],
        preferredBrands: [],
        shirtSize: '',
        pantSize: '',
        shoeSize: '',
        phoneNumber: '',
        country: '',
        language: '',
        newsletter: false
      }
    };

    // Insert user into database
    const result = await db.collection(USERS_COLLECTION).insertOne(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: result.insertedId,
        email: newUser.email 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token: token,
      user: {
        _id: result.insertedId,
        fullName: newUser.fullName,
        email: newUser.email,
        createdAt: newUser.createdAt,
        profileCompleted: newUser.profileCompleted
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// 2. User Login
app.post('/api/login', upload.none(), async (req, res) => {
  console.log("request from client")
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Find user in database
    const user = await db.collection(USERS_COLLECTION).findOne({ 
      email: email.toLowerCase() 
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Simple password check (plain text comparison)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Update last login
    await db.collection(USERS_COLLECTION).updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (excluding password)
    const { password: _, ...userResponse } = user;

    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// 3. Get Products from DummyJSON API
app.get('/api/products',authenticateToken, async (req, res) => {
  try {
    const response = await fetch('https://dummyjson.com/products');
    const products = await response.json();
    
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// 4. Update User Profile (Protected Route)
app.patch('/api/user/:userId/profile', authenticateToken, upload.none(), async (req, res) => {
  try {
    const { userId } = req.params;
    const profileData = req.body;

    // Validate ObjectId
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Check if the authenticated user is updating their own profile
    if (req.user.userId.toString() !== userId) {
      return res.status(403).json({ error: 'You can only update your own profile' });
    }

    // Build update object for profile
    const updateData = {
      profileCompleted: true,
      updatedAt: new Date()
    };

    // Update profile fields
    if (profileData.gender) updateData['profile.gender'] = profileData.gender;
    if (profileData.dateOfBirth) updateData['profile.dateOfBirth'] = profileData.dateOfBirth;
    if (profileData.stylePreferences) {
      updateData['profile.stylePreferences'] = typeof profileData.stylePreferences === 'string' 
        ? JSON.parse(profileData.stylePreferences) 
        : profileData.stylePreferences;
    }
    if (profileData.preferredBrands) {
      updateData['profile.preferredBrands'] = typeof profileData.preferredBrands === 'string' 
        ? JSON.parse(profileData.preferredBrands) 
        : profileData.preferredBrands;
    }
    if (profileData.shirtSize) updateData['profile.shirtSize'] = profileData.shirtSize;
    if (profileData.pantSize) updateData['profile.pantSize'] = profileData.pantSize;
    if (profileData.shoeSize) updateData['profile.shoeSize'] = profileData.shoeSize;
    if (profileData.phoneNumber) updateData['profile.phoneNumber'] = profileData.phoneNumber;
    if (profileData.country) updateData['profile.country'] = profileData.country;
    if (profileData.language) updateData['profile.language'] = profileData.language;
    if (profileData.newsletter !== undefined) updateData['profile.newsletter'] = profileData.newsletter;

    // Update user profile
    const result = await db.collection(USERS_COLLECTION).updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get updated user data
    const updatedUser = await db.collection(USERS_COLLECTION).findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    );

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error during profile update' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});