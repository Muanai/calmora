---
description: Generate atomic Git commit commands from the Git changes provided by the user.
---

## Purpose

Analyze the provided Git status/diff and split changes into logically independent
atomic commits.

The workflow must generate:
1. An explicit `git add` command for each atomic change.
2. A corresponding `git commit` command using Conventional Commits.

## Rules

### Atomicity

- Each commit must represent one logical change.
- Do not combine unrelated changes into one commit.
- Files belonging to the same feature, fix, test, refactor, or documentation
  change should normally be committed together.
- Tests should normally be included with the implementation they test.
- Configuration changes should be grouped with the feature they configure
  when they are directly coupled.
- Documentation should be separated when it represents an independent change.

### Git Add

Always use explicit file paths.

Never generate:

```bash
git add .
git add -A
git add --all
git add -u
````

Example:

```bash
git add src/api/users.py tests/test_users.py
```

### Commit Message

Use Conventional Commits:

```text
<type>: <description>
```

Allowed types:

* feat
* fix
* refactor
* test
* docs
* chore
* ci
* build
* perf

Use imperative, concise descriptions.

Good:

```text
feat: add user validation
fix: handle missing authentication token
test: add user validation tests
docs: update API usage examples
```

Avoid:

```text
updated stuff
changes
fixes
final changes
misc
update code
```

### Safety

Do not execute Git commands.

Do not invent changes that are not present in the provided Git information.

Do not invent issue numbers, scopes, ticket IDs, or project context.

If the provided information is insufficient to determine atomic grouping,
state the ambiguity and ask for the relevant diff.

## Input

The user may provide:

* `git status`
* `git diff --stat`
* `git diff`
* or a combination of these.

Prefer `git diff` when available because it provides enough context to determine
whether files belong to the same logical change.

## Output

Return only the commands needed to create the atomic commits.

For multiple commits, separate them clearly:

### Commit 1

```bash
git add <explicit files>
git commit -m "<message>"
```

### Commit 2

```bash
git add <explicit files>
git commit -m "<message>"
```

Do not execute the commands.

````

---

# Saya malah menyarankan satu improvement

Karena Anda sedang mulai membangun **workflow ecosystem untuk Antigravity**, jangan desain ini sebagai sekadar `commit-message-generator`.

Buat mental model:

```text
/atomic-commit
        │
        ▼
   Inspect changes
        │
        ▼
 Determine logical units
        │
        ▼
   Group files
        │
        ▼
 Generate commit messages
        │
        ▼
 Explicit git add
        │
        ▼
 Explicit git commit
````

Dengan begitu nanti Anda bisa membuat workflow lain:

```text
/spec
/test
/review
/debug
/docs
/atomic-commit
/pr
```

dan semuanya punya **contract** yang jelas.

Misalnya workflow berikutnya:

```text
/review
```

bisa memiliki aturan:

```text
Read:
- AGENTS.md
- spec/
- relevant source files
- tests/

Then:
1. identify correctness issues
2. identify missing tests
3. identify maintainability issues
4. identify security risks

Do not modify files.
