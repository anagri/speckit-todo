# Spec Kit Deep Dive: Architecture to Adaptation

**Tutorial Premise**: Building "DebtTrack" - a CLI tool for cataloging and analyzing technical debt across codebases.

---

## Chapter 1: Architectural Foundation

### What Spec Kit Actually Is

Spec Kit is a **specification-to-code transformation pipeline** with three architectural layers:

1. **Template Engine** - Markdown documents with embedded execution logic
2. **Script Orchestration** - Shell scripts managing git/filesystem state
3. **LLM Constraint System** - Structured prompts that bound AI behavior

**Key Insight**: It's not just templates - it's executable specifications with validation gates.

### Core Components Deep Dive

```
.specify/
├── memory/constitution.md          # Immutable principles (runtime constraints)
├── scripts/{bash,powershell}/      # State management automation
│   ├── common.sh                   # Path resolution, git/non-git detection
│   ├── create-new-feature.sh       # Branch + spec scaffolding
│   ├── setup-plan.sh               # Plan template initialization
│   └── check-prerequisites.sh      # Validation + path discovery
└── templates/
    ├── spec-template.md            # Requirements (no tech stack)
    ├── plan-template.md            # Architecture + research
    ├── tasks-template.md           # Executable task breakdown
    └── commands/*.md               # Slash command implementations
```

**Under the Hood: Command Execution Flow**

When you invoke `/specify "Build debt tracking"`:

```mermaid
User → AI Agent → Parse Command → Extract $ARGUMENTS
                      ↓
              Run {SCRIPT} (create-new-feature.sh)
                      ↓
        JSON Output: {BRANCH_NAME, SPEC_FILE, FEATURE_NUM}
                      ↓
              Load spec-template.md
                      ↓
        Fill placeholders, mark [NEEDS CLARIFICATION]
                      ↓
              Write to SPEC_FILE
                      ↓
              Return completion status
```

**Critical Details**:
- Scripts run **exactly once** per command
- Communication via JSON (no side effects)
- Git branch creation OR non-git directory detection
- Path resolution uses `get_feature_paths()` from `common.sh`

---

## Chapter 2: Hands-On Setup

### Installation Deep Dive

```bash
# Persistent installation (recommended for extension)
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# What this actually does:
# 1. Downloads Python package with httpx, typer, rich dependencies
# 2. Installs to ~/.local/share/uv/tools/specify-cli
# 3. Creates symlink in ~/.local/bin/specify
# 4. Template downloads happen at RUNTIME, not install time
```

### Initialize DebtTrack Project

```bash
specify init debt-track --ai claude --script sh

# Under the hood sequence:
# 1. Fetch GitHub releases API (with rate limiting)
# 2. Download spec-kit-template-claude-sh-vX.Y.Z.zip
# 3. Extract to debt-track/ with nested dir flattening
# 4. chmod +x on .specify/scripts/**/*.sh recursively
# 5. git init + initial commit (if git available)
# 6. Display agent folder security warning
```

**Key Files Created**:
```bash
debt-track/
├── .specify/                    # The "kernel" of Spec Kit
│   ├── memory/constitution.md  # Empty template (you fill this)
│   ├── scripts/bash/           # State management tools
│   └── templates/              # Spec/plan/task templates
├── .claude/commands/           # Agent-specific slash commands
└── specs/                      # Future: 001-track-debt/
```

### Multi-Agent Architecture

The `--ai` flag determines which command directory:

| Agent | Directory | Format | Argument Style |
|-------|-----------|--------|----------------|
| Claude | `.claude/commands/*.md` | Markdown | `$ARGUMENTS` |
| Gemini | `.gemini/commands/*.toml` | TOML | `{{args}}` |
| Copilot | `.github/prompts/*.prompt.md` | Markdown | `$ARGUMENTS` |

**Extension Point**: Add your own agent by:
1. Create `templates/commands/your-agent/*.md`
2. Update `create-release-packages.sh` with new case
3. Define argument interpolation style

---

## Chapter 3: Constitutional Layer

### Why This Matters

The constitution is **runtime enforcement**, not documentation. Every `/plan` execution validates against it.

### Hands-On: Define DebtTrack Constitution

```bash
cd debt-track
claude # or your AI agent
```

```
/constitution Define principles for DebtTrack:
1. CLI-First: Every operation must be invokable from command line with --json output
2. Zero-Config: Should work without configuration file, but allow .debttrack.toml override
3. Test-First: All analysis logic must have unit tests with realistic code samples
4. Incremental: Must handle partial codebase scans without full reanalysis
5. Observable: All operations must log to structured JSON for debugging
```

**What Happens Under the Hood**:

The AI agent:
1. Loads `/memory/constitution.md` template
2. Identifies placeholders: `[PROJECT_NAME]`, `[PRINCIPLE_1_NAME]`, etc.
3. Replaces with concrete values:
   - `[PROJECT_NAME]` → DebtTrack
   - `[PRINCIPLE_1_NAME]` → CLI-First
   - `[PRINCIPLE_1_DESCRIPTION]` → Every operation must be...
4. Sets `[CONSTITUTION_VERSION]` → 1.0.0 (initial)
5. Sets `[RATIFICATION_DATE]` → today
6. Writes to `/memory/constitution.md`
7. Generates sync impact report (HTML comment)

**Resulting Constitution**:
```markdown
# DebtTrack Constitution

## Core Principles

### I. CLI-First
Every operation must be invokable from command line with --json output.
Rationale: Enables scripting, CI/CD integration, and automation.

### II. Zero-Config
Should work without configuration file, but allow .debttrack.toml override.
Rationale: Minimize barrier to adoption; configuration is optional refinement.

...

## Governance
This constitution is immutable during implementation phases. Amendments require:
- Version bump (MAJOR for breaking changes)
- Documented rationale
- Update to all dependent templates

**Version**: 1.0.0 | **Ratified**: 2025-01-15 | **Last Amended**: 2025-01-15
```

### How This Enforces Behavior

In `plan-template.md`, you'll find:

```markdown
## Constitution Check
*GATE: Must pass before Phase 0 research*

### CLI-First Check
- [ ] All operations exposed via CLI commands?
- [ ] JSON output mode implemented?

### Zero-Config Check
- [ ] Works without config file?
- [ ] Optional config clearly documented?
```

**If gates fail**: LLM must either refactor design OR document in Complexity Tracking with justification.

---

## Chapter 4: Specification Phase

### The Core Transformation

Specification converts **user intent → testable requirements** without technical decisions.

### Hands-On: Create Debt Tracking Spec

```
/specify Build a CLI tool that scans Python codebases for technical debt markers (TODO, FIXME, XXX comments) and generates reports showing debt concentration by file, author, and age. Should support filtering by severity and exporting to JSON/CSV/HTML formats.
```

**Under the Hood Execution**:

1. **Script Execution** (`create-new-feature.sh`):
   ```bash
   # Finds highest existing spec number
   HIGHEST=0
   for dir in specs/*; do
     number=$(echo "$dirname" | grep -o '^[0-9]\+')
     # ... find max
   done
   NEXT=$((HIGHEST + 1))
   FEATURE_NUM=001  # First feature
   
   # Create branch from description
   BRANCH_NAME="001-debt-tracking"
   git checkout -b 001-debt-tracking
   
   # Create directory + copy template
   mkdir -p specs/001-debt-tracking
   cp .specify/templates/spec-template.md specs/001-debt-tracking/spec.md
   
   # Output JSON for AI to parse
   echo '{"BRANCH_NAME":"001-debt-tracking","SPEC_FILE":"specs/001-debt-tracking/spec.md","FEATURE_NUM":"001"}'
   ```

2. **Template Processing** by AI:
   - Loads `spec-template.md`
   - Executes embedded execution flow
   - Fills sections from user description
   - Marks ambiguities with `[NEEDS CLARIFICATION: ...]`

3. **Generated Spec** (excerpt):
   ```markdown
   # Feature Specification: Technical Debt Tracking CLI
   
   **Feature Branch**: `001-debt-tracking`
   **Created**: 2025-01-15
   **Status**: Draft
   
   ## User Scenarios & Testing
   
   ### Primary User Story
   As a development team lead, I want to quantify technical debt across our codebase
   so I can prioritize refactoring efforts and track debt trends over time.
   
   ### Acceptance Scenarios
   1. **Given** a Python repository with 50 TODO comments
      **When** I run `debttrack scan .`
      **Then** I see a report showing 50 items grouped by file
   
   2. **Given** historical scan results
      **When** I run `debttrack report --trend`
      **Then** I see debt count changes over time
   
   ## Requirements
   
   ### Functional Requirements
   - **FR-001**: System MUST scan Python files for comment markers (TODO, FIXME, XXX)
   - **FR-002**: System MUST extract author from git blame for each marker
   - **FR-003**: System MUST calculate age of debt from commit date
   - **FR-004**: Users MUST be able to filter by severity [NEEDS CLARIFICATION: How is severity determined? Tag-based? Pattern-based?]
   - **FR-005**: System MUST export reports to JSON, CSV, HTML formats
   - **FR-006**: System MUST persist scan results for trend analysis
   
   ### Key Entities
   - **DebtItem**: Represents a single technical debt marker with file path, line number, content, author, age, severity
   - **ScanResult**: Aggregation of all DebtItems from a scan with timestamp, repo metadata
   - **Report**: Formatted output with grouping and filtering applied
   ```

### The Clarification Gate

Notice `FR-004` has `[NEEDS CLARIFICATION]`. This is **intentional friction** - prevents the AI from making assumptions.

**You can now run** (optional but recommended):
```
/clarify
```

This triggers sequential Q&A:

```
Q1: How should severity be determined for debt items?
| Option | Description |
|--------|-------------|
| A | Tag-based: parse severity from comment (e.g., TODO(high): ...) |
| B | Pattern-based: keyword matching (FIXME=high, TODO=medium, XXX=low) |
| C | Manual: require severity flag in scan command |
| Short | Provide different approach (≤5 words) |

[You answer: B]

✓ Updating spec with clarification...

Q2: Should the tool track debt resolution (when items are fixed)?
...
```

Each answer is **immediately integrated** into the spec:
- Appends to `## Clarifications` section
- Updates relevant requirement (e.g., FR-004 now specifies pattern-based)
- Validates no contradictions remain

---

## Chapter 5: Planning Phase

### From What to How

Planning transforms **requirements → technical architecture** while validating constitutional compliance.

### Hands-On: Generate Implementation Plan

```
/plan Use Python 3.11+ with Click for CLI, SQLite for persistence, Jinja2 for HTML reports. No external API dependencies. Target: single-file distribution via PyInstaller eventually, but develop as standard package initially.
```

**Under the Hood: The Research Phase**

1. **Script Execution** (`setup-plan.sh`):
   ```bash
   # Copies plan-template.md to specs/001-debt-tracking/plan.md
   cp .specify/templates/plan-template.md "$IMPL_PLAN"
   
   # Outputs paths as JSON
   echo '{"FEATURE_SPEC":"...spec.md","IMPL_PLAN":"...plan.md","SPECS_DIR":"specs/001-debt-tracking"}'
   ```

2. **Template Execution Flow** (from `plan-template.md`):
   ```
   1. Load feature spec from Input path
   2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   3. Fill Constitution Check section
   4. Evaluate Constitution Check → Phase 0
   5. Execute Phase 0 → research.md
   6. Execute Phase 1 → contracts, data-model.md, quickstart.md
   7. Re-evaluate Constitution Check
   8. Plan Phase 2 (DO NOT execute)
   9. STOP
   ```

3. **Phase 0: Research Generation**

The AI spawns parallel research tasks:

```markdown
# research.md

## Decision Log

### CLI Framework
**Decision**: Click (not argparse)
**Rationale**: 
- Decorator-based syntax aligns with modern Python
- Built-in support for nested commands
- Better error messages
**Alternatives Considered**:
- argparse: Too verbose for complex CLIs
- typer: Excellent but adds pydantic dependency (violates Zero-Config)

### Persistence Strategy
**Decision**: SQLite with single-file database
**Rationale**:
- Zero-Config principle: no external DB setup
- Atomic writes for concurrent scans
- Full SQL for complex trend queries
**Alternatives Considered**:
- JSON files: Poor for aggregation queries
- PostgreSQL: Violates Zero-Config principle

### Git Integration
**Decision**: gitpython library
**Rationale**:
- Need blame info for author extraction
- Need commit dates for age calculation
**Constraints**:
- Must handle repos without git gracefully (scan only, no author/age)
```

4. **Phase 1: Contract Generation**

Creates `contracts/cli-spec.yaml`:
```yaml
commands:
  scan:
    args:
      path: "Directory to scan (default: .)"
    options:
      --format: "Output format (json|csv|html|table)"
      --output: "Write to file instead of stdout"
    output_schema:
      items:
        type: array
        items:
          type: object
          properties:
            file: string
            line: integer
            marker: string
            content: string
            author: string
            age_days: integer
            severity: string
    example: |
      $ debttrack scan src/ --format json
      {
        "items": [
          {"file": "src/main.py", "line": 42, "marker": "TODO", ...}
        ],
        "summary": {"total": 15, "by_severity": {"high": 2, "medium": 10, "low": 3}}
      }

  report:
    args:
      result_ids: "List of scan IDs to include (default: latest)"
    options:
      --trend: "Show debt changes over time"
      --group-by: "Group by (file|author|severity)"
    output_schema: # ...
```

5. **Data Model Generation**

Creates `data-model.md`:
```markdown
# Data Model: DebtTrack

## Entities

### DebtItem
**Purpose**: Represents a single detected debt marker
**Storage**: `debt_items` table in SQLite

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Auto-increment ID |
| scan_id | INTEGER | FOREIGN KEY(scans.id) | Parent scan |
| file_path | TEXT | NOT NULL | Relative path from repo root |
| line_number | INTEGER | NOT NULL | Line number in file |
| marker_type | TEXT | NOT NULL | TODO/FIXME/XXX |
| content | TEXT | NOT NULL | Full comment text |
| author | TEXT | NULL | From git blame (null if no git) |
| commit_date | TEXT | NULL | ISO timestamp (null if no git) |
| severity | TEXT | NOT NULL | high/medium/low (computed) |

**Indexes**:
- `idx_scan_severity` ON (scan_id, severity) - For filtering
- `idx_file_path` ON (file_path) - For grouping

### Scan
**Purpose**: Represents a single scan execution
**Storage**: `scans` table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Auto-increment ID |
| timestamp | TEXT | NOT NULL | ISO timestamp of scan |
| repo_path | TEXT | NOT NULL | Scanned directory |
| repo_name | TEXT | NULL | From git remote (null if no git) |
| total_items | INTEGER | NOT NULL | Count of debt items |
| summary_json | TEXT | NOT NULL | JSON blob with groupings |

**Relationships**:
- One Scan → Many DebtItems (one-to-many)
```

6. **Constitution Re-Check**

The AI validates against principles:

```markdown
## Constitution Check (Post-Design)

### CLI-First Check
- [x] All operations exposed via CLI commands
- [x] JSON output mode for programmatic use
- [x] Human-readable table format as default

### Zero-Config Check
- [x] SQLite database auto-created in ~/.debttrack/db.sqlite
- [x] Works without any configuration file
- [ ] Optional .debttrack.toml for custom marker patterns
  → DEFERRED: Not in MVP scope, add in follow-up feature

### Test-First Check
- [x] Contract tests defined for CLI commands
- [x] Integration tests for scan → report flow
- [x] Unit tests for severity classification
```

**If violations exist**: AI must document in Complexity Tracking OR refactor.

7. **Agent Context Update**

Executes `update-agent-context.sh`:
```bash
# Extracts tech stack from plan.md
NEW_LANG="Python 3.11"
NEW_FRAMEWORK="Click"
NEW_DB="SQLite"

# Updates CLAUDE.md (or other agent file)
# Adds to "Active Technologies" section:
# - Python 3.11 + Click (001-debt-tracking)
# Updates "Recent Changes":
# - 001-debt-tracking: Added Python 3.11 + Click

# Preserves manual additions between markers:
# <!-- MANUAL ADDITIONS START -->
# [your custom notes here]
# <!-- MANUAL ADDITIONS END -->
```

### Generated Artifacts

```
specs/001-debt-tracking/
├── spec.md           # Requirements (from /specify)
├── plan.md           # Architecture + decisions
├── research.md       # Tech choices with rationale
├── data-model.md     # Entities + schema
├── quickstart.md     # Validation scenarios
└── contracts/
    └── cli-spec.yaml # API contract
```

---

## Chapter 6: Task Generation

### Breaking Down Work

The `/tasks` command converts design documents → executable task list with dependencies.

### Hands-On: Generate Tasks

```
/tasks
```

**Under the Hood**:

1. **Prerequisite Check** (`check-prerequisites.sh`):
   ```bash
   # Validates plan.md exists, returns available docs
   echo '{
     "FEATURE_DIR": "specs/001-debt-tracking",
     "AVAILABLE_DOCS": ["research.md", "data-model.md", "contracts/cli-spec.yaml", "quickstart.md"]
   }'
   ```

2. **Task Derivation Algorithm**:

The AI follows `tasks-template.md` execution flow:

```python
# Pseudocode of what the AI does:

contracts = load_contracts_from("contracts/")
data_model = load_entities_from("data-model.md")
plan = load_tech_stack_from("plan.md")

tasks = []

# Phase 1: Setup
tasks.append(Task("T001", "Create project structure (src/, tests/, README)"))
tasks.append(Task("T002", "Initialize Python package with Click, SQLite"))
tasks.append(Task("T003", "[P] Configure linting (ruff, black)"))

# Phase 2: Tests First (TDD)
for contract in contracts.commands:
    tasks.append(Task(
        f"T{next_id}", 
        f"[P] Contract test for {contract.name} in tests/contract/test_{contract.name}.py",
        must_fail_before_implementation=True
    ))

for entity in data_model.entities:
    tasks.append(Task(
        f"T{next_id}",
        f"[P] Integration test for {entity.name} CRUD in tests/integration/test_{entity.name}.py"
    ))

# Phase 3: Core Implementation
for entity in data_model.entities:
    tasks.append(Task(
        f"T{next_id}",
        f"[P] Create {entity.name} model in src/models/{entity.name.lower()}.py"
    ))

# Services come after models (dependency)
tasks.append(Task("T015", "Create Scanner service in src/services/scanner.py", depends_on=["T012"]))

# CLI after services
for command in contracts.commands:
    tasks.append(Task(
        f"T{next_id}",
        f"Implement `debttrack {command.name}` in src/cli/{command.name}.py",
        depends_on=service_tasks
    ))

# Phase 4: Integration
tasks.append(Task("T025", "Connect Scanner to SQLite persistence", depends_on=["T015", "T012"]))

# Phase 5: Polish
tasks.append(Task("T030", "[P] Unit tests for severity classifier"))
```

3. **Parallelization Rules**:

```markdown
[P] marker means:
1. Different files being modified
2. No shared state
3. No dependency on each other

Example:
- T004 [P] Contract test CLI scan
- T005 [P] Contract test CLI report
→ Can run simultaneously (different test files)

But NOT:
- T015 Create Scanner service
- T016 Implement scan command (uses Scanner)
→ T016 depends on T015
```

4. **Generated tasks.md**:

```markdown
# Tasks: Technical Debt Tracking CLI

## Phase 3.1: Setup
- [ ] T001 Create project structure (src/, tests/, scripts/)
- [ ] T002 Initialize Python package with Click>=8.0, gitpython, jinja2
- [ ] T003 [P] Configure ruff + black in pyproject.toml

## Phase 3.2: Tests First ⚠️ MUST COMPLETE BEFORE 3.3
- [ ] T004 [P] Contract test `debttrack scan` in tests/contract/test_scan_command.py
- [ ] T005 [P] Contract test `debttrack report` in tests/contract/test_report_command.py
- [ ] T006 [P] Integration test scan → persist in tests/integration/test_scan_flow.py
- [ ] T007 [P] Integration test historical reporting in tests/integration/test_trends.py

## Phase 3.3: Core Implementation
- [ ] T008 [P] DebtItem model + schema in src/models/debt_item.py
- [ ] T009 [P] Scan model + schema in src/models/scan.py
- [ ] T010 [P] Database setup script in src/db/init.py
- [ ] T011 Severity classifier in src/analysis/severity.py
- [ ] T012 File scanner (regex-based) in src/scanner/file_scanner.py
- [ ] T013 Git integration (blame/dates) in src/scanner/git_scanner.py
- [ ] T014 Scanner orchestrator in src/services/scanner.py (depends on T011-T013)
- [ ] T015 Report generator in src/services/reporter.py
- [ ] T016 CLI `scan` command in src/cli/scan.py (depends on T014)
- [ ] T017 CLI `report` command in src/cli/report.py (depends on T015)
- [ ] T018 Main CLI entry point in src/cli/main.py

## Phase 3.4: Integration
- [ ] T019 Connect Scanner to SQLite in src/services/scanner.py (depends on T010)
- [ ] T020 HTML template for reports in templates/report.html
- [ ] T021 CSV export formatter in src/formatters/csv_formatter.py
- [ ] T022 Error handling + logging setup

## Phase 3.5: Polish
- [ ] T023 [P] Unit tests for severity classifier in tests/unit/test_severity.py
- [ ] T024 [P] Unit tests for git integration in tests/unit/test_git_scanner.py
- [ ] T025 Performance test (scan 1000 files <5s) in tests/perf/test_scan_performance.py
- [ ] T026 [P] Update README with usage examples
- [ ] T027 Add type hints + mypy validation
- [ ] T028 Run quickstart.md validation scenarios

## Dependencies
- T008-T010 block T011-T014 (models before logic)
- T011-T013 block T014 (scanner needs classifiers + parsers)
- T014 blocks T016 (scan command needs scanner)
- T015 blocks T017 (report command needs reporter)
- Implementation (T008-T018) blocks polish (T023-T028)

## Parallel Execution Example
```bash
# After T001-T003 complete, launch test tasks together:
# (Assuming Task agent supports parallel execution)

Task: "Contract test debttrack scan in tests/contract/test_scan_command.py"
Task: "Contract test debttrack report in tests/contract/test_report_command.py"
Task: "Integration test scan flow in tests/integration/test_scan_flow.py"
Task: "Integration test trends in tests/integration/test_trends.py"

# All four can run simultaneously - different test files, no shared state
```
```

---

## Chapter 7: Implementation Execution

### The Execution Model

`/implement` is the **task executor** that processes `tasks.md` sequentially/parallel while tracking progress.

### Hands-On: Execute Implementation

```
/implement
```

**Under the Hood Flow**:

1. **Load Artifacts**:
   ```python
   plan = load("specs/001-debt-tracking/plan.md")
   tasks = parse_tasks("specs/001-debt-tracking/tasks.md")
   data_model = load("specs/001-debt-tracking/data-model.md")
   contracts = load("specs/001-debt-tracking/contracts/")
   ```

2. **Build Dependency Graph**:
   ```python
   graph = {}
   for task in tasks:
       deps = extract_dependencies(task.description, tasks)
       graph[task.id] = {
           'task': task,
           'depends_on': deps,
           'parallel_ok': '[P]' in task.description,
           'status': 'pending'
       }
   ```

3. **Execution Loop**:
   ```python
   while incomplete_tasks_exist(graph):
       # Find ready tasks (dependencies satisfied)
       ready = [t for t in graph.values() 
                if t['status'] == 'pending' 
                and all(graph[dep]['status'] == 'done' for dep in t['depends_on'])]
       
       # Group parallel tasks
       parallel_group = [t for t in ready if t['parallel_ok']]
       sequential = [t for t in ready if not t['parallel_ok']]
       
       # Execute parallel tasks (in practice, AI does these one-by-one but reports as batch)
       for task in parallel_group[:3]:  # Process up to 3 at once
           execute_task(task)
           mark_complete_in_tasks_md(task)
       
       # Execute first sequential task
       if sequential:
           execute_task(sequential[0])
           mark_complete_in_tasks_md(sequential[0])
   ```

4. **Task Execution Detail** (T004 example):

The AI:
1. Reads contract specification from `contracts/cli-spec.yaml`
2. Creates `tests/contract/test_scan_command.py`:
   ```python
   # tests/contract/test_scan_command.py
   import subprocess
   import json
   import pytest
   from pathlib import Path
   
   def test_scan_json_output_schema():
       """Contract test: scan command produces valid JSON with expected schema"""
       # Create test repo with sample file
       test_dir = Path("test_repo")
       test_dir.mkdir()
       (test_dir / "sample.py").write_text("# TODO: refactor this\nprint('hello')")
       
       # Execute command
       result = subprocess.run(
           ["debttrack", "scan", str(test_dir), "--format", "json"],
           capture_output=True,
           text=True
       )
       
       # This MUST fail initially (no implementation yet)
       assert result.returncode == 0, "Command should succeed"
       
       # Validate schema
       data = json.loads(result.stdout)
       assert "items" in data
       assert isinstance(data["items"], list)
       
       if data["items"]:
           item = data["items"][0]
           assert "file" in item
           assert "line" in item
           assert "marker" in item  # TODO/FIXME/XXX
           assert "content" in item
           assert "severity" in item  # high/medium/low
   
   def test_scan_table_output_format():
       """Contract test: scan command produces human-readable table"""
       # Similar test but checks table format instead of JSON
       ...
   ```

3. Runs the test: `pytest tests/contract/test_scan_command.py`
4. **Confirms it fails** (TDD requirement)
5. Marks `[X]` in tasks.md:
   ```markdown
   - [X] T004 [P] Contract test `debttrack scan` in tests/contract/test_scan_command.py
   ```

6. Moves to next task (T005, also parallel-safe)

**After Phase 3.2 Complete** (all tests written and failing), moves to implementation:

For T016 (Implement scan command):
```python
# src/cli/scan.py
import click
from pathlib import Path
from ..services.scanner import Scanner
from ..formatters import json_formatter, table_formatter

@click.command()
@click.argument('path', type=click.Path(exists=True), default='.')
@click.option('--format', type=click.Choice(['json', 'csv', 'html', 'table']), default='table')
@click.option('--output', type=click.File('w'), help='Write to file instead of stdout')
def scan(path, format, output):
    """Scan a directory for technical debt markers"""
    scanner = Scanner()
    result = scanner.scan(Path(path))
    
    # Format output
    if format == 'json':
        formatted = json_formatter.format(result)
    elif format == 'table':
        formatted = table_formatter.format(result)
    # ... other formatters
    
    # Write output
    if output:
        output.write(formatted)
    else:
        click.echo(formatted)
```

7. **Verification**: Reruns contract tests to confirm they now pass
8. Reports progress to user

### Error Handling

If a task fails:
```
âš  T016 FAILED: Import error in src/services/scanner.py

Error details:
  ModuleNotFoundError: No module named 'gitpython'

Suggested fix:
  1. Check pyproject.toml includes gitpython dependency
  2. Run: pip install -e .
  3. Retry task

Halting execution. Resolve error and re-run /implement to continue.
```

---

## Chapter 8: Extension & Adaptation

### Understanding Extension Points

Spec Kit is designed for modification at **four levels**:

1. **Template Level** - Modify markdown templates
2. **Script Level** - Enhance automation scripts
3. **Command Level** - Add new slash commands
4. **Constitution Level** - Enforce custom principles

### Extension 1: Custom Validation Command

**Goal**: Add `/validate` command that runs linting + tests + quickstart validation.

#### Step 1: Create Command Template

```bash
cd debt-track/.specify/templates/commands
cat > validate.md << 'EOF'
---
description: Run comprehensive validation (linting, tests, quickstart scenarios)
scripts:
  sh: scripts/bash/check-prerequisites.sh --json --require-tasks
  ps: scripts/powershell/check-prerequisites.ps1 -Json -RequireTasks
---

User input: $ARGUMENTS

1. Run `{SCRIPT}` to get FEATURE_DIR and validate tasks.md exists
2. Load plan.md to determine tech stack and linting tools
3. Execute validation pipeline:
   - Run linting (e.g., `ruff check src/`)
   - Run tests: `pytest tests/ -v`
   - Load and execute scenarios from quickstart.md
4. Generate validation report with pass/fail status
5. If any failures, halt and show detailed errors
6. If all pass, mark feature as validated in progress tracking
EOF
```

#### Step 2: Update Agent Commands

For Claude:
```bash
cp .specify/templates/commands/validate.md .claude/commands/validate.md
```

For other agents, convert format as needed (TOML for Gemini, etc.)

#### Step 3: Test Your Command

```
/validate
```

Expected behavior:
1. AI runs prerequisite check script
2. Determines you're using Python + ruff
3. Executes: `ruff check src/`
4. Executes: `pytest tests/`
5. Parses `quickstart.md` for validation scenarios
6. Reports results

### Extension 2: Custom Constitutional Principle

**Goal**: Enforce "Performance-First" - all operations must complete in <100ms for typical repos.

#### Step 1: Update Constitution

```
/constitution Add new principle:
VI. Performance-First: All CLI operations must complete in <100ms for repos with <1000 files. Operations on larger repos must show progress indicators and support --async flag for background execution.
```

#### Step 2: Update Plan Template

```bash
vim .specify/templates/plan-template.md
```

Add to Constitution Check section:
```markdown
### Performance-First Gate (Article VI)
- [ ] Operations profiled for <100ms on small repos?
- [ ] Progress indicators for operations >1s?
- [ ] Async flag implemented for long-running scans?
```

#### Step 3: Update Tasks Template

```bash
vim .specify/templates/tasks-template.md
```

Add to Phase 3.5 (Polish):
```markdown
## Phase 3.5: Polish
- [ ] T### Performance profiling (all commands <100ms target)
- [ ] T### Add progress bar for scan operations
- [ ] T### Implement --async flag with status checking
```

### Extension 3: Multi-Language Support

**Goal**: Adapt DebtTrack to scan JavaScript/TypeScript repos.

#### Step 1: Create Feature Branch

```
/specify Add JavaScript/TypeScript support to DebtTrack. Should detect JSDoc @todo/@fixme annotations in addition to comment markers. Must handle .js, .jsx, .ts, .tsx files.
```

This creates `specs/002-javascript-support/spec.md`

#### Step 2: Constitutional Check

Your existing principles (CLI-First, Zero-Config, Test-First) still apply automatically.

#### Step 3: Iterative Planning

```
/plan Extend existing Scanner service with pluggable language parsers. Use Tree-sitter for robust AST parsing. Add JSDoc annotation detector. Maintain backward compatibility with Python-only mode.
```

The AI will:
1. Reference existing data model from `001-debt-tracking`
2. Propose extension strategy (visitor pattern for language-specific parsers)
3. Generate contracts for new scanner interfaces
4. Create integration tests ensuring Python support still works

#### Step 4: Incremental Implementation

```
/tasks
/implement
```

Tasks will include:
- Add tree-sitter dependency
- Create abstract `LanguageScanner` interface
- Implement `JavaScriptScanner` 
- Update main `Scanner` to dispatch by file extension
- Add tests for JavaScript-specific patterns

### Extension 4: Custom Report Template

**Goal**: Generate reports in your company's specific format.

#### Approach 1: Extend Quickstart Template

```bash
vim .specify/templates/quickstart.md
```

Add section:
```markdown
## Custom Report Formats

When generating reports in implementation:
1. Check for `.debttrack/templates/` directory
2. If custom Jinja2 templates exist, use those
3. Otherwise, use built-in templates

Custom template structure:
- `report.html.j2` - HTML report override
- `report.csv.j2` - CSV format override
- `summary.txt.j2` - Text summary format
```

Now when you run `/plan` on future features, the AI will see this guidance and implement template override logic.

#### Approach 2: Add Script for Template Management

```bash
cat > .specify/scripts/bash/install-templates.sh << 'EOF'
#!/usr/bin/env bash
# Install custom report templates into project

TEMPLATE_DIR=".debttrack/templates"
mkdir -p "$TEMPLATE_DIR"

# Download from company repo or copy from local
cp /path/to/company/templates/*.j2 "$TEMPLATE_DIR/"

echo "Custom templates installed to $TEMPLATE_DIR"
EOF
```

Reference this in future specs:
```
/specify Add support for loading custom templates from .debttrack/templates/ directory. Should fall back to built-in templates if not found.
```

### Extension 5: Integration with CI/CD

**Goal**: Make DebtTrack run in CI and fail builds if debt increases beyond threshold.

#### Create CI-Specific Command

```bash
cat > .specify/templates/commands/ci-check.md << 'EOF'
---
description: CI/CD validation - compare current scan to baseline and fail if thresholds exceeded
scripts:
  sh: scripts/bash/check-prerequisites.sh --json
  ps: scripts/powershell/check-prerequisites.ps1 -Json
---

User input: $ARGUMENTS

1. Load current feature context via {SCRIPT}
2. Expect arguments to contain: --baseline-id <scan_id> --max-increase <percentage>
3. Run current scan and persist results
4. Load baseline scan from database
5. Compare total debt counts:
   - Calculate percentage increase
   - If exceeds --max-increase, exit with status 1
6. Generate diff report showing new debt items
7. Output CI-friendly format (exit codes, annotations)
EOF
```

Usage in CI:
```yaml
# .github/workflows/debt-check.yml
name: Technical Debt Check
on: [pull_request]
jobs:
  debt-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: pip install debttrack
      - run: claude  # Or debttrack ci-check once implemented
        with:
          command: /ci-check --baseline-id ${{ env.BASELINE_SCAN_ID }} --max-increase 10
```

### Extension 6: Adapting to Your Workflow

**Scenario**: You prefer Notion for specs instead of Markdown files.

#### Approach: Custom Sync Script

```bash
cat > .specify/scripts/bash/sync-to-notion.sh << 'EOF'
#!/usr/bin/env bash
# Sync spec.md to Notion page after /specify completes

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

eval $(get_feature_paths)

# Convert markdown to Notion blocks
python3 << PYTHON
import requests
import json
from pathlib import Path

spec_content = Path("$FEATURE_SPEC").read_text()
notion_token = "$NOTION_TOKEN"  # From environment
database_id = "$NOTION_DATABASE_ID"

# Convert markdown to Notion blocks (simplified)
blocks = markdown_to_notion_blocks(spec_content)

# Create Notion page
response = requests.post(
    "https://api.notion.com/v1/pages",
    headers={
        "Authorization": f"Bearer {notion_token}",
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
    },
    json={
        "parent": {"database_id": database_id},
        "properties": {
            "Name": {"title": [{"text": {"content": "$CURRENT_BRANCH"}}]}
        },
        "children": blocks
    }
)

print(f"Notion page created: {response.json()['url']}")
PYTHON
EOF
```

Trigger after /specify:
```bash
vim .specify/templates/commands/specify.md
```

Add to end:
```markdown
5. Report completion with branch name, spec file path
6. Execute sync-to-notion.sh if NOTION_TOKEN environment variable is set
```

---

## Advanced Topics

### Understanding the Execution Model

Each slash command follows this pattern:

```
User invokes command → AI Agent processes
          ↓
    Parse $ARGUMENTS
          ↓
    Load command template (*.md)
          ↓
    Execute embedded flow:
      1. Run {SCRIPT} (shell automation)
      2. Parse JSON output
      3. Load prerequisite files
      4. Process template logic
      5. Generate/modify artifacts
      6. Validate gates/checks
      7. Report completion
```

**Key Principle**: Scripts handle **state** (git, filesystem), templates handle **transformation** (specs → artifacts).

### Debugging Failed Commands

When `/plan` fails with "Constitution Check violation":

1. **Find the violation** in generated `plan.md`:
   ```markdown
   ## Constitution Check
   ### Zero-Config Check
   - [ ] Works without config file
   - [X] VIOLATION: Requires `.debttrack.toml` for basic operation
   ```

2. **Check Complexity Tracking**:
   ```markdown
   ## Complexity Tracking
   | Violation | Why Needed | Simpler Alternative Rejected |
   |-----------|------------|------------------------------|
   | Config required | Multiple marker patterns | Hard-coded patterns insufficient for enterprise |
   ```

3. **Options**:
   - Accept the complexity (document justification)
   - Refactor design (make config optional)
   - Amend constitution (if principle is wrong)

### Token Optimization

Spec Kit templates are verbose. For high-volume usage:

1. **Compress templates**:
   ```bash
   # Remove examples, keep structure
   sed -i '/^## Example/,/^##/d' .specify/templates/spec-template.md
   ```

2. **Use agent context efficiently**:
   ```bash
   # Limit CLAUDE.md to 100 lines
   vim .specify/scripts/bash/update-agent-context.sh
   # Modify to truncate old entries
   ```

3. **Skip clarification for prototypes**:
   ```
   /specify [feature] --skip-clarification
   ```

### Parallel Development

Multiple features simultaneously:

```bash
# Terminal 1
git checkout -b 001-debt-tracking
/specify [feature 1]
/plan [details]

# Terminal 2  
git checkout -b 002-reporting
/specify [feature 2]
/plan [details]

# Merge order determines what's in "Recent Changes"
```

Each branch maintains independent spec directories.

---

## Conclusion: From Consumer to Architect

You now understand:

1. **Architecture**: Template engine + script orchestration + LLM constraints
2. **Execution**: How each command transforms artifacts through validated gates
3. **Extension**: Where to inject custom logic (templates, scripts, commands, constitution)

**Next Steps**:

1. **Run the full DebtTrack example** end-to-end
2. **Add your first custom command** (e.g., /benchmark for performance testing)
3. **Modify the constitution** to enforce your team's practices
4. **Experiment with different AI agents** to see format differences
5. **Build a parallel implementation** using different tech stack (Rust? Go?)

The power of Spec Kit isn't the templates - it's the **constraint system** that prevents LLMs from hallucinating implementation details during specification phases, and the **validation gates** that enforce architectural principles. Adapt these to your workflow, and you have a specification-to-code pipeline tuned to your team's practices.