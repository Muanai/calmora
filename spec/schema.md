# SCHEMA.md: Database Schema

## Overview
This document details the database schema for the Calmora backend. The database uses SQLModel (SQLAlchemy) for ORM.

## Tables

### 1. `users`
Stores user account information, shadow points, and sponsorship status.

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
| `encrypted_content` | `String` | - | - | The encrypted text content of the journal. |
| `mood_tag` | `String` \| `None`| Indexed | `None` | Emotional state tag associated with the entry. |
| `created_at` | `DateTime` | - | `utcnow()` | Timestamp of journal creation. |

## Relations
- **One-to-One:** `users` to `waitlist` (`user_id` is unique in `waitlist`).
- **One-to-Many:** `users` to `action_logs` (A user can have multiple action logs).
- **One-to-Many:** `users` to `journal_entries` (A user can have multiple journal entries).
