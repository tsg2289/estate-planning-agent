// User-Specific Progress Storage Utility for Estate Planning Forms
// Handles saving, loading, and managing user progress with database persistence

import { supabase, isSupabaseConfigured } from './supabase'

const LOCAL_STORAGE_KEY = 'estate_planning_progress';
const AUTO_SAVE_DELAY = 2000; // 2 seconds

class UserProgressStorage {
  constructor() {
    this.localStorageKey = LOCAL_STORAGE_KEY;
    this.autoSaveTimers = new Map();
    this.currentUserId = null;
    this.isOnline = true;
  }

  // Set the current user ID
  setCurrentUser(userId) {
    this.currentUserId = userId;
    console.log(`👤 User progress storage set for user: ${userId}`);
  }

  // Clear current user
  clearCurrentUser() {
    this.currentUserId = null;
    console.log('👤 User progress storage cleared');
  }

  // Get user-specific storage key
  getUserStorageKey(userId = this.currentUserId) {
    return userId ? `${this.localStorageKey}_${userId}` : this.localStorageKey;
  }

  // Save progress for a specific form (both local and remote)
  async saveProgress(formType, formData, userId = this.currentUserId) {
    try {
      const progressData = {
        data: formData,
        lastSaved: new Date().toISOString(),
        completed: false
      };

      // Always save to localStorage first (immediate feedback)
      this.saveToLocalStorage(formType, progressData, userId);

      // Try to save to database if user is logged in and Supabase is configured
      if (userId && isSupabaseConfigured) {
        try {
          await this.saveToDatabase(formType, progressData, userId);
          console.log(`☁️ Progress synced to database for ${formType}`);
        } catch (dbError) {
          console.warn('Database save failed, keeping local copy:', dbError);
          // Don't fail the whole operation - localStorage is still saved
        }
      }

      console.log(`💾 Progress saved for ${formType} (User: ${userId || 'guest'})`);
      return true;
    } catch (error) {
      console.error('Error saving progress:', error);
      return false;
    }
  }

  // Save to localStorage
  saveToLocalStorage(formType, progressData, userId = this.currentUserId) {
    try {
      const storageKey = this.getUserStorageKey(userId);
      const allProgress = this.loadFromLocalStorage(userId);
      allProgress[formType] = progressData;
      localStorage.setItem(storageKey, JSON.stringify(allProgress));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  // Save to database
  async saveToDatabase(formType, progressData, userId = this.currentUserId) {
    if (!userId || !isSupabaseConfigured) {
      throw new Error('User ID required and Supabase must be configured for database storage');
    }

    try {
      // Check if document already exists
      const { data: existingDoc, error: fetchError } = await supabase
        .from('estate_documents')
        .select('id, version')
        .eq('user_id', userId)
        .eq('document_type', formType)
        .eq('status', 'draft')
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw fetchError;
      }

      const documentData = {
        user_id: userId,
        document_type: formType,
        title: this.getDocumentTitle(formType),
        content: progressData,
        status: progressData.completed ? 'completed' : 'draft',
        updated_at: new Date().toISOString(),
        version: existingDoc ? existingDoc.version + 1 : 1
      };

      let result;
      if (existingDoc) {
        // Update existing document
        result = await supabase
          .from('estate_documents')
          .update(documentData)
          .eq('id', existingDoc.id)
          .select()
          .single();
      } else {
        // Create new document
        result = await supabase
          .from('estate_documents')
          .insert(documentData)
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      return result.data;
    } catch (error) {
      console.error('Database save error:', error);
      throw error;
    }
  }

  // Load progress for a specific form
  async loadProgress(formType, userId = this.currentUserId) {
    try {
      // If user is logged in and Supabase is configured, try database first
      if (userId && isSupabaseConfigured) {
        try {
          const dbProgress = await this.loadFromDatabase(formType, userId);
          if (dbProgress) {
            // Also update localStorage with latest from database
            this.saveToLocalStorage(formType, dbProgress, userId);
            console.log(`☁️ Progress loaded from database for ${formType}`);
            return dbProgress;
          }
        } catch (dbError) {
          console.warn('Database load failed, falling back to localStorage:', dbError);
        }
      }

      // Fallback to localStorage
      const localProgress = this.loadFromLocalStorage(userId);
      const formProgress = localProgress[formType] || null;
      console.log(`💾 Progress loaded from localStorage for ${formType}`);
      return formProgress;
    } catch (error) {
      console.error('Error loading progress:', error);
      return null;
    }
  }

  // Load from localStorage
  loadFromLocalStorage(userId = this.currentUserId) {
    try {
      const storageKey = this.getUserStorageKey(userId);
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return {};
    }
  }

  // Load from database
  async loadFromDatabase(formType, userId = this.currentUserId) {
    if (!userId || !isSupabaseConfigured) {
      throw new Error('User ID required and Supabase must be configured for database storage');
    }

    try {
      const { data, error } = await supabase
        .from('estate_documents')
        .select('content, updated_at')
        .eq('user_id', userId)
        .eq('document_type', formType)
        .eq('status', 'draft')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      return data ? data.content : null;
    } catch (error) {
      console.error('Database load error:', error);
      throw error;
    }
  }

  // Load all progress data
  async loadAllProgress(userId = this.currentUserId) {
    try {
      // If user is logged in and Supabase is configured, try database first
      if (userId && isSupabaseConfigured) {
        try {
          const dbProgress = await this.loadAllFromDatabase(userId);
          if (Object.keys(dbProgress).length > 0) {
            // Also update localStorage with latest from database
            const storageKey = this.getUserStorageKey(userId);
            localStorage.setItem(storageKey, JSON.stringify(dbProgress));
            console.log(`☁️ All progress loaded from database`);
            return dbProgress;
          }
        } catch (dbError) {
          console.warn('Database load all failed, falling back to localStorage:', dbError);
        }
      }

      // Fallback to localStorage
      const localProgress = this.loadFromLocalStorage(userId);
      console.log(`💾 All progress loaded from localStorage`);
      return localProgress;
    } catch (error) {
      console.error('Error loading all progress:', error);
      return {};
    }
  }

  // Load all progress from database
  async loadAllFromDatabase(userId = this.currentUserId) {
    if (!userId || !isSupabaseConfigured) {
      throw new Error('User ID required and Supabase must be configured for database storage');
    }

    try {
      const { data, error } = await supabase
        .from('estate_documents')
        .select('document_type, content, updated_at')
        .eq('user_id', userId)
        .eq('status', 'draft')
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      const allProgress = {};
      data.forEach(doc => {
        if (!allProgress[doc.document_type] || 
            new Date(doc.updated_at) > new Date(allProgress[doc.document_type].lastSaved)) {
          allProgress[doc.document_type] = doc.content;
        }
      });

      return allProgress;
    } catch (error) {
      console.error('Database load all error:', error);
      throw error;
    }
  }

  // Mark a form as completed
  async markCompleted(formType, userId = this.currentUserId) {
    try {
      const allProgress = await this.loadAllProgress(userId);
      if (allProgress[formType]) {
        allProgress[formType].completed = true;
        allProgress[formType].lastSaved = new Date().toISOString();
        
        // Save the completed status
        await this.saveProgress(formType, allProgress[formType].data, userId);
        
        // Also update database status if available
        if (userId && isSupabaseConfigured) {
          try {
            await supabase
              .from('estate_documents')
              .update({ 
                status: 'completed',
                completed_at: new Date().toISOString()
              })
              .eq('user_id', userId)
              .eq('document_type', formType);
          } catch (dbError) {
            console.warn('Failed to update completion status in database:', dbError);
          }
        }
        
        console.log(`✅ Form ${formType} marked as completed`);
      }
      return true;
    } catch (error) {
      console.error('Error marking form as completed:', error);
      return false;
    }
  }

  // Get completion status for all forms
  async getCompletionStatus(userId = this.currentUserId) {
    try {
      const allProgress = await this.loadAllProgress(userId);
      const status = {};
      
      ['will', 'trust', 'poa', 'ahcd'].forEach(formType => {
        status[formType] = {
          hasProgress: !!allProgress[formType],
          isCompleted: allProgress[formType]?.completed || false,
          lastSaved: allProgress[formType]?.lastSaved || null,
          progressPercentage: this.calculateProgressPercentage(allProgress[formType])
        };
      });
      
      return status;
    } catch (error) {
      console.error('Error getting completion status:', error);
      return {};
    }
  }

  // Calculate progress percentage based on filled fields
  calculateProgressPercentage(formProgress) {
    if (!formProgress || !formProgress.data) return 0;
    
    const data = formProgress.data;
    const fields = Object.keys(data);
    let filledFields = 0;
    
    fields.forEach(field => {
      const value = data[field];
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          // For array fields, check if at least one item has content
          if (value.length > 0 && value.some(item => 
            typeof item === 'object' ? 
              Object.values(item).some(v => v !== null && v !== undefined && v !== '') :
              item !== null && item !== undefined && item !== ''
          )) {
            filledFields++;
          }
        } else {
          filledFields++;
        }
      }
    });
    
    return Math.round((filledFields / fields.length) * 100);
  }

  // Clear progress for a specific form
  async clearProgress(formType, userId = this.currentUserId) {
    try {
      // Clear from localStorage
      const storageKey = this.getUserStorageKey(userId);
      const allProgress = this.loadFromLocalStorage(userId);
      delete allProgress[formType];
      localStorage.setItem(storageKey, JSON.stringify(allProgress));

      // Clear from database if available
      if (userId && isSupabaseConfigured) {
        try {
          await supabase
            .from('estate_documents')
            .delete()
            .eq('user_id', userId)
            .eq('document_type', formType);
        } catch (dbError) {
          console.warn('Failed to clear from database:', dbError);
        }
      }

      console.log(`🗑️ Progress cleared for ${formType}`);
      return true;
    } catch (error) {
      console.error('Error clearing progress:', error);
      return false;
    }
  }

  // Clear all progress for current user
  async clearAllProgress(userId = this.currentUserId) {
    try {
      // Clear from localStorage
      const storageKey = this.getUserStorageKey(userId);
      localStorage.removeItem(storageKey);

      // Clear from database if available
      if (userId && isSupabaseConfigured) {
        try {
          await supabase
            .from('estate_documents')
            .delete()
            .eq('user_id', userId);
        } catch (dbError) {
          console.warn('Failed to clear all from database:', dbError);
        }
      }

      console.log('🗑️ All progress cleared');
      return true;
    } catch (error) {
      console.error('Error clearing all progress:', error);
      return false;
    }
  }

  // Migrate user's progress from guest to authenticated user
  async migrateGuestProgress(newUserId) {
    try {
      console.log(`🔄 Migrating guest progress to user: ${newUserId}`);
      
      // Load guest progress
      const guestProgress = this.loadFromLocalStorage(null);
      
      if (Object.keys(guestProgress).length === 0) {
        console.log('No guest progress to migrate');
        return true;
      }

      // Save all guest progress to new user account
      for (const [formType, progressData] of Object.entries(guestProgress)) {
        await this.saveProgress(formType, progressData.data, newUserId);
      }

      // Clear guest progress
      localStorage.removeItem(this.localStorageKey);
      
      console.log(`✅ Successfully migrated ${Object.keys(guestProgress).length} forms to user account`);
      return true;
    } catch (error) {
      console.error('Error migrating guest progress:', error);
      return false;
    }
  }

  // Set up auto-save for a form
  setupAutoSave(formType, formData, onSave, userId = this.currentUserId) {
    // Clear existing timer
    if (this.autoSaveTimers.has(formType)) {
      clearTimeout(this.autoSaveTimers.get(formType));
    }

    // Set new timer
    const timer = setTimeout(async () => {
      if (onSave) {
        onSave(formData);
      } else {
        await this.saveProgress(formType, formData, userId);
      }
      this.autoSaveTimers.delete(formType);
    }, AUTO_SAVE_DELAY);

    this.autoSaveTimers.set(formType, timer);
  }

  // Clear auto-save timer for a form
  clearAutoSave(formType) {
    if (this.autoSaveTimers.has(formType)) {
      clearTimeout(this.autoSaveTimers.get(formType));
      this.autoSaveTimers.delete(formType);
    }
  }

  // Get document title for form type
  getDocumentTitle(formType) {
    const titles = {
      'will': 'Last Will and Testament',
      'trust': 'Living Trust',
      'poa': 'Power of Attorney',
      'ahcd': 'Advance Health Care Directive'
    };
    return titles[formType] || `Estate Planning Document (${formType})`;
  }

  // Get storage usage information
  getStorageInfo(userId = this.currentUserId) {
    try {
      const allProgress = this.loadFromLocalStorage(userId);
      const dataSize = JSON.stringify(allProgress).length;
      const maxSize = 5 * 1024 * 1024; // 5MB limit
      
      return {
        currentSize: dataSize,
        maxSize: maxSize,
        usagePercentage: Math.round((dataSize / maxSize) * 100),
        formCount: Object.keys(allProgress).length,
        userId: userId || 'guest'
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return null;
    }
  }
}

// Create and export a singleton instance
const userProgressStorage = new UserProgressStorage();
export default userProgressStorage;
