const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');
const routes = require('./routes');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Allow cross-origin images/uploads
    contentSecurityPolicy: false, // Allow inline styles and MapLibre assets
  })
);

// Enable CORS
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Request parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// General API Rate Limiting
app.use('/api', apiLimiter);

// Main API Route Registry
app.use('/api', routes);

// Serve Frontend Static Dist Assets (Unified Single Localhost)
const frontendDist = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));

  // SPA Catch-all: Route all other requests to React index.html
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // Fallback info if frontend is not built
  app.get('/', (req, res) => {
    res.json({
      project: 'CAR RENTAL & MOBILITY',
      tagline: 'Move Freely. Travel Smarter.',
      status: 'Active',
      version: '1.0.0',
      documentation: '/api-docs',
      health: '/api/health',
    });
  });
}

// Centralized Error Middleware
app.use(errorHandler);

module.exports = app;
