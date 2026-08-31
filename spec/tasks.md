# TASKS.md: Step-by-Step Implementation Plan

## Execution Directives for AI Agent
- **Sequential Execution:** Execute ONE phase at a time. Do not move to the next phase until the current phase is fully coded and verified.
- **Zero-Comment Rule:** Generate pure code only. DO NOT write any comments or docstrings inside the `.py` or `.ts`/`.tsx` files. 
- **Strict Typing:** Python: complete type hints. TypeScript: strict mode, no `any`.

---

# ═══════════════════════════════════════════
# BACKEND (Python / FastAPI)
# ═══════════════════════════════════════════

## Phase 1: Database Schema & Models ✅
**Objective:** Establish the SQLModel data structures.

- [X] **Task 1.1:** Create `app/models/user.py`. Define the `User` table with a string primary key, standard user fields, `shadow_points`, and `grounding_level`.
- [X] **Task 1.2:** Create `app/models/waitlist.py`. Define the `Waitlist` table.
- [X] **Task 1.3:** Create `app/models/action_log.py`. Define the `ActionLog` table.
- [X] **Task 1.4:** Create `app/models/journal_entry.py`. Define the `JournalEntry` table with an `encrypted_content` string column.
- [X] **Task 1.5:** Create `app/models/chat_message.py` & `ai_memory.py`.
- [X] **Task 1.6:** Create `app/models/knowledge_chunk.py` for pgvector embeddings.
- [X] **Task 1.7:** Create `app/models/mission_log.py` for tracking completed tasks.

---

## Phase 2: Core Utilities & Security ✅
**Objective:** Build standalone utility functions that do not depend on the API layer.

- [X] **Task 2.1:** Implement `app/utils/crypto_burn.py`. Cascade delete function.
- [X] **Task 2.2:** Implement `app/utils/text_chunker.py`. String text split for RAG.
- [X] **Task 2.3:** Implement `app/utils/encryption.py` for chat memory encryption.

---

## Phase 3: Business Logic (Services) ✅
**Objective:** Implement the core engines of Calmora without touching HTTP requests.

- [X] **Task 3.1:** Implement `app/services/shadow_point.py`.
- [X] **Task 3.2:** Implement `app/services/sponsor_distribution.py`.
- [X] **Task 3.3:** Implement `app/services/rag_engine.py` using Async HTTP to Gemini.
- [X] **Task 3.4:** Implement `app/services/knowledge_ingestion.py` for RAG.
- [X] **Task 3.5:** Implement `app/services/memory_service.py` to handle AI context.

---

## Phase 4: API Routers (The Interface) ✅
**Objective:** Connect the HTTP layer to the business logic using FastAPI routers.

- [X] **Task 4.1:** Implement `app/api/chat.py`. Expose `POST /api/v1/chat/stream`.
- [X] **Task 4.2:** Implement `app/api/actions.py` and `app/api/mission.py`.
- [X] **Task 4.3:** Implement `app/api/privacy.py`. Expose `DELETE /api/v1/privacy/burn/{user_id}`.
- [X] **Task 4.4:** Implement `app/api/sponsor.py`, `app/api/journal.py`, `app/api/knowledge.py`, `app/api/user.py`.

---

## Phase 5: Application Assembly ✅
**Objective:** Wire everything together into a running FastAPI instance.

- [X] **Task 5.1:** Implement `app/core/config.py`.
- [X] **Task 5.2:** Implement `app/core/database.py`.
- [X] **Task 5.3:** Implement `app/core/security.py`.
- [X] **Task 5.4:** Implement `app/main.py`. Initialize the FastAPI application.

---

## Phase 6: Database Migration & Deployment ✅
**Objective:** Set up Alembic migrations and provision DB.

- [X] **Task 6.1:** Install `alembic`, `asyncpg`, `pgvector`.
- [X] **Task 6.2:** Generate migrations for all models. Run `alembic upgrade head`.

---

# ═══════════════════════════════════════════
# FRONTEND MOBILE (React Native / Expo)
# ═══════════════════════════════════════════

## Phase 7: Expo Project Scaffold ✅
**Objective:** Initialize the React Native Expo project and install dependencies.

- [X] **Task 7.1:** Initialize Expo project with TypeScript in `mobile/`.
- [X] **Task 7.2:** Install dependencies (Zustand, NativeWind, Clerk, Reanimated).
- [X] **Task 7.3:** Configure NativeWind and Reanimated.

---

## Phase 8: Auth & API Client Layer ✅
**Objective:** Set up Clerk authentication and API client.

- [X] **Task 8.1:** Configure Clerk Expo provider.
- [X] **Task 8.2:** Create `lib/api.ts` with Axios interceptor.
- [X] **Task 8.3:** Create auth screens `app/(auth)`.

---

## Phase 9: Zustand State Management ✅
**Objective:** Build the global state stores.

- [X] **Task 9.1:** Create stores in `stores/` (chat, memory, journal, mission, user, grounding).

---

## Phase 10: Core Reusable Components ✅
**Objective:** Build functional components.

- [X] **Task 10.1:** Build `CalmButton.tsx`, `ProgressBar.tsx`.
- [X] **Task 10.2:** Build `ChatBubble.tsx`, `MemoriesModal.tsx`.
- [X] **Task 10.3:** Build modals (`PrivacyModal.tsx`, `SocialLoginOptions.tsx`).

---

## Phase 11: Screen Implementation ✅
**Objective:** Implement the final screens based on mockups.

- [X] **Task 11.1:** Implement `app/(tabs)` (Dashboard, Meditation, Profile).
- [X] **Task 11.2:** Implement `app/calm.tsx` (Grounding/Chat).
- [X] **Task 11.3:** Implement `app/write-journal.tsx` & `app/journal/`.
- [X] **Task 11.4:** Implement `app/player.tsx` and `app/subscription.tsx`.

---

## Phase 12: Integration & Polish ⏳
**Objective:** Wire up final business logic and testing.

- [ ] **Task 12.1:** Polish UI animations and routing flow.
- [ ] **Task 12.2:** E2E testing of the shadow points calculation across the mobile app.
- [ ] **Task 12.3:** Run automated test suites for validation.