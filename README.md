# Wallet System API

The Wallet System API is a robust and secure financial transactions management system. It provides a set of endpoints to create and manage user wallets, process credit and debit transactions, handle webhooks, and ensure the integrity and security of financial operations.

# Setup

Start the database:

```bash
docker compose up --force-recreate -d
```

Install [Bun](https://bun.sh)

```
curl -fsSL https://bun.sh/install | bash
```

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run dev
```

# Api Docs

## Authentication

### Register

**Endpoint:** `POST /api/auth/register/`

Registers a new user.

**Request:**

```json
{
  "email": "mail@mail.com",
  "password": "123456"
}
```

**Response:**

```json
{
  "tokens": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login

**Endpoint:** `POST /api/auth/login/`

Logs in a user.

**Request:**

```json
{
  "email": "mail@mail.com",
  "password": "123456-"
}
```

**Response:**

```json
{
  "tokens": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Refresh Token

**Endpoint:** `POST /api/auth/refresh-token/`

Refreshes the access token.

**Request:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**

```json
{
  "tokens": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Wallet

### Create Wallet

**Endpoint:** `POST /api/wallet/`

Creates a new wallet.

**Request:**

```json
{
  "passphrase": "buttercup"
}
```

**Response:**

```json
{
  "id": "0461a08e-2ab4-49de-8f84-175be316534f",
  "createdAt": "2024-01-17T07:03:08.781Z",
  "updatedAt": "2024-01-17T07:03:08.781Z",
  "userId": "c2635150-2bb2-4e9e-b5b1-ba951fe2d49f",
  "address": "04F311E2D6"
}
```

### Get Wallet

**Endpoint:** `GET /api/wallet/`

Retrieves wallet information.

**Response:**

```json
{
  "id": "0461a08e-2ab4-49de-8f84-175be316534f",
  "createdAt": "2024-01-17T07:03:08.781Z",
  "updatedAt": "2024-01-17T07:13:24.663Z",
  "userId": "c2635150-2bb2-4e9e-b5b1-ba951fe2d49f",
  "address": "04F311E2D6",
  "balance": 2000
}
```

### Update Wallet

**Endpoint:** `PATCH /api/wallet/`

Updates wallet information.

**Request:**

```json
{
  "passphrase": "something-nice"
}
```

**Response:**

```json
{
  "id": "0461a08e-2ab4-49de-8f84-175be316534f",
  "createdAt": "2024-01-17T07:03:08.781Z",
  "updatedAt": "2024-01-17T07:13:24.663Z",
  "userId": "c2635150-2bb2-4e9e-b5b1-ba951fe2d49f",
  "address": "04F311E2D6"
}
```

### Delete Wallet

**Endpoint:** `DELETE /api/wallet/`

Deletes the user's wallet.

### Wallet Deposit

**Endpoint:** `POST /api/wallet/deposit/`

Deposits funds into the wallet.

**Request:**

```json
{
  "amount": 100
}
```

**Response:**

```json
{
  "balance": 2100
}
```

### Wallet Withdrawal

**Endpoint:** `POST /api/wallet/withdraw/`

Withdraws funds from the wallet.

**Request:**

```json
{
  "amount": 300,
  "passphrase": "something-nice"
}
```

**Response:**

```json
{
  "balance": 1500
}
```

---

This documentation provides a comprehensive guide on using the Wallet System API. For more details on each endpoint, refer to the respective sections.
