# 2. Adoption of Monorepo Architecture

* Status: accepted
* Deciders: Presentyourlove, Antigravity
* Date: 2026-01-25

## Context and Problem Statement

As the `subscription-buddy` project grows, we anticipate the need to share core logic (services, types, utils) between different applications (e.g., the current Web App, a future Admin Dashboard, and Cloud Functions). The current single-project structure makes code sharing difficult and prone to duplication.

## Decision Drivers

* **Code Reusability**: Need to share Auth, Crypto, and Models between Frontend and Backend (Functions).
* **Scalability**: Expecting to add more apps (e.g., `admin`, `mobile`) in the future.
* **Maintainability**: Clear separation of concerns between Logic (`core`) and UI (`web`).

## Considered Options

* **Monorepo (pnpm workspaces)**
* **Standalone npm packages** (publish `core` to npm registry)
* **Git Submodules**

## Decision Outcome

Chosen option: **Monorepo (pnpm workspaces)**.

Because:

1. It allows local development without publishing packages.
2. `pnpm` provides efficient dependency management.
3. It keeps all related code in one repository, simplifying version control.

### Positive Consequences

* **Shared Logic**: `packages/core` can be imported by `apps/web` and `apps/functions`.
* **Atomic Commits**: Changes to core and web can be committed together.

### Negative Consequences

* **Complexity**: Tooling (ESLint, TSConfig, Tests) becomes more complex to configure.
* **Build Time**: CI pipeline needs optimization (e.g., using `turbo`) to avoid rebuilding unchanged packages.

## Pros and Cons of Options

### Standalone npm packages

* Good: Strict versioning.
* Bad: Overhead of publishing and linking during dev.

### Git Submodules

* Good: Clear repository separation.
* Bad: Poor developer experience (updating refs, detached heads).
