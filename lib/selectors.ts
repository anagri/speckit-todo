/**
 * Selectors - Client-Side Todo List Application
 *
 * Derived state selectors that combine filters and sorting
 */

import { Todo, FilterState, SortState } from './types';
import {
  filterByTags,
  filterByCategories,
  filterByPriorities,
  filterByDateRange,
  filterByCompletion,
} from './filters';
import { sortByPriority, sortByScheduledDate, sortByCreatedDate } from './sorts';

/**
 * Get visible todos based on current filters and sort settings
 * Applies all filters (AND logic between different filter types)
 * Then applies sort if a criterion is selected
 *
 * @param todos - All todos
 * @param filters - Current filter state
 * @param sort - Current sort state
 * @returns Filtered and sorted todos
 */
export function getVisibleTodos(
  todos: Todo[],
  filters: FilterState,
  sort: SortState
): Todo[] {
  let result = todos;

  // Apply completion status filter
  result = filterByCompletion(result, filters.completionStatus);

  // Apply tag filter
  if (filters.tags.length > 0) {
    result = filterByTags(result, filters.tags);
  }

  // Apply category filter
  if (filters.categories.length > 0) {
    result = filterByCategories(result, filters.categories);
  }

  // Apply priority filter
  if (filters.priorities.length > 0) {
    result = filterByPriorities(result, filters.priorities);
  }

  // Apply date range filter
  if (filters.dateRange) {
    result = filterByDateRange(result, filters.dateRange.start, filters.dateRange.end);
  }

  // Apply sort (single criterion only per FR-018)
  if (sort.criterion === 'priority') {
    result = sortByPriority(result, sort.direction);
  } else if (sort.criterion === 'scheduledAt') {
    result = sortByScheduledDate(result, sort.direction);
  } else if (sort.criterion === 'createdAt') {
    result = sortByCreatedDate(result, sort.direction);
  }

  return result;
}

/**
 * Get deleted todos only
 * Used for "Trash" or "Deleted" view
 */
export function getDeletedTodos(todos: Todo[]): Todo[] {
  return todos.filter((todo) => todo.isDeleted);
}

/**
 * Get active (non-deleted, non-completed) todos count
 */
export function getActiveTodosCount(todos: Todo[]): number {
  return todos.filter((todo) => !todo.isDeleted && !todo.isCompleted).length;
}

/**
 * Get completed (non-deleted) todos count
 */
export function getCompletedTodosCount(todos: Todo[]): number {
  return todos.filter((todo) => !todo.isDeleted && todo.isCompleted).length;
}
