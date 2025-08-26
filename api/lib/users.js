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
      createdAt: new Date().toISOString()
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
