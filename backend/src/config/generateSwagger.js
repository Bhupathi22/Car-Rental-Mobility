const fs = require('fs');
const path = require('path');

const outputFile = path.join(__dirname, 'swagger-output.json');

const doc = {
    openapi: '3.0.0',

    info: {
        title: 'CAR RENTAL & MOBILITY API',
        version: '1.0.0',
        description:
            'REST API documentation for the CAR RENTAL & MOBILITY platform.',
    },

    servers: [
        {
            url: 'http://localhost:5000',
            description: 'Local Development Server',
        },
    ],

    tags: [
        {
            name: 'Health',
            description: 'API health and system status',
        },
        {
            name: 'Authentication',
            description: 'User registration and authentication',
        },
        {
            name: 'Cars',
            description: 'Vehicle management and vehicle information',
        },
        {
            name: 'Bookings',
            description: 'Car rental booking operations',
        },
        {
            name: 'Payments',
            description: 'Payment operations',
        },
        {
            name: 'Tracking',
            description: 'Vehicle tracking and location operations',
        },
        {
            name: 'Recommendations',
            description: 'Vehicle recommendation operations',
        },
        {
            name: 'Reviews',
            description: 'Customer review operations',
        },
        {
            name: 'Admin',
            description: 'Administrative operations',
        },
    ],

    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },

        schemas: {
            GenericRequest: {
                type: 'object',
                additionalProperties: true,
            },

            GenericResponse: {
                type: 'object',
                additionalProperties: true,
            },
        },
    },

    paths: {
        // =========================
        // HEALTH
        // =========================
        '/api/health': {
            get: {
                tags: ['Health'],
                summary: 'Check API health',
                responses: {
                    200: {
                        description: 'API is healthy',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: {
                                            type: 'string',
                                            example: 'OK',
                                        },
                                        service: {
                                            type: 'string',
                                            example: 'Car Rental & Mobility',
                                        },
                                        timestamp: {
                                            type: 'string',
                                            example: '2026-09-29T16:18:25.841Z',
                                        },
                                        uptime: {
                                            type: 'number',
                                            example: 100.5,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },

        // =========================
        // AUTHENTICATION
        // =========================
        '/api/auth/register': {
            post: {
                tags: ['Authentication'],
                summary: 'Register a new user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/GenericRequest',
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'User registered successfully',
                    },
                    400: {
                        description: 'Invalid registration data',
                    },
                },
            },
        },

        '/api/auth/login': {
            post: {
                tags: ['Authentication'],
                summary: 'Login user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/GenericRequest',
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Login successful',
                    },
                    401: {
                        description: 'Invalid credentials',
                    },
                },
            },
        },

        '/api/auth/me': {
            get: {
                tags: ['Authentication'],
                summary: 'Get current user',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Current user details',
                    },
                    401: {
                        description: 'Authentication required',
                    },
                },
            },

            put: {
                tags: ['Authentication'],
                summary: 'Update current user',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/GenericRequest',
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'User updated successfully',
                    },
                    401: {
                        description: 'Authentication required',
                    },
                },
            },
        },

        // =========================
        // CARS
        // =========================
        '/api/cars': {
            get: {
                tags: ['Cars'],
                summary: 'Get all cars',
                responses: {
                    200: {
                        description: 'List of cars',
                    },
                },
            },

            post: {
                tags: ['Cars'],
                summary: 'Create a new car',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/GenericRequest',
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Car created successfully',
                    },
                    400: {
                        description: 'Invalid car data',
                    },
                },
            },
        },

        '/api/cars/{id}': {
            get: {
                tags: ['Cars'],
                summary: 'Get car by ID',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'Car details',
                    },
                    404: {
                        description: 'Car not found',
                    },
                },
            },

            put: {
                tags: ['Cars'],
                summary: 'Update car',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/GenericRequest',
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Car updated successfully',
                    },
                },
            },

            delete: {
                tags: ['Cars'],
                summary: 'Delete car',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'Car deleted successfully',
                    },
                },
            },
        },

        '/api/cars/{id}/availability': {
            patch: {
                tags: ['Cars'],
                summary: 'Update car availability',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                requestBody: {
                    required: false,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/GenericRequest',
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Availability updated',
                    },
                },
            },
        },

        // =========================
        // BOOKINGS
        // =========================
        '/api/bookings/verify/{identifier}': {
            get: {
                tags: ['Bookings'],
                summary: 'Verify booking',
                parameters: [
                    {
                        name: 'identifier',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'Booking verification result',
                    },
                    404: {
                        description: 'Booking not found',
                    },
                },
            },
        },

        '/api/bookings': {
            post: {
                tags: ['Bookings'],
                summary: 'Create booking',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/GenericRequest',
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Booking created successfully',
                    },
                    400: {
                        description: 'Invalid booking data',
                    },
                },
            },

            get: {
                tags: ['Bookings'],
                summary: 'Get all bookings',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'List of bookings',
                    },
                },
            },
        },

        '/api/bookings/my': {
            get: {
                tags: ['Bookings'],
                summary: 'Get current user bookings',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'User bookings',
                    },
                },
            },
        },

        '/api/bookings/{id}': {
            get: {
                tags: ['Bookings'],
                summary: 'Get booking by ID',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'Booking details',
                    },
                },
            },
        },

        '/api/bookings/{id}/cancel': {
            patch: {
                tags: ['Bookings'],
                summary: 'Cancel booking',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'Booking cancelled successfully',
                    },
                },
            },
        },

        // =========================
        // PAYMENTS
        // =========================
        '/api/payments': {
            post: {
                tags: ['Payments'],
                summary: 'Create payment',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/GenericRequest',
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Payment created successfully',
                    },
                },
            },

            get: {
                tags: ['Payments'],
                summary: 'Get all payments',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'List of payments',
                    },
                },
            },
        },

        '/api/payments/booking/{bookingId}': {
            get: {
                tags: ['Payments'],
                summary: 'Get payment by booking',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'bookingId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'Payment details',
                    },
                },
            },
        },

        // =========================
        // TRACKING
        // =========================
        '/api/tracking/{bookingId}': {
            get: {
                tags: ['Tracking'],
                summary: 'Get vehicle tracking information',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'bookingId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'Tracking information',
                    },
                },
            },
        },

        '/api/tracking/{bookingId}/simulate': {
            patch: {
                tags: ['Tracking'],
                summary: 'Simulate tracking update',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'bookingId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                requestBody: {
                    required: false,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/GenericRequest',
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Tracking updated',
                    },
                },
            },
        },

        // =========================
        // RECOMMENDATIONS
        // =========================
        '/api/recommendations': {
            get: {
                tags: ['Recommendations'],
                summary: 'Get vehicle recommendations',
                responses: {
                    200: {
                        description: 'Vehicle recommendations',
                    },
                },
            },
        },

        // =========================
        // REVIEWS
        // =========================
        '/api/reviews/{carId}': {
            get: {
                tags: ['Reviews'],
                summary: 'Get reviews for a car',
                parameters: [
                    {
                        name: 'carId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'Car reviews',
                    },
                },
            },
        },

        '/api/reviews': {
            post: {
                tags: ['Reviews'],
                summary: 'Create a car review',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/GenericRequest',
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Review created successfully',
                    },
                },
            },
        },

        // =========================
        // ADMIN
        // =========================
        '/api/admin/dashboard': {
            get: {
                tags: ['Admin'],
                summary: 'Get admin dashboard',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Admin dashboard data',
                    },
                    403: {
                        description: 'Admin access required',
                    },
                },
            },
        },

        '/api/admin/customers': {
            get: {
                tags: ['Admin'],
                summary: 'Get customers',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Customer list',
                    },
                    403: {
                        description: 'Admin access required',
                    },
                },
            },
        },
    },
};

fs.writeFileSync(outputFile, JSON.stringify(doc, null, 2), 'utf8');

console.log('');
console.log('==============================================');
console.log('SWAGGER DOCUMENTATION GENERATED SUCCESSFULLY');
console.log('==============================================');
console.log(`Output: ${outputFile}`);
console.log(`Total documented paths: ${Object.keys(doc.paths).length}`);