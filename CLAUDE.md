# CLAUDE.md — api-lab-example

This file provides context for AI assistants working in this repository.

## Project Overview

A community book-trading REST API built with Node.js and Express, backed by a pre-populated SQLite database. Users can search books, create accounts, and post/claim trades. This is an educational project (school lab assignment) and is actively under development.

## Running the App

```bash
npm install          # install dependencies
nodemon index.js     # start dev server with auto-reload (port 3999)
```

There is no test runner configured. The `npm test` script is a placeholder that exits with an error.

## Repository Structure

```
api-lab-example/
├── index.js              # Express app entry point — middleware + route definitions
├── db.js                 # All database query functions (SQLite3)
├── search.js             # Validation middleware that wraps db search calls
├── cart.js               # Empty placeholder for future cart functionality
├── api-lab-example.db    # Pre-populated SQLite database (do not delete)
├── bookstore_api.drawio  # ERD diagram (open in draw.io)
├── package.json
└── README.md
```

## Architecture

### Request Flow

```
HTTP Request → index.js route → search.js (validation, search routes only) → db.js (query) → response
```

- **index.js**: Registers middleware (JSON parsing, CORS) and mounts all routes. No business logic lives here.
- **search.js**: Input validation layer. Currently validates that search strings are defined and longer than 3 characters before forwarding to `db.js`.
- **db.js**: All SQL queries. Functions are Express route handlers (accept `req, res`) and are exported directly for use as route callbacks.
- **cart.js**: Empty file — intended for a future shopping cart feature.

### Database

- SQLite3 file: `api-lab-example.db` (in project root)
- Connection opened once at module load in `db.js`
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

Trade `status` starts as `'pending'` on creation. Updating status (`claim`, `cancel`, `deliver`) is not yet implemented.

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

When implementing these, follow the pattern in `db.js`: write the SQL handler there and register the route in `index.js`.

## CORS Configuration

CORS is handled by a custom middleware in `index.js`. Allowed origins:
- `http://localhost:5174` (local frontend dev server)
- `https://www.figma.com`

To add a new allowed origin, add it to the `allowedOrigins` array in `index.js`.

## Code Conventions

- **Code regions**: Sections are wrapped with `//-----------------------------\n//#region Name` and `//#endregion Name` comments. Follow this pattern when adding new sections.
- **Error handling**: All `db.js` functions use the same pattern — log the error, return `res.status(400).json({ error: err.message })`. Use `res.sendStatus(404)` when a record is not found.
- **Module exports**: `db.js` and `search.js` use `module.exports = { fn1, fn2 }` at the bottom of the file.
- **No TypeScript**: Plain CommonJS JavaScript (`require`/`module.exports`).
- **No `.env` file**: Port is hardcoded as `3999` in `index.js`. No secrets are stored in the repo.

## Dependencies

| Package | Purpose |
|---|---|
| `express` ^4.18.2 | HTTP routing |
| `sqlite3` ^5.1.4 | SQLite database driver |
| `bcrypt` ^5.1.0 | Password hashing (imported in `index.js` but not yet used — reserved for auth) |
| `nodemon` ^3.1.9 | Dev-only auto-reload |

`bcrypt` is already imported in `index.js`. When implementing authentication, use it there — do not install an alternative hashing library.

## Known Gaps / Future Work

- **Authentication**: `bcrypt` is imported but unused. A login endpoint and session/token mechanism need to be added.
- **cart.js**: Empty placeholder. No design exists yet for this feature.
- **Trade status updates**: `claim`, `cancel`, `deliver` PUT endpoints are documented but not implemented.
- **No tests**: No test framework is set up. If adding tests, `jest` + `supertest` are natural choices for this Express stack.
- **No input validation on trade creation**: `createTrade` does not validate that `lender_id`, `borrower_id`, and `book_id` are present or valid before running the INSERT.
- **Search uses JSON body on GET requests**: This is unconventional (most clients don't send bodies with GET). Consider migrating to query parameters (e.g., `?author=tolkien`) in a future refactor.
