# TASKS.md: Step-by-Step Implementation Plan

## Execution Directives for AI Agent
- **Sequential Execution:** Execute ONE phase at a time. Do not move to the next phase until the current phase is fully coded and verified.
- **Zero-Comment Rule:** Generate pure code only. DO NOT write any comments or docstrings inside the `.py` files. 
- **Strict Typing:** All functions must have complete Python type hinting.

---

## Phase 1: Database Schema & Models
**Objective:** Establish the SQLModel data structures.

- [X] **Task 1.1:** Create `app/models/user.py`. Define the `User` table with a UUID primary key, standard user fields, and a `shadow_points` integer column (default 0).
- [X] **Task 1.2:** Create `app/models/waitlist.py`. Define the `Waitlist` table that tracks users eligible for the Pay-It-Forward program.
- [X] **Task 1.3:** Create `app/models/action_log.py`. Define the `ActionLog` table to record grounding exercises and micro-steps.
- [X] **Task 1.4:** Create `app/models/journal_entry.py`. Define the `JournalEntry` table with an `encrypted_content` string column.

---

## Phase 2: Core Utilities & Security
**Objective:** Build standalone utility functions that do not depend on the API layer.

- [ ] **Task 2.1:** Implement `app/utils/crypto_burn.py`. Create a single transaction function that takes a `user_id` and executes a cascade delete across all tables (`User`, `ActionLog`, `JournalEntry`, `Waitlist`).
- [ ] **Task 2.2:** Implement `app/utils/text_chunker.py`. Create a pure function to split string text into 300-500 token chunks with 50-token overlap for RAG preparation.

---

## Phase 3: Business Logic (Services)
**Objective:** Implement the core engines of Calmora without touching HTTP requests.

- [ ] **Task 3.1:** Implement `app/services/shadow_point.py`. Write a function to process action logs. Logic: Add 20 points for `54321_grounding`, 10 points for `box_breathing`, 50 points for `micro_step`. If total points >= 100, insert/update the user in the `Waitlist` table.
- [ ] **Task 3.2:** Implement `app/services/sponsor_distribution.py`. Write a function that triggers upon a donation: pop the top user from the `Waitlist`, change their account status to `premium`, and reset their points.
- [ ] **Task 3.3:** Implement `app/services/rag_engine.py`. Write an asynchronous generator function that takes a user message, simulates a vector search, and yields text tokens streamingly via an external LLM call (e.g., httpx async call).

---

## Phase 4: API Routers (The Interface)
**Objective:** Connect the HTTP layer to the business logic using FastAPI routers.

- [ ] **Task 4.1:** Implement `app/api/chat.py`. Expose `POST /api/v1/chat/stream`. Map this endpoint to return a `StreamingResponse` powered by `rag_engine.py`.
- [ ] **Task 4.2:** Implement `app/api/actions.py`. Expose `POST /api/v1/actions/grounding`. Return a 200 OK immediately, and use FastAPI's `BackgroundTasks` to send the payload to `shadow_point.py` for point calculation.
- [ ] **Task 4.3:** Implement `app/api/privacy.py`. Expose `DELETE /api/v1/privacy/burn/{user_id}`. Call the `crypto_burn.py` utility.
- [ ] **Task 4.4:** Implement `app/api/sponsor.py` and `app/api/journal.py` strictly following the endpoints defined in the API Contract.

---

## Phase 5: Application Assembly
**Objective:** Wire everything together into a running FastAPI instance.

- [ ] **Task 5.1:** Implement `app/core/config.py` using Pydantic `BaseSettings` to load environment variables (e.g., `DATABASE_URL`, `LLM_API_KEY`).
- [ ] **Task 5.2:** Implement `app/core/database.py` for database session dependency injection, and `app/core/security.py` for JWT authentication logic.
- [ ] **Task 5.3:** Implement `main.py`. Initialize the FastAPI application. Include all routers from the `app/api/` directory using `app.include_router()`. Set up global HTTP exception handlers to return standard JSON error formats.