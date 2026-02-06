# Kanban Dashboard - Project Documentation

## Overview
A full-stack Kanban board application with user authentication, board management, and drag-and-drop functionality.

**Repository:** https://github.com/larryclawbot/kanban-dashboard

---

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **NestJS** | Node.js framework |
| **TypeORM** | Database ORM |
| **PostgreSQL** | Database |
| **Passport + JWT** | Authentication |
| **Docker** | Containerization |

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework (App Router) |
| **React 19** | UI library |
| **TypeScript 5** | Type safety |
| **Tailwind CSS 4** | Styling |
| **shadcn/ui** | UI components |
| **TanStack Query** | Data fetching/caching |
| **Axios** | HTTP client |
| **js-cookie** | Cookie management |
| **Docker** | Containerization |

---

## Project Structure

```
kanban-dashboard/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/          # Authentication (JWT)
│   │   ├── users/         # User management
│   │   ├── app.module.ts   # Root module
│   │   └── main.ts        # Entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/               # Next.js App
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   │   ├── page.tsx   # Home (boards list)
│   │   │   ├── login/     # Login page
│   │   │   └── register/  # Registration page
│   │   ├── contexts/      # React Contexts
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/         # Custom hooks
│   │   │   ├── useAuth.ts
│   │   │   └── useBoards.ts
│   │   ├── providers/     # Context providers
│   │   │   └── QueryProvider.tsx
│   │   ├── components/    # UI components
│   │   │   └── ui/       # shadcn/ui components
│   │   └── lib/          # Utilities
│   │       └── api.ts    # Axios client
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env
└── README.md
```

---

## Development Phases

### Phase 1: Project Setup & Infrastructure ✅
- Created NestJS backend with TypeScript
- Created Next.js frontend with Tailwind CSS
- Set up Docker Compose with PostgreSQL
- Configured networking between services
- Git repository initialized

### Phase 2: Authentication & Users ✅
**Backend:**
- `User` entity with email, password (bcrypt hashed), name
- `POST /auth/register` - Create new user
- `POST /auth/login` - Login, returns JWT token
- `GET /users/me` - Get current user (protected)
- JWT authentication with Passport

**Frontend:**
- Login page (`/login`)
- Registration page (`/register`)
- AuthContext for state management
- Cookie-based session persistence

### Phase 3: TanStack Query Integration ✅
- Installed `@tanstack/react-query`
- Created QueryProvider with configured QueryClient
- Created custom hooks:
  - `useLogin()` - Login mutation
  - `useRegister()` - Registration mutation
  - `useLogout()` - Logout mutation
  - `useUser()` - Fetch current user
  - `useBoards()` - Fetch boards (ready for Phase 4)
  - `useCreateBoard()` - Create board mutation
  - `useUpdateBoard()` - Update board mutation
  - `useDeleteBoard()` - Delete board mutation

### Phase 4: Kanban Boards - Structure (Next)
- Create Board, Column, Card entities
- Board CRUD API endpoints
- Board list page with TanStack Query
- Board detail view
- Create/Edit/Delete boards UI

---

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login | No |
| GET | `/users/me` | Get current user | Yes (JWT) |

### Boards (Phase 4 - Planned)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/boards` | List user's boards | Yes |
| POST | `/boards` | Create board | Yes |
| GET | `/boards/:id` | Get single board | Yes |
| PUT | `/boards/:id` | Update board | Yes |
| DELETE | `/boards/:id` | Delete board | Yes |

---

## Database Schema

```
users
  - id: uuid (PK)
  - email: varchar (unique)
  - password: varchar
  - name: varchar
  - createdAt: timestamp
  - updatedAt: timestamp

boards (Phase 4)
  - id: uuid (PK)
  - name: varchar
  - description: text (nullable)
  - userId: uuid (FK)
  - createdAt: timestamp
  - updatedAt: timestamp

columns (Phase 5)
  - id: uuid (PK)
  - name: varchar
  - position: integer
  - boardId: uuid (FK)
  - createdAt: timestamp

cards (Phase 6)
  - id: uuid (PK)
  - title: varchar
  - description: text (nullable)
  - position: integer
  - columnId: uuid (FK)
  - dueDate: timestamp (nullable)
  - createdAt: timestamp
```

---

## Configuration

### Environment Variables

```env
# Database
POSTGRES_USER=kanban
POSTGRES_PASSWORD=kanban123
POSTGRES_DB=kanban

# Backend
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=kanban-jwt-secret-key

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Running the Project

### With Docker
```bash
cd kanban-dashboard
docker compose up -d
```

**Services:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Database: localhost:5432

### Development (Local)
```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

---

## Key Decisions Made

1. **shadcn/ui** - Chosen for UI components (not a traditional npm library, copy/paste components)
2. **TanStack Query** - For server state management (caching, mutations)
3. **Context API** - For auth state (simpler than Redux for this use case)
4. **js-cookie** - For JWT token storage (cookies work better than localStorage for this case)
5. **TypeORM** - Database ORM for NestJS (good integration)
6. **JWT with 7-day expiry** - Balance between security and convenience
7. **Docker Compose** - Orchestrates all 3 services (frontend, backend, db)

---

## Frontend State Management

**TanStack Query** handles:
- Server data (boards, cards, user)
- Caching and automatic refetching
- Loading/error states
- Optimistic updates

**Context API** handles:
- Auth state (user, token, login/logout)
- UI state (sidebar, modals) - if added later

---

## Testing Authentication

```bash
# Register
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get current user (with token)
curl http://localhost:3001/users/me \
  -H "Authorization: Bearer <token>"
```

---

## What's Next (Phase 4)

1. Create Board, Column, Card entities in backend
2. Implement Board CRUD API
3. Create Board list page (useBoards hook)
4. Create Board detail page
5. Add Create/Edit/Delete board dialogs (shadcn/ui Dialog)

---

## Common Issues & Solutions

1. **Auth persistence not working** - Fixed by improving AuthContext initialization and using cookies for token storage
2. **Docker networking** - Backend and database must be on same network (`kanban-dashboard_kanban-network`)
3. **ngrok limit** - Free account only allows 1 tunnel at a time

---

## Git Workflow

1. Each phase is a separate commit
2. Commits include clear messages: `feat: Phase X - Description`
3. Push to `main` branch after each phase
4. GitHub: https://github.com/larryclawbot/kanban-dashboard

---

## Useful Commands

```bash
# View logs
docker logs kanban-frontend
docker logs kanban-backend
docker logs kanban-db

# Restart containers
docker compose restart

# Rebuild after code changes
docker compose build
docker compose up -d --force-recreate

# Check running containers
docker ps

# Check network
docker network ls
docker network inspect kanban-dashboard_kanban-network
```
