# AutoFina Backend Setup Guide

This guide explains how to set up the separated backend and frontend architecture for AutoFina.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   MySQL         │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│   Database      │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 3306    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MySQL Server** (v8.0 or higher)
3. **npm** or **yarn**

## Setup Instructions

### 1. Database Setup

#### Install MySQL
```bash
# macOS
brew install mysql
brew services start mysql

# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql

# Windows
# Download from https://dev.mysql.com/downloads/mysql/
```

#### Create Database and User
```bash
mysql -u root -p
```

```sql
CREATE DATABASE autofina;
CREATE USER 'autofina_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON autofina.* TO 'autofina_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Backend Setup

#### Navigate to Backend Directory
```bash
cd backend
```

#### Install Dependencies
```bash
npm install
```

#### Configure Environment
```bash
cp env.example .env
```

Edit `.env` with your database credentials:
```env
DB_HOST=localhost
DB_USER=autofina_user
DB_PASSWORD=your_secure_password
DB_NAME=autofina
DB_PORT=3306
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### Start Backend Server
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

The backend will be available at `http://localhost:3001`

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd frontend
```

#### Install Dependencies
```bash
npm install
```

#### Configure Environment
```bash
cp env.example .env.local
```

Edit `.env.local`:
```env
# Database Configuration (for reference)
DB_HOST=localhost
DB_USER=autofina_user
DB_PASSWORD=your_secure_password
DB_NAME=autofina
DB_PORT=3306

# Backend API URL
BACKEND_URL=http://localhost:3001

# Next.js Configuration
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=http://localhost:3000
```

#### Start Frontend Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Backend API (Port 3001)

#### Orders
- `POST /orders` - Create new order
- `GET /orders` - Get all orders
- `GET /orders/:id` - Get order by ID
- `PATCH /orders/:id/status` - Update order status
- `DELETE /orders/:id` - Delete order

#### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID

### Frontend API (Port 3000)

The frontend acts as a proxy to the backend:
- `POST /api/order` - Proxies to backend `/orders`
- `GET /api/orders` - Proxies to backend `/orders`
- `PATCH /api/orders` - Proxies to backend `/orders/:id/status`

## Database Schema

### Orders Table
```sql
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL,
  short_description TEXT,
  technical_spec TEXT,
  timeline VARCHAR(100),
  telegram VARCHAR(100) NOT NULL,
  promo VARCHAR(100),
  email VARCHAR(255),
  message TEXT,
  status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  image_url VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Development Workflow

### 1. Start Both Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 2. Test the Integration
1. Go to `http://localhost:3000/order`
2. Fill out the form
3. Submit the form
4. Check the database:
```sql
SELECT * FROM autofina.orders ORDER BY created_at DESC;
```

### 3. View Orders (Admin)
```bash
curl http://localhost:3001/orders
```

## Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Configure production database
3. Use PM2 or similar process manager
4. Set up reverse proxy (nginx)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Configure environment variables

## Troubleshooting

### Common Issues

1. **Backend Connection Refused**
   - Check if backend is running on port 3001
   - Verify CORS configuration

2. **Database Connection Failed**
   - Check MySQL is running
   - Verify database credentials
   - Test connection manually

3. **Frontend API Errors**
   - Check if backend is accessible
   - Verify environment variables
   - Check network connectivity

### Testing Database Connection
```bash
# Test backend database connection
curl http://localhost:3001/orders

# Test frontend proxy
curl http://localhost:3000/api/orders
```

## Security Considerations

1. **Environment Variables** - Never commit `.env` files
2. **Database Security** - Use strong passwords and limited privileges
3. **CORS Configuration** - Restrict to specific origins in production
4. **Input Validation** - All inputs are validated on the backend
5. **Error Handling** - Sensitive information is not exposed in errors

## File Structure

```
AutoFina-Web/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── orders/         # Orders module
│   │   ├── products/       # Products module
│   │   ├── app.module.ts   # Main app module
│   │   └── main.ts         # Application entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── env.example
├── frontend/               # Next.js Frontend
│   ├── app/
│   │   ├── api/           # API proxy routes
│   │   └── ...
│   ├── components/        # React components
│   └── ...
└── BACKEND_SETUP.md       # This file
```

## Support

For issues or questions:
1. Check the console logs for error messages
2. Verify all services are running
3. Test database connectivity
4. Check environment variable configuration
