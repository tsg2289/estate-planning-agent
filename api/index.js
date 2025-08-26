// Single API entry point for Vercel
// Consolidates all functionality to work with the 12 function limit

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { getUserByEmail, createUser, updateUser } = require('./lib/users');
const { addToEmailList, getEmailList, removeFromEmailList } = require('./lib/email-list');
const { sendEmail } = require('./lib/email-service');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  try {
    // Health check
    if (pathname === '/api/health' && req.method === 'GET') {
      return res.json({ status: 'OK', timestamp: new Date().toISOString() });
    }

    // Authentication routes
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      return await handleLogin(req, res);
    }

    if (pathname === '/api/auth/register' && req.method === 'POST') {
      return await handleRegister(req, res);
    }

    if (pathname === '/api/auth/verify-2fa' && req.method === 'POST') {
      return await handleVerify2FA(req, res);
    }

    if (pathname === '/api/auth/verify' && req.method === 'POST') {
      return await handleVerify(req, res);
    }

    // Email list routes
    if (pathname === '/api/email/add' && req.method === 'POST') {
      return await handleEmailAdd(req, res);
    }

    if (pathname === '/api/email/list' && req.method === 'GET') {
      return await handleEmailList(req, res);
    }

    if (pathname === '/api/email/remove' && req.method === 'DELETE') {
      return await handleEmailRemove(req, res);
    }

    // Default response
    res.status(404).json({ error: 'Route not found' });

  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login handler
async function handleLogin(req, res) {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (user.twoFactorEnabled) {
    const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.twoFactorCode = twoFactorCode;
    user.twoFactorCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await updateUser(user.id, user);

    await sendEmail({
      to: user.email,
      subject: 'Two-Factor Authentication Code',
      text: `Your 2FA code is: ${twoFactorCode}. This code expires in 10 minutes.`,
      html: `<p>Your 2FA code is: <strong>${twoFactorCode}</strong></p><p>This code expires in 10 minutes.</p>`
    });

    return res.json({ 
      message: 'Two-factor authentication required',
      requires2FA: true,
      userId: user.id
    });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
}

// Register handler
async function handleRegister(req, res) {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = {
    id: uuidv4(),
    email,
    password: hashedPassword,
    name,
    createdAt: new Date(),
    twoFactorEnabled: false
  };

  await createUser(newUser);

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name
    }
  });
}

// 2FA verification handler
async function handleVerify2FA(req, res) {
  const { userId, code } = req.body;
  
  if (!userId || !code) {
    return res.status(400).json({ error: 'User ID and 2FA code are required' });
  }

  const user = await getUserByEmail(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!user.twoFactorCode || !user.twoFactorCodeExpiry) {
    return res.status(400).json({ error: 'No 2FA code found' });
  }

  if (new Date() > user.twoFactorCodeExpiry) {
    return res.status(400).json({ error: '2FA code has expired' });
  }

  if (user.twoFactorCode !== code) {
    return res.status(400).json({ error: 'Invalid 2FA code' });
  }

  user.twoFactorCode = null;
  user.twoFactorCodeExpiry = null;
  await updateUser(user.id, user);

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );

  res.json({
    message: 'Two-factor authentication successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
}

// Token verification handler
async function handleVerify(req, res) {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  
  res.json({
    valid: true,
    user: {
      userId: decoded.userId,
      email: decoded.email
    }
  });
}

// Email add handler
async function handleEmailAdd(req, res) {
  const { email, name, source } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const result = await addToEmailList(email, name, source);
  
  if (result.success) {
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to Estate Planning Agent!',
        text: `Thank you for signing up! We'll keep you updated on estate planning tips and updates.`,
        html: `<p>Thank you for signing up for Estate Planning Agent!</p><p>We'll keep you updated on estate planning tips, legal updates, and new features.</p>`
      });
    } catch (emailError) {
      console.error('Welcome email error:', emailError);
    }

    res.json({ 
      message: 'Email added successfully',
      email: result.email 
    });
  } else {
    res.status(400).json({ error: result.error });
  }
}

// Email list handler
async function handleEmailList(req, res) {
  const emails = await getEmailList();
  res.json({ emails });
}

// Email remove handler
async function handleEmailRemove(req, res) {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const result = await removeFromEmailList(email);
  
  if (result.success) {
    res.json({ message: 'Email removed successfully' });
  } else {
    res.status(400).json({ error: result.error });
  }
}
