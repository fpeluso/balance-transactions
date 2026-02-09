# JWT Authentication Implementation

This document describes the JWT authentication implementation for the balance-transactions service.

## Overview

All API endpoints are now protected with JWKS-based JWT authentication. Each user can only access their own transactions and categories, ensuring complete multi-tenant data isolation.

## Architecture

### Authentication Flow

1. **JWKS Key Retrieval**: The service fetches public keys from the balance-auth server's JWKS endpoint (`/.well-known/jwks.json`)
2. **JWT Validation**: Every incoming request's JWT token is validated using the public key
3. **User Extraction**: The username is extracted from the JWT's `sub` claim
4. **Data Scoping**: All database operations are scoped to the authenticated user's `userId`

### Components

- **config/auth-plugin.js**: Fastify plugin that configures JWT validation with JWKS support
- **config/auth-handler.js**: PreHandler hook that validates tokens and attaches user info to requests
- **Modified Routes**: All route handlers now require authentication
- **Modified Services**: All service methods accept and use `userId` for data isolation

## Configuration

Set the following environment variable (optional):

```bash
AUTH_SERVER_URL=http://localhost:9000
```

If not set, defaults to `http://localhost:9000`.

See `.env.example` for reference.

## Protected Endpoints

All endpoints now require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Transactions

- `GET /transactions` - List all transactions for authenticated user
- `GET /transactions/:transaction` - Get specific transaction for authenticated user
- `POST /transaction` - Create transaction for authenticated user

### Categories

- `GET /categories` - List all categories for authenticated user
- `GET /categories/:category` - Get specific category for authenticated user
- `POST /category` - Create category for authenticated user

## Data Model Changes

Both `transactions` and `categories` MongoDB collections now include a `userId` field:

```javascript
// Transaction
{
  userId: "username",  // from JWT sub claim
  type: "...",
  amount: 100,
  description: "...",
  category: "...",
  account: 123,
  date: "..."
}

// Category
{
  userId: "username",  // from JWT sub claim
  category: "..."
}
```

## Security Features

- **No Shared Secrets**: Uses public key cryptography via JWKS
- **Key Caching**: JWKS keys are cached for 10 hours to reduce auth server load
- **Complete Isolation**: Users cannot see or modify other users' data
- **Token Validation**: All tokens are verified on every request

## Error Responses

### 401 Unauthorized

Returned when:
- No Authorization header is present
- Invalid JWT token
- Expired JWT token
- Token signature verification fails

Response format:
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

## Testing

To test the authenticated endpoints:

1. Start balance-auth server on port 9000
2. Obtain a JWT token via OAuth2 flow
3. Include token in Authorization header:
   ```bash
   curl -H "Authorization: Bearer <token>" http://localhost:3001/transactions
   ```

## Migration Notes

Existing MongoDB documents without a `userId` field will not be returned by queries. This is intentional for security - all data must be associated with a user.

For a clean start, clear existing data or manually add `userId` fields to existing documents if needed.
