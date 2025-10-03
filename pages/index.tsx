/**
 * Main Todo Application Page
 */

import React, { useState } from 'react';
import Head from 'next/head';
import { useTodoContext } from '../lib/TodoContext';
import { getVisibleTodos } from '../lib/selectors';
import { TodoForm } from '../components/TodoForm';
import { TodoList } from '../components/TodoList';
import { TodoFilters } from '../components/TodoFilters';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';
import { Todo } from '../lib/types';

export default function Home() {
  const { todos, filters, sort } = useTodoContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const visibleTodos = getVisibleTodos(todos, filters, sort);

  const handleOpenCreate = () => {
    setEditingTodo(null);
    setIsFormOpen(true);
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTodo(null);
  };

  const activeTodosCount = todos.filter(
    (t) => !t.isDeleted && !t.isCompleted
  ).length;
  const completedTodosCount = todos.filter(
    (t) => !t.isDeleted && t.isCompleted
  ).length;

  return (
    <>
      <Head>
        <title>Todo List Application</title>
        <meta name="description" content="Manage your todos efficiently" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">My Todos</h1>
                <p className="text-gray-600 mt-2">
                  {activeTodosCount} active, {completedTodosCount} completed
                </p>
              </div>
              <Button
                onClick={handleOpenCreate}
                size="lg"
                data-testid="create-todo-btn"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Todo
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Filters */}
            <aside className="lg:col-span-1">
              <div className="sticky top-4">
                <TodoFilters />
              </div>
            </aside>

            {/* Main Content - Todo List */}
            <main className="lg:col-span-3">
              {todos.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed">
                  <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                    Welcome to Your Todo List!
                  </h2>
                  <p className="text-gray-500 mb-6">
                    Get started by creating your first todo
                  </p>
                  <Button onClick={handleOpenCreate} size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Todo
                  </Button>
                </div>
              ) : (
                <TodoList todos={visibleTodos} onEdit={handleEdit} />
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Todo Form Dialog */}
      <TodoForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        editTodo={editingTodo}
      />
    </>
  );
}
