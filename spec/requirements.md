# REQUIREMENTS.md: Product Requirements Document

## 1. Problem Statement
Gen-Z students suffering from severe anxiety and agoraphobia experience extreme "room isolation" and "cognitive fatigue." Existing mental health solutions fail due to "clinical intimidation"—requiring complex registrations, video calls, or long forms during peak panic attacks. They need instantaneous, low-friction grounding tools and an empathetic AI companion accessible in one tap.

## 2. Goals and Non-Goals

### Goals
- Deliver a sub-1.5-second time-to-first-token for AI chat streaming to prevent user abandonment during panic episodes.
- Provide a 1-tap, login-free bypass for immediate grounding exercises (5-4-3-2-1 technique).
- Implement a "Shadow Point System" to distribute premium accounts automatically without triggering FOMO or anxiety (no leaderboards).
- Ensure total data sovereignty via a 1-click cryptographic "Burn Button" for permanent cascade deletion.

### Non-Goals
- Do NOT build a social network, forum, or public community feed.
- Do NOT diagnose medical conditions or replace certified psychologists.
- Do NOT implement traditional gamification elements like visible ranks, streaks penalization, or badges.
- Do NOT build payment gateway integrations in the MVP phase (use mocked payload for "Pay-It-Forward").

## 3. Functional Requirements
- **FR1: Real-Time RAG AI Companion:** The system must process user text, retrieve context from a vector database of clinical protocols, and stream the LLM response word-by-word.
- **FR2: Action Logging:** The system must track the completion of grounding exercises and micro-steps silently in the backend.
- **FR3: Shadow Point Accumulation:** The system must assign internal weights to completed actions and auto-update the user's position in a hidden sponsorship waiting list.
- **FR4: The Burn Button:** The system must provide a single endpoint to instantly drop all database rows and vector embeddings associated with a specific `user_id`.
- **FR5: Journaling:** The system must allow users to submit text entries tagged with emotional states, encrypted at rest.

## 4. Business Logic & Validation Rules
- **BL1: Shadow Point Calculation:** 
  - `54321_grounding` completion = 20 points.
  - `box_breathing` completion = 10 points.
  - `micro_step` completion = 50 points.
- **BL2: Sponsorship Eligibility:** A user must accumulate a minimum of 100 shadow points to enter the `waiting_list`.
- **BL3: Pay-It-Forward Distribution:** When a `donation` payload is received, the system must pop the user with the highest point total from the `waiting_list`, upgrade their status to `premium`, and reset their points to 0.
- **Validation 1:** AI Chat endpoints reject any payload missing a valid `user_id` or with a `message` exceeding 1000 characters.
- **Validation 2:** Grounding log endpoints reject `duration_seconds` less than 0 or greater than 3600.

## 5. Edge Cases
- **EC1: Empty Vector Retrieval:** If the RAG query returns no relevant chunks (similarity score below threshold), the system must inject a default fallback prompt prioritizing emotional validation and hotline numbers.
- **EC2: Simultaneous Donations:** If multiple donations arrive at the exact same millisecond, database row locking must ensure no single user is granted premium twice.
- **EC3: LLM Provider Timeout:** If the external LLM provider fails to respond within 3 seconds, the system returns a predefined static grounding message.

## 6. Acceptance Criteria
- **AC1:** Sending a POST request to the chat endpoint successfully returns a Server-Sent Events (SSE) stream.
- **AC2:** Completing 5 grounding exercises (20 points each) automatically places the `user_id` into the sponsorship waiting list table.
- **AC3:** Triggering the Burn Button endpoint results in a 404 Not Found error for any subsequent queries targeting that `user_id` across all tables.
- **AC4:** The system passes all automated payload validation tests (rejecting malformed JSON with HTTP 422).