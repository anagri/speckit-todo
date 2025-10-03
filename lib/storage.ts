/**
 * Storage API Implementation - Client-Side Todo List Application
 *
 * This file implements browser storage operations using Local Storage.
 * Based on contracts/storage-api.ts
 */

import { AppData, Todo } from './types';

// ============================================================================
// Storage Configuration
// ============================================================================

/**
 * Storage key for Local Storage
 * Versioned to allow future schema migrations
 */
export const STORAGE_KEY = 'todos_app_data_v1';

/**
 * Current schema version
 */
export const SCHEMA_VERSION = '1.0.0';

// ============================================================================
// Storage Error Types
// ============================================================================

/**
 * Custom error for storage quota exceeded
 * Wraps browser QuotaExceededError for consistent handling
 */
export class StorageQuotaExceededError extends Error {
  constructor(message: string = 'Browser storage quota exceeded') {
    super(message);
    this.name = 'StorageQuotaExceededError';
  }
}

/**
 * Custom error for corrupted storage data
 */
export class StorageDataCorruptedError extends Error {
  constructor(message: string = 'Storage data is corrupted') {
    super(message);
    this.name = 'StorageDataCorruptedError';
  }
}

// ============================================================================
// Storage Interface
// ============================================================================

/**
 * Storage operations interface
 * Defines all methods for persisting and retrieving application data
 */
export interface StorageAPI {
  /**
   * Load all application data from storage
   * Returns default empty structure if no data exists
   * @throws {Error} If data is corrupted or cannot be parsed
   */
  loadData(): AppData;

  /**
   * Save all application data to storage
   * Per FR-025: Display browser storage errors directly to user
   * @throws {QuotaExceededError} If storage limit is reached
   * @throws {Error} For other storage errors
   */
  saveData(data: AppData): void;

  /**
   * Clear all application data from storage
   * Used for reset/logout functionality
   */
  clearData(): void;

  /**
   * Check if storage is available
   * Used for feature detection
   */
  isAvailable(): boolean;
}

// ============================================================================
// Default Data Structure
// ============================================================================

/**
 * Creates default empty application data structure
 */
export function createDefaultAppData(): AppData {
  return {
    version: SCHEMA_VERSION,
    todos: [],
    tags: [],
    categories: [],
  };
}

// ============================================================================
// Data Validation Functions
// ============================================================================

/**
 * Validates that loaded data matches AppData structure
 * @throws {StorageDataCorruptedError} If validation fails
 */
export function validateAppData(data: unknown): AppData {
  if (typeof data !== 'object' || data === null) {
    throw new StorageDataCorruptedError('Data is not an object');
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.version !== 'string') {
    throw new StorageDataCorruptedError('Missing or invalid version');
  }

  if (!Array.isArray(obj.todos)) {
    throw new StorageDataCorruptedError('Missing or invalid todos array');
  }

  if (!Array.isArray(obj.tags)) {
    throw new StorageDataCorruptedError('Missing or invalid tags array');
  }

  if (!Array.isArray(obj.categories)) {
    throw new StorageDataCorruptedError('Missing or invalid categories array');
  }

  return obj as AppData;
}

/**
 * Validates a single Todo entity
 * @throws {StorageDataCorruptedError} If validation fails
 */
export function validateTodo(todo: unknown): Todo {
  if (typeof todo !== 'object' || todo === null) {
    throw new StorageDataCorruptedError('Todo is not an object');
  }

  const obj = todo as Record<string, unknown>;

  const requiredStringFields = ['id', 'title', 'description', 'createdAt', 'updatedAt'];
  const requiredBooleanFields = ['isCompleted', 'isDeleted'];

  for (const field of requiredStringFields) {
    if (typeof obj[field] !== 'string') {
      throw new StorageDataCorruptedError(`Todo missing or invalid ${field}`);
    }
  }

  for (const field of requiredBooleanFields) {
    if (typeof obj[field] !== 'boolean') {
      throw new StorageDataCorruptedError(`Todo missing or invalid ${field}`);
    }
  }

  if (!Array.isArray(obj.tagIds)) {
    throw new StorageDataCorruptedError('Todo missing or invalid tagIds array');
  }

  const validPriorities = ['low', 'medium', 'high'];
  if (!validPriorities.includes(obj.priority as string)) {
    throw new StorageDataCorruptedError('Todo has invalid priority');
  }

  return obj as Todo;
}

// ============================================================================
// Local Storage Implementation
// ============================================================================

/**
 * Local Storage implementation of StorageAPI
 * This is the primary storage mechanism for the application
 */
export class LocalStorageAPI implements StorageAPI {
  /**
   * Load all application data from Local Storage
   * Returns default empty structure if no data exists
   * @throws {StorageDataCorruptedError} If data is corrupted or cannot be parsed
   */
  loadData(): AppData {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultAppData();
    }

    try {
      const parsed = JSON.parse(raw);
      return validateAppData(parsed);
    } catch (error) {
      if (error instanceof StorageDataCorruptedError) {
        throw error;
      }
      throw new StorageDataCorruptedError('Failed to parse storage data');
    }
  }

  /**
   * Save all application data to Local Storage
   * Per FR-025: Errors are thrown and displayed directly to user
   * @throws {StorageQuotaExceededError} If storage limit is reached
   * @throws {Error} For other storage errors
   */
  saveData(data: AppData): void {
    try {
      const json = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEY, json);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new StorageQuotaExceededError();
      }
      throw error;
    }
  }

  /**
   * Clear all application data from Local Storage
   * Used for reset functionality
   */
  clearData(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Check if Local Storage is available
   * Handles SecurityError (private browsing) and QuotaExceededError
   */
  isAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Default storage instance
 * Export for use throughout the application
 */
export const storage = new LocalStorageAPI();
