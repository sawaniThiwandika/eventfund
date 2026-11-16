# EventFund

EventFund is a web application for managing the money of an event. A user creates an event,
invites other people as Editors or Viewers, records income and expenses with optional slips,
sees the current balance on a dashboard and downloads a PDF report.

It is built for university events, workshops, hackathons and seminars, where several people need
a shared and clear view of the event's finances.

## Features

- **Accounts** – register, log in and log out
- **Events** – create and manage several events; the creator becomes the event's Owner
- **Members and roles** – invite people by email as Editor or Viewer; roles apply per event
  - *Owner* manages the event and its members
  - *Editor* adds income and expenses
  - *Viewer* has read-only access
- **Income and expenses** – amounts in LKR, with optional slip or bill uploads (JPG, PNG, PDF)
- **Dashboard** – total income, total expenses, balance, a chart and recent records
- **Reports** – filter by date range and download as PDF
- **Operations** – health checks, monitoring with Prometheus and Grafana, automated CI/CD

## Tech stack

| Area | Technology |
|---|---|
| Backend | Java 21, Spring Boot 3, Spring Security + JWT, Spring Data JPA |
| Database | PostgreSQL 16, Flyway |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Web server | nginx |
| Containers | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Hosting | AWS EC2 |

## Architecture

```
Browser ──► frontend (nginx :80) ──/api──► backend (Spring Boot :8080) ──► PostgreSQL
                                                     │
                                                     ├──► file storage (slips and bills)
                                                     └──► SMTP (invitation emails)
```

nginx serves the React app and forwards `/api` requests to the backend.

## Getting started

The only requirement is **Docker** (with Docker Compose).

1. Clone the repository and create a settings file:
   ```bash
   git clone <repository-url>
   cd eventfund
   cp .env.example .env
   ```
2. Edit `.env` and set at least `DB_PASSWORD` and `JWT_SECRET`.
3. Start the application:
   ```bash
   docker compose up --build
   ```
4. Open:

   | URL | What |
   |---|---|
   | http://localhost | EventFund |
   | http://localhost:8080/actuator/health | Backend health check |
   | http://localhost:8025 | Mailpit – catches emails sent in development |

Stop with `Ctrl+C` and `docker compose down`. Data is kept in Docker volumes;
`docker compose down -v` removes it.

## Development

Maven and npm run inside Docker containers, so Java and Node do not need to be installed.

| Bash | PowerShell | What it does |
|---|---|---|
| `scripts/mvn test` | `.\scripts\mvn test` | Run backend tests |
| `scripts/mvn package` | `.\scripts\mvn package` | Build the backend |
| `scripts/npm install` | `.\scripts\npm install` | Install frontend packages |
| `scripts/npm run build` | `.\scripts\npm run build` | Build the frontend |

## Deployment

Every push to `main` runs the CI pipeline (backend tests, frontend build, Docker build).
When CI passes, GitHub Actions deploys the application to an AWS EC2 server with
`docker-compose.prod.yml`.

## Project structure

```
backend/                  Spring Boot API
frontend/                 React app and nginx config
scripts/                  helper and deployment scripts
infra/                    infrastructure configuration
docker-compose.yml        local development stack
docker-compose.dev.yml    containers for running Maven and npm
docker-compose.prod.yml   production stack
.github/workflows/        CI and deployment pipelines
```

## License

See [LICENSE](LICENSE).

