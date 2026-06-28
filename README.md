# FloodGuard — Flood Incident Reporting & Community Response Platform

A cloud-ready, full-stack flood reporting system built for Nepal. Citizens can report floods, authorities can verify and respond, and the public can view live alerts and an interactive map — all without needing an account.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Microsoft SQL Server (mssql) |
| Auth | bcrypt + httpOnly cookies |
| Icons | Lucide React |
| Map | Leaflet + react-leaflet v4 |

---

## Pages & Routes

### Public (no login required)

| Route | Description |
|---|---|
| `/` | Landing page — live alert preview, stats, how-it-works |
| `/public-view` | Full alerts listing with severity filters (all / critical / high / medium / low) |
| `/map` | Interactive Nepal map with alert pins colored by severity, hover for details |
| `/login` | Split-panel login page (branded left panel + form right) |
| `/register` | Registration page — always creates a `citizen` account |

### Authenticated (sidebar layout)

| Route | Roles | Description |
|---|---|---|
| `/dashboard` | All | Stats: open incidents, critical, resolved, alert count + official alerts panel |
| `/citizen` | citizen | Submit flood report + view/edit/delete own reports |
| `/authority` | authority, admin | Verification queue — verify, reject, dispatch, resolve reports |
| `/alerts` | All | View all published alerts; authority/admin also see the publish form |
| `/admin` | admin | User management + all reports table |

---

## API Endpoints

### Auth
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/login` | Public | Validate credentials, set httpOnly cookies |
| POST | `/api/register` | Public | Create citizen account (bcrypt hashed password) |

### Reports
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/api/report` | Auth | Citizens: own reports. Admin/Authority: all reports |
| POST | `/api/report` | Auth | Submit new flood report |
| PUT | `/api/report/[id]` | Owner or Admin/Authority | Edit report (pending only) |
| PATCH | `/api/report/[id]` | Authority, Admin | Update status (verified/responding/resolved/rejected) |
| DELETE | `/api/report/[id]` | Owner or Admin/Authority | Delete report (pending only) |

### Alerts
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/api/alerts` | Public | All alerts joined with issuer name |
| POST | `/api/alerts` | Authority, Admin | Publish new alert |

### Admin — Users
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/api/admin/users` | Admin | List all users |
| PUT | `/api/admin/users/[id]` | Admin | Change user role |
| PATCH | `/api/admin/users/[id]` | Admin | Reset password to `"floodwatch"` |
| DELETE | `/api/admin/users/[id]` | Admin | Delete user + cascade delete their reports (transaction) |

---

## Database Schema

Database: `FloodWatch` on MS SQL Server

### `users`
```sql
id          INT IDENTITY PRIMARY KEY
name        NVARCHAR(100)
email       NVARCHAR(255) UNIQUE
password    NVARCHAR(255)   -- bcrypt hashed
role        NVARCHAR(20)    -- 'citizen' | 'authority' | 'admin'
created_at  DATETIME2 DEFAULT GETDATE()
```

### `reports`
```sql
id            INT IDENTITY PRIMARY KEY
user_id       INT NULL (FK → users.id)
location      NVARCHAR(255)
description   NVARCHAR(MAX)
severity      NVARCHAR(20)   -- 'low' | 'medium' | 'high' | 'critical'
status        NVARCHAR(20)   -- 'pending' | 'verified' | 'responding' | 'resolved' | 'rejected'
District      NVARCHAR(100)
ContactNumber NVARCHAR(20)
WaterLevel    NVARCHAR(100)
created_at    DATETIME2 DEFAULT GETDATE()
```

### `flood_alerts`
```sql
id          INT IDENTITY PRIMARY KEY
title       NVARCHAR(255)
district    NVARCHAR(100)
area        NVARCHAR(255)
severity    NVARCHAR(20)
description NVARCHAR(MAX)
created_by  INT (FK → users.id)
created_at  DATETIME2 DEFAULT GETDATE()
```

---

## Role Permissions

| Feature | Citizen | Authority | Admin |
|---|---|---|---|
| View public alerts & map | ✅ | ✅ | ✅ |
| Submit flood report | ✅ | ✅ | ✅ |
| Edit/delete own pending report | ✅ | ✅ | ✅ |
| Edit/delete any pending report | ❌ | ✅ | ✅ |
| Verify / reject / resolve reports | ❌ | ✅ | ✅ |
| Publish official alerts | ❌ | ✅ | ✅ |
| View all reports | ❌ | ✅ | ✅ |
| Manage users (role, reset pw, delete) | ❌ | ❌ | ✅ |

---

## Report Lifecycle

```
pending → verified → responding → resolved
        ↘ rejected
```

Only authority and admin can move a report through this pipeline. Citizens can only edit or delete their own `pending` reports.

---

## Components

| Component | Description |
|---|---|
| `ReportForm` | Submit flood report — district, location, severity, water level, contact, description |
| `ReportsTable` | Tabular report list with inline edit modal and delete. Shows all relevant columns |
| `AlertForm` | Publish official alert — title, district, area, severity, message |
| `AlertsTable` | Table of alerts — title, description, district, area, severity, issued date |
| `UsersPanel` | Admin user list — role dropdown, reset password button, delete button |
| `NepalMap` | Leaflet map centered on Nepal. Pins per alert, color/size by severity. Tooltip on hover shows full details. Falls back to district centroid for positioning |

---

## Auth System

- **Cookies** (httpOnly): `user_id`, `user_role`, `user_name` — used by API routes and Next.js middleware
- **localStorage**: `user_role`, `user_name`, `user_id` — used by client-side UI for nav/role display
- **Middleware** (`middleware.ts`): Guards `/admin/*`, `/authority/*`, `/citizen/*` by cookie role
- **Password reset**: Admin can reset any user to default password `"floodwatch"`

---

## Setup

### 1. Database

Run in SQL Server Management Studio:

```sql
CREATE DATABASE FloodWatch;
GO
USE FloodWatch;

CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(255) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(20) DEFAULT 'citizen',
    created_at DATETIME2 DEFAULT GETDATE()
);

CREATE TABLE reports (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NULL,
    location NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    severity NVARCHAR(20) DEFAULT 'medium',
    status NVARCHAR(20) DEFAULT 'pending',
    District NVARCHAR(100) NULL,
    ContactNumber NVARCHAR(20) NULL,
    WaterLevel NVARCHAR(100) NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE flood_alerts (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(255) NOT NULL,
    district NVARCHAR(100) NULL,
    area NVARCHAR(255) NULL,
    severity NVARCHAR(20) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    created_by INT NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### 2. Environment

Create a `.env` file in the root:

```env
DB_CONNECTION_STRING=Server=localhost\SQLEXPRESS;Database=FloodWatch;Trusted_Connection=true;TrustServerCertificate=true;
```

Or update `lib/db.ts` directly with your SQL Server credentials.

### 3. Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@floodguard.com | pssword |
| Authority | authority@floodguard.com | pssword |
| Citizen | Register at `/register` | — |

> After login, admin and authority accounts must be manually seeded in the database with a bcrypt-hashed password.

---

## What's Working

- ✅ Public landing page with live alerts fetched from DB
- ✅ Public alerts page with severity filtering
- ✅ Interactive Nepal map with alert pins (district-based coordinates, all 77 districts)
- ✅ User registration and login with bcrypt
- ✅ Role-based routing and middleware protection
- ✅ Citizen report submission (with district, water level, contact)
- ✅ Report edit/delete (pending only, owner or admin/authority)
- ✅ Authority verification queue with full status pipeline
- ✅ Official alert publishing by authority/admin
- ✅ Admin user management (role change, password reset, delete with cascade)
- ✅ Beautiful split-panel login and register pages
- ✅ Role-adaptive sidebar navigation with active link highlighting
- ✅ Public navbar with active link highlighting across public pages

## What's Pending

- ⬜ Geolocation-based report pinning (use browser GPS for lat/lng on report submission)
- ⬜ Map showing both reports and alerts as separate pin types
- ⬜ Logout clearing server-side cookies (currently only clears localStorage)
- ⬜ Real-time updates (WebSocket or polling)
- ⬜ SMS/email notifications for critical alerts
