'use client'

import { useState, useEffect, useCallback } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
    }
    setIsInitialized(true)
  }, [key])

  // Return a wrapped version of useState's setter function
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  // Clear the stored value
  const clearValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.error(`Error clearing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, clearValue]
}

// Hook for auto-saving form data with debounce
export function useAutoSave<T>(
  key: string,
  data: T,
  delay: number = 1000
): { isSaving: boolean; lastSaved: Date | null; clearSaved: () => void } {
  const [, setStoredValue, clearValue] = useLocalStorage<T | null>(`autosave_${key}`, null)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsSaving(true)
      setStoredValue(data)
      setLastSaved(new Date())
      setTimeout(() => setIsSaving(false), 500)
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [data, delay, setStoredValue])

  return { isSaving, lastSaved, clearSaved: clearValue }
}

// Get all saved drafts
export function getSavedDrafts(): { key: string; documentType: string; data: any; savedAt: string }[] {
  if (typeof window === 'undefined') return []
  
  const drafts: { key: string; documentType: string; data: any; savedAt: string }[] = []
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('autosave_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}')
        const documentType = key.replace('autosave_', '').split('_')[0]
        drafts.push({
          key,
          documentType,
          data,
          savedAt: data._savedAt || new Date().toISOString()
        })
      } catch (e) {
        // Skip invalid entries
      }
    }
  }
  
  return drafts.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
}
