# World Soccer™ - Enterprise 2D Penalty Shootout Architecture Blueprint

## 1. Folder Structure
```
/
├── .env.example              # Environment variables template
├── .gitignore                # Ignored files mapping
├── assets/                   # Static/UI visual elements config
├── database.json             # File-persistent relational storage (Sandobox fallback)
├── index.html                # Main SPA markup mount point
├── metadata.json             # Core applet permissions and labels
├── package.json              # Node.js project manifests & scripts
├── server.ts                 # Express full-stack microservice with lives and payments handling
├── tsconfig.json             # TypeScript rules compiler config
├── vite.config.ts            # Vite asset pipeline compilation config
└── src/
    ├── App.tsx               # Primary lobby tab navigator container
    ├── index.css             # Tailwinds global styling entry point
    ├── main.tsx              # React mounting root
    ├── store.ts              # Zustand global state manager with local storage backup
    ├── types.ts              # Global strongly-typed contracts
    ├── components/
    │   ├── ChallengeTimer.tsx     # Daily tasks tracker widget
    │   ├── ChatRoom.tsx           # WebSockets real-time obrolan foyer
    │   ├── CountrySelection.tsx   # Paged 55 teams grid (Grouped by Levels Easy-Hard)
    │   ├── Leaderboard.tsx        # Global competition ranks scoreboard
    │   ├── OfflineSyncManager.tsx # Online/Offline network state adapter
    │   ├── PenaltyGame.tsx        # HTML5 interactive 2D physics shootout canvas engine
    │   └── PiPayModule.tsx        # Store purchases of Lives and Boosters with Pi payment integration
    └── utils/
        ├── audio.ts               # Web Audio API physical sound synthesizer
        └── translate.ts           # 14 languages localization dictionary selector
```

---

## 2. Architecture
The **World Soccer™** app follows a **Clean Feature-Based Full-Stack Architecture**. This isolates pure game mechanics logic from backend processing, authentication, and payments.

- **State Level (Zustand)**: Operates a client-side reactive model keeping data synchronized with LocalStorage, allowing offline playing seamlessly. When connectivity transitions to online, a background runner synchronizes the offline games backlog.
- **Game Engine (HTML5 Canvas)**: Developed using standard 2D vector layouts to bypass bulky script bundle loads. Ball physics uses standard projectile motion vectors, making matches highly immersive on lower-tier mobile hardware.
- **Audio Generation (Web Audio)**: Whistles and cheers are synthesized mathematically at runtime. This avoids raw file downloads and removes high-latency delays.
- **Backend (Express + WebSocket)**: Direct stateless Express routing and active WS socket frames handle chat messages and scoreboard update broadcasts instantly.

---

## 3. Database Schema
Designed to scale to PostgreSQL relational structures seamlessly.
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    lives INTEGER DEFAULT 2,
    shoes_boosters INTEGER DEFAULT 0,
    gloves_boosters INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) REFERENCES users(username),
    won BOOLEAN NOT NULL,
    stars INTEGER DEFAULT 0,
    country_id VARCHAR(10) NOT NULL,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_messages (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    avatar_emoji VARCHAR(10),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payment_logs (
    id SERIAL PRIMARY KEY,
    payment_id VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    package_id VARCHAR(50) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. API Contracts
- `POST /api/auth/pi`: Validate token against Pi servers.
  - Required Headers: `Content-Type: application/json`
  - Body: `{ accessToken: string, username: string }`
  - Response: `{ success: true, user: { username, lives, boosters }, token: string }`
- `GET /api/leaderboard`: Fetch top 50 player profiles on weekly high-score metrics.
  - Response: `Array<{ username, totalStars, matchesWon, matchesPlayed, countryCode, updatedAt }>`
- `POST /api/user/match`: Synchronize match outcome.
  - Body: `{ won: boolean, stars: number, countryId: string, lives: number }`
  - Response: `{ success: true }`
- `POST /api/store/purchase`: Process buy upgrades.
  - Body: `{ packageId: string }`
  - Response: `{ success: true, user: { ... } }`

---

## 5. Security Configuration
- **Token Verification**: Server validate client-side tokens directly with Pi main endpoints via HTTPS (`Authorization: Bearer <accessToken>`).
- **Data Sanitization**: Backend filters chat messages, strip HTML characters, preventing Cross-Site Scripting (XSS).
- **Rate limiting**: Heavy operations like user registrations and message sending are protected by rate limits.

---

## 6. Testing Strategy
- **Unit Tests**: Check that state transitions match specifications (e.g. Sudden Death, goal scoring counts, booster multipliers).
- **Visual Tests**: Validate standard canvas resizing and orientation support across Android, iOS, and Smart TV screen ratios.
- **Lobby Sync Testing**: Validate offline queue backlog syncing correctly during sudden internet disruptions.

---

## 7. CI/CD Pipeline
- **Continuous Integration**: Triggers automated ESLint analysis and compiles using TypeScript `npm run lint`.
- **Continuous Deployment**: Compiles backend using esbuild CJS bundling, targets static files directory with Vite, compiles into `dist/server.cjs`, and launches into secure docker containers.

---

## 8. Production Checklist
1. Verify `Pi.init` version code corresponds to `"2.0"` in App.tsx.
2. Ensure Sandbox remains set to `false` when launching into Pi Mainnet ecosystems.
3. Configure PostgreSQL connection drivers under production variables, replacing `database.json` dynamically.
