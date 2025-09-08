# Security Configuration and Deployment Guide

This document outlines the comprehensive security measures implemented in the Estate Planning Agent application and provides step-by-step deployment instructions.

## 🔒 Security Features Implemented

### Content Security Policy (CSP)
- **Strict CSP headers** prevent XSS attacks
- **Script source restrictions** allow only trusted domains
- **Style source controls** prevent CSS injection
- **Frame restrictions** prevent clickjacking
- **Object restrictions** block dangerous plugins

### Security Headers
- **X-Content-Type-Options: nosniff** - Prevents MIME type sniffing
- **X-Frame-Options: DENY** - Prevents clickjacking
- **X-XSS-Protection: 1; mode=block** - Enables XSS filtering
- **Referrer-Policy: strict-origin-when-cross-origin** - Controls referrer information
- **Strict-Transport-Security** - Enforces HTTPS (production only)

### Rate Limiting
- **API Rate Limiting**: 100 requests per 15 minutes per IP
- **Authentication Rate Limiting**: 10 login attempts per 15 minutes per IP/email
- **Password Reset Rate Limiting**: 3 reset requests per hour per IP/email
- **Custom rate limiters** for different endpoint types

### Account Security
- **Account Lockout**: 5 failed attempts locks account for 30 minutes
- **Secure Password Reset**: Token-based with 1-hour expiry
- **Progressive Warnings**: Shows remaining attempts before lockout
- **Email Notifications**: Professional templates for security events

### Input Validation & Sanitization
- **Request size limits**: 10MB max payload
- **JSON parsing protection**: Prevents JSON bombs
- **Email validation**: Proper format checking
- **Password policies**: Configurable strength requirements

## 🚀 Deployment Instructions

### Step 1: Environment Variables Setup

Create the following environment variables in your deployment platform:

```bash
# Required for production
NODE_ENV=production
FRONTEND_URL=https://your-domain.vercel.app
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Email configuration (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
FROM_EMAIL=noreply@your-domain.com
```

### Step 2: Vercel Deployment

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy the application**:
   ```bash
   vercel --prod
   ```

4. **Configure environment variables** in Vercel dashboard:
   - Go to your project in Vercel dashboard
   - Navigate to Settings → Environment Variables
   - Add all required variables from the list above

### Step 3: Domain Configuration

1. **Custom Domain** (optional):
   - Go to Vercel project settings
   - Add your custom domain
   - Configure DNS records as instructed

2. **SSL Certificate**:
   - Vercel automatically provides SSL certificates
   - Verify HTTPS is working correctly

### Step 4: Email Service Setup

#### Gmail Setup (Recommended for development/small scale):
1. Enable 2-Factor Authentication on Gmail
2. Generate an App Password:
   - Google Account Settings → Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
3. Use the generated password in `SMTP_PASS` environment variable

#### Production Email Service:
For production, consider using:
- **SendGrid**: Professional email delivery
- **Mailgun**: Reliable email API
- **Amazon SES**: Cost-effective email service

### Step 5: Database Configuration (Optional)

For production persistence, consider upgrading from in-memory storage:

#### PostgreSQL (Recommended):
```bash
# Add to environment variables
DATABASE_URL=postgresql://user:password@host:port/database
```

#### Supabase Integration:
```bash
# Add to environment variables
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🔧 Configuration Files

### vercel.json
The `vercel.json` file includes:
- **Security headers** for all routes
- **API routing** configuration
- **CORS settings** for API endpoints
- **Content Security Policy** directives

### Security Configuration
The `src/config/security.js` file provides:
- **Centralized security settings**
- **CSP directive management**
- **Rate limiting configuration**
- **Password policy settings**

## 🛡️ Security Best Practices

### Production Checklist
- [ ] All environment variables configured
- [ ] HTTPS enforced (automatic with Vercel)
- [ ] Strong JWT secret generated
- [ ] Email service properly configured
- [ ] Rate limiting enabled
- [ ] Security headers verified
- [ ] CSP policy tested
- [ ] Account lockout tested

### Monitoring and Maintenance
1. **Regular Security Updates**:
   - Keep dependencies updated
   - Monitor security advisories
   - Review and update CSP policies

2. **Log Monitoring**:
   - Monitor failed login attempts
   - Track rate limit violations
   - Review security events

3. **Performance Monitoring**:
   - Monitor API response times
   - Track rate limit effectiveness
   - Review user experience metrics

## 🧪 Testing Security Features

### Account Lockout Testing
```bash
# Test with the provided script
node test-account-lockout.js
```

### Rate Limiting Testing
```bash
# Test API rate limits
for i in {1..15}; do
  curl -X POST https://your-domain.vercel.app/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
done
```

### Security Headers Testing
```bash
# Test security headers
curl -I https://your-domain.vercel.app
```

## 🔍 Security Monitoring

### Key Metrics to Monitor
- Failed login attempt rates
- Account lockout frequency
- Rate limit violations
- Password reset requests
- API error rates

### Recommended Tools
- **Vercel Analytics**: Built-in performance monitoring
- **Sentry**: Error tracking and monitoring
- **LogRocket**: User session recording
- **Security scanners**: Regular vulnerability assessments

## 📞 Support and Troubleshooting

### Common Issues
1. **CORS Errors**: Check FRONTEND_URL environment variable
2. **Email Not Sending**: Verify SMTP credentials and app password
3. **Rate Limiting Too Strict**: Adjust limits in security configuration
4. **CSP Violations**: Update CSP directives for new resources

### Security Incident Response
1. **Immediate Actions**:
   - Identify and contain the issue
   - Review logs for suspicious activity
   - Update affected credentials

2. **Investigation**:
   - Analyze attack patterns
   - Review security configurations
   - Check for data exposure

3. **Recovery**:
   - Apply security patches
   - Update configurations
   - Notify affected users if necessary

This security configuration provides enterprise-level protection for your Estate Planning Agent application while maintaining excellent user experience and performance.
