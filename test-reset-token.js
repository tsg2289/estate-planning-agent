#!/usr/bin/env node

import { findUserByEmail, generatePasswordResetToken, validatePasswordResetToken } from './api/lib/users.js';

console.log('🧪 Testing password reset token generation...\n');

// Step 1: Find user
console.log('Step 1: Finding user...');
const user = findUserByEmail('demo@example.com');
console.log('User found:', user ? '✅' : '❌');

if (user) {
  // Step 2: Generate token
  console.log('\nStep 2: Generating reset token...');
  const result = generatePasswordResetToken('demo@example.com');
  console.log('Token generated:', result ? '✅' : '❌');
  
  if (result) {
    console.log('Token:', result.token);
    console.log('Expiry:', result.user.passwordResetExpiry);
    
    // Step 3: Validate token
    console.log('\nStep 3: Validating token...');
    const validUser = validatePasswordResetToken(result.token);
    console.log('Token valid:', validUser ? '✅' : '❌');
    
    // Step 4: Show current user state
    console.log('\nStep 4: Current user state:');
    const currentUser = findUserByEmail('demo@example.com');
    console.log('Reset token:', currentUser.passwordResetToken);
    console.log('Token expiry:', currentUser.passwordResetExpiry);
  }
}
