/**
 * TodoFilters Component - Filter and Sort Controls
 */

import React from 'react';
import { useTodoContext } from '../lib/TodoContext';
import { Priority, SortCriterion } from '../lib/types';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';

export function TodoFilters() {
  const { tags, categories, filters, sort, dispatch } = useTodoContext();

  const handleToggleTag = (tagId: string) => {
    const newTags = filters.tags.includes(tagId)
      ? filters.tags.filter((id) => id !== tagId)
      : [...filters.tags, tagId];

    dispatch({ type: 'SET_FILTER', payload: { tags: newTags } });
  };

  const handleToggleCategory = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((id) => id !== categoryId)
      : [...filters.categories, categoryId];

    dispatch({ type: 'SET_FILTER', payload: { categories: newCategories } });
  };

  const handleTogglePriority = (priority: Priority) => {
    const newPriorities = filters.priorities.includes(priority)
      ? filters.priorities.filter((p) => p !== priority)
      : [...filters.priorities, priority];

    dispatch({ type: 'SET_FILTER', payload: { priorities: newPriorities } });
  };

  const handleCompletionStatusChange = (
    status: 'all' | 'active' | 'completed'
  ) => {
    dispatch({ type: 'SET_FILTER', payload: { completionStatus: status } });
  };

  const handleSortChange = (criterion: string) => {
    dispatch({
      type: 'SET_SORT',
      payload: {
        criterion: criterion as SortCriterion,
        direction: sort.direction,
      },
    });
  };

  const handleSortDirectionToggle = () => {
    dispatch({
      type: 'SET_SORT',
      payload: {
        criterion: sort.criterion,
        direction: sort.direction === 'asc' ? 'desc' : 'asc',
      },
    });
  };

  const handleClearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const hasActiveFilters =
    filters.tags.length > 0 ||
    filters.categories.length > 0 ||
    filters.priorities.length > 0 ||
    filters.completionStatus !== 'all';

  return (
    <div className="bg-white p-4 rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters & Sort</h3>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            data-testid="clear-filters-btn"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Completion Status */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select
          value={filters.completionStatus}
          onValueChange={handleCompletionStatusChange}
        >
          <SelectTrigger data-testid="status-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Priority Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Priority</label>
        <div className="flex flex-wrap gap-2">
          {(['low', 'medium', 'high'] as Priority[]).map((priority) => (
            <button
              key={priority}
              type="button"
              onClick={() => handleTogglePriority(priority)}
              className={`px-3 py-1 rounded text-sm border transition-colors ${
                filters.priorities.includes(priority)
                  ? 'bg-blue-500 text-white border-blue-600'
                  : 'bg-gray-100 text-gray-700 border-gray-300'
              }`}
              data-testid={`priority-filter-${priority}`}
            >
              {priority}
            </button>
          ))}
        </div>
      </div>

      {/* Tag Filter */}
      {tags.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleToggleTag(tag.id)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.tags.includes(tag.id)
                    ? tag.color
                    : 'bg-gray-100 text-gray-600'
                }`}
                data-testid={`tag-filter-${tag.name}`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Categories</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleToggleCategory(category.id)}
                className={`px-3 py-1 rounded text-sm border transition-colors ${
                  filters.categories.includes(category.id)
                    ? 'bg-green-500 text-white border-green-600'
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                }`}
                data-testid={`category-filter-${category.name}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sort Controls */}
      <div className="space-y-2 pt-4 border-t">
        <label className="text-sm font-medium">Sort By</label>
        <div className="flex gap-2">
          <Select
            value={sort.criterion || undefined}
            onValueChange={handleSortChange}
          >
            <SelectTrigger data-testid="sort-criterion" className="flex-1">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="scheduledAt">Scheduled Date</SelectItem>
              <SelectItem value="createdAt">Created Date</SelectItem>
            </SelectContent>
          </Select>

          {sort.criterion && (
            <Button
              variant="outline"
              onClick={handleSortDirectionToggle}
              data-testid="sort-direction-btn"
            >
              {sort.direction === 'asc' ? '↑' : '↓'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
