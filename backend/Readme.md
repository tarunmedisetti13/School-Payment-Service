# Payment Gateway API

A comprehensive payment management system with user authentication, payment processing, and transaction tracking capabilities.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [API Documentation](#api-documentation)
  - [User Authentication](#user-authentication)
  - [Payment Management](#payment-management)
  - [Transaction Tracking](#transaction-tracking)
  - [Webhook Handling](#webhook-handling)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)

## Features

- 👤 User Registration and Authentication
- 🔒 JWT-based Authorization
- 💳 Payment Gateway Integration
- 📊 Transaction Management and Tracking
- 🔔 Webhook Support for Real-time Updates
- 🏫 School-specific Transaction Filtering
- 📈 Transaction Summary and Analytics
- 🔍 Comprehensive Logging and Auditing

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

```bash
# Clone the repository
git clone <your-repository-url>
cd your-project-name

# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

The server will start on `http://localhost:5000` by default.

## Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=1d

# Payment Gateway Configuration
PG_SECRET_KEY=your_payment_gateway_secret_key
PG_API_KEY=your_payment_gateway_api_key
PG_BASE_URL=https://api.paymentgateway.com

# Optional: Webhook URL for payment gateway
WEBHOOK_URL=http://localhost:5000/api/payments/webhook-update
```

## API Documentation

Base URL: `http://localhost:5000/api`

### User Authentication

#### Register New User

**Endpoint:** `POST /api/user/create-user`

**Description:** Register a new user in the system.

**Request Body:**
```json
{
  "username": "admin name",
  "email": "youremail@gmail.com",
  "password": "your-password"
}
```

**Success Response (201):**
```json
{
  "message": "User Created Successfully",
  "user": {
    "_id": "650f2d9c3b1d1e89b1234567",
    "username": "admin name",
    "email": "youremail@gmail.com",
    "createdAt": "2025-09-18T06:22:11.123Z",
    "updatedAt": "2025-09-18T06:22:11.123Z",
    "__v": 0
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - All fields are required / Invalid input
- `409` - User already exists
- `500` - Internal server error

#### Login User

**Endpoint:** `POST /api/user/login-user`

**Description:** Authenticate an existing user and receive JWT token.

**Request Body:**
```json
{
  "email": "youremail@gmail.com",
  "password": "your-password"
}
```

**Success Response (200):**
```json
{
  "message": "User Login Successfully",
  "user": {
    "_id": "650f2d9c3b1d1e89b1234567",
    "username": "admin name",
    "email": "youremail@gmail.com",
    "createdAt": "2025-09-18T06:22:11.123Z",
    "updatedAt": "2025-09-18T06:22:11.123Z",
    "__v": 0
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Email and password are required
- `404` - User does not exist
- `401` - Invalid password
- `500` - Internal server error

### Payment Management

> **🔒 Authentication Required:** All payment APIs require JWT token in Authorization header:
> ```
> Authorization: Bearer <your-jwt-token>
> ```

#### Create Payment

**Endpoint:** `POST /api/payments/create-payment`

**Description:** Create a new payment request for a student.

**Request Body:**
```json
{
  "school_id": "12345",
  "amount": 5000,
  "callback_url": "http://localhost:5173/callback",
  "student_info": {
    "name": "John Doe",
    "class": "10",
    "roll_number": "25"
  },
  "trustee_id": "67890",
  "gateway_name": "Razorpay",
  "custom_order_id": "STU-001" // Optional
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "payment_link": "https://pg.dev/payment/xyz123",
    "request_id": "abc789",
    "status": "CREATED"
  },
  "orderId": "650f2d9c3b1d1e89b1234567"
}
```

**Error Responses:**
- `400` - Required fields missing
- `401` - Unauthorized
- `500` - Payment creation failed

#### Check Payment Status

**Endpoint:** `GET /api/payments/payment-status/:orderId`

**Description:** Check the current status of a payment order.

**Parameters:**
- `orderId` (String) - The order ID returned from create payment

**Success Response (200):**
```json
{
  "success": true,
  "order": {
    "_id": "650f2d9c3b1d1e89b1234567",
    "school_id": "12345",
    "trustee_id": "67890",
    "student_info": {
      "name": "John Doe",
      "class": "10",
      "roll_number": "25"
    },
    "gateway_name": "Razorpay",
    "amount": 5000,
    "callback_url": "http://localhost:5173/callback",
    "createdAt": "2025-09-18T08:10:11.123Z",
    "updatedAt": "2025-09-18T08:10:11.123Z"
  },
  "status": {
    "_id": "65102d9c3b1d1e89b9876543",
    "collect_id": "650f2d9c3b1d1e89b1234567",
    "order_amount": 5000,
    "transaction_amount": 5000,
    "payment_mode": "UPI",
    "payment_details": "txn12345@upi",
    "bank_reference": "BR123456",
    "payment_message": "Transaction Successful",
    "status": "SUCCESS",
    "error_message": "NA",
    "payment_time": "2025-09-18T08:25:11.000Z"
  }
}
```

### Transaction Tracking

#### Get All Transactions

**Endpoint:** `GET /api/payments/transactions`

**Description:** Retrieve all transactions with filtering and pagination support.

**Query Parameters:**
- `page` (Number, optional) - Page number (default: 1)
- `limit` (Number, optional) - Records per page (default: 10)
- `status` (String, optional) - Comma-separated statuses (PENDING,SUCCESS,FAILED)
- `schoolId` (String, optional) - Comma-separated school IDs
- `date` (String, optional) - Filter by date (YYYY-MM-DD)
- `sortBy` (String, optional) - Sort field (default: createdAt)
- `order` (String, optional) - Sort order (asc/desc, default: desc)

**Example Request:**
```
GET /api/payments/transactions?page=1&limit=10&status=SUCCESS,PENDING&schoolId=12345&sortBy=payment_time&order=desc
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "collect_id": "65102d9c3b1d1e89b9876543",
      "school_id": "12345",
      "gateway": "Razorpay",
      "order_amount": 5000,
      "transaction_amount": 5000,
      "status": "SUCCESS",
      "payment_mode": "UPI",
      "student_name": "John Doe",
      "createdAt": "2025-09-18T08:25:11.000Z",
      "custom_order_id": "STU-001"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

#### Get Transactions by School

**Endpoint:** `GET /api/payments/transactions-school/:schoolId`

**Description:** Get all transactions for a specific school.

**Parameters:**
- `schoolId` (String) - The school identifier

**Query Parameters:**
- `page` (Number, optional) - Page number (default: 1)
- `limit` (Number, optional) - Records per page (default: 10)
- `sortBy` (String, optional) - Sort field (default: payment_time)
- `order` (String, optional) - Sort order (asc/desc, default: desc)

#### Get Transaction by Custom Order ID

**Endpoint:** `GET /api/payments/transaction-status/:custom_order_id`

**Description:** Get transaction status using custom/student order ID.

**Parameters:**
- `custom_order_id` (String) - The custom order ID assigned to the transaction

#### Get Transaction Summary by School

**Endpoint:** `GET /api/payments/transactions/summary/:schoolId`

**Description:** Get aggregated transaction summary grouped by status.

**Parameters:**
- `schoolId` (String) - The school identifier

**Success Response (200):**
```json
{
  "success": true,
  "summary": [
    {
      "_id": "SUCCESS",
      "totalAmount": 45000,
      "count": 12,
      "percentage": 60.0
    },
    {
      "_id": "FAILED",
      "totalAmount": 5000,
      "count": 3,
      "percentage": 15.0
    },
    {
      "_id": "PENDING",
      "totalAmount": 10000,
      "count": 4,
      "percentage": 20.0
    }
  ],
  "totals": {
    "totalTransactions": 19,
    "totalAmount": 60000
  }
}
```

### Webhook Handling

#### Payment Webhook

**Endpoint:** `POST /api/payments/webhook-update`

**Description:** Handle payment gateway webhook events for real-time status updates.

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <webhook-token> // If authentication is required
```

**Expected Payload:**
```json
{
  "event": "payment.success",
  "order_info": {
    "order_id": "650f2d9c3b1d1e89b1234567",
    "order_amount": 5000,
    "transaction_amount": 5000,
    "payment_mode": "UPI",
    "payment_details": "txn12345@upi",
    "bank_reference": "BR123456",
    "payment_message": "Transaction Successful",
    "status": "SUCCESS",
    "error_message": "",
    "payment_time": "2025-09-18T08:25:11.000Z"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

#### Get Webhook Logs

**Endpoint:** `GET /api/payments/webhooks/logs`

**Description:** Retrieve webhook event logs for debugging and monitoring.

**Query Parameters:**
- `page` (Number, optional) - Page number (default: 1)
- `limit` (Number, optional) - Logs per page (default: 10)
- `status` (Number, optional) - Filter by HTTP status code
- `event` (String, optional) - Filter by event type

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "66fa12b3c9a8f9a11b2d6b7a",
      "event": "payment.success",
      "payload": {
        "order_id": "64d45c3e1a2b9f7c99b12345",
        "status": "SUCCESS",
        "transaction_amount": 5000
      },
      "status": 200,
      "response_time": 145,
      "ip_address": "192.168.1.1",
      "user_agent": "PaymentGateway-Webhook/1.0",
      "createdAt": "2025-09-18T07:45:23.123Z",
      "updatedAt": "2025-09-18T07:45:23.123Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

## Usage Examples

### Complete Payment Flow Example

#### 1. Register/Login User

**Register:**
```bash
curl -X POST http://localhost:5000/api/user/create-user \
  -H "Content-Type: application/json" \
  -d '{
    "username": "School Admin",
    "email": "admin@school.edu",
    "password": "securePassword123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/user/login-user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.edu",
    "password": "securePassword123"
  }'
```

#### 2. Create Payment

```bash
curl -X POST http://localhost:5000/api/payments/create-payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "school_id": "SCHOOL123",
    "amount": 5000,
    "callback_url": "http://localhost:5173/payment-callback",
    "student_info": {
      "name": "John Doe",
      "class": "10-A",
      "roll_number": "25"
    },
    "trustee_id": "TRUSTEE456",
    "gateway_name": "Razorpay",
    "custom_order_id": "FEE-2025-001"
  }'
```

#### 3. Check Payment Status

```bash
curl -X GET http://localhost:5000/api/payments/payment-status/650f2d9c3b1d1e89b1234567 \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### 4. Get School Transactions

```bash
curl -X GET "http://localhost:5000/api/payments/transactions-school/SCHOOL123?page=1&limit=5" \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### 5. Get Transaction Summary

```bash
curl -X GET http://localhost:5000/api/payments/transactions/summary/SCHOOL123 \
  -H "Authorization: Bearer <your-jwt-token>"
```

### JavaScript/Frontend Integration Example

```javascript
// Payment service class
class PaymentService {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Create payment
  async createPayment(paymentData) {
    const response = await fetch(`${this.baseURL}/api/payments/create-payment`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(paymentData)
    });
    return await response.json();
  }

  // Check payment status
  async checkPaymentStatus(orderId) {
    const response = await fetch(`${this.baseURL}/api/payments/payment-status/${orderId}`, {
      method: 'GET',
      headers: this.headers
    });
    return await response.json();
  }

  // Get transactions
  async getTransactions(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${this.baseURL}/api/payments/transactions?${queryParams}`, {
      method: 'GET',
      headers: this.headers
    });
    return await response.json();
  }
}

// Usage example
const paymentService = new PaymentService('http://localhost:5000', 'your-jwt-token');

// Create a payment
const paymentResult = await paymentService.createPayment({
  school_id: 'SCHOOL123',
  amount: 5000,
  callback_url: 'http://localhost:3000/callback',
  student_info: {
    name: 'John Doe',
    class: '10-A',
    roll_number: '25'
  }
});

console.log('Payment created:', paymentResult);
```

## Error Handling

All APIs return consistent error responses with the following structure:

```json
{
  "success": false,
  "message": "Human-readable error description",
  "error": "ERROR_CODE",
  "details": "Additional error details (when applicable)"
}
```

### Common HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| `200` | Success |
| `201` | Created successfully |
| `400` | Bad Request - Invalid input data |
| `401` | Unauthorized - Invalid or missing token |
| `403` | Forbidden - Access denied |
| `404` | Not Found - Resource doesn't exist |
| `409` | Conflict - Resource already exists |
| `422` | Unprocessable Entity - Validation errors |
| `500` | Internal Server Error |
| `503` | Service Unavailable - External service error |

### Error Examples

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "VALIDATION_ERROR",
  "details": {
    "email": "Email is required",
    "amount": "Amount must be greater than 0"
  }
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "message": "Access token is invalid or expired",
  "error": "INVALID_TOKEN"
}
```

**Not Found Error (404):**
```json
{
  "success": false,
  "message": "Payment order not found",
  "error": "ORDER_NOT_FOUND"
}
```

## Authentication

### JWT Token Management

After successful login or registration, you'll receive a JWT token that must be included in all protected API requests.

**Token Header Format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Properties:**
- **Expiry:** 1 day (configurable via `JWT_EXPIRE` environment variable)
- **Algorithm:** HS256
- **Payload includes:** User ID, email, issued time, expiry time

### Token Validation

The API automatically validates tokens for protected routes. If a token is:
- Missing: Returns `401 Unauthorized`
- Invalid: Returns `401 Unauthorized`
- Expired: Returns `401 Unauthorized`

### Security Best Practices

1. **Store tokens securely** (HTTP-only cookies or secure storage)
2. **Implement token refresh** for better UX
3. **Use HTTPS** in production
4. **Validate input data** on both client and server
5. **Implement rate limiting** for API endpoints
6. **Log security events** for monitoring

## Development

### Project Structure

```
backend/
├── config/
│   ├── database.js
│   └── jwt.js
├── controllers/
│   ├── userController.js
│   └── paymentController.js
├── middleware/
│   ├── auth.js
│   └── validation.js
├── models/
│   ├── User.js
│   ├── Order.js
│   └── Transaction.js
├── routes/
│   ├── userRoutes.js
│   └── paymentRoutes.js
├── utils/
│   ├── logger.js
│   └── helpers.js
├── .env.example
├── server.js
└── package.json
```

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start

# Run tests
npm test

# Run linting
npm run lint

# Run formatting
npm run format
```

### Environment Setup

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Update environment variables** with your actual values

3. **Start MongoDB** (local or cloud)

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

## Testing

### API Testing with Postman

Import the Postman collection (if available) or use the following endpoints for testing:

1. **Base URL:** `http://localhost:5000`
2. **Set environment variables** for token and base URL
3. **Test authentication flow** first
4. **Use obtained token** for protected routes

### Sample Test Cases

```javascript
// Example Jest test cases
describe('Payment API', () => {
  let token;
  let orderId;

  beforeAll(async () => {
    // Login and get token
    const response = await request(app)
      .post('/api/user/login-user')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    token = response.body.token;
  });

  test('Create payment', async () => {
    const response = await request(app)
      .post('/api/payments/create-payment')
      .set('Authorization', `Bearer ${token}`)
      .send({
        school_id: 'TEST123',
        amount: 1000,
        callback_url: 'http://test.com/callback',
        student_info: {
          name: 'Test Student',
          class: '10',
          roll_number: '1'
        }
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    orderId = response.body.orderId;
  });

  test('Check payment status', async () => {
    const response = await request(app)
      .get(`/api/payments/payment-status/${orderId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

## Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure production MongoDB URI
- [ ] Set up SSL/HTTPS
- [ ] Configure CORS properly
- [ ] Set up logging and monitoring
- [ ] Configure rate limiting
- [ ] Set up backup strategies
- [ ] Configure webhook URLs for production

### Docker Deployment

```dockerfile
# Example Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb://your-production-db
JWT_SECRET=your-super-secure-production-secret
PG_SECRET_KEY=your-production-pg-secret
PG_API_KEY=your-production-pg-api
```

## Contributing

We welcome contributions to improve the Payment Gateway API! Here's how you can contribute:

### Getting Started

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/yourusername/payment-gateway-api.git
   ```
3. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Make your changes**
5. **Test your changes**
6. **Commit your changes:**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
7. **Push to your branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Write tests for new features
- Update documentation for API changes
- Use meaningful commit messages
- Keep pull requests focused and small

### Reporting Issues

Please use GitHub Issues to report bugs or request features. Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node.js version, OS, etc.)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

If you encounter any issues or have questions:

1. Check the [documentation](#api-documentation)
2. Search [existing issues](https://github.com/yourusername/payment-gateway-api/issues)
3. Create a [new issue](https://github.com/yourusername/payment-gateway-api/issues/new)
4. Contact the development team

---

**Made with ❤️ by Your Development Team**