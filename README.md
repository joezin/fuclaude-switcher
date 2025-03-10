# FuClaude Switcher

A Next.js application for managing accounts with Cloudflare D1 database integration.

## Features

- Account management (create, read, update, delete)
- Session key management
- Account status toggling
- Responsive UI for both desktop and mobile
- Cloudflare D1 database integration

## Setup

### Prerequisites

- Node.js 18+ and npm
- Cloudflare account with Workers and D1 access

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fuclaude-switcher.git
   cd fuclaude-switcher
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Cloudflare D1 database:
   ```bash
   npx wrangler d1 create accounts_db
   ```

4. Update the `wrangler.toml` file with your database ID:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "accounts_db"
   database_id = "your-database-id" # Replace with the ID from the previous step
   ```

5. Create the database schema:
   ```bash
   npx wrangler d1 execute accounts_db --file=./schema.sql
   ```

### Development

Run the development server with Wrangler to enable D1 access:

```bash
npx wrangler pages dev .next --d1=accounts_db
```

### Production Deployment

Deploy to Cloudflare Pages:

```bash
npm run build
npx wrangler pages deploy .next
```

## API Routes

The application provides the following API routes:

- `GET /api/accounts` - Get all accounts
- `GET /api/accounts?id=1` - Get a specific account
- `POST /api/accounts` - Create a new account
- `PUT /api/accounts/1` - Update an account
- `DELETE /api/accounts/1` - Delete an account
- `POST /api/seed` - Seed the database with initial data (development only)

## Database Schema

The application uses a simple schema for accounts:

```sql
CREATE TABLE accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  session_key TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## License

MIT
