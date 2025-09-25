import express from 'express';
import cors from 'cors'; // <-- ADDED: The crucial CORS middleware
import 'dotenv/config';  // <-- IMPROVED: Cleaner way to load .env
import authRoutes from './routes/auth.js';
import clientRoutes from './routes/clients.js';


// --- Core Application Setup ---
const app = express();
const PORT = process.env.PORT || 5000; // <-- IMPROVED: Changed default to 5000


// --- Global Middleware ---

// CRITICAL: Enable Cross-Origin Resource Sharing (CORS).
// This allows your frontend to make API requests to this backend.
app.use(cors());

// Enable the Express JSON body parser. This is necessary to read the
// data from your frontend's login/register forms.
app.use(express.json());

// --- API Routes ---

// Use the authentication router for any requests that start with '/api/auth'
app.use('/api/auth', authRoutes);

// Use the new router for any requests to /api/clients
app.use('/api/clients', clientRoutes);

// --- Server Startup ---
app.listen(PORT, () => {
  console.log(`✅ Server is running successfully on port ${PORT}`);
});

