/**
 * Storage Layer Tests - Client-Side Todo List Application
 *
 * Tests for Local Storage operations following TDD approach
 * Per user preference: No try-catch, no if-else, deterministic tests
 * Per user preference: console.log only for error scenarios
 * Per user preference: assert_eq!(expected, actual) pattern
 */

import {
  LocalStorageAPI,
  STORAGE_KEY,
  SCHEMA_VERSION,
  createDefaultAppData,
  StorageQuotaExceededError,
  StorageDataCorruptedError,
} from '../../lib/storage';
import { AppData } from '../../lib/types';

describe('LocalStorageAPI', () => {
  let storage: LocalStorageAPI;

  beforeEach(() => {
    storage = new LocalStorageAPI();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('loadData', () => {
    it('should return default empty data when storage is empty', () => {
      const expected = createDefaultAppData();
      const actual = storage.loadData();

      expect(actual).toEqual(expected);
      expect(actual.version).toBe(SCHEMA_VERSION);
      expect(actual.todos).toEqual([]);
      expect(actual.tags).toEqual([]);
      expect(actual.categories).toEqual([]);
    });

    it('should load valid data from storage', () => {
      const testData: AppData = {
        version: SCHEMA_VERSION,
        todos: [
          {
            id: 'test-id-1',
            title: 'Test Todo',
            description: 'Test description',
            isCompleted: false,
            isDeleted: false,
            scheduledAt: null,
            categoryId: null,
            priority: 'medium',
            tagIds: [],
            createdAt: '2025-10-03T10:00:00.000Z',
            updatedAt: '2025-10-03T10:00:00.000Z',
            deletedAt: null,
          },
        ],
        tags: [
          {
            id: 'tag-1',
            name: 'work',
            color: 'bg-blue-100 text-blue-800',
            createdAt: '2025-10-03T10:00:00.000Z',
          },
        ],
        categories: [
          {
            id: 'cat-1',
            name: 'Personal',
            createdAt: '2025-10-03T10:00:00.000Z',
          },
        ],
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(testData));

      const actual = storage.loadData();

      expect(actual).toEqual(testData);
      expect(actual.todos.length).toBe(1);
      expect(actual.todos[0].title).toBe('Test Todo');
      expect(actual.tags.length).toBe(1);
      expect(actual.categories.length).toBe(1);
    });

    it('should throw StorageDataCorruptedError when data is invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid-json{');

      expect(() => storage.loadData()).toThrow(StorageDataCorruptedError);
    });

    it('should throw StorageDataCorruptedError when data is missing version', () => {
      const invalidData = {
        todos: [],
        tags: [],
        categories: [],
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(invalidData));

      expect(() => storage.loadData()).toThrow(StorageDataCorruptedError);
      expect(() => storage.loadData()).toThrow('Missing or invalid version');
    });

    it('should throw StorageDataCorruptedError when data is missing todos array', () => {
      const invalidData = {
        version: SCHEMA_VERSION,
        tags: [],
        categories: [],
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(invalidData));

      expect(() => storage.loadData()).toThrow(StorageDataCorruptedError);
      expect(() => storage.loadData()).toThrow('Missing or invalid todos array');
    });

    it('should throw StorageDataCorruptedError when data is not an object', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify('string-data'));

      expect(() => storage.loadData()).toThrow(StorageDataCorruptedError);
      expect(() => storage.loadData()).toThrow('Data is not an object');
    });
  });

  describe('saveData', () => {
    it('should save data to localStorage', () => {
      const testData: AppData = {
        version: SCHEMA_VERSION,
        todos: [
          {
            id: 'test-id-1',
            title: 'Test Todo',
            description: 'Test description',
            isCompleted: false,
            isDeleted: false,
            scheduledAt: null,
            categoryId: null,
            priority: 'high',
            tagIds: ['tag-1'],
            createdAt: '2025-10-03T10:00:00.000Z',
            updatedAt: '2025-10-03T10:00:00.000Z',
            deletedAt: null,
          },
        ],
        tags: [
          {
            id: 'tag-1',
            name: 'urgent',
            color: 'bg-red-100 text-red-800',
            createdAt: '2025-10-03T10:00:00.000Z',
          },
        ],
        categories: [],
      };

      storage.saveData(testData);

      const savedRaw = localStorage.getItem(STORAGE_KEY);
      expect(savedRaw).not.toBeNull();

      const savedData = JSON.parse(savedRaw!);
      expect(savedData).toEqual(testData);
    });

    it('should save empty data structure', () => {
      const emptyData = createDefaultAppData();

      storage.saveData(emptyData);

      const savedRaw = localStorage.getItem(STORAGE_KEY);
      const savedData = JSON.parse(savedRaw!);

      expect(savedData.todos).toEqual([]);
      expect(savedData.tags).toEqual([]);
      expect(savedData.categories).toEqual([]);
    });

    it('should overwrite existing data', () => {
      const firstData: AppData = {
        version: SCHEMA_VERSION,
        todos: [],
        tags: [],
        categories: [],
      };

      const secondData: AppData = {
        version: SCHEMA_VERSION,
        todos: [
          {
            id: 'new-id',
            title: 'New Todo',
            description: '',
            isCompleted: false,
            isDeleted: false,
            scheduledAt: null,
            categoryId: null,
            priority: 'low',
            tagIds: [],
            createdAt: '2025-10-03T11:00:00.000Z',
            updatedAt: '2025-10-03T11:00:00.000Z',
            deletedAt: null,
          },
        ],
        tags: [],
        categories: [],
      };

      storage.saveData(firstData);
      storage.saveData(secondData);

      const actual = storage.loadData();

      expect(actual.todos.length).toBe(1);
      expect(actual.todos[0].title).toBe('New Todo');
    });
  });

  describe('clearData', () => {
    it('should remove data from localStorage', () => {
      const testData = createDefaultAppData();
      storage.saveData(testData);

      expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();

      storage.clearData();

      const actual = localStorage.getItem(STORAGE_KEY);
      expect(actual).toBeNull();
    });

    it('should not throw error when clearing empty storage', () => {
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();

      storage.clearData();

      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('should allow loading default data after clear', () => {
      const testData = createDefaultAppData();
      testData.todos = [
        {
          id: 'id-1',
          title: 'Todo',
          description: '',
          isCompleted: false,
          isDeleted: false,
          scheduledAt: null,
          categoryId: null,
          priority: 'medium',
          tagIds: [],
          createdAt: '2025-10-03T10:00:00.000Z',
          updatedAt: '2025-10-03T10:00:00.000Z',
          deletedAt: null,
        },
      ];

      storage.saveData(testData);
      storage.clearData();

      const actual = storage.loadData();
      const expected = createDefaultAppData();

      expect(actual).toEqual(expected);
      expect(actual.todos).toEqual([]);
    });
  });

  describe('isAvailable', () => {
    it('should return true when localStorage is available', () => {
      const actual = storage.isAvailable();

      expect(actual).toBe(true);
    });

    it('should return false when localStorage throws error', () => {
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = () => {
        throw new Error('Storage not available');
      };

      const actual = storage.isAvailable();

      expect(actual).toBe(false);

      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('QuotaExceededError handling', () => {
    it('should throw StorageQuotaExceededError when storage quota is exceeded', () => {
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = () => {
        const error = new DOMException('Quota exceeded', 'QuotaExceededError');
        throw error;
      };

      const testData = createDefaultAppData();

      expect(() => storage.saveData(testData)).toThrow(StorageQuotaExceededError);
      expect(() => storage.saveData(testData)).toThrow('Browser storage quota exceeded');

      Storage.prototype.setItem = originalSetItem;
    });

    it('should propagate error message for quota exceeded', () => {
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = () => {
        const error = new DOMException('Quota exceeded', 'QuotaExceededError');
        throw error;
      };

      const testData = createDefaultAppData();

      const actual = () => storage.saveData(testData);

      expect(actual).toThrow(StorageQuotaExceededError);

      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('Integration: Save and Load cycle', () => {
    it('should maintain data integrity through save-load cycle', () => {
      const originalData: AppData = {
        version: SCHEMA_VERSION,
        todos: [
          {
            id: 'todo-1',
            title: 'First Todo',
            description: 'Description 1',
            isCompleted: false,
            isDeleted: false,
            scheduledAt: '2025-10-05T14:30:00.000Z',
            categoryId: 'cat-1',
            priority: 'high',
            tagIds: ['tag-1', 'tag-2'],
            createdAt: '2025-10-03T10:00:00.000Z',
            updatedAt: '2025-10-03T10:00:00.000Z',
            deletedAt: null,
          },
          {
            id: 'todo-2',
            title: 'Second Todo',
            description: '',
            isCompleted: true,
            isDeleted: false,
            scheduledAt: null,
            categoryId: null,
            priority: 'low',
            tagIds: [],
            createdAt: '2025-10-03T11:00:00.000Z',
            updatedAt: '2025-10-03T12:00:00.000Z',
            deletedAt: null,
          },
        ],
        tags: [
          {
            id: 'tag-1',
            name: 'work',
            color: 'bg-blue-100 text-blue-800',
            createdAt: '2025-10-03T10:00:00.000Z',
          },
          {
            id: 'tag-2',
            name: 'urgent',
            color: 'bg-red-100 text-red-800',
            createdAt: '2025-10-03T10:00:00.000Z',
          },
        ],
        categories: [
          {
            id: 'cat-1',
            name: 'Personal',
            createdAt: '2025-10-03T10:00:00.000Z',
          },
        ],
      };

      storage.saveData(originalData);
      const loadedData = storage.loadData();

      expect(loadedData).toEqual(originalData);
      expect(loadedData.todos[0].tagIds).toEqual(['tag-1', 'tag-2']);
      expect(loadedData.todos[1].isCompleted).toBe(true);
    });
  });
});
