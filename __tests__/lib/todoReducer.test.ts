/**
 * Todo Reducer Tests - Client-Side Todo List Application
 *
 * Tests for state management reducer following TDD approach
 * Per user preference: No try-catch, no if-else, deterministic tests
 */

import { todoReducer, initialState } from '../../lib/todoReducer';
import { TodoContextState, TodoAction, CreateTodoInput, UpdateTodoInput } from '../../lib/types';

describe('todoReducer', () => {
  describe('CREATE_TODO action', () => {
    it('should create a new todo with all fields', () => {
      const input: CreateTodoInput = {
        title: 'Buy groceries',
        description: 'Milk, eggs, bread',
        scheduledAt: '2025-10-05T14:30:00.000Z',
        categoryId: 'cat-1',
        priority: 'high',
        tagIds: ['tag-1', 'tag-2'],
      };

      const action: TodoAction = { type: 'CREATE_TODO', payload: input };
      const newState = todoReducer(initialState, action);

      expect(newState.todos.length).toBe(1);
      expect(newState.todos[0].title).toBe('Buy groceries');
      expect(newState.todos[0].description).toBe('Milk, eggs, bread');
      expect(newState.todos[0].priority).toBe('high');
      expect(newState.todos[0].isCompleted).toBe(false);
      expect(newState.todos[0].isDeleted).toBe(false);
      expect(newState.todos[0].tagIds).toEqual(['tag-1', 'tag-2']);
    });

    it('should create todo with default values when optional fields omitted', () => {
      const input: CreateTodoInput = {
        title: 'Simple todo',
      };

      const action: TodoAction = { type: 'CREATE_TODO', payload: input };
      const newState = todoReducer(initialState, action);

      expect(newState.todos.length).toBe(1);
      expect(newState.todos[0].title).toBe('Simple todo');
      expect(newState.todos[0].description).toBe('');
      expect(newState.todos[0].priority).toBe('medium');
      expect(newState.todos[0].tagIds).toEqual([]);
      expect(newState.todos[0].categoryId).toBeNull();
      expect(newState.todos[0].scheduledAt).toBeNull();
    });

    it('should generate unique id and timestamps for new todo', () => {
      const input: CreateTodoInput = { title: 'Test' };
      const action: TodoAction = { type: 'CREATE_TODO', payload: input };

      const newState = todoReducer(initialState, action);
      const todo = newState.todos[0];

      expect(todo.id).toBeDefined();
      expect(typeof todo.id).toBe('string');
      expect(todo.createdAt).toBeDefined();
      expect(todo.updatedAt).toBeDefined();
      expect(todo.createdAt).toBe(todo.updatedAt);
    });

    it('should add new todo without mutating original state', () => {
      const input: CreateTodoInput = { title: 'New todo' };
      const action: TodoAction = { type: 'CREATE_TODO', payload: input };

      const originalTodos = initialState.todos;
      const newState = todoReducer(initialState, action);

      expect(originalTodos).toEqual([]);
      expect(newState.todos).not.toBe(originalTodos);
    });
  });

  describe('UPDATE_TODO action', () => {
    it('should update todo title', () => {
      const state: TodoContextState = {
        ...initialState,
        todos: [
          {
            id: 'todo-1',
            title: 'Original Title',
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
      };

      const update: UpdateTodoInput = {
        id: 'todo-1',
        title: 'Updated Title',
      };

      const action: TodoAction = { type: 'UPDATE_TODO', payload: update };
      const newState = todoReducer(state, action);

      expect(newState.todos[0].title).toBe('Updated Title');
      expect(newState.todos[0].createdAt).toBe('2025-10-03T10:00:00.000Z');
      expect(newState.todos[0].updatedAt).not.toBe('2025-10-03T10:00:00.000Z');
    });

    it('should update multiple fields simultaneously', () => {
      const state: TodoContextState = {
        ...initialState,
        todos: [
          {
            id: 'todo-1',
            title: 'Original',
            description: '',
            isCompleted: false,
            isDeleted: false,
            scheduledAt: null,
            categoryId: null,
            priority: 'low',
            tagIds: [],
            createdAt: '2025-10-03T10:00:00.000Z',
            updatedAt: '2025-10-03T10:00:00.000Z',
            deletedAt: null,
          },
        ],
      };

      const update: UpdateTodoInput = {
        id: 'todo-1',
        title: 'Updated',
        description: 'New description',
        priority: 'high',
        tagIds: ['tag-1'],
      };

      const action: TodoAction = { type: 'UPDATE_TODO', payload: update };
      const newState = todoReducer(state, action);

      expect(newState.todos[0].title).toBe('Updated');
      expect(newState.todos[0].description).toBe('New description');
      expect(newState.todos[0].priority).toBe('high');
      expect(newState.todos[0].tagIds).toEqual(['tag-1']);
    });

    it('should not update createdAt when updating todo', () => {
      const state: TodoContextState = {
        ...initialState,
        todos: [
          {
            id: 'todo-1',
            title: 'Test',
            description: '',
            isCompleted: false,
            isDeleted: false,
            scheduledAt: null,
            categoryId: null,
            priority: 'medium',
            tagIds: [],
            createdAt: '2025-10-01T10:00:00.000Z',
            updatedAt: '2025-10-01T10:00:00.000Z',
            deletedAt: null,
          },
        ],
      };

      const update: UpdateTodoInput = {
        id: 'todo-1',
        title: 'Updated',
      };

      const action: TodoAction = { type: 'UPDATE_TODO', payload: update };
      const newState = todoReducer(state, action);

      expect(newState.todos[0].createdAt).toBe('2025-10-01T10:00:00.000Z');
    });
  });

  describe('DELETE_TODO action', () => {
    it('should soft delete todo by setting isDeleted flag', () => {
      const state: TodoContextState = {
        ...initialState,
        todos: [
          {
            id: 'todo-1',
            title: 'To be deleted',
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
      };

      const action: TodoAction = { type: 'DELETE_TODO', payload: { id: 'todo-1' } };
      const newState = todoReducer(state, action);

      expect(newState.todos[0].isDeleted).toBe(true);
      expect(newState.todos[0].deletedAt).toBeDefined();
      expect(newState.todos[0].deletedAt).not.toBeNull();
    });

    it('should keep todo in array after soft delete', () => {
      const state: TodoContextState = {
        ...initialState,
        todos: [
          {
            id: 'todo-1',
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
      };

      const action: TodoAction = { type: 'DELETE_TODO', payload: { id: 'todo-1' } };
      const newState = todoReducer(state, action);

      expect(newState.todos.length).toBe(1);
      expect(newState.todos[0].id).toBe('todo-1');
    });
  });

  describe('RESTORE_TODO action', () => {
    it('should restore deleted todo', () => {
      const state: TodoContextState = {
        ...initialState,
        todos: [
          {
            id: 'todo-1',
            title: 'Deleted todo',
            description: '',
            isCompleted: false,
            isDeleted: true,
            scheduledAt: null,
            categoryId: null,
            priority: 'medium',
            tagIds: [],
            createdAt: '2025-10-03T10:00:00.000Z',
            updatedAt: '2025-10-03T11:00:00.000Z',
            deletedAt: '2025-10-03T11:00:00.000Z',
          },
        ],
      };

      const action: TodoAction = { type: 'RESTORE_TODO', payload: { id: 'todo-1' } };
      const newState = todoReducer(state, action);

      expect(newState.todos[0].isDeleted).toBe(false);
      expect(newState.todos[0].deletedAt).toBeNull();
    });
  });

  describe('TOGGLE_COMPLETE action', () => {
    it('should toggle todo from incomplete to complete', () => {
      const state: TodoContextState = {
        ...initialState,
        todos: [
          {
            id: 'todo-1',
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
      };

      const action: TodoAction = { type: 'TOGGLE_COMPLETE', payload: { id: 'todo-1' } };
      const newState = todoReducer(state, action);

      expect(newState.todos[0].isCompleted).toBe(true);
    });

    it('should toggle todo from complete to incomplete', () => {
      const state: TodoContextState = {
        ...initialState,
        todos: [
          {
            id: 'todo-1',
            title: 'Test',
            description: '',
            isCompleted: true,
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
      };

      const action: TodoAction = { type: 'TOGGLE_COMPLETE', payload: { id: 'todo-1' } };
      const newState = todoReducer(state, action);

      expect(newState.todos[0].isCompleted).toBe(false);
    });
  });

  describe('Filter actions', () => {
    it('should set filter tags', () => {
      const action: TodoAction = {
        type: 'SET_FILTER',
        payload: { tags: ['tag-1', 'tag-2'] },
      };

      const newState = todoReducer(initialState, action);

      expect(newState.filters.tags).toEqual(['tag-1', 'tag-2']);
    });

    it('should set filter categories', () => {
      const action: TodoAction = {
        type: 'SET_FILTER',
        payload: { categories: ['cat-1'] },
      };

      const newState = todoReducer(initialState, action);

      expect(newState.filters.categories).toEqual(['cat-1']);
    });

    it('should set filter priorities', () => {
      const action: TodoAction = {
        type: 'SET_FILTER',
        payload: { priorities: ['high', 'medium'] },
      };

      const newState = todoReducer(initialState, action);

      expect(newState.filters.priorities).toEqual(['high', 'medium']);
    });

    it('should set completion status filter', () => {
      const action: TodoAction = {
        type: 'SET_FILTER',
        payload: { completionStatus: 'completed' },
      };

      const newState = todoReducer(initialState, action);

      expect(newState.filters.completionStatus).toBe('completed');
    });

    it('should clear all filters', () => {
      const state: TodoContextState = {
        ...initialState,
        filters: {
          tags: ['tag-1'],
          categories: ['cat-1'],
          priorities: ['high'],
          completionStatus: 'completed',
        },
      };

      const action: TodoAction = { type: 'CLEAR_FILTERS' };
      const newState = todoReducer(state, action);

      expect(newState.filters.tags).toEqual([]);
      expect(newState.filters.categories).toEqual([]);
      expect(newState.filters.priorities).toEqual([]);
      expect(newState.filters.completionStatus).toBe('all');
    });
  });

  describe('Sort actions', () => {
    it('should set sort criterion to priority', () => {
      const action: TodoAction = {
        type: 'SET_SORT',
        payload: { criterion: 'priority', direction: 'desc' },
      };

      const newState = todoReducer(initialState, action);

      expect(newState.sort.criterion).toBe('priority');
      expect(newState.sort.direction).toBe('desc');
    });

    it('should set sort criterion to scheduledAt', () => {
      const action: TodoAction = {
        type: 'SET_SORT',
        payload: { criterion: 'scheduledAt', direction: 'asc' },
      };

      const newState = todoReducer(initialState, action);

      expect(newState.sort.criterion).toBe('scheduledAt');
      expect(newState.sort.direction).toBe('asc');
    });

    it('should replace previous sort criterion (single sort only)', () => {
      const state: TodoContextState = {
        ...initialState,
        sort: { criterion: 'priority', direction: 'asc' },
      };

      const action: TodoAction = {
        type: 'SET_SORT',
        payload: { criterion: 'createdAt', direction: 'desc' },
      };

      const newState = todoReducer(state, action);

      expect(newState.sort.criterion).toBe('createdAt');
      expect(newState.sort.direction).toBe('desc');
    });
  });

  describe('CREATE_TAG action', () => {
    it('should create a new tag', () => {
      const action: TodoAction = {
        type: 'CREATE_TAG',
        payload: { name: 'work' },
      };

      const newState = todoReducer(initialState, action);

      expect(newState.tags.length).toBe(1);
      expect(newState.tags[0].name).toBe('work');
      expect(newState.tags[0].id).toBeDefined();
      expect(newState.tags[0].color).toBeDefined();
    });
  });

  describe('CREATE_CATEGORY action', () => {
    it('should create a new category', () => {
      const action: TodoAction = {
        type: 'CREATE_CATEGORY',
        payload: { name: 'Personal' },
      };

      const newState = todoReducer(initialState, action);

      expect(newState.categories.length).toBe(1);
      expect(newState.categories[0].name).toBe('Personal');
      expect(newState.categories[0].id).toBeDefined();
    });
  });

  describe('LOAD_DATA action', () => {
    it('should load data from storage', () => {
      const loadedData = {
        version: '1.0.0',
        todos: [
          {
            id: 'todo-1',
            title: 'Loaded todo',
            description: '',
            isCompleted: false,
            isDeleted: false,
            scheduledAt: null,
            categoryId: null,
            priority: 'medium' as const,
            tagIds: [],
            createdAt: '2025-10-03T10:00:00.000Z',
            updatedAt: '2025-10-03T10:00:00.000Z',
            deletedAt: null,
          },
        ],
        tags: [],
        categories: [],
      };

      const action: TodoAction = { type: 'LOAD_DATA', payload: loadedData };
      const newState = todoReducer(initialState, action);

      expect(newState.todos.length).toBe(1);
      expect(newState.todos[0].title).toBe('Loaded todo');
    });
  });
});
