const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      console.error('❌ MONGODB_URI environment variable is not set.');
      console.error('   Set it in your Render dashboard or .env file.');
      process.exit(1);
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log('✅ Connected to MongoDB');
    console.log(`   Database: ${mongoose.connection.name}`);
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
};

const closeDB = async () => {
  await mongoose.connection.close();
};

module.exports = { connectDB, closeDB };
