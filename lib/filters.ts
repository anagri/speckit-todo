/**
 * Filter Functions - Client-Side Todo List Application
 *
 * Filtering utilities for todos
 */

import { Todo, Priority } from './types';

/**
 * Filter todos by tags (OR logic within tags)
 * Returns todos that have at least one of the specified tags
 */
export function filterByTags(todos: Todo[], tagIds: string[]): Todo[] {
  if (tagIds.length === 0) {
    return todos;
  }

  return todos.filter((todo) => tagIds.some((tagId) => todo.tagIds.includes(tagId)));
}

/**
 * Filter todos by categories (OR logic within categories)
 * Returns todos that belong to one of the specified categories
 */
export function filterByCategories(todos: Todo[], categoryIds: string[]): Todo[] {
  if (categoryIds.length === 0) {
    return todos;
  }

  return todos.filter(
    (todo) => todo.categoryId && categoryIds.includes(todo.categoryId)
  );
}

/**
 * Filter todos by priorities (OR logic within priorities)
 * Returns todos that have one of the specified priorities
 */
export function filterByPriorities(todos: Todo[], priorities: Priority[]): Todo[] {
  if (priorities.length === 0) {
    return todos;
  }

  return todos.filter((todo) => priorities.includes(todo.priority));
}

/**
 * Filter todos by date range (inclusive)
 * Returns todos scheduled within the specified date range
 */
export function filterByDateRange(todos: Todo[], start: string, end: string): Todo[] {
  return todos.filter((todo) => {
    if (!todo.scheduledAt) {
      return false;
    }

    return todo.scheduledAt >= start && todo.scheduledAt <= end;
  });
}

/**
 * Filter todos by completion status
 * - 'all': All non-deleted todos
 * - 'active': Non-completed, non-deleted todos
 * - 'completed': Completed, non-deleted todos
 */
export function filterByCompletion(
  todos: Todo[],
  status: 'all' | 'active' | 'completed'
): Todo[] {
  if (status === 'all') {
    return todos.filter((todo) => !todo.isDeleted);
  }

  if (status === 'active') {
    return todos.filter((todo) => !todo.isCompleted && !todo.isDeleted);
  }

  if (status === 'completed') {
    return todos.filter((todo) => todo.isCompleted && !todo.isDeleted);
  }

  return todos;
}
