# SQL Backend API — Documentation

## Overview
RESTful API built with **Node.js + Express + Sequelize ORM** connecting to **MS SQL Server (SQLEXPRESS)**.

- **Base URL**: `http://localhost:3000/api`
- **Content-Type**: `application/json`

---

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# Development mode (auto-restart)
npm run dev
```

---

## Response Format

All endpoints return a consistent JSON structure:

### Success
```json
{
  "success": true,
  "count": 10,      // Only on list endpoints
  "data": { ... }   // Single object or array
}
```

### Error
```json
{
  "success": false,
  "message": "Descriptive error message",
  "errors": ["..."] // Optional array for validation errors
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK — Request successful |
| 201 | Created — Resource created |
| 400 | Bad Request — Validation failed |
| 404 | Not Found — Resource does not exist |
| 409 | Conflict — Duplicate entry |
| 500 | Internal Server Error |
| 503 | Service Unavailable — DB connection failed |

---

## Endpoints

### 1. AC Accounts (`/api/ac`)

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/ac` | List all AC records |
| GET | `/api/ac/:id` | Get AC by ACID |
| POST | `/api/ac` | Create new AC record |
| PUT | `/api/ac/:id` | Update AC by ACID |
| DELETE | `/api/ac/:id` | Delete AC by ACID |

**POST/PUT Body Fields:**
```json
{
  "MemID": 1,
  "AC_type": "SB",
  "AC_Sub": "Regular",
  "ACNO": "SB-001",
  "DOC": "2024-01-01",
  "Amt": 5000.00,
  "Period": 12,
  "CloseDT": null,
  "prn": 5000.00,
  "int": 250.00,
  "rate": 5.0000,
  "Closed": false,
  "Remarks": "Opening deposit",
  "IntCalType": "Simple"
}
```

---

### 2. Actions (`/api/actions`)

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/actions` | List all Action records |
| GET | `/api/actions/:id` | Get Action by ActionID |
| POST | `/api/actions` | Create new Action record |
| PUT | `/api/actions/:id` | Update Action by ActionID |
| DELETE | `/api/actions/:id` | Delete Action by ActionID |

**POST/PUT Body Fields:**
```json
{
  "ActionDesc": "Deposit",
  "MemID": 1,
  "ActionDT": "2024-01-15T10:30:00Z"
}
```

---

### 3. Cheque Details (`/api/chqdetails`)

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/chqdetails` | List all cheque records |
| GET | `/api/chqdetails/:id` | Get cheque by ChqID |
| POST | `/api/chqdetails` | Create new cheque record |
| PUT | `/api/chqdetails/:id` | Update cheque by ChqID |
| DELETE | `/api/chqdetails/:id` | Delete cheque by ChqID |

**POST/PUT Body Fields:**
```json
{
  "Pay_Mode": "CHQ",
  "ChqNo": "123456",
  "ChqDt": "2024-01-10",
  "Chqamt": 10000.00,
  "ChaBank": "SBI",
  "ChqName": "John Doe",
  "ChqACNO": "ACC-789",
  "VrNo": "VR-001",
  "VrDt": "2024-01-10",
  "ACID": 1,
  "CrDt": "2024-01-12",
  "Trans_ID": 5
}
```

---

### 4. Members (`/api/members`)

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/members` | List all members |
| GET | `/api/members/:id` | Get member by MemID |
| POST | `/api/members` | Create new member |
| PUT | `/api/members/:id` | Update member by MemID |
| DELETE | `/api/members/:id` | Delete member by MemID |

**POST/PUT Body Fields:**
```json
{
  "Memtype": "Regular",
  "empno": "EMP-001",
  "gno": "G-100",
  "hrno": "HR-200",
  "name": "John Doe",
  "desgn": "Engineer",
  "sex": "M",
  "DOB": "1985-05-15",
  "DOA": "2010-01-01",
  "DOR": null,
  "DOM": "2010-02-01",
  "DIV": "Electrical",
  "subdiv": "North",
  "Status": "Active",
  "Phone1": "9876543210"
}
```

---

### 5. Transactions (`/api/transactions`)

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/transactions` | List all transactions |
| GET | `/api/transactions/:id` | Get transaction by Trans_ID |
| POST | `/api/transactions` | Create new transaction |
| PUT | `/api/transactions/:id` | Update transaction by Trans_ID |
| DELETE | `/api/transactions/:id` | Delete transaction by Trans_ID |

**POST/PUT Body Fields:**
```json
{
  "ActionID": 1,
  "Trans_des_ID": 2,
  "Trans_dt": "2024-01-15",
  "CB_dt": "2024-01-15",
  "ACID": 3,
  "I_NO": "INV-001",
  "Cash_amt": 0.00,
  "Chq_amt": 5000.00,
  "Adj_amt": 0.00,
  "Total_amt": 5000.00,
  "PRN": 5000.00,
  "PRN_D": 0.00,
  "PRN_C": 5000.00,
  "PRN_B": 5000.00,
  "INT": 250.00,
  "INT_D": 0.00,
  "INT_C": 250.00,
  "INT_B": 250.00,
  "rate": 5.0000,
  "Days": 180,
  "Status": "Posted",
  "T_Order": 1,
  "CreatedBy": "admin",
  "Remarks": "Monthly deposit",
  "CB_side": "CR",
  "MEMID": 1,
  "Trans_desc": "Deposit",
  "IntCalType": "Simple",
  "AC_Sub": "Regular"
}
```

---

## Health Check

```
GET http://localhost:3000/
```

Returns server status and list of all available endpoints.
