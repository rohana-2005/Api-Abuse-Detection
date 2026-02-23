# 🛡️ API Abuse Detection

Lightweight, real-time API monitoring and abuse detection system with a dashboard for security teams.

---

## 🏗️ Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | Next.js 16.1.6 (App Router), React 19, Tailwind CSS, Recharts |
| **Backend** | Spring Boot 4.0.2, Java 17, JPA, Spring Security |
| **Database** | PostgreSQL (AWS RDS) |
| **Deployment** | Docker (backend), Vercel (frontend), AWS EC2 |

---

## 💡 Use Case

Monitor incoming API traffic in real-time to:
- 🔍 Detect suspicious IPs and brute-force attempts
- ⚡ Identify DDoS/traffic spike patterns
- 🔐 Flag endpoint scanning and API scraping
- 📊 View live analytics on a clean dashboard
- 🛑 Block and manage high-risk IPs

### Dashboard Preview
![API Abuse Monitoring Dashboard](./image.png)

---

## 🌐 Architecture & Deployment

```
GitHub (main branch)
├── Frontend: api-abuse-dashboard → Vercel (auto-deploy)
└── Backend: api-abuse-monitor → Docker → AWS EC2

Database: AWS RDS (PostgreSQL)
  └── Connected via application.properties config
```

**Flow:**
1. All incoming API requests → `RequestLoggingFilter` logs to RDS
2. `AnalyticsService` aggregates data (per-minute traffic, top IPs, risk scores)
3. `DashboardController` exposes endpoints for frontend
4. Frontend (Vercel) fetches from EC2 backend API

---

## 📡 API Endpoints

### Dashboard Summary
| Method | Endpoint | Purpose |
|--------|----------|---------|
| **GET** | `/` | Health check |
| **GET** | `/api/dashboard/summary` | 📊 All data in one call (main) |
| **GET** | `/api/dashboard/total-requests` | Total requests today |
| **GET** | `/api/dashboard/traffic` | Requests per minute (last hour) |
| **GET** | `/api/dashboard/top-ips` | 🚨 Top offending IPs |
| **GET** | `/api/dashboard/endpoint-stats` | 📈 Endpoint attack stats |
| **GET** | `/api/dashboard/failed-logins` | Failed login attempts |
| **GET** | `/api/dashboard/threats` | Active threats & suspicious IPs |
| **GET** | `/api/dashboard/risk-scores` | IP risk scoring |

### Security & Detection
| Method | Endpoint | Purpose |
|--------|----------|---------|
| **GET** | `/api/security/suspicious` | Suspicious IPs (real-time) |

### Logging & Utilities
| Method | Endpoint | Purpose |
|--------|----------|---------|
| **GET** | `/api/products` | 🔍 Test endpoint (logged) |
| **POST** | `/api/login` | 🔐 Test login (logged) |
| **GET** | `/api/profile` | 👤 Test endpoint (logged) |
| **GET** | `/api/search` | 🔎 Test endpoint (logged) |
| **GET** | `/api/logs` | 📋 Raw request logs |

---

## 🚀 Quick Start

### Backend (Docker, local)
```bash
cd api-abuse-monitor
docker build -t api-abuse-monitor:latest .
docker run -p 8081:8080 api-abuse-monitor:latest
```

### Frontend (local dev)
```bash
cd api-abuse-dashboard
npm install
npm run dev
```
Then visit `http://localhost:3000`

---

## ☁️ AWS Deployment

### Database
- **Service:** AWS RDS (PostgreSQL)
- **Config in:** `api-abuse-monitor/src/main/resources/application.properties`
- **Creds:** Use `application-secret.properties` (gitignored) or RDS endpoint/password

### Backend
- **Service:** AWS EC2 (Ubuntu or Amazon Linux)
- **Deploy:** Build Docker image locally, push to ECR (or DockerHub), pull & run on EC2
- **Port:** 8080 (exposed)
- **Security Group:** Allow inbound on :8080, :22

**Sample EC2 deployment:**
```bash
# SSH into EC2
ssh -i your-key.pem ec2-user@<EC2-IP>

# Pull & run Docker image
docker pull your-registry/api-abuse-monitor:latest
docker run -d -p 8080:8080 -e SPRING_DATASOURCE_URL=jdbc:postgresql://<RDS-HOST>:5432/postgres your-registry/api-abuse-monitor:latest
```

### Frontend
- **Service:** Vercel (auto-deploy from GitHub)
- **Env Vars:** Set `NEXT_PUBLIC_API_URL=http://<EC2-IP>:8080` in Vercel

---

## 🔐 Environment & Secrets

**Do NOT commit:**
- `.pem` keys, `.env` files
- Database passwords, API tokens
- `application-secret.properties`

**Store in:**
- AWS EC2: set as environment variables or in `~/.env`
- AWS RDS: use parameter store or Secrets Manager
- Vercel: use Environment Variables dashboard

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `api-abuse-monitor/Dockerfile` | Backend container image definition |
| `api-abuse-monitor/src/main/resources/application.properties` | Spring config, RDS connection |
| `api-abuse-dashboard/app/` | Next.js App Router pages & components |
| `.gitignore` (root) | Ignore build, secrets, IDE, OS files |

---

## 📋 Pipeline Summary

1. **Dev pushes** → GitHub main
2. **Frontend auto-deploys** via Vercel
3. **Backend** → Build Docker image → Push to registry → Pull on EC2 → Run container
4. **DB** → RDS always available, accessed via connection string in `application.properties`

---

**Need help?** Check EC2 security groups, RDS connection string, and Vercel logs if issues arise.
**Contact / Next Steps:**
