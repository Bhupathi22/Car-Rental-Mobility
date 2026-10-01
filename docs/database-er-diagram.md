# Database Engineering & ER Diagram (CO1 / CO2)
## Project: CAR RENTAL & MOBILITY

This document presents the Entity-Relationship (ER) model, schema design, constraints, and compound indexes implemented in MongoDB Atlas for the **CAR RENTAL & MOBILITY** platform.

---

### Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USER ||--o{ BOOKING : "places (1:N)"
    USER ||--o{ REVIEW : "writes (1:N)"
    USER ||--o{ PAYMENT : "submits (1:N)"
    USER ||--o{ RECOMMENDATION : "requests (1:N)"
    USER ||--o{ ACTIVITY_LOG : "triggers (1:N)"

    CAR ||--o{ BOOKING : "reserved_in (1:N)"
    CAR ||--o{ REVIEW : "receives (1:N)"
    CAR ||--o{ TRACKING : "monitored_by (1:1)"

    BOOKING ||--|| PAYMENT : "settled_via (1:1)"
    BOOKING ||--|| TRACKING : "tracked_via (1:1)"

    USER {
        ObjectId _id PK
        string name "required, maxlength: 60"
        string email "required, unique, indexed"
        string password "required, hashed bcrypt"
        string role "enum: CUSTOMER | ADMIN, indexed"
        string phone
        string address
        string avatar
        date createdAt
        date updatedAt
    }

    CAR {
        ObjectId _id PK
        string brand "required, indexed"
        string model "required"
        int year "min: 2010"
        string vehicleType "enum: Sedan|SUV|Luxury|Sports|Hatchback|Electric, indexed"
        string fuel "enum: Petrol|Diesel|Electric|Hybrid"
        string transmission "enum: Automatic|Manual"
        int seats "2 to 10"
        float pricePerDay "required, indexed"
        string description
        string[] features
        string[] images "URLs or Multer upload references"
        object pickupLocation "name, latitude, longitude"
        object dropLocation "name, latitude, longitude"
        boolean isAvailable "default: true, indexed"
        float ratingsAverage "default: 4.8"
        int ratingsQuantity "default: 0"
        date createdAt
        date updatedAt
    }

    BOOKING {
        ObjectId _id PK
        string bookingCode "unique, indexed (e.g. CR-2025-XXXXXX)"
        ObjectId userId FK "references USER, indexed"
        ObjectId carId FK "references CAR, indexed"
        object customerInfo "name, email, phone"
        object vehicleInfo "brand, model, year, vehicleType, image"
        date pickupDate "required, indexed"
        date returnDate "required, indexed"
        object pickupLocation "name, latitude, longitude"
        object dropLocation "name, latitude, longitude"
        int numberOfDays "min: 1"
        float pricePerDay
        float baseAmount
        float tax "8% calculated"
        float serviceFee "$25 flat"
        float totalAmount
        string bookingStatus "enum: pending|confirmed|active|completed|cancelled, indexed"
        string paymentStatus "enum: unpaid|paid|refunded, indexed"
        boolean qrVerificationStatus "default: false"
        string qrCodeString "Base64 data URL"
        date verifiedAt
        string cancellationReason
        date createdAt
        date updatedAt
    }

    PAYMENT {
        ObjectId _id PK
        ObjectId bookingId FK "references BOOKING, unique, indexed"
        ObjectId userId FK "references USER, indexed"
        float amount "required"
        string currency "default: USD"
        string paymentMethod "demo_card | demo_upi | demo_wallet"
        string transactionId "unique, indexed"
        string status "enum: pending | completed | failed"
        object gatewayResponse "token, cardLast4, upiId"
        date paidAt
        date createdAt
        date updatedAt
    }

    TRACKING {
        ObjectId _id PK
        ObjectId bookingId FK "references BOOKING, unique, indexed"
        ObjectId carId FK "references CAR, indexed"
        object currentCoordinates "latitude, longitude"
        object pickupCoordinates "latitude, longitude"
        object destinationCoordinates "latitude, longitude"
        object[] routeWaypoints "[{ latitude, longitude }]"
        float distanceRemainingKm
        int estimatedArrivalMins
        float speedKmH
        float headingDeg
        string status "enum: idle | in_transit | arrived | completed"
        date lastUpdated
        date createdAt
        date updatedAt
    }

    REVIEW {
        ObjectId _id PK
        ObjectId carId FK "references CAR, indexed"
        ObjectId userId FK "references USER, indexed"
        string userName
        string userAvatar
        int rating "1 to 5"
        string title
        string comment
        date createdAt
    }
```

---

### Index Design Strategy

1. **Conflict Avoidance Index**:
   ```javascript
   bookingSchema.index({ carId: 1, pickupDate: 1, returnDate: 1, bookingStatus: 1 });
   ```
   *Rationale*: Eliminates overlapping vehicle reservations by enabling $lte / $gte range index scans.

2. **Catalog Filtering Compound Index**:
   ```javascript
   carSchema.index({ isAvailable: 1, vehicleType: 1, pricePerDay: 1 });
   ```
   *Rationale*: Accelerates queries filtering available vehicles by category and budget.

3. **Unique Keys**:
   - `users.email` (Unique index)
   - `bookings.bookingCode` (Unique index)
   - `payments.transactionId` (Unique index)
   - `tracking.bookingId` (Unique 1:1 mapping)
