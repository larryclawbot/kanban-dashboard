# Kanban Dashboard

A full-stack Kanban board application built with NestJS, Next.js, and PostgreSQL.

## Tech Stack

- **Backend**: NestJS (Node.js)
- **Frontend**: Next.js 16 (React)
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

## Project Structure

```
kanban-dashboard/
├── backend/          # NestJS API server
├── frontend/         # Next.js frontend application
├── docker-compose.yml
└── README.md
```

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Git

### Running the Application

1. Clone the repository:
```bash
git clone https://github.com/your-username/kanban-dashboard.git
cd kanban-dashboard
```

2. Start all services with Docker Compose:
```bash
docker-compose up -d
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Development Mode

To run without Docker:

**Backend:**
```bash
cd backend
npm install
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| POSTGRES_USER | Database user | kanban |
| POSTGRES_PASSWORD | Database password | kanban123 |
| POSTGRES_DB | Database name | kanban |
| BACKEND_PORT | Backend server port | 3001 |
| NEXT_PUBLIC_API_URL | Backend API URL | http://localhost:3001 |

## Features (Planned)

- [ ] User Authentication
- [ ] Board Management
- [ ] Column Management
- [ ] Card Management
- [ ] Drag & Drop
- [ ] Labels & Due Dates
- [ ] Responsive Design

## Development Phases

1. **Phase 1**: Project Setup & Infrastructure ✓
2. **Phase 2**: Authentication & Users
3. **Phase 3**: Kanban Boards - Structure
4. **Phase 4**: Columns Management
5. **Phase 5**: Cards Management
6. **Phase 6**: Drag & Drop
7. **Phase 7**: Polish & Additional Features

## License

MIT
