# School Payment Service

A comprehensive payment management system for schools with integrated payment gateway support.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## Features

- Payment processing with multiple gateway support (PhonePe, Razorpay, PayU)
- Transaction status tracking and management
- Webhook handling for real-time payment updates
- School and student management system
- Comprehensive transaction logging and reporting
- Modern React frontend with responsive design
- RESTful API architecture with JWT authentication

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14.0.0 or higher)
- npm or yarn package manager
- MongoDB database
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd school-payment-service
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Environment Configuration

Both frontend and backend require environment configuration. Please refer to the specific documentation for detailed setup instructions.

## Documentation

For detailed setup, configuration, and usage instructions, please refer to the specific documentation:

📁 **[Frontend Documentation](frontend/README.md)** - React application setup, features, and usage

📁 **[Backend Documentation](backend/README.md)** - API documentation, endpoints, and server configuration

## Project Structure

```
school-payment-service/
├── frontend/          # React frontend application
│   └── README.md     # Frontend documentation
├── backend/          # Node.js backend API
│   └── README.md     # Backend documentation
└── README.md        # This file
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**For detailed implementation details, API references, and usage examples, please check the respective frontend and backend README files.**