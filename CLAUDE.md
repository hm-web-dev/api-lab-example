# CLAUDE.md — api-lab-example

This file provides context for AI assistants working in this repository.

## Project Overview

A community book-trading REST API built with Node.js, Express, and TypeScript, backed by a pre-populated SQLite database. Users can search books, create accounts, and post/claim trades. This is an educational project (school lab assignment) and is actively under development.

## Running the App

```bash
npm install          # install dependencies
npm run dev          # start dev server with auto-reload via ts-node (port 3999)
npm run build        # compile TypeScript to dist/
npm run start        # run compiled output from dist/
npm run typecheck    # type-check without emitting files
```

There is no test runner configured. The `npm test` script is a placeholder that exits with an error.

## Repository Structure

```
api-lab-example/
├── src/
│   ├── index.ts          # Express app entry point — middleware + route definitions
│   ├── db.ts             # All database query functions (SQLite3)
│   ├── search.ts         # Validation middleware that wraps db search calls
│   ├── cart.ts           # Empty placeholder for future cart functionality
│   └── types.ts          # Shared TypeScript interfaces (Customer, Trade, BookResult)
├── dist/                 # Compiled JS output (gitignored — run `npm run build` to generate)
├── api-lab-example.db    # Pre-populated SQLite database (do not delete)
├── bookstore_api.drawio  # ERD diagram (open in draw.io)
├── tsconfig.json         # TypeScript compiler configuration
├── package.json
└── README.md
```

## Architecture

### Request Flow

```
HTTP Request → src/index.ts route → src/search.ts (validation, search routes only) → src/db.ts (query) → response
```

- **src/index.ts**: Registers middleware (JSON parsing, CORS) and mounts all routes. No business logic lives here.
- **src/search.ts**: Input validation layer. Currently validates that search strings are defined and longer than 3 characters before forwarding to `db.ts`.
- **src/db.ts**: All SQL queries. Functions are Express route handlers (`(req: Request, res: Response): void`) and are exported for use as route callbacks.
- **src/types.ts**: Shared interfaces — `Customer`, `Trade`, `BookResult`. Import from here when working with DB results.
- **src/cart.ts**: Empty file — intended for a future shopping cart feature.

### TypeScript Configuration

- **strict mode** enabled — all types must be explicit
- **esModuleInterop** enabled — use `import x from 'y'` syntax throughout
- **rootDir**: `./src`, **outDir**: `./dist`
- The SQLite DB file path uses `path.join(__dirname, '..', 'api-lab-example.db')` so it resolves correctly whether running via `ts-node src/` or compiled `node dist/`

### Database

- SQLite3 file: `api-lab-example.db` (project root)
- Connection opened once at module load in `src/db.ts`
- Uses the callback-based `sqlite3` API (`db.run`, `db.get`, `db.all`)
- **Always use parameterized queries** (`?` placeholders) — the existing code does this consistently

**Known tables** (inferred from queries):

| Table | Key Columns |
|---|---|
| `customer` | `customer_id`, `first_name`, `last_name`, `email` |
| `trade` | `trade_id`, `lender_id`, `borrower_id`, `book_id`, `status`, `created_at` |
| `book` | `book_id`, `title` |
| `author` | `author_id`, `author_name` |
| `book_author` | `book_id`, `author_id` (join table) |

Trade `status` starts as `'pending'` on creation. Valid values are defined in the `Trade` interface: `'pending' | 'claimed' | 'cancelled' | 'delivered'`.

## Implemented Endpoints

| Method | Path | Handler | Description |
|---|---|---|---|
| GET | `/` | inline | Health check — returns `{"welcome": "it works"}` |
| POST | `/user/create` | `db.createUser` | Create a new customer |
| GET | `/user/:id` | `db.getUser` | Get customer by ID |
| GET | `/search/author` | `search.authorFilter` | Search books by author name (JSON body: `{"author": "..."}`) |
| GET | `/search/book` | `search.bookFilter` | Search books by title (JSON body: `{"book": "..."}`) |
| GET | `/user/:id/trades` | `db.getUserTrades` | Get all trades where user is lender or borrower |
| POST | `/trade/create` | `db.createTrade` | Create a new trade |

### Request/Response Examples

**POST /user/create**
```json
// Request body
{ "first_name": "Jane", "last_name": "Doe", "email": "jane@example.com" }
// Response
{ "id": 42 }
```

**GET /search/author** (note: uses JSON body on a GET request)
```json
// Request body
{ "author": "tolkien" }
// Response — array of books
[{ "title": "...", "author_name": "...", "book_id": 1, "author_id": 5 }]
```

**POST /trade/create**
```json
// Request body
{ "lender_id": 1, "borrower_id": 2, "book_id": 3 }
// Response
{ "id": 7 }
```

## Unimplemented Endpoints (Planned)

These are documented in `README.md` but not yet built:

- `PUT /trade/:tradeid/claim` — borrower claims an open trade
- `PUT /trade/:tradeid/cancel` — cancel a trade
- `PUT /trade/:tradeid/deliver` — mark trade as completed

When implementing these, write the handler in `src/db.ts` as `(req: Request, res: Response): void`, then register the route in `src/index.ts`.

## CORS Configuration

CORS is handled by a custom middleware in `src/index.ts`. Allowed origins:
- `http://localhost:5174` (local frontend dev server)
- `https://www.figma.com`

To add a new allowed origin, add it to the `allowedOrigins` array in `src/index.ts`.

## Code Conventions

- **Language**: TypeScript with `strict: true`. All new functions must have explicit parameter and return types.
- **Imports**: Use ES module `import`/`export` syntax (compiled to CommonJS by `tsc`).
- **Route handlers**: Signature is `(req: Request, res: Response): void`. Import `Request` and `Response` from `express`.
- **DB result types**: Use types from `src/types.ts` when typing `db.get`/`db.all` callback row parameters.
- **Code regions**: Sections are wrapped with `//-----------------------------\n//#region Name` and `//#endregion Name` comments. Follow this pattern when adding new sections.
- **Error handling**: All `db.ts` functions use the same pattern — `console.error` the message, then `res.status(400).json({ error: err.message })`. Use `res.sendStatus(404)` when a record is not found.
- **sqlite3 `this.lastID`**: Use a regular `function` callback (not an arrow function) in `db.run` calls so that `this` refers to the `RunResult` object.
- **No `.env` file**: Port is hardcoded as `3999` in `src/index.ts`. No secrets are stored in the repo.

## Dependencies

| Package | Purpose |
|---|---|
| `express` ^4.18.2 | HTTP routing |
| `sqlite3` ^5.1.4 | SQLite database driver |
| `bcrypt` ^5.1.0 | Password hashing (imported in `src/index.ts` but not yet used — reserved for auth) |
| `typescript` | TypeScript compiler |
| `ts-node` | Run TypeScript directly in development |
| `nodemon` ^3.1.9 | Dev-only auto-reload |
| `@types/express`, `@types/node`, `@types/bcrypt`, `@types/sqlite3` | Type declarations |

`bcrypt` is already imported in `src/index.ts`. When implementing authentication, use it there — do not install an alternative hashing library.

## Known Gaps / Future Work

- **Authentication**: `bcrypt` is imported but unused. A login endpoint and session/token mechanism need to be added.
- **cart.ts**: Empty placeholder. No design exists yet for this feature.
- **Trade status updates**: `claim`, `cancel`, `deliver` PUT endpoints are documented but not implemented.
- **No tests**: No test framework is set up. If adding tests, `jest` + `supertest` + `@types/jest` are natural choices for this Express/TypeScript stack.
- **No input validation on trade creation**: `createTrade` does not validate that `lender_id`, `borrower_id`, and `book_id` are present or valid before running the INSERT.
- **Search uses JSON body on GET requests**: This is unconventional (most clients don't send bodies with GET). Consider migrating to query parameters (e.g., `?author=tolkien`) in a future refactor.
