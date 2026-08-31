# ARCHITECTURE.md: Technical Architecture & System Design

## 1. System Overview
Calmora Backend is a modular, purely asynchronous API service built to handle real-time AI streaming and background processing. The system acts as a stateless microservice bridging the Mobile App (Android/iOS) frontend with a PostgreSQL database (Neon DB) and an external LLM provider.

## 2. Technology Stack

### Backend Stack
The backend agent MUST strictly use the following stack. Do not introduce unauthorized libraries.
- **Runtime:** Python 3.12+
- **Framework:** FastAPI (Strictly Asynchronous)
- **Database ORM:** SQLModel (backed by SQLAlchemy async engine)
- **Database Engine:** PostgreSQL via Neon DB
- **Vector Engine:** `pgvector` (via Neon DB)
- **LLM Integration:** Direct Async HTTP (e.g., via `httpx` to Gemini), avoiding bloated frameworks like heavy LangChain if direct API is faster.
- **Authentication:** JWT (via Clerk Auth, validating Clerk JWTs in FastAPI)
- **Cryptography:** `cryptography` library for AES encryption of journal entries and chat memories.

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

### Backend
```text
backend/
├── app/
│   ├── api/                 # FastAPI Routers (Endpoints defined in API Contract)
│   │   ├── actions.py
│   │   ├── chat.py
│   │   ├── journal.py
│   │   ├── knowledge.py
│   │   ├── mission.py
│   │   ├── privacy.py
│   │   ├── sponsor.py
│   │   └── user.py
│   ├── core/                # Global configs, dependencies, and security
│   │   ├── config.py
│   │   ├── database.py
│   │   └── security.py
│   ├── models/              # SQLModel schema definitions (Database structures)
│   │   ├── action_log.py
│   │   ├── ai_memory.py
│   │   ├── chat_message.py
│   │   ├── journal_entry.py
│   │   ├── knowledge_chunk.py
│   │   ├── mission_log.py
│   │   ├── user.py
│   │   └── waitlist.py
│   ├── services/            # Core business logic (DO NOT put logic in routers)
│   │   ├── knowledge_ingestion.py
│   │   ├── memory_service.py
│   │   ├── rag_engine.py
│   │   ├── shadow_point.py
│   │   └── sponsor_distribution.py
│   ├── utils/               # Pure functions, encryption, text chunking
│   │   ├── crypto_burn.py
│   │   ├── encryption.py
│   │   ├── text_chunker.py
│   │   └── timezone.py
│   └── main.py              # FastAPI application initialization
├── alembic/                 # Database migrations
├── pyproject.toml
└── uv.lock
```

### Frontend (Mobile App)
```text
mobile/
├── app/                     # Expo Router (file-based routing)
│   ├── (auth)/              # Auth screens (sign-in, sign-up)
│   ├── (tabs)/              # Main tab screens (post-login)
│   ├── journal/             # Deep links and sub-routes for journals
│   ├── _layout.tsx          # Root layout (Clerk provider, navigation)
│   ├── calm.tsx             # Grounding exercise screen
│   ├── index.tsx            # Dashboard / Home
│   ├── meditation.tsx       # Meditation screen
│   ├── player.tsx           # Audio player screen
│   ├── referral.tsx         # Referrals
│   ├── settings.tsx         # Profile & Settings
│   ├── subscription.tsx     # Premium subscription modal/screen
│   └── write-journal.tsx    # Write journal entry
├── components/              # Reusable UI components
│   ├── dashboard/           # Dashboard specific components
│   ├── icons/               # Icon components
│   ├── CalmButton.tsx       
│   ├── ChatBubble.tsx       
│   ├── FloatingPlayer.tsx   
│   ├── FormInput.tsx        
│   ├── Logo.tsx             
│   ├── MemoriesModal.tsx    
│   ├── PrivacyModal.tsx     
│   ├── ProgressBar.tsx      
│   ├── RadioGroup.tsx       
│   └── SocialLoginOptions.tsx
├── stores/                  # Zustand state stores
│   ├── chat-store.ts
│   ├── grounding-store.ts
│   ├── journal-store.ts
│   ├── memory-store.ts
│   ├── mission-store.ts
│   ├── outfits-store.ts
│   ├── player-store.ts
│   └── user-store.ts
├── lib/                     # Utilities & API clients
│   └── api.ts               # Typed Axios instance + Clerk interceptor
├── tailwind.config.js
├── package.json
└── app.json
```