# ARCHITECTURE.md: Technical Architecture & System Design

## 1. System Overview
Calmora Backend is a modular, purely asynchronous API service built to handle real-time AI streaming and background processing. The system acts as a stateless microservice bridging the Mobile App (Android/iOS) frontend with a PostgreSQL database (Neon DB) and an external LLM provider.

## 2. Technology Stack

### Backend Stack
The backend agent MUST strictly use the following stack. Do not introduce unauthorized libraries.
- **Runtime:** Python 3.10+
- **Framework:** FastAPI (Strictly Asynchronous)
- **Database ORM:** SQLModel (backed by SQLAlchemy async engine)
- **Database Engine:** PostgreSQL via Neon DB
- **Vector Engine:** `pgvector` (via Neon DB)
- **LLM Integration:** Direct Async HTTP (e.g., via `httpx` to Gemini Flash Lite), avoiding bloated frameworks like heavy LangChain if direct API is faster.
- **Authentication:** JWT (via Clerk Auth, validating Clerk JWTs in FastAPI)
- **Cryptography:** `cryptography` library for AES encryption of journal entries.

### Frontend Stack (Mobile App)
The frontend MUST strictly use the following stack for Android/iOS development:
- **Core Framework:** React Native with Expo
- **Language:** TypeScript
- **State Management:** Zustand
- **Styling:** NativeWind (Tailwind for React Native)
- **Animations:** React Native Reanimated (for 60fps grounding exercises)
- **Data Fetching & SSE:** Axios & `react-native-sse` (for handling RAG streaming)
- **Authentication:** Clerk Expo SDK
- **Navigation:** Expo Router

## 3. Directory Structure (Absolute Law)
The agent MUST adhere strictly to this file structure. Do not invent new root folders.

```text
backend/
├── app/
│   ├── api/                 # FastAPI Routers (Endpoints defined in API Contract)
│   │   ├── chat.py
│   │   ├── actions.py
│   │   ├── journal.py
│   │   ├── privacy.py
│   │   └── sponsor.py
│   ├── core/                # Global configs, dependencies, and security
│   │   ├── config.py
│   │   ├── database.py
│   │   └── security.py
│   ├── models/              # SQLModel schema definitions (Database structures)
│   │   ├── user.py
│   │   ├── action_log.py
│   │   ├── journal_entry.py
│   │   └── waitlist.py
│   ├── services/            # Core business logic (DO NOT put logic in routers)
│   │   ├── rag_engine.py
│   │   ├── shadow_point.py
│   │   └── sponsor_distribution.py
│   ├── utils/               # Pure functions, encryption, text chunking
│   │   ├── crypto_burn.py
│   │   └── text_chunker.py
│   └── main.py              # FastAPI application initialization
├── requirements.txt
└── .env