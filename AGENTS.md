# Repository Guidelines

## Project Structure & Module Organization
This repository is split into two apps:

- `client/`: Vite + React frontend. Main entry points live in `src/` (`main.jsx`, `App.jsx`), shared utilities in `src/utils/`, and static files in `public/` and `src/assets/`.
- `server/`: Express API. Startup code is in `server.js`, route handlers are in `routes/`, Mongoose models are in `models/`, shared middleware is in `middleware/`, and database setup is in `config/db.js`.

Keep new frontend code close to the feature it supports. For backend work, add routes, models, and middleware in their existing folders instead of growing `server.js`.

## Build, Test, and Development Commands
Run commands from the relevant app directory.

- `cd client && npm run dev`: start the Vite dev server on `http://localhost:5173`.
- `cd client && npm run build`: create a production frontend build in `client/dist/`.
- `cd client && npm run lint`: run ESLint on `.js` and `.jsx` files.
- `cd server && npm run dev`: start the API with `nodemon`.
- `cd server && npm start`: run the API with Node.
- `cd server && npm run seed`: populate the database with seed data.

## Coding Style & Naming Conventions
Follow the existing style: use 2-space indentation in both apps. Match local file conventions for semicolons: backend CommonJS files use them consistently, while frontend ESM files often omit them.

Use `PascalCase` for React components, `camelCase` for variables/functions, and singular `PascalCase` for Mongoose models (`User.js`, `Order.js`). Prefer small utility modules such as `src/utils/api.js` over duplicating request logic.

## Testing Guidelines
There is no automated test suite configured yet. Before opening a PR, run `client` linting, verify the frontend in the browser, and smoke-test backend endpoints such as `GET /api/health`. When adding tests, keep them near the code they cover using names like `FeatureName.test.jsx` or `routeName.test.js`.

## Commit & Pull Request Guidelines
Git history is not available in this workspace, so no repository-specific commit convention could be verified. Use short, imperative commit subjects such as `Add cart API validation` or `Refactor product grid layout`.

PRs should include a clear summary, affected areas (`client`, `server`, or both), setup or migration notes, linked issues, and screenshots for UI changes. Call out new environment variables explicitly.

## Security & Configuration Tips
Server configuration is environment-driven. Use `server/.env.example` as the template, keep secrets in `server/.env`, and never commit credentials. The API expects `MONGODB_URI`, and CORS defaults to `CLIENT_URL` or `http://localhost:5173`.
