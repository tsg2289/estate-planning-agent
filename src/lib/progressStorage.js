// Progress Storage Utility for Estate Planning Forms
// Handles saving, loading, and managing user progress across all forms
// This is a compatibility wrapper around the new UserProgressStorage system

import userProgressStorage from './userProgressStorage';

const STORAGE_KEY = 'estate_planning_progress';
const AUTO_SAVE_DELAY = 2000; // 2 seconds

class ProgressStorage {
  constructor() {
    this.storageKey = STORAGE_KEY;
    this.autoSaveTimers = new Map();
    // Use the new user-specific storage system
    this.userStorage = userProgressStorage;
  }

  // Save progress for a specific form
  async saveProgress(formType, formData) {
    try {
      // Use the new user-specific storage system
      return await this.userStorage.saveProgress(formType, formData);
    } catch (error) {
      console.error('Error saving progress:', error);
      return false;
    }
  }

  // Load progress for a specific form
  async loadProgress(formType) {
    try {
      // Use the new user-specific storage system
      return await this.userStorage.loadProgress(formType);
    } catch (error) {
      console.error('Error loading progress:', error);
      return null;
    }
  }

  // Load all progress data
  async loadAllProgress() {
    try {
      // Use the new user-specific storage system
      return await this.userStorage.loadAllProgress();
    } catch (error) {
      console.error('Error loading all progress:', error);
      return {};
    }
  }

  // Mark a form as completed
  async markCompleted(formType) {
    try {
      // Use the new user-specific storage system
      return await this.userStorage.markCompleted(formType);
    } catch (error) {
      console.error('Error marking form as completed:', error);
      return false;
    }
  }

  // Get completion status for all forms
  async getCompletionStatus() {
    try {
      // Use the new user-specific storage system
      return await this.userStorage.getCompletionStatus();
    } catch (error) {
      console.error('Error getting completion status:', error);
      return {};
    }
  }

  // Calculate progress percentage based on filled fields
  calculateProgressPercentage(formProgress) {
    // Use the new user-specific storage system
    return this.userStorage.calculateProgressPercentage(formProgress);
  }

  // Clear progress for a specific form
  async clearProgress(formType) {
    try {
      // Use the new user-specific storage system
      return await this.userStorage.clearProgress(formType);
    } catch (error) {
      console.error('Error clearing progress:', error);
      return false;
    }
  }

  // Clear all progress
  async clearAllProgress() {
    try {
      // Use the new user-specific storage system
      return await this.userStorage.clearAllProgress();
    } catch (error) {
      console.error('Error clearing all progress:', error);
      return false;
    }
  }

  // Set up auto-save for a form
  setupAutoSave(formType, formData, onSave) {
    // Use the new user-specific storage system
    this.userStorage.setupAutoSave(formType, formData, onSave);
  }

  // Clear auto-save timer for a form
  clearAutoSave(formType) {
    // Use the new user-specific storage system
    this.userStorage.clearAutoSave(formType);
  }

  // Get storage usage information
  getStorageInfo() {
    try {
      // Use the new user-specific storage system
      return this.userStorage.getStorageInfo();
    } catch (error) {
      console.error('Error getting storage info:', error);
      return null;
    }
  }
}

// Create and export a singleton instance
const progressStorage = new ProgressStorage();
export default progressStorage;
