# Contributing Guide

Thanks for contributing.

## 1. Before You Start

- Read `README.md` and relevant workspace README files.
- Never commit secrets or local runtime artifacts.
- Use `.env.example` files as templates.

## 2. Branch and Commit Style

- Create focused branches per task.
- Keep commits small and descriptive.
- Prefer one logical change per commit.

## 3. Local Checks

Run checks before opening a PR.

### Frontend

```bash
cd frontend/Youtube-Web/youtube-redesign-web
npm install
npm run lint
npm run build
```

### Backend

```bash
cd backend-custom/Youtube-Redesign-Backend
npm install
npm run build
```

## 4. Pull Request Expectations

Include in PR description:

- What changed
- Why it changed
- How to test it
- Screenshots (if UI changed)

## 5. Scope Rules

- Keep provider-specific changes isolated (`custom`, `firebase`, `supabase`).
- Do not mix large refactors with unrelated bug fixes.
