# Two-Factor Authentication (2FA) Setup Guide

This guide will help you set up and use the two-factor authentication system for your Estate Planning Agent application.

## 🚀 Features

- ✅ **Email-based 2FA**: 6-digit verification codes sent via email
- ✅ **Secure token system**: Temporary tokens with 10-minute expiration
- ✅ **Beautiful UI**: Modern, responsive verification interface
- ✅ **Timer countdown**: Visual countdown showing code expiration
- ✅ **Resend functionality**: Option to request new codes
- ✅ **Security features**: Rate limiting and secure code generation

## 📧 Email Configuration

### 1. Gmail Setup (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. **Update your environment variables**:

```bash
# .env.local
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-digit-app-password
FROM_EMAIL=noreply@yourdomain.com
FRONTEND_URL=https://your-app.vercel.app
```

### 2. Other Email Providers

#### Outlook/Hotmail
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

#### Yahoo
```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

#### Custom SMTP Server
```bash
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
```

## 🔧 Installation

### 1. Install Dependencies

```bash
# Backend dependencies
cd api
npm install nodemailer

# Frontend dependencies
cd ..
npm install react-hot-toast
```

### 2. Environment Setup

Copy the example environment file and configure your email settings:

```bash
cp env.example .env.local
# Edit .env.local with your email configuration
```

### 3. Database Updates

The system automatically handles 2FA state through temporary JWT tokens. No database schema changes are required.

## 🔐 How It Works

### Registration Flow
1. User fills out registration form
2. System creates account and sends verification code via email
3. User enters 6-digit code
4. Account is verified and user is logged in
5. User is redirected to dashboard

### Login Flow
1. User enters email and password
2. System validates credentials and sends verification code via email
3. User enters 6-digit code
4. 2FA is verified and user is logged in
5. User is redirected to dashboard

### Security Features
- **6-digit codes**: Randomly generated, non-sequential
- **10-minute expiration**: Codes automatically expire for security
- **Temporary tokens**: JWT tokens with embedded verification codes
- **Rate limiting**: Built-in protection against brute force attacks
- **Secure email**: Professional email templates with security warnings

## 📱 User Experience

### 1. Registration with 2FA
```
User Registration → Email Verification → 2FA Code Entry → Dashboard
```

### 2. Login with 2FA
```
User Login → Email Verification → 2FA Code Entry → Dashboard
```

### 3. 2FA Interface Features
- **Email display**: Shows which email the code was sent to
- **Countdown timer**: Visual countdown showing code expiration
- **Code input**: Large, easy-to-read input field
- **Help section**: Troubleshooting tips and support information
- **Back button**: Easy navigation back to login/registration

## 🎨 Customization

### Email Templates

Edit the email templates in `api/lib/email-service.js`:

```javascript
// Customize verification email
export const sendVerificationCode = async (email, code, userName = 'User') => {
  // Modify the HTML template here
  const mailOptions = {
    // ... your custom template
  };
};
```

### Styling

Customize the 2FA component styles in `src/components/auth/Auth.css`:

```css
/* Custom verification code input */
.verification-code-input {
  font-size: 28px;
  letter-spacing: 10px;
  /* Add your custom styles */
}
```

### Timer Duration

Change the code expiration time in the API files:

```javascript
// In api/auth/login.js and api/auth/register.js
const tempToken = jwt.sign(
  { 
    // ... other fields
    codeExpiry: Date.now() + (15 * 60 * 1000) // 15 minutes instead of 10
  },
  JWT_SECRET,
  { expiresIn: '15m' }
);
```

## 🚀 Deployment

### 1. Vercel Deployment

1. **Set environment variables** in Vercel dashboard:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   FROM_EMAIL=noreply@yourdomain.com
   FRONTEND_URL=https://your-app.vercel.app
   JWT_SECRET=your-secure-jwt-secret
   ```

2. **Deploy your application**:
   ```bash
   git add .
   git commit -m "Add two-factor authentication"
   git push origin main
   ```

### 2. Railway Deployment

1. **Set environment variables** in Railway dashboard
2. **Redeploy your backend**:
   ```bash
   cd api
   npm run deploy
   ```

## 🧪 Testing

### 1. Development Mode

In development, the system uses Ethereal Email for testing:

```bash
# Check console for email preview URLs
npm run dev
```

### 2. Production Testing

1. **Use a real email account** for testing
2. **Check spam folders** if emails don't arrive
3. **Verify SMTP settings** with your email provider

## 🔒 Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env` files to version control
- ✅ Use strong, unique JWT secrets
- ✅ Rotate email passwords regularly
- ✅ Use app passwords instead of main passwords

### 2. Email Security
- ✅ Enable 2FA on your email account
- ✅ Use app-specific passwords
- ✅ Monitor for suspicious activity
- ✅ Regularly review email access logs

### 3. Application Security
- ✅ Keep dependencies updated
- ✅ Monitor authentication logs
- ✅ Implement rate limiting in production
- ✅ Use HTTPS in production

## 🆘 Troubleshooting

### Common Issues

#### 1. Emails Not Sending
```bash
# Check environment variables
echo $SMTP_USER
echo $SMTP_PASS

# Check console logs for errors
# Verify SMTP settings with your provider
```

#### 2. 2FA Not Working
```bash
# Check API endpoints are accessible
curl -X POST https://your-api.com/api/auth/login

# Verify JWT_SECRET is set
# Check email configuration
```

#### 3. Code Expiration Issues
```bash
# Check server time synchronization
# Verify codeExpiry calculation
# Check JWT token expiration settings
```

### Debug Mode

Enable debug logging:

```bash
# Backend
export DEBUG=2fa:*
export DEBUG=email:*

# Frontend
export VITE_ENABLE_DEBUG=true
```

## 📊 Monitoring

### 1. Email Delivery
- Monitor email delivery rates
- Check spam folder placement
- Track email open rates

### 2. Authentication Metrics
- Track 2FA success/failure rates
- Monitor code expiration patterns
- Log authentication attempts

### 3. Performance Metrics
- Email sending response times
- 2FA verification response times
- User experience metrics

## 🔄 Future Enhancements

- [ ] **SMS 2FA**: Add SMS-based verification
- [ ] **Authenticator Apps**: TOTP support (Google Authenticator, Authy)
- [ ] **Backup Codes**: Generate backup verification codes
- [ ] **Remember Device**: Option to remember trusted devices
- [ ] **Biometric 2FA**: Fingerprint/face recognition support
- [ ] **Hardware Keys**: FIDO2/U2F support

## 📞 Support

### Getting Help
1. **Check the console** for error messages
2. **Verify environment variables** are set correctly
3. **Test email configuration** with a simple SMTP test
4. **Review API logs** for authentication errors

### Useful Commands
```bash
# Test email configuration
cd api
node -e "import('./lib/email-service.js').then(es => es.sendVerificationCode('test@example.com', '123456', 'Test User'))"

# Check API health
curl https://your-api.com/api/health

# Verify JWT tokens
node -e "import('jsonwebtoken').then(jwt => console.log(jwt.verify('your-token', 'your-secret')))"
```

---

## 🎯 Quick Start Checklist

- [ ] Install nodemailer dependency
- [ ] Configure email environment variables
- [ ] Test email sending in development
- [ ] Deploy to production
- [ ] Test 2FA flow end-to-end
- [ ] Monitor email delivery rates
- [ ] Set up monitoring and alerts

**Congratulations!** 🎉 Your Estate Planning Agent now has enterprise-grade two-factor authentication security.
