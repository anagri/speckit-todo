/**
 * Validation Tests - Client-Side Todo List Application
 *
 * Tests for data validation functions following TDD approach
 * Per user preference: No try-catch, no if-else, deterministic tests
 * Per user preference: console.log only for error scenarios
 * Per user preference: assert_eq!(expected, actual) pattern
 */

import {
  validateAppData,
  validateTodo,
  StorageDataCorruptedError,
  SCHEMA_VERSION,
} from '../../lib/storage';
import { AppData, Todo } from '../../lib/types';

describe('validateAppData', () => {
  it('should validate correct AppData structure', () => {
    const validData: AppData = {
      version: SCHEMA_VERSION,
      todos: [],
      tags: [],
      categories: [],
    };

    const actual = validateAppData(validData);

    expect(actual).toEqual(validData);
    expect(actual.version).toBe(SCHEMA_VERSION);
    expect(Array.isArray(actual.todos)).toBe(true);
    expect(Array.isArray(actual.tags)).toBe(true);
    expect(Array.isArray(actual.categories)).toBe(true);
  });

  it('should validate AppData with populated arrays', () => {
    const validData: AppData = {
      version: '1.0.0',
      todos: [
        {
          id: 'test-id',
          title: 'Test',
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
      ],
      tags: [
        {
          id: 'tag-1',
          name: 'work',
          color: 'bg-blue-100',
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

    const actual = validateAppData(validData);

    expect(actual).toEqual(validData);
    expect(actual.todos.length).toBe(1);
    expect(actual.tags.length).toBe(1);
    expect(actual.categories.length).toBe(1);
  });

  it('should throw StorageDataCorruptedError when data is null', () => {
    const invalidData = null;

    expect(() => validateAppData(invalidData)).toThrow(StorageDataCorruptedError);
    expect(() => validateAppData(invalidData)).toThrow('Data is not an object');
  });

  it('should throw StorageDataCorruptedError when data is not an object', () => {
    const invalidData = 'string-data';

    expect(() => validateAppData(invalidData)).toThrow(StorageDataCorruptedError);
    expect(() => validateAppData(invalidData)).toThrow('Data is not an object');
  });

  it('should throw StorageDataCorruptedError when version is missing', () => {
    const invalidData = {
      todos: [],
      tags: [],
      categories: [],
    };

    expect(() => validateAppData(invalidData)).toThrow(StorageDataCorruptedError);
    expect(() => validateAppData(invalidData)).toThrow('Missing or invalid version');
  });

  it('should throw StorageDataCorruptedError when version is not a string', () => {
    const invalidData = {
      version: 123,
      todos: [],
      tags: [],
      categories: [],
    };

    expect(() => validateAppData(invalidData)).toThrow(StorageDataCorruptedError);
    expect(() => validateAppData(invalidData)).toThrow('Missing or invalid version');
  });

  it('should throw StorageDataCorruptedError when todos is missing', () => {
    const invalidData = {
      version: SCHEMA_VERSION,
      tags: [],
      categories: [],
    };

    expect(() => validateAppData(invalidData)).toThrow(StorageDataCorruptedError);
    expect(() => validateAppData(invalidData)).toThrow('Missing or invalid todos array');
  });

  it('should throw StorageDataCorruptedError when todos is not an array', () => {
    const invalidData = {
      version: SCHEMA_VERSION,
      todos: 'not-an-array',
      tags: [],
      categories: [],
    };

    expect(() => validateAppData(invalidData)).toThrow(StorageDataCorruptedError);
    expect(() => validateAppData(invalidData)).toThrow('Missing or invalid todos array');
  });

  it('should throw StorageDataCorruptedError when tags is missing', () => {
    const invalidData = {
      version: SCHEMA_VERSION,
      todos: [],
      categories: [],
    };

    expect(() => validateAppData(invalidData)).toThrow(StorageDataCorruptedError);
    expect(() => validateAppData(invalidData)).toThrow('Missing or invalid tags array');
  });

  it('should throw StorageDataCorruptedError when tags is not an array', () => {
    const invalidData = {
      version: SCHEMA_VERSION,
      todos: [],
      tags: {},
      categories: [],
    };

    expect(() => validateAppData(invalidData)).toThrow(StorageDataCorruptedError);
    expect(() => validateAppData(invalidData)).toThrow('Missing or invalid tags array');
  });

  it('should throw StorageDataCorruptedError when categories is missing', () => {
    const invalidData = {
      version: SCHEMA_VERSION,
      todos: [],
      tags: [],
    };

    expect(() => validateAppData(invalidData)).toThrow(StorageDataCorruptedError);
    expect(() => validateAppData(invalidData)).toThrow('Missing or invalid categories array');
  });

  it('should throw StorageDataCorruptedError when categories is not an array', () => {
    const invalidData = {
      version: SCHEMA_VERSION,
      todos: [],
      tags: [],
      categories: 'not-an-array',
    };

    expect(() => validateAppData(invalidData)).toThrow(StorageDataCorruptedError);
    expect(() => validateAppData(invalidData)).toThrow('Missing or invalid categories array');
  });

  it('should throw StorageDataCorruptedError when data is an array instead of object', () => {
    const invalidData = [1, 2, 3];

    expect(() => validateAppData(invalidData)).toThrow(StorageDataCorruptedError);
  });
});

describe('validateTodo', () => {
  it('should validate correct Todo structure', () => {
    const validTodo: Todo = {
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
    };

    const actual = validateTodo(validTodo);

    expect(actual).toEqual(validTodo);
    expect(actual.id).toBe('test-id-1');
    expect(actual.title).toBe('Test Todo');
    expect(actual.priority).toBe('medium');
  });

  it('should validate Todo with all fields populated', () => {
    const validTodo: Todo = {
      id: 'todo-123',
      title: 'Buy groceries',
      description: 'Milk, eggs, bread',
      isCompleted: true,
      isDeleted: false,
      scheduledAt: '2025-10-05T14:30:00.000Z',
      categoryId: 'cat-personal',
      priority: 'high',
      tagIds: ['tag-1', 'tag-2', 'tag-3'],
      createdAt: '2025-10-03T10:00:00.000Z',
      updatedAt: '2025-10-04T15:30:00.000Z',
      deletedAt: null,
    };

    const actual = validateTodo(validTodo);

    expect(actual).toEqual(validTodo);
    expect(actual.tagIds.length).toBe(3);
    expect(actual.isCompleted).toBe(true);
  });

  it('should validate Todo with soft delete', () => {
    const validTodo: Todo = {
      id: 'deleted-todo',
      title: 'Deleted Todo',
      description: '',
      isCompleted: false,
      isDeleted: true,
      scheduledAt: null,
      categoryId: null,
      priority: 'low',
      tagIds: [],
      createdAt: '2025-10-03T10:00:00.000Z',
      updatedAt: '2025-10-03T11:00:00.000Z',
      deletedAt: '2025-10-03T11:00:00.000Z',
    };

    const actual = validateTodo(validTodo);

    expect(actual).toEqual(validTodo);
    expect(actual.isDeleted).toBe(true);
    expect(actual.deletedAt).toBe('2025-10-03T11:00:00.000Z');
  });

  it('should throw StorageDataCorruptedError when todo is null', () => {
    const invalidTodo = null;

    expect(() => validateTodo(invalidTodo)).toThrow(StorageDataCorruptedError);
    expect(() => validateTodo(invalidTodo)).toThrow('Todo is not an object');
  });

  it('should throw StorageDataCorruptedError when todo is not an object', () => {
    const invalidTodo = 'string-todo';

    expect(() => validateTodo(invalidTodo)).toThrow(StorageDataCorruptedError);
    expect(() => validateTodo(invalidTodo)).toThrow('Todo is not an object');
  });

  it('should throw StorageDataCorruptedError when id is missing', () => {
    const invalidTodo = {
      title: 'Test',
      description: '',
      isCompleted: false,
      isDeleted: false,
      priority: 'medium',
      tagIds: [],
      createdAt: '2025-10-03T10:00:00.000Z',
      updatedAt: '2025-10-03T10:00:00.000Z',
    };

    expect(() => validateTodo(invalidTodo)).toThrow(StorageDataCorruptedError);
    expect(() => validateTodo(invalidTodo)).toThrow('Todo missing or invalid id');
  });

  it('should throw StorageDataCorruptedError when title is missing', () => {
    const invalidTodo = {
      id: 'test-id',
      description: '',
      isCompleted: false,
      isDeleted: false,
      priority: 'medium',
      tagIds: [],
      createdAt: '2025-10-03T10:00:00.000Z',
      updatedAt: '2025-10-03T10:00:00.000Z',
    };

    expect(() => validateTodo(invalidTodo)).toThrow(StorageDataCorruptedError);
    expect(() => validateTodo(invalidTodo)).toThrow('Todo missing or invalid title');
  });

  it('should throw StorageDataCorruptedError when description is missing', () => {
    const invalidTodo = {
      id: 'test-id',
      title: 'Test',
      isCompleted: false,
      isDeleted: false,
      priority: 'medium',
      tagIds: [],
      createdAt: '2025-10-03T10:00:00.000Z',
      updatedAt: '2025-10-03T10:00:00.000Z',
    };

    expect(() => validateTodo(invalidTodo)).toThrow(StorageDataCorruptedError);
    expect(() => validateTodo(invalidTodo)).toThrow('Todo missing or invalid description');
  });

  it('should throw StorageDataCorruptedError when isCompleted is missing', () => {
    const invalidTodo = {
      id: 'test-id',
      title: 'Test',
      description: '',
      isDeleted: false,
      priority: 'medium',
      tagIds: [],
      createdAt: '2025-10-03T10:00:00.000Z',
      updatedAt: '2025-10-03T10:00:00.000Z',
    };

    expect(() => validateTodo(invalidTodo)).toThrow(StorageDataCorruptedError);
    expect(() => validateTodo(invalidTodo)).toThrow('Todo missing or invalid isCompleted');
  });

  it('should throw StorageDataCorruptedError when isDeleted is missing', () => {
    const invalidTodo = {
      id: 'test-id',
      title: 'Test',
      description: '',
      isCompleted: false,
      priority: 'medium',
      tagIds: [],
      createdAt: '2025-10-03T10:00:00.000Z',
      updatedAt: '2025-10-03T10:00:00.000Z',
    };

    expect(() => validateTodo(invalidTodo)).toThrow(StorageDataCorruptedError);
    expect(() => validateTodo(invalidTodo)).toThrow('Todo missing or invalid isDeleted');
  });

  it('should throw StorageDataCorruptedError when createdAt is missing', () => {
    const invalidTodo = {
      id: 'test-id',
      title: 'Test',
      description: '',
      isCompleted: false,
      isDeleted: false,
      priority: 'medium',
      tagIds: [],
      updatedAt: '2025-10-03T10:00:00.000Z',
    };

    expect(() => validateTodo(invalidTodo)).toThrow(StorageDataCorruptedError);
    expect(() => validateTodo(invalidTodo)).toThrow('Todo missing or invalid createdAt');
  });

  it('should throw StorageDataCorruptedError when updatedAt is missing', () => {
    const invalidTodo = {
      id: 'test-id',
      title: 'Test',
      description: '',
      isCompleted: false,
      isDeleted: false,
      priority: 'medium',
      tagIds: [],
      createdAt: '2025-10-03T10:00:00.000Z',
    };

    expect(() => validateTodo(invalidTodo)).toThrow(StorageDataCorruptedError);
    expect(() => validateTodo(invalidTodo)).toThrow('Todo missing or invalid updatedAt');
  });

  it('should throw StorageDataCorruptedError when tagIds is missing', () => {
    const invalidTodo = {
      id: 'test-id',
      title: 'Test',
      description: '',
      isCompleted: false,
      isDeleted: false,
      priority: 'medium',
      createdAt: '2025-10-03T10:00:00.000Z',
      updatedAt: '2025-10-03T10:00:00.000Z',
    };

    expect(() => validateTodo(invalidTodo)).toThrow(StorageDataCorruptedError);
    expect(() => validateTodo(invalidTodo)).toThrow('Todo missing or invalid tagIds array');
  });

  it('should throw StorageDataCorruptedError when tagIds is not an array', () => {
    const invalidTodo = {
      id: 'test-id',
      title: 'Test',
      description: '',
      isCompleted: false,
      isDeleted: false,
      priority: 'medium',
      tagIds: 'not-an-array',
      createdAt: '2025-10-03T10:00:00.000Z',
      updatedAt: '2025-10-03T10:00:00.000Z',
    };

    expect(() => validateTodo(invalidTodo)).toThrow(StorageDataCorruptedError);
    expect(() => validateTodo(invalidTodo)).toThrow('Todo missing or invalid tagIds array');
  });

  it('should throw StorageDataCorruptedError when priority is invalid', () => {
    const invalidTodo = {
      id: 'test-id',
      title: 'Test',
      description: '',
      isCompleted: false,
      isDeleted: false,
      priority: 'critical',
      tagIds: [],
      createdAt: '2025-10-03T10:00:00.000Z',
      updatedAt: '2025-10-03T10:00:00.000Z',
    };

    expect(() => validateTodo(invalidTodo)).toThrow(StorageDataCorruptedError);
    expect(() => validateTodo(invalidTodo)).toThrow('Todo has invalid priority');
  });

  it('should throw StorageDataCorruptedError when priority is not a string', () => {
    const invalidTodo = {
      id: 'test-id',
      title: 'Test',
      description: '',
      isCompleted: false,
      isDeleted: false,
      priority: 123,
      tagIds: [],
      createdAt: '2025-10-03T10:00:00.000Z',
      updatedAt: '2025-10-03T10:00:00.000Z',
    };

    expect(() => validateTodo(invalidTodo)).toThrow(StorageDataCorruptedError);
    expect(() => validateTodo(invalidTodo)).toThrow('Todo has invalid priority');
  });

  it('should validate all valid priority values', () => {
    const priorities = ['low', 'medium', 'high'];

    priorities.forEach((priority) => {
      const validTodo: Todo = {
        id: `test-${priority}`,
        title: `Test ${priority}`,
        description: '',
        isCompleted: false,
        isDeleted: false,
        scheduledAt: null,
        categoryId: null,
        priority: priority as 'low' | 'medium' | 'high',
        tagIds: [],
        createdAt: '2025-10-03T10:00:00.000Z',
        updatedAt: '2025-10-03T10:00:00.000Z',
        deletedAt: null,
      };

      const actual = validateTodo(validTodo);

      expect(actual.priority).toBe(priority);
    });
  });
});
