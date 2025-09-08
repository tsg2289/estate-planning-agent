// Shared in-memory storage for demo purposes
// Note: In production, this should be replaced with a proper database
// as Vercel Functions are stateless and this data will be lost between deployments

let users = [];

// Initialize with a demo user for testing
const initializeDemoUser = () => {
  if (users.length === 0) {
    const demoUser = {
      id: 'demo-1',
      email: 'demo@example.com',
      name: 'Demo User',
      password: '$2a$12$8yB10AdwgmX5Bgfb3xEpdemwh3R22hZeEec2GWlg7H9ZgaaM1UQ2C', // ' DemoPass123!'
      createdAt: new Date().toISOString(),
      failedLoginAttempts: 0,
      accountLocked: false,
      lockoutExpiry: null,
      lastFailedAttempt: null,
      passwordResetToken: null,
      passwordResetExpiry: null
    };
    users.push(demoUser);
  }
};

// Initialize demo user immediately
initializeDemoUser();

export const getUsers = () => {
  // Re-initialize demo user on each call since functions are stateless
  initializeDemoUser();
  return users;
};

export const addUser = (user) => {
  // Re-initialize demo user on each call
  initializeDemoUser();
  
  // Check if user already exists
  const existingUser = users.find(u => u.email === user.email);
  if (existingUser) {
    return null; // User already exists
  }
  
  users.push(user);
  return user;
};

export const findUserByEmail = (email) => {
  // Re-initialize demo user on each call
  initializeDemoUser();
  return users.find(u => u.email === email);
};

export const findUserById = (id) => {
  // Re-initialize demo user on each call
  initializeDemoUser();
  return users.find(u => u.id === id);
};

export const updateUser = (id, updates) => {
  // Re-initialize demo user on each call
  initializeDemoUser();
  
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    return users[index];
  }
  return null;
};

export const deleteUser = (id) => {
  // Re-initialize demo user on each call
  initializeDemoUser();
  
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    const deletedUser = users[index];
    users.splice(index, 1);
    return deletedUser;
  }
  return null;
};

// Account lockout management functions
export const recordFailedLoginAttempt = (email) => {
  initializeDemoUser();
  
  const user = users.find(u => u.email === email);
  if (!user) return null;
  
  user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
  user.lastFailedAttempt = new Date().toISOString();
  
  // Lock account after 5 failed attempts
  if (user.failedLoginAttempts >= 5) {
    user.accountLocked = true;
    // Lock for 30 minutes
    user.lockoutExpiry = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  }
  
  return user;
};

export const resetFailedLoginAttempts = (email) => {
  initializeDemoUser();
  
  const user = users.find(u => u.email === email);
  if (!user) return null;
  
  user.failedLoginAttempts = 0;
  user.accountLocked = false;
  user.lockoutExpiry = null;
  user.lastFailedAttempt = null;
  
  return user;
};

export const isAccountLocked = (email) => {
  initializeDemoUser();
  
  const user = users.find(u => u.email === email);
  if (!user) return false;
  
  if (user.accountLocked && user.lockoutExpiry) {
    const now = new Date();
    const lockoutExpiry = new Date(user.lockoutExpiry);
    
    // Check if lockout has expired
    if (now >= lockoutExpiry) {
      // Unlock the account
      user.accountLocked = false;
      user.lockoutExpiry = null;
      user.failedLoginAttempts = 0;
      return false;
    }
    
    return true;
  }
  
  return false;
};

export const generatePasswordResetToken = (email) => {
  initializeDemoUser();
  
  const user = users.find(u => u.email === email);
  if (!user) return null;
  
  // Generate a secure random token
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  user.passwordResetToken = token;
  // Token expires in 1 hour
  user.passwordResetExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  
  return { user, token };
};

export const validatePasswordResetToken = (token) => {
  initializeDemoUser();
  
  const user = users.find(u => u.passwordResetToken === token);
  if (!user) return null;
  
  // Check if token has expired
  const now = new Date();
  const expiry = new Date(user.passwordResetExpiry);
  
  if (now >= expiry) {
    // Clear expired token
    user.passwordResetToken = null;
    user.passwordResetExpiry = null;
    return null;
  }
  
  return user;
};

export const resetPassword = (token, newPassword) => {
  initializeDemoUser();
  
  const user = validatePasswordResetToken(token);
  if (!user) return null;
  
  // Update password and clear reset token
  user.password = newPassword;
  user.passwordResetToken = null;
  user.passwordResetExpiry = null;
  
  // Also reset any lockout status
  user.failedLoginAttempts = 0;
  user.accountLocked = false;
  user.lockoutExpiry = null;
  user.lastFailedAttempt = null;
  
  return user;
};
