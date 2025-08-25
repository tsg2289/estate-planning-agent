# Authentication Setup Guide

This guide will help you set up the secure authentication system for your Estate Planning Agent application.

## Features

- ✅ Secure user registration with email and password
- ✅ User login with JWT token authentication
- ✅ Protected routes for authenticated users
- ✅ Password hashing with bcryptjs
- ✅ JWT token generation and verification
- ✅ Responsive authentication UI
- ✅ Automatic token refresh and validation

## Prerequisites

- Node.js 16+ installed
- Vercel account for hosting
- Basic understanding of environment variables

## Installation

### 1. Install Dependencies

```bash
npm install
```

This will install the required packages:
- `react-router-dom` - For routing and protected routes
- `bcryptjs` - For password hashing
- `jsonwebtoken` - For JWT token management

### 2. Environment Configuration

Create a `.env.local` file in your project root:

```bash
# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-change-this-in-production

# Database Configuration (for future use)
# DATABASE_URL=your-database-connection-string

# Other Configuration
# NODE_ENV=production
```

**⚠️ IMPORTANT:** Change the JWT_SECRET to a strong, unique key in production!

### 3. API Dependencies

Navigate to the API directory and install serverless function dependencies:

```bash
cd api
npm install
```

## Security Features

### Password Security
- Passwords are hashed using bcryptjs with 12 salt rounds
- Minimum password length: 6 characters
- Passwords are never stored in plain text

### JWT Security
- Tokens expire after 7 days
- Secure token verification on each request
- Automatic token refresh and validation

### Input Validation
- Email format validation
- Required field validation
- XSS protection through proper input sanitization

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST `/api/auth/login`
Authenticate existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET `/api/auth/verify`
Verify JWT token and return user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "123",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Demo Account

For testing purposes, a demo account is available:

- **Email:** `demo@example.com`
- **Password:** `password123`

## Deployment

### Vercel Deployment

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add authentication system"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard:
     - `JWT_SECRET`: Your secure JWT secret key

3. **Install API Dependencies:**
   - In Vercel dashboard, go to Functions
   - Navigate to `/api` directory
   - Install dependencies: `npm install`

### Environment Variables in Vercel

Set these in your Vercel project settings:

```
JWT_SECRET=your-production-jwt-secret-key
```

## Usage

### User Registration
1. Navigate to `/login`
2. Click "Sign up here"
3. Fill in your details and create account

### User Login
1. Navigate to `/login`
2. Enter your email and password
3. Click "Sign In"

### Protected Routes
- All estate planning forms are protected
- Users must be authenticated to access `/dashboard`
- Unauthenticated users are redirected to `/login`

### Logout
- Click the "Logout" button in the header
- User is redirected to login page
- JWT token is removed from localStorage

## Customization

### Styling
- Authentication styles are in `src/components/auth/Auth.css`
- Main app styles are in `src/components/EstatePlanningApp.css`
- Global styles are in `src/styles.css`

### Security Settings
- JWT expiration: Modify `expiresIn` in auth functions
- Password requirements: Update validation in components
- Salt rounds: Change `SALT_ROUNDS` in registration API

## Troubleshooting

### Common Issues

1. **"Module not found" errors:**
   - Ensure all dependencies are installed
   - Check that `api/package.json` exists and has correct dependencies

2. **Authentication not working:**
   - Verify JWT_SECRET is set in environment variables
   - Check browser console for API errors
   - Ensure API endpoints are accessible

3. **CORS issues:**
   - Vercel handles CORS automatically
   - For local development, ensure API routes are correct

### Debug Mode

Enable debug logging by adding to your environment:

```bash
DEBUG=auth:*
```

## Future Enhancements

- [ ] Database integration (PostgreSQL, MongoDB)
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Social login (Google, Facebook)
- [ ] User profile management
- [ ] Session management
- [ ] Rate limiting

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Verify environment variable configuration
4. Check Vercel function logs

## Security Notes

- Never commit `.env` files to version control
- Use strong, unique JWT secrets in production
- Regularly rotate JWT secrets
- Monitor for suspicious authentication attempts
- Implement rate limiting for production use
- Consider adding CAPTCHA for registration
- Enable HTTPS in production
