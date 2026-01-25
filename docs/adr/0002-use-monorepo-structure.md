# 2. Use Monorepo Structure

Date: 2026-01-25

## Status

Accepted

## Context

The project has distinct frontend (`apps/web`), backend (`apps/functions`), and shared logic components. Managing them in separate repositories would make code sharing and synchronization difficult.

## Decision

We will use a Monorepo structure managed by `pnpm` workspaces.

* `apps/web`: Frontend (Vue 3 + Vite)
* `apps/functions`: Backend (Firebase Functions)
* `packages/*`: Shared libraries

## Consequences

* Easier code sharing (types, utils).
* Single CI/CD pipeline configuration.
* Unified versioning for internal packages.
