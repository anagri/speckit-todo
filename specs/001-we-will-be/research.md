# Research: Client-Side Todo List Application

**Date**: 2025-10-02
**Feature**: 001-we-will-be

## Research Areas

### 1. Next.js v14 Static Export for GitHub Pages

**Decision**: Use Next.js v14 with Pages Router and `output: 'export'` configuration

**Rationale**:
- Pages Router is more mature for static export than App Router (which has limitations)
- `output: 'export'` generates pure static HTML/CSS/JS files deployable to any static host
- GitHub Pages requires no special configuration beyond setting `basePath` if deployed to subdomain
- No server-side features (API routes, ISR, SSR) needed for this client-only application

**Configuration Required**:
```typescript
// next.config.js
module.exports = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
}
```

**Alternatives Considered**:
- App Router: Not chosen due to static export limitations and unnecessary complexity for this use case
- Create React App: Rejected because Next.js provides better structure and future extensibility
- Vite: Considered but Next.js chosen for established patterns and better TypeScript support

### 2. Browser Storage Strategy

**Decision**: Use Local Storage with JSON serialization for MVP

**Rationale**:
- Simple API: `localStorage.setItem()` and `localStorage.getItem()`
- Synchronous operations suitable for small-to-medium datasets (5MB typical limit)
- Per-spec requirement: "display browser storage errors directly to user without custom handling"
- JSON serialization handles complex objects (todos with nested tags, dates)
- No need for IndexedDB complexity unless user hits storage limits

**Implementation Pattern**:
```typescript
// Simple storage wrapper
const STORAGE_KEY = 'todos_app_data';

function saveTodos(todos: Todo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    // Per spec: display error directly to user
    throw error;
  }
}

function loadTodos(): Todo[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}
```

**Alternatives Considered**:
- IndexedDB: Over-engineered for MVP, adds async complexity without clear benefit for expected data volume
- SessionStorage: Rejected because data should persist across browser sessions
- Cookie storage: Too limited in size (4KB) for todo application

### 3. State Management

**Decision**: React Context + useReducer for global state, local state for component-specific UI

**Rationale**:
- No external state library needed (minimalism principle)
- Context provides todos to all components that need them
- useReducer handles complex state updates (filters, sorts, CRUD operations) in predictable way
- Follows React best practices without additional dependencies
- Easy to test with React Testing Library

**Architecture**:
```typescript
// TodoContext provides:
// - todos: Todo[]
// - dispatch: (action: TodoAction) => void
// - filters: FilterState
// - sortBy: SortCriteria

// Components consume context and dispatch actions
// Storage sync happens in reducer after state updates
```

**Alternatives Considered**:
- Redux: Overkill for single-user client app, violates minimalism principle
- Zustand/Jotai: Unnecessary external dependencies
- Component prop drilling: Unmanageable for deeply nested filter/sort controls

### 4. Component Testing Strategy

**Decision**: React Testing Library with user-centric tests following TDD

**Rationale**:
- Constitutional requirement: "Component tests MUST be written BEFORE implementation"
- React Testing Library enforces testing user behavior, not implementation details
- Use `data-testid` attributes (per user preference) for stable selectors
- Each component gets test file before implementation (Red-Green-Refactor)

**Test Structure**:
```typescript
// __tests__/components/TodoForm.test.tsx
describe('TodoForm', () => {
  it('should create todo with title when submitted', () => {
    render(<TodoForm onSubmit={mockSubmit} />);
    const input = screen.getByTestId('todo-title-input');
    const submitBtn = screen.getByTestId('todo-submit-btn');

    fireEvent.change(input, { target: { value: 'Buy milk' } });
    fireEvent.click(submitBtn);

    expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Buy milk'
    }));
  });
});
```

**Key Patterns**:
- No try-catch in tests (per user preference: "Let errors throw naturally")
- No if-else in tests (per user preference: "Tests must be deterministic")
- `assert_eq!(expected, actual)` pattern where applicable
- `console.log` only for error scenarios in tests

**Alternatives Considered**:
- Enzyme: Deprecated and encourages implementation testing
- Cypress Component Testing: Too heavy for unit component tests

### 5. Tailwind CSS + shadcn UI Integration

**Decision**: Use Tailwind utility classes with shadcn UI components as foundation

**Rationale**:
- Constitutional requirement: Tailwind CSS for all styling
- shadcn UI provides accessible, well-tested primitives (buttons, dialogs, dropdowns)
- Components are copied into codebase (not imported), allowing customization
- Utility-first approach reduces custom CSS

**Setup Steps**:
1. Initialize Tailwind CSS in Next.js project
2. Run `npx shadcn-ui@latest init` to set up component infrastructure
3. Install needed components: `npx shadcn-ui@latest add button dialog input select`
4. Customize theme in `tailwind.config.js` for tag colors

**Component Selection**:
- Button: Form submissions, actions
- Input/Textarea: Todo title and description
- Select/Dropdown: Category, priority, tag selection
- Dialog/Modal: Todo create/edit forms
- DatePicker: Schedule date/time selection
- Badge: Tag display with colors

**Alternatives Considered**:
- Material UI: Too opinionated, heavy bundle size
- Chakra UI: Requires emotion dependency, violates minimalism
- Ant Design: Not compatible with Tailwind utility-first approach

### 6. Date/Time Handling

**Decision**: Use native JavaScript Date with `<input type="datetime-local">` for scheduling

**Rationale**:
- Per spec: "date and time with minute granularity"
- No need for date library (date-fns, dayjs, moment) for simple use case
- Native `datetime-local` input provides browser-native date/time picker
- ISO 8601 format for storage ensures consistent parsing

**Implementation**:
```typescript
// Store as ISO string in todo object
interface Todo {
  scheduledAt?: string; // ISO 8601: "2025-10-02T14:30:00.000Z"
}

// Convert for datetime-local input (requires local format)
function toDateTimeLocal(isoString: string): string {
  return new Date(isoString).toISOString().slice(0, 16);
}
```

**Alternatives Considered**:
- date-fns: Unnecessary dependency for simple date display/parsing
- Luxon: Over-engineered for this use case
- Custom date picker: Violates "use established components" principle

### 7. Tag Color Assignment

**Decision**: Predefined pleasant color palette with automatic assignment

**Rationale**:
- Per spec: "Tags have pleasant colors. No icons needed."
- Define 12-16 colors from Tailwind palette (blue, green, purple, pink, orange, etc.)
- Assign colors sequentially or by hash of tag name for consistency
- Store color with tag entity for persistence

**Color Palette** (Tailwind classes):
```typescript
const TAG_COLORS = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800',
  'bg-orange-100 text-orange-800',
  'bg-cyan-100 text-cyan-800',
  'bg-indigo-100 text-indigo-800',
  'bg-teal-100 text-teal-800',
  // ... more colors
];
```

**Alternatives Considered**:
- Random color generation: Inconsistent, may produce poor contrast
- User-selected colors: Over-engineering for MVP, adds UI complexity

### 8. Soft Delete Implementation

**Decision**: Add `isDeleted` boolean flag to todos, filter in UI layer

**Rationale**:
- Per spec: "Soft delete only (todos can be recovered)"
- Simple flag-based approach: `todo.isDeleted = true`
- Default views filter out deleted todos: `todos.filter(t => !t.isDeleted)`
- Separate "Deleted" view shows: `todos.filter(t => t.isDeleted)`
- Recovery is simple flag flip: `todo.isDeleted = false`

**Data Model Addition**:
```typescript
interface Todo {
  id: string;
  isDeleted: boolean;  // false by default
  deletedAt?: string;  // ISO timestamp when deleted
  // ... other fields
}
```

**Alternatives Considered**:
- Separate deleted todos array: Complicates state management and storage
- Tombstone records: Over-engineered for client-only app

### 9. Filter & Sort Architecture

**Decision**: Separate filter state from todos, apply filters/sort in derived selector

**Rationale**:
- Per spec: "Single sort criterion only"
- Filters can be combined (tags AND categories AND date range)
- Sort is mutually exclusive (priority OR date OR created_at)
- Compute filtered/sorted view on-demand, don't mutate todos array

**State Structure**:
```typescript
interface FilterState {
  tags: string[];          // Selected tag names
  categories: string[];    // Selected category names
  priorities: Priority[];  // Selected priorities
  dateRange?: {
    start: string;
    end: string;
  };
  completionStatus: 'all' | 'active' | 'completed';
}

interface SortState {
  criterion: 'priority' | 'scheduledAt' | 'createdAt' | null;
  direction: 'asc' | 'desc';
}

// Derived selector
function getVisibleTodos(todos: Todo[], filters: FilterState, sort: SortState): Todo[] {
  let result = todos.filter(/* apply all filters */);
  if (sort.criterion) {
    result = result.sort(/* apply sort */);
  }
  return result;
}
```

**Alternatives Considered**:
- Eager filtering (mutate todos on filter change): Loses original order, complicates state
- Server-side filtering: N/A for client-only app

## Research Summary

All technical decisions align with constitutional principles:
- ✅ Static export compatible (Next.js Pages Router with `output: 'export'`)
- ✅ Minimalist approach (no unnecessary dependencies beyond Next.js, React, Tailwind, shadcn UI)
- ✅ TDD with React Testing Library (component tests before implementation)
- ✅ Offline-capable (local storage only, no network dependencies)
- ✅ Iterative deployment (can deploy basic CRUD, then add filters/sorts)

No NEEDS CLARIFICATION items remain. Ready for Phase 1 (Design & Contracts).
