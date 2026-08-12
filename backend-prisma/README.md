# SQL Backend API — Prisma Version

This project is a Prisma-based replacement for the uploaded Sequelize backend.

## Stack

- Node.js + Express
- Prisma ORM
- Microsoft SQL Server
- CommonJS
- Same `routes/` and `controllers/` layout and API paths as the original backend

Prisma supports Microsoft SQL Server through the `sqlserver` connector. The schema uses native SQL Server mappings such as `@db.Date`, `@db.Decimal(18, 2)`, and `@db.VarChar(...)`.

## Project structure

```text
prisma-backend/
├── config/
│   └── database.js
├── controllers/
│   ├── _helpers.js
│   ├── ac.controller.js
│   ├── action.controller.js
│   ├── chqdetails.controller.js
│   ├── mem.controller.js
│   ├── trans.controller.js
│   └── trans_desc_tb.controller.js
├── middleware/
│   └── errorHandler.js
├── models/
│   └── index.js
├── prisma/
│   └── schema.prisma
├── routes/
│   ├── ac.routes.js
│   ├── action.routes.js
│   ├── chqdetails.routes.js
│   ├── index.js
│   ├── mem.routes.js
│   ├── trans.routes.js
│   └── trans_desc_tb.routes.js
├── .env.example
├── package.json
└── server.js
```

## 1. Configure `.env`

Copy `.env.example` to `.env` and set your SQL Server password.

For a named SQL Server instance such as `SQLEXPRESS`, use:

```env
DATABASE_URL="sqlserver://localhost\\SQLEXPRESS;database=SOCRJY;user=sa;password=YOUR_PASSWORD;encrypt=false;trustServerCertificate=true"
```

If the SQL Server instance is listening on TCP 1433, use:

```env
DATABASE_URL="sqlserver://localhost:1433;database=SOCRJY;user=sa;password=YOUR_PASSWORD;encrypt=false;trustServerCertificate=true"
```

Prisma's current SQL Server documentation recommends the `sqlserver://` connection format. A named instance is supported, but TCP/1433 is usually simpler and more predictable for application connectivity.

## 2. Install

```bash
npm install
```

## 3. Generate Prisma Client

```bash
npm run prisma:generate
```

## 4. Existing database — recommended

Because this backend targets your existing SQL Server tables, **do not run `prisma migrate dev` first**.

Instead, if the database is available, introspect it:

```bash
npm run prisma:pull
npm run prisma:generate
```

Review the generated `prisma/schema.prisma`. The supplied schema is already based on the Sequelize models from the uploaded project.

## 5. Start

```bash
npm start
```

Development:

```bash
npm run dev
```

## API base URL

```text
http://localhost:3030/api
```

### Endpoints

- `GET/POST/PUT/DELETE /api/ac`
- `GET/POST/PUT/DELETE /api/actions`
- `GET/POST/PUT/DELETE /api/chqdetails`
- `GET/POST/PUT/DELETE /api/members`
- `GET/POST/PUT/DELETE /api/transactions`
- `GET /api/transDesc`
- `GET /api/transDesc/ac-sub`

Transactions additionally support:

```text
GET  /api/transactions/Trans_ID/:id
GET  /api/transactions/ACID/:acid
POST /api/transactions/filter
```

## Important Prisma differences

1. Sequelize model classes are replaced by one shared Prisma Client.
2. Decimal columns are returned by Prisma as `Decimal` objects. JSON serialization from Prisma Client normally produces string-like decimal representations rather than Sequelize's exact output behavior. If your frontend requires JavaScript numbers, normalize them explicitly.
3. Prisma validates field names at runtime. The transaction filter/order implementation therefore validates allowed columns before querying.
4. The API does not call `prisma db push` or modify your database on startup.
5. The original Sequelize associations were preserved as Prisma relations for `member`, `account`, `action`, and `cheques`.

## Security

The original uploaded project contained a database password in `.env`. This Prisma package intentionally contains only `.env.example`; enter your real password locally and do not commit `.env`.

## Reference

Prisma's SQL Server connector and native type mappings are documented here:
https://docs.prisma.io/docs/orm/core-concepts/supported-databases/sql-server
