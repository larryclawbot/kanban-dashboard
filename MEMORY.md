# Kanban Dashboard Project - MEMORY

## Project Overview
Full-stack Kanban board application being built incrementally.

**Repository:** https://github.com/larryclawbot/kanban-dashboard
**User:** Kairat (@kainisoft)

## Tech Stack Decisions

### Backend
- **NestJS** - Node.js framework with TypeScript
- **TypeORM** - Database ORM with PostgreSQL
- **Passport + JWT** - Authentication strategy
- **Docker** - Containerization

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - UI component library (copy/paste, not npm package)
- **TanStack Query** - Server state management, caching
- **Axios** - HTTP client
- **js-cookie** - Cookie-based JWT storage

## Completed Phases

### Phase 1: Project Setup ✅
- NestJS backend with TypeScript
- Next.js frontend with Tailwind CSS
- Docker Compose with PostgreSQL
- Git repository initialized

### Phase 2: Authentication ✅
- User entity (email, password, name)
- Register/Login endpoints with JWT
- Protected routes with AuthGuard
- Frontend login/register pages
- AuthContext for state management

### Phase 3: TanStack Query Integration ✅
- QueryProvider with QueryClient
- Custom hooks: useLogin, useRegister, useLogout, useUser
- Boards hooks: useBoards, useCreateBoard, useUpdateBoard, useDeleteBoard (ready)
- API updates with boards endpoints

## Database Schema

### Users (Done)
```
id: uuid
email: unique
password: hashed
name
createdAt, updatedAt
```

### Boards (Phase 4 - Planned)
```
id: uuid
name
description
userId: FK -> users
position
createdAt, updatedAt
```

### Columns (Phase 5)
```
id: uuid
name
position
boardId: FK -> boards
```

### Cards (Phase 6)
```
id: uuid
title
description
position
columnId: FK -> columns
dueDate
```

## Key Decisions

1. **shadcn/ui** - Preferred over traditional component libraries for flexibility
2. **TanStack Query** - For server state, NOT Zustand (user asked, explained difference)
3. **Context API** - For auth state (simpler than Redux)
4. **Cookies** - For JWT storage (better than localStorage)
5. **JWT 7-day expiry** - Balance security/convenience
6. **TypeORM** - Native NestJS integration
7. **Docker Compose** - Orchestrates all 3 services

## Running the Project

```bash
cd kanban-dashboard
docker compose up -d
```

**URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Database: localhost:5432

## API Endpoints

### Auth
- POST /auth/register
- POST /auth/login
- GET /users/me (protected)

### Boards (Phase 4)
- GET /boards
- POST /boards
- GET /boards/:id
- PUT /boards/:id
- DELETE /boards/:id

## Current Status

- **Frontend running:** Docker container (kanban-frontend)
- **Backend running:** Docker container (kanban-backend)
- **Database running:** Docker container (kanban-db)
- **Auth fixed:** Persistence now works (was redirecting on refresh, fixed AuthContext)
- **Phase 4 next:** Board CRUD API + UI

## Common Issues Fixed

1. **Auth persistence** - AuthContext now initializes properly and fetches user on mount
2. **Docker networking** - Backend connects to db via `kanban-dashboard_kanban-network`
3. **ngrok** - Free account only allows 1 tunnel at a time

## Documentation

Full documentation: `docs/PROJECT.md`

## Git

- Branch: main
- Commits per phase
- Push after each phase completion
