# EN2H Booking Platform API (MediBook)

## Project Overview
MediBook is a modern, responsive, and robust healthcare appointment booking platform designed as a solution for the EN2H Software Engineer Intern (NestJS) Technical Assignment. 

The project is structured into two main parts:
- **`en2h-booking-platform/`**: A NestJS backend REST API using TypeORM, featuring JWT authentication, comprehensive validation, error handling, and interactive Swagger documentation. Supports PostgreSQL and SQLite.
- **`medibook-frontend/`**: A React + TypeScript SPA (Single Page Application) frontend built with Vite, providing interfaces for public service booking and an administrative dashboard for managing services and appointments.

---

## Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/seneja/EN2H-booking-platform.git
   cd EN2H-booking-platform
   ```

2. Install backend dependencies:
   ```bash
   cd en2h-booking-platform
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../medibook-frontend
   npm install
   ```

---

## Environment Variables
The backend requires configuration variables to run securely. 
1. Navigate to the `en2h-booking-platform` directory.
2. Create a `.env` file (you can copy the provided `.env.example` file if available):

```env
# ─── Database ────────────────────────────────────────────────────
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD="your_postgres_password"  # Wrap in quotes if it contains '#' characters!
DB_NAME=medibook

# ─── JWT Authentication ──────────────────────────────────────────
JWT_SECRET=medibook-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# ─── App Configuration ───────────────────────────────────────────
PORT=3000
```
*Note: In development, the React frontend is configured to proxy all `/api` requests to port `3000` via its Vite server configuration (`vite.config.ts`).*

---

## Database Setup

The live application is currently connected to a **Supabase PostgreSQL database** for reliable data storage. If you wish to run the application locally, you can use either a local PostgreSQL instance or SQLite.

### Option A: PostgreSQL (Recommended)
1. Ensure your PostgreSQL server is running locally on port `5432` (or connect to a cloud provider like Supabase).
2. Create a database named `medibook` using your SQL client (e.g. pgAdmin, psql, DBeaver):
   ```sql
   CREATE DATABASE medibook;
   ```
3. Update `DB_PASSWORD` in your backend `.env` file. If your password contains a `#` (hash) character, **you must wrap the password in double quotes** (`"password#123"`) so the parser doesn't treat the rest of your password as a code comment.
4. The backend uses TypeORM `synchronize: true` in development, which automatically generates all tables (`users`, `services`, `bookings`) on startup.

### Option B: SQLite Fallback
If you do not have PostgreSQL set up on your machine, you can run the app using a zero-setup SQLite database:
1. Open `en2h-booking-platform/src/app.module.ts`.
2. Switch `TypeOrmModule.forRoot` from type `'postgres'` to type `'better-sqlite3'`:
   ```typescript
   TypeOrmModule.forRoot({
     type: 'better-sqlite3',
     database: 'medibook.sqlite',
     autoLoadEntities: true,
     synchronize: true,
   })
   ```

---

## Running the Application

### 1. Start the Backend API
Open a terminal and run:
```bash
cd en2h-booking-platform
npm run start:dev
```
*The API will be available at: **http://localhost:3000***

### 2. Start the Frontend Application
Open a new terminal and run:
```bash
cd medibook-frontend
npm run dev
```
*The frontend interface will be available at: **http://localhost:5173***

---

## Running Migrations
TypeORM is currently configured to generate database tables automatically on startup (`synchronize: true`) to simplify evaluation. 

If you disable this setting in production and need to run migrations manually:

1. Generate a migration based on schema changes:
   ```bash
   npx typeorm-ts-node-commonjs migration:generate src/migrations/InitialMigration -d src/data-source.ts
   ```
2. Run pending migrations:
   ```bash
   npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts
   ```
3. Revert the last run migration:
   ```bash
   npx typeorm-ts-node-commonjs migration:revert -d src/data-source.ts
   ```

---

## API Documentation
The backend provides fully interactive API documentation built with Swagger UI:

👉 **Live Swagger Docs**: **[https://backend-6yqoozxk.b4a.run/api/docs](https://backend-6yqoozxk.b4a.run/api/docs)**
👉 **Local Swagger Docs**: **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

### Testing Protected Routes in Swagger:
1. Expand the `POST /auth/login` endpoint, click **Try it out**, enter your registered credentials, and click **Execute**.
2. Copy the `accessToken` from the response.
3. Click the green **Authorize** lock button at the top right of the Swagger UI page.
4. Paste the token into the value box, click **Authorize**, and click close.
5. All protected endpoints (displaying a lock icon) will now include the Bearer Authorization header in requests!

---

## Assumptions Made
1. **Authentication Scope**: Patients browsing services and creating appointments do so without requiring login authentication. Only healthcare staff/administrators require JWT credentials to manage services and edit booking statuses.
2. **Default Admin User**: When the database starts up empty, the administrator must first navigate to `/register` in the UI to create their account. 
3. **Database Casing**: TypeORM is configured to map entity names in camelCase. PostgreSQL converts column names to lowercase by default, so double quotes are configured in query parameters (e.g. `"createdAt"`) to preserve TS properties.
4. **Environment Variables Fallback**: Built-in default fallbacks are provided for variables (such as the JWT secret and database host) to ensure the application starts up smoothly even if a `.env` file is missing.

---

## Future Improvements
1. **Email & SMS Notifications**: Integrate email services (e.g., SendGrid) or SMS integrations (e.g., Twilio) to automatically send booking confirmations, status changes (confirmed/cancelled), and daily slot reminders to patients.
2. **Advanced Slot Allocation**: Implement checking for double-bookings on a specific provider or service slot to ensure a single therapist/doctor cannot be booked twice at the same time.
3. **Role-Based Access Control (RBAC)**: Expand user schemas to support distinct privilege roles (e.g. `SuperAdmin`, `Doctor`, `Receptionist`) with customized dashboard views.
4. **OAuth Social Logins**: Provide simple Google or Microsoft single sign-on (SSO) options for quick staff onboarding.
