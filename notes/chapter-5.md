# Chapter 5: plan-template.md → Implementation Artifacts

## Core Concept

**plan-template.md** is a phase orchestrator that transforms business requirements (spec.md) into technical implementation design. Unlike spec-template (which strips away technical details), plan-template **adds them back systematically** while enforcing constitutional principles.

## The Workflow

```
spec.md (business requirements)
         ↓
    [/plan command]
         ↓
plan-template.md (AI processes)
         ↓
┌─────────────────────────────────┐
│ Phase 0: research.md            │
│ Phase 1: design artifacts       │
│ Phase 2: describe task approach │
└─────────────────────────────────┘
         ↓
    [/tasks command]
         ↓
    tasks.md
```

## AI's 9-Step Execution Flow

```
1. Load spec.md from Input path
2. Fill Technical Context (detect NEEDS CLARIFICATION)
3. Fill Constitution Check section
4. Evaluate Constitution Check (GATE 1)
   → If violations: Document in Complexity Tracking
   → Update Progress: Initial Constitution Check
5. Execute Phase 0 → research.md
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, CLAUDE.md
7. Re-evaluate Constitution Check (GATE 2)
   → If new violations: Refactor, return to Phase 1
   → Update Progress: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**Critical**: `/plan` executes steps 1-8 only. Phase 2 execution is handled by `/tasks`.

### Step-by-Step Breakdown

**Step 1: Load spec.md**
- Reads `specs/{branch}/spec.md`
- Extracts FR requirements, acceptance scenarios, entities

**Step 2: Fill Technical Context**
- Scans spec for tech hints ("browser storage" → TypeScript)
- Flags unknowns as `NEEDS CLARIFICATION`
- Example: Testing framework not mentioned → flagged for research

**Step 3: Fill Constitution Check**
- Loads `.specify/memory/constitution.md`
- Checks each principle against spec requirements
- Marks ✅ PASS or ❌ VIOLATION

**Step 4: Evaluate Constitution (GATE 1)**
- If violations → must justify in Complexity Tracking table
- If no justification → ERROR "Simplify approach first"
- Example justification: "Repository pattern needed to swap DB vendors"

**Step 5: Execute Phase 0 → research.md**
- For each `NEEDS CLARIFICATION` → research task
- Consolidates findings: Decision / Rationale / Alternatives
- Example: "Testing: NEEDS CLARIFICATION" → researches React Testing Library vs Cypress

**Step 6: Execute Phase 1 → 5 artifacts**
- **data-model.md**: Extract entities from FR requirements (FR-001 → Todo.title field)
- **contracts/types.ts**: Transform entities → TypeScript interfaces
- **contracts/storage-api.ts**: Define storage operations interface
- **quickstart.md**: User stories → test scenarios with steps + expected results
- **CLAUDE.md**: Incremental update with new tech (preserves manual additions)

**Step 7: Re-evaluate Constitution (GATE 2)**
- Reviews Phase 1 artifacts for violations
- Common issues: over-engineering (added cache layer), skipped tests
- If violations → refactor and return to Step 6
- GATE 1 checks **intent**, GATE 2 checks **design**

**Step 8: Plan Phase 2 → task strategy**
- **Describes** task generation approach (doesn't execute)
- Plans breakdown: Setup → Storage → Components → Deployment
- Identifies parallel tasks [P] and TDD pairs
- Estimates total (~48 tasks)

**Step 9: STOP**
- Updates Progress Tracking checklist
- Lists all artifacts generated
- Marks "Ready for /tasks command"
- User runs `/tasks` to execute Phase 3

---

## Generated Artifacts (001-we-will-be Example)

```
specs/001-we-will-be/
├── plan.md              # Filled template
├── research.md          # Phase 0: Resolved NEEDS CLARIFICATION
├── data-model.md        # Phase 1: Entities from spec
├── quickstart.md        # Phase 1: Test scenarios
└── contracts/
    ├── types.ts         # Phase 1: TypeScript interfaces
    └── storage-api.ts   # Phase 1: Storage contract
```

---

## Section 1: Technical Context (Phase Setup)

### Template Asks For
```markdown
Language/Version: [e.g., Python 3.11 or NEEDS CLARIFICATION]
Primary Dependencies: [e.g., FastAPI or NEEDS CLARIFICATION]
Storage: [if applicable or N/A]
Testing: [e.g., pytest or NEEDS CLARIFICATION]
Project Type: single/web/mobile
```

### AI Filled With (Example)
```markdown
Language/Version: TypeScript (latest stable with Next.js v14)
Primary Dependencies: Next.js v14 (Pages Router), React 18, Tailwind CSS, shadcn UI
Storage: Browser Local Storage (client-side only, no backend)
Testing: React Testing Library, Jest (TDD approach)
Project Type: single (frontend-only, static export)
Performance Goals: <2s page load, 60fps UI
Constraints: Fully offline-capable, static export compatible
Scale/Scope: Single-user, unlimited todos, 10-15 components
```

**Key**: Any `NEEDS CLARIFICATION` triggers research in Phase 0.

---

## Section 2: Constitution Check (Dual-Gate Validation)

### How It Works

AI validates design against project principles **twice**:
1. **GATE 1**: Before Phase 0 research (catch violations early)
2. **GATE 2**: After Phase 1 design (catch complexity creep)

### Example from 001-we-will-be

**Initial Check (GATE 1):**
```markdown
**Principle I: Static-First Export**
- ✅ PASS - Feature is fully client-side, no server-side rendering

**Principle II: Component Testing (NON-NEGOTIABLE)**
- ✅ PASS - Will follow TDD with component tests before implementation

**Principle III: Minimalism**
- ✅ PASS - Simple local storage (no IndexedDB over-engineering)
- ✅ PASS - Using shadcn UI instead of custom components

**Initial Gate Status**: ✅ ALL CHECKS PASSED
```

**Post-Design Check (GATE 2):**
```markdown
**Post-Design Re-evaluation** (after Phase 1):
- ✅ Static Export: Design uses Local Storage, no server dependencies
- ✅ Component Testing: Contracts define clear TDD interfaces
- ✅ Minimalism: No over-engineering detected

**Final Gate Status**: ✅ ALL CHECKS PASSED
```

### If Violations Exist

AI must fill Complexity Tracking table:
```markdown
| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Repository pattern | Swap DB providers | Direct DB access couples to vendor |
```

If no justification possible → ERROR "Simplify approach first"

---

## Section 3: Project Structure (Choose and Expand)

### Template Provides 3 Options

1. **Single project** (default)
2. **Web application** (frontend + backend)
3. **Mobile + API** (iOS/Android + server)

### AI's Task

1. Choose based on Project Type detection
2. **Delete unused options**
3. Expand chosen structure with **real file paths**

### Example: Option 1 Expanded

```
pages/
├── _app.tsx              # Next.js app wrapper with providers
├── index.tsx             # Main todo list page

components/
├── TodoForm.tsx          # Create/edit todo form
├── TodoList.tsx          # Todo list display
├── TodoFilters.tsx       # Filter controls
└── ui/                   # shadcn UI components

lib/
├── storage.ts            # Local storage operations
├── types.ts              # TypeScript interfaces
└── utils.ts              # Helper functions

__tests__/
├── components/           # Component tests
└── lib/                  # Unit tests
```

**Note**: AI replaced generic comments with specific component names.

---

## Phase 0: Research (Resolve Unknowns)

### Process

1. Extract all `NEEDS CLARIFICATION` from Technical Context
2. Generate research task for each unknown
3. Consolidate findings in `research.md`

### Output Structure (Decision → Rationale → Alternatives)

**Example: Browser Storage Decision**

```markdown
### Browser Storage Strategy

**Decision**: Use Local Storage with JSON serialization for MVP

**Rationale**:
- Simple API: localStorage.setItem() and localStorage.getItem()
- Synchronous operations suitable for small-to-medium datasets (5MB limit)
- Per-spec: "display storage errors directly to user"
- JSON handles complex objects (todos with nested tags, dates)

**Implementation Pattern**:
```typescript
const STORAGE_KEY = 'todos_app_data';

function saveTodos(todos: Todo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    throw error; // Per spec: display error directly
  }
}
```

**Alternatives Considered**:
- IndexedDB: Over-engineered for MVP, adds async complexity
- SessionStorage: Rejected (data should persist across sessions)
- Cookie storage: Too limited (4KB)
```

**Example: State Management Decision**

```markdown
### State Management

**Decision**: React Context + useReducer

**Rationale**:
- No external state library needed (minimalism principle)
- Context provides todos to all components
- useReducer handles complex state updates predictably
- Easy to test with React Testing Library

**Alternatives Considered**:
- Redux: Overkill for single-user client app
- Zustand/Jotai: Unnecessary external dependencies
- Prop drilling: Unmanageable for nested filter/sort controls
```

---

## Phase 1: Design & Contracts

### Five Artifacts Generated

#### 1. data-model.md (Entities from Spec)

**Extraction**: FR requirements → Entity definitions

**Example: Todo Entity**
```typescript
### Todo

**Fields**:
- id: string - UUID v4
- title: string - Required, max 512 characters (from FR-001, FR-026)
- description: string - Optional, max 5000 characters (from FR-002, FR-027)
- isCompleted: boolean - Completion status (from FR-003)
- scheduledAt: string | null - ISO 8601 datetime (from FR-004)
- priority: 'low' | 'medium' | 'high' - Default 'medium' (from FR-007)
- tagIds: string[] - Multiple allowed (from FR-005)
- createdAt: string - ISO 8601, immutable (from FR-029)
- updatedAt: string - ISO 8601, modified on edits (from FR-019)

**State Transitions**:
[Create] → Active (isCompleted=false, isDeleted=false)
Active → Completed (isCompleted=true)
Active → Deleted (isDeleted=true, deletedAt=now)
Deleted → Active (isDeleted=false, deletedAt=null)
```

**Key**: Every field references its source FR requirement for traceability.

#### 2. contracts/types.ts (TypeScript Interfaces)

**Transformation**: Data model → Code contracts

```typescript
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

export type Priority = 'low' | 'medium' | 'high';
```

**Also includes**: Input types, filter/sort state, action types for useReducer

#### 3. contracts/storage-api.ts (Storage Contract)

**Defines interface** for all storage implementations:

```typescript
export interface StorageAPI {
  /**
   * Load all application data from storage
   * @throws {Error} If data is corrupted
   */
  loadData(): AppData;

  /**
   * Save all application data to storage
   * Per FR-025: Display browser storage errors directly to user
   * @throws {QuotaExceededError} If storage limit is reached
   */
  saveData(data: AppData): void;

  /**
   * Clear all application data from storage
   */
  clearData(): void;

  /**
   * Check if storage is available
   */
  isAvailable(): boolean;
}
```

**Includes**: Error types, validation functions, usage examples

#### 4. quickstart.md (Test Scenarios from User Stories)

**Transformation**: Acceptance scenarios → Executable test steps

**Example: Scenario 2 - Create Todo with All Properties**

```markdown
**Acceptance Criteria**: User can create todo with title, description, tags, category, priority, schedule

**Steps**:
1. Click "Create Todo" button
2. Enter title: "Buy groceries"
3. Enter description: "Milk, eggs, bread, butter"
4. Select category: "Personal"
5. Select tags: "shopping", "urgent" (multiple)
6. Select priority: "High"
7. Set scheduled date/time: Tomorrow at 10:00 AM
8. Submit form

**Expected Results**:
- [ ] Todo appears in list with all properties
- [ ] Todo shows title "Buy groceries"
- [ ] Todo displays "Personal" category
- [ ] Todo shows "shopping" and "urgent" tags with pleasant colors
- [ ] Todo shows "High" priority indicator
- [ ] Todo shows scheduled date/time
- [ ] Todo has createdAt timestamp
```

**Coverage**: 22 validation scenarios covering all 30 FR requirements and 8 acceptance scenarios from spec.md

#### 5. CLAUDE.md (Updated Agent Context)

**Incremental update** (not replacement):
- Run `update-agent-context.sh claude`
- Add only NEW tech from current plan
- Preserve manual additions between markers
- Keep under 150 lines for token efficiency

---

## Phase 2: Task Planning Approach (Describe, Don't Execute)

### What AI Does

**Describes** what `/tasks` command will do (but doesn't create tasks.md)

### Example Description

```markdown
## Phase 2: Task Planning Approach

**Task Generation Strategy**:

1. **Setup & Infrastructure** (Sequential):
   - Initialize Next.js v14 with Pages Router, TypeScript, Tailwind
   - Configure static export (output: 'export')
   - Install shadcn UI
   - Setup React Testing Library and Jest

2. **Type & Contract Tasks** (from contracts/):
   - Copy contracts/types.ts → lib/types.ts [P]
   - Copy contracts/storage-api.ts → lib/storage.ts [P]
   - Create contract test for storage operations

3. **Core Storage Implementation** (TDD):
   - Write storage test - MUST FAIL
   - Implement LocalStorageAPI to pass tests

4. **Component Tasks** (TDD - Red-Green-Refactor):
   - TodoForm: Write test → Implement
   - TodoItem: Write test → Implement
   - TodoList: Write test → Implement
   - TodoFilters: Write test → Implement
   - TodoSort: Write test → Implement

5. **Page Integration** (TDD):
   - Write index.tsx test - MUST FAIL
   - Implement index.tsx to pass tests

**Ordering Strategy**:
- Sequential: Infrastructure → Storage → State → Components → Pages
- Parallel [P]: Type definitions, individual component tests
- TDD: Every task pairs "Write test (MUST FAIL)" → "Implement"

**Estimated Total**: ~48 tasks (24 test + 24 implementation/config)
```

**[P] marker**: Indicates tasks can run in parallel

---

## Key Transformations

### 1. Spec Requirement → Data Model → Code Contract

**From spec.md FR-001:**
```
System MUST allow users to create a new todo with a title
(required, max 512 chars)
```

**To data-model.md:**
```
- title: string - Required, max 512 characters (from FR-001, FR-026)
```

**To types.ts:**
```typescript
/** Task title (required, max 512 characters) */
title: string;
```

### 2. User Story → Test Scenario

**From spec.md AS-2:**
```
Given the user wants to create a todo
When they provide title, description, tags, category, priority
Then the todo is saved and appears in list
```

**To quickstart.md:**
```markdown
**Steps**: (7 concrete actions)
1. Click "Create Todo" button
2. Enter title: "Buy groceries"
3. Enter description: "Milk, eggs, bread"
...

**Expected Results**: (7 verifiable outcomes)
- [ ] Todo appears in list with all properties
- [ ] Todo shows tags with pleasant colors
...
```

### 3. Edge Case → Research Decision → Contract

**From spec.md edge case:**
```
What happens when browser storage is full?
Display the browser's storage error without custom handling.
```

**To research.md:**
```typescript
function saveTodos(todos: Todo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    throw error; // Per spec: display error directly
  }
}
```

**To storage-api.ts:**
```typescript
/**
 * Per FR-025: Display browser storage errors directly to user
 * @throws {QuotaExceededError} If storage limit is reached
 */
saveData(data: AppData): void;
```

---

## Quality Control Mechanisms

### 1. Complexity Tracking Table

Forces AI to justify constitutional violations:

```markdown
| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Repository pattern | Swap DB providers | Direct DB couples to vendor |
```

If no justification → ERROR "Simplify approach first"

### 2. Progress Tracking Checklist

Updated during execution:

```markdown
**Phase Status**:
- [x] Phase 0: Research complete ✅
- [x] Phase 1: Design complete ✅
- [x] Phase 2: Task planning complete ✅
- [ ] Phase 3: Tasks generated (/tasks command) - NEXT STEP

**Gate Status**:
- [x] Initial Constitution Check: PASS ✅
- [x] Post-Design Constitution Check: PASS ✅
- [x] All NEEDS CLARIFICATION resolved ✅
- [x] Complexity deviations documented ✅ (None)

**Artifacts Generated**:
- [x] plan.md
- [x] research.md
- [x] data-model.md
- [x] contracts/types.ts
- [x] contracts/storage-api.ts
- [x] quickstart.md

**Ready for /tasks command**: ✅ All prerequisites complete
```

---

## Insights

### Template as Phase Orchestrator
- **Not just a document**: It's an executable process with error conditions and validation gates
- **Phase boundaries are strict**: AI stops at Phase 2 description, never creates tasks.md during `/plan`
- **Dual-gate validation**: Constitution checked twice (before research, after design) to catch violations early and late

### Traceability is Built-In
- Every data model field references source FR requirement (e.g., "from FR-001, FR-026")
- Every test scenario maps to acceptance criteria in spec.md
- Every contract includes constitutional compliance notes (e.g., "Per FR-025")

### TDD is Embedded
- Phase 2 enforces "Write test (MUST FAIL) → Implement" pairs
- Contracts define interfaces before implementation
- Quickstart scenarios become integration tests

### NEEDS CLARIFICATION Propagates
```
Technical Context unknowns
         ↓
Phase 0 research tasks
         ↓
Research decisions
         ↓
Concrete contracts
```

### Constitutional Compliance is Automatic
- AI checks principles without being told each time
- Minimalism prevents over-engineering (e.g., chose Local Storage over IndexedDB)
- TDD requirement appears in task descriptions ("tests before implementation")

### The Meta-Pattern
plan-template.md encodes **senior architect expertise** into a reusable template:
- How to break down a feature (phases)
- How to validate design (constitution gates)
- How to ensure quality (TDD, traceability, simplicity)
- How to stay organized (progress tracking)

Every `/plan` execution follows proven architectural patterns, regardless of AI operator skill level.
