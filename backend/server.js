// ============================================================
// server.js - Main entry point for the Tourism backend
// ============================================================

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ── Middleware ───────────────────────────────────────────────
app.use(cors());                        // Allow cross-origin requests from React
const { connectDB } = require('./db-setup');
const Tour = require('./models/Tour');
const User = require('./models/User');

const startApp = async () => {
  await connectDB();
  
  // Check if seeding is needed (e.g., if no tours exist)
  const tourCount = await Tour.countDocuments();
  if (tourCount === 0) {
    console.log('🌱 No tours found. Running auto-seed...');
    await User.deleteMany({});
    await User.create({
      name: 'Admin User',
      email: 'admin@tour.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 9999999999',
    });
    console.log('👤 Admin created: admin@tour.com / admin123');
    
    const goldenTri = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
    const kerala = "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
    const thailand = "https://images.unsplash.com/photo-1589181229070-0dc068beeaad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

    const sampleTours = [
      { 
        name: 'Golden Triangle Tour', 
        destination: 'Delhi - Agra - Jaipur', 
        price: 15000, 
        duration: 6, 
        availableSeats: 20,
        description: 'Explore India\'s famous Golden Triangle covering Delhi, Agra with the Taj Mahal, and Jaipur the Pink City.',
        image: `${goldenTri}`,
      },
      { 
        name: 'Kerala Backwaters', 
        destination: 'Alleppey, Kerala', 
        price: 12000, 
        duration: 4, 
        availableSeats: 15,
        description: 'Cruise through serene backwaters on a traditional houseboat.',
        image: `${kerala}`,
      },
      { 
        name: 'Goa Beach Holiday', 
        destination: 'Goa', 
        price: 8000, 
        duration: 3, 
        availableSeats: 30,
        description: 'Relax on beautiful beaches, enjoy water sports, visit old Portuguese churches, and experience vibrant nightlife in sunny Goa.',
        image: `${thailand}`,
      },
      { 
        name: 'Himalayan Adventure', 
        destination: 'Manali, Himachal Pradesh', 
        price: 18000, 
        duration: 7, 
        availableSeats: 12,
        description: 'Thrilling adventure in the Himalayas! Includes trekking, snow activities, Rohtang Pass visit, and camping under the stars.',
        image: `${goldenTri}`,
      },
      { 
        name: 'Rajasthan Desert Safari', 
        destination: 'Jaisalmer, Rajasthan', 
        price: 14000, 
        duration: 5, 
        availableSeats: 18,
        description: 'Experience the magic of the Thar Desert with camel safaris, traditional folk music, desert camping, and the magnificent Jaisalmer Fort.',
        image: `${kerala}`,
      },
      { 
        name: 'Andaman Island Paradise', 
        destination: 'Port Blair & Havelock Island', 
        price: 25000, 
        duration: 5, 
        availableSeats: 10,
        description: 'Discover pristine beaches, crystal-clear waters, and vibrant coral reefs. Includes snorkeling, scuba diving, and a ferry to Havelock Island.',
        image: `${thailand}`,
      },
    ];
    await Tour.insertMany(sampleTours);
    console.log('🗺️  Auto-seeded sample tours');
  }
};

app.use(express.json());

// ── API Routes ───────────────────────────────────────────────
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/tours',    require('./routes/tourRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));

// ── Serve React static files in production ──────────────────
const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
  app.use(express.static(frontendBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

// ── Health check ─────────────────────────────────────────────
app.get('/', (req, res) => res.json({ message: 'Tourism API is running!' }));

// ── Port Retry Function ──────────────────────────────────────
const listenWithRetry = (app, basePort) => {
  const tryPort = (port) => {
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${port}`);
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`⚠️  Port ${port} in use, trying ${port + 1}...`);
        server.close();
        tryPort(port + 1);
      } else {
        console.error('❌ Server error:', err);
        process.exit(1);
      }
    });
  };
  
  tryPort(basePort);
};

// ── Validate required environment variables ──────────────────
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingEnvVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('Please set them in your Render dashboard under Environment.');
  process.exit(1);
}

// ── Start App & Server ───────────────────────────────────────
const PORT = process.env.PORT || 5000;
startApp().then(() => {
  listenWithRetry(app, PORT);
}).catch(console.error);
