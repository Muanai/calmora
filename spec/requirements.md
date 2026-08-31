# REQUIREMENTS.md: Product Requirements Document

## 1. Problem Statement
Gen-Z students suffering from severe anxiety and agoraphobia experience extreme "room isolation" and "cognitive fatigue." Existing mental health solutions fail due to "clinical intimidation"—requiring complex registrations, video calls, or long forms during peak panic attacks. They need instantaneous, low-friction grounding tools and an empathetic AI companion accessible in one tap.

## 2. Goals and Non-Goals

### Goals
- Deliver a sub-1.5-second time-to-first-token for AI chat streaming to prevent user abandonment during panic episodes.
- Provide a 1-tap, login-free bypass for immediate grounding exercises (5-4-3-2-1 technique).
- Implement a "Shadow Point System" to distribute premium accounts automatically without triggering FOMO or anxiety (no leaderboards).
- Ensure total data sovereignty via a 1-click cryptographic "Burn Button" for permanent cascade deletion.

### Non-Goals & MVP Limitations
- **MVP Limitations (Competition Phase):** The backend features related to "Pay-It-Forward" distribution, full shadow point threshold validations, and real payment gateway integrations are NOT fully functional in this MVP phase (they are mocked, simulated, or partially implemented).
- Do NOT build a social network, forum, or public community feed.
- Do NOT diagnose medical conditions or replace certified psychologists.
- Do NOT implement traditional gamification elements like visible ranks, streaks penalization, or badges.
- Do NOT build payment gateway integrations in the MVP phase (use mocked payload for "Pay-It-Forward").

## 3. Functional Requirements
- **FR1: Real-Time RAG AI Companion:** The system must process user text, retrieve context from a vector database of clinical protocols, and stream the LLM response word-by-word.
- **FR2: Action Logging:** The system must track the completion of grounding exercises and micro-steps silently in the backend.
- **FR3: Shadow Point Accumulation:** The system must assign internal weights to completed actions and auto-update the user's position in a hidden sponsorship waiting list.
- **FR4: The Burn Button:** The system must provide a single endpoint to instantly drop all database rows associated with a specific `user_id`. (Note: User memories and journals are encrypted at rest; vector databases are reserved solely for global clinical guidelines).
- **FR5: Journaling & Memory:** The system must allow users to submit text entries tagged with emotional states, and AI must extract memories from chat, both encrypted at rest.

## 4. Business Logic & Validation Rules
- **BL1: Shadow Point Calculation (Effort Weights):**
  - `quick_calm` (Penenang Cepat / Latihan Napas & Grounding 5-4-3-2-1) = 10 points.
  - `journal` (Isi Jurnal Kecemasan) = 20 points.
  - `micro_step_lv1` (Misi Langkah Mikro Level 1) = 30 points.
  - `micro_step_lv2` (Misi Langkah Mikro Level 2) = 40 points.
  - `micro_step_lv3` (Misi Langkah Mikro Level 3) = 50 points.
- **BL2: Sponsorship Eligibility:** A user must accumulate a minimum of 150 shadow points to be eligible for the Empathic Opt-In flow. The system only counts points from users with `account_type: "free"`.
- **BL3: Pay-It-Forward Distribution:** When a `donation` payload is received, the system must pop the user with the highest point total from the `waiting_list`, upgrade their status to `premium`, and reset their points to 0.
- **BL4: Rate Limiting (Daily Point Cap):** Backend enforces maximum daily point accrual per `action_type` to prevent database spam and API cost overrun:
  - `quick_calm`: max 3x per day (max 30 points/day).
  - `journal`: max 2x per day (max 40 points/day).
  - `micro_step_lv1/lv2/lv3`: max 1x per day each (max 50 points/day).
- **BL5: Empathic Opt-In:** When a user's shadow points reach 150, the system marks them as `eligible_for_optin: true`. The frontend displays a surprise empathic pop-up with two choices: (A) "Ya, aku butuh bantuan donasi" → user_id enters Waiting List, (B) "Tidak, aku bisa berlangganan mandiri" → redirect to Payment Gateway (upselling).
- **Validation 1:** AI Chat endpoints reject any payload missing a valid `user_id` or with a `message` exceeding 1000 characters.
- **Validation 2:** Grounding log endpoints reject `duration_seconds` less than 0 or greater than 3600.

## 5. Edge Cases
- **EC1: Empty Vector Retrieval:** If the RAG query returns no relevant chunks (similarity score below threshold), the system must inject a default fallback prompt prioritizing emotional validation and hotline numbers.
- **EC2: Simultaneous Donations:** If multiple donations arrive at the exact same millisecond, database row locking must ensure no single user is granted premium twice.
- **EC3: LLM Provider Timeout:** If the external LLM provider fails to respond within 30 seconds, the system returns a predefined static grounding message.

## 6. Acceptance Criteria
- **AC1:** Sending a POST request to the chat endpoint successfully returns a Server-Sent Events (SSE) stream.
- **AC2:** Accumulating 150 shadow points triggers Empathic Opt-In eligibility. User choosing "Masuk Antrean" places the `user_id` into the sponsorship waiting list table.
- **AC3:** Triggering the Burn Button endpoint results in a 404 Not Found error for any subsequent queries targeting that `user_id` across all tables.
- **AC4:** The system passes all automated payload validation tests (rejecting malformed JSON with HTTP 422).