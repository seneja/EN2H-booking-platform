# MediBook API (Backend)

## Project Overview

MediBook is a robust healthcare appointment management platform. This repository contains the backend service built with **NestJS**, **TypeScript**, and **PostgreSQL**. It provides a RESTful API for patients to browse healthcare services and create bookings, and for administrators to manage services and monitor booking statuses efficiently.

Key features include JWT-based authentication, validation, centralized error handling, and swagger-based API documentation.

---

## Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd en2h-booking-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

---

## Environment Variables

Create a `.env` file in the root of the project. Use the following template:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=medibook

# JWT Configuration
JWT_SECRET=medibook-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Application Configuration
PORT=3000
```

---

## Database Setup

### Option 1: Using Docker (Recommended)
You can quickly spin up the PostgreSQL database and the API using the provided `docker-compose.yml` file.

```bash
docker-compose up -d db
```
*(This starts the PostgreSQL database in the background on port 5432.)*

### Option 2: Local PostgreSQL Installation
Make sure you have PostgreSQL installed and running on your machine.
1. Open your PostgreSQL terminal (psql) or pgAdmin.
2. Create the database:
   ```sql
   CREATE DATABASE medibook;
   ```
3. Ensure your `.env` file contains the correct `DB_USERNAME` and `DB_PASSWORD`.

---

## Running the Application

Once dependencies are installed and the database is running, you can start the NestJS server.

**Development Mode:**
```bash
npm run start:dev
```

**Production Mode:**
```bash
npm run build
npm run start:prod
```

**Using Docker Compose (Full Stack):**
```bash
docker-compose up --build
```

The application will run on `http://localhost:3000`.

---

## Running Migrations

This project uses TypeORM's `synchronize: true` setting in development (`src/app.module.ts`). This means the database schema is **automatically created and updated** when the application starts.

For production, you would typically turn off `synchronize` and use explicit migrations:

1. Generate a migration: `npx typeorm migration:generate -d path/to/datasource -n MigrationName`
2. Run migrations: `npx typeorm migration:run -d path/to/datasource`

*Note: For the scope of this assessment, automatic synchronization is enabled.*

---

## API Documentation

Interactive API documentation is provided via **Swagger**. 

Once the application is running, navigate to:
**[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

From there, you can:
- View all available endpoints and DTOs.
- Register an account (`POST /auth/register`).
- Log in to receive a JWT (`POST /auth/login`).
- Click **"Authorize"** at the top right, and paste your JWT as `Bearer <your_token>` to access protected Service and Booking routes.

---

## Assumptions Made

During the development of this API, the following assumptions were made:

1. **User Roles:** Anyone who registers via `/auth/register` is considered an administrator and has permission to manage (Create, Update, Delete) Services. 
2. **Booking Access:** Booking appointments (`POST /bookings`) is a public route, allowing unauthenticated patients to book. 
3. **Timezones:** Booking dates are assumed to be handled in the local timezone of the client, passed in `YYYY-MM-DD` format.
4. **Data Soft-Deletes:** Services are hard-deleted, but bookings associated with a deleted service are cascaded (removed automatically).

---

## Future Improvements

If given more time, the following features and improvements would be implemented:

1. **Role-Based Access Control (RBAC):** Introduce distinct roles (`SuperAdmin`, `Doctor`, `Patient`) to restrict who can edit services versus who can only view their own bookings.
2. **Email / SMS Notifications:** Integrate Twilio or SendGrid to notify patients when their booking status changes from `PENDING` to `CONFIRMED`.
3. **Advanced Scheduling Rules:** Implement logic to factor in service duration, business hours, and doctor availability to strictly prevent double-booking.
4. **Production Database Migrations:** Disable TypeORM `synchronize: true` and establish a strict migration pipeline for schema changes.
5. **CI/CD Pipeline:** Add GitHub Actions for automated unit testing, linting, and Docker image publishing on every push.
