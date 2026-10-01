# C4 Architecture Specification
## Project: CAR RENTAL & MOBILITY

This document outlines the software architecture of **CAR RENTAL & MOBILITY** using the C4 model (Context, Containers, Components, and Code/Deployment).

---

### Level 1: System Context Diagram

The System Context diagram illustrates the system boundaries, users (Customer, Admin), and external dependencies (MongoDB Atlas, OpenFreeMap, Payment Gateways).

```mermaid
C4Context
  title System Context Diagram for CAR RENTAL & MOBILITY

  Person(customer, "Customer / Traveler", "Searches vehicles, selects stations, reserves, verifies QR, and tracks vehicle.")
  Person(admin, "Fleet Administrator", "Manages fleet catalog, monitors bookings, tracks live analytics, and inspects payments.")

  System(system, "CAR RENTAL & MOBILITY Platform", "Web application offering luxury fleet rentals, telemetry, and contactless verification.")

  System_Ext(mongodb, "MongoDB Atlas", "Primary document database storing users, fleet, bookings, payments, and telemetry.")
  System_Ext(openfreemap, "OpenFreeMap", "Free vector tile server delivering MapLibre Liberty styles without proprietary tokens.")
  System_Ext(payment_gateway, "Payment Gateway (Demo / Stripe / Razorpay)", "Financial transaction settlement and tokenization.")

  Rel(customer, system, "Explores fleet, creates booking, makes payment, tracks trip via HTTPS")
  Rel(admin, system, "Manages fleet inventory, views analytics via HTTPS")
  Rel(system, mongodb, "Persists and queries BSON documents via Mongoose TCP (Port 27017)")
  Rel(system, openfreemap, "Fetches vector map tiles and style glyphs via HTTPS")
  Rel(system, payment_gateway, "Authorizes payment transactions")
```

---

### Level 2: Container Diagram

The Container diagram zooms into the **CAR RENTAL & MOBILITY** platform, highlighting the high-level executable units: React Single Page Application, Node.js/Express REST API, and MongoDB Database.

```mermaid
C4Container
  title Container Diagram for CAR RENTAL & MOBILITY

  Person(user, "User (Customer or Admin)", "Accesses platform via desktop or mobile web browser.")

  Container(spa, "Single-Page Application (SPA)", "React 18, Vite, Tailwind CSS, MapLibre GL", "Provides responsive automotive UI, interactive maps, QR code generation, and client routing.")
  Container(api, "REST API Backend", "Node.js, Express.js, JWT, Multer", "Exposes secure RESTful endpoints, handles business rules, role-based authorization, and telemetry simulation.")
  ContainerDb(db, "Database", "MongoDB Atlas / Mongoose", "Stores users, cars, bookings, payments, reviews, telemetry, and audit logs with compound indexes.")

  System_Ext(openfreemap, "OpenFreeMap Vector Tiles", "Public tile server providing Liberty map style.")

  Rel(user, spa, "Interacts with UI over HTTPS")
  Rel(spa, api, "Makes asynchronous JSON REST API calls with JWT Bearer tokens")
  Rel(spa, openfreemap, "Downloads vector tiles directly into MapLibre GL canvas")
  Rel(api, db, "Executes Mongoose CRUD, validation, and aggregation pipelines")
```

---

### Level 3: Component Diagram (Backend API Modularity)

The Component diagram reveals the internal modular service boundaries of the Node.js Express Backend. Each module is structured following Domain-Driven Design (CO5 Microservices Readiness).

```mermaid
C4Component
  title Component Diagram for Node.js / Express Backend

  Container_Boundary(backend, "Express REST Backend") {
    Component(router, "API Gateway / Route Registry", "Express Router", "Routes HTTP requests to domain controllers; enforces rate limiting and CORS.")
    Component(auth_mod, "Auth Module & RBAC", "JWT, Bcryptjs", "Handles user registration, login, token issuance, and role access control.")
    Component(car_mod, "Car Fleet Module", "Multer, Mongoose", "Manages fleet catalog, specifications, filtering, and availability toggles.")
    Component(booking_mod, "Booking & QR Module", "QRcode, Validator", "Validates date intervals, calculates taxes/fees, checks overlaps, generates QR passes.")
    Component(payment_mod, "Payment Module", "Transaction Handler", "Processes payment settlement and mutates booking status to confirmed/paid.")
    Component(tracking_mod, "Tracking Module", "GPS Telemetry Engine", "Simulates vehicle movement along route waypoints towards destination.")
    Component(recommender_mod, "Recommendation Engine", "Rule-Based Scorer", "Calculates multi-parameter suitability score based on passenger capacity, budget, and purpose.")
    Component(analytics_mod, "Analytics Engine", "MongoDB Aggregation", "Executes multi-stage aggregation pipelines for revenue and category breakdown.")
  }

  Rel(router, auth_mod, "Dispatches /api/auth")
  Rel(router, car_mod, "Dispatches /api/cars")
  Rel(router, booking_mod, "Dispatches /api/bookings")
  Rel(router, payment_mod, "Dispatches /api/payments")
  Rel(router, tracking_mod, "Dispatches /api/tracking")
  Rel(router, recommender_mod, "Dispatches /api/recommendations")
  Rel(router, analytics_mod, "Dispatches /api/admin")

  Rel(booking_mod, tracking_mod, "Initializes tracking on confirmed reservation")
  Rel(payment_mod, booking_mod, "Updates payment status to paid")
```

---

### Microservices Evolution Roadmap (CO5)

In future distributed deployments, each domain component above can be extracted into an independent microservice container:
1. **Auth Service**: Manages OAuth2/JWT issuance with its own Redis session store.
2. **Fleet Service**: Handles inventory, pricing, and media uploads with S3/Cloudinary storage.
3. **Reservation & Dispatch Service**: Manages booking state machines, date conflict locks, and cryptographic QR signing.
4. **Settlement Service**: Integrates with live Stripe/Razorpay webhooks.
5. **IoT Telemetry Service**: Receives real vehicle OBD-II/GPS MQTT broker pings.
6. **Recommendation Engine**: Python/Node ML service running cosine similarity or collaborative filtering.
