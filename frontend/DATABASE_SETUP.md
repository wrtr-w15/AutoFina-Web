# MySQL Database Setup for AutoFina

This guide will help you set up MySQL database integration for the AutoFina order form.

## Prerequisites

1. **MySQL Server** - Make sure MySQL is installed and running
2. **Node.js** - Already installed for the project
3. **Environment Variables** - Configure database connection

## Setup Steps

### 1. Install MySQL Server

**On macOS (using Homebrew):**
```bash
brew install mysql
brew services start mysql
```

**On Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

**On Windows:**
- Download MySQL installer from https://dev.mysql.com/downloads/mysql/
- Follow the installation wizard

### 2. Create Database and User

Connect to MySQL as root:
```bash
mysql -u root -p
```

Run the following commands:
```sql
CREATE DATABASE autofina;
CREATE USER 'autofina_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON autofina.* TO 'autofina_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Initialize Database Schema

Run the initialization script:
```bash
mysql -u autofina_user -p autofina < scripts/init-db.sql
```

Or manually run the SQL commands from `scripts/init-db.sql`.

### 4. Configure Environment Variables

Copy the example environment file:
```bash
cp env.example .env.local
```

Edit `.env.local` with your database credentials:
```env
DB_HOST=localhost
DB_USER=autofina_user
DB_PASSWORD=your_secure_password
DB_NAME=autofina
DB_PORT=3306
```

### 5. Test the Setup

Start the development server:
```bash
npm run dev
```

1. Go to `/order` page
2. Fill out the form
3. Submit the form
4. Check your MySQL database for the new order:
```sql
SELECT * FROM autofina.orders ORDER BY created_at DESC;
```

## Database Schema

The `orders` table contains the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | INT | Auto-increment primary key |
| `project_name` | VARCHAR(255) | Project name |
| `short_description` | TEXT | Short project description |
| `technical_spec` | TEXT | Technical specifications |
| `timeline` | VARCHAR(100) | Project timeline |
| `telegram` | VARCHAR(100) | Telegram username (required) |
| `promo` | VARCHAR(100) | Promo code |
| `email` | VARCHAR(255) | Email address |
| `message` | TEXT | Additional message |
| `status` | ENUM | Order status (pending, in_progress, completed, cancelled) |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

## API Endpoints

### POST /api/order
Creates a new order from the form submission.

**Request Body:**
```json
{
  "projectName": "My Project",
  "shortDescription": "Project description",
  "technicalSpec": "Technical details",
  "timeline": "1 week",
  "telegram": "@username",
  "promo": "PROMO123",
  "email": "user@example.com",
  "message": "Additional notes"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "orderId": 123
}
```

### GET /api/orders
Retrieves all orders (for admin purposes).

**Response:**
```json
{
  "success": true,
  "orders": [...]
}
```

### PATCH /api/orders
Updates order status.

**Request Body:**
```json
{
  "id": 123,
  "status": "in_progress"
}
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if MySQL is running: `brew services list | grep mysql`
   - Verify connection details in `.env.local`

2. **Access Denied**
   - Check username and password
   - Verify user has proper privileges

3. **Database Not Found**
   - Run the initialization script
   - Check database name in environment variables

### Testing Database Connection

You can test the connection by running:
```bash
node -e "
const { initializeDatabase } = require('./lib/database');
initializeDatabase().then(() => console.log('Database connected!')).catch(console.error);
"
```

## Security Notes

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use strong passwords** for database users
3. **Limit database privileges** to only what's needed
4. **Use SSL connections** in production
5. **Regular backups** of your database

## Production Deployment

For production deployment:

1. **Use environment variables** for all database configuration
2. **Enable SSL** for database connections
3. **Set up regular backups**
4. **Monitor database performance**
5. **Use connection pooling** (already implemented)

## Support

If you encounter issues:

1. Check the console logs for error messages
2. Verify MySQL is running and accessible
3. Test database connection manually
4. Check environment variables are correct
