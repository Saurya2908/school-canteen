# School Canteen — Express + Mongoose Prototype

This repository contains a small prototype backend to manage school canteen snack orders. It demonstrates use of Mongoose middleware hooks:

- `Student` — **pre-save**: auto-generate `referralCode` if missing.
- `Order` — **pre-validate**: ensure `quantity` in [1,5] and compute `payableAmount`.
- `Order` — **post-save**: increment `Snack.ordersCount`, push order id to `Student.orders`, and increment `Student.totalSpent`.

---

## Quick setup (local)

1. Clone the repository.

2. Install dependencies:

```bash
npm install

# If you have mongod installed
mongod --dbpath /path/to/your/db


npm run dev
# or
npm start


## 📌 API Endpoint Summary

### Health
- **GET** `/`  
  Health check endpoint. Returns `{ status: "ok", timestamp }`.

---

### Snacks
- **POST** `/snacks/seed`  
  Seed snacks with default or custom list.  
  **Body (optional):**
  ```json
  {
    "snacks": [
      { "title": "Samosa", "price": 15 },
      { "title": "Idli", "price": 25 }
    ]
  }
  ```
  **Response:** `201 Created` with created snack list.

- **GET** `/snacks`  
  List all snacks with `title`, `price`, and `ordersCount`.

---

### Students
- **POST** `/students`  
  Create a new student.  
  **Body:**
  ```json
  { "name": "Aarav" }
  ```
  **Response:** `201 Created` with student object (includes generated `referralCode`).

- **GET** `/students/:id`  
  Get student details by ID.  
  **Optional Query:** `?populateOrders=true` → includes all orders with snack details.

---

### Orders
- **POST** `/orders`  
  Create a new order.  
  **Body:**
  ```json
  {
    "studentId": "<studentId>",
    "snackId": "<snackId>",
    "quantity": 2
  }
  ```
  **Response:** `201 Created` with populated order details (student + snack).

---

## 🔎 Error Cases
- **Validation**: If `quantity` < 1 or > 5 → `400 Validation error`.
- **Not Found**: Invalid `studentId` or `snackId` → `404`.
- **Duplicate**: Unique `referralCode` collisions → `409 Duplicate key error`.
