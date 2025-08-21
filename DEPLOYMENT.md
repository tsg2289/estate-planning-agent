# Vercel Deployment Guide

## Prerequisites
- Node.js 18+ installed
- Vercel CLI available via npx (no global installation needed)
- Git repository set up

## Local Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create local environment file:**
   ```bash
   cp env.example .env.local
   ```

3. **Test build locally:**
   ```bash
   npm run build
   npm run preview
   ```

## Vercel Deployment

### Option 1: Vercel CLI via npx (Recommended)

1. **Login to Vercel:**
   ```bash
   npx vercel login
   ```

2. **Deploy from project directory:**
   ```bash
   npx vercel
   ```

3. **Follow the prompts:**
   - Link to existing project or create new
   - Set project name
   - Confirm build settings

4. **Set environment variables in Vercel dashboard:**
   - Go to your project settings
   - Navigate to Environment Variables
   - Add the variables from `env.example`

### Option 2: Vercel Dashboard

1. **Connect your GitHub repository:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository

2. **Configure build settings:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set environment variables:**
   - Copy variables from `env.example`
   - Set production values

## Environment Variables

Set these in Vercel dashboard:

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_APP_NAME` | "Estate Planning Agent" | Application name |
| `VITE_APP_VERSION` | "1.0.0" | App version |
| `VITE_APP_ENV` | "production" | Environment |
| `VITE_ENABLE_ANALYTICS` | "false" | Analytics toggle |
| `VITE_ENABLE_DEBUG` | "false" | Debug mode |
| `VITE_ENABLE_DOCUMENT_GENERATION` | "true" | Document generation |
| `VITE_ENABLE_FORM_VALIDATION` | "true" | Form validation |

## Security Features

- **Security Headers:** Configured in `vercel.json`
- **HTTPS:** Automatically enabled by Vercel
- **Environment Variables:** Securely stored in Vercel
- **Build Optimization:** Minified and chunked output

## Post-Deployment

1. **Verify deployment:**
   - Check all routes work
   - Test form submissions
   - Verify document generation

2. **Monitor performance:**
   - Use Vercel Analytics
   - Check Core Web Vitals
   - Monitor error rates

3. **Set up custom domain (optional):**
   - Add domain in Vercel dashboard
   - Configure DNS records

## Troubleshooting

### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for syntax errors in code

### Environment Variables
- Ensure all required variables are set
- Check variable names match exactly
- Restart deployment after adding variables

### Performance Issues
- Enable Vercel Edge Functions if needed
- Optimize images and assets
- Use CDN for static files

## Maintenance

- **Regular Updates:** Keep dependencies updated
- **Security Audits:** Run `npm audit` regularly
- **Performance Monitoring:** Monitor Core Web Vitals
- **Backup:** Keep local backups of configuration
