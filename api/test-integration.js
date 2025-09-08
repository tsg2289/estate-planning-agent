#!/usr/bin/env node

/**
 * Integration test that runs within the API server context
 * This demonstrates the complete password reset flow
 */

import { 
  findUserByEmail, 
  recordFailedLoginAttempt,
  isAccountLocked,
  generatePasswordResetToken,
  validatePasswordResetToken,
  resetPassword
} from './lib/users.js';
import bcrypt from 'bcryptjs';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${colors.cyan}[Step ${step}]${colors.reset} ${message}`);
}

function logSuccess(message) {
  log(`${colors.green}✅ ${message}${colors.reset}`);
}

function logError(message) {
  log(`${colors.red}❌ ${message}${colors.reset}`);
}

function logInfo(message) {
  log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

async function runIntegrationTest() {
  log(`${colors.green}🔒 Account Lockout Integration Test${colors.reset}`);
  log(`${colors.blue}Testing within API server context${colors.reset}\n`);

  const TEST_EMAIL = 'demo@example.com';
  const WRONG_PASSWORD = 'wrongpassword';
  const NEW_PASSWORD = 'NewPassword123!';

  try {
    // Step 1: Simulate failed login attempts
    logStep(1, 'Simulating 5 failed login attempts');
    
    let user = findUserByEmail(TEST_EMAIL);
    if (!user) {
      logError('Demo user not found');
      return;
    }
    
    logInfo(`Initial failed attempts: ${user.failedLoginAttempts || 0}`);
    
    // Simulate 5 failed attempts
    for (let i = 1; i <= 5; i++) {
      recordFailedLoginAttempt(TEST_EMAIL);
      const updatedUser = findUserByEmail(TEST_EMAIL);
      log(`  Attempt ${i}: Failed attempts = ${updatedUser.failedLoginAttempts}, Locked = ${updatedUser.accountLocked}`);
    }
    
    // Check if account is locked
    if (isAccountLocked(TEST_EMAIL)) {
      logSuccess('Account successfully locked after 5 attempts');
    } else {
      logError('Account lockout failed');
      return;
    }

    // Step 2: Test password reset token generation
    logStep(2, 'Generating password reset token');
    
    const tokenResult = generatePasswordResetToken(TEST_EMAIL);
    if (tokenResult && tokenResult.token) {
      logSuccess('Password reset token generated');
      logInfo(`Token: ${tokenResult.token}`);
      logInfo(`Expires: ${tokenResult.user.passwordResetExpiry}`);
    } else {
      logError('Failed to generate reset token');
      return;
    }

    // Step 3: Validate token
    logStep(3, 'Validating password reset token');
    
    const validUser = validatePasswordResetToken(tokenResult.token);
    if (validUser) {
      logSuccess('Token validation successful');
    } else {
      logError('Token validation failed');
      return;
    }

    // Step 4: Reset password
    logStep(4, 'Resetting password and unlocking account');
    
    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 12);
    const resetUser = resetPassword(tokenResult.token, hashedPassword);
    
    if (resetUser) {
      logSuccess('Password reset successful');
      logInfo(`Account locked: ${resetUser.accountLocked}`);
      logInfo(`Failed attempts: ${resetUser.failedLoginAttempts}`);
      logInfo(`Reset token: ${resetUser.passwordResetToken || 'cleared'}`);
    } else {
      logError('Password reset failed');
      return;
    }

    // Step 5: Verify account is unlocked
    logStep(5, 'Verifying account unlock');
    
    if (!isAccountLocked(TEST_EMAIL)) {
      logSuccess('Account successfully unlocked');
    } else {
      logError('Account is still locked');
      return;
    }

    // Step 6: Test login with new password
    logStep(6, 'Testing login with new password');
    
    const finalUser = findUserByEmail(TEST_EMAIL);
    const isValidPassword = await bcrypt.compare(NEW_PASSWORD, finalUser.password);
    
    if (isValidPassword) {
      logSuccess('Login with new password successful');
    } else {
      logError('Login with new password failed');
      return;
    }

    // Summary
    log(`\n${colors.green}🎉 Integration test completed successfully!${colors.reset}`);
    log('\n📋 Test Results:');
    logSuccess('✅ Failed login attempts tracking');
    logSuccess('✅ Account lockout after 5 attempts');
    logSuccess('✅ Password reset token generation');
    logSuccess('✅ Token validation');
    logSuccess('✅ Password reset and account unlock');
    logSuccess('✅ Login with new password');

  } catch (error) {
    logError(`Integration test failed: ${error.message}`);
    console.error(error);
  }
}

// Run the test
runIntegrationTest();
