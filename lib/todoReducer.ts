/**
 * Todo Reducer - Client-Side Todo List Application
 *
 * State management reducer for todos, tags, categories, filters, and sort
 */

import { TodoContextState, TodoAction, Todo, Tag, Category } from './types';
import { getTagColor } from './utils';

/**
 * Initial state for the todo application
 */
export const initialState: TodoContextState = {
  todos: [],
  tags: [],
  categories: [],
  filters: {
    tags: [],
    categories: [],
    priorities: [],
    completionStatus: 'all',
  },
  sort: {
    criterion: null,
    direction: 'asc',
  },
};

/**
 * Todo reducer function
 * Handles all state mutations for the application
 */
export function todoReducer(
  state: TodoContextState,
  action: TodoAction
): TodoContextState {
  switch (action.type) {
    case 'CREATE_TODO': {
      const now = new Date().toISOString();
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        title: action.payload.title,
        description: action.payload.description ?? '',
        isCompleted: false,
        isDeleted: false,
        scheduledAt: action.payload.scheduledAt ?? null,
        categoryId: action.payload.categoryId ?? null,
        priority: action.payload.priority ?? 'medium',
        tagIds: action.payload.tagIds ?? [],
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      };

      return {
        ...state,
        todos: [...state.todos, newTodo],
      };
    }

    case 'UPDATE_TODO': {
      const now = new Date().toISOString();

      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? {
                ...todo,
                ...action.payload,
                id: todo.id, // Prevent ID change
                createdAt: todo.createdAt, // Keep original createdAt
                updatedAt: now, // Update timestamp
              }
            : todo
        ),
      };
    }

    case 'DELETE_TODO': {
      const now = new Date().toISOString();

      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? {
                ...todo,
                isDeleted: true,
                deletedAt: now,
                updatedAt: now,
              }
            : todo
        ),
      };
    }

    case 'RESTORE_TODO': {
      const now = new Date().toISOString();

      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? {
                ...todo,
                isDeleted: false,
                deletedAt: null,
                updatedAt: now,
              }
            : todo
        ),
      };
    }

    case 'TOGGLE_COMPLETE': {
      const now = new Date().toISOString();

      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? {
                ...todo,
                isCompleted: !todo.isCompleted,
                updatedAt: now,
              }
            : todo
        ),
      };
    }

    case 'CREATE_TAG': {
      const now = new Date().toISOString();
      const newTag: Tag = {
        id: crypto.randomUUID(),
        name: action.payload.name,
        color: getTagColor(state.tags.length),
        createdAt: now,
      };

      return {
        ...state,
        tags: [...state.tags, newTag],
      };
    }

    case 'DELETE_TAG': {
      return {
        ...state,
        tags: state.tags.filter((tag) => tag.id !== action.payload.id),
        todos: state.todos.map((todo) => ({
          ...todo,
          tagIds: todo.tagIds.filter((tagId) => tagId !== action.payload.id),
        })),
      };
    }

    case 'CREATE_CATEGORY': {
      const now = new Date().toISOString();
      const newCategory: Category = {
        id: crypto.randomUUID(),
        name: action.payload.name,
        createdAt: now,
      };

      return {
        ...state,
        categories: [...state.categories, newCategory],
      };
    }

    case 'DELETE_CATEGORY': {
      return {
        ...state,
        categories: state.categories.filter(
          (category) => category.id !== action.payload.id
        ),
        todos: state.todos.map((todo) =>
          todo.categoryId === action.payload.id
            ? { ...todo, categoryId: null }
            : todo
        ),
      };
    }

    case 'SET_FILTER': {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    }

    case 'CLEAR_FILTERS': {
      return {
        ...state,
        filters: {
          tags: [],
          categories: [],
          priorities: [],
          completionStatus: 'all',
        },
      };
    }

    case 'SET_SORT': {
      return {
        ...state,
        sort: action.payload,
      };
    }

    case 'LOAD_DATA': {
      return {
        ...state,
        todos: action.payload.todos,
        tags: action.payload.tags,
        categories: action.payload.categories,
      };
    }

    default:
      return state;
  }
}
