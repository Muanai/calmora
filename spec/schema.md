# SCHEMA.md: Database Schema

## Overview
This document details the database schema for the Calmora backend. The database uses SQLModel (SQLAlchemy) for ORM.

## Tables

### 1. `users`
Stores user account information, shadow points, sponsorship status, and grounding level.

| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `String` | Primary Key | - | Clerk user identifier (e.g. `user_2xyz...`). |
| `email` | `String` | Unique, Indexed | - | User's email address (synced from Clerk). |
| `nama` | `String` \| `None` | - | `None` | User's full name (synced from Clerk metadata). |
| `umur` | `String` \| `None` | - | `None` | User's age (synced from Clerk metadata). |
| `agama` | `String` \| `None` | - | `None` | User's religion (synced from Clerk metadata). |
| `kondisi` | `String` \| `None` | - | `None` | User's clinical condition, e.g., agoraphobia (synced from Clerk metadata). |
| `asal_daerah` | `String` \| `None` | - | `None` | User's region (synced from Clerk metadata). |
| `jenis_kelamin` | `String` \| `None` | - | `None` | User's gender (synced from Clerk metadata). |
| `shadow_points` | `Integer` | - | `0` | Accumulated points from activities. |
| `account_type` | `String` | - | `"free"` | User account tier (e.g., "free", "premium"). |
| `eligible_for_optin` | `Boolean` | - | `False` | True if user has reached the 150 points threshold. |
| `sponsored_by` | `String` \| `None` | - | `None` | Name/ID of the sponsor if applicable. |
| `user_bio` | `String` \| `None` | - | `None` | Information written by the user about themselves. |
| `grounding_level` | `String` | - | `"Easy"` | The user's current grounding level based on journal moods. |
| `grounding_level_assessed_date` | `Date` \| `None` | - | `None` | The date the grounding level was last assessed. |
| `created_at` | `DateTime` | - | `utcnow()` | Timestamp of account creation. |
| `updated_at` | `DateTime` | - | `utcnow()` | Timestamp of last account update. |

### 2. `waitlist`
Manages users who are eligible for sponsorship and have opted into the waiting list.

| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key | `uuid4()` | Unique identifier for the waitlist entry. |
| `user_id` | `String` | Foreign Key (`users.id`), Unique, Indexed | - | The user in the waitlist. |
| `shadow_points` | `Integer` | Indexed | `0` | Snapshot or current shadow points used for prioritization. |
| `enrolled_at` | `DateTime` | - | `utcnow()` | Timestamp when the user joined the waitlist. |

### 3. `action_logs`
Silently tracks user activities (grounding exercises, micro-steps) for shadow point calculation.

| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key | `uuid4()` | Unique identifier for the log entry. |
| `user_id` | `String` | Foreign Key (`users.id`), Indexed | - | User who performed the action. |
| `action_type` | `String` | Indexed | - | Type of action (`quick_calm`, `journal`, `micro_step_lv1`, etc.). |
| `duration_seconds` | `Integer` | - | - | Duration of the action in seconds. |
| `completed` | `Boolean` | - | `False` | Whether the action was fully completed. |
| `logged_at` | `DateTime` | - | `utcnow()` | Timestamp of the action. |

### 4. `journal_entries`
Stores user journal submissions, encrypted at rest.

| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key | `uuid4()` | Unique identifier for the journal entry. |
| `user_id` | `String` | Foreign Key (`users.id`), Indexed | - | User who created the journal entry. |
| `title` | `String` \| `None`| - | `None` | The title of the journal entry. |
| `encrypted_content` | `String` | - | - | The encrypted text content of the journal. |
| `mood_tag` | `String` \| `None`| Indexed | `None` | Emotional state tag associated with the entry. |
| `created_at` | `DateTime` | - | `utcnow()` | Timestamp of journal creation. |

### 5. `mission_logs`
Tracks completed daily missions, grounding exercises, and micro-steps for the user.

| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key | `uuid4()` | Unique identifier for the mission log. |
| `user_id` | `String` | Foreign Key (`users.id`), Indexed | - | User who completed the mission. |
| `mission_id` | `String` | Indexed | - | Identifier of the mission (e.g. `grounding_easy`, `micro_step_lv1`). |
| `completed_at` | `DateTime` | - | `utcnow()` | Timestamp of mission completion. |

### 6. `chat_messages`
Stores AI companion chat messages, encrypted at rest.

| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key | `uuid4()` | Unique identifier for the chat message. |
| `user_id` | `String` | Foreign Key (`users.id`), Indexed | - | The user the chat belongs to. |
| `role` | `String` | Indexed | - | The sender role (`user` or `ai`). |
| `encrypted_content` | `String` | - | - | The encrypted message content. |
| `created_at` | `DateTime` | - | `utcnow()` | Timestamp of the message. |

### 7. `ai_memories`
Stores extracted facts and memories about the user from chat conversations, encrypted at rest.

| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key | `uuid4()` | Unique identifier for the memory. |
| `user_id` | `String` | Foreign Key (`users.id`), Indexed | - | The user the memory is about. |
| `memory_text` | `String` | - | - | The encrypted extracted memory text. |
| `source` | `String` | - | `"ai_generated"` | The source of the memory. |
| `created_at` | `DateTime` | - | `utcnow()` | Timestamp of the memory creation. |

### 8. `knowledge_chunks`
Stores embedded clinical guidelines and knowledge base for the RAG engine.

| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key | `uuid4()` | Unique identifier for the knowledge chunk. |
| `source_doc` | `String` | Indexed | - | Source document name. |
| `category` | `String` | Indexed | - | Category of the document. |
| `chunk_text` | `Text` | - | - | The plain text chunk content. |
| `embedding` | `vector(768)` | - | `None` | The pgvector embedding of the chunk text. |
| `created_at` | `DateTime` | - | `utcnow()` | Timestamp of chunk insertion. |

## Relations
- **One-to-One:** `users` to `waitlist` (`user_id` is unique in `waitlist`).
- **One-to-Many:** `users` to `action_logs` (A user can have multiple action logs).
- **One-to-Many:** `users` to `journal_entries` (A user can have multiple journal entries).
- **One-to-Many:** `users` to `mission_logs` (A user can have multiple mission logs).
- **One-to-Many:** `users` to `chat_messages` (A user can have multiple chat messages).
- **One-to-Many:** `users` to `ai_memories` (A user can have multiple AI memories).
