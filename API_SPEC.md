# User Service - API Specification

> Base URL (local): `http://localhost:3001/dev`

---

## Authentication

### POST `/dev/auth/register`

สมัครสมาชิกใหม่ — PIN จะถูก hash ด้วย bcrypt ก่อนบันทึก และ response จะมี JWT token

**Request Body:**

```json
{
  "prefix": "Mr.",
  "firstname": "Somchai",
  "lastname": "Jaidee",
  "email": "somchai@example.com",
  "phone": "0812345678",
  "pin": "123456",
  "role": "user",
  "birth_date": "1990-05-15"
}
```

| Field        | Type   | Required | Description                          |
| ------------ | ------ | -------- | ------------------------------------ |
| prefix       | string | Yes      | คำนำหน้า (เช่น Mr., Ms., นาย)        |
| firstname    | string | Yes      | ชื่อ (min 1 char)                     |
| lastname     | string | Yes      | นามสกุล (min 1 char)                  |
| email        | string | Yes      | Email (ต้อง unique)                   |
| phone        | string | Yes      | เบอร์โทร (min 10 chars)              |
| pin          | string | Yes      | PIN 6 หลัก                           |
| role         | string | No       | `"admin"` / `"user"` / `"moderator"` (default: `"user"`) |
| birth_date   | string | Yes      | วันเกิด format `YYYY-MM-DD`          |

**Response 201:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "u-a1b2c3d4",
      "prefix": "Mr.",
      "firstname": "Somchai",
      "lastname": "Jaidee",
      "email": "somchai@example.com",
      "role": "user",
      "status": "active"
    }
  }
}
```

**Error Responses:**

| Status | Condition              | Body                                          |
| ------ | ---------------------- | --------------------------------------------- |
| 400    | Validation failed      | `{ "success": false, "message": "Validation failed", "errors": [...] }` |
| 409    | Email already exists   | `{ "success": false, "message": "User with this email already exists" }` |
| 500    | Internal server error  | `{ "success": false, "message": "..." }`      |

---

### POST `/dev/auth/login`

เข้าสู่ระบบด้วย email + PIN — ระบบจะเปรียบเทียบ PIN กับ bcrypt hash

**Request Body:**

```json
{
  "email": "somchai@example.com",
  "pin": "123456"
}
```

| Field | Type   | Required | Description         |
| ----- | ------ | -------- | ------------------- |
| email | string | Yes      | Email ที่ลงทะเบียน   |
| pin   | string | Yes      | PIN 6 หลัก          |

**Response 200:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "u-a1b2c3d4",
      "prefix": "Mr.",
      "firstname": "Somchai",
      "lastname": "Jaidee",
      "email": "somchai@example.com",
      "role": "user",
      "status": "active"
    }
  }
}
```

**Error Responses:**

| Status | Condition                     | Body                                                     |
| ------ | ----------------------------- | -------------------------------------------------------- |
| 400    | Validation failed             | `{ "success": false, "message": "Validation failed", "errors": [...] }` |
| 401    | Invalid email or PIN          | `{ "success": false, "message": "Invalid email or PIN" }` |
| 403    | Account deleted or suspended  | `{ "success": false, "message": "Account has been deleted" }` |
| 500    | Internal server error         | `{ "success": false, "message": "..." }`                 |

---

## JWT Token

Token อยู่ใน response field `data.token` — ใช้ส่งใน header สำหรับ protected endpoints ในอนาคต:

```
Authorization: Bearer <token>
```

**Payload:**

```json
{
  "id": "u-a1b2c3d4",
  "email": "somchai@example.com",
  "role": "user",
  "iat": 1710500000,
  "exp": 1711104800
}
```

- Default expiry: **7 วัน**
- Algorithm: HS256

---

## Users (CRUD)

### POST `/dev/users`

สร้าง user ใหม่ (ไม่ hash PIN, ไม่มี token — ใช้สำหรับ admin)

**Request Body:** เหมือน register แต่เพิ่ม `status`

```json
{
  "prefix": "Ms.",
  "firstname": "Suda",
  "lastname": "Rakdee",
  "email": "suda@example.com",
  "phone": "0898765432",
  "pin": "654321",
  "role": "user",
  "status": "pending",
  "birth_date": "1995-08-20"
}
```

**Response 201:** `{ "success": true, "data": { UserResponseDto } }`

---

### GET `/dev/users`

ดึง user ทั้งหมด (ไม่รวม soft-deleted)

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "u-a1b2c3d4",
      "prefix": "Mr.",
      "firstname": "Somchai",
      "lastname": "Jaidee",
      "email": "somchai@example.com",
      "phone": "0812345678",
      "role": "admin",
      "status": "active",
      "birth_date": "1990-05-15T00:00:00.000Z",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### GET `/dev/users/{id}`

ดึง user ตาม ID

**Response 200:** `{ "success": true, "data": { UserResponseDto } }`
**Response 404:** `{ "success": false, "message": "User not found" }`

---

### GET `/dev/users/search?email=somchai@example.com`

ค้นหา user ตาม email

**Query Params:** `email` (required)

**Response 200:** `{ "success": true, "data": { UserResponseDto } }`
**Response 404:** `{ "success": false, "message": "User not found" }`

---

### PUT `/dev/users/{id}`

อัพเดท user — ส่งเฉพาะ field ที่ต้องการแก้

```json
{
  "firstname": "Somchai Updated",
  "phone": "0899999999"
}
```

**Response 200:** `{ "success": true, "data": { UserResponseDto } }`
**Response 404:** `{ "success": false, "message": "User not found" }`

---

### DELETE `/dev/users/{id}`

Soft delete user (set `deleted_at` timestamp)

**Response 200:** `{ "success": true, "message": "User deleted successfully" }`
**Response 404:** `{ "success": false, "message": "User not found" }`

---

## ทดสอบด้วย cURL

### Register

```bash
curl -X POST http://localhost:3001/dev/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "prefix": "Mr.",
    "firstname": "Test",
    "lastname": "User",
    "email": "test@example.com",
    "phone": "0812345678",
    "pin": "123456",
    "role": "user",
    "birth_date": "1990-01-01"
  }'
```

### Login

```bash
curl -X POST http://localhost:3001/dev/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "pin": "123456"
  }'
```

### List Users

```bash
curl http://localhost:3001/dev/users
```

### Get User by ID

```bash
curl http://localhost:3001/dev/users/u-a1b2c3d4
```

### Search by Email

```bash
curl "http://localhost:3001/dev/users/search?email=test@example.com"
```

### Update User

```bash
curl -X PUT http://localhost:3001/dev/users/u-a1b2c3d4 \
  -H "Content-Type: application/json" \
  -d '{ "firstname": "Updated Name" }'
```

### Delete User

```bash
curl -X DELETE http://localhost:3001/dev/users/u-a1b2c3d4
```

---

## วิธี Run

```bash
cd user-service
npx serverless offline
# Server จะ run ที่ http://localhost:3001
```
