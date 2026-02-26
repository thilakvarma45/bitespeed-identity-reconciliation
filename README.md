# BiteSpeed Identity Reconciliation

A web service that identifies and keeps track of a customer's identity across multiple purchases, built with **Spring Boot**, **MySQL**, and **React.js**.

## 🏗️ Architecture

```
├── backend/          # Spring Boot REST API
│   ├── src/main/java/com/bitespeed/
│   │   ├── model/          # JPA Entity (Contact)
│   │   ├── repository/     # Data access layer
│   │   ├── service/        # Business logic
│   │   ├── controller/     # REST endpoints
│   │   ├── dto/            # Request/Response DTOs
│   │   └── config/         # CORS config
│   └── pom.xml
└── frontend/         # React.js (Vite)
    └── src/App.jsx
```

## 🚀 Setup & Run

### Prerequisites
- Java 17+
- MySQL 8.x running on `localhost:3306`
- Node.js 18+

### Backend

```bash
cd backend

# Create the MySQL database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS bitespeed;"

# Update MySQL credentials in src/main/resources/application.properties

# Build & Run
./mvnw.cmd spring-boot:run
```

The API will be available at `http://localhost:8080`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The UI will be available at `http://localhost:5173`

## 📡 API Endpoint

### `POST /identify`

**Request:**
```json
{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}
```

**Response:**
```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [23]
  }
}
```

## 🔗 Hosted Endpoint

**Live API:** [https://bitespeed-identity-reconciliation-4qws.onrender.com/identify](https://bitespeed-identity-reconciliation-4qws.onrender.com/identify)

## 📋 How It Works

1. **New customer** — Creates a `primary` contact
2. **Existing customer, new info** — Creates a `secondary` contact linked to the primary
3. **Two separate primaries linked** — The older one stays `primary`, the newer one becomes `secondary`
4. All linked contacts are consolidated in the response
