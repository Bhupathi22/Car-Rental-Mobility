const dns = require('dns');

// Fix Node.js DNS resolution issue for MongoDB Atlas SRV connection
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    // If MongoDB Atlas URL is missing or still contains placeholder text,
    // use MongoDB Memory Server as a local fallback.
    if (
      !mongoUri ||
      mongoUri.trim() === '' ||
      mongoUri.includes('YOUR_')
    ) {
      console.log('\n============================================================');
      console.log('⚠️  [MONGODB NOTICE] MONGODB_URI is missing or not configured in backend/.env');
      console.log('💡 To connect to MongoDB Atlas, add your connection string to backend/.env');
      console.log('   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/car_rental_mobility');
      console.log('💡 Initializing resilient high-performance local MongoDB instance for seamless academic demo...\n');
      console.log('============================================================\n');

      const { MongoMemoryServer } = require('mongodb-memory-server');

      mongodInstance = await MongoMemoryServer.create();
      mongoUri = mongodInstance.getUri();
    }

    // Connect to MongoDB
    const conn = await mongoose.connect(mongoUri, {
      autoIndex: true,
    });

    console.log(
      `✅ MongoDB Connected Successfully to host: ${conn.connection.host}`
    );

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();

    if (mongodInstance) {
      await mongodInstance.stop();
      mongodInstance = null;
    }

    console.log('MongoDB disconnected successfully.');
  } catch (err) {
    console.error('Error disconnecting MongoDB:', err);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};