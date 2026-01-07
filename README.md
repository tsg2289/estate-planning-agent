# Estate Planning Agent 🏠

A secure, professional estate planning application that allows users to create comprehensive estate plans, wills, trusts, and power of attorney documents with enterprise-grade security.

## 🌐 **Live Application**

**Frontend**: [https://estate-planning-agent.vercel.app](https://estate-planning-agent.vercel.app)  
**Backend API**: [https://estate-planning-agent.vercel.app/api](https://estate-planning-agent.vercel.app/api)

**Demo Credentials**:
- **Email**: `demo@example.com`
- **Password**: `DemoPass123!`

## ✨ Features

### 🔐 Security First
- **Bank-level encryption** with AES-256
- **Strong password requirements** (8+ chars, uppercase, lowercase, numbers, special chars)
- **Real-time password strength indicator**
- **JWT authentication** with secure session management
- **HTTPS/TLS protection** for all communications
- **XSS and CSRF protection**

### 📋 Estate Planning Tools
- **Will Creation** - Comprehensive last will and testament
- **Trust Formation** - Living trust and testamentary trust documents
- **Power of Attorney** - Financial and healthcare POA forms
- **Healthcare Directives** - Advanced healthcare directives
- **Document Generation** - Professional Word document output

### 🎨 Professional Interface
- **Modern, responsive design** that works on all devices
- **Intuitive user experience** with guided forms
- **Professional branding** that builds trust
- **Accessibility compliant** design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser
- Vercel account (for backend deployment)

### Frontend Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd estate-planning-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.local.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Backend Deployment (Required for Full Functionality)

**Option 1: Automated Deployment (Recommended)**
```bash
./deploy-backend.sh
```

**Option 2: Manual Deployment**
```bash
npm install -g vercel
vercel login
vercel --prod
```

**Important**: After deployment, set `JWT_SECRET` in your Vercel dashboard.

📖 **Full deployment guide**: [BACKEND_DEPLOYMENT.md](./BACKEND_DEPLOYMENT.md)

## 🏗️ Project Structure

```
estate-planning-agent/
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx          # Secure landing page
│   │   ├── auth/                     # Authentication components
│   │   │   ├── AuthPage.jsx         # Main auth container
│   │   │   ├── Login.jsx            # Login form
│   │   │   ├── Register.jsx         # Registration form
│   │   │   └── ProtectedRoute.jsx   # Route protection
│   │   ├── forms/                    # Estate planning forms
│   │   │   ├── WillForm.jsx         # Will creation
│   │   │   ├── TrustForm.jsx        # Trust formation
│   │   │   ├── POAForm.jsx          # Power of attorney
│   │   │   └── AHCDForm.jsx         # Healthcare directives
│   │   └── EstatePlanningApp.jsx    # Main application
│   ├── contexts/
│   │   └── AuthContext.jsx          # Authentication state
│   ├── config/
│   │   └── security.js              # Security configuration
│   └── lib/
│       ├── generateDocx.js          # Document generation
│       └── templates.js             # Document templates
├── api/                              # Backend API endpoints
│   ├── auth/
│   │   ├── login.js                  # Login endpoint
│   │   ├── register.js               # Registration endpoint
│   │   └── verify.js                 # Token verification
│   ├── lib/
│   │   └── users.js                  # Shared user storage
│   └── health.js                     # Health check endpoint
└── public/                           # Static assets
```

## 🔒 Security Features

### Authentication
- **Email-based login** (email serves as username)
- **Strong password requirements** enforced on both client and server
- **Password strength indicator** with real-time feedback
- **Secure session management** with automatic timeouts

### Data Protection
- **AES-256 encryption** for sensitive data
- **bcrypt password hashing** with 12 salt rounds
- **JWT tokens** with configurable expiration
- **Input sanitization** to prevent XSS attacks

### API Security
- **Rate limiting** protection
- **Input validation** on all endpoints
- **Secure headers** configuration
- **CORS protection**

## 📱 User Experience

### Landing Page
- **Professional design** that builds trust
- **Clear value proposition** for estate planning
- **Security messaging** to reassure users
- **Easy navigation** to sign up or log in

### Authentication Flow
- **Simple registration** with clear requirements
- **Password strength feedback** in real-time
- **Seamless login** experience
- **Protected dashboard** access

### Estate Planning Forms
- **Step-by-step guidance** through complex forms
- **Professional templates** for all document types
- **Document preview** before generation
- **Download options** in multiple formats

## 🚀 Deployment

### Frontend Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - **Vercel**: `vercel --prod`
   - **Netlify**: Drag and drop `dist/` folder
   - **AWS S3**: Upload `dist/` contents
   - **Custom server**: Upload to your web server

### Backend API Deployment

1. **Set up environment variables**
   ```bash
   JWT_SECRET=your-super-secure-secret
   DATABASE_URL=your-database-connection
   ```

2. **Deploy API endpoints**
   - **Vercel Functions**: Automatic with frontend
   - **Netlify Functions**: Add to `netlify/functions/`
   - **Custom server**: Deploy to your backend

### Security Checklist for Production

- [ ] Enable HTTPS/TLS
- [ ] Set secure environment variables
- [ ] Configure security headers
- [ ] Set up monitoring and logging
- [ ] Enable rate limiting
- [ ] Regular security audits

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run security-check # Security audit
```

### Code Quality

- **ESLint** configuration for code quality
- **Prettier** for consistent formatting
- **TypeScript** support (optional)
- **Component-based architecture**

### Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📚 Documentation

- [Security Features](./SECURITY_FEATURES.md) - Detailed security documentation
- [API Documentation](./api/README.md) - Backend API reference
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment instructions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the docs folder
- **Issues**: Report bugs via GitHub Issues
- **Security**: Report security issues privately
- **Questions**: Open a GitHub Discussion

## 🔮 Roadmap

- [ ] **Two-factor authentication** (2FA)
- [ ] **Document templates** for all 50 states
- [ ] **E-signature integration**
- [ ] **Document storage** and management
- [ ] **Collaborative editing** for families
- [ ] **Legal expert review** integration
- [ ] **Mobile app** development

---

**Built with ❤️ for secure estate planning**

*This application is designed for educational and demonstration purposes. For legal advice, please consult with a qualified attorney.*
# Force Vercel Rebuild - Wed Jan  7 14:44:55 PST 2026
