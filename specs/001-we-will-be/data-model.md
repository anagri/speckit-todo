# Data Model: Client-Side Todo List Application

**Date**: 2025-10-02
**Feature**: 001-we-will-be

## Core Entities

### Todo

The central entity representing a task or item to be done.

**Fields**:
- `id: string` - Unique identifier (UUID v4)
- `title: string` - Required, max 512 characters (from FR-001, FR-026)
- `description: string` - Optional, max 5000 characters (from FR-002, FR-027)
- `isCompleted: boolean` - Completion status, default false (from FR-003)
- `isDeleted: boolean` - Soft deletion flag, default false (from FR-020)
- `scheduledAt: string | null` - ISO 8601 datetime for due date/time with minute granularity (from FR-004)
- `categoryId: string | null` - Foreign key to single Category (from FR-006)
- `priority: 'low' | 'medium' | 'high'` - Priority level, default 'medium' (from FR-007)
- `tagIds: string[]` - Array of Tag IDs, multiple allowed (from FR-005)
- `createdAt: string` - ISO 8601 timestamp, immutable (from FR-029)
- `updatedAt: string` - ISO 8601 timestamp, modified on edits (from FR-019)
- `deletedAt: string | null` - ISO 8601 timestamp when soft deleted (from FR-020)

**TypeScript Interface**:
```typescript
interface Todo {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isDeleted: boolean;
  scheduledAt: string | null;
  categoryId: string | null;
  priority: Priority;
  tagIds: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

type Priority = 'low' | 'medium' | 'high';
```

**Validation Rules**:
- `title`: Required, 1-512 characters
- `description`: Optional, 0-5000 characters
- `scheduledAt`: Must be valid ISO 8601 or null
- `priority`: Must be one of: 'low', 'medium', 'high'
- `createdAt`: Set once on creation, never modified
- `updatedAt`: Updated on any field edit
- `deletedAt`: Set when `isDeleted` becomes true

**State Transitions**:
```
[Create] → Active (isCompleted=false, isDeleted=false)
Active → Completed (isCompleted=true)
Completed → Active (isCompleted=false)
Active → Deleted (isDeleted=true, deletedAt=now)
Completed → Deleted (isDeleted=true, deletedAt=now)
Deleted → Active (isDeleted=false, deletedAt=null)
```

### Tag

A flexible label that can be applied to multiple todos for categorization.

**Fields**:
- `id: string` - Unique identifier (UUID v4)
- `name: string` - Unique tag name
- `color: string` - Tailwind CSS color classes (from FR-028)
- `createdAt: string` - ISO 8601 timestamp

**TypeScript Interface**:
```typescript
interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}
```

**Validation Rules**:
- `name`: Required, unique across all tags, 1-50 characters
- `color`: Must be valid Tailwind color class string (e.g., "bg-blue-100 text-blue-800")

**Business Rules**:
- Tag names are case-insensitive for uniqueness ("Work" and "work" are the same)
- Color is assigned from predefined pleasant palette on creation
- Tags can exist without being assigned to any todos

### Category

A single classification for grouping related todos within a flat (non-hierarchical) structure.

**Fields**:
- `id: string` - Unique identifier (UUID v4)
- `name: string` - Unique category name
- `createdAt: string` - ISO 8601 timestamp

**TypeScript Interface**:
```typescript
interface Category {
  id: string;
  name: string;
  createdAt: string;
}
```

**Validation Rules**:
- `name`: Required, unique across all categories, 1-100 characters
- Category names are case-insensitive for uniqueness

**Business Rules**:
- Categories are user-created (from FR-030)
- Flat structure - no subcategories or hierarchy (from FR-006)
- Each todo can have zero or one category (from FR-006)
- Categories can exist without being assigned to any todos

## Relationships

### Todo ↔ Tag (Many-to-Many)
- One Todo can have multiple Tags (via `todo.tagIds[]`)
- One Tag can be assigned to multiple Todos
- Implemented as array of tag IDs in Todo entity

### Todo ↔ Category (Many-to-One)
- One Todo can have zero or one Category (via `todo.categoryId`)
- One Category can be assigned to multiple Todos
- Implemented as nullable foreign key in Todo entity

## Storage Schema

All data stored in browser Local Storage as a single JSON object.

**Storage Key**: `todos_app_data_v1`

**Storage Structure**:
```typescript
interface AppData {
  todos: Todo[];
  tags: Tag[];
  categories: Category[];
  version: string; // Schema version for future migrations
}
```

**Example**:
```json
{
  "version": "1.0.0",
  "todos": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "isCompleted": false,
      "isDeleted": false,
      "scheduledAt": "2025-10-03T10:00:00.000Z",
      "categoryId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "priority": "high",
      "tagIds": ["tag-uuid-1", "tag-uuid-2"],
      "createdAt": "2025-10-02T14:30:00.000Z",
      "updatedAt": "2025-10-02T14:30:00.000Z",
      "deletedAt": null
    }
  ],
  "tags": [
    {
      "id": "tag-uuid-1",
      "name": "shopping",
      "color": "bg-blue-100 text-blue-800",
      "createdAt": "2025-10-02T14:00:00.000Z"
    }
  ],
  "categories": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Personal",
      "createdAt": "2025-10-02T14:00:00.000Z"
    }
  ]
}
```

## Data Operations

### CRUD Operations

**Create Todo**:
```typescript
function createTodo(input: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Todo {
  const now = new Date().toISOString();
  return {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
}
```

**Update Todo** (from FR-019):
```typescript
function updateTodo(id: string, changes: Partial<Todo>): Todo {
  const todo = findTodoById(id);
  return {
    ...todo,
    ...changes,
    id: todo.id, // Prevent ID change
    createdAt: todo.createdAt, // Immutable
    updatedAt: new Date().toISOString(),
  };
}
```

**Soft Delete Todo** (from FR-020):
```typescript
function softDeleteTodo(id: string): Todo {
  const todo = findTodoById(id);
  return {
    ...todo,
    isDeleted: true,
    deletedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
```

**Restore Deleted Todo** (from FR-021):
```typescript
function restoreTodo(id: string): Todo {
  const todo = findTodoById(id);
  return {
    ...todo,
    isDeleted: false,
    deletedAt: null,
    updatedAt: new Date().toISOString(),
  };
}
```

### Filter Operations

**Filter by Tags** (from FR-011):
```typescript
function filterByTags(todos: Todo[], tagIds: string[]): Todo[] {
  if (tagIds.length === 0) return todos;
  return todos.filter(todo =>
    tagIds.some(tagId => todo.tagIds.includes(tagId))
  );
}
```

**Filter by Categories** (from FR-012):
```typescript
function filterByCategories(todos: Todo[], categoryIds: string[]): Todo[] {
  if (categoryIds.length === 0) return todos;
  return todos.filter(todo =>
    todo.categoryId && categoryIds.includes(todo.categoryId)
  );
}
```

**Filter by Priority** (from FR-013):
```typescript
function filterByPriorities(todos: Todo[], priorities: Priority[]): Todo[] {
  if (priorities.length === 0) return todos;
  return todos.filter(todo => priorities.includes(todo.priority));
}
```

**Filter by Date Range** (from FR-014):
```typescript
function filterByDateRange(
  todos: Todo[],
  start: string,
  end: string
): Todo[] {
  return todos.filter(todo => {
    if (!todo.scheduledAt) return false;
    return todo.scheduledAt >= start && todo.scheduledAt <= end;
  });
}
```

**Filter by Completion Status** (from FR-010):
```typescript
function filterByCompletion(
  todos: Todo[],
  status: 'all' | 'active' | 'completed'
): Todo[] {
  if (status === 'all') return todos.filter(t => !t.isDeleted);
  if (status === 'active') return todos.filter(t => !t.isCompleted && !t.isDeleted);
  if (status === 'completed') return todos.filter(t => t.isCompleted && !t.isDeleted);
  return todos;
}
```

### Sort Operations

**Sort by Priority** (from FR-015):
```typescript
const PRIORITY_ORDER = { low: 0, medium: 1, high: 2 };

function sortByPriority(todos: Todo[], direction: 'asc' | 'desc'): Todo[] {
  return [...todos].sort((a, b) => {
    const orderA = PRIORITY_ORDER[a.priority];
    const orderB = PRIORITY_ORDER[b.priority];
    return direction === 'asc' ? orderA - orderB : orderB - orderA;
  });
}
```

**Sort by Scheduled Date** (from FR-016):
```typescript
function sortByScheduledDate(todos: Todo[], direction: 'asc' | 'desc'): Todo[] {
  return [...todos].sort((a, b) => {
    // Todos without scheduled date go to end (deferred to design phase)
    if (!a.scheduledAt && !b.scheduledAt) return 0;
    if (!a.scheduledAt) return 1;
    if (!b.scheduledAt) return -1;

    const comparison = a.scheduledAt.localeCompare(b.scheduledAt);
    return direction === 'asc' ? comparison : -comparison;
  });
}
```

**Sort by Creation Date** (from FR-017):
```typescript
function sortByCreatedDate(todos: Todo[], direction: 'asc' | 'desc'): Todo[] {
  return [...todos].sort((a, b) => {
    const comparison = a.createdAt.localeCompare(b.createdAt);
    return direction === 'asc' ? comparison : -comparison;
  });
}
```

## Edge Cases & Validation

### Character Limits (from FR-026, FR-027)
- Title: Enforce 512 character limit at input level (HTML `maxlength` attribute + validation)
- Description: Enforce 5000 character limit at input level

### Storage Errors (from FR-025)
- When `localStorage.setItem()` throws `QuotaExceededError`, display browser error directly
- No graceful degradation or custom error handling per specification

### Orphaned References
- **Tag deletion**: When tag is deleted, remove from all `todo.tagIds[]` arrays
- **Category deletion**: When category is deleted, set `todo.categoryId = null` for affected todos
- These behaviors deferred to design phase per edge cases in spec

### Data Integrity
- All IDs use UUID v4 for guaranteed uniqueness
- All timestamps use ISO 8601 format for consistent parsing
- Uniqueness constraints on tag/category names enforced at creation time
