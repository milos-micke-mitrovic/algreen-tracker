# Contributing to Algreen Tracker

## Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Start dev server: `pnpm dev` (runs on http://localhost:3989)

## Branch Naming

Use these prefixes:
- `feature/` - New features (e.g., `feature/add-user-profile`)
- `fix/` - Bug fixes (e.g., `fix/login-validation`)
- `refactor/` - Code refactoring
- `docs/` - Documentation updates

## Workflow

1. **Never push directly to `main`**
2. Create a new branch from `main`
3. Make your changes
4. Run checks before committing:
   ```bash
   pnpm lint        # Check for errors
   pnpm format      # Format code
   pnpm build       # Ensure it builds
   ```
5. Create a Pull Request
6. Wait for review and approval
7. Squash and merge

## Commit Messages

Use clear, descriptive messages:
```
feat: add user authentication
fix: resolve login form validation
refactor: simplify api client
docs: update README
```

## Code Style

- Read `CLAUDE.md` for coding patterns and rules
- Use TypeScript strictly (no `any`)
- Use shadcn/ui components (don't create custom UI)
- Follow feature-based folder structure
- Use `@/` import alias

## Creating a New Feature

1. Create folder: `src/features/[feature-name]/`
2. Add subfolders as needed:
   ```
   src/features/users/
   ├── components/
   ├── hooks/
   ├── pages/
   ├── services/
   └── types/
   ```
3. Export page in `src/routes/index.tsx`

## Adding shadcn/ui Components

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add dialog
```

## Questions?

Ask in the PR comments or create a GitHub Discussion.
