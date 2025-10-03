/**
 * TodoContext Tests - Client-Side Todo List Application
 *
 * Tests for React Context provider following TDD approach
 * Per user preference: No try-catch, no if-else, deterministic tests
 */

import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { TodoProvider, useTodoContext } from '../../lib/TodoContext';
import { CreateTodoInput } from '../../lib/types';

describe('TodoContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TodoProvider>{children}</TodoProvider>
  );

  describe('Initial state', () => {
    it('should provide initial empty state', () => {
      const { result } = renderHook(() => useTodoContext(), { wrapper });

      expect(result.current.todos).toEqual([]);
      expect(result.current.tags).toEqual([]);
      expect(result.current.categories).toEqual([]);
    });

    it('should provide initial filter state', () => {
      const { result } = renderHook(() => useTodoContext(), { wrapper });

      expect(result.current.filters.tags).toEqual([]);
      expect(result.current.filters.categories).toEqual([]);
      expect(result.current.filters.priorities).toEqual([]);
      expect(result.current.filters.completionStatus).toBe('all');
    });

    it('should provide initial sort state', () => {
      const { result } = renderHook(() => useTodoContext(), { wrapper });

      expect(result.current.sort.criterion).toBeNull();
      expect(result.current.sort.direction).toBe('asc');
    });

    it('should provide dispatch function', () => {
      const { result } = renderHook(() => useTodoContext(), { wrapper });

      expect(result.current.dispatch).toBeDefined();
      expect(typeof result.current.dispatch).toBe('function');
    });
  });

  describe('CREATE_TODO action', () => {
    it('should create a new todo', () => {
      const { result } = renderHook(() => useTodoContext(), { wrapper });

      const input: CreateTodoInput = {
        title: 'Test Todo',
        description: 'Test description',
      };

      act(() => {
        result.current.dispatch({ type: 'CREATE_TODO', payload: input });
      });

      expect(result.current.todos.length).toBe(1);
      expect(result.current.todos[0].title).toBe('Test Todo');
    });

    it('should create multiple todos', () => {
      const { result } = renderHook(() => useTodoContext(), { wrapper });

      act(() => {
        result.current.dispatch({ type: 'CREATE_TODO', payload: { title: 'Todo 1' } });
        result.current.dispatch({ type: 'CREATE_TODO', payload: { title: 'Todo 2' } });
      });

      expect(result.current.todos.length).toBe(2);
    });
  });

  describe('UPDATE_TODO action', () => {
    it('should update existing todo', () => {
      const { result } = renderHook(() => useTodoContext(), { wrapper });

      act(() => {
        result.current.dispatch({ type: 'CREATE_TODO', payload: { title: 'Original' } });
      });

      const todoId = result.current.todos[0].id;

      act(() => {
        result.current.dispatch({
          type: 'UPDATE_TODO',
          payload: { id: todoId, title: 'Updated' },
        });
      });

      expect(result.current.todos[0].title).toBe('Updated');
    });
  });

  describe('DELETE_TODO action', () => {
    it('should soft delete todo', () => {
      const { result } = renderHook(() => useTodoContext(), { wrapper });

      act(() => {
        result.current.dispatch({ type: 'CREATE_TODO', payload: { title: 'To delete' } });
      });

      const todoId = result.current.todos[0].id;

      act(() => {
        result.current.dispatch({ type: 'DELETE_TODO', payload: { id: todoId } });
      });

      expect(result.current.todos[0].isDeleted).toBe(true);
    });
  });

  describe('TOGGLE_COMPLETE action', () => {
    it('should toggle todo completion status', () => {
      const { result } = renderHook(() => useTodoContext(), { wrapper });

      act(() => {
        result.current.dispatch({ type: 'CREATE_TODO', payload: { title: 'Test' } });
      });

      const todoId = result.current.todos[0].id;

      act(() => {
        result.current.dispatch({ type: 'TOGGLE_COMPLETE', payload: { id: todoId } });
      });

      expect(result.current.todos[0].isCompleted).toBe(true);

      act(() => {
        result.current.dispatch({ type: 'TOGGLE_COMPLETE', payload: { id: todoId } });
      });

      expect(result.current.todos[0].isCompleted).toBe(false);
    });
  });

  describe('Filter actions', () => {
    it('should update filters', () => {
      const { result } = renderHook(() => useTodoContext(), { wrapper });

      act(() => {
        result.current.dispatch({
          type: 'SET_FILTER',
          payload: { tags: ['tag-1'], completionStatus: 'completed' },
        });
      });

      expect(result.current.filters.tags).toEqual(['tag-1']);
      expect(result.current.filters.completionStatus).toBe('completed');
    });

    it('should clear filters', () => {
      const { result } = renderHook(() => useTodoContext(), { wrapper });

      act(() => {
        result.current.dispatch({
          type: 'SET_FILTER',
          payload: { tags: ['tag-1'], priorities: ['high'] },
        });
      });

      act(() => {
        result.current.dispatch({ type: 'CLEAR_FILTERS' });
      });

      expect(result.current.filters.tags).toEqual([]);
      expect(result.current.filters.priorities).toEqual([]);
      expect(result.current.filters.completionStatus).toBe('all');
    });
  });

  describe('Sort actions', () => {
    it('should update sort settings', () => {
      const { result } = renderHook(() => useTodoContext(), { wrapper });

      act(() => {
        result.current.dispatch({
          type: 'SET_SORT',
          payload: { criterion: 'priority', direction: 'desc' },
        });
      });

      expect(result.current.sort.criterion).toBe('priority');
      expect(result.current.sort.direction).toBe('desc');
    });
  });

  describe('Tag and Category management', () => {
    it('should create tags', () => {
      const { result } = renderHook(() => useTodoContext(), { wrapper });

      act(() => {
        result.current.dispatch({ type: 'CREATE_TAG', payload: { name: 'work' } });
      });

      expect(result.current.tags.length).toBe(1);
      expect(result.current.tags[0].name).toBe('work');
    });

    it('should create categories', () => {
      const { result } = renderHook(() => useTodoContext(), { wrapper });

      act(() => {
        result.current.dispatch({ type: 'CREATE_CATEGORY', payload: { name: 'Personal' } });
      });

      expect(result.current.categories.length).toBe(1);
      expect(result.current.categories[0].name).toBe('Personal');
    });

    it('should delete tags', () => {
      const { result } = renderHook(() => useTodoContext(), { wrapper });

      act(() => {
        result.current.dispatch({ type: 'CREATE_TAG', payload: { name: 'work' } });
      });

      const tagId = result.current.tags[0].id;

      act(() => {
        result.current.dispatch({ type: 'DELETE_TAG', payload: { id: tagId } });
      });

      expect(result.current.tags.length).toBe(0);
    });

    it('should delete categories', () => {
      const { result } = renderHook(() => useTodoContext(), { wrapper });

      act(() => {
        result.current.dispatch({ type: 'CREATE_CATEGORY', payload: { name: 'Personal' } });
      });

      const categoryId = result.current.categories[0].id;

      act(() => {
        result.current.dispatch({ type: 'DELETE_CATEGORY', payload: { id: categoryId } });
      });

      expect(result.current.categories.length).toBe(0);
    });
  });

  describe('Context error handling', () => {
    it('should throw error when useTodoContext used outside provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useTodoContext());
      }).toThrow('useTodoContext must be used within TodoProvider');

      consoleSpy.mockRestore();
    });
  });
});
