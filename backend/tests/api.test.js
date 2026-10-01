const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Car = require('../src/models/Car');

let mongoServer;
let adminToken;
let customerToken;
let createdCarId;
let createdBookingId;
let createdBookingCode;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create admin
  const admin = await User.create({
    name: 'Admin Test',
    email: 'admin_test@mobility.com',
    password: 'password123',
    role: 'ADMIN',
  });

  // Create customer
  const customer = await User.create({
    name: 'Customer Test',
    email: 'customer_test@mobility.com',
    password: 'password123',
    role: 'CUSTOMER',
  });

  // Login to obtain JWTs
  const adminRes = await request(app).post('/api/auth/login').send({
    email: 'admin_test@mobility.com',
    password: 'password123',
  });
  adminToken = adminRes.body.data.token;

  const customerRes = await request(app).post('/api/auth/login').send({
    email: 'customer_test@mobility.com',
    password: 'password123',
  });
  customerToken = customerRes.body.data.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('CO3 / CO4: Backend API & Auth Engineering Tests', () => {
  // Test 1: Registration
  it('should register a new customer successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        password: 'securepassword123',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('janedoe@example.com');
    expect(res.body.data.token).toBeDefined();
  });

  // Test 2: Login Success
  it('should log in an existing customer with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'customer_test@mobility.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  // Test 3: Invalid Login
  it('should reject login with invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'customer_test@mobility.com',
        password: 'wrong_password_999',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid email or password/i);
  });

  // Test 4: Admin Authorization Check (RBAC)
  it('should deny non-admin users from creating a car', async () => {
    const res = await request(app)
      .post('/api/cars')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        brand: 'Banned Brand',
        model: 'Unauthorized',
        year: 2024,
        vehicleType: 'Sedan',
        fuel: 'Petrol',
        transmission: 'Automatic',
        seats: 5,
        pricePerDay: 100,
        description: 'Should fail',
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  // Test 5: Create Car (Admin)
  it('should allow an admin to create a new vehicle', async () => {
    const res = await request(app)
      .post('/api/cars')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        brand: 'Audi',
        model: 'E-Tron GT',
        year: 2024,
        vehicleType: 'Electric',
        fuel: 'Electric',
        transmission: 'Automatic',
        seats: 4,
        pricePerDay: 250,
        description: 'High performance electric grand tourer',
        features: ['Fast Charging', 'Matrix LED', 'Sport Diff'],
        images: ['https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a'],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.brand).toBe('Audi');
    createdCarId = res.body.data._id;
  });

  // Test 6: Get Cars
  it('should return a list of cars', async () => {
    const res = await request(app).get('/api/cars');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  // Test 7: Update Car (Admin)
  it('should allow an admin to update car specifications', async () => {
    const res = await request(app)
      .put(`/api/cars/${createdCarId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        pricePerDay: 290,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.pricePerDay).toBe(290);
  });

  // Test 8: Invalid Booking Dates (pickup >= return)
  it('should reject booking if pickup date is after return date', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        carId: createdCarId,
        pickupDate: '2026-10-15T10:00:00.000Z',
        returnDate: '2026-10-10T10:00:00.000Z',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/pickup date cannot be after/i);
  });

  // Test 9: Create Booking (Customer)
  it('should create a valid booking and generate unique QR code', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        carId: createdCarId,
        pickupDate: '2026-11-01T10:00:00.000Z',
        returnDate: '2026-11-04T10:00:00.000Z',
        pickupLocation: { name: 'Downtown Hub', latitude: 37.7749, longitude: -122.4194 },
        dropLocation: { name: 'Airport Hub', latitude: 37.6213, longitude: -122.3790 },
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.bookingCode).toBeDefined();
    expect(res.body.data.qrCodeString).toBeDefined();
    expect(res.body.data.numberOfDays).toBe(3);
    createdBookingId = res.body.data._id;
    createdBookingCode = res.body.data.bookingCode;
  });

  // Test 10: Process Payment
  it('should process payment and mark booking as confirmed and paid', async () => {
    const res = await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        bookingId: createdBookingId,
        paymentMethod: 'demo_card',
        cardDetails: { cardNumber: '4242424242424242', expiry: '12/28', cvv: '123' },
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.payment.status).toBe('completed');
    expect(res.body.data.booking.paymentStatus).toBe('paid');
  });

  // Test 11: Booking Verification (QR Scan)
  it('should verify booking successfully when scanned', async () => {
    const res = await request(app).get(`/api/bookings/verify/${createdBookingId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.qrVerificationStatus).toBe(true);
    expect(res.body.message).toMatch(/Booking successfully verified/i);
  });

  // Test 12: Delete Car (Admin)
  it('should allow an admin to delete a vehicle from the fleet', async () => {
    const res = await request(app)
      .delete(`/api/cars/${createdCarId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify it is gone
    const checkRes = await request(app).get(`/api/cars/${createdCarId}`);
    expect(checkRes.statusCode).toBe(404);
  });
});
