/**
 * useLocalStorage Hook - Client-Side Todo List Application
 *
 * Custom hook for automatic localStorage synchronization
 */

import { useEffect } from 'react';
import { AppData } from '../types';
import { storage } from '../storage';

/**
 * Hook to auto-save data to localStorage
 *
 * @param data - Application data to save
 * @param enabled - Whether auto-save is enabled (default: true)
 */
export function useLocalStorage(data: AppData, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Skip saving if data is empty (initial state)
    const isEmpty =
      data.todos.length === 0 &&
      data.tags.length === 0 &&
      data.categories.length === 0;

    if (isEmpty) {
      return;
    }

    // Save data to localStorage
    try {
      storage.saveData(data);
    } catch (error) {
      // Error will be handled by the storage layer
      // and displayed to user per FR-025
      console.log('Storage error:', error);
      throw error;
    }
  }, [data, enabled]);
}

/**
 * Hook to load data from localStorage on mount
 *
 * @returns AppData from localStorage or default empty data
 */
export function useLoadFromStorage(): AppData {
  return storage.loadData();
}
