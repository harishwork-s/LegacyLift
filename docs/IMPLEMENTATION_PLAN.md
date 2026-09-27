# LegacyLift — Implementation Plan

## Overview

**Goal:** Demonstrate how IBM Bob 2.0 helps developers understand, assess, modernize, and validate a legacy application.

**Scope:** A minimal, self-contained web prototype with a React frontend and a Node.js/Express backend. The backend uses static fixtures and simple heuristics — no real cloud AI, no auth, no production infra.

**Non-Goals:** Authentication, cloud deployment, real LLM API calls, enterprise scalability.

---

## Recommended Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React + Vite + Tailwind CSS | Fast setup, good component model for dashboards |
| Backend | Node.js + Express | Minimal, no JVM overhead, easy fixture serving |
| Data | JSON fixtures + in-memory | No database needed for a demo |
| Legacy sample | Java 8 monolith module (fixture) | Realistic legacy target, widely understood |
| Charts | Recharts | Lightweight, works with React out of the box |
| Diff view | react-diff-viewer | Purpose-built before/after code comparison |

---

## Architecture

```
legacylift/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AnalysisPage.tsx        # Legacy code analysis view
│   │   │   ├── DashboardPage.tsx       # Architecture & risk dashboard
│   │   │   ├── ModernizationPage.tsx   # Modernization plan view
│   │   │   ├── ComparisonPage.tsx      # Before/after code diff
│   │   │   └── ValidationPage.tsx     # Test/validation results
│   │   ├── components/                 # Shared UI components
│   │   └── App.tsx                     # Router + nav shell
├── server/                  # Express backend
│   ├── routes/
│   │   ├── analysis.js      # Returns analysis results for legacy module
│   │   ├── dashboard.js     # Returns risk/architecture metrics
│   │   ├── modernization.js # Returns modernization plan steps
│   │   ├── comparison.js    # Returns before/after code strings
│   │   └── validation.js    # Returns test result fixtures
│   ├── fixtures/            # Static JSON + Java code fixtures
│   │   ├── legacy-module.java          # The sample legacy Java module
│   │   ├── modernized-module.java      # The modernized equivalent
│   │   ├── analysis-result.json
│   │   ├── dashboard-metrics.json
│   │   ├── modernization-plan.json
│   │   └── validation-results.json
│   └── index.js             # Express entry point
├── docs/
│   └── IMPLEMENTATION_PLAN.md
└── package.json             # Root workspace (optional monorepo scripts)
```

---

## Legacy Java Module: `CustomerOrderProcessor.java`

A realistic Java 8 class suitable for modernization demonstration:

- **Pattern:** God class anti-pattern — handles DB access, business logic, and email notification in one file
- **Issues to flag:** JDBC boilerplate, raw SQL, no dependency injection, synchronous blocking I/O, no unit tests, hardcoded config
- **Modernized equivalent:** Split into service layer + repository layer, use parameterized queries, inject dependencies, add basic JUnit 5 tests

This pair gives a clear, visual before/after story for the demo.

---

## Sub-Tasks

---

### Sub-Task 1 — Project Scaffolding

**Status:** `[ ] pending`

**Intent:** Create the repository skeleton so all subsequent sub-tasks have a place to land.

**Expected Outcomes:**
- `client/` initialized as a Vite + React + TypeScript project with Tailwind configured
- `server/` initialized as a Node.js + Express project
- Root `package.json` with `dev` script that starts both client and server concurrently
- App compiles and starts with a blank shell (nav bar, placeholder pages)

**Todo List:**
1. Scaffold `client/` with `npm create vite@latest` (React + TypeScript template)
2. Install Tailwind CSS in `client/`
3. Install `react-router-dom`, `recharts`, `react-diff-viewer-continued` in `client/`
4. Create `server/` with `package.json`, install `express`, `cors`
5. Create root `package.json` with `concurrently` dev script
6. Create `App.tsx` with a top nav and routes to the 5 pages (stubs)
7. Create stub page components for all 5 pages
8. Verify `npm run dev` starts both services cleanly

**Relevant Context:** None yet — greenfield.

---

### Sub-Task 2 — Legacy Java Fixtures

**Status:** `[ ] pending`

**Intent:** Create the legacy and modernized Java source files that power the demo story.

**Expected Outcomes:**
- `server/fixtures/legacy/CustomerOrderProcessor.java` — realistic Java 8 "big ball of mud" class (~120 lines)
- `server/fixtures/modernized/CustomerOrderService.java` — clean service layer (~60 lines)
- `server/fixtures/modernized/CustomerOrderRepository.java` — clean repository layer (~40 lines)
- JSON fixtures for analysis, dashboard metrics, modernization plan, and validation results

**Todo List:**
1. Write `CustomerOrderProcessor.java` with: raw JDBC, hardcoded DB URL, business logic, email send, no error handling
2. Write `CustomerOrderService.java` with: constructor injection, calls repository, single responsibility
3. Write `CustomerOrderRepository.java` with: parameterized PreparedStatement, interface-backed
4. Write `analysis-result.json`: list of detected issues (anti-patterns, complexity score, dependency count)
5. Write `dashboard-metrics.json`: risk score, code smells count, test coverage %, coupling score, lines of code
6. Write `modernization-plan.json`: ordered steps with title, description, effort, status
7. Write `validation-results.json`: list of JUnit 5 test results with pass/fail/duration

**Relevant Context:** Sub-Task 1 must be complete (directory structure exists).

---

### Sub-Task 3 — Backend API Routes

**Status:** `[ ] pending`

**Intent:** Wire the Express server to serve fixtures through typed REST endpoints the frontend will consume.

**Expected Outcomes:**
- `GET /api/analysis` returns analysis result JSON
- `GET /api/dashboard` returns dashboard metrics JSON
- `GET /api/modernization` returns modernization plan JSON
- `GET /api/comparison` returns `{ before: string, after: string }` with the Java source code
- `GET /api/validation` returns validation results JSON
- All routes respond in < 50 ms (static reads)

**Todo List:**
1. Create `server/index.js` with Express app, CORS, JSON middleware, port 3001
2. Create `server/routes/analysis.js` — reads and returns `analysis-result.json`
3. Create `server/routes/dashboard.js` — reads and returns `dashboard-metrics.json`
4. Create `server/routes/modernization.js` — reads and returns `modernization-plan.json`
5. Create `server/routes/comparison.js` — reads both Java files, returns as `{ before, after }`
6. Create `server/routes/validation.js` — reads and returns `validation-results.json`
7. Mount all routes under `/api` prefix in `index.js`
8. Manually verify each endpoint with a browser or curl

**Relevant Context:** Fixtures from Sub-Task 2 must exist.

---

### Sub-Task 4 — Frontend: Analysis Page

**Status:** `[ ] pending`

**Intent:** Build the "Legacy Code Analysis" page — the entry point of the demo flow.

**Expected Outcomes:**
- Page fetches `GET /api/analysis` and renders results
- Shows the legacy Java file name, a complexity score badge, and a list of detected issues
- Each issue shows: type, severity (color-coded), and a short description
- A "Simulate Analysis" button triggers a loading state then reveals results (mimics AI scan)

**Todo List:**
1. Implement `AnalysisPage.tsx` — fetch on mount from `/api/analysis`
2. Add loading spinner during fetch
3. Render file metadata header (name, lines of code, language)
4. Render issue list with severity badges (Critical / Warning / Info)
5. Add "Simulate Analysis" button that resets and re-fetches with a 1.5 s delay
6. Style with Tailwind; keep layout single-column

**Relevant Context:** API route from Sub-Task 3.

---

### Sub-Task 5 — Frontend: Dashboard Page

**Status:** `[ ] pending`

**Intent:** Build the "Architecture & Risk Dashboard" — the visual centrepiece of the demo.

**Expected Outcomes:**
- Page fetches `GET /api/dashboard` and renders a metrics dashboard
- Shows: risk score gauge (or large number), code smells bar chart, test coverage ring/bar, coupling score
- All charts rendered with Recharts
- Responsive 2-column card grid layout

**Todo List:**
1. Implement `DashboardPage.tsx` — fetch on mount from `/api/dashboard`
2. Add a risk score "hero" metric card (large number, color by threshold)
3. Add a `BarChart` for code smell categories
4. Add a `RadialBarChart` or progress bar for test coverage %
5. Add metric cards for: lines of code, coupling score, dependency count
6. Style with Tailwind card grid

**Relevant Context:** API route from Sub-Task 3; Recharts already installed in Sub-Task 1.

---

### Sub-Task 6 — Frontend: Modernization Plan Page

**Status:** `[ ] pending`

**Intent:** Build the "Modernization Plan" page — shows the step-by-step transformation roadmap.

**Expected Outcomes:**
- Page fetches `GET /api/modernization` and renders ordered plan steps
- Each step shows: number, title, description, effort level, and a status pill (Pending / In Progress / Done)
- Steps can be clicked to expand detail
- Overall progress bar at top

**Todo List:**
1. Implement `ModernizationPage.tsx` — fetch on mount from `/api/modernization`
2. Render a progress bar based on count of completed steps
3. Render step list — each step as an expandable card
4. Step card shows: index, title, effort badge, status pill, expanded description
5. Style with Tailwind; use accordion expand on click

**Relevant Context:** API route from Sub-Task 3.

---

### Sub-Task 7 — Frontend: Before/After Comparison Page

**Status:** `[ ] pending`

**Intent:** Build the "Code Comparison" page — the most visually compelling demo screen.

**Expected Outcomes:**
- Page fetches `GET /api/comparison` and renders a side-by-side diff
- Left panel: legacy Java code (red highlights on removed/changed lines)
- Right panel: modernized Java code (green highlights on added/changed lines)
- Language label badges above each panel
- Rendered with `react-diff-viewer-continued`

**Todo List:**
1. Implement `ComparisonPage.tsx` — fetch on mount from `/api/comparison`
2. Render `ReactDiffViewer` in split view with `oldValue` and `newValue`
3. Add panel headers: "Legacy — Java 8" and "Modernized — Java 17"
4. Enable syntax highlighting theme
5. Style wrapper with Tailwind

**Relevant Context:** API route from Sub-Task 3; `react-diff-viewer-continued` installed in Sub-Task 1.

---

### Sub-Task 8 — Frontend: Validation Results Page

**Status:** `[ ] pending`

**Intent:** Build the "Test & Validation Results" page — closes the demo loop by showing confidence in the modernized code.

**Expected Outcomes:**
- Page fetches `GET /api/validation` and renders test results
- Shows summary bar: total / passed / failed / skipped counts
- Renders a table of individual test results with: test name, class, status icon, duration
- Failed tests show in red with a reason tooltip or inline message

**Todo List:**
1. Implement `ValidationPage.tsx` — fetch on mount from `/api/validation`
2. Render summary strip (passed count, failed count, skipped, total duration)
3. Render results table with columns: Test Name, Class, Status, Duration
4. Color-code rows: green for pass, red for fail, grey for skip
5. Add inline failure reason for failed tests
6. Style with Tailwind table utilities

**Relevant Context:** API route from Sub-Task 3.

---

### Sub-Task 9 — Navigation Shell & Demo Polish

**Status:** `[ ] pending`

**Intent:** Wire the full app together into a coherent demo flow with a professional shell.

**Expected Outcomes:**
- Top nav bar with LegacyLift logo/name and links to all 5 pages
- Active page highlighted in nav
- Landing/home route with a short elevator-pitch description and "Start Demo" CTA
- Each page has a consistent header with page title and subtitle
- App looks presentable in a 1080p browser window

**Todo List:**
1. Implement `HomePage.tsx` with product name, tagline, and "Start Demo →" button linking to Analysis page
2. Build `NavBar.tsx` component with active-link highlighting via `useLocation`
3. Integrate `NavBar` into `App.tsx` layout wrapper
4. Add consistent `PageHeader` component (title + subtitle) used by all 5 pages
5. Do a full end-to-end walkthrough: Home → Analysis → Dashboard → Modernization → Comparison → Validation
6. Fix any layout or data rendering issues found during walkthrough

**Relevant Context:** All previous sub-tasks must be complete.

---

## Implementation Order

```
Sub-Task 1 (Scaffold)
    → Sub-Task 2 (Fixtures)
        → Sub-Task 3 (Backend)
            → Sub-Tasks 4–8 (Frontend pages, parallel)
                → Sub-Task 9 (Polish)
```

Sub-Tasks 4 through 8 can be implemented in any order once Sub-Task 3 is done.
