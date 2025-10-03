/**
 * Type Definitions Contract - Client-Side Todo List Application
 *
 * This file serves as the contract for all data structures used in the application.
 * All components and services must adhere to these type definitions.
 */

// ============================================================================
// Core Enums and Types
// ============================================================================

export type Priority = 'low' | 'medium' | 'high';

export type TodoStatus = 'active' | 'completed' | 'deleted';

export type SortCriterion = 'priority' | 'scheduledAt' | 'createdAt' | null;

export type SortDirection = 'asc' | 'desc';

// ============================================================================
// Core Entities
// ============================================================================

/**
 * Todo Entity
 * Represents a task or item the user wants to track
 */
export interface Todo {
  /** Unique identifier (UUID v4) */
  id: string;

  /** Task title (required, max 512 characters) */
  title: string;

  /** Task description (optional, max 5000 characters) */
  description: string;

  /** Completion status */
  isCompleted: boolean;

  /** Soft deletion flag */
  isDeleted: boolean;

  /** Scheduled due date and time (ISO 8601 format) */
  scheduledAt: string | null;

  /** Foreign key to Category (nullable) */
  categoryId: string | null;

  /** Priority level (low, medium, high) */
  priority: Priority;

  /** Array of Tag IDs */
  tagIds: string[];

  /** Creation timestamp (ISO 8601, immutable) */
  createdAt: string;

  /** Last update timestamp (ISO 8601) */
  updatedAt: string;

  /** Deletion timestamp (ISO 8601, set when isDeleted=true) */
  deletedAt: string | null;
}

/**
 * Tag Entity
 * Flexible label that can be applied to multiple todos
 */
export interface Tag {
  /** Unique identifier (UUID v4) */
  id: string;

  /** Tag name (unique, case-insensitive) */
  name: string;

  /** Tailwind CSS color classes for display */
  color: string;

  /** Creation timestamp (ISO 8601) */
  createdAt: string;
}

/**
 * Category Entity
 * Single classification for grouping related todos (flat structure)
 */
export interface Category {
  /** Unique identifier (UUID v4) */
  id: string;

  /** Category name (unique, case-insensitive) */
  name: string;

  /** Creation timestamp (ISO 8601) */
  createdAt: string;
}

// ============================================================================
// Input/Output Types
// ============================================================================

/**
 * Input for creating a new todo
 * Omits auto-generated fields (id, createdAt, updatedAt)
 */
export interface CreateTodoInput {
  title: string;
  description?: string;
  scheduledAt?: string | null;
  categoryId?: string | null;
  priority?: Priority;
  tagIds?: string[];
}

/**
 * Input for updating an existing todo
 * All fields are optional except id
 */
export interface UpdateTodoInput {
  id: string;
  title?: string;
  description?: string;
  scheduledAt?: string | null;
  categoryId?: string | null;
  priority?: Priority;
  tagIds?: string[];
  isCompleted?: boolean;
}

/**
 * Input for creating a new tag
 */
export interface CreateTagInput {
  name: string;
}

/**
 * Input for creating a new category
 */
export interface CreateCategoryInput {
  name: string;
}

// ============================================================================
// Filter and Sort State
// ============================================================================

/**
 * Filter state for todos
 * All filters are combined with AND logic
 */
export interface FilterState {
  /** Selected tag IDs (OR logic within tags) */
  tags: string[];

  /** Selected category IDs (OR logic within categories) */
  categories: string[];

  /** Selected priorities (OR logic within priorities) */
  priorities: Priority[];

  /** Date range filter (inclusive) */
  dateRange?: {
    start: string; // ISO 8601
    end: string;   // ISO 8601
  };

  /** Completion status filter */
  completionStatus: 'all' | 'active' | 'completed';
}

/**
 * Sort state for todos
 * Only one sort criterion active at a time (per FR-018)
 */
export interface SortState {
  criterion: SortCriterion;
  direction: SortDirection;
}

// ============================================================================
// Storage Schema
// ============================================================================

/**
 * Complete application data structure
 * Stored in browser Local Storage as JSON
 */
export interface AppData {
  /** Schema version for future migrations */
  version: string;

  /** All todos (active, completed, and soft-deleted) */
  todos: Todo[];

  /** All tags */
  tags: Tag[];

  /** All categories */
  categories: Category[];
}

// ============================================================================
// Action Types (for useReducer)
// ============================================================================

export type TodoAction =
  | { type: 'CREATE_TODO'; payload: CreateTodoInput }
  | { type: 'UPDATE_TODO'; payload: UpdateTodoInput }
  | { type: 'DELETE_TODO'; payload: { id: string } }
  | { type: 'RESTORE_TODO'; payload: { id: string } }
  | { type: 'TOGGLE_COMPLETE'; payload: { id: string } }
  | { type: 'CREATE_TAG'; payload: CreateTagInput }
  | { type: 'DELETE_TAG'; payload: { id: string } }
  | { type: 'CREATE_CATEGORY'; payload: CreateCategoryInput }
  | { type: 'DELETE_CATEGORY'; payload: { id: string } }
  | { type: 'SET_FILTER'; payload: Partial<FilterState> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_SORT'; payload: SortState }
  | { type: 'LOAD_DATA'; payload: AppData };

// ============================================================================
// Context Types
// ============================================================================

/**
 * Todo context state
 * Provides global access to todos, tags, categories, filters, and sort state
 */
export interface TodoContextState {
  todos: Todo[];
  tags: Tag[];
  categories: Category[];
  filters: FilterState;
  sort: SortState;
}

/**
 * Todo context value
 * Includes state and dispatch function
 */
export interface TodoContextValue extends TodoContextState {
  dispatch: React.Dispatch<TodoAction>;
}

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Validation error for form inputs
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Result of validation
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
