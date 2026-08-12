# API Documentation

The API routes are intentionally kept compatible with the uploaded Sequelize backend.

Base URL:

```text
http://localhost:3030/api
```

## AC Accounts

| Method | URL |
|---|---|
| GET | `/api/ac` |
| GET | `/api/ac/:id` |
| POST | `/api/ac` |
| PUT | `/api/ac/:id` |
| DELETE | `/api/ac/:id` |

## Actions

| Method | URL |
|---|---|
| GET | `/api/actions` |
| GET | `/api/actions/:id` |
| POST | `/api/actions` |
| PUT | `/api/actions/:id` |
| DELETE | `/api/actions/:id` |

## Cheque Details

| Method | URL |
|---|---|
| GET | `/api/chqdetails` |
| GET | `/api/chqdetails/:id` |
| POST | `/api/chqdetails` |
| PUT | `/api/chqdetails/:id` |
| DELETE | `/api/chqdetails/:id` |

## Members

| Method | URL |
|---|---|
| GET | `/api/members` |
| GET | `/api/members/:id` |
| POST | `/api/members` |
| PUT | `/api/members/:id` |
| DELETE | `/api/members/:id` |

## Transactions

| Method | URL |
|---|---|
| GET | `/api/transactions` |
| GET | `/api/transactions/Trans_ID/:id` |
| GET | `/api/transactions/ACID/:acid` |
| POST | `/api/transactions` |
| PUT | `/api/transactions/:id` |
| DELETE | `/api/transactions/:id` |
| POST | `/api/transactions/filter` |

The transaction list endpoint supports equality filters through query parameters plus:

```text
?orderBy=Trans_dt&order=DESC
```

Example:

```text
GET /api/transactions?ACID=10&Status=Posted&orderBy=Trans_dt&order=DESC
```

## Transaction descriptions

| Method | URL |
|---|---|
| GET | `/api/transDesc` |
| GET | `/api/transDesc/ac-sub` |
| GET | `/api/transDesc/:id` |

## Health

```text
GET /
GET /health/db
```
