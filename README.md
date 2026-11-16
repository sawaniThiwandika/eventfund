# EventFund

EventFund is a web application for tracking the money of an event. A user creates an event,
invites other people as Editors or Viewers, records income and expenses with optional slips,
sees the current balance on a dashboard and downloads a PDF report. It runs as Docker containers
(Spring Boot backend, React frontend, PostgreSQL) and is deployed to AWS EC2.

## Features

✅ = done, ⏳ = planned

| Status | Feature |
|---|---|
| ⏳ | Register, log in and log out (JWT) |
| ⏳ | Create and manage several events; the creator becomes the event's Owner |
| ⏳ | Invite members by email as Editor or Viewer; accept or reject invitations |
| ⏳ | Per-event roles: Owner manages the event and members, Editor adds records, Viewer reads |
| ⏳ | Record income and expenses in LKR, with optional slip or bill uploads (JPG, PNG, PDF) |
| ⏳ | Dashboard with total income, total expenses, balance, a chart and recent records |
| ⏳ | Financial report with a date filter, downloadable as PDF |
| ✅ | Database schema with Flyway migrations |
| ✅ | Health endpoint (`/actuator/health`) |
| ✅ | Everything runs with Docker Compose |
| ✅ | CI on GitHub Actions (backend tests, frontend build, Docker build) |
| ✅ | Automatic deploy to AWS EC2 after CI passes on `main` |
| ⏳ | Monitoring with Prometheus and Grafana, alerts |
| ⏳ | Bash scripts for health checks and database backup / restore |

## Tech stack

| Area | Technology |
|---|---|
| Backend | Java 21, Spring Boot 3, Spring Security + JWT, Spring Data JPA |
| Database | PostgreSQL 16, Flyway |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Web server | nginx (serves the frontend and proxies `/api` to the backend) |
| Email | Mailpit locally, a real SMTP server in production |
| Containers | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Hosting | AWS EC2 (Ubuntu) |

## Architecture

```
Browser ──► frontend (nginx :80) ──/api──► backend (Spring Boot :8080) ──► postgres
                                                     │
                                                     ├──► uploads volume (slips and bills)
                                                     └──► SMTP (Mailpit locally)
```

## How to run

You only need **Docker** (Docker Desktop on Windows or macOS). Java, Maven and Node are not needed
on your machine.

1. Create your settings file and set at least `DB_PASSWORD` and `JWT_SECRET`:
   ```bash
   cp .env.example .env
   ```
2. Start everything:
   ```bash
   docker compose up --build
   ```
3. Open:

   | URL | What |
   |---|---|
   | http://localhost | EventFund app |
   | http://localhost:8080/actuator/health | Backend health (`{"status":"UP"}`) |
   | http://localhost:8025 | Mailpit, the inbox for test emails |

4. Stop with `Ctrl+C`, then `docker compose down`. Your data stays in Docker volumes.
   `docker compose down -v` also deletes the database and uploads.

The app needs ports **80, 8080, 8025** and **5432** to be free.

## Development commands

Maven and npm run inside Docker through small helper scripts.

| Bash / Git Bash | PowerShell | What it does |
|---|---|---|
| `scripts/mvn test` | `.\scripts\mvn test` | Run backend tests (uses a Postgres container) |
| `scripts/mvn package` | `.\scripts\mvn package` | Build the backend |
| `scripts/npm install` | `.\scripts\npm install` | Install frontend packages |
| `scripts/npm run build` | `.\scripts\npm run build` | Build the frontend |

Any Maven or npm arguments work the same way. To stop the dev database:
`docker compose -f docker-compose.dev.yml down`.

On Windows, allow PowerShell scripts once with
`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

## Deployment

Every push to `main` runs CI. If CI passes, the **Deploy** workflow:

1. copies the project to `~/eventfund` on the EC2 server with rsync (the server needs no GitHub access),
2. writes the server's `.env` from GitHub secrets,
3. runs `scripts/deploy.sh`, which starts `docker-compose.prod.yml` and waits until the backend is healthy.

Required GitHub secrets: `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY`, `DB_PASSWORD`, `JWT_SECRET`,
`GRAFANA_PASSWORD`. Optional: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and the
variable `FRONTEND_URL`.

## Project structure

```
backend/                  Spring Boot API (Maven)
frontend/                 React app (Vite) and nginx config
scripts/                  mvn / npm helpers and deploy.sh
infra/                    infrastructure config (monitoring, coming later)
docker-compose.yml        local stack: postgres, mailpit, backend, frontend
docker-compose.dev.yml    containers for running Maven and npm
docker-compose.prod.yml   production stack for the EC2 server
.github/workflows/        CI and deploy pipelines
```
