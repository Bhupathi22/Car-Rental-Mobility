require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');
const { seedInitialData } = require('./utils/seedData');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Auto-seed sample users and fleet if empty
    await seedInitialData();

    const server = app.listen(PORT, () => {
      console.log(`\n========================================================`);
      console.log(`🚀 CAR RENTAL & MOBILITY Backend Server Running`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`📖 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`🩺 Health Endpoint: http://localhost:${PORT}/api/health`);
      console.log(`========================================================\n`);
    });

    const shutdown = async () => {
      console.log('\nGracefully shutting down server...');
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err) {
    console.error('Fatal Server Startup Error:', err.message);
    process.exit(1);
  }
};

startServer();
