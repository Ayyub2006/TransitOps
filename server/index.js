import express from 'express';
import cors from 'cors';
<<<<<<< HEAD
import dotenv from 'dotenv';
=======
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool, { initDb } from './db.js';
>>>>>>> d10615fee40ed05b3b69fb53032bd3fe67aeb259

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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
