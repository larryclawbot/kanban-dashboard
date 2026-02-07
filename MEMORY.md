# Kanban Dashboard Project - MEMORY

## Project Overview
Full-stack Kanban board application being built incrementally.

**Repository:** https://github.com/larryclawbot/kanban-dashboard
**User:** Kairat (@kainisoft)

## Tech Stack Decisions

### Backend
- **NestJS** - Node.js framework with TypeScript
- **Drizzle ORM** - Database ORM with PostgreSQL (switched from TypeORM in Phase 3.5)
- **Passport + JWT** - Authentication strategy
- **Docker** - Containerization

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **@dnd-kit** - Drag and drop library (installed, ready for UI)
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
- Boards hooks: useBoards, useCreateBoard, useUpdateBoard, useDeleteBoard
- API updates with boards endpoints

### Phase 3.5: Drizzle ORM Migration ✅
- Switched from TypeORM to Drizzle ORM
- Created `@kanban/database` library at `backend/libs/database/`
- CommonJS module (required for drizzle-orm compatibility)
- Database service and repository pattern

### Phase 4.1: Boards Module ✅
- GET/POST/PUT/DELETE /boards endpoints
- JWT protected
- Board entity with name, description, userId

### Phase 4.2: Columns Module ✅
- GET/POST/PUT/DELETE /columns endpoints
- JWT + ownership protected
- Column entity with name, position, boardId

### Phase 4.3: Cards Module ✅
- GET/POST/PUT/DELETE /cards endpoints
- JWT + ownership protected
- Card entity with title, description, position, columnId, dueDate

### Phase 4.4: Board Ownership & Permissions ✅
- Ownership checks cascade: Cards → Columns → Boards
- 403 Forbidden for non-owners accessing boards they don't own
- Middleware/Guards implemented for all protected endpoints

### Phase 4.5: Drag & Drop Reordering ✅ (Backend)
- `PUT /columns/:id/move` - Reorder column (body: `{position}`)
- `PUT /cards/:id/move` - Move card (body: `{columnId?, position?}`)

## Current Status

### Phase 4.5.2: Frontend Drag & Drop UI - NOT STARTED (Reset)
- Backend move endpoints ready
- @dnd-kit installed
- UI implementation reset - needs to be rebuilt

### Frontend Hooks Available
- `useBoards`, `useCreateBoard`, `useUpdateBoard`, `useDeleteBoard`
- `useColumns`, `useColumn`, `useCreateColumn`, `useUpdateColumn`, `useDeleteColumn`, `useMoveColumn`
- `useCards`, `useCard`, `useCreateCard`, `useUpdateCard`, `useDeleteCard`, `useMoveCard`

## Database Schema (Drizzle)

### Users
```
id: uuid (PK)
email: unique
password: varchar
name
created_at, updated_at
```

### Boards
```
id: uuid (PK)
name: varchar
description: text
user_id: uuid (FK -> users)
created_at, updated_at
```

### Columns
```
id: uuid (PK)
name: varchar
position: integer
board_id: uuid (FK -> boards)
created_at, updated_at
```

### Cards
```
id: uuid (PK)
title: varchar
description: text
position: integer
column_id: uuid (FK -> columns)
due_date: timestamp
created_at, updated_at
```

## Key Decisions

1. **@dnd-kit** - For drag and drop (modern, accessible)
2. **Drizzle ORM** - Lighter, faster than TypeORM
3. **Library structure** - `@kanban/database` as internal package
4. **CommonJS module** - Required for drizzle-orm compatibility
5. **Ownership cascade** - Cards verify column → column verifies board → board verifies user
6. **Cookies** - For JWT storage (better than localStorage)
7. **JWT 7-day expiry** - Balance security/convenience

## API Endpoints

### Auth
- POST /auth/register
- POST /auth/login
- GET /users/me (protected)

### Boards
- GET /boards
- POST /boards
- GET /boards/:id
- PUT /boards/:id
- DELETE /boards/:id

### Columns
- GET /columns (query: boardId)
- POST /columns
- GET /columns/:id
- PUT /columns/:id
- DELETE /columns/:id
- PUT /columns/:id/move (body: {position})

### Cards
- GET /cards (query: columnId)
- POST /cards
- GET /cards/:id
- PUT /cards/:id
- DELETE /cards/:id
- PUT /cards/:id/move (body: {columnId?, position?})

## Running the Project

```bash
cd kanban-dashboard
docker compose up -d
```

**URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Database: localhost:5432

## Git

- Branch: main
- Commits per phase
- Push after each phase completion

## Next Steps

1. Rebuild Phase 4.5.2: Frontend Drag & Drop UI
   - Board list view with draggable columns
   - Column view with draggable cards
   - Use @dnd-kit for drag functionality
   - Connect to move endpoints (PUT /columns/:id/move, PUT /cards/:id/move)
   - Components needed: Board, Column, Card (sortable)
   - Pages needed: /boards (list), /boards/[id] (board view)
