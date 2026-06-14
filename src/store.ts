import { create } from 'zustand';
import { CountryTeam, UserProfile, LeaderboardEntry, ChatMessage, LevelType, MatchHistoryItem, GameSettings } from './types';

export const INITIAL_COUNTRIES: CountryTeam[] = [
  // LEVEL 1: EASY (11 teams + 3 extra = 14)
  { id: 'CZ', name: 'Republik Ceko', en_name: 'Czechia', code: 'CZ', flag: '🇨🇿', jerseyColor: '#E41C14', pantsColor: '#FFFFFF', socksColor: '#002F6C', difficulty: 'EASY', stars: 0, completed: false },
  { id: 'CH', name: 'Swiss', en_name: 'Switzerland', code: 'CH', flag: '🇨🇭', jerseyColor: '#D32F2F', pantsColor: '#FFFFFF', socksColor: '#D32F2F', difficulty: 'EASY', stars: 0, completed: false },
  { id: 'SCO', name: 'Skotlandia', en_name: 'Scotland', code: 'GB-SCT', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', jerseyColor: '#001E50', pantsColor: '#FFFFFF', socksColor: '#001E50', difficulty: 'EASY', stars: 0, completed: false },
  { id: 'TR', name: 'Turki', en_name: 'Turkey', code: 'TR', flag: '🇹🇷', jerseyColor: '#E30A17', pantsColor: '#FFFFFF', socksColor: '#E30A17', difficulty: 'EASY', stars: 0, completed: false },
  { id: 'EC', name: 'Ekuador', en_name: 'Ecuador', code: 'EC', flag: '🇪🇨', jerseyColor: '#FFD700', pantsColor: '#0033A0', socksColor: '#D21034', difficulty: 'EASY', stars: 0, completed: false },
  { id: 'TN', name: 'Tunisia', en_name: 'Tunisia', code: 'TN', flag: '🇹🇳', jerseyColor: '#E41C14', pantsColor: '#FFFFFF', socksColor: '#E41C14', difficulty: 'EASY', stars: 0, completed: false },
  { id: 'NZ', name: 'Selandia Baru', en_name: 'New Zealand', code: 'NZ', flag: '🇳🇿', jerseyColor: '#0D0D0D', pantsColor: '#0D0D0D', socksColor: '#0D0D0D', difficulty: 'EASY', stars: 0, completed: false },
  { id: 'UY', name: 'Uruguay', en_name: 'Uruguay', code: 'UY', flag: '🇺🇾', jerseyColor: '#5CA1D4', pantsColor: '#FFFFFF', socksColor: '#FFFFFF', difficulty: 'EASY', stars: 0, completed: false },
  { id: 'JO', name: 'Yordania', en_name: 'Jordan', code: 'JO', flag: '🇯🇴', jerseyColor: '#107C41', pantsColor: '#FFFFFF', socksColor: '#E30A17', difficulty: 'EASY', stars: 0, completed: false },
  { id: 'CO', name: 'Kolombia', en_name: 'Colombia', code: 'CO', flag: '🇨🇴', jerseyColor: '#FCD116', pantsColor: '#003893', socksColor: '#CE1126', difficulty: 'EASY', stars: 0, completed: false },
  { id: 'PA', name: 'Panama', en_name: 'Panama', code: 'PA', flag: '🇵🇦', jerseyColor: '#DA121A', pantsColor: '#FFFFFF', socksColor: '#0F47AF', difficulty: 'EASY', stars: 0, completed: false },
  // Extra EASY:
  { id: 'TH', name: 'Thailand', en_name: 'Thailand', code: 'TH', flag: '🇹🇭', jerseyColor: '#00247D', pantsColor: '#FFFFFF', socksColor: '#00247D', difficulty: 'EASY', stars: 0, completed: false },
  { id: 'VN', name: 'Vietnam', en_name: 'Vietnam', code: 'VN', flag: '🇻🇳', jerseyColor: '#DA251D', pantsColor: '#DA251D', socksColor: '#DA251D', difficulty: 'EASY', stars: 0, completed: false },
  { id: 'MY', name: 'Malaysia', en_name: 'Malaysia', code: 'MY', flag: '🇲🇾', jerseyColor: '#FFCC00', pantsColor: '#000000', socksColor: '#FFCC00', difficulty: 'EASY', stars: 0, completed: false },
  { id: 'IN', name: 'India', en_name: 'India', code: 'IN', flag: '🇮🇳', jerseyColor: '#FF9933', pantsColor: '#FFFFFF', socksColor: '#138808', difficulty: 'EASY', stars: 0, completed: false },
  { id: 'ID', name: 'Indonesia', en_name: 'Indonesia', code: 'ID', flag: '🇮🇩', jerseyColor: '#E01A22', pantsColor: '#FFFFFF', socksColor: '#E01A22', difficulty: 'EASY', stars: 0, completed: false },
  { id: 'PY', name: 'Paraguay', en_name: 'Paraguay', code: 'PY', flag: '🇵🇾', jerseyColor: '#D21034', pantsColor: '#FFFFFF', socksColor: '#0038A8', jerseyPattern: 'stripes', difficulty: 'EASY', stars: 0, completed: false },

  // LEVEL 2: MEDIUM (12 teams + 2 extra = 14)
  { id: 'KR', name: 'Korea Selatan', en_name: 'South Korea', code: 'KR', flag: '🇰🇷', jerseyColor: '#E30A17', pantsColor: '#000000', socksColor: '#E30A17', difficulty: 'MEDIUM', stars: 0, completed: false },
  { id: 'QA', name: 'Qatar', en_name: 'Qatar', code: 'QA', flag: '🇶🇦', jerseyColor: '#8A1538', pantsColor: '#FFFFFF', socksColor: '#8A1538', difficulty: 'MEDIUM', stars: 0, completed: false },
  { id: 'HT', name: 'Haiti', en_name: 'Haiti', code: 'HT', flag: '🇭🇹', jerseyColor: '#00209G', pantsColor: '#D21034', socksColor: '#00209G', difficulty: 'MEDIUM', stars: 0, completed: false },
  { id: 'CI', name: 'Pantai Gading', en_name: 'Ivory Coast', code: 'CI', flag: '🇨🇮', jerseyColor: '#FF8200', pantsColor: '#FFFFFF', socksColor: '#FF8200', difficulty: 'MEDIUM', stars: 0, completed: false },
  { id: 'SE', name: 'Swedia', en_name: 'Sweden', code: 'SE', flag: '🇸🇪', jerseyColor: '#FFCD00', pantsColor: '#006AA7', socksColor: '#FFCD00', difficulty: 'MEDIUM', stars: 0, completed: false },
  { id: 'IR', name: 'Iran', en_name: 'Iran', code: 'IR', flag: '🇮🇷', jerseyColor: '#FFFFFF', pantsColor: '#107C41', socksColor: '#E30A17', difficulty: 'MEDIUM', stars: 0, completed: false },
  { id: 'SA', name: 'Arab Saudi', en_name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦', jerseyColor: '#107C41', pantsColor: '#FFFFFF', socksColor: '#107C41', difficulty: 'MEDIUM', stars: 0, completed: false },
  { id: 'IQ', name: 'Irak', en_name: 'Iraq', code: 'IQ', flag: '🇮🇶', jerseyColor: '#107C41', pantsColor: '#FFFFFF', socksColor: '#E30A17', difficulty: 'MEDIUM', stars: 0, completed: false },
  { id: 'NO', name: 'Norwegia', en_name: 'Norway', code: 'NO', flag: '🇳🇴', jerseyColor: '#EF2B2D', pantsColor: '#FFFFFF', socksColor: '#00205B', difficulty: 'MEDIUM', stars: 0, completed: false },
  { id: 'AT', name: 'Austria', en_name: 'Austria', code: 'AT', flag: '🇦🇹', jerseyColor: '#EF2B2D', pantsColor: '#FFFFFF', socksColor: '#EF2B2D', difficulty: 'MEDIUM', stars: 0, completed: false },
  { id: 'UZ', name: 'Uzbekistan', en_name: 'Uzbekistan', code: 'UZ', flag: '🇺🇿', jerseyColor: '#0099B5', pantsColor: '#FFFFFF', socksColor: '#FFFFFF', difficulty: 'MEDIUM', stars: 0, completed: false },
  { id: 'GH', name: 'Ghana', en_name: 'Ghana', code: 'GH', flag: '🇬🇭', jerseyColor: '#FFFFFF', pantsColor: '#000000', socksColor: '#FFFFFF', difficulty: 'MEDIUM', stars: 0, completed: false },
  // Extra MEDIUM:
  { id: 'CN', name: 'China', en_name: 'China', code: 'CN', flag: '🇨🇳', jerseyColor: '#EE1C25', pantsColor: '#FFFFFF', socksColor: '#EE1C25', difficulty: 'MEDIUM', stars: 0, completed: false },

  // LEVEL 3: DIFFICULT (12 teams)
  { id: 'ZA', name: 'Afrika Selatan', en_name: 'South Africa', code: 'ZA', flag: '🇿🇦', jerseyColor: '#FFF200', pantsColor: '#007A33', socksColor: '#000000', difficulty: 'DIFFICULT', stars: 0, completed: false },
  { id: 'BA', name: 'Bosnia dan Herzegovina', en_name: 'Bosnia & Herzegovina', code: 'BA', flag: '🇧🇦', jerseyColor: '#002F6C', pantsColor: '#FFFFFF', socksColor: '#002F6C', difficulty: 'DIFFICULT', stars: 0, completed: false },
  { id: 'MA', name: 'Maroko', en_name: 'Morocco', code: 'MA', flag: '🇲🇦', jerseyColor: '#C1272D', pantsColor: '#006233', socksColor: '#C1272D', difficulty: 'DIFFICULT', stars: 0, completed: false },
  { id: 'CW', name: 'Curaçao', en_name: 'Curaçao', code: 'CW', flag: '🇨🇼', jerseyColor: '#002B7F', pantsColor: '#FFFFFF', socksColor: '#FFD100', difficulty: 'DIFFICULT', stars: 0, completed: false },
  { id: 'AU', name: 'Australia', en_name: 'Australia', code: 'AU', flag: '🇦🇺', jerseyColor: '#FFCD00', pantsColor: '#004B2F', socksColor: '#FFCD00', difficulty: 'DIFFICULT', stars: 0, completed: false },
  { id: 'JP', name: 'Jepang', en_name: 'Japan', code: 'JP', flag: '🇯🇵', jerseyColor: '#1E3B7B', pantsColor: '#FFFFFF', socksColor: '#1E3B7B', difficulty: 'DIFFICULT', stars: 0, completed: false },
  { id: 'EG', name: 'Mesir', en_name: 'Egypt', code: 'EG', flag: '🇪🇬', jerseyColor: '#C1272D', pantsColor: '#FFFFFF', socksColor: '#000000', difficulty: 'DIFFICULT', stars: 0, completed: false },
  { id: 'CV', name: 'Tanjung Verde', en_name: 'Cape Verde', code: 'CV', flag: '🇨🇻', jerseyColor: '#003893', pantsColor: '#FFFFFF', socksColor: '#CE1126', difficulty: 'DIFFICULT', stars: 0, completed: false },
  { id: 'SN', name: 'Senegal', en_name: 'Senegal', code: 'SN', flag: '🇸🇳', jerseyColor: '#FFFFFF', pantsColor: '#FFFFFF', socksColor: '#107C41', difficulty: 'DIFFICULT', stars: 0, completed: false },
  { id: 'DZ', name: 'Aljazair', en_name: 'Algeria', code: 'DZ', flag: '🇩🇿', jerseyColor: '#FFFFFF', pantsColor: '#FFFFFF', socksColor: '#107C41', difficulty: 'DIFFICULT', stars: 0, completed: false },
  { id: 'CD', name: 'Republik Demokratik Kongo', en_name: 'DR Congo', code: 'CD', flag: '🇨🇩', jerseyColor: '#007FFF', pantsColor: '#FFFFFF', socksColor: '#007FFF', difficulty: 'DIFFICULT', stars: 0, completed: false },
  { id: 'HR', name: 'Kroasia', en_name: 'Croatia', code: 'HR', flag: '🇭🇷', jerseyColor: '#FF0000', pantsColor: '#FFFFFF', socksColor: '#0000FF', jerseyPattern: 'stripes', difficulty: 'DIFFICULT', stars: 0, completed: false },

  // LEVEL 4: HARD DIFFICULT (13 teams + 1 extra = 14)
  { id: 'MX', name: 'Meksiko', en_name: 'Mexico', code: 'MX', flag: '🇲🇽', jerseyColor: '#006847', pantsColor: '#FFFFFF', socksColor: '#CE1126', difficulty: 'HARD', stars: 0, completed: false },
  { id: 'CA', name: 'Kanada', en_name: 'Canada', code: 'CA', flag: '🇨🇦', jerseyColor: '#FF0000', pantsColor: '#FFFFFF', socksColor: '#FF0000', difficulty: 'HARD', stars: 0, completed: false },
  { id: 'US', name: 'USA', en_name: 'USA', code: 'US', flag: '🇺🇸', jerseyColor: '#FFFFFF', pantsColor: '#002F6C', socksColor: '#FFFFFF', difficulty: 'HARD', stars: 0, completed: false },
  { id: 'PT', name: 'Portugal', en_name: 'Portugal', code: 'PT', flag: '🇵🇹', jerseyColor: '#E41C14', pantsColor: '#107C41', socksColor: '#FFFFFF', difficulty: 'HARD', stars: 0, completed: false },
  { id: 'BE', name: 'Belgia', en_name: 'Belgium', code: 'BE', flag: '🇧🇪', jerseyColor: '#E41C14', pantsColor: '#000000', socksColor: '#000000', difficulty: 'HARD', stars: 0, completed: false },
  { id: 'NL', name: 'Belanda', en_name: 'Netherlands', code: 'NL', flag: '🇳🇱', jerseyColor: '#FF4F00', pantsColor: '#FFFFFF', socksColor: '#FF4F00', difficulty: 'HARD', stars: 0, completed: false },
  { id: 'GB-ENG', name: 'Inggris', en_name: 'England', code: 'GB-ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', jerseyColor: '#FFFFFF', pantsColor: '#002F6C', socksColor: '#FFFFFF', difficulty: 'HARD', stars: 0, completed: false },
  { id: 'BR', name: 'Brasil', en_name: 'Brazil', code: 'BR', flag: '🇧🇷', jerseyColor: '#FCD116', pantsColor: '#00205B', socksColor: '#FFFFFF', difficulty: 'HARD', stars: 0, completed: false },
  { id: 'DE', name: 'Jerman', en_name: 'Germany', code: 'DE', flag: '🇩🇪', jerseyColor: '#FFFFFF', pantsColor: '#000000', socksColor: '#FFFFFF', difficulty: 'HARD', stars: 0, completed: false },
  { id: 'ES', name: 'Spanyol', en_name: 'Spain', code: 'ES', flag: '🇪🇸', jerseyColor: '#D32F2F', pantsColor: '#002F6C', socksColor: '#D32F2F', difficulty: 'HARD', stars: 0, completed: false },
  { id: 'FR', name: 'Prancis', en_name: 'France', code: 'FR', flag: '🇫🇷', jerseyColor: '#0F47AF', pantsColor: '#FFFFFF', socksColor: '#0F47AF', difficulty: 'HARD', stars: 0, completed: false },
  { id: 'AR', name: 'Argentina', en_name: 'Argentina', code: 'AR', flag: '🇦🇷', jerseyColor: '#75AADB', pantsColor: '#FFFFFF', socksColor: '#FFFFFF', jerseyPattern: 'stripes', difficulty: 'HARD', stars: 0, completed: false },
  // Extra HARD:
  { id: 'IT', name: 'Italia', en_name: 'Italy', code: 'IT', flag: '🇮🇹', jerseyColor: '#002F6C', pantsColor: '#FFFFFF', socksColor: '#002F6C', difficulty: 'HARD', stars: 0, completed: false },
];

export interface GameStore {
  user: UserProfile;
  authToken: string | null;
  countries: CountryTeam[];
  selectedUserTeam: CountryTeam | null;
  selectedAiTeam: CountryTeam | null;
  leaderboard: LeaderboardEntry[];
  chatMessages: ChatMessage[];
  isOffline: boolean;
  isSyncing: boolean;
  language: 'en' | 'id' | 'zh' | 'ar' | 'ko' | 'vi' | 'th' | 'hi' | 'de' | 'ru' | 'es' | 'fr' | 'pt' | 'af';
  
  // Backlog for offline moves/settings to auto-sync back
  syncBacklog: any[];

  matchHistory: MatchHistoryItem[];
  settings: GameSettings;

  // Actions
  initializeUser: (username?: string, isGuest?: boolean) => void;
  setLanguage: (lang: GameStore['language']) => void;
  selectTeams: (userTeam: CountryTeam, aiTeam: CountryTeam) => void;
  resetGameSelection: () => void;
  updateUserStats: (won: boolean, starsEarned: number, targetCountryId: string, userScore?: number, aiScore?: number, opponentTeam?: CountryTeam) => void;
  useBooster: (type: 'shoes' | 'gloves') => boolean;
  addFundsPurchase: (packageId: '2lives' | '5lives' | '12lives' | 'shoes1' | 'shoes3' | 'shoes5' | 'gloves1' | 'gloves3' | 'gloves5' | 'jersey1' | 'jersey3' | 'jersey5') => void;
  unlockJersey: (countryId: string) => boolean;
  setActiveJersey: (jerseyId: string) => void;
  setOfflineStatus: (offline: boolean) => void;
  addChatMessage: (msg: string) => void;
  fetchLeaderboard: () => Promise<void>;
  syncWithCloud: () => Promise<void>;
  customizeAvatar: (emoji: string, bg: string) => void;
  toggleSetting: (key: keyof GameSettings) => void;
  claimDailyReward: () => void;
}

export const useGameStore = create<GameStore>((set, get) => {
  // Try retrieving persisted data from localStorage
  const savedUser = localStorage.getItem('world_soccer_user');
  const savedCountries = localStorage.getItem('world_soccer_countries');
  const savedLang = localStorage.getItem('world_soccer_lang');
  const savedHistory = localStorage.getItem('world_soccer_history');
  const savedSettings = localStorage.getItem('world_soccer_settings');

  const defaultUser: UserProfile = {
    username: 'Guest_User',
    isGuest: true,
    lives: 1, // Guests get 1 play per 24 hours
    lastMatchTime: null,
    guestMatchesCount: 0,
    avatarEmoji: '⚽',
    avatarBg: 'bg-green-500',
    created_at: new Date().toISOString(),
    boosters: {
      shoes: 0,
      gloves: 0,
      jersey: 0
    },
    unlockedJerseys: [],
    activeJerseyId: 'pi'
  };

  return {
    user: savedUser ? JSON.parse(savedUser) : defaultUser,
    authToken: localStorage.getItem('world_soccer_token'),
    countries: savedCountries ? JSON.parse(savedCountries) : INITIAL_COUNTRIES,
    selectedUserTeam: null,
    selectedAiTeam: null,
    leaderboard: [],
    chatMessages: [],
    isOffline: !navigator.onLine,
    isSyncing: false,
    language: (savedLang as GameStore['language']) || 'en',
    syncBacklog: [],

    matchHistory: savedHistory ? JSON.parse(savedHistory) : [
      { id: 'h_1', won: true, stars: 3, opponentName: 'Germany', opponentFlag: '🇩🇪', userScore: 5, aiScore: 2, date: '2026-06-08' },
      { id: 'h_2', won: false, stars: 0, opponentName: 'Brazil', opponentFlag: '🇧🇷', userScore: 1, aiScore: 3, date: '2026-06-07' },
      { id: 'h_3', won: true, stars: 2, opponentName: 'Indonesia', opponentFlag: '🇮🇩', userScore: 3, aiScore: 1, date: '2026-06-06' }
    ],
    settings: savedSettings ? JSON.parse(savedSettings) : {
      audioGoals: true,
      audioWins: true,
    },

    initializeUser: (username, isGuest = true) => {
      let finalUser: UserProfile;
      if (isGuest) {
        finalUser = {
          ...defaultUser,
          username: username || 'Guest_User_' + Math.floor(Math.random() * 100000),
          isGuest: true,
          lives: 1,
        };
      } else {
        // Pi authenticated user
        finalUser = {
          username: username || 'Pi_Player',
          isGuest: false,
          lives: 99999, // Unlimited free play
          lastMatchTime: null,
          guestMatchesCount: 0,
          avatarEmoji: '🏆',
          avatarBg: 'bg-purple-600',
          created_at: new Date().toISOString(),
          boosters: {
            shoes: 0,
            gloves: 0,
            jersey: 1 // Start with 1 jersey booster for fun!
          },
          unlockedJerseys: [],
          activeJerseyId: 'pi'
        };
      }
      localStorage.setItem('world_soccer_user', JSON.stringify(finalUser));
      set({ user: finalUser });
      get().syncWithCloud();
    },

    setLanguage: (lang) => {
      localStorage.setItem('world_soccer_lang', lang);
      set({ language: lang });
    },

    selectTeams: (userTeam, aiTeam) => {
      set({ selectedUserTeam: userTeam, selectedAiTeam: aiTeam });
    },

    resetGameSelection: () => {
      set({ selectedUserTeam: null, selectedAiTeam: null });
    },

    updateUserStats: (won, starsEarned, targetCountryId, userScore, aiScore, opponentTeam) => {
      const { user, countries, isOffline, matchHistory } = get();

      // Deduct active heart/life if user is guest or if user lost
      let updatedLives = user.lives;
      let updatedLastMatchTime = user.lastMatchTime;
      let updatedGuestMatchesCount = user.guestMatchesCount;

      if (user.isGuest) {
        updatedLives = 0;
        updatedLastMatchTime = new Date().toISOString();
        updatedGuestMatchesCount += 1;
      } else {
        // Pi User has unlimited lives
        updatedLives = 99999;
      }

      const updatedUser: UserProfile = {
        ...user,
        lives: updatedLives,
        lastMatchTime: updatedLastMatchTime,
        guestMatchesCount: updatedGuestMatchesCount
      };

      // Check level upgrades (EZ, ME, DI, HA). If completed all 12 countries in any level, get bonus (+1 life)
      const targetCountry = countries.find(c => c.id === targetCountryId);
      let updatedCountries = countries.map(c => {
        if (c.id === targetCountryId) {
          const beatRating = Math.max(c.stars, starsEarned);
          return { ...c, stars: beatRating, completed: true };
        }
        return c;
      });

      // Bonus life trigger checking
      if (targetCountry && starsEarned > 0) {
        const levelGroup = updatedCountries.filter(c => c.difficulty === targetCountry.difficulty);
        const newlyCompletedAll = levelGroup.every(c => c.completed) && !countries.filter(c => c.difficulty === targetCountry.difficulty).every(c => c.completed);
        if (newlyCompletedAll) {
          updatedUser.lives += 1;
          alert(`Incredible! You completed all teams in ${targetCountry.difficulty} Level! Earned +1 Bonus Life ❤!`);
        }
      }

      // Append new History Item
      const oppName = opponentTeam?.en_name || targetCountry?.en_name || 'Opponent';
      const oppFlag = opponentTeam?.flag || targetCountry?.flag || '🏳️';
      const scoreU = typeof userScore === 'number' ? userScore : (won ? 3 : 1);
      const scoreA = typeof aiScore === 'number' ? aiScore : (won ? 1 : 3);

      const usrTeam = get().selectedUserTeam;
      const newHistoryItem: MatchHistoryItem = {
        id: 'h_' + Date.now() + '_' + Math.random(),
        won,
        stars: starsEarned,
        opponentName: oppName,
        opponentFlag: oppFlag,
        userScore: scoreU,
        aiScore: scoreA,
        date: new Date().toISOString().split('T')[0],
        userTeamName: usrTeam?.name || 'Indonesia',
        userTeamFlag: usrTeam?.flag || '🇮🇩',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };

      const updatedHistory = [newHistoryItem, ...matchHistory].slice(0, 15);
      localStorage.setItem('world_soccer_history', JSON.stringify(updatedHistory));

      localStorage.setItem('world_soccer_user', JSON.stringify(updatedUser));
      localStorage.setItem('world_soccer_countries', JSON.stringify(updatedCountries));
      set({ user: updatedUser, countries: updatedCountries, matchHistory: updatedHistory });

      if (isOffline) {
        // Save move to backlog for cloud syncing when connect is back
        set((state) => ({
          syncBacklog: [...state.syncBacklog, { type: 'MATCH_COMPLETED', won, stars: starsEarned, countryId: targetCountryId }]
        }));
      } else {
        // Send stats to backend
        fetch('/api/user/match', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('world_soccer_token') ? { 'Authorization': `Bearer ${localStorage.getItem('world_soccer_token')}` } : {})
          },
          body: JSON.stringify({ won, stars: starsEarned, countryId: targetCountryId, lives: updatedLives })
        }).catch(err => console.error('Cloud match sync error', err));
      }
    },

    useBooster: (type) => {
      const { user } = get();
      if (user.boosters[type] <= 0) return false;

      const updatedUser: UserProfile = {
        ...user,
        boosters: {
          ...user.boosters,
          [type]: user.boosters[type] - 1
        }
      };
      localStorage.setItem('world_soccer_user', JSON.stringify(updatedUser));
      set({ user: updatedUser });

      // Sync backend
      fetch('/api/user/use-booster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('world_soccer_token') ? { 'Authorization': `Bearer ${localStorage.getItem('world_soccer_token')}` } : {})
        },
        body: JSON.stringify({ type })
      }).catch(err => console.error('Booster usage sync failed', err));

      return true;
    },

    addFundsPurchase: (packageId) => {
      // Offline/Online fallback handler for purchases
      const { user } = get();
      let updatedUser = { ...user };

      if (packageId === '2lives') {
        updatedUser.lives += 2;
      } else if (packageId === '5lives') {
        updatedUser.lives += 5;
      } else if (packageId === '12lives') {
        updatedUser.lives += 12;
      } else if (packageId === 'shoes1') {
        updatedUser.boosters.shoes += 1;
      } else if (packageId === 'shoes3') {
        updatedUser.boosters.shoes += 3;
      } else if (packageId === 'shoes5') {
        updatedUser.boosters.shoes += 5;
      } else if (packageId === 'gloves1') {
        updatedUser.boosters.gloves += 1;
      } else if (packageId === 'gloves3') {
        updatedUser.boosters.gloves += 3;
      } else if (packageId === 'gloves5') {
        updatedUser.boosters.gloves += 5;
      } else if (packageId === 'jersey1') {
        updatedUser.boosters.jersey = (updatedUser.boosters.jersey || 0) + 1;
      } else if (packageId === 'jersey3') {
        updatedUser.boosters.jersey = (updatedUser.boosters.jersey || 0) + 3;
      } else if (packageId === 'jersey5') {
        updatedUser.boosters.jersey = (updatedUser.boosters.jersey || 0) + 5;
      }

      localStorage.setItem('world_soccer_user', JSON.stringify(updatedUser));
      set({ user: updatedUser });

      fetch('/api/store/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('world_soccer_token') ? { 'Authorization': `Bearer ${localStorage.getItem('world_soccer_token')}` } : {})
        },
        body: JSON.stringify({ packageId })
      }).catch(err => console.error('Token processing sync error', err));
    },

    unlockJersey: (countryId) => {
      const { user } = get();
      if (user.isGuest) {
        return false;
      }
      if ((user.boosters.jersey || 0) <= 0) {
        return false;
      }
      const unlocked = user.unlockedJerseys || [];
      if (unlocked.includes(countryId)) {
        return false;
      }
      const updatedUser: UserProfile = {
        ...user,
        boosters: {
          ...user.boosters,
          jersey: (user.boosters.jersey || 0) - 1
        },
        unlockedJerseys: [...unlocked, countryId],
        activeJerseyId: countryId
      };
      localStorage.setItem('world_soccer_user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
      return true;
    },

    setActiveJersey: (jerseyId) => {
      const { user } = get();
      if (user.isGuest) {
        return;
      }
      const updatedUser: UserProfile = {
        ...user,
        activeJerseyId: jerseyId
      };
      localStorage.setItem('world_soccer_user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    },

    setOfflineStatus: (offline) => {
      set({ isOffline: offline });
      if (!offline) {
        // Trigger automated cloud sync when internet comes back online
        get().syncWithCloud();
      }
    },

    addChatMessage: (msg) => {
      const { user } = get();
      const newMessage: ChatMessage = {
        id: 'msg_' + Date.now() + '_' + Math.random(),
        username: user.username,
        avatarEmoji: user.avatarEmoji,
        message: msg,
        timestamp: new Date().toISOString()
      };
      set((state) => ({ chatMessages: [newMessage, ...state.chatMessages].slice(0, 100) }));
    },

    fetchLeaderboard: async () => {
      try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        if (data && Array.isArray(data)) {
          set({ leaderboard: data });
        }
      } catch (err) {
        console.warn('Fallback local leaderboard due to connection issue', err);
        // Build random competitor entries
        const fallbackList: LeaderboardEntry[] = [
          { username: 'Löw_Kicker', totalStars: 108, matchesWon: 36, matchesPlayed: 40, countryCode: 'DE', avatarEmoji: '⚽', updatedAt: '2026-06-08' },
          { username: 'Te_eR_Admin', totalStars: 95, matchesWon: 32, matchesPlayed: 35, countryCode: 'ID', avatarEmoji: '👑', updatedAt: '2026-06-08' },
          { username: 'Neymar_Jr_Pi', totalStars: 82, matchesWon: 28, matchesPlayed: 33, countryCode: 'BR', avatarEmoji: '🕺', updatedAt: '2026-06-08' },
          { username: 'Messi_World', totalStars: 78, matchesWon: 26, matchesPlayed: 28, countryCode: 'AR', avatarEmoji: '🐐', updatedAt: '2026-06-08' },
          { username: 'Ronaldo_CR7', totalStars: 71, matchesWon: 24, matchesPlayed: 30, countryCode: 'PT', avatarEmoji: '💪', updatedAt: '2026-06-08' }
        ];
        set({ leaderboard: fallbackList });
      }
    },

    syncWithCloud: async () => {
      const { syncBacklog, isOffline } = get();
      if (isOffline || syncBacklog.length === 0) return;

      set({ isSyncing: true });
      try {
        // Post entire sync structural backlog to server
        const res = await fetch('/api/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('world_soccer_token') ? { 'Authorization': `Bearer ${localStorage.getItem('world_soccer_token')}` } : {})
          },
          body: JSON.stringify({ backlog: syncBacklog })
        });
        if (res.ok) {
          set({ syncBacklog: [] });
          console.log('Automated sync cloud complete!');
        }
      } catch (e) {
        console.error('Offline cloud sync trigger failed, will retry later.', e);
      } finally {
        set({ isSyncing: false });
      }
    },

    customizeAvatar: (emoji, bg) => {
      const { user } = get();
      const updatedUser: UserProfile = { ...user, avatarEmoji: emoji, avatarBg: bg };
      localStorage.setItem('world_soccer_user', JSON.stringify(updatedUser));
      set({ user: updatedUser });

      fetch('/api/user/customize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('world_soccer_token') ? { 'Authorization': `Bearer ${localStorage.getItem('world_soccer_token')}` } : {})
        },
        body: JSON.stringify({ emoji, bg })
      }).catch(err => console.error('Cloud customize sync error', err));
    },

    toggleSetting: (key) => {
      const { settings } = get();
      const updatedSettings = {
        ...settings,
        [key]: !settings[key]
      };
      localStorage.setItem('world_soccer_settings', JSON.stringify(updatedSettings));
      set({ settings: updatedSettings });
    },

    claimDailyReward: () => {
      const { user } = get();
      const updatedUser = {
        ...user,
        lives: user.isGuest ? 1 : user.lives + 1,
        lastMatchTime: null, // resets cooldown so guest can play immediately!
        boosters: {
          ...user.boosters,
          shoes: (user.boosters.shoes || 0) + 1,
          gloves: (user.boosters.gloves || 0) + 1
        }
      };
      localStorage.setItem('world_soccer_user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    }
  };
});
export default useGameStore;
