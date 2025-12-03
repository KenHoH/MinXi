# 🎯 1. Frontend Architecture Rules

## 1.1 React Components

- Components must be < 200 lines
- One component = one responsibility
- UI components should NOT contain business logic
- Move all fetch logic to hooks
- Move reusable UI to `/components/ui`
- No circular imports
- Avoid passing deeply nested props → use context

## 1.2 React Hooks

- One hook = one responsibility (e.g., `useRooms`)
- Hooks must return stable shapes: `{ data, loading, error }`
- Never fetch inside components → always in hooks
- Avoid multiple effects that do similar logic → merge
- Use `useCallback` for event handlers
- Use `useMemo` for filtered/derived lists
- Use TypeScript properly (no `any`)

## 1.3 API Calls in Frontend

- Do NOT duplicate API calls — use caching or context
- Use a centralized service layer (`services/userService`)
- Group related API calls using `Promise.all`
- Avoid calling API in render phase
- Validate inputs on the frontend (basic sanitation)
- Avoid re-fetching the same data during navigation

## 1.4 State Management

- Global state: Only user, theme, permissions
- Local state: UI states (modal open, form input)
- Do not duplicate the same data in multiple states
- Derive state from props instead of storing it
- Store persistent data using context or global store (Zustand)

## 1.5 Code Quality

- Follow auto-formatting (Prettier + ESLint)
- Never write commented-out dead code
- Use clear naming:
  - `fetchX()` → API call
  - `loadX()` → cached or fetch
  - `getX()` → synchronous
- Separate UI from logic (container vs presentation components)
- Use feature-based architecture:
  - `/feature/chat`
  - `/feature/user`
  - `/feature/auth`

---

# 🧱 2. Backend Architecture Rules

## 2.1 Project Structure

- Use feature modules (Nest or Express domain modules)
- Every module has:
  - controller → service → repository → entity
- Keep controller thin (validation + routing only)
- Service contains business logic
- Repository handles DB access only

## 2.2 API Design Rules

- Return consistent response shapes:
  ```json
  {
    "success": true,
    "data": {},
    "error": null
  }
  ```
- Use versioning `/api/v1/...`
- Validate all requests with DTOs (`class-validator`)
- Never trust client input — sanitize everything
- Use meaningful routes:
  - `/users/:id/follow`
  - `/rooms/:id/messages`
  - `/auth/login`

## 2.3 Error Handling

- Always throw custom errors with context
- Never expose internal error messages to clients
- Return HTTP codes correctly:
  - `200` → success
  - `400` → bad request
  - `401` → unauthorized
  - `403` → forbidden
  - `404` → not found

## 2.4 Security Rules

- Sanitize inputs (SQL injection safe)
- Hash passwords (bcrypt)
- Use JWT with short expiration
- Rotate refresh tokens
- Do not store secrets in code (use `.env`)
- Rate-limit sensitive endpoints
- Validate file uploads (MIME + size)
- Implement CORS properly

## 2.5 Database Rules

- Avoid N+1 queries (use joins or prefetch)
- Use indexes on frequently queried fields
- Use migrations (prisma, typeorm)
- Always create unique constraints where logical
- Normalize but avoid over-normalization

---

# 🚀 3. API Communication Rules (FE ↔ BE)

- Minimize number of requests (batch where possible)
- Use SSE / WS only when necessary (chat, notifications)
- Use pagination for large lists
- Compress responses (gzip)
- Use ETag/If-None-Match for caching
- Use HTTP keep-alive for speed

---

# ⚡ 4. Performance Rules

- Avoid heavy computation in frontend render
- Memoize expensive operations
- Lazy load non-critical components (`React.lazy`)
- Use CDN for static assets
- Use caching headers in backend responses
- Minimize payload size (avoid sending unused fields)

---

# 🔍 5. Debugging Rules

- Add context to logs:
  ```javascript
  console.log("[Chat] new SSE message:", msg);
  ```
- Use logging levels: `debug`, `info`, `warn`, `error`
- Monitor backend with centralized logging (e.g., Winston)
- Use Postman/Insomnia for endpoint testing
- Check network tab for duplicate API calls
- Use React DevTools to inspect props/state

---

# 🧼 6. Documentation Rules (FE + BE)

- Each hook must have a short top comment:
  ```javascript
  /* Loads all user rooms (dm, groups, communities) */
  ```
- Each backend service method should describe business logic
- Keep README simple but complete (install, run, env)
- Document API endpoints in `/docs/api.md` or Swagger
- Add UML or architecture diagrams for complex systems
- Keep changelog of major updates

---

# 📝 7. Commit Message Rules

Use **Conventional Commits**:

- `feat:` → new feature
- `fix:` → bug fix
- `refactor:` → code improvement
- `perf:` → performance
- `docs:` → documentation
- `style:` → formatting
- `test:` → tests
- `chore:` → configs, build tools

**Format:**

```
type(scope): concise summary

optional details
```

**Examples:**

```
feat(chat): add message pagination
fix(auth): prevent infinite refresh loop
refactor(user): merge profile API calls
docs(README): update installation steps
```

---

# 📗 8. GitHub Repository Rules

- Use meaningful folder structure:
  ```
  frontend/
  backend/
  docs/
  ```
- Include GitHub workflow CI (lint + test)
- Setup issue templates
- Use meaningful branch names:
  - `feature/chat-sse`
  - `fix/user-profile-bug`
- Tag releases (`v1.0.0`)
- Use `.editorconfig` for consistent formatting
- Use `.gitignore` properly
- Require reviews before merging

---

# 🦾 9. Team / Project Workflow Rules

- Avoid pushing directly to main
- Small PRs (< 300 lines)
- Stick to consistent coding style
- Favor clarity over cleverness

---

# ⭐ FINAL VERSION: 20 Super-Compact Rules (For Daily Use)

## 🔥 Frontend

- Fetch once, reuse many times
- Use hooks for all logic
- Keep components small
- Memoize expensive operations
- No inline fetch or business logic in components

## 🔥 Backend

- Controller → service → repository structure
- Only services contain business logic
- Validate input always
- Use consistent response shapes
- Protect sensitive endpoints & sanitize

## 🔥 API

- Merge calls (`Promise.all`)
- Paginate large data
- Avoid repeated requests
- Cache frequently used data

## 🔥 Debug

- Tag all logs
- Use DevTools + network panel
- Never ignore caught errors

## 🔥 Documentation & Git

- Use conventional commits
- Document hooks & services
- Keep README simple but complete
