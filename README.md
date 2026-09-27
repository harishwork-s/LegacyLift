# LegacyLift

**A prototype that demonstrates how IBM Bob 2.0 accelerates legacy code modernization — from analysis to validated transformation.**

---

## Problem Statement

Millions of lines of legacy Java, COBOL, and RPG code power critical business systems. Modernizing that code is expensive, risky, and slow — not because the target architecture is unclear, but because developers spend most of their time *understanding* the existing system before they can safely change it.

LegacyLift explores a single question: **What if IBM Bob 2.0 could compress that understanding phase from weeks to minutes?**

---

## What LegacyLift Demonstrates

LegacyLift is a self-contained web prototype that walks through the full legacy-to-modern transformation lifecycle for a representative Java 8 module. It shows:

- **Automated code analysis** — detect anti-patterns, security vulnerabilities, and quality issues
- **Risk visualization** — a dashboard that quantifies technical debt before touching a line of code
- **A structured modernization plan** — step-by-step transformation roadmap with effort estimates
- **Before/after code comparison** — side-by-side diff of legacy and modernized Java source
- **Validation results** — simulated JUnit 5 test run against the modernized code

The prototype is intentionally minimal: static fixtures and representative heuristics power every screen. There are no live LLM API calls and no cloud infrastructure. The goal is to make the *workflow* compelling, not to claim production-scale AI.

---

## Key Workflow

```
Legacy Code  →  Analysis  →  Risk Dashboard  →  Modernization Plan  →  Before/After Diff  →  Validation
```

| Step | Page | What it shows |
|---|---|---|
| 1 | **Analysis** | Detected issues: severity, type, line number, and recommendation |
| 2 | **Dashboard** | Risk score, code smells by category, coupling, coverage, technical debt |
| 3 | **Modernization** | Ordered plan steps with effort level and completion status |
| 4 | **Comparison** | Split-panel diff: `CustomerOrderProcessor.java` → service + repository |
| 5 | **Validation** | JUnit 5 fixture results: 10 passed, 1 failed, 1 skipped — 83% pass rate |

---

## IBM Bob 2.0's Role

The entire prototype was designed and built **within IBM Bob 2.0** sessions. Bob acted as the primary engineering assistant throughout:

- **Planning** — Bob produced the full [implementation plan](docs/IMPLEMENTATION_PLAN.md): architecture decisions, stack selection, sub-task breakdown, and dependency order
- **Scaffolding** — Bob generated the Vite + React + TypeScript + Tailwind frontend and the Express backend from scratch
- **Fixture authorship** — Bob wrote `CustomerOrderProcessor.java`, the modernized equivalents, and all JSON fixtures representing realistic analysis outputs
- **Feature implementation** — Bob implemented all five frontend pages, the Express routes, and the root `package.json` dev scripts
- **Debugging & polish** — Bob resolved layout issues, API wiring problems, and validation display edge cases iteratively

Bob session screenshots are preserved in [`docs/bob-sessions/`](docs/bob-sessions/).

| Session | Screenshot |
|---|---|
| 01 — Planning & architecture | [`01-planning.png`](docs/bob-sessions/01-planning.png) |
| 02 — MVP implementation | [`02-mvp-implementation.png`](docs/bob-sessions/02-mvp-implementation.png) |
| 03 — Modernization workflow | [`03-modernization-workflow.png`](docs/bob-sessions/03-modernization-workflow.png) |
| 04 — Validation page | [`04-validation.png`](docs/bob-sessions/04-validation.png) |
| 05 — Validation consistency fix | [`05-validation consistency small fix.png`](docs/bob-sessions/05-validation%20consistency%20small%20fix.png) |

---

## Architecture & Technology Stack

```
legacylift/
├── client/                          # React + Vite frontend
│   └── src/
│       ├── pages/
│       │   ├── HomePage.tsx         # Landing page + "Start Demo" CTA
│       │   ├── AnalysisPage.tsx     # Legacy code issue scanner
│       │   ├── DashboardPage.tsx    # Risk & metrics dashboard
│       │   ├── ModernizationPage.tsx# Step-by-step modernization plan
│       │   ├── ComparisonPage.tsx   # Before/after code diff viewer
│       │   └── ValidationPage.tsx  # Test validation results
│       └── App.tsx                  # Router + nav shell
├── server/                          # Express backend
│   ├── routes/                      # One route file per API endpoint
│   └── fixtures/
│       ├── legacy/
│       │   └── CustomerOrderProcessor.java   # Legacy Java 8 module
│       ├── modernized/
│       │   ├── CustomerOrderService.java     # Modernized service layer
│       │   └── CustomerOrderRepository.java  # Modernized repository layer
│       ├── analysis-result.json
│       ├── dashboard-metrics.json
│       ├── modernization-plan.json
│       └── validation-results.json
├── docs/
│   ├── IMPLEMENTATION_PLAN.md
│   └── bob-sessions/                # IBM Bob 2.0 session screenshots
└── package.json                     # Root workspace with concurrent dev script
```

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Charts | Recharts |
| Code diff | react-diff-viewer-continued |
| Backend | Node.js + Express |
| Data | Static JSON fixtures + Java source files |
| Legacy sample | Java 8 (fixture) |

---

## Legacy Example: `CustomerOrderProcessor.java`

[`server/fixtures/legacy/CustomerOrderProcessor.java`](server/fixtures/legacy/CustomerOrderProcessor.java) is a realistic Java 8 "God class" that represents a common legacy pattern:

| Issue | Severity | Detail |
|---|---|---|
| SQL Injection Vulnerability | **Critical** | String-concatenated SQL queries; no parameterization (CWE-89) |
| Hardcoded Database Credentials | **Critical** | DB URL, username, and password as `static final` strings |
| God Class Anti-Pattern | Warning | Handles DB access, business logic, stock management, audit, and email in one file |
| New DB Connection Per Request | Warning | `DriverManager.getConnection()` on every invocation; no connection pooling |
| Exceptions Silently Swallowed | Warning | `catch(Exception e) { e.printStackTrace(); }` — no propagation or alerting |
| No Transaction Management | Warning | Multi-step writes without a transaction; partial failures leave inconsistent data |
| Synchronous Blocking Email | Warning | SMTP latency blocks the order placement request thread |
| Zero Unit Test Coverage | Info | No tests; code cannot be safely refactored |
| Raw SQL Return Type Mapping | Info | Hardcoded column names and manual casting; not type-safe |

**Risk score: 78 / 100 (High) · Complexity score: 78 · Technical debt: 14 days**

---

## Modernization Approach

The modernization plan targets **Java 17 + Spring Boot 3 + Spring Data JDBC** and applies six concrete steps:

| # | Step | Effort | Status |
|---|---|---|---|
| 1 | Extract Repository Layer | Low | Done |
| 2 | Eliminate Hardcoded Credentials | Low | Done |
| 3 | Introduce Connection Pooling | Low | Done |
| 4 | Add Transaction Management (`@Transactional`) | Low | In Progress |
| 5 | Decouple Email Notification (`@Async`) | Medium | Pending |
| 6 | Add Unit & Integration Tests | Medium | Pending |

The key structural change is splitting the God class into two focused modules:

- [`CustomerOrderService.java`](server/fixtures/modernized/CustomerOrderService.java) — business logic only, injected dependencies, `@Transactional` boundary
- [`CustomerOrderRepository.java`](server/fixtures/modernized/CustomerOrderRepository.java) — data access only, parameterized `PreparedStatement`, interface-backed for testability

---

## Validation Results

> **Prototype / demo note:** These results are fixture data simulating a JUnit 5 test run against the modernized module. They are intentionally presented as a realistic, partially-complete test suite — not a fully-green build. An 83% pass rate is an honest representation of work-in-progress modernization.

**Suite:** `CustomerOrderServiceTest` + `CustomerOrderRepositoryTest` · Framework: JUnit 5 + Mockito

| Result | Count |
|---|---|
| ✅ Passed | 10 |
| ❌ Failed | 1 |
| ⏭ Skipped | 1 |
| **Total** | **12** |
| **Pass rate** | **83%** |

**Failed test:** `findByStatus_sqlInjectionAttempt_parametersEscaped`  
Reason: H2 parameterized behavior returns 0 rows rather than throwing — test assertion needs adjustment for H2 in-memory vs real driver semantics.

**Skipped test:** `createOrder_transactionRollbackOnStockUpdateFailure`  
Reason: Requires full Spring context; tagged `@Disabled` pending integration test setup.

---

## Project Structure

```
.
├── client/                  # React frontend (Vite + TypeScript + Tailwind)
├── server/                  # Express backend
│   ├── fixtures/            # All static data powering the demo
│   └── routes/              # REST API route handlers
├── docs/
│   ├── IMPLEMENTATION_PLAN.md
│   └── bob-sessions/        # Bob 2.0 session evidence (PNG screenshots)
├── package.json             # Root workspace scripts
└── README.md
```

---

## How to Run Locally

**Prerequisites:** Node.js 18+

```bash
# 1. Install root dependencies
npm install

# 2. Install client and server dependencies
npm install --prefix client
npm install --prefix server

# 3. Start both frontend and backend concurrently
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3001/api |

---

## Demo Walkthrough

Navigate through the app in order for the full narrative arc:

1. **Home** — Product introduction and "Start Demo →" CTA
2. **Analysis** (`/analysis`) — Click "Simulate Analysis" to trigger a mock scan of `CustomerOrderProcessor.java`; review the 9 detected issues with severity badges
3. **Dashboard** (`/dashboard`) — Review the risk score (78/100), code smell breakdown chart, coupling score, test coverage (0%), and technical debt estimate
4. **Modernization** (`/modernization`) — Explore the 6-step transformation plan; expand each step for description and expected outcome; observe the progress bar
5. **Comparison** (`/comparison`) — Side-by-side diff of the legacy God class versus the split service + repository design
6. **Validation** (`/validation`) — Review the 12-test JUnit 5 fixture run: 10 passed, 1 failed (with reason), 1 skipped (with reason)

---

## Bob Session Evidence

All five IBM Bob 2.0 sessions that produced this prototype are documented in [`docs/bob-sessions/`](docs/bob-sessions/):

- **01-planning.png** — Initial architecture planning, stack selection, and implementation plan generation
- **02-mvp-implementation.png** — Scaffolding, fixtures, backend routes, and initial frontend pages
- **03-modernization-workflow.png** — Modernization plan page, comparison diff viewer
- **04-validation.png** — Validation results page implementation
- **05-validation consistency small fix.png** — Iterative fix for validation display consistency

---

## Scope Note

LegacyLift is a **hackathon prototype**. It uses representative fixture data crafted to tell a realistic modernization story. It does not:

- Make live LLM or AI API calls
- Connect to a real database or CI system
- Claim to automate actual code transformation at scale
- Represent a production-ready tool

Its purpose is to demonstrate the *workflow* that IBM Bob 2.0 enables — and to show that Bob itself can act as the development accelerator that builds the demo end-to-end.

---

*Built for the IBM Bob Hackathon · [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md)*
