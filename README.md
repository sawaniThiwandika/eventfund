# EventFund

EventFund is a web application for tracking the money of an event. A user creates an event,
invites other people as Editors or Viewers, records income and expenses with optional slips,
sees the current balance on a dashboard and downloads a PDF report. It runs as Docker containers
(Spring Boot backend, React frontend, PostgreSQL) and is deployed to AWS EC2.

## How to run

_Coming soon._

## Commands

Maven and npm run inside Docker, so you only need Docker installed. First copy `.env.example`
to `.env` and set `DB_PASSWORD`.

| Bash / Git Bash        | PowerShell              | What it does                     |
|------------------------|-------------------------|----------------------------------|
| `scripts/mvn test`     | `.\scripts\mvn test`    | Run backend tests (uses Postgres)|
| `scripts/mvn package`  | `.\scripts\mvn package` | Build the backend                |
| `scripts/npm install`  | `.\scripts\npm install` | Install frontend packages        |
| `scripts/npm run build`| `.\scripts\npm run build`| Build the frontend              |

Any Maven or npm arguments work the same way. To stop the dev database:
`docker compose -f docker-compose.dev.yml down`.
