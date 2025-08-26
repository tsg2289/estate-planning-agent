import { useState, useEffect, useCallback, useRef } from 'react';
import progressStorage from '../lib/progressStorage';

export const useFormProgress = (formType, initialData = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'saving', 'saved', 'error'
  const [progressPercentage, setProgressPercentage] = useState(0);
  const isInitialized = useRef(false);

  // Load saved progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      setIsLoading(true);
      try {
        const savedProgress = progressStorage.loadProgress(formType);
        if (savedProgress && savedProgress.data) {
          setFormData(savedProgress.data);
          setLastSaved(savedProgress.lastSaved);
          setProgressPercentage(progressStorage.calculateProgressPercentage(savedProgress));
          console.log(`📂 Loaded saved progress for ${formType}`);
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setIsLoading(false);
        isInitialized.current = true;
      }
    };

    loadProgress();
  }, [formType]);

  // Auto-save effect
  useEffect(() => {
    if (!isInitialized.current) return;

    const handleAutoSave = () => {
      if (Object.keys(formData).length > 0) {
        setSaveStatus('saving');
        progressStorage.setupAutoSave(formType, formData, (data) => {
          const success = progressStorage.saveProgress(formType, data);
          if (success) {
            setSaveStatus('saved');
            setLastSaved(new Date().toISOString());
            setProgressPercentage(progressStorage.calculateProgressPercentage({ data }));
            
            // Reset save status after 3 seconds
            setTimeout(() => setSaveStatus('idle'), 3000);
          } else {
            setSaveStatus('error');
          }
        });
      }
    };

    handleAutoSave();

    // Cleanup auto-save timer on unmount
    return () => {
      progressStorage.clearAutoSave(formType);
    };
  }, [formData, formType]);

  // Manual save function
  const saveProgress = useCallback(async () => {
    setSaveStatus('saving');
    try {
      const success = progressStorage.saveProgress(formType, formData);
      if (success) {
        setSaveStatus('saved');
        setLastSaved(new Date().toISOString());
        setProgressPercentage(progressStorage.calculateProgressPercentage({ data: formData }));
        
        // Reset save status after 3 seconds
        setTimeout(() => setSaveStatus('idle'), 3000);
        return true;
      } else {
        setSaveStatus('error');
        return false;
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      setSaveStatus('error');
      return false;
    }
  }, [formData, formType]);

  // Update form data with auto-save
  const updateFormData = useCallback((updates) => {
    setFormData(prev => {
      const newData = typeof updates === 'function' ? updates(prev) : { ...prev, ...updates };
      return newData;
    });
  }, []);

  // Mark form as completed
  const markCompleted = useCallback(async () => {
    try {
      const success = progressStorage.markCompleted(formType);
      if (success) {
        setProgressPercentage(100);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error marking form as completed:', error);
      return false;
    }
  }, [formType]);

  // Clear progress
  const clearProgress = useCallback(async () => {
    try {
      const success = progressStorage.clearProgress(formType);
      if (success) {
        setFormData(initialData);
        setLastSaved(null);
        setProgressPercentage(0);
        setSaveStatus('idle');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error clearing progress:', error);
      return false;
    }
  }, [formType, initialData]);

  // Get save status message
  const getSaveStatusMessage = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Progress saved!';
      case 'error':
        return 'Save failed';
      default:
        return lastSaved ? `Last saved: ${new Date(lastSaved).toLocaleString()}` : 'Not saved yet';
    }
  };

  // Get save status color
  const getSaveStatusColor = () => {
    switch (saveStatus) {
      case 'saving':
        return '#ffa500'; // Orange
      case 'saved':
        return '#4caf50'; // Green
      case 'error':
        return '#f44336'; // Red
      default:
        return lastSaved ? '#2196f3' : '#757575'; // Blue if saved, Gray if not
    }
  };

  return {
    formData,
    setFormData: updateFormData,
    isLoading,
    lastSaved,
    saveStatus,
    progressPercentage,
    saveProgress,
    markCompleted,
    clearProgress,
    getSaveStatusMessage,
    getSaveStatusColor,
    hasProgress: lastSaved !== null
  };
};
