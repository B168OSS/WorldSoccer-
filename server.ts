import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

app.use(express.json());

// Simple file-based persistent storage for Sandbox (mimicking PostgreSQL relational tables persistence)
const DB_FILE = path.join(process.cwd(), 'database.json');

interface LocalDB {
  users: Record<string, any>;
  matches: any[];
  chat: any[];
  payments: any[];
  leaderboard: any[];
}

const defaultDB: LocalDB = {
  users: {},
  matches: [],
  chat: [
    { id: '1', username: 'Löw_Kicker', message: 'Ready to kick some penalty shoots! ⚽', avatarEmoji: '⚽', timestamp: new Date().toISOString() },
    { id: '2', username: 'Te_eR_Admin', message: 'Welcome to World Soccer™! Have fun!', avatarEmoji: '👑', timestamp: new Date().toISOString() }
  ],
  payments: [],
  leaderboard: [
    { username: 'Löw_Kicker', totalStars: 108, matchesWon: 36, matchesPlayed: 40, countryCode: 'DE', avatarEmoji: '⚽', updatedAt: new Date().toISOString() },
    { username: 'Te_eR_Admin', totalStars: 95, matchesWon: 32, matchesPlayed: 35, countryCode: 'ID', avatarEmoji: '👑', updatedAt: new Date().toISOString() }
  ]
};

function readDB(): LocalDB {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error reading JSON DB', e);
  }
  return defaultDB;
}

function writeDB(data: LocalDB) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing JSON DB', e);
  }
}

// Ensure database file exists
if (!fs.existsSync(DB_FILE)) {
  writeDB(defaultDB);
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Pi User Authentication automatic verification
app.post('/api/auth/pi', async (req, res) => {
  const { accessToken, username } = req.body;
  if (!accessToken) {
    return res.status(400).json({ error: 'accessToken is required' });
  }

  try {
    // Call Pi API Endpoint: GET https://api.minepi.com/v2/me
    // Header Authorization: Bearer <accessToken>
    const response = await fetch('https://api.minepi.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.ok) {
      const piUser = await response.json();
      const verifiedUsername = piUser.username || username || 'Verified_Pi_User';

      // Load/save user persistence
      const db = readDB();
      if (!db.users[verifiedUsername]) {
        db.users[verifiedUsername] = {
          username: verifiedUsername,
          piUid: piUser.uid,
          lives: 2,
          boosters: { shoes: 0, gloves: 0 },
          created_at: new Date().toISOString()
        };
        writeDB(db);
      }

      return res.json({
        success: true,
        user: db.users[verifiedUsername],
        token: `mock_jwt_for_${verifiedUsername}`
      });
    } else {
      console.warn('Pi Authentication validation returned false. Creating fallback verified Guest mock profile for sandboxing.');
      const verifiedUsername = username || 'Guest_' + Math.floor(Math.random() * 100000);
      
      const db = readDB();
      if (!db.users[verifiedUsername]) {
        db.users[verifiedUsername] = {
          username: verifiedUsername,
          lives: 1,
          boosters: { shoes: 0, gloves: 0 },
          created_at: new Date().toISOString()
        };
        writeDB(db);
      }

      return res.json({
        success: true,
        user: db.users[verifiedUsername],
        token: `mock_jwt_for_${verifiedUsername}`
      });
    }
  } catch (e) {
    console.warn('Network exception during Pi Authenticate, issuing sandbox mock profile.', e);
    // Allow sandboxing testing locally
    const fallbackUsername = username || 'Local_Tester';
    const db = readDB();
    if (!db.users[fallbackUsername]) {
      db.users[fallbackUsername] = {
        username: fallbackUsername,
        lives: 2,
        boosters: { shoes: 1, gloves: 1 },
        created_at: new Date().toISOString()
      };
      writeDB(db);
    }
    return res.json({
      success: true,
      user: db.users[fallbackUsername],
      token: `mock_jwt_for_${fallbackUsername}`
    });
  }
});

// Update/Load User Matches, Achievements and stats
app.post('/api/user/match', (req, res) => {
  const authHeader = req.headers.authorization;
  const username = authHeader ? authHeader.replace('Bearer mock_jwt_for_', '') : 'Guest_User';

  const { won, stars, countryId, lives } = req.body;
  const db = readDB();

  if (db.users[username]) {
    db.users[username].lives = lives;
  }

  // Update Leaderboard calculations
  db.matches.push({ username, won, stars, countryId, date: new Date().toISOString() });

  const userMatches = db.matches.filter(m => m.username === username);
  const totalStars = userMatches.reduce((total, m) => total + (m.stars || 0), 0);
  const matchesWon = userMatches.filter(m => m.won).length;

  const lbIdx = db.leaderboard.findIndex(l => l.username === username);
  if (lbIdx >= 0) {
    db.leaderboard[lbIdx].totalStars = Math.max(db.leaderboard[lbIdx].totalStars, totalStars);
    db.leaderboard[lbIdx].matchesWon = matchesWon;
    db.leaderboard[lbIdx].matchesPlayed = userMatches.length;
    db.leaderboard[lbIdx].updatedAt = new Date().toISOString();
  } else {
    db.leaderboard.push({
      username,
      totalStars,
      matchesWon,
      matchesPlayed: userMatches.length,
      countryCode: countryId || 'GL',
      updatedAt: new Date().toISOString()
    });
  }

  writeDB(db);
  res.json({ success: true, user: db.users[username] });
});

// Shop purchases of Lives, boots and gloves
app.post('/api/store/purchase', (req, res) => {
  const authHeader = req.headers.authorization;
  const username = authHeader ? authHeader.replace('Bearer mock_jwt_for_', '') : 'Guest_User';

  const { packageId } = req.body;
  const db = readDB();

  const userObj = db.users[username];
  if (!userObj) {
    return res.status(404).json({ error: 'User profile not found' });
  }

  if (packageId === '2lives') userObj.lives += 2;
  else if (packageId === '5lives') userObj.lives += 5;
  else if (packageId === '12lives') userObj.lives += 12;
  else if (packageId === 'shoes1') userObj.boosters.shoes += 1;
  else if (packageId === 'shoes3') userObj.boosters.shoes += 3;
  else if (packageId === 'shoes5') userObj.boosters.shoes += 5;
  else if (packageId === 'gloves1') userObj.boosters.gloves += 1;
  else if (packageId === 'gloves3') userObj.boosters.gloves += 3;
  else if (packageId === 'gloves5') userObj.boosters.gloves += 5;

  db.payments.push({ username, packageId, date: new Date().toISOString() });
  writeDB(db);

  res.json({ success: true, user: userObj });
});

// Obrolan HTTP Chat interface
app.post('/api/chat', (req, res) => {
  const { msg } = req.body;
  const db = readDB();
  db.chat.unshift(msg);
  db.chat = db.chat.slice(0, 100);
  writeDB(db);

  // Broadcast to WebSockets if available
  broadcastChat(msg);

  res.json({ success: true });
});

app.get('/api/leaderboard', (req, res) => {
  const db = readDB();
  // Sort leaderboard ranks
  const sorted = db.leaderboard.sort((a, b) => b.totalStars - a.totalStars).slice(0, 50);
  res.json(sorted);
});

// Offline synchronized backlog queue posting
app.post('/api/sync', (req, res) => {
  const { backlog } = req.body;
  if (!backlog || !Array.isArray(backlog)) {
    return res.status(400).json({ error: 'Backlog required' });
  }
  console.log('Synchronizing batch backlog items:', backlog.length);
  res.json({ success: true });
});

// Setup Node HTTP Server
const server = createServer(app);

// Setup WebSocket Server for Live updates and Obrolan chat messages
const wss = new WebSocketServer({ noServer: true });
const activeSockets = new Set<WebSocket>();

server.on('upgrade', (request, socket, head) => {
  const pathname = new URL(request.url || '', `http://${request.headers.host}`).pathname;
  if (pathname === '/api/chat/ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

wss.on('connection', (ws: WebSocket) => {
  activeSockets.add(ws);

  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message);
      if (data && data.type === 'CHAT_MESSAGE') {
        const db = readDB();
        db.chat.unshift(data.msg);
        db.chat = db.chat.slice(0, 100);
        writeDB(db);

        // Broadcast to other subscribers matching criteria
        broadcastChat(data.msg);
      }
    } catch (e) {
      console.error('Error handling ws message frame', e);
    }
  });

  ws.on('close', () => {
    activeSockets.delete(ws);
  });
});

function broadcastChat(msg: any) {
  const payload = JSON.stringify({ type: 'CHAT_MESSAGE', msg });
  activeSockets.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  });
}

// Mount Vite middleware helper for development and static assets routing for production
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, HOST, () => {
    console.log(`World Soccer Full-Stack App running on http://${HOST}:${PORT}`);
  });
}

start();
