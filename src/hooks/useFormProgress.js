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
          // Migrate old data format to new format
          let migratedData = { ...savedProgress.data };
          
                // Convert childrenNames from string to array if needed
                if (formType === 'will' && typeof migratedData.childrenNames === 'string') {
                  if (migratedData.childrenNames.trim() === '') {
                    migratedData.childrenNames = [''];
                  } else {
                    // Split by comma and create array
                    migratedData.childrenNames = migratedData.childrenNames
                      .split(',')
                      .map(name => name.trim())
                      .filter(name => name !== '');
                    // Ensure at least one empty field if no names
                    if (migratedData.childrenNames.length === 0) {
                      migratedData.childrenNames = [''];
                    }
                  }
                }

                // Convert old executor format to new array format if needed
                if (formType === 'will' && !Array.isArray(migratedData.executors)) {
                  const executors = [];
                  
                  // Check if old executor data exists
                  if (migratedData.executorName || migratedData.executorAddress || migratedData.executorCity || 
                      migratedData.executorState || migratedData.executorZip || migratedData.executorPhone || 
                      migratedData.executorEmail) {
                    executors.push({
                      name: migratedData.executorName || '',
                      address: migratedData.executorAddress || '',
                      city: migratedData.executorCity || '',
                      state: migratedData.executorState || '',
                      zip: migratedData.executorZip || '',
                      phone: migratedData.executorPhone || '',
                      email: migratedData.executorEmail || ''
                    });
                  }
                  
                  // Check if alternate executor data exists
                  if (migratedData.alternateExecutorName || migratedData.alternateExecutorAddress || 
                      migratedData.alternateExecutorCity || migratedData.alternateExecutorState || 
                      migratedData.alternateExecutorZip || migratedData.alternateExecutorPhone) {
                    executors.push({
                      name: migratedData.alternateExecutorName || '',
                      address: migratedData.alternateExecutorAddress || '',
                      city: migratedData.alternateExecutorCity || '',
                      state: migratedData.alternateExecutorState || '',
                      zip: migratedData.alternateExecutorZip || '',
                      phone: migratedData.alternateExecutorPhone || '',
                      email: '' // Alternate executor email wasn't in old format
                    });
                  }
                  
                  // Ensure at least one empty executor if no data
                  if (executors.length === 0) {
                    executors.push({
                      name: '',
                      address: '',
                      city: '',
                      state: '',
                      zip: '',
                      phone: '',
                      email: ''
                    });
                  }
                  
                  migratedData.executors = executors;
                  
                  // Clean up old executor fields
                  delete migratedData.executorName;
                  delete migratedData.executorAddress;
                  delete migratedData.executorCity;
                  delete migratedData.executorState;
                  delete migratedData.executorZip;
                  delete migratedData.executorPhone;
                  delete migratedData.executorEmail;
                  delete migratedData.alternateExecutorName;
                  delete migratedData.alternateExecutorAddress;
                  delete migratedData.alternateExecutorCity;
                  delete migratedData.alternateExecutorState;
                  delete migratedData.alternateExecutorZip;
                  delete migratedData.alternateExecutorPhone;
                }

                // Convert old guardian format to new array format if needed
                if (formType === 'will' && !Array.isArray(migratedData.guardians)) {
                  const guardians = [];
                  
                  // Check if old guardian data exists
                  if (migratedData.guardianName || migratedData.guardianCity || 
                      migratedData.guardianState || migratedData.guardianPhone) {
                    guardians.push({
                      name: migratedData.guardianName || '',
                      address: '', // Old format didn't have address
                      city: migratedData.guardianCity || '',
                      state: migratedData.guardianState || '',
                      zip: '', // Old format didn't have ZIP
                      phone: migratedData.guardianPhone || '',
                      email: '' // Old format didn't have email
                    });
                  }
                  
                  // Check if alternate guardian data exists
                  if (migratedData.alternateGuardianName || migratedData.alternateGuardianCity || 
                      migratedData.alternateGuardianState || migratedData.alternateGuardianPhone) {
                    guardians.push({
                      name: migratedData.alternateGuardianName || '',
                      address: '', // Old format didn't have address
                      city: migratedData.alternateGuardianCity || '',
                      state: migratedData.alternateGuardianState || '',
                      zip: '', // Old format didn't have ZIP
                      phone: migratedData.alternateGuardianPhone || '',
                      email: '' // Old format didn't have email
                    });
                  }
                  
                  // Ensure at least one empty guardian if no data
                  if (guardians.length === 0) {
                    guardians.push({
                      name: '',
                      address: '',
                      city: '',
                      state: '',
                      zip: '',
                      phone: '',
                      email: ''
                    });
                  }
                  
                  migratedData.guardians = guardians;
                  
                  // Clean up old guardian fields
                  delete migratedData.guardianName;
                  delete migratedData.guardianCity;
                  delete migratedData.guardianState;
                  delete migratedData.guardianPhone;
                  delete migratedData.alternateGuardianName;
                  delete migratedData.alternateGuardianCity;
                  delete migratedData.alternateGuardianState;
                  delete migratedData.alternateGuardianPhone;
                }

                // Convert old specificBequests format to new array format if needed
                if (formType === 'will' && !Array.isArray(migratedData.specificBequests)) {
                  // If hasSpecialBequests doesn't exist, determine it from old specificBequests content
                  if (!migratedData.hasSpecialBequests) {
                    if (migratedData.specificBequests && migratedData.specificBequests.trim() !== '') {
                      migratedData.hasSpecialBequests = 'yes';
                      // Convert old string to array format (basic conversion)
                      migratedData.specificBequests = [{
                        name: '',
                        relation: '',
                        property: migratedData.specificBequests
                      }];
                    } else {
                      migratedData.hasSpecialBequests = 'no';
                      migratedData.specificBequests = [{
                        name: '',
                        relation: '',
                        property: ''
                      }];
                    }
                  } else {
                    // Ensure specificBequests is an array
                    migratedData.specificBequests = [{
                      name: '',
                      relation: '',
                      property: ''
                    }];
                  }
                }

                // Handle trust form migrations
                if (formType === 'trust') {
                  // Ensure specificGifts array exists
                  if (!Array.isArray(migratedData.specificGifts)) {
                    migratedData.specificGifts = [{ beneficiary: '', gift: '' }];
                  }
                  
                  // Migrate old beneficiaries to new structure
                  if (Array.isArray(migratedData.beneficiaries)) {
                    // Split beneficiaries into children and other beneficiaries
                    const children = [];
                    const otherBeneficiaries = [];
                    
                    migratedData.beneficiaries.forEach(beneficiary => {
                      if (beneficiary.relationship && 
                          (beneficiary.relationship.toLowerCase().includes('child') ||
                           beneficiary.relationship.toLowerCase().includes('son') ||
                           beneficiary.relationship.toLowerCase().includes('daughter'))) {
                        children.push({
                          name: beneficiary.name || '',
                          relationship: beneficiary.relationship || ''
                        });
                      } else {
                        otherBeneficiaries.push({
                          name: beneficiary.name || '',
                          relationship: beneficiary.relationship || '',
                          percentage: beneficiary.percentage || ''
                        });
                      }
                    });
                    
                    // Set new structure
                    migratedData.children = children.length > 0 ? children : [{ name: '', relationship: '' }];
                    migratedData.otherBeneficiaries = otherBeneficiaries.length > 0 ? otherBeneficiaries : [{ name: '', relationship: '', percentage: '' }];
                    
                    // Remove old beneficiaries array
                    delete migratedData.beneficiaries;
                  } else {
                    // Ensure new arrays exist
                    if (!Array.isArray(migratedData.children)) {
                      migratedData.children = [{ name: '', relationship: '' }];
                    }
                    if (!Array.isArray(migratedData.otherBeneficiaries)) {
                      migratedData.otherBeneficiaries = [{ name: '', relationship: '', percentage: '' }];
                    }
                  }
                  
                  // Ensure trustAssets array exists
                  if (!Array.isArray(migratedData.trustAssets)) {
                    migratedData.trustAssets = [{ description: '', value: '', type: '' }];
                  }
                  
                  // Add missing county fields if they don't exist
                  if (!migratedData.trustorCounty) {
                    migratedData.trustorCounty = '';
                  }
                  if (!migratedData.trusteeCity) {
                    migratedData.trusteeCity = '';
                  }
                  if (!migratedData.trusteeCounty) {
                    migratedData.trusteeCounty = '';
                  }
                  
                  // Add second trustor fields if they don't exist
                  if (migratedData.hasSecondTrustor === undefined) {
                    migratedData.hasSecondTrustor = false;
                  }
                  if (!migratedData.secondTrustorName) {
                    migratedData.secondTrustorName = '';
                  }
                  if (!migratedData.secondTrustorAddress) {
                    migratedData.secondTrustorAddress = '';
                  }
                  if (!migratedData.secondTrustorCity) {
                    migratedData.secondTrustorCity = '';
                  }
                  if (!migratedData.secondTrustorCounty) {
                    migratedData.secondTrustorCounty = '';
                  }
                  if (!migratedData.secondTrustorState) {
                    migratedData.secondTrustorState = 'California';
                  }
                  if (!migratedData.secondTrustorZip) {
                    migratedData.secondTrustorZip = '';
                  }
                  if (!migratedData.secondTrustorPhone) {
                    migratedData.secondTrustorPhone = '';
                  }
                  if (!migratedData.secondTrustorEmail) {
                    migratedData.secondTrustorEmail = '';
                  }
                  
                  // Remove deprecated fields
                  delete migratedData.trustorDOB;
                  delete migratedData.trustorSSN;
                  delete migratedData.secondTrustorDOB;
                  delete migratedData.secondTrustorSSN;
                  delete migratedData.coTrustorName;
                  delete migratedData.coTrustorAddress;
                  delete migratedData.coTrustorPhone;
                  delete migratedData.coTrustorEmail;
                  delete migratedData.coTrustorSSN;
                  delete migratedData.coTrustorDOB;
                  
                  // Migrate old alternate trustee fields to new array structure
                  if (!Array.isArray(migratedData.alternateTrustees)) {
                    const alternateTrustees = [];
                    
                    // Check if old alternate trustee data exists
                    if (migratedData.alternateTrusteeName || migratedData.alternateTrusteePhone) {
                      alternateTrustees.push({
                        name: migratedData.alternateTrusteeName || '',
                        address: '',
                        city: '',
                        county: '',
                        phone: migratedData.alternateTrusteePhone || '',
                        email: ''
                      });
                    }
                    
                    // Ensure at least one empty alternate trustee if no data
                    if (alternateTrustees.length === 0) {
                      alternateTrustees.push({
                        name: '',
                        address: '',
                        city: '',
                        county: '',
                        phone: '',
                        email: ''
                      });
                    }
                    
                    migratedData.alternateTrustees = alternateTrustees;
                    
                    // Clean up old alternate trustee fields
                    delete migratedData.alternateTrusteeName;
                    delete migratedData.alternateTrusteePhone;
                  }
                }
          
          setFormData(migratedData);
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
