import express from 'express';
import cors from 'cors';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool, { initDb } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Login Route
app.post('/api/auth/google-login', async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    // Generate our own JWT for session management
    const token = jwt.sign(
      { sub: payload.sub, email: payload.email, name: payload.name, role: 'Operator' },
      process.env.JWT_SECRET || 'transitops_secret_key_123',
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token, 
      user: { 
        name: payload.name, 
        email: payload.email, 
        picture: payload.picture,
        role: 'Operator' 
      } 
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ error: "Invalid authentication token" });
  }
});

// Basic test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TransitOps Backend API is running!' });
});

// Placeholder for future routes (e.g. vehicles, trips, maintenance)
app.get('/api/vehicles', (req, res) => {
  res.json([
    { id: 'UNIT_982-A', segment: 'LONG_HAUL', status: 'Available' },
    { id: 'UNIT_104-E', segment: 'CITY_GRID', status: 'Available' },
    { id: 'UNIT_552-C', segment: 'HEAVY_LOAD', status: 'Retired' }
  ]);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
