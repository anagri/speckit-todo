/**
 * TodoItem Component - Display Individual Todo
 */

import React from 'react';
import { Todo } from '../lib/types';
import { useTodoContext } from '../lib/TodoContext';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { Pencil, Trash2, RotateCcw } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

export function TodoItem({ todo, onEdit }: TodoItemProps) {
  const { dispatch, tags, categories } = useTodoContext();

  const handleToggleComplete = () => {
    dispatch({ type: 'TOGGLE_COMPLETE', payload: { id: todo.id } });
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_TODO', payload: { id: todo.id } });
  };

  const handleRestore = () => {
    dispatch({ type: 'RESTORE_TODO', payload: { id: todo.id } });
  };

  const category = categories.find((c) => c.id === todo.categoryId);
  const todoTags = tags.filter((t) => todo.tagIds.includes(t.id));

  const formatDate = (isoString: string | null) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const priorityColors = {
    low: 'bg-blue-50 text-blue-700 border-blue-200',
    medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    high: 'bg-red-50 text-red-700 border-red-200',
  };

  if (todo.isDeleted) {
    return (
      <div
        className="p-4 bg-gray-50 border border-gray-200 rounded-lg opacity-60"
        data-testid={`todo-item-${todo.id}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-medium line-through text-gray-500">
              {todo.title}
            </h3>
            {todo.description && (
              <p className="text-sm text-gray-400 mt-1">{todo.description}</p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              Deleted {formatDate(todo.deletedAt)}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRestore}
            data-testid={`todo-restore-${todo.id}`}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Restore
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow ${
        todo.isCompleted ? 'bg-gray-50' : ''
      }`}
      data-testid={`todo-item-${todo.id}`}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={todo.isCompleted}
          onCheckedChange={handleToggleComplete}
          data-testid={`todo-checkbox-${todo.id}`}
          className="mt-1"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`text-lg font-medium ${
                todo.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {todo.title}
            </h3>

            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(todo)}
                data-testid={`todo-edit-${todo.id}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDelete}
                data-testid={`todo-delete-${todo.id}`}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>

          {todo.description && (
            <p
              className={`text-sm mt-2 ${
                todo.isCompleted ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {todo.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge
              variant="outline"
              className={priorityColors[todo.priority]}
              data-testid={`todo-priority-${todo.id}`}
            >
              {todo.priority}
            </Badge>

            {category && (
              <Badge variant="outline" data-testid={`todo-category-${todo.id}`}>
                {category.name}
              </Badge>
            )}

            {todo.scheduledAt && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                {formatDate(todo.scheduledAt)}
              </Badge>
            )}

            {todoTags.map((tag) => (
              <Badge
                key={tag.id}
                className={tag.color}
                data-testid={`todo-tag-${tag.name}`}
              >
                {tag.name}
              </Badge>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-2">
            Created {formatDate(todo.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
