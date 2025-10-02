<!--
SYNC IMPACT REPORT
==================
Version Change: Initial → 1.0.0
Modified Principles: N/A (initial creation)
Added Sections:
  - Core Principles (5 principles: Static-First Export, Component Testing, Minimalism, Iterative Development, Styling & UI Standards)
  - Development Constraints
  - Deployment Requirements
  - Governance
Removed Sections: N/A (initial creation)
Templates Status:
  ✅ .specify/templates/plan-template.md - reviewed, compatible
  ✅ .specify/templates/spec-template.md - reviewed, compatible
  ✅ .specify/templates/tasks-template.md - reviewed, compatible
Follow-up TODOs: None
-->

# debt-track Constitution

## Core Principles

### I. Static-First Export
All features MUST be compatible with Next.js static export (`output: 'export'`). No
server-side rendering, no API routes in Next.js runtime, no dynamic server features.
Pages MUST be pre-rendered at build time. External APIs are called from the client only.

**Rationale**: Enables deployment to static file servers and GitHub Pages without
requiring a Node.js runtime, reducing operational complexity and hosting costs.

### II. Component Testing (NON-NEGOTIABLE)
Test-driven development is mandatory for all React components. Component tests MUST be
written BEFORE implementation. Tests MUST verify component behavior, user interactions,
and edge cases. Red-Green-Refactor cycle strictly enforced.

**Rationale**: TDD ensures components are designed for testability from the start,
reduces bugs, and provides confidence during refactoring. React components are the
primary unit of work in this application.

### III. Minimalism
Start with the simplest solution that solves the problem. YAGNI (You Aren't Gonna Need
It) principles apply. Avoid premature abstraction, over-engineering, or speculative
features. Every dependency, component, and abstraction MUST be justified by a concrete
current need.

**Rationale**: Keeps the codebase maintainable, understandable, and focused on actual
user value. Reduces technical debt and makes iteration faster.

### IV. Iterative Development
Deploy a working application early and iterate. Each feature cycle MUST result in a
deployable, working application. Break large features into small, independently valuable
increments. Continuous deployment via GitHub Actions is required.

**Rationale**: Enables fast feedback loops, reduces integration risk, and ensures the
application is always in a working state that can be demonstrated or released.

### V. Styling & UI Standards
Use Tailwind CSS for styling with utility-first approach. Use shadcn UI components as
the foundation for the UI component library. Components MUST be accessible and
responsive. Favor composition over custom CSS.

**Rationale**: Tailwind CSS provides consistency and rapid development. shadcn UI
provides accessible, well-tested primitives. This combination reduces custom code and
maintains design system coherence.

## Development Constraints

**Framework**: Next.js v14 with Pages Router MUST be used. Do not use App Router.

**Build Output**: Static export only (`next export` or `output: 'export'`). Build MUST
produce static HTML, CSS, and JS files only.

**Testing Tools**: React Testing Library for component tests. Use `data-testid`
attributes for test selectors (not CSS selectors that may change).

**Styling**: Tailwind CSS MUST be used. No CSS modules, no styled-components, no inline
style objects (except for truly dynamic values like user-provided colors).

**Console Usage**: In tests only, `console.log` MAY be used for error scenarios. Avoid
unnecessary comments unless logic is complex.

**Test Determinism**: Tests MUST be deterministic. No `if-else` in tests. No
`try-catch` in tests. Let errors throw naturally.

**Assert Convention**: Use `assert_eq!(expected, actual)` convention from user
preferences (if using assertion library that supports this).

## Deployment Requirements

**CI/CD**: GitHub Actions workflow MUST be present and MUST deploy to GitHub Pages on
every push to main branch (or configured production branch).

**Build Validation**: Workflow MUST run component tests before deployment. Deployment
MUST fail if tests fail.

**Static Assets**: All assets MUST be optimized for static hosting. No runtime asset
processing.

## Governance

**Constitution Authority**: This constitution supersedes all other development practices
and conventions. When in doubt, refer to this document.

**Amendment Process**: Constitution amendments require:
1. Documentation of the proposed change and rationale
2. Review of impact on existing code and templates
3. Update of dependent templates and documentation
4. Version bump following semantic versioning

**Versioning Policy**:
- MAJOR: Backward incompatible changes (e.g., removing a core principle)
- MINOR: New principles or sections added
- PATCH: Clarifications, wording improvements, non-semantic fixes

**Compliance Review**: All pull requests MUST verify compliance with this constitution.
Complexity that violates principles MUST be justified in PR description or design
documents.

**Version**: 1.0.0 | **Ratified**: 2025-10-02 | **Last Amended**: 2025-10-02
