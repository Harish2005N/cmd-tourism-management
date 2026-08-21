const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
    try {
        let uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        
        if (!uri) {
            console.log('⚠️  No MongoDB URI found. Falling back to in-memory database...');
        } else {
            try {
                await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
                console.log('✅ Connected to MongoDB');
                return;
            } catch (err) {
                console.log('⚠️  Could not connect to provided MongoDB URI. Falling back to in-memory database...');
            }
        }

        // Fallback: Start MongoMemoryServer
        if (!mongod) {
            mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
        }

        await mongoose.connect(uri);
        console.log('✅ Connected to in-memory MongoDB');
        console.log(`🔗 URI: ${uri}`);
    } catch (err) {
        console.error('❌ Database connection failed:', err);
        process.exit(1);
    }
};

const closeDB = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongod) {
        await mongod.stop();
    }
};

module.exports = { connectDB, closeDB };
