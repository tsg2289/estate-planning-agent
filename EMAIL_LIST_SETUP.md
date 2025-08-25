# Email List Database Setup Guide

This guide will help you set up a complete email list management system for your estate planning application. The system includes a SQLite database, API endpoints, and a React-based management interface.

## 🚀 Quick Start

### 1. Install Dependencies

First, install the new database dependencies:

```bash
cd api
npm install
```

### 2. Initialize the Database

Run the database initialization script:

```bash
npm run db:init
```

This will:
- Create the `data/` directory
- Initialize the SQLite database
- Create the necessary tables for users and email lists
- Set up proper indexes for performance

### 3. Start Your Backend

```bash
npm run dev
```

## 📊 Database Structure

The system creates two main tables:

### Users Table
- `id`: Unique user identifier
- `email`: User's email address (unique)
- `name`: User's full name
- `password`: Hashed password
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp
- `is_active`: Account status
- `email_verified`: Email verification status
- `last_login`: Last login timestamp
- `assessment_answers`: JSON string of estate planning assessment

### Email List Table
- `id`: Auto-incrementing primary key
- `email`: Email address (unique)
- `name`: Subscriber's name
- `source`: How they joined (registration, landing_page, manual, etc.)
- `subscribed`: Subscription status
- `subscribed_at`: When they subscribed
- `unsubscribed_at`: When they unsubscribed (if applicable)
- `created_at`: Entry creation timestamp
- `updated_at`: Last update timestamp
- `tags`: Comma-separated tags for segmentation
- `notes`: Additional notes about the subscriber

## 🔌 API Endpoints

### Email List Management

#### GET `/api/email-list`
- **Purpose**: Retrieve email list with optional filtering
- **Query Parameters**:
  - `subscribed`: Filter by subscription status (true/false)
  - `source`: Filter by source
  - `tags`: Filter by tags
  - `action=stats`: Get email list statistics
  - `action=export&format=csv`: Export email list as CSV

#### POST `/api/email-list`
- **Purpose**: Add new email to list
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "name": "John Doe",
    "source": "landing_page",
    "tags": "estate-planning, interested",
    "notes": "Found through Google search"
  }
  ```

#### PUT `/api/email-list`
- **Purpose**: Update existing email list entry
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "tags": "estate-planning, follow-up",
    "notes": "Interested in trust documents"
  }
  ```

#### DELETE `/api/email-list?email=user@example.com`
- **Purpose**: Remove email from list (soft delete)

### Bulk Operations

#### POST `/api/email-list` (Bulk Add)
- **Purpose**: Add multiple emails at once
- **Body**:
  ```json
  {
    "action": "bulk-add",
    "emails": [
      {
        "email": "user1@example.com",
        "name": "User One",
        "source": "manual"
      },
      {
        "email": "user2@example.com",
        "name": "User Two",
        "source": "manual"
      }
    ]
  }
  ```

## 🎯 Usage Examples

### 1. Adding Emails from Landing Page

The `EmailSignup` component automatically adds emails to your list when visitors sign up:

```jsx
import EmailSignup from './components/EmailSignup';

<EmailSignup 
  title="Stay Updated"
  subtitle="Get estate planning tips and updates"
  source="landing_page"
  tags="estate-planning, newsletter"
  onSuccess={(data) => console.log('New subscriber:', data)}
/>
```

### 2. Programmatically Adding Emails

```javascript
const addEmailToList = async (emailData) => {
  const response = await fetch('/api/email-list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emailData)
  });
  
  const result = await response.json();
  if (result.success) {
    console.log('Email added successfully');
  }
};

// Usage
addEmailToList({
  email: 'newuser@example.com',
  name: 'New User',
  source: 'referral',
  tags: 'estate-planning, referral'
});
```

### 3. Exporting Your Email List

```javascript
const exportEmailList = async (format = 'csv') => {
  const response = await fetch(`/api/email-list?action=export&format=${format}`);
  const result = await response.json();
  
  if (result.success) {
    // Download the file
    const link = document.createElement('a');
    link.href = `/data/email-list-export.${format}`;
    link.download = `email-list-export.${format}`;
    link.click();
  }
};
```

## 🎨 Email Signup Component Themes

The `EmailSignup` component supports multiple themes:

```jsx
// Default theme (blue gradient)
<EmailSignup />

// Alternative theme (blue to cyan)
<EmailSignup className="alt-theme" />

// Dark theme
<EmailSignup className="dark-theme" />

// Warm theme (pink gradient)
<EmailSignup className="warm-theme" />

// Compact version
<EmailSignup className="compact" />

// Inline version (no background)
<EmailSignup className="inline" />
```

## 📈 Email List Manager

The `EmailListManager` component provides a full admin interface for managing your email list:

- **Statistics Dashboard**: View subscriber counts, growth metrics, and source breakdowns
- **Filtering**: Filter by subscription status, source, and tags
- **Bulk Operations**: Add multiple emails at once
- **Export Options**: Export in CSV, JSON, or TXT formats
- **Individual Management**: Edit, remove, or update subscriber information

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **Input Validation**: Comprehensive validation for all inputs
- **SQL Injection Protection**: Parameterized queries prevent SQL injection
- **CORS Configuration**: Proper CORS headers for cross-origin requests

## 📁 File Structure

```
api/
├── lib/
│   ├── database.js          # Database configuration and initialization
│   ├── users-db.js          # Database-based user management
│   └── email-list.js        # Email list operations
├── auth/
│   └── register.js          # Updated registration endpoint
├── email-list.js            # Email list API endpoints
└── scripts/
    └── init-db.js           # Database initialization script

src/components/
├── EmailListManager.jsx     # Admin interface for email list
├── EmailListManager.css     # Styles for email list manager
├── EmailSignup.jsx          # Email signup component
├── EmailSignup.css          # Styles for email signup
└── LandingPage.jsx          # Updated with email signup
```

## 🚀 Deployment

### Local Development
```bash
cd api
npm run dev
```

### Production
1. Ensure your database file is in a persistent location
2. Set proper environment variables for JWT secrets
3. Configure your web server to serve the `/data/` directory for exports

## 📊 Monitoring and Analytics

The system provides built-in analytics:

- **Subscriber Growth**: Track new signups over time
- **Source Attribution**: See where your subscribers come from
- **Engagement Metrics**: Monitor subscription/unsubscription rates
- **Tag Segmentation**: Organize subscribers by interests

## 🔄 Integration with Email Marketing Services

You can easily integrate with services like Mailchimp, ConvertKit, or ActiveCampaign by:

1. Exporting your email list in CSV format
2. Using the bulk add API to sync subscribers
3. Implementing webhooks for real-time synchronization

## 🆘 Troubleshooting

### Common Issues

1. **Database not found**: Run `npm run db:init`
2. **Permission errors**: Ensure the `data/` directory is writable
3. **CORS issues**: Check that your API URL is correctly configured
4. **Export fails**: Verify the `/data/` directory exists and is accessible

### Debug Mode

Enable debug logging by setting:
```bash
export DEBUG=email-list:*
```

## 📞 Support

For additional help or customizations:
1. Check the console for error messages
2. Verify your API endpoints are accessible
3. Ensure your database file has proper permissions
4. Review the network tab for failed requests

---

**Note**: This system automatically adds users to your email list when they register. If you want to make this optional, modify the registration flow to include an opt-in checkbox.
