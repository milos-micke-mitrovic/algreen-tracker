# Git Workflow Guide

This document explains how to work with Git on this project. Follow these steps exactly.

## Golden Rules

1. **NEVER work directly on `main` branch**
2. **ALWAYS create a new branch for your work**
3. **ALWAYS pull latest changes before starting**

---

## Daily Workflow

### Step 1: Get latest code (do this every morning)

```bash
git checkout main
git pull origin main
```

### Step 2: Create a new branch for your task

```bash
git checkout -b feature/your-task-name
```

**Branch naming:**
- `feature/` - for new features (e.g., `feature/login-page`)
- `fix/` - for bug fixes (e.g., `fix/button-color`)

**Examples:**
```bash
git checkout -b feature/user-profile
git checkout -b feature/add-dashboard
git checkout -b fix/header-alignment
```

### Step 3: Write your code

Work normally. Save files. Test your changes.

### Step 4: Check what you changed

```bash
git status
```

This shows all modified files in red/green.

### Step 5: Stage your changes

```bash
git add .
```

This prepares all changes for commit.

### Step 6: Commit your changes

```bash
git commit -m "feat: describe what you did"
```

**Commit message examples:**
- `feat: add login form`
- `fix: resolve header overlap`
- `refactor: simplify user service`

### Step 7: Push your branch to GitHub

```bash
git push origin feature/your-task-name
```

**First time pushing a branch?** Use:
```bash
git push -u origin feature/your-task-name
```

### Step 8: Create a Pull Request

1. Go to GitHub repository
2. You'll see a yellow banner: "feature/your-task-name had recent pushes"
3. Click **"Compare & pull request"**
4. Add a title and description
5. Click **"Create pull request"**
6. **Wait for review and approval**

### Step 9: After approval

Once approved, click **"Merge pull request"** (or ask Milos to merge).

### Step 10: Clean up

After merge, go back to main:
```bash
git checkout main
git pull origin main
git branch -d feature/your-task-name
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────┐
│  START OF DAY                                       │
│  git checkout main                                  │
│  git pull origin main                               │
│  git checkout -b feature/my-task                    │
├─────────────────────────────────────────────────────┤
│  WHILE WORKING                                      │
│  (just write code normally)                         │
├─────────────────────────────────────────────────────┤
│  READY TO SAVE                                      │
│  git add .                                          │
│  git commit -m "feat: what I did"                   │
│  git push origin feature/my-task                    │
├─────────────────────────────────────────────────────┤
│  THEN                                               │
│  Go to GitHub → Create Pull Request → Wait          │
└─────────────────────────────────────────────────────┘
```

---

## Common Problems & Solutions

### "I accidentally worked on main"

Don't panic. Move your changes to a new branch:
```bash
git checkout -b feature/my-work
git add .
git commit -m "feat: my changes"
git push origin feature/my-work
```

### "I need to update my branch with latest main"

```bash
git checkout main
git pull origin main
git checkout feature/my-branch
git merge main
```

If there are conflicts, ask Milos for help.

### "I can't push to main"

That's correct! You're not supposed to. Create a branch and Pull Request instead.

### "I made a typo in my commit message"

If you haven't pushed yet:
```bash
git commit --amend -m "correct message"
```

### "I want to undo my last commit"

If you haven't pushed yet:
```bash
git reset --soft HEAD~1
```

Your changes will be back to unstaged state.

---

## What NOT to do

❌ `git push origin main` - Never push directly to main
❌ `git push --force` - Never force push (ask Milos if needed)
❌ Working for days without pushing - Push daily to avoid big conflicts
❌ Committing `node_modules` or `.env` files - They're in .gitignore for a reason

---

## Need Help?

If you're stuck or confused:
1. **Don't panic**
2. **Don't force anything**
3. Ask Milos or post in team chat

Git mistakes are fixable. It's better to ask than to break something.
