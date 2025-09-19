// Test Account Utilities
// Provides functions to clean up data for test accounts

export const TEST_ACCOUNT_EMAIL = 'matthewtest@test.com'

/**
 * Check if the current user is the test account
 */
export const isTestAccount = (user) => {
  if (!user) return false
  return user.email?.toLowerCase() === TEST_ACCOUNT_EMAIL
}

/**
 * Clear all localStorage data for a clean test experience
 */
export const clearTestAccountData = () => {
  try {
    // Clear estate planning progress
    localStorage.removeItem('estate_planning_progress')
    
    // Clear any other form-related data
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (
        key.startsWith('estate_') || 
        key.startsWith('form_') ||
        key.startsWith('will_') ||
        key.startsWith('trust_') ||
        key.startsWith('poa_') ||
        key.startsWith('ahcd_')
      )) {
        keysToRemove.push(key)
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key))
    
    console.log('🧹 Cleared localStorage data for test account')
    return true
  } catch (error) {
    console.error('Error clearing test account data:', error)
    return false
  }
}

/**
 * Initialize clean state for test account
 */
export const initializeTestAccount = (user) => {
  if (isTestAccount(user)) {
    clearTestAccountData()
    
    // Show notification to user
    const notification = document.createElement('div')
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #e3f2fd;
      border: 2px solid #2196f3;
      color: #1976d2;
      padding: 15px 20px;
      border-radius: 8px;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      max-width: 350px;
    `
    notification.innerHTML = `
      <strong>🧪 Test Account Active</strong><br>
      All forms have been cleared for clean testing.<br>
      <small>Email: ${TEST_ACCOUNT_EMAIL}</small>
    `
    
    document.body.appendChild(notification)
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 5000)
    
    return true
  }
  return false
}
