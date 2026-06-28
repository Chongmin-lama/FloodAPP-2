# 🌊 FloodWatch — Cloud-Based Flood Alert System
### CT071-3-3-DDAC Group Project | Problem Background #4

---

## Tech Stack
- **Frontend**: React 18, React Router v6
- **Backend**: Node.js, Express.js
- **Database**: AWS RDS (MySQL 8)
- **Deployment**: AWS Elastic Beanstalk
- **Auth**: JWT (JSON Web Tokens)

---

## Project Structure

```
floodwatch/
├── backend/
│   ├── config/
│   │   ├── db.js          # AWS RDS connection pool
│   │   └── schema.sql     # Database schema + seed data
│   ├── middleware/
│   │   └── auth.js        # JWT middleware
│   ├── routes/
│   │   ├── auth.js        # Register / Login
│   │   ├── alerts.js      # Flood alerts CRUD
│   │   ├── reports.js     # Flood report submissions
│   │   ├── shelters.js    # Evacuation shelters
│   │   ├── contacts.js    # Emergency contacts
│   │   └── admin.js       # Admin stats + user management
│   ├── server.js          # Express entry point
│   └── .env.example       # Environment variables template
├── frontend/
│   ├── public/
│   └── src/
│       ├── pages/
│       │   ├── Home.js
│       │   ├── Alerts.js
│       │   ├── Shelters.js
│       │   ├── Contacts.js
│       │   ├── ReportFlood.js
│       │   ├── Login.js
│       │   ├── AdminDashboard.js
│       │   ├── AdminAlerts.js
│       │   ├── AdminReports.js
│       │   ├── AdminShelters.js
│       │   └── AdminUsers.js
│       ├── components/
│       │   └── Navbar.js
│       ├── context/
│       │   └── AuthContext.js  # Global login state
│       ├── api.js              # Axios with JWT header
│       └── App.js              # Routes
├── .ebextensions/
│   └── nodecommand.config  # Elastic Beanstalk config
├── Procfile
└── package.json
```

---

## Workload Matrix

| Feature | Member | Role | Pages |
|---------|--------|------|-------|
| Flood alert CRUD, User management | Member 1 | Admin | AdminAlerts, AdminUsers |
| Report submission form, Report review dashboard | Member 2 | Reporter | ReportFlood, AdminReports |
| Register/Login (auth), Alerts list + filter | Member 3 | User | Login, Alerts |
| Evacuation shelters, Emergency contacts | Member 4 | Info | Shelters, Contacts, AdminShelters |

---

## Setup Instructions

### Step 1 — Set up AWS RDS (MySQL)

1. Go to AWS Console → RDS → Create Database
2. Choose **MySQL 8**, Free Tier (db.t3.micro)
3. Set DB name: `floodwatch`, username: `admin`, set a strong password
4. Under **Connectivity**, allow public access (for setup only), add your IP to Security Group
5. After creation, copy the **Endpoint URL**
6. Connect with MySQL client and run: `schema.sql` from `backend/config/`

### Step 2 — Configure environment variables

```bash
cd backend
cp .env.example .env
# Edit .env with your RDS endpoint, password, and JWT secret
```

### Step 3 — Run locally

```bash
# Install all dependencies
npm run install-all

# Terminal 1: Backend (http://localhost:5000)
npm run dev-backend

# Terminal 2: Frontend (http://localhost:3000)
npm run dev-frontend
```

### Step 4 — Deploy to AWS Elastic Beanstalk

1. Build frontend: `npm run build`
2. Zip entire project: `zip -r floodwatch.zip . -x "*/node_modules/*" "*/build/*" ".git/*"`
3. Go to AWS Console → Elastic Beanstalk → Create Application
4. Platform: **Node.js**, upload the zip
5. Add Environment Variables in EB Console (same as .env values)
6. Deploy!

---

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | Public | Register user |
| POST | /api/auth/login | Public | Login |
| GET | /api/alerts | Public | List alerts (filter: region, severity, status) |
| POST | /api/alerts | Admin | Create alert |
| PUT | /api/alerts/:id | Admin | Update alert |
| DELETE | /api/alerts/:id | Admin | Delete alert |
| POST | /api/reports | Public | Submit flood report |
| GET | /api/reports | Admin | List reports |
| PUT | /api/reports/:id/review | Admin | Approve/reject report |
| GET | /api/shelters | Public | List shelters |
| POST | /api/shelters | Admin | Add shelter |
| PUT | /api/shelters/:id | Admin | Update shelter |
| DELETE | /api/shelters/:id | Admin | Delete shelter |
| GET | /api/contacts | Public | List emergency contacts |
| POST | /api/contacts | Admin | Add contact |
| GET | /api/admin/stats | Admin | Dashboard stats |
| GET | /api/admin/users | Admin | List all users |
| DELETE | /api/admin/users/:id | Admin | Delete user |

---

## Default Admin Account
- **Email**: admin@floodwatch.com
- **Password**: Admin@1234

⚠️ Change this password immediately after deployment!

---

## Task 2 Preparation Notes

The backend routes are already modular — each file (`alerts.js`, `reports.js`, etc.) maps directly to a future Lambda function. For Task 2:
- Wrap each route file as an **AWS Lambda**
- Put **API Gateway** in front
- Add **SNS** to send email alerts when a critical alert is created
- Use **S3** to store flood report attachments
- Monitor with **CloudWatch**
