
# Implementation Plan: Client-Side Todo List Application

**Branch**: `001-we-will-be` | **Date**: 2025-10-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-we-will-be/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
A client-side todo list application that allows users to create, manage, organize, and track tasks entirely in the browser. The app supports rich task metadata (title, description, due date/time, tags, categories, priorities), filtering/sorting capabilities, and soft deletion with recovery. All data persists in browser local storage for offline use. Built with Next.js v14 Pages Router, TypeScript, Tailwind CSS, and shadcn UI, deployed as a static site to GitHub Pages.

## Technical Context
**Language/Version**: TypeScript (latest stable with Next.js v14)
**Primary Dependencies**: Next.js v14 (Pages Router), React 18, Tailwind CSS, shadcn UI components
**Storage**: Browser Local Storage / IndexedDB (client-side only, no backend)
**Testing**: React Testing Library, Jest (component tests with TDD approach)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge), deployed to GitHub Pages as static site
**Project Type**: single (frontend-only, static export)
**Performance Goals**: Fast initial page load (<2s), smooth UI interactions (60fps), instant data persistence to local storage
**Constraints**: Fully offline-capable, no server-side code, static export compatible, storage errors displayed directly to user
**Scale/Scope**: Single-user application, unlimited todos (within browser storage limits), 10-15 UI screens/components

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Principle I: Static-First Export**
- ✅ PASS - Feature is fully client-side, no server-side rendering needed
- ✅ PASS - No API routes in Next.js, all data operations client-side
- ✅ PASS - Compatible with `output: 'export'` for GitHub Pages deployment

**Principle II: Component Testing (NON-NEGOTIABLE)**
- ✅ PASS - Will follow TDD approach with component tests before implementation
- ✅ PASS - React Testing Library will be used for all component tests
- ✅ PASS - Red-Green-Refactor cycle will be enforced

**Principle III: Minimalism**
- ✅ PASS - Simple local storage for data persistence (no premature optimization to IndexedDB)
- ✅ PASS - Using established libraries (shadcn UI) instead of custom components
- ✅ PASS - No unnecessary abstractions or speculative features

**Principle IV: Iterative Development**
- ✅ PASS - Feature can be deployed incrementally (basic CRUD → filtering → sorting)
- ✅ PASS - Each iteration produces deployable, working application
- ✅ PASS - GitHub Actions CI/CD will enable continuous deployment

**Principle V: Styling & UI Standards**
- ✅ PASS - Using Tailwind CSS utility-first approach
- ✅ PASS - Using shadcn UI component library as foundation
- ✅ PASS - Components will be responsive and accessible

**Development Constraints**
- ✅ PASS - Next.js v14 with Pages Router (not App Router)
- ✅ PASS - Static export configuration (`output: 'export'`)
- ✅ PASS - React Testing Library with `data-testid` selectors
- ✅ PASS - Tailwind CSS for all styling
- ✅ PASS - Deterministic tests (no if-else, no try-catch in tests)

**Deployment Requirements**
- ✅ PASS - GitHub Actions workflow will deploy to GitHub Pages
- ✅ PASS - Component tests will run before deployment
- ✅ PASS - Static asset optimization for hosting

**Initial Gate Status**: ✅ ALL CHECKS PASSED - No constitutional violations detected

**Post-Design Re-evaluation** (after Phase 1):
- ✅ Static Export: Design uses Local Storage (client-side), no server dependencies
- ✅ Component Testing: Contracts define clear interfaces for TDD
- ✅ Minimalism: No over-engineering detected (simple storage, React Context state, no extra deps)
- ✅ Iterative: Design supports incremental deployment (basic CRUD → filters → sorts)
- ✅ Styling: Tailwind + shadcn UI maintained throughout design

**Final Gate Status**: ✅ ALL CHECKS PASSED - Design complies with constitution

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
pages/
├── _app.tsx              # Next.js app wrapper with providers
├── _document.tsx         # Custom HTML document
├── index.tsx             # Main todo list page
└── api/                  # Empty (no API routes for static export)

components/
├── TodoForm.tsx          # Create/edit todo form
├── TodoList.tsx          # Todo list display
├── TodoItem.tsx          # Individual todo item
├── TodoFilters.tsx       # Filter controls
├── TodoSort.tsx          # Sort controls
├── CategoryManager.tsx   # Category CRUD
├── TagManager.tsx        # Tag CRUD
└── ui/                   # shadcn UI components

lib/
├── storage.ts            # Local storage operations
├── types.ts              # TypeScript interfaces
└── utils.ts              # Helper functions

__tests__/
├── components/           # Component tests (React Testing Library)
└── lib/                  # Unit tests for utilities

public/
└── static assets

styles/
└── globals.css           # Tailwind CSS imports

.github/
└── workflows/
    └── deploy.yml        # GitHub Pages deployment
```

**Structure Decision**: Single Next.js project with Pages Router. All code in root directory following Next.js conventions. Components are organized by function (form, list, filters). Storage logic isolated in `lib/` directory. Tests mirror source structure in `__tests__/` directory.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
1. **Setup & Infrastructure Tasks** (Sequential):
   - Initialize Next.js v14 with Pages Router, TypeScript, Tailwind CSS
   - Configure static export (`output: 'export'`) in next.config.js
   - Install and configure shadcn UI
   - Setup React Testing Library and Jest
   - Create project structure (components/, lib/, __tests__/)

2. **Type & Contract Tasks** (from contracts/):
   - Copy contracts/types.ts → lib/types.ts [P]
   - Copy contracts/storage-api.ts → lib/storage.ts (adapt for implementation) [P]
   - Create contract test for storage operations

3. **Core Storage Implementation** (TDD):
   - Write storage test (LocalStorageAPI.test.ts) - MUST FAIL
   - Implement LocalStorageAPI to pass tests
   - Write data validation tests - MUST FAIL
   - Implement validation functions to pass tests

4. **State Management** (TDD):
   - Write TodoContext test (TodoContext.test.tsx) - MUST FAIL
   - Implement TodoContext with useReducer
   - Write reducer tests for each action type - MUST FAIL
   - Implement reducer logic to pass tests

5. **Component Tasks** (TDD - each component follows Red-Green-Refactor):
   - TodoForm: Test → Implement (create/edit form with validation)
   - TodoItem: Test → Implement (display single todo with actions)
   - TodoList: Test → Implement (display filtered/sorted todo collection)
   - TodoFilters: Test → Implement (filter controls for tags/categories/priority/date)
   - TodoSort: Test → Implement (sort controls, single criterion)
   - CategoryManager: Test → Implement (CRUD for categories)
   - TagManager: Test → Implement (CRUD for tags with color assignment)

6. **Page Integration** (TDD):
   - Write index.tsx test (main page integration) - MUST FAIL
   - Implement index.tsx to pass tests
   - Write _app.tsx test (context provider) - MUST FAIL
   - Implement _app.tsx to pass tests

7. **Integration Tests** (from quickstart.md):
   - Each quickstart scenario → integration test
   - Test complete user flows (create → edit → delete → restore)
   - Test filter combinations
   - Test sort criterion switching

8. **Deployment Setup**:
   - Create GitHub Actions workflow (.github/workflows/deploy.yml)
   - Configure GitHub Pages deployment
   - Add test execution to CI pipeline
   - Verify static export builds successfully

**Ordering Strategy**:
- **Sequential Dependencies**: Infrastructure → Storage → State → Components → Pages → Deployment
- **Parallel Opportunities** [P]:
  - Type definitions (independent files)
  - Individual component tests (after context is ready)
  - Contract tests (after types are defined)
- **TDD Enforcement**:
  - Every component/function task pairs: "Write test (MUST FAIL)" → "Implement to pass test"
  - Tests MUST be written before implementation (constitutional requirement)

**Task Breakdown by Type**:
- Setup/Config: ~8 tasks
- Storage Layer: ~6 tasks (3 test, 3 implementation)
- State Management: ~4 tasks (2 test, 2 implementation)
- Components: ~14 tasks (7 components × 2 tasks each: test + implement)
- Pages: ~4 tasks (2 pages × 2 tasks each: test + implement)
- Integration: ~8 tasks (key quickstart scenarios)
- Deployment: ~4 tasks

**Estimated Total**: ~48 tasks (24 test tasks + 24 implementation/config tasks)

**Success Criteria**:
- All component tests pass (100% of components tested)
- All integration scenarios from quickstart.md validated
- Static export builds without errors
- Application deploys to GitHub Pages successfully
- No constitutional violations

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command) ✅
- [x] Phase 1: Design complete (/plan command) ✅
- [x] Phase 2: Task planning complete (/plan command - describe approach only) ✅
- [ ] Phase 3: Tasks generated (/tasks command) - NEXT STEP
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS ✅
- [x] Post-Design Constitution Check: PASS ✅
- [x] All NEEDS CLARIFICATION resolved ✅ (Technical Context fully specified)
- [x] Complexity deviations documented ✅ (None - no violations)

**Artifacts Generated**:
- [x] plan.md (this file)
- [x] research.md
- [x] data-model.md
- [x] contracts/types.ts
- [x] contracts/storage-api.ts
- [x] quickstart.md
- [x] CLAUDE.md (updated)

**Ready for /tasks command**: ✅ All prerequisites complete

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*
