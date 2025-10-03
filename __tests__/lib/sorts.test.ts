/**
 * Sort Functions Tests - Client-Side Todo List Application
 *
 * Tests for sorting utilities following TDD approach
 * Per user preference: No try-catch, no if-else, deterministic tests
 */

import { sortByPriority, sortByScheduledDate, sortByCreatedDate } from '../../lib/sorts';
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

describe('sortByPriority', () => {
  it('should sort todos by priority ascending (low -> medium -> high)', () => {
    const todos = [
      createTodo({ id: '1', priority: 'high' }),
      createTodo({ id: '2', priority: 'low' }),
      createTodo({ id: '3', priority: 'medium' }),
    ];

    const result = sortByPriority(todos, 'asc');

    expect(result.map((t) => t.id)).toEqual(['2', '3', '1']);
    expect(result.map((t) => t.priority)).toEqual(['low', 'medium', 'high']);
  });

  it('should sort todos by priority descending (high -> medium -> low)', () => {
    const todos = [
      createTodo({ id: '1', priority: 'low' }),
      createTodo({ id: '2', priority: 'high' }),
      createTodo({ id: '3', priority: 'medium' }),
    ];

    const result = sortByPriority(todos, 'desc');

    expect(result.map((t) => t.id)).toEqual(['2', '3', '1']);
    expect(result.map((t) => t.priority)).toEqual(['high', 'medium', 'low']);
  });

  it('should maintain relative order for todos with same priority', () => {
    const todos = [
      createTodo({ id: '1', priority: 'medium' }),
      createTodo({ id: '2', priority: 'medium' }),
      createTodo({ id: '3', priority: 'medium' }),
    ];

    const result = sortByPriority(todos, 'asc');

    expect(result.map((t) => t.id)).toEqual(['1', '2', '3']);
  });

  it('should not mutate original array', () => {
    const todos = [
      createTodo({ id: '1', priority: 'high' }),
      createTodo({ id: '2', priority: 'low' }),
    ];

    const original = [...todos];
    const result = sortByPriority(todos, 'asc');

    expect(todos).toEqual(original);
    expect(result).not.toBe(todos);
  });
});

describe('sortByScheduledDate', () => {
  it('should sort todos by scheduled date ascending', () => {
    const todos = [
      createTodo({ id: '1', scheduledAt: '2025-10-15T10:00:00.000Z' }),
      createTodo({ id: '2', scheduledAt: '2025-10-05T10:00:00.000Z' }),
      createTodo({ id: '3', scheduledAt: '2025-10-10T10:00:00.000Z' }),
    ];

    const result = sortByScheduledDate(todos, 'asc');

    expect(result.map((t) => t.id)).toEqual(['2', '3', '1']);
  });

  it('should sort todos by scheduled date descending', () => {
    const todos = [
      createTodo({ id: '1', scheduledAt: '2025-10-05T10:00:00.000Z' }),
      createTodo({ id: '2', scheduledAt: '2025-10-15T10:00:00.000Z' }),
      createTodo({ id: '3', scheduledAt: '2025-10-10T10:00:00.000Z' }),
    ];

    const result = sortByScheduledDate(todos, 'desc');

    expect(result.map((t) => t.id)).toEqual(['2', '3', '1']);
  });

  it('should place todos without scheduled date at the end for ascending', () => {
    const todos = [
      createTodo({ id: '1', scheduledAt: null }),
      createTodo({ id: '2', scheduledAt: '2025-10-05T10:00:00.000Z' }),
      createTodo({ id: '3', scheduledAt: null }),
    ];

    const result = sortByScheduledDate(todos, 'asc');

    expect(result[0].id).toBe('2');
    expect([result[1].id, result[2].id]).toContain('1');
    expect([result[1].id, result[2].id]).toContain('3');
  });

  it('should place todos without scheduled date at the end for descending', () => {
    const todos = [
      createTodo({ id: '1', scheduledAt: '2025-10-05T10:00:00.000Z' }),
      createTodo({ id: '2', scheduledAt: null }),
      createTodo({ id: '3', scheduledAt: '2025-10-10T10:00:00.000Z' }),
    ];

    const result = sortByScheduledDate(todos, 'desc');

    expect(result[0].id).toBe('3');
    expect(result[1].id).toBe('1');
    expect(result[2].id).toBe('2');
  });

  it('should handle todos with no scheduled dates', () => {
    const todos = [
      createTodo({ id: '1', scheduledAt: null }),
      createTodo({ id: '2', scheduledAt: null }),
    ];

    const result = sortByScheduledDate(todos, 'asc');

    expect(result.length).toBe(2);
  });

  it('should not mutate original array', () => {
    const todos = [
      createTodo({ id: '1', scheduledAt: '2025-10-15T10:00:00.000Z' }),
      createTodo({ id: '2', scheduledAt: '2025-10-05T10:00:00.000Z' }),
    ];

    const original = [...todos];
    const result = sortByScheduledDate(todos, 'asc');

    expect(todos).toEqual(original);
    expect(result).not.toBe(todos);
  });
});

describe('sortByCreatedDate', () => {
  it('should sort todos by creation date ascending (oldest first)', () => {
    const todos = [
      createTodo({ id: '1', createdAt: '2025-10-03T12:00:00.000Z' }),
      createTodo({ id: '2', createdAt: '2025-10-01T10:00:00.000Z' }),
      createTodo({ id: '3', createdAt: '2025-10-02T11:00:00.000Z' }),
    ];

    const result = sortByCreatedDate(todos, 'asc');

    expect(result.map((t) => t.id)).toEqual(['2', '3', '1']);
  });

  it('should sort todos by creation date descending (newest first)', () => {
    const todos = [
      createTodo({ id: '1', createdAt: '2025-10-01T10:00:00.000Z' }),
      createTodo({ id: '2', createdAt: '2025-10-03T12:00:00.000Z' }),
      createTodo({ id: '3', createdAt: '2025-10-02T11:00:00.000Z' }),
    ];

    const result = sortByCreatedDate(todos, 'desc');

    expect(result.map((t) => t.id)).toEqual(['2', '3', '1']);
  });

  it('should handle todos created at same time', () => {
    const todos = [
      createTodo({ id: '1', createdAt: '2025-10-03T10:00:00.000Z' }),
      createTodo({ id: '2', createdAt: '2025-10-03T10:00:00.000Z' }),
    ];

    const result = sortByCreatedDate(todos, 'asc');

    expect(result.length).toBe(2);
  });

  it('should handle millisecond precision', () => {
    const todos = [
      createTodo({ id: '1', createdAt: '2025-10-03T10:00:00.100Z' }),
      createTodo({ id: '2', createdAt: '2025-10-03T10:00:00.050Z' }),
      createTodo({ id: '3', createdAt: '2025-10-03T10:00:00.200Z' }),
    ];

    const result = sortByCreatedDate(todos, 'asc');

    expect(result.map((t) => t.id)).toEqual(['2', '1', '3']);
  });

  it('should not mutate original array', () => {
    const todos = [
      createTodo({ id: '1', createdAt: '2025-10-03T12:00:00.000Z' }),
      createTodo({ id: '2', createdAt: '2025-10-01T10:00:00.000Z' }),
    ];

    const original = [...todos];
    const result = sortByCreatedDate(todos, 'asc');

    expect(todos).toEqual(original);
    expect(result).not.toBe(todos);
  });
});
