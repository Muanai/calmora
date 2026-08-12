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

- [X] **Task 1.1:** Create `app/models/user.py`. Define the `User` table with a UUID primary key, standard user fields, `shadow_points` (default 0), and `eligible_for_optin` (default false).
- [X] **Task 1.2:** Create `app/models/waitlist.py`. Define the `Waitlist` table that tracks users eligible for the Pay-It-Forward program.
- [X] **Task 1.3:** Create `app/models/action_log.py`. Define the `ActionLog` table to record grounding exercises and micro-steps.
- [X] **Task 1.4:** Create `app/models/journal_entry.py`. Define the `JournalEntry` table with an `encrypted_content` string column.

---

## Phase 2: Core Utilities & Security ✅
**Objective:** Build standalone utility functions that do not depend on the API layer.

- [X] **Task 2.1:** Implement `app/utils/crypto_burn.py`. Create a single transaction function that takes a `user_id` and executes a cascade delete across all tables (`User`, `ActionLog`, `JournalEntry`, `Waitlist`).
- [X] **Task 2.2:** Implement `app/utils/text_chunker.py`. Create a pure function to split string text into 300-500 token chunks with 50-token overlap for RAG preparation.

---

## Phase 3: Business Logic (Services) ✅
**Objective:** Implement the core engines of Calmora without touching HTTP requests.

- [X] **Task 3.1:** Implement `app/services/shadow_point.py`. Write a function to process action logs. Logic: Add 10 points for `quick_calm` (max 3x/day), 20 points for `journal` (max 2x/day), 30/40/50 points for `micro_step_lv1/lv2/lv3` (max 1x/day each). If total points >= 150, mark user as `eligible_for_optin`. User choosing opt-in enters `Waitlist`.
- [X] **Task 3.2:** Implement `app/services/sponsor_distribution.py`. Write a function that triggers upon a donation: pop the top user from the `Waitlist`, change their account status to `premium`, and reset their points.
- [X] **Task 3.3:** Implement `app/services/rag_engine.py`. Write an asynchronous generator function that takes a user message, simulates a vector search, and yields text tokens streamingly via an external LLM call (e.g., httpx async call).

---

## Phase 4: API Routers (The Interface) ✅
**Objective:** Connect the HTTP layer to the business logic using FastAPI routers.

- [X] **Task 4.1:** Implement `app/api/chat.py`. Expose `POST /api/v1/chat/stream`. Map this endpoint to return a `StreamingResponse` powered by `rag_engine.py`.
- [X] **Task 4.2:** Implement `app/api/actions.py`. Expose `POST /api/v1/actions/grounding`. Return a 200 OK immediately, and use FastAPI's `BackgroundTasks` to send the payload to `shadow_point.py` for point calculation.
- [X] **Task 4.3:** Implement `app/api/privacy.py`. Expose `DELETE /api/v1/privacy/burn/{user_id}`. Call the `crypto_burn.py` utility.
- [X] **Task 4.4:** Implement `app/api/sponsor.py` (including `POST /optin` for Empathic Opt-In) and `app/api/journal.py` (with BackgroundTasks shadow point trigger).

---

## Phase 5: Application Assembly
**Objective:** Wire everything together into a running FastAPI instance.

- [X] **Task 5.1:** Implement `app/core/config.py` using Pydantic `BaseSettings` to load environment variables (e.g., `DATABASE_URL`, `LLM_API_KEY`).
- [X] **Task 5.2:** Implement `app/core/database.py` for database session dependency injection.
- [X] **Task 5.3:** Implement `app/core/security.py` for Clerk JWT authentication logic using `PyJWT` and Clerk JWKS endpoint.
- [X] **Task 5.4:** Implement `app/main.py`. Initialize the FastAPI application. Include all routers from `app/api/`. Set up global HTTP exception handlers. Add CORS middleware for Expo development. Add lifespan events for database engine startup/shutdown.

---

## Phase 6: Database Migration & Deployment 🔓 NO DEPENDENCY
**Objective:** Set up Alembic migrations and provision Neon DB. Can be done independently of UI/UX.

- [ ] **Task 6.1:** Install `alembic` and `asyncpg`. Initialize Alembic config with async SQLAlchemy engine pointing to `DATABASE_URL`.
- [ ] **Task 6.2:** Generate initial migration from all SQLModel models (`User`, `Waitlist`, `ActionLog`, `JournalEntry`). Run `alembic upgrade head` against Neon DB.
- [ ] **Task 6.3:** Create `.env.example` with all required environment variables documented. Add `.env` to `.gitignore`.

---

# ═══════════════════════════════════════════
# FRONTEND MOBILE (React Native / Expo)
# ═══════════════════════════════════════════

## Phase 7: Expo Project Scaffold 🔓 NO DEPENDENCY
**Objective:** Initialize the React Native Expo project and install all dependencies. Can be done NOW without UI/UX designs.

- [ ] **Task 7.1:** Initialize Expo project using `npx create-expo-app@latest` with TypeScript template in `mobile/` directory.
- [ ] **Task 7.2:** Install core dependencies: `nativewind`, `react-native-reanimated`, `zustand`, `axios`, `react-native-sse`, `@clerk/clerk-expo`, `expo-secure-store`.
- [ ] **Task 7.3:** Configure NativeWind (tailwind.config.js, babel plugin) and React Native Reanimated (babel plugin).
- [ ] **Task 7.4:** Set up Expo Router file-based navigation structure: `app/(auth)/`, `app/(tabs)/`, `app/_layout.tsx`.

---

## Phase 8: Auth & API Client Layer 🔓 NO DEPENDENCY
**Objective:** Set up Clerk authentication and API client. Can be done NOW without UI/UX designs.

- [ ] **Task 8.1:** Configure Clerk Expo provider in root `_layout.tsx`. Set up `tokenCache` using `expo-secure-store`.
- [ ] **Task 8.2:** Create `lib/api.ts`. Build a typed Axios instance with `baseURL` pointing to FastAPI backend. Add Clerk token interceptor that injects `Authorization: Bearer <token>` on every request.
- [ ] **Task 8.3:** Create `lib/sse.ts`. Build a helper to consume SSE streams from `POST /api/v1/chat/stream` using `react-native-sse`, returning an async iterable of text tokens.
- [ ] **Task 8.4:** Create auth screens: `app/(auth)/sign-in.tsx` and `app/(auth)/sign-up.tsx` using `@clerk/clerk-expo` components. Apply basic styling placeholder (will be reskinned after Rasya's designs).

---

## Phase 9: Zustand State Management 🔓 NO DEPENDENCY
**Objective:** Build the global state stores. Purely logic, no UI needed.

- [ ] **Task 9.1:** Create `stores/chat-store.ts`. Manage chat messages array, streaming status, and SSE connection lifecycle.
- [ ] **Task 9.2:** Create `stores/action-store.ts`. Manage grounding exercise state (timer, completion) and fire `POST /api/v1/actions/grounding` on completion.
- [ ] **Task 9.3:** Create `stores/user-store.ts`. Cache user profile, account type, and `eligible_for_optin` flag from `GET /api/v1/sponsor/status/{user_id}`.

---

## Phase 10: Core Reusable Components 🔓 NO DEPENDENCY
**Objective:** Build functional components that work regardless of final visual design. Logic-heavy, design-light.

- [ ] **Task 10.1:** Build `components/BreathingCircle.tsx`. Animated expanding/shrinking circle using React Native Reanimated for box breathing exercise. Pure animation logic — colors/sizes easily re-skinnable.
- [ ] **Task 10.2:** Build `components/ChatBubble.tsx`. Renders a single chat message (user vs AI). Supports streaming text with typing indicator animation.
- [ ] **Task 10.3:** Build `components/EmpatheticPopup.tsx`. Modal implementing BL5 Empathic Opt-In flow with two choices ("Masuk Antrean" / "Berlangganan Mandiri"). Calls `POST /api/v1/sponsor/optin`.

---

## Phase 11: Screen Implementation ⏳ BLOCKED — Needs UI/UX from Rasya
**Objective:** Implement the final screens based on Hi-Fi mockups from Rasya.

- [ ] **Task 11.1:** Implement `app/(tabs)/index.tsx` — Dashboard/Home screen with quick access to Penenang Cepat and daily mission status.
- [ ] **Task 11.2:** Implement `app/(tabs)/chat.tsx` — S.O.S AI Companion chat screen with SSE streaming.
- [ ] **Task 11.3:** Implement `app/(tabs)/journal.tsx` — Jurnal Kecemasan entry screen with mood tag selector.
- [ ] **Task 11.4:** Implement `app/(tabs)/missions.tsx` — Misi Langkah Mikro screen showing Level 1/2/3 tasks.
- [ ] **Task 11.5:** Implement `app/(tabs)/profile.tsx` — User profile, account type, Burn Button, and settings.

---

## Phase 12: Integration & Polish ⏳ BLOCKED — Needs Business Decisions from Khansa
**Objective:** Wire up final business logic, LLM prompt tuning, and Dummy Wallet.

- [ ] **Task 12.1:** Integrate actual Gemini Flash Lite system prompt for S.O.S AI Companion based on Khansa's "Buku Panduan Karakter" and stress-testing results.
- [ ] **Task 12.2:** Implement Adaptive Task generation for Misi Langkah Mikro. LLM analyzes journal logs and generates personalized micro-step challenges (Level 1/2/3).
- [ ] **Task 12.3:** Implement Dummy Wallet Mockup UI for Premium subscription and "Paket Pahlawan" purchase flow (no real payment gateway).
- [ ] **Task 12.4:** Implement "Pahlawan" Banner on Dashboard promoting Pay-It-Forward sponsorship (ESG marketing strategy).

---

## Phase 13: Testing & Code Freeze
**Objective:** Final validation before Onboard & Summit.

- [ ] **Task 13.1:** Write backend integration tests: validate all API endpoints with correct/malformed payloads (AC1-AC4).
- [ ] **Task 13.2:** Run end-to-end flow test: Register → Quick Calm (3x) → Journal (2x) → Micro Step → accumulate 150 pts → Opt-In → Waitlist → Donation → Premium upgrade.
- [ ] **Task 13.3:** Bug fixing and iteration based on Rasya's usability testing feedback (SUS & SEQ via Maze).
- [ ] **Task 13.4:** Code freeze. Generate screen recordings for pitch deck. Write deployment documentation.