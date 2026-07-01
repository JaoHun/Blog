# Vercel Preview Config Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the GitHub repository easier to import into Vercel as a preview deployment without requiring Vercel CLI or account access from the local machine.

**Architecture:** Keep the existing static Next.js export under `frontend`. Add a root-level `vercel.json` that runs install/build commands inside `frontend` and points Vercel at `frontend/out`, then update deployment documentation.

**Tech Stack:** Vercel static output, Next.js static export, pnpm/Corepack.

---

## Task 1: Add Vercel Preview Configuration

**Files:**
- Create: `vercel.json`
- Modify: `README.md`
- Modify: `docs/launch/preview-deployment.md`

- [ ] Add `vercel.json` with `installCommand`, `buildCommand`, and `outputDirectory`.
- [ ] Update README with the root-level Vercel configuration path.
- [ ] Update preview deployment docs with both automatic config and manual fallback settings.
- [ ] Validate `vercel.json` parses as JSON.
- [ ] Run content check, tests, lint, and build from `frontend`.
- [ ] Commit and push to `origin/main`.
