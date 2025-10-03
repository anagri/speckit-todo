/**
 * Sort Functions - Client-Side Todo List Application
 *
 * Sorting utilities for todos
 */

import { Todo, SortDirection } from './types';

/**
 * Priority ordering for sorting
 * low = 0, medium = 1, high = 2
 */
const PRIORITY_ORDER: Record<'low' | 'medium' | 'high', number> = {
  low: 0,
  medium: 1,
  high: 2,
};

/**
 * Sort todos by priority
 * @param todos - Array of todos to sort
 * @param direction - 'asc' for low->high, 'desc' for high->low
 * @returns New sorted array (does not mutate original)
 */
export function sortByPriority(todos: Todo[], direction: SortDirection): Todo[] {
  return [...todos].sort((a, b) => {
    const orderA = PRIORITY_ORDER[a.priority];
    const orderB = PRIORITY_ORDER[b.priority];

    return direction === 'asc' ? orderA - orderB : orderB - orderA;
  });
}

/**
 * Sort todos by scheduled date
 * Todos without scheduled date are placed at the end
 * @param todos - Array of todos to sort
 * @param direction - 'asc' for earliest->latest, 'desc' for latest->earliest
 * @returns New sorted array (does not mutate original)
 */
export function sortByScheduledDate(todos: Todo[], direction: SortDirection): Todo[] {
  return [...todos].sort((a, b) => {
    // Handle todos without scheduled date (place at end)
    if (!a.scheduledAt && !b.scheduledAt) {
      return 0;
    }
    if (!a.scheduledAt) {
      return 1;
    }
    if (!b.scheduledAt) {
      return -1;
    }

    const comparison = a.scheduledAt.localeCompare(b.scheduledAt);
    return direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Sort todos by creation date
 * @param todos - Array of todos to sort
 * @param direction - 'asc' for oldest->newest, 'desc' for newest->oldest
 * @returns New sorted array (does not mutate original)
 */
export function sortByCreatedDate(todos: Todo[], direction: SortDirection): Todo[] {
  return [...todos].sort((a, b) => {
    const comparison = a.createdAt.localeCompare(b.createdAt);
    return direction === 'asc' ? comparison : -comparison;
  });
}
