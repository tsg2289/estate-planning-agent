// Progress Storage Utility for Estate Planning Forms
// Handles saving, loading, and managing user progress across all forms

const STORAGE_KEY = 'estate_planning_progress';
const AUTO_SAVE_DELAY = 2000; // 2 seconds

class ProgressStorage {
  constructor() {
    this.storageKey = STORAGE_KEY;
    this.autoSaveTimers = new Map();
  }

  // Save progress for a specific form
  saveProgress(formType, formData) {
    try {
      const allProgress = this.loadAllProgress();
      allProgress[formType] = {
        data: formData,
        lastSaved: new Date().toISOString(),
        completed: false
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(allProgress));
      console.log(`💾 Progress saved for ${formType}`);
      return true;
    } catch (error) {
      console.error('Error saving progress:', error);
      return false;
    }
  }

  // Load progress for a specific form
  loadProgress(formType) {
    try {
      const allProgress = this.loadAllProgress();
      return allProgress[formType] || null;
    } catch (error) {
      console.error('Error loading progress:', error);
      return null;
    }
  }

  // Load all progress data
  loadAllProgress() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading all progress:', error);
      return {};
    }
  }

  // Mark a form as completed
  markCompleted(formType) {
    try {
      const allProgress = this.loadAllProgress();
      if (allProgress[formType]) {
        allProgress[formType].completed = true;
        allProgress[formType].lastSaved = new Date().toISOString();
        localStorage.setItem(this.storageKey, JSON.stringify(allProgress));
        console.log(`✅ Form ${formType} marked as completed`);
      }
      return true;
    } catch (error) {
      console.error('Error marking form as completed:', error);
      return false;
    }
  }

  // Get completion status for all forms
  getCompletionStatus() {
    try {
      const allProgress = this.loadAllProgress();
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
  clearProgress(formType) {
    try {
      const allProgress = this.loadAllProgress();
      delete allProgress[formType];
      localStorage.setItem(this.storageKey, JSON.stringify(allProgress));
      console.log(`🗑️ Progress cleared for ${formType}`);
      return true;
    } catch (error) {
      console.error('Error clearing progress:', error);
      return false;
    }
  }

  // Clear all progress
  clearAllProgress() {
    try {
      localStorage.removeItem(this.storageKey);
      console.log('🗑️ All progress cleared');
      return true;
    } catch (error) {
      console.error('Error clearing all progress:', error);
      return false;
    }
  }

  // Set up auto-save for a form
  setupAutoSave(formType, formData, onSave) {
    // Clear existing timer
    if (this.autoSaveTimers.has(formType)) {
      clearTimeout(this.autoSaveTimers.get(formType));
    }

    // Set new timer
    const timer = setTimeout(() => {
      if (onSave) {
        onSave(formData);
      } else {
        this.saveProgress(formType, formData);
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

  // Get storage usage information
  getStorageInfo() {
    try {
      const allProgress = this.loadAllProgress();
      const dataSize = JSON.stringify(allProgress).length;
      const maxSize = 5 * 1024 * 1024; // 5MB limit
      
      return {
        currentSize: dataSize,
        maxSize: maxSize,
        usagePercentage: Math.round((dataSize / maxSize) * 100),
        formCount: Object.keys(allProgress).length
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return null;
    }
  }
}

// Create and export a singleton instance
const progressStorage = new ProgressStorage();
export default progressStorage;
