/**
 * Supabase Security Configuration
 * This file contains security-related configurations and utilities
 */

import { supabase } from '../lib/supabase'

// Security configuration
export const securityConfig = {
  // Password requirements
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },
  
  // Session configuration
  session: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    refreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
    autoRefresh: true
  },
  
  // Rate limiting (implement in your API)
  rateLimit: {
    login: {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000 // 15 minutes
    },
    register: {
      maxAttempts: 3,
      windowMs: 60 * 60 * 1000 // 1 hour
    }
  },
  
  // Data retention
  dataRetention: {
    inactiveUsers: 365, // days
    sessions: 30, // days
    logs: 90 // days
  }
}

// Security utilities
export const securityUtils = {
  // Validate password strength
  validatePassword(password) {
    const errors = []
    
    if (password.length < securityConfig.password.minLength) {
      errors.push(`Password must be at least ${securityConfig.password.minLength} characters long`)
    }
    
    if (securityConfig.password.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    
    if (securityConfig.password.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    
    if (securityConfig.password.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    
    if (securityConfig.password.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  },
  
  // Sanitize user input
  sanitizeInput(input) {
    if (typeof input !== 'string') return input
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .substring(0, 1000) // Limit length
  },
  
  // Check if user is admin
  async isAdmin(userId) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', userId)
        .single()
      
      if (error) return false
      
      const role = profile?.preferences?.role
      return role === 'admin' || role === 'super_admin'
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  },
  
  // Log security events
  async logSecurityEvent(event, userId, details = {}) {
    try {
      const { error } = await supabase
        .from('security_logs')
        .insert({
          event_type: event,
          user_id: userId,
          details: details,
          ip_address: details.ipAddress,
          user_agent: details.userAgent,
          created_at: new Date().toISOString()
        })
      
      if (error) {
        console.error('Error logging security event:', error)
      }
    } catch (error) {
      console.error('Error logging security event:', error)
    }
  },
  
  // Check for suspicious activity
  async checkSuspiciousActivity(userId, action) {
    try {
      const { data: recentEvents, error } = await supabase
        .from('security_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('event_type', action)
        .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString()) // Last 15 minutes
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error checking suspicious activity:', error)
        return false
      }
      
      // Check if too many attempts in short time
      const maxAttempts = securityConfig.rateLimit[action]?.maxAttempts || 5
      return recentEvents.length >= maxAttempts
    } catch (error) {
      console.error('Error checking suspicious activity:', error)
      return false
    }
  }
}

// RLS Policy helpers
export const rlsHelpers = {
  // Get user-specific data with RLS
  async getUserData(table, userId, columns = '*') {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .eq('user_id', userId)
    
    return { data, error }
  },
  
  // Create user-specific data with RLS
  async createUserData(table, data) {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
    
    return { data: result, error }
  },
  
  // Update user-specific data with RLS
  async updateUserData(table, id, updates) {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select()
    
    return { data, error }
  },
  
  // Delete user-specific data with RLS
  async deleteUserData(table, id) {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
      .select()
    
    return { data, error }
  }
}

// Data encryption utilities (for sensitive data)
export const encryptionUtils = {
  // Simple encryption for sensitive fields (use proper encryption in production)
  encrypt(text) {
    // This is a placeholder - use proper encryption in production
    return btoa(text)
  },
  
  // Simple decryption for sensitive fields
  decrypt(encryptedText) {
    // This is a placeholder - use proper decryption in production
    try {
      return atob(encryptedText)
    } catch (error) {
      console.error('Decryption error:', error)
      return null
    }
  }
}

// Audit trail utilities
export const auditUtils = {
  // Log data changes
  async logDataChange(table, recordId, action, oldData, newData, userId) {
    try {
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          table_name: table,
          record_id: recordId,
          action: action,
          old_data: oldData,
          new_data: newData,
          user_id: userId,
          created_at: new Date().toISOString()
        })
      
      if (error) {
        console.error('Error logging data change:', error)
      }
    } catch (error) {
      console.error('Error logging data change:', error)
    }
  },
  
  // Get audit trail for a record
  async getAuditTrail(table, recordId) {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('table_name', table)
        .eq('record_id', recordId)
        .order('created_at', { ascending: false })
      
      return { data, error }
    } catch (error) {
      console.error('Error getting audit trail:', error)
      return { data: null, error }
    }
  }
}

export default {
  securityConfig,
  securityUtils,
  rlsHelpers,
  encryptionUtils,
  auditUtils
}
