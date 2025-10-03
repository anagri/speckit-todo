# Quickstart Guide: Client-Side Todo List Application

**Date**: 2025-10-02
**Feature**: 001-we-will-be

This guide provides step-by-step validation scenarios to verify the application meets all functional requirements. Each scenario maps to acceptance criteria from the feature specification.

## Prerequisites

- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Application deployed to GitHub Pages or running locally
- Browser DevTools open to monitor Local Storage (optional)

## Validation Scenarios

### Scenario 1: First-Time User Experience (FR-009, AS-1)

**Acceptance Criteria**: Empty state should guide users to create their first todo

**Steps**:
1. Open application in browser
2. Clear Local Storage (DevTools → Application → Local Storage → Delete All)
3. Refresh page

**Expected Results**:
- [ ] Empty todo list is displayed
- [ ] "Create Todo" or "Add Todo" button is visible and prominent
- [ ] Helpful message guides user to create first todo (e.g., "No todos yet. Create your first one!")

---

### Scenario 2: Create Todo with All Properties (FR-001 to FR-007, AS-2)

**Acceptance Criteria**: User can create a todo with title, description, tags, category, priority, and schedule

**Steps**:
1. Click "Create Todo" or "Add Todo" button
2. Enter title: "Buy groceries" (required field)
3. Enter description: "Milk, eggs, bread, butter"
4. Select or create category: "Personal"
5. Select or create tags: "shopping", "urgent" (multiple allowed)
6. Select priority: "High"
7. Set scheduled date/time: Tomorrow at 10:00 AM
8. Submit form

**Expected Results**:
- [ ] Todo appears in the list with all entered properties
- [ ] Todo shows title "Buy groceries"
- [ ] Todo shows description when expanded/viewed
- [ ] Todo displays "Personal" category
- [ ] Todo shows "shopping" and "urgent" tags with pleasant colors
- [ ] Todo shows "High" priority indicator
- [ ] Todo shows scheduled date/time "Tomorrow at 10:00 AM"
- [ ] Todo has a `createdAt` timestamp (visible in details or DevTools)

---

### Scenario 3: Character Limit Validation (FR-026, FR-027)

**Acceptance Criteria**: Title limited to 512 chars, description limited to 5000 chars

**Steps**:
1. Open create todo form
2. Try to enter 600 characters in title field
3. Try to enter 6000 characters in description field

**Expected Results**:
- [ ] Title field prevents input beyond 512 characters OR shows validation error
- [ ] Description field prevents input beyond 5000 characters OR shows validation error
- [ ] User cannot submit form with over-limit content

---

### Scenario 4: Mark Todo as Complete (FR-003, AS-3)

**Acceptance Criteria**: User can mark todos as done, completed todos move to "completed" view

**Steps**:
1. Create a todo: "Test completion"
2. Mark todo as complete (checkbox, button, or toggle)
3. Observe active todos list
4. Navigate to "Completed" category/view

**Expected Results**:
- [ ] Todo no longer appears in active/default view
- [ ] Todo appears in "Completed" category/view
- [ ] Todo shows visual indication of completion (strikethrough, checkmark, etc.)
- [ ] Todo can be toggled back to active status

---

### Scenario 5: Filter by Tags (FR-011, AS-4)

**Acceptance Criteria**: User can filter todos by one or more tags

**Setup**:
1. Create todo "A" with tags: "work", "urgent"
2. Create todo "B" with tags: "personal", "urgent"
3. Create todo "C" with tags: "work"

**Steps**:
1. Apply filter: Select tag "urgent"
2. Observe filtered list
3. Apply filter: Select tags "work" AND "urgent"
4. Observe filtered list

**Expected Results**:
- [ ] Filtering by "urgent" shows todos A and B only
- [ ] Filtering by "work" AND "urgent" shows todo A only (tags are OR within, AND between filters)
- [ ] Other todos are hidden but not deleted
- [ ] Filter can be cleared to show all todos again

---

### Scenario 6: Filter by Category (FR-012, AS-4)

**Acceptance Criteria**: User can filter todos by one or more categories

**Setup**:
1. Create todo "X" with category: "Work"
2. Create todo "Y" with category: "Personal"
3. Create todo "Z" with no category

**Steps**:
1. Apply filter: Select category "Work"
2. Observe filtered list
3. Clear filter
4. Apply filter: Select categories "Work" OR "Personal"

**Expected Results**:
- [ ] Filtering by "Work" shows only todo X
- [ ] Filtering by "Work" OR "Personal" shows todos X and Y
- [ ] Todo Z (no category) is hidden when category filter is active
- [ ] Clear filter shows all todos again

---

### Scenario 7: Filter by Priority (FR-013, AS-4)

**Acceptance Criteria**: User can filter todos by priority level

**Setup**:
1. Create todo "P1" with priority: Low
2. Create todo "P2" with priority: Medium
3. Create todo "P3" with priority: High

**Steps**:
1. Apply filter: Select priority "High"
2. Apply filter: Select priorities "Low" OR "High"

**Expected Results**:
- [ ] Filtering by "High" shows only P3
- [ ] Filtering by "Low" OR "High" shows P1 and P3
- [ ] Filtering by "Medium" shows only P2

---

### Scenario 8: Filter by Date Range (FR-014, AS-4)

**Acceptance Criteria**: User can filter todos by scheduled date/time range

**Setup**:
1. Create todo "D1" scheduled for Oct 1, 2025 10:00 AM
2. Create todo "D2" scheduled for Oct 5, 2025 2:00 PM
3. Create todo "D3" scheduled for Oct 10, 2025 9:00 AM
4. Create todo "D4" with no scheduled date

**Steps**:
1. Apply date range filter: Oct 1 - Oct 5 (inclusive)
2. Apply date range filter: Oct 6 - Oct 15

**Expected Results**:
- [ ] Filter Oct 1 - Oct 5 shows D1 and D2 only
- [ ] Filter Oct 6 - Oct 15 shows D3 only
- [ ] D4 (no scheduled date) is not shown in either filter
- [ ] Todos are filtered by both date AND time

---

### Scenario 9: Sort by Priority (FR-015, FR-018, AS-5)

**Acceptance Criteria**: User can sort todos by priority (Low < Medium < High), single criterion only

**Setup**:
1. Create todo "S1" with priority: Medium
2. Create todo "S2" with priority: Low
3. Create todo "S3" with priority: High

**Steps**:
1. Apply sort: Priority (ascending)
2. Apply sort: Priority (descending)

**Expected Results**:
- [ ] Ascending: S2 (Low), S1 (Medium), S3 (High)
- [ ] Descending: S3 (High), S1 (Medium), S2 (Low)
- [ ] Sort persists when navigating views

---

### Scenario 10: Sort by Scheduled Date (FR-016, FR-018, AS-5)

**Acceptance Criteria**: User can sort todos by scheduled date/time

**Setup**:
1. Create todo "T1" scheduled for Oct 10
2. Create todo "T2" scheduled for Oct 1
3. Create todo "T3" with no scheduled date

**Steps**:
1. Apply sort: Scheduled Date (ascending)
2. Apply sort: Scheduled Date (descending)

**Expected Results**:
- [ ] Ascending: T2 (Oct 1), T1 (Oct 10), then T3 (no date at end or beginning - design decision)
- [ ] Descending: T1 (Oct 10), T2 (Oct 1), then T3
- [ ] Todos without scheduled date have consistent placement (first or last)

---

### Scenario 11: Sort by Creation Date (FR-017, FR-029, AS-5)

**Acceptance Criteria**: User can sort todos by created_at timestamp

**Setup**:
1. Create todo "C1" (wait 1 second)
2. Create todo "C2" (wait 1 second)
3. Create todo "C3"

**Steps**:
1. Apply sort: Creation Date (oldest first)
2. Apply sort: Creation Date (newest first)

**Expected Results**:
- [ ] Oldest first: C1, C2, C3
- [ ] Newest first: C3, C2, C1
- [ ] Each todo has immutable `createdAt` timestamp

---

### Scenario 12: Single Sort Criterion (FR-018, AS-5)

**Acceptance Criteria**: Only one sort criterion can be active at a time

**Setup**:
1. Create 3 todos with different priorities and dates

**Steps**:
1. Apply sort: Priority (ascending)
2. Observe sorted list
3. Apply sort: Scheduled Date (ascending)
4. Observe sorted list

**Expected Results**:
- [ ] Step 2: Todos sorted by priority
- [ ] Step 4: Todos sorted by scheduled date (priority sort is replaced, not combined)
- [ ] UI shows only one active sort indicator at a time

---

### Scenario 13: Edit Todo Properties (FR-019, AS-8)

**Acceptance Criteria**: User can edit all properties of existing todos

**Setup**:
1. Create todo "Original Title" with description, tags, category, priority, date

**Steps**:
1. Open edit form for the todo
2. Change title to "Updated Title"
3. Change description
4. Add/remove tags
5. Change category
6. Change priority
7. Change scheduled date/time
8. Save changes

**Expected Results**:
- [ ] All changes are persisted
- [ ] Todo shows updated values
- [ ] `updatedAt` timestamp is modified
- [ ] `createdAt` timestamp remains unchanged
- [ ] Changes persist after page refresh

---

### Scenario 14: Soft Delete and Restore (FR-020, FR-021, AS-7)

**Acceptance Criteria**: Todos can be soft deleted and recovered

**Steps**:
1. Create todo "To be deleted"
2. Delete the todo
3. Observe active todos list
4. Navigate to "Deleted" or "Trash" view
5. Restore the deleted todo
6. Return to active todos list

**Expected Results**:
- [ ] After deletion, todo is removed from active view
- [ ] Deleted view shows the todo
- [ ] Todo has `deletedAt` timestamp
- [ ] After restore, todo appears in active view again
- [ ] `isDeleted` flag is false after restore
- [ ] `deletedAt` is cleared after restore

---

### Scenario 15: Data Persistence (FR-008, FR-024, AS-6)

**Acceptance Criteria**: All data persists across browser sessions using Local Storage

**Steps**:
1. Create 3 todos with various properties
2. Mark 1 as complete
3. Delete 1 todo (soft delete)
4. Apply filters and sort
5. Close browser completely
6. Reopen browser and navigate to application

**Expected Results**:
- [ ] All 3 todos are still present
- [ ] Completed todo is still in "Completed" view
- [ ] Deleted todo is still in "Deleted" view
- [ ] Filters and sort preferences are persisted (if designed to persist)
- [ ] All properties (tags, categories, dates) are intact

---

### Scenario 16: Offline Functionality (FR-024)

**Acceptance Criteria**: Application works without network connectivity

**Steps**:
1. Open application while online
2. Disable network (DevTools → Network → Offline mode OR airplane mode)
3. Create new todos
4. Edit existing todos
5. Apply filters and sorts
6. Refresh page (should load from cache)

**Expected Results**:
- [ ] All CRUD operations work offline
- [ ] No network errors displayed
- [ ] Data persists to Local Storage without network
- [ ] Page loads from browser cache after refresh

---

### Scenario 17: Storage Error Handling (FR-025)

**Acceptance Criteria**: Display browser storage errors directly to user when quota is exceeded

**Steps**:
1. Simulate storage quota exceeded (DevTools → Application → Local Storage → Manually fill storage OR create many large todos)
2. Try to create a new todo or edit existing one

**Expected Results**:
- [ ] Browser's QuotaExceededError is displayed to user
- [ ] No custom error handling (per spec requirement)
- [ ] Error message is clear and indicates storage limit issue

---

### Scenario 18: Clear Filters (FR-023, AS-4)

**Acceptance Criteria**: User can clear all active filters to view all todos

**Steps**:
1. Apply multiple filters: tags, categories, priority, date range
2. Observe filtered list (few todos visible)
3. Click "Clear Filters" or similar action

**Expected Results**:
- [ ] All filters are removed
- [ ] All active todos are visible again
- [ ] Filter controls reset to default state
- [ ] Sort remains active (if applied)

---

### Scenario 19: Empty Filter Results (FR-022)

**Acceptance Criteria**: Clear indication when no todos match filters

**Steps**:
1. Create 3 todos with tag "work"
2. Apply filter: tag "personal" (no todos have this tag)

**Expected Results**:
- [ ] Empty state message displayed (e.g., "No todos match your filters")
- [ ] Helpful action to clear filters or create new todo
- [ ] Not confused with "no todos created yet" state

---

### Scenario 20: Tag Colors (FR-028)

**Acceptance Criteria**: Tags have pleasant colors for visual differentiation

**Steps**:
1. Create 10 different tags
2. Observe tag colors in UI

**Expected Results**:
- [ ] Each tag has a distinct, pleasant color
- [ ] Colors are from a predefined palette (not random)
- [ ] Text on colored backgrounds is readable (good contrast)
- [ ] Same tag name always gets same color (consistency)

---

### Scenario 21: Category Management (FR-030)

**Acceptance Criteria**: User can create categories with unique names in flat structure

**Steps**:
1. Create category "Work"
2. Try to create another category named "Work" (duplicate)
3. Create category "Personal"
4. Verify no subcategory or hierarchy options exist

**Expected Results**:
- [ ] Duplicate category name is rejected (case-insensitive)
- [ ] "Work" and "work" are treated as the same category
- [ ] Categories are displayed in flat list (no nesting)
- [ ] Each todo can be assigned to only one category

---

### Scenario 22: Multiple Tags Per Todo (FR-005)

**Acceptance Criteria**: Each todo can have multiple tags assigned

**Steps**:
1. Create todo "Multi-tag test"
2. Assign tags: "urgent", "work", "important", "review"
3. View todo details

**Expected Results**:
- [ ] All 4 tags are displayed on the todo
- [ ] Each tag shows its distinct color
- [ ] Tags can be added or removed individually when editing

---

## Integration Test Checklist

After completing all scenarios, verify:

- [ ] All 30 functional requirements (FR-001 to FR-030) are validated
- [ ] All 8 acceptance scenarios (AS-1 to AS-8) are covered
- [ ] Data persists across browser sessions
- [ ] Application works offline
- [ ] No console errors in browser DevTools
- [ ] Local Storage key `todos_app_data_v1` contains valid JSON
- [ ] Character limits are enforced
- [ ] Soft delete preserves data
- [ ] Single sort criterion enforced
- [ ] Filters can be combined (AND logic)
- [ ] Tags and categories are unique (case-insensitive)

## Regression Test Suite

For ongoing development, automate these scenarios using:
- React Testing Library for component behavior
- Integration tests for user flows (create → edit → delete → restore)
- Storage tests for Local Storage operations

**Test Coverage Goal**: 100% of functional requirements validated by automated tests.
