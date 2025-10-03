/**
 * TodoList Component - Display List of Todos
 */

import React from 'react';
import { Todo } from '../lib/types';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onEdit: (todo: Todo) => void;
}

export function TodoList({ todos, onEdit }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div
        className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed"
        data-testid="todo-list-empty"
      >
        <p className="text-gray-500 text-lg">No todos found</p>
        <p className="text-gray-400 text-sm mt-2">
          Create your first todo to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onEdit={onEdit} />
      ))}
    </div>
  );
}
