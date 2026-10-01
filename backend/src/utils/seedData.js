const mongoose = require('mongoose');
const User = require('../models/User');
const Car = require('../models/Car');
const Review = require('../models/Review');
const { connectDB } = require('../config/db');
require('dotenv').config();

const initialCars = [
  {
    brand: 'Porsche',
    model: 'Taycan 4S Electric',
    year: 2024,
    vehicleType: 'Electric',
    fuel: 'Electric',
    transmission: 'Automatic',
    seats: 4,
    pricePerDay: 280,
    description: 'Electrifying acceleration, precision German chassis engineering, and ultra-fast 800V charging architecture.',
    features: ['800V Rapid Charge', 'Launch Control', 'Active Air Suspension', 'Panoramic Glass Roof', 'Burmester Sound System'],
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
    ],
    pickupLocation: { name: 'Downtown Mobility Hub, San Francisco', latitude: 37.7749, longitude: -122.4194 },
    dropLocation: { name: 'SFO International Airport', latitude: 37.6213, longitude: -122.3790 },
    isAvailable: true,
    ratingsAverage: 4.9,
    ratingsQuantity: 18,
  },
  {
    brand: 'Mercedes-Benz',
    model: 'S-Class S580 Luxury',
    year: 2024,
    vehicleType: 'Luxury',
    fuel: 'Hybrid',
    transmission: 'Automatic',
    seats: 5,
    pricePerDay: 320,
    description: 'The pinnacle of automotive luxury with executive rear lounge seating, massaging seats, and semi-autonomous driving.',
    features: ['Rear Executive Suite', 'Hot Stone Massage', 'Level 3 Drive Pilot', 'Head-Up AR Display', 'Airmatic Suspension'],
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1000&q=80',
    ],
    pickupLocation: { name: 'Financial District Plaza, San Francisco', latitude: 37.7946, longitude: -122.3999 },
    dropLocation: { name: 'Silicon Valley VIP Terminal, San Jose', latitude: 37.3639, longitude: -121.9289 },
    isAvailable: true,
    ratingsAverage: 5.0,
    ratingsQuantity: 24,
  },
  {
    brand: 'Tesla',
    model: 'Model X Plaid Tri-Motor',
    year: 2023,
    vehicleType: 'SUV',
    fuel: 'Electric',
    transmission: 'Automatic',
    seats: 7,
    pricePerDay: 240,
    description: 'Iconic Falcon Wing doors, unmatched tri-motor acceleration (0-60 in 2.5s), and room for the entire family.',
    features: ['Falcon Wing Doors', 'Full Self Driving', '1020 Horsepower', 'Tri-Zone Climate', 'Gaming Computer Built-in'],
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1000&q=80',
    ],
    pickupLocation: { name: 'Union Square Supercharger, San Francisco', latitude: 37.7879, longitude: -122.4075 },
    dropLocation: { name: 'Oakland International Airport', latitude: 37.7126, longitude: -122.2197 },
    isAvailable: true,
    ratingsAverage: 4.8,
    ratingsQuantity: 32,
  },
  {
    brand: 'BMW',
    model: 'M4 Competition Coupe',
    year: 2024,
    vehicleType: 'Sports',
    fuel: 'Petrol',
    transmission: 'Automatic',
    seats: 4,
    pricePerDay: 260,
    description: 'Twin-turbocharged inline-six pushing 503 HP. Razor-sharp steering, carbon fiber bucket seats, and track dynamics.',
    features: ['M xDrive AWD', 'Carbon Ceramic Brakes', 'M Drift Analyzer', 'Sport Exhaust', 'Harman Kardon Sound'],
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80',
    ],
    pickupLocation: { name: 'Marina District Concierge, San Francisco', latitude: 37.8037, longitude: -122.4368 },
    dropLocation: { name: 'SFO International Airport', latitude: 37.6213, longitude: -122.3790 },
    isAvailable: true,
    ratingsAverage: 4.9,
    ratingsQuantity: 15,
  },
  {
    brand: 'Land Rover',
    model: 'Range Rover Autobiography',
    year: 2023,
    vehicleType: 'SUV',
    fuel: 'Diesel',
    transmission: 'Automatic',
    seats: 7,
    pricePerDay: 310,
    description: 'Uncompromising British luxury meets legendary all-terrain capability. Floating roofline and peerless ride comfort.',
    features: ['Terrain Response 2', 'All-Wheel Steering', 'Meridian Signature Sound', 'Executive Rear Class', 'Cabin Air Purification'],
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
    ],
    pickupLocation: { name: 'Presidio Heights Mobility Center, San Francisco', latitude: 37.7886, longitude: -122.4598 },
    dropLocation: { name: 'Napa Valley Valley Terminal', latitude: 38.2975, longitude: -122.2869 },
    isAvailable: true,
    ratingsAverage: 4.8,
    ratingsQuantity: 21,
  },
  {
    brand: 'Audi',
    model: 'RS6 Avant Performance',
    year: 2024,
    vehicleType: 'Sedan',
    fuel: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    pricePerDay: 275,
    description: 'Supercar velocity meets family practicality with 621 HP twin-turbo V8, quattro grip, and huge luggage space.',
    features: ['Quattro Sport Differential', 'Dynamic All-Wheel Steer', 'Matrix LED Headlights', 'Bang & Olufsen 3D', 'RS Sport Exhaust'],
    images: [
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
    ],
    pickupLocation: { name: 'Mission Bay Mobility Station, San Francisco', latitude: 37.7706, longitude: -122.3912 },
    dropLocation: { name: 'SFO International Airport', latitude: 37.6213, longitude: -122.3790 },
    isAvailable: true,
    ratingsAverage: 4.9,
    ratingsQuantity: 19,
  },
  {
    brand: 'Hyundai',
    model: 'Ioniq 5 Limited EV',
    year: 2024,
    vehicleType: 'Hatchback',
    fuel: 'Electric',
    transmission: 'Automatic',
    seats: 5,
    pricePerDay: 85,
    description: 'Retro-futuristic styling, spacious flat-floor cabin, vehicle-to-load power, and incredible daily city efficiency.',
    features: ['Ultra-Fast 800V Charging', 'V2L Exterior Power', 'Blind-Spot View Monitor', 'Smart Cruise Control 2', 'Spacious Cargo'],
    images: [
      'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1000&q=80',
    ],
    pickupLocation: { name: 'Berkeley Campus Hub, Berkeley', latitude: 37.8719, longitude: -122.2585 },
    dropLocation: { name: 'Downtown Mobility Hub, San Francisco', latitude: 37.7749, longitude: -122.4194 },
    isAvailable: true,
    ratingsAverage: 4.7,
    ratingsQuantity: 14,
  },
  {
    brand: 'Toyota',
    model: 'Camry Hybrid XSE',
    year: 2023,
    vehicleType: 'Sedan',
    fuel: 'Hybrid',
    transmission: 'Automatic',
    seats: 5,
    pricePerDay: 68,
    description: 'Reliable, fuel-efficient, and smooth driving dynamics with sport-tuned suspension and Toyota Safety Sense 3.0.',
    features: ['52 MPG Combined', 'Apple CarPlay & Android Auto', 'Lane Tracing Assist', 'Dual Zone Climate', 'Leather Seats'],
    images: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80',
    ],
    pickupLocation: { name: 'Downtown Mobility Hub, San Francisco', latitude: 37.7749, longitude: -122.4194 },
    dropLocation: { name: 'SFO International Airport', latitude: 37.6213, longitude: -122.3790 },
    isAvailable: true,
    ratingsAverage: 4.8,
    ratingsQuantity: 38,
  },
];

const seedInitialData = async () => {
  try {
    console.log('🌱 Seeding database initial users and car fleet...');

    // Seed Admin
    let admin = await User.findOne({ email: 'admin@mobility.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Chief Fleet Admin',
        email: 'admin@mobility.com',
        password: 'adminpassword123',
        role: 'ADMIN',
        phone: '+1 (555) 888-9999',
        address: 'Mobility HQ, 100 Grand Avenue, San Francisco',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      });
      console.log('✅ Admin user created: admin@mobility.com / adminpassword123');
    }

    // Seed Customer
    let customer = await User.findOne({ email: 'customer@mobility.com' });
    if (!customer) {
      customer = await User.create({
        name: 'Alex Johnson',
        email: 'customer@mobility.com',
        password: 'customerpassword123',
        role: 'CUSTOMER',
        phone: '+1 (555) 234-5678',
        address: '450 California St, San Francisco, CA',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      });
      console.log('✅ Customer user created: customer@mobility.com / customerpassword123');
    }

    // Seed Cars if none exist
    const carCount = await Car.countDocuments();
    if (carCount === 0) {
      const insertedCars = await Car.insertMany(initialCars);
      console.log(`✅ Seeded ${insertedCars.length} vehicles into the fleet catalog.`);

      // Seed sample reviews
      if (insertedCars.length > 0 && customer) {
        await Review.create({
          carId: insertedCars[0]._id,
          userId: customer._id,
          userName: customer.name,
          rating: 5,
          title: 'Unbelievable performance and handling',
          comment: 'Rented this for a weekend getaway down Highway 1. The acceleration and instant torque is out of this world!',
        });
        await Review.create({
          carId: insertedCars[1]._id,
          userId: customer._id,
          userName: customer.name,
          rating: 5,
          title: 'Pure executive comfort',
          comment: 'Perfect for executive client transport. The rear lounge seats and massage function kept everyone relaxed.',
        });
      }
    } else {
      console.log(`ℹ️ Cars collection already has ${carCount} vehicles.`);
    }

    console.log('🎉 Seeding successfully completed.');
  } catch (err) {
    console.error('Error seeding database:', err.message);
  }
};

// If run directly: node src/utils/seedData.js
if (require.main === module) {
  connectDB().then(async () => {
    await seedInitialData();
    process.exit(0);
  });
}

module.exports = { seedInitialData };
