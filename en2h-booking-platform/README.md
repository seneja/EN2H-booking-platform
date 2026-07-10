# MediBook – Healthcare Appointment Management Platform

MediBook is a modern healthcare appointment management platform that allows patients to browse healthcare services and create appointments while enabling administrators to manage services and booking statuses efficiently.

The system is built using a **NestJS + TypeORM backend** with **PostgreSQL database support** and a **React + TypeScript frontend** providing a responsive user interface and admin dashboard.

---

# Features

## Patient Features

* Browse available healthcare services
* View service details including duration and price
* Create healthcare appointments
* Receive booking confirmation status
* Responsive user-friendly interface

## Admin Features

* Secure JWT-based authentication
* Admin registration and login
* Manage healthcare services

  * Create services
  * View services
  * Update services
  * Delete services
* Manage appointments

  * View bookings
  * Update booking status
  * Confirm, cancel, or complete appointments

## Backend Features

* RESTful API architecture
* JWT authentication and authorization
* PostgreSQL database integration
* TypeORM entity management
* Swagger API documentation
* Data validation
* Secure password hashing

---

# Technology Stack

## Backend

* NestJS
* TypeScript
* TypeORM
* PostgreSQL
* JWT Authentication
* Swagger

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

## Database

* PostgreSQL

---

# Project Structure

```
MediBook
│
├── en2h-booking-platform
│   ├── src
│   │   ├── auth
│   │   ├── users
│   │   ├── services
│   │   ├── bookings
│   │   └── app.module.ts
│   │
│   └── .env
│
└── medibook-frontend
    ├── src
    ├── components
    ├── pages
    └── vite.config.ts
```

---

# Backend Setup

## 1. Clone Repository

```bash
git clone <repository-url>
```

Navigate into the backend:

```bash
cd en2h-booking-platform
```

---

# Environment Configuration

Create a `.env` file inside the backend directory.

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=medibook


# JWT Configuration
JWT_SECRET=medibook-super-secret-jwt-key
JWT_EXPIRES_IN=7d


# Application Configuration
PORT=3000
```

---

# Database Setup

## PostgreSQL Setup

Make sure PostgreSQL is running.

Create the database:

```sql
CREATE DATABASE medibook;
```

Update your `.env` file with your PostgreSQL credentials.

Example:

```
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=medibook
```

The application uses TypeORM synchronization during development:

```typescript
synchronize: true
```

Therefore, database tables will automatically be created when the backend starts.

Generated tables:

* users
* services
* bookings

---

# Install Dependencies

Inside backend folder:

```bash
npm install
```

---

# Run Backend Server

Development mode:

```bash
npm run start:dev
```

Backend will run at:

```
http://localhost:3000
```

---

# Frontend Setup

Navigate to frontend:

```bash
cd medibook-frontend
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

# API Documentation (Swagger)

MediBook provides interactive Swagger documentation.

Access:

```
http://localhost:3000/api/docs
```

Swagger allows you to:

* Test API endpoints
* View request/response formats
* Authenticate using JWT
* Manage services and bookings

---

# Authentication Testing

## 1. Register Admin Account

Endpoint:

```
POST /auth/register
```

Request:

```json
{
  "email": "admin@gmail.com",
  "password": "password123",
  "name": "Admin User"
}
```

---

## 2. Login

Endpoint:

```
POST /auth/login
```

Request:

```json
{
  "email": "admin@gmail.com",
  "password": "password123"
}
```

Response:

```json
{
  "access_token": "JWT_TOKEN"
}
```

---

## 3. Authorize Swagger

1. Copy the JWT token
2. Click the **Authorize 🔒** button
3. Enter:

```
Bearer JWT_TOKEN
```

4. Click Authorize

Protected endpoints can now be tested.

---

# API Endpoints

## Authentication

| Method | Endpoint       | Description                |
| ------ | -------------- | -------------------------- |
| POST   | /auth/register | Create admin account       |
| POST   | /auth/login    | Login and receive JWT      |
| GET    | /auth/profile  | Get logged-in user profile |

---

## Services

| Method | Endpoint      | Description       |
| ------ | ------------- | ----------------- |
| POST   | /services     | Create service    |
| GET    | /services     | Get all services  |
| GET    | /services/:id | Get service by ID |
| PATCH  | /services/:id | Update service    |
| DELETE | /services/:id | Delete service    |

Example service:

```json
{
  "title": "General Doctor Consultation",
  "description": "Consultation with a general physician",
  "duration": 30,
  "price": 2500,
  "isActive": true
}
```

---

## Bookings

| Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| POST   | /bookings            | Create booking        |
| GET    | /bookings            | View all bookings     |
| PATCH  | /bookings/:id/status | Update booking status |

Booking status options:

```
PENDING
CONFIRMED
CANCELLED
COMPLETED
```

Example:

```json
{
  "customerName": "John Silva",
  "customerEmail": "john@gmail.com",
  "customerPhone": "0771234567",
  "serviceId": "service_uuid",
  "bookingDate": "2026-07-15",
  "bookingTime": "10:30",
  "notes": "First consultation"
}
```

---

# Database Schema

## Users Table

```
id
email
password
name
createdAt
```

## Services Table

```
id
title
description
duration
price
isActive
createdAt
updatedAt
```

## Bookings Table

```
id
customerName
customerEmail
customerPhone
serviceId
bookingDate
bookingTime
status
notes
createdAt
updatedAt
```

---

# Future Improvements

## Email and SMS Notifications

Integrate services such as:

* SendGrid
* Twilio

for:

* Booking confirmations
* Appointment reminders
* Status updates

---

## Advanced Appointment Scheduling

Implement:

* Doctor availability management
* Time-slot allocation
* Prevention of duplicate bookings

---

## Role-Based Access Control

Introduce roles such as:

* Super Admin
* Doctor
* Receptionist

with different dashboard permissions.

---

## OAuth Authentication

Add:

* Google Login
* Microsoft Login

for easier staff onboarding.

---

# Author

Developed as a healthcare appointment management platform using modern full-stack technologies.

---

# License

This project is developed for educational and demonstration purposes.
