export type LevelType = 'EASY' | 'MEDIUM' | 'DIFFICULT' | 'HARD';

export interface CountryTeam {
  id: string;
  name: string;
  en_name: string;
  code: string; // ISO Code
  flag: string; // Flag Emoji
  jerseyColor: string; // Main Hex
  pantsColor: string;
  socksColor: string;
  jerseyPattern?: 'stripes' | 'solid' | 'hoops' | 'cross';
  difficulty: LevelType;
  stars: number; // Max 3 stars
  completed: boolean;
}

export interface UserProfile {
  username: string; // Pi username or Guest
  isGuest: boolean;
  lives: number;
  lastMatchTime: string | null;
  guestMatchesCount: number;
  avatarEmoji: string;
  avatarBg: string;
  created_at: string;
  boosters: {
    shoes: number; // Boot power (adds 60%, 75%, 90% accuracy)
    gloves: number; // Gloves save power
    jersey: number; // National jerseys booster quantity
  };
  unlockedJerseys?: string[]; // Array of country IDs unlocked
  activeJerseyId?: string; // Selected jersey (e.g., 'pi' or country ID)
}

export interface LeaderboardEntry {
  username: string;
  totalStars: number;
  matchesWon: number;
  matchesPlayed: number;
  countryCode: string;
  avatarEmoji: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  username: string;
  avatarEmoji: string;
  message: string;
  countryCode?: string;
  timestamp: string;
}

export interface MatchRound {
  userShot: 'LEFT' | 'CENTER' | 'RIGHT' | 'UP' | null;
  userShotResult: 'GOAL' | 'SAVE' | 'MISS' | null;
  aiShot: 'LEFT' | 'CENTER' | 'RIGHT' | null;
  aiShotResult: 'GOAL' | 'SAVE' | 'MISS' | null;
}

export interface ActiveMatch {
  userTeam: CountryTeam;
  aiTeam: CountryTeam;
  userScore: number;
  aiScore: number;
  currentRound: number;
  rounds: MatchRound[];
  state: 'PRE_MATCH' | 'KICKING' | 'GK_READY' | 'GK_PLAY' | 'CELEBRATION' | 'SAVED' | 'OUT' | 'WHISTLE' | 'FINISHED';
  whistlePlayed: boolean;
  timer: number;
  turn: 'KICKER' | 'GOALKEEPER';
  suddenDeath: boolean;
  activeBoosterUsed: boolean;
}

export interface MatchHistoryItem {
  id: string;
  won: boolean;
  stars: number;
  opponentName: string;
  opponentFlag: string;
  userScore: number;
  aiScore: number;
  date: string;
  userTeamName?: string;
  userTeamFlag?: string;
  timestamp?: string;
}

export interface GameSettings {
  audioGoals: boolean;
  audioWins: boolean;
}

