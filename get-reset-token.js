#!/usr/bin/env node

/**
 * Helper script to get the current password reset token for testing
 */

import { findUserByEmail } from './api/lib/users.js';

const user = findUserByEmail('demo@example.com');

if (user && user.passwordResetToken) {
  console.log('🔑 Current password reset token:', user.passwordResetToken);
  console.log('⏰ Token expires at:', user.passwordResetExpiry);
  console.log('');
  console.log('🔗 Reset URL:', `http://localhost:5173/reset-password?token=${user.passwordResetToken}`);
  console.log('');
  console.log('📋 Test the password reset with:');
  console.log(`curl -X POST http://localhost:3001/api/auth/reset-password \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{"token":"${user.passwordResetToken}","newPassword":"NewPassword123!"}'`);
} else {
  console.log('❌ No password reset token found. Request a password reset first.');
}
