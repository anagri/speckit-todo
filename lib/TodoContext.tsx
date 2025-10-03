/**
 * TodoContext - Client-Side Todo List Application
 *
 * React Context for global state management
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { TodoContextValue } from './types';
import { todoReducer, initialState } from './todoReducer';
import { storage } from './storage';

/**
 * Todo Context
 * Provides global access to todos, tags, categories, filters, and sort state
 */
const TodoContext = createContext<TodoContextValue | undefined>(undefined);

/**
 * Todo Provider Component
 * Wraps the application and provides todo state management
 */
export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      const data = storage.loadData();
      dispatch({ type: 'LOAD_DATA', payload: data });
    };

    loadData();
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    const saveData = () => {
      const data = {
        version: '1.0.0',
        todos: state.todos,
        tags: state.tags,
        categories: state.categories,
      };

      storage.saveData(data);
    };

    // Only save if we have loaded data (avoid saving initial empty state)
    if (state.todos.length > 0 || state.tags.length > 0 || state.categories.length > 0) {
      saveData();
    }
  }, [state.todos, state.tags, state.categories]);

  const value: TodoContextValue = {
    ...state,
    dispatch,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

/**
 * Custom hook to use TodoContext
 * Throws error if used outside of TodoProvider
 */
export function useTodoContext(): TodoContextValue {
  const context = useContext(TodoContext);

  if (context === undefined) {
    throw new Error('useTodoContext must be used within TodoProvider');
  }

  return context;
}
