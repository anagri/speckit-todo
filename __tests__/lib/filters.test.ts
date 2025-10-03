/**
 * Filter Functions Tests - Client-Side Todo List Application
 *
 * Tests for filtering utilities following TDD approach
 * Per user preference: No try-catch, no if-else, deterministic tests
 */

import {
  filterByTags,
  filterByCategories,
  filterByPriorities,
  filterByDateRange,
  filterByCompletion,
} from '../../lib/filters';
import { Todo } from '../../lib/types';

const createTodo = (overrides: Partial<Todo>): Todo => ({
  id: 'test-id',
  title: 'Test Todo',
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
  ...overrides,
});

describe('filterByTags', () => {
  it('should return all todos when tag filter is empty', () => {
    const todos = [
      createTodo({ id: '1', tagIds: ['tag-1'] }),
      createTodo({ id: '2', tagIds: ['tag-2'] }),
    ];

    const result = filterByTags(todos, []);

    expect(result.length).toBe(2);
  });

  it('should filter todos by single tag', () => {
    const todos = [
      createTodo({ id: '1', tagIds: ['tag-1'] }),
      createTodo({ id: '2', tagIds: ['tag-2'] }),
      createTodo({ id: '3', tagIds: ['tag-1', 'tag-2'] }),
    ];

    const result = filterByTags(todos, ['tag-1']);

    expect(result.length).toBe(2);
    expect(result[0].id).toBe('1');
    expect(result[1].id).toBe('3');
  });

  it('should filter todos by multiple tags with OR logic', () => {
    const todos = [
      createTodo({ id: '1', tagIds: ['tag-1'] }),
      createTodo({ id: '2', tagIds: ['tag-2'] }),
      createTodo({ id: '3', tagIds: ['tag-3'] }),
    ];

    const result = filterByTags(todos, ['tag-1', 'tag-2']);

    expect(result.length).toBe(2);
    expect(result.map((t) => t.id)).toEqual(['1', '2']);
  });

  it('should return empty array when no todos match tags', () => {
    const todos = [createTodo({ id: '1', tagIds: ['tag-1'] })];

    const result = filterByTags(todos, ['tag-nonexistent']);

    expect(result.length).toBe(0);
  });

  it('should handle todos with no tags', () => {
    const todos = [
      createTodo({ id: '1', tagIds: [] }),
      createTodo({ id: '2', tagIds: ['tag-1'] }),
    ];

    const result = filterByTags(todos, ['tag-1']);

    expect(result.length).toBe(1);
    expect(result[0].id).toBe('2');
  });
});

describe('filterByCategories', () => {
  it('should return all todos when category filter is empty', () => {
    const todos = [
      createTodo({ id: '1', categoryId: 'cat-1' }),
      createTodo({ id: '2', categoryId: 'cat-2' }),
    ];

    const result = filterByCategories(todos, []);

    expect(result.length).toBe(2);
  });

  it('should filter todos by single category', () => {
    const todos = [
      createTodo({ id: '1', categoryId: 'cat-1' }),
      createTodo({ id: '2', categoryId: 'cat-2' }),
    ];

    const result = filterByCategories(todos, ['cat-1']);

    expect(result.length).toBe(1);
    expect(result[0].id).toBe('1');
  });

  it('should filter todos by multiple categories with OR logic', () => {
    const todos = [
      createTodo({ id: '1', categoryId: 'cat-1' }),
      createTodo({ id: '2', categoryId: 'cat-2' }),
      createTodo({ id: '3', categoryId: 'cat-3' }),
    ];

    const result = filterByCategories(todos, ['cat-1', 'cat-2']);

    expect(result.length).toBe(2);
    expect(result.map((t) => t.id)).toEqual(['1', '2']);
  });

  it('should exclude todos with no category when filtering', () => {
    const todos = [
      createTodo({ id: '1', categoryId: 'cat-1' }),
      createTodo({ id: '2', categoryId: null }),
    ];

    const result = filterByCategories(todos, ['cat-1']);

    expect(result.length).toBe(1);
    expect(result[0].id).toBe('1');
  });
});

describe('filterByPriorities', () => {
  it('should return all todos when priority filter is empty', () => {
    const todos = [
      createTodo({ id: '1', priority: 'high' }),
      createTodo({ id: '2', priority: 'low' }),
    ];

    const result = filterByPriorities(todos, []);

    expect(result.length).toBe(2);
  });

  it('should filter todos by single priority', () => {
    const todos = [
      createTodo({ id: '1', priority: 'high' }),
      createTodo({ id: '2', priority: 'medium' }),
      createTodo({ id: '3', priority: 'low' }),
    ];

    const result = filterByPriorities(todos, ['high']);

    expect(result.length).toBe(1);
    expect(result[0].id).toBe('1');
  });

  it('should filter todos by multiple priorities with OR logic', () => {
    const todos = [
      createTodo({ id: '1', priority: 'high' }),
      createTodo({ id: '2', priority: 'medium' }),
      createTodo({ id: '3', priority: 'low' }),
    ];

    const result = filterByPriorities(todos, ['high', 'low']);

    expect(result.length).toBe(2);
    expect(result.map((t) => t.id)).toEqual(['1', '3']);
  });
});

describe('filterByDateRange', () => {
  it('should filter todos within date range', () => {
    const todos = [
      createTodo({ id: '1', scheduledAt: '2025-10-05T10:00:00.000Z' }),
      createTodo({ id: '2', scheduledAt: '2025-10-10T10:00:00.000Z' }),
      createTodo({ id: '3', scheduledAt: '2025-10-15T10:00:00.000Z' }),
    ];

    const result = filterByDateRange(
      todos,
      '2025-10-05T00:00:00.000Z',
      '2025-10-10T23:59:59.999Z'
    );

    expect(result.length).toBe(2);
    expect(result.map((t) => t.id)).toEqual(['1', '2']);
  });

  it('should exclude todos without scheduled date', () => {
    const todos = [
      createTodo({ id: '1', scheduledAt: '2025-10-05T10:00:00.000Z' }),
      createTodo({ id: '2', scheduledAt: null }),
    ];

    const result = filterByDateRange(
      todos,
      '2025-10-01T00:00:00.000Z',
      '2025-10-31T23:59:59.999Z'
    );

    expect(result.length).toBe(1);
    expect(result[0].id).toBe('1');
  });

  it('should include todos on exact boundary dates', () => {
    const todos = [
      createTodo({ id: '1', scheduledAt: '2025-10-05T00:00:00.000Z' }),
      createTodo({ id: '2', scheduledAt: '2025-10-10T23:59:59.999Z' }),
    ];

    const result = filterByDateRange(
      todos,
      '2025-10-05T00:00:00.000Z',
      '2025-10-10T23:59:59.999Z'
    );

    expect(result.length).toBe(2);
  });

  it('should return empty array when no todos in range', () => {
    const todos = [createTodo({ id: '1', scheduledAt: '2025-10-01T10:00:00.000Z' })];

    const result = filterByDateRange(
      todos,
      '2025-11-01T00:00:00.000Z',
      '2025-11-30T23:59:59.999Z'
    );

    expect(result.length).toBe(0);
  });
});

describe('filterByCompletion', () => {
  it('should return all non-deleted todos when status is "all"', () => {
    const todos = [
      createTodo({ id: '1', isCompleted: false, isDeleted: false }),
      createTodo({ id: '2', isCompleted: true, isDeleted: false }),
      createTodo({ id: '3', isCompleted: false, isDeleted: true }),
    ];

    const result = filterByCompletion(todos, 'all');

    expect(result.length).toBe(2);
    expect(result.map((t) => t.id)).toEqual(['1', '2']);
  });

  it('should return only active todos when status is "active"', () => {
    const todos = [
      createTodo({ id: '1', isCompleted: false, isDeleted: false }),
      createTodo({ id: '2', isCompleted: true, isDeleted: false }),
      createTodo({ id: '3', isCompleted: false, isDeleted: true }),
    ];

    const result = filterByCompletion(todos, 'active');

    expect(result.length).toBe(1);
    expect(result[0].id).toBe('1');
  });

  it('should return only completed todos when status is "completed"', () => {
    const todos = [
      createTodo({ id: '1', isCompleted: false, isDeleted: false }),
      createTodo({ id: '2', isCompleted: true, isDeleted: false }),
      createTodo({ id: '3', isCompleted: true, isDeleted: true }),
    ];

    const result = filterByCompletion(todos, 'completed');

    expect(result.length).toBe(1);
    expect(result[0].id).toBe('2');
  });

  it('should always exclude deleted todos regardless of status filter', () => {
    const todos = [
      createTodo({ id: '1', isCompleted: false, isDeleted: true }),
      createTodo({ id: '2', isCompleted: true, isDeleted: true }),
    ];

    const allResult = filterByCompletion(todos, 'all');
    const activeResult = filterByCompletion(todos, 'active');
    const completedResult = filterByCompletion(todos, 'completed');

    expect(allResult.length).toBe(0);
    expect(activeResult.length).toBe(0);
    expect(completedResult.length).toBe(0);
  });
});
