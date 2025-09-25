import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js'; // Corrected path to use 'db' from our setup

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  // We now expect email, password, and organizationName from the frontend
  const { email, password, organizationName } = req.body;

  // Simple validation
  if (!email || !password || !organizationName) {
    return res.status(400).json({ message: 'Email, password, and organization name are required.' });
  }

  try {
    // Step 1: Find or Create the Organization
    let orgResult = await db.query('SELECT id FROM organizations WHERE name = $1', [organizationName]);
    let organizationId;

    if (orgResult.rows.length === 0) {
      // It doesn't exist, so create it
      const newOrgResult = await db.query(
        'INSERT INTO organizations (name) VALUES ($1) RETURNING id',
        [organizationName]
      );
      organizationId = newOrgResult.rows[0].id;
    } else {
      // It exists, so use its ID
      organizationId = orgResult.rows[0].id;
    }

    // Step 2: Create the User with the organizationId
    const hashedPassword = await bcrypt.hash(password, 10);
    const userResult = await db.query(
      'INSERT INTO users (email, password, organization_id) VALUES ($1, $2, $3) RETURNING id, email',
      [email, hashedPassword, organizationId]
    );
    const user = userResult.rows[0];
    res.status(201).json({ message: 'User registered successfully', user });

  } catch (error) {
    console.error('Error registering user:', error);
    // Provide a more helpful error for duplicate emails
    if (error.code === '23505') { // PostgreSQL unique violation error code
        return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  // We now expect email instead of username
  const { email, password } = req.body;

  try {
    // Query by email
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create the JWT
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.status(200).json({ message: 'Logged in successfully', token });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

export default router;
