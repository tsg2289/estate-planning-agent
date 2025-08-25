# Estate Planning Agent - Demo Guide 🎯

## 🚀 Quick Demo

This guide will walk you through testing the secure estate planning application.

## 1. Start the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser to `http://localhost:5173`

## 2. Test the Landing Page

### What You'll See:
- **Professional landing page** with security messaging
- **Navigation bar** with "Sign In" and "Get Started" buttons
- **Hero section** explaining the estate planning service
- **Features section** highlighting security and benefits
- **Security section** detailing encryption and protection
- **Call-to-action** sections for user engagement

### Test the Navigation:
- Click "Get Started" → Takes you to registration
- Click "Sign In" → Takes you to login
- Scroll through sections to see smooth animations
- Test responsive design on different screen sizes

## 3. Test User Registration

### Navigate to Registration:
- Click "Get Started" from landing page, or
- Go directly to `/login` and click "Sign up here"

### Test Password Requirements:
1. **Try weak passwords** to see validation:
   - `123` → Too short
   - `password` → Missing uppercase, numbers, special chars
   - `Password` → Missing numbers, special chars
   - `Password1` → Missing special chars

2. **Create a strong password**:
   - `SecurePass123!` → Should show "Strong" with green bars
   - Watch the password strength indicator update in real-time

### Test Form Validation:
- Try submitting with empty fields
- Test invalid email formats
- Verify password confirmation matching

## 4. Test User Login

### After Registration:
- You'll be automatically logged in
- Or log out and test the login flow

### Test Login:
- Use the credentials you just created
- Try incorrect password to see error handling
- Test with non-existent email

## 5. Test the Dashboard

### What You'll See:
- **Protected route** - only accessible when authenticated
- **Estate planning forms** for different document types
- **User session management**

### Test Protected Routes:
- Try accessing `/dashboard` without logging in
- Should redirect to login page
- After login, should access dashboard successfully

## 6. Test Security Features

### Password Strength:
- **Visual feedback** with colored bars
- **Real-time validation** as you type
- **Clear requirements** displayed below input

### Session Management:
- **JWT tokens** stored securely
- **Automatic validation** on page refresh
- **Logout functionality** clears all data

### Form Security:
- **Input sanitization** prevents XSS
- **Client-side validation** with server-side verification
- **Secure error messages** without information leakage

## 7. Test Responsive Design

### Mobile Testing:
- Open browser dev tools
- Toggle device toolbar
- Test on various screen sizes:
  - iPhone SE (375px)
  - iPhone 12 Pro (390px)
  - iPad (768px)
  - Desktop (1200px+)

### What to Look For:
- **Navigation** adapts to mobile
- **Forms** remain usable on small screens
- **Buttons** are appropriately sized for touch
- **Text** remains readable

## 8. Test API Endpoints

### Backend Testing:
```bash
# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!","name":"Test User"}'

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!"}'
```

## 9. Performance Testing

### Build Performance:
```bash
# Build for production
npm run build

# Check bundle size
ls -la dist/assets/
```

### Runtime Performance:
- **Page load times** should be under 2 seconds
- **Form interactions** should be responsive
- **Animations** should be smooth (60fps)

## 10. Security Testing

### Authentication Flow:
- **Registration** with strong password requirements
- **Login** with proper credential verification
- **Session management** with JWT tokens
- **Route protection** for authenticated areas

### Input Validation:
- **XSS prevention** in form inputs
- **SQL injection** protection (if database implemented)
- **CSRF protection** through proper form handling

## 🐛 Common Issues & Solutions

### Build Errors:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Conflicts:
```bash
# Check what's using port 5173
lsof -i :5173

# Kill process if needed
kill -9 <PID>
```

### Authentication Issues:
- Check browser console for errors
- Verify API endpoints are running
- Check environment variables

## 🎉 Demo Complete!

You've successfully tested:
- ✅ Secure landing page
- ✅ User registration with strong passwords
- ✅ User authentication and login
- ✅ Protected dashboard access
- ✅ Responsive design
- ✅ Security features
- ✅ API endpoints

## 🚀 Next Steps

1. **Customize the branding** for your estate planning business
2. **Add your logo** and color scheme
3. **Implement the estate planning forms** with your specific requirements
4. **Deploy to production** using the deployment scripts
5. **Set up monitoring** and analytics
6. **Add additional security features** like 2FA

## 📞 Need Help?

- Check the [README.md](./README.md) for detailed documentation
- Review [SECURITY_FEATURES.md](./SECURITY_FEATURES.md) for security details
- Open an issue on GitHub for bugs or questions

---

**Happy estate planning! 🏠✨**
