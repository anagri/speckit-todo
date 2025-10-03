

/specify
generates the constitution, common set of rules to follow during development, non-negotiables
e.g. iterative software dev, tdd, minimal, output: export, deployment constaint etc.
similar to CLAUDE.md project root file
generates .specify/memory/constitution.md

enforced during planning by passing it
```markdown file: plan-template.md
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
...
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check 

...
## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Gates determined based on constitution file]


...
## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


...
**Gate Status**:
- [ ] Initial Constitution Check: PASS
- [ ] Post-Design Constitution Check: PASS
- [ ] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
```

```markdown specs/001-.../plan.md
**Initial Gate Status**: ✅ ALL CHECKS PASSED - No constitutional violations detected
...

**Final Gate Status**: ✅ ALL CHECKS PASSED - Design complies with constitution
...

**Gate Status**:
- [x] Initial Constitution Check: PASS ✅
- [x] Post-Design Constitution Check: PASS ✅
- [x] All NEEDS CLARIFICATION resolved ✅ (Technical Context fully specified)
- [x] Complexity deviations documented ✅ (None - no violations)
```

chapter 4
---
/specify **focus on what users need and why. avoid how to implement, no tech stacks, APIs. for business stakeholders, not technical doc**

### executes `./create-new-feature.sh`
- takes in args
- searches for git repo root
- finds the latest spec using serial number from specs folder, bumps it by one for next spec number
- creates a branch
- creates specs/__serial__-__first-3-words__ folder
- copies the spec-template.md to above folder
- sets env variable SPECIFY_FEATURE=$branch_name
- outputs branch name, spec file path, feature number in json

## spec-template.md → spec.md AI Processing

### Core Concept
**spec-template.md** is a structured AI prompt disguised as a document template. It acts as a **Business Analyst simulator** that transforms natural language feature requests into formal specifications.

### The Processing Pipeline

**Input Stage:**
- User provides natural language description (via `/specify` command)
- `create-new-feature.sh` copies spec-template.md → specs/{branch}/spec.md
- AI processes the template as a prompt with the user description as input

### AI's 8-Step Execution Flow (Prime Directive)

```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

### Key AI Transformations

#### 1. Disambiguation Through Forced Clarification
Template forces AI to flag ambiguities rather than make assumptions.

**Example:**
```
User input: "give it tags, categories, and priority"

AI generates clarification questions:
- Multiple tags per todo or single tag?
- Multiple categories per todo or single category?
- What priority levels are available?
- Should tags have colors or icons?
```

#### 2. Abstraction: Stripping Implementation Details
Template's guideline: "❌ Avoid HOW to implement"

**Example:**
```
User said: "stored using browser's local storage, indexed-db"

AI transformed to:
- FR-008: System MUST persist all todo data in browser local storage
- FR-024: System MUST work entirely offline

(IndexedDB removed as implementation detail)
```

#### 3. Testable Requirements Generation
Natural language → Formal FR-XXX statements

**Example:**
```
User: "user can add to-dos, mark it as done, schedule to-dos"

AI generated:
- FR-001: System MUST allow users to create a new todo with a title
- FR-003: System MUST allow users to mark a todo as done/completed
- FR-004: System MUST allow users to schedule todos with a due date and time
```

#### 4. Scenario-Based Acceptance Criteria
Template forces Given-When-Then format

**Example:**
```
Given the user opens the application for the first time
When they view the main page
Then they see an empty todo list and a way to create their first todo
```

### Constraint Mechanisms

Template includes "common underspecified areas" AI must check:
- User types and permissions
- **Data retention/deletion policies** ← Triggered "soft delete" clarification
- Performance targets and scale
- **Error handling behaviors** ← Triggered "storage limits" clarification
- Integration requirements
- Security/compliance needs

For each silent area, AI either:
1. Asked for clarification → visible in Clarifications section
2. Made bounded assumption if reasonable
3. Marked with `[NEEDS CLARIFICATION]` if critical

### Quality Gates (Self-Validation Checklist)

```markdown
### Content Quality
- [ ] No implementation details (languages, frameworks, APIs)
- [ ] Focused on user value and business needs
- [ ] Written for non-technical stakeholders
- [ ] All mandatory sections completed

### Requirement Completeness
- [ ] No [NEEDS CLARIFICATION] markers remain
- [ ] Requirements are testable and unambiguous
- [ ] Success criteria are measurable
- [ ] Scope is clearly bounded
- [ ] Dependencies and assumptions identified
```

### Output Structure

AI populates these sections from template:
- **User Scenarios & Testing** → Given-When-Then scenarios from user intent
- **Functional Requirements** → FR-XXX numbered, testable "MUST" statements
- **Key Entities** → Data models extracted from user's domain concepts
- **Clarifications** → Q&A session results for ambiguities
- **Review Checklist** → Self-validation that spec is complete

### Prompt Engineering Techniques Used

1. **Execution flow with error conditions** → Forces process adherence
2. **Negative examples** → "❌ Avoid HOW to implement"
3. **Mandatory markers** → `[NEEDS CLARIFICATION: ...]` for consistency
4. **Structured sections** → `*(mandatory)*` / `*(optional)*` labels
5. **Checklist validation** → Self-review gate before completion

### Insights

- **spec-template.md is a meta-prompt**: A prompt that guides AI to create specifications the same way a senior BA would
- It encodes domain expertise (BA practices) into a reusable template
- Makes every spec generation follow proven patterns for requirement elicitation and documentation
- **The constraint-based transformation**: Messy natural language (input) → AI follows BA best practices (processing) → Clean business spec (output)
- It's not just a document structure—it's an **executable prompt** that ensures consistent, high-quality specs regardless of user input quality

---

chapter 5
---
/plan **transforms requirements → technical architecture while enforcing constitutional principles**

### executes `./setup-plan.sh`
- loads feature environment via `common.sh` (get_feature_paths)
- validates you're on proper feature branch (###-feature-name pattern)
- copies plan-template.md → specs/{branch}/plan.md
- outputs paths as JSON for AI to parse

## plan-template.md → plan.md + artifacts

### Core Concept
**plan-template.md** is a **phase orchestrator** that guides AI through technical design with validation gates. Unlike spec-template (strips tech details), plan-template **adds them back systematically** while enforcing constitution.

### The 9-Step Execution Flow

```
1. Load feature spec from Input path
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system
3. Fill Constitution Check section
4. Evaluate Constitution Check → Phase 0
   → If violations: Document in Complexity Tracking OR ERROR
5. Execute Phase 0 → research.md
   → Resolve all NEEDS CLARIFICATION
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, CLAUDE.md
7. Re-evaluate Constitution Check
   → If new violations: Refactor design, return to Phase 1
8. Plan Phase 2 → Describe task generation (DO NOT execute)
9. STOP - Ready for /tasks command
```

**Critical**: `/plan` stops at step 8. The `/tasks` command executes Phase 2.

### Dual-Gate Constitution Validation

**Gate 1 (Step 4): Before Research**
- Validates initial tech choices against principles
- Catches violations early (e.g., "needs 4 projects" vs "max 3 projects")
- Forces simplification OR justification

**Gate 2 (Step 7): After Design**
- Re-checks after contracts/data-model generated
- Catches complexity creep during design
- Ensures final architecture complies

**Example from 001-we-will-be:**
```markdown
**Initial Gate Status**: ✅ ALL CHECKS PASSED
- Static-First Export: client-side only ✅
- Component Testing (TDD): React Testing Library ✅
- Minimalism: Local storage (no IndexedDB premature optimization) ✅

**Final Gate Status**: ✅ ALL CHECKS PASSED
- Static Export: Design uses Local Storage, no server deps ✅
- Minimalism: No over-engineering (simple storage, Context state) ✅
```

### Phase 0: Research & Resolution

**Purpose**: Resolve all `NEEDS CLARIFICATION` from Technical Context

**Process**:
1. AI spawns research tasks for each unknown
2. Each decision documented with:
   - **Decision**: What was chosen
   - **Rationale**: Why chosen
   - **Alternatives Considered**: What else evaluated

**Example from research.md:**
```markdown
### Browser Storage Strategy
**Decision**: Use Local Storage with JSON serialization

**Rationale**:
- Simple API: localStorage.setItem/getItem
- Per-spec: "display storage errors directly to user"
- JSON handles complex objects (todos with nested tags)

**Alternatives Considered**:
- IndexedDB: Over-engineered for MVP
- SessionStorage: Rejected (data must persist across sessions)
```

**Output**: `specs/{branch}/research.md`

### Phase 1: Design & Contracts

**Purpose**: Generate concrete technical artifacts

**Artifacts Generated**:

#### 1. data-model.md
Entities extracted from spec.md FR requirements:
```markdown
### Todo Entity
- id: string (UUID v4)
- title: string - max 512 chars (from FR-001, FR-026)
- isCompleted: boolean (from FR-003)
- tagIds: string[] - multiple allowed (from FR-005)
- createdAt: string - immutable (from FR-029)

**State Transitions**:
Active → Completed → Deleted → Restored
```

#### 2. contracts/types.ts
TypeScript interfaces for client-side app:
```typescript
export interface Todo {
  id: string;
  title: string;  // max 512 characters
  description: string;  // max 5000 characters
  priority: Priority;
  tagIds: string[];
  createdAt: string;  // ISO 8601, immutable
}

export type Priority = 'low' | 'medium' | 'high';
```

#### 3. contracts/storage-api.ts
Storage contract with constitutional compliance:
```typescript
export interface StorageAPI {
  /**
   * Per FR-025: Display browser storage errors directly to user
   * @throws {QuotaExceededError} If storage limit reached
   */
  saveData(data: AppData): void;

  loadData(): AppData;
  clearData(): void;
}
```

#### 4. quickstart.md
Test scenarios from user stories:
```markdown
### Scenario 2: Create Todo with All Properties

**Steps**:
1. Click "Create Todo" button
2. Enter title: "Buy groceries"
3. Select tags: "shopping", "urgent"
4. Set priority: "High"
5. Submit form

**Expected Results**:
- [ ] Todo appears with all properties
- [ ] Tags show pleasant colors (FR-028)
- [ ] createdAt timestamp recorded (FR-029)
```

#### 5. CLAUDE.md (incremental update)
- Runs `update-agent-context.sh claude`
- Adds NEW tech from current plan
- Preserves manual additions between markers
- Keeps under 150 lines

### Phase 2: Task Planning Description

**Important**: AI only **describes** task generation strategy, doesn't create tasks.md

**Example from plan.md:**
```markdown
## Phase 2: Task Planning Approach

**Task Generation Strategy**:
1. Setup & Infrastructure (Sequential):
   - Initialize Next.js v14 with TypeScript
   - Configure static export
   - Install shadcn UI

2. Type & Contract Tasks (from contracts/):
   - Copy contracts/types.ts → lib/types.ts [P]
   - Create contract tests

3. Component Tasks (TDD - Red-Green-Refactor):
   - TodoForm: Test → Implement
   - TodoList: Test → Implement

**Ordering Strategy**:
- TDD order: Tests before implementation
- Dependencies: Models → Services → UI
- [P] marks parallel execution

**Estimated Total**: ~48 tasks (24 test + 24 implementation)
```

### Key Transformations

#### Spec FR → Data Model
```
FR-001: System MUST allow users to create todo with title (max 512 chars)
  ↓
data-model.md: title: string - Required, max 512 chars (from FR-001, FR-026)
  ↓
types.ts: title: string; /** max 512 characters */
```

#### User Story → Test Scenario
```
AS-2: Given user wants to create todo
      When they provide title, tags, priority
      Then todo is saved and appears in list
  ↓
quickstart.md:
  Steps: 1. Click button 2. Enter "Buy groceries" 3. Select tags...
  Expected: [ ] Todo appears [ ] Tags show colors [ ] Timestamp recorded
```

#### Edge Case → Research Decision
```
spec.md: "What happens when storage is full?"
         "Display browser error without custom handling"
  ↓
research.md:
  Decision: Display browser errors directly
  Implementation: throw error (don't catch QuotaExceededError)
  ↓
storage-api.ts:
  /** Per FR-025: Display errors directly @throws {QuotaExceededError} */
```

### Progress Tracking

**Real-time checklist updated during execution:**
```markdown
**Phase Status**:
- [x] Phase 0: Research complete ✅
- [x] Phase 1: Design complete ✅
- [x] Phase 2: Task planning described ✅
- [ ] Phase 3: Tasks generated (/tasks command) - NEXT STEP

**Gate Status**:
- [x] Initial Constitution Check: PASS ✅
- [x] Post-Design Constitution Check: PASS ✅
- [x] All NEEDS CLARIFICATION resolved ✅

**Artifacts Generated**:
- [x] plan.md, research.md, data-model.md
- [x] contracts/types.ts, contracts/storage-api.ts
- [x] quickstart.md, CLAUDE.md
```

### Insights

- **plan-template is a phase orchestrator**: Breaks technical planning into discrete phases with explicit inputs/outputs
- **Dual-gate validation prevents complexity creep**: Check before research (early) and after design (late)
- **NEEDS CLARIFICATION propagates**: spec.md unknowns → Technical Context → Phase 0 research → resolved decisions → contracts
- **Test-first by design**: Phase 1 generates failing contract tests BEFORE implementation (architectural TDD)
- **Traceability is enforced**: Every data model field, contract, test scenario references source FR requirement
- **The /plan boundary is explicit**: Steps 1-8 only, Phase 2 described but not executed—clear separation between /plan and /tasks
- **Scripts handle state, templates handle transformation**: setup-plan.sh manages filesystem, plan-template.md transforms spec → design artifacts

