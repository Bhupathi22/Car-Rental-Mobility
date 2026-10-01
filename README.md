# CAR RENTAL & MOBILITY
> **"Move Freely. Travel Smarter."**  
> A Next-Generation Full-Stack Automotive Fleet & Mobility Web Application demonstrating academic concepts from **CO1 to CO6**.

---

## 🌟 Executive Project Overview
**CAR RENTAL & MOBILITY** is a full-stack automotive platform engineered to bridge consumer car reservations with live GPS fleet telemetry, cryptographic QR check-in passes, rule-based recommendation algorithms, and real-time MongoDB analytics.

### Key Highlights
- **100% Real MongoDB Persistence**: Zero `localStorage` mock illusions. Every user, fleet vehicle, booking, payment transaction, review, and telemetry packet communicates with MongoDB.
- **OpenFreeMap & MapLibre GL Integration**: Replaces proprietary mapping APIs with open vector tiles (`https://tiles.openfreemap.org/styles/liberty`) delivering high-performance route rendering without external API keys.
- **Contactless QR Verification**: Every confirmed booking produces a cryptographic QR code containing a secure verification reference verified via `/verify-booking/:id`.
- **Simulated GPS Telemetry**: Real-time vehicle marker movement with speed, heading, and distance-to-station interpolation.
- **Multi-Parameter Recommender**: Rule-based scoring prioritizing passenger capacity, budget constraints, vehicle category, and trip purpose.
- **Role-Based Access Control (RBAC)**: Strict separation between `CUSTOMER` and `ADMIN` operations with JWT session validation.
- **CO1–CO6 Syllabus Compliance**: Complete architectural documentation, C4 diagrams, ER schematics, and automated Jest/Supertest suites.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend UI** | React 18, Vite, React Router 6, Tailwind CSS, Framer Motion, Lucide React, React Hot Toast |
| **Cartography & QR** | MapLibre GL JS, OpenFreeMap (Liberty Vector Style), `qrcode.react` |
| **Backend Runtime** | Node.js (v20+ / v24+), Express.js (v4.21+) |
| **Database & ODM** | MongoDB Atlas / Local MongoDB 7.0, Mongoose ODM (v8.9+) |
| **Security & Middleware** | JWT (jsonwebtoken), bcryptjs, Helmet, CORS, express-rate-limit, express-validator |
| **File Uploads** | Multer (disk storage with validation) |
| **API Documentation** | Swagger UI Express, OpenAPI 3.0 JSDoc (`/api-docs`) |
| **Testing** | Jest, Supertest, MongoMemoryServer |
| **DevOps & Containers** | Docker, Docker Compose, GitHub Actions CI Pipeline |

---

## 📂 Project Directory Structure

```
car-rental-project/
├── backend/
│   ├── src/
│   │   ├── config/              # MongoDB connection & Swagger OpenAPI specs
│   │   │   ├── db.js
│   │   │   └── swagger.js
│   │   ├── controllers/         # HTTP request orchestration
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── bookingController.js
│   │   │   ├── carController.js
│   │   │   ├── paymentController.js
│   │   │   ├── recommendationController.js
│   │   │   ├── reviewController.js
│   │   │   └── trackingController.js
│   │   ├── services/            # Pure business logic & algorithms
│   │   │   ├── adminService.js
│   │   │   ├── authService.js
│   │   │   ├── bookingService.js
│   │   │   ├── carService.js
│   │   │   ├── paymentService.js
│   │   │   ├── recommendationService.js
│   │   │   ├── reviewService.js
│   │   │   └── trackingService.js
│   │   ├── models/              # Mongoose collection schemas & indexes
│   │   │   ├── ActivityLog.js
│   │   │   ├── Booking.js
│   │   │   ├── Car.js
│   │   │   ├── Payment.js
│   │   │   ├── Recommendation.js
│   │   │   ├── Review.js
│   │   │   ├── Tracking.js
│   │   │   └── User.js
│   │   ├── middleware/          # JWT protect, RBAC, Multer, rate-limiting, errors
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   ├── rateLimiter.js
│   │   │   ├── rbacMiddleware.js
│   │   │   ├── uploadMiddleware.js
│   │   │   └── validationMiddleware.js
│   │   ├── routes/              # Express route declarations
│   │   │   └── index.js
│   │   ├── utils/               # QR generator, seed data, activity logger
│   │   │   ├── logger.js
│   │   │   ├── qrGenerator.js
│   │   │   └── seedData.js
│   │   ├── app.js               # Express application pipeline
│   │   └── server.js            # Server entrypoint with DB connect & auto-seed
│   ├── tests/
│   │   └── api.test.js          # 12 Automated integration test suites
│   ├── uploads/                 # Uploaded vehicle imagery
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI, MapView, CarCard, CarFilter, Modals
│   │   │   ├── bookings/QRModal.jsx
│   │   │   ├── cars/CarCard.jsx, CarFilter.jsx, CarFormModal.jsx
│   │   │   └── common/BackButton.jsx, Footer.jsx, MapView.jsx, Navbar.jsx, ProtectedRoute.jsx
│   │   ├── context/             # AuthContext (JWT, user state, RBAC)
│   │   │   └── AuthContext.jsx
│   │   ├── pages/               # 16 High-fidelity pages
│   │   │   ├── AboutPage.jsx
│   │   │   ├── AdminBookingsPage.jsx
│   │   │   ├── AdminCarsPage.jsx
│   │   │   ├── AdminCustomersPage.jsx
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── AdminPaymentsPage.jsx
│   │   │   ├── BookingPage.jsx
│   │   │   ├── BookingsPage.jsx
│   │   │   ├── CarDetailsPage.jsx
│   │   │   ├── CarsPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── PaymentPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── RecommendationsPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── TrackingPage.jsx
│   │   │   └── VerifyBookingPage.jsx
│   │   ├── services/            # Axios API client wrapper
│   │   │   └── api.js
│   │   ├── App.jsx              # Main routing tree & notifications
│   │   ├── index.css            # Custom CSS & Tailwind styles
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── docs/
│   ├── c4-architecture.md       # C4 Context, Container & Component diagrams
│   ├── database-er-diagram.md   # Entity-Relationship diagram & indexing strategy
│   └── syllabus-mapping.md      # Detailed CO1-CO6 syllabus compliance matrix
├── .github/workflows/ci.yml     # Automated CI pipeline
├── Dockerfile                   # Backend production Dockerfile
├── Dockerfile.frontend          # Frontend Nginx production Dockerfile
├── docker-compose.yml           # Unified orchestration
└── README.md
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
- **Node.js** v18+ or v20+ (v24 supported)
- **npm** v9+
- Optional: **MongoDB Atlas URI** (The backend features an automatic resilient fallback to spin up a local instance for immediate grading/demo if no URL is supplied!).

### 2. Clone and Install Dependencies
From the repository root directory, run:
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```
*(Or run `npm run install:all` directly from the root workspace).*

---

## 🔐 Environment Variables Setup

### Backend Configuration (`backend/.env`)
Create or edit `backend/.env` (a template is provided in `backend/.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/car_rental_mobility?retryWrites=true&w=majority
JWT_SECRET=car_rental_mobility_super_secret_jwt_key_2025_academics
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```
> **Note**: If `MONGODB_URI` is left blank, the backend prints a helpful configuration banner and launches an embedded high-performance MongoDB instance, allowing faculty reviewers to test all APIs and full CRUD operations instantly without configuring cloud clusters.

---

## 🚀 Running the Application Locally

### Option A: Running Backend and Frontend in Separate Terminals

**Terminal 1 — Backend API Server:**
```bash
cd backend
npm run dev
```
*Backend runs on `http://localhost:5000`.*  
*Swagger Documentation runs on `http://localhost:5000/api-docs`.*  
*Health Check runs on `http://localhost:5000/api/health`.*

**Terminal 2 — Frontend Client:**
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🔑 Default Seeded Demo Accounts

The database automatically seeds these pre-configured accounts on initial startup:

| Role | Email Address | Password | Permissions & Features |
| :--- | :--- | :--- | :--- |
| **Fleet Admin** | `admin@mobility.com` | `adminpassword123` | Dashboard Analytics, Add/Edit/Delete Vehicles, View All Customer Bookings & Payments |
| **Customer** | `customer@mobility.com` | `customerpassword123` | Reserve Vehicles, View QR Pass, Complete Demo Checkout, Live GPS Tracking |

*(The Login page includes **one-click quick login buttons** to instantly authenticate without manual typing).*

---

## 🧪 Automated Testing (CO3 / CO4)

The backend includes 12 automated unit and integration tests written with **Jest** and **Supertest**:
- Customer Registration with JWT token generation
- Customer Login with credential verification
- Invalid login rejection (HTTP 401)
- Role-based authorization enforcement (Non-admin car creation forbidden)
- Admin Vehicle Creation (`POST /api/cars`)
- Fleet retrieval with parameters (`GET /api/cars`)
- Admin Vehicle Specification Update (`PUT /api/cars/:id`)
- Date interval validation (Rejection of invalid pickup dates)
- Booking creation and QR code generation
- Payment transaction processing and booking status mutation
- Cryptographic QR code verification (`GET /api/bookings/verify/:id`)
- Admin Vehicle Deletion (`DELETE /api/cars/:id`)

To run the test suite:
```bash
cd backend
npm test
```

---

## 📖 REST API & Swagger Documentation (CO3)

Complete interactive API documentation is available via Swagger UI:
- **URL**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

### Primary API Endpoints

| Category | Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- | :--- |
| **Health** | `GET` | `/api/health` | Service status heartbeat | Public |
| **Auth** | `POST` | `/api/auth/register` | Register new customer account | Public |
| **Auth** | `POST` | `/api/auth/login` | Authenticate and obtain JWT | Public |
| **Auth** | `GET` | `/api/auth/me` | Fetch active user profile | Authenticated |
| **Cars** | `GET` | `/api/cars` | Search & filter fleet catalog | Public |
| **Cars** | `GET` | `/api/cars/:id` | Fetch specific car & reviews | Public |
| **Cars** | `POST` | `/api/cars` | Add new vehicle to fleet | Admin Only |
| **Cars** | `PUT` | `/api/cars/:id` | Update vehicle specifications | Admin Only |
| **Cars** | `DELETE`| `/api/cars/:id` | Remove vehicle from fleet | Admin Only |
| **Cars** | `PATCH`| `/api/cars/:id/availability` | Toggle vehicle availability | Admin Only |
| **Bookings**| `POST` | `/api/bookings` | Create reservation & generate QR | Customer |
| **Bookings**| `GET` | `/api/bookings/my` | View personal itinerary | Customer |
| **Bookings**| `GET` | `/api/bookings` | View global customer bookings | Admin Only |
| **Bookings**| `GET` | `/api/bookings/verify/:ref`| Scan and verify QR pass | Public / Dispatch |
| **Bookings**| `PATCH`| `/api/bookings/:id/cancel`| Cancel booking reservation | Customer / Admin |
| **Payments**| `POST` | `/api/payments` | Process demo payment transaction | Customer |
| **Payments**| `GET` | `/api/payments` | View settled financial ledger | Admin Only |
| **Tracking**| `GET` | `/api/tracking/:bookingId` | Fetch GPS coordinates & ETA | Authenticated |
| **Tracking**| `PUT` | `/api/tracking/:bookingId/simulate` | Step vehicle marker along route | Authenticated |
| **Recommender**| `GET`| `/api/recommendations` | Multi-attribute scoring engine | Public |
| **Reviews** | `GET` | `/api/reviews/:carId` | View verified guest reviews | Public |
| **Reviews** | `POST` | `/api/reviews` | Submit car rating & comment | Authenticated |
| **Admin** | `GET` | `/api/admin/dashboard` | MongoDB Aggregation analytics | Admin Only |
| **Admin** | `GET` | `/api/admin/customers` | View registered customer directory | Admin Only |

---

## 🐳 Docker & Containerization (CO6)

To build and run the entire multi-container architecture (MongoDB, Express Backend, and React Frontend) with Docker Compose:

```bash
docker-compose up --build
```
- **Frontend App**: `http://localhost:80` (or `http://localhost:5173` locally)
- **Backend API**: `http://localhost:5000`
- **MongoDB**: `localhost:27017`

To run in background mode:
```bash
docker-compose up -d
```
To stop the cluster:
```bash
docker-compose down -v
```

---

## 🎓 Academic Syllabus Outcomes Breakdown

For detailed information on how each course outcome is fulfilled, see:
- [`docs/syllabus-mapping.md`](file:///c:/Users/HP/OneDrive/Documents/car%20rental%20project/docs/syllabus-mapping.md)
- [`docs/c4-architecture.md`](file:///c:/Users/HP/OneDrive/Documents/car%20rental%20project/docs/c4-architecture.md)
- [`docs/database-er-diagram.md`](file:///c:/Users/HP/OneDrive/Documents/car%20rental%20project/docs/database-er-diagram.md)

---

## 🚗 Complete End-to-End Demonstration Workflow

1. **Explore Homepage**: Browse the responsive automotive visual, search bar, and popular fleet cards.
2. **Customer Registration / Login**: Log in as Alex (`customer@mobility.com`) or create an account.
3. **Vehicle Search & Filter**: Navigate to **Cars**, filter by category (`Electric`, `Luxury`, `SUV`), price range, and transmission.
4. **Inspect Specifications & Map**: Open car details, view specifications, amenities, and OpenFreeMap pickup station pin.
5. **Reserve Vehicle**: Click **Book Now**, choose dates, stations, and review the transparent tax/service fee breakdown.
6. **QR Check-in Generation**: Confirm the booking to automatically generate a cryptographic verification QR pass.
7. **Simulate QR Scan Verification**: Tap **Simulate Scan / Verify** or visit `/verify-booking/:id` to inspect the 4-point verification checklist.
8. **Demo Payment Settlement**: Choose Demo, Card, or UPI to settle the fee; observe instant MongoDB mutation to `paymentStatus: paid` and `bookingStatus: confirmed`.
9. **Live GPS Tracking**: Open **Tracking** to observe the vehicle marker moving dynamically along waypoints on OpenFreeMap with real-time speed and ETA adjustments.
10. **Rule-Based Recommendations**: Open **Recommendations**, configure passenger count and budget to view ranked scores and rationale badges.
11. **Admin Fleet CRUD**: Log in as `admin@mobility.com` (`adminpassword123`):
    - Add a new vehicle → confirm instant appearance in customer catalog.
    - Edit vehicle specifications → confirm immediate update.
    - Delete vehicle → confirm removal from catalog.
12. **Admin Real-time Analytics**: Observe MongoDB aggregation metrics for revenue, booking distribution, and customer audit trails.
