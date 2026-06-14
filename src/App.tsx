import { useEffect, useState } from 'react';
import { useGameStore } from './store';
import { translate } from './utils/translate';
import { CountrySelection } from './components/CountrySelection';
import { PenaltyGame } from './components/PenaltyGame';
import { PiPayModule } from './components/PiPayModule';
import { Leaderboard } from './components/Leaderboard';
import { ChatRoom } from './components/ChatRoom';
import { OfflineSyncManager } from './components/OfflineSyncManager';
import { ChallengeTimer } from './components/ChallengeTimer';
import { HistoryTab } from './components/HistoryTab';
import { SettingsTab } from './components/SettingsTab';
import { CountryTeam } from './types';
import { Trophy, ShoppingBag, Flame, Sparkles, LogIn, Heart, Clock, Settings } from 'lucide-react';

export default function App() {
  const {
    user,
    initializeUser,
    selectedUserTeam,
    selectedAiTeam,
    selectTeams,
    resetGameSelection,
    language,
    setLanguage,
    claimDailyReward
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<'play' | 'store' | 'leaderboard' | 'settings' | 'history'>('play');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showDailyPopup, setShowDailyPopup] = useState(false);

  // Auth gate sequence: 'welcome' | 'signin' | 'lobby'
  const [authStep, setAuthStep] = useState<'welcome' | 'signin' | 'lobby'>(() => {
    const saved = localStorage.getItem('world_soccer_user');
    if (saved) {
      const u = JSON.parse(saved);
      if (!u.isGuest) return 'lobby'; // Active Pi Users bypass welcome
    }
    return 'welcome';
  });

  // Calculate 24-hour Guest cooldown status
  const checkGuestCooldown = () => {
    const saved = localStorage.getItem('world_soccer_user');
    if (!saved) return { allowed: true };
    try {
      const u = JSON.parse(saved);
      if (!u.isGuest) return { allowed: true };
      if (!u.lastMatchTime) return { allowed: true };

      const last = new Date(u.lastMatchTime).getTime();
      const now = Date.now();
      const elapsed = now - last;
      const cooldown = 24 * 60 * 60 * 1000; // 24 hours
      if (elapsed < cooldown) {
        const remaining = cooldown - elapsed;
        const hours = Math.floor(remaining / (60 * 60 * 1000));
        const mins = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
        return { allowed: false, text: `${hours}h ${mins}m` };
      }
    } catch (e) {
      console.error('Failed to parse guest user cooldown', e);
    }
    return { allowed: true };
  };

  // Trigger Pi Authentication automatically on load
  useEffect(() => {
    autoPiAuth();
  }, []);

  // Check and trigger daily login reward popup
  useEffect(() => {
    if (authStep === 'lobby') {
      const lastDaily = localStorage.getItem('world_soccer_last_daily_login');
      const now = Date.now();
      const oneDay = 24 * 60 * 65 * 1000; // 24 hours (with slight margin cushion)
      if (!lastDaily || (now - parseInt(lastDaily, 10)) >= oneDay) {
        setShowDailyPopup(true);
      }
    }
  }, [authStep]);

  const autoPiAuth = async () => {
    setIsAuthenticating(true);
    try {
      if (typeof window !== 'undefined' && (window as any).Pi) {
        const Pi = (window as any).Pi;
        
        // Await Pi.init fully as a Promise before calling authenticate
        await Pi.init({ version: "2.0", sandbox: true });
        
        // Use username scope
        const auth = await Pi.authenticate(["username"], (onAndroidCallBack: any) => {
          console.log('Android Native Callback registered', onAndroidCallBack);
        });

        if (auth && auth.user) {
          // Token and validation sent to full-stack backend
          const res = await fetch('/api/auth/pi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessToken: auth.accessToken, username: auth.user.username })
          });
          const data = await res.json();
          if (data && data.success) {
            localStorage.setItem('world_soccer_token', data.token);
            initializeUser(auth.user.username, false);
            setAuthStep('lobby');
          }
        }
      }
    } catch (e) {
      console.warn('Pi SDK integration bypassed.', e);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const manualSignIn = async () => {
    setIsAuthenticating(true);
    try {
      if (typeof window !== 'undefined' && (window as any).Pi) {
        await autoPiAuth();
      } else {
        // Simulate Pi login sandbox for browser developers!
        setTimeout(() => {
          initializeUser('Pi_Player_' + Math.floor(Math.random() * 9999), false);
          setAuthStep('lobby');
          setIsAuthenticating(false);
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setIsAuthenticating(false);
    }
  };

  const handleSelectedGame = (userTeam: CountryTeam, aiTeam: CountryTeam) => {
    if (user.isGuest) {
      const cd = checkGuestCooldown();
      if (!cd.allowed) {
        alert(`Guest Cooldown Active! Please wait ${cd.text} before your next match, or Sign In with Pi Network for Unlimited Play!`);
        return;
      }
    } else {
      // Pi User - unlimited games, lives reset automatically or buy in store on depletion
      if (user.lives <= 0) {
        alert("You have run out of lives ❤️! Purchase more in the PI STORE to play instantly.");
        setActiveTab('store');
        return;
      }
    }

    selectTeams(userTeam, aiTeam);
    setIsPlaying(true);
  };

  const handleCloseGame = () => {
    setIsPlaying(false);
    resetGameSelection();
  };

  const handleClaimReward = () => {
    claimDailyReward();
    localStorage.setItem('world_soccer_last_daily_login', Date.now().toString());
    setShowDailyPopup(false);
  };

  // UI Language Switcher Dropdown
  const langFlags: Record<string, string> = {
    en: '🇺🇸', id: '🇮🇩', zh: '🇨🇳', ar: '🇸🇦', ko: '🇰🇷', vi: '🇻🇳',
    th: '🇹🇭', hi: '🇮🇳', de: '🇩🇪', ru: '🇷🇺', es: '🇪🇸', fr: '🇫🇷',
    pt: '🇵🇹', af: '🇿🇦'
  };

  // 1. Welcome Screen View
  if (authStep === 'welcome') {
    return (
      <div 
        className="min-h-screen w-full flex flex-col justify-end items-center relative p-6 text-center bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.2), rgba(2, 6, 23, 0.95)), url('https://raw.githubusercontent.com/B168OSS/Soccer/9f9ab13fd48ca62082c01b723fb21e6323fc9d20/med/WSoccer_page_01.jpg')`
        }}
      >
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
        <div className="w-full max-w-sm flex flex-col items-center gap-6 mb-12 z-10 animate-scale-up">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 drop-shadow-md">
              WORLD SOCCER™
            </h1>
            <p className="text-[10px] text-slate-300 uppercase tracking-widest font-black">
              Casual 2D Penalty Shootout
            </p>
          </div>

          <div className="w-full bg-slate-900/60 backdrop-blur border border-slate-700/30 rounded-xl p-4 flex items-center justify-center gap-4">
            <img 
              src="https://raw.githubusercontent.com/B168OSS/Soccer/975cde043bfdeffb341dd9b6cc2e7472fe74a7e9/med/Home-play.png" 
              alt="Player Mock" 
              className="h-28 object-contain drop-shadow-2xl animate-pulse"
              referrerPolicy="no-referrer"
            />
            <div className="text-left flex-grow">
              <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400">FEATURING</span>
              <p className="text-sm font-bold text-white mt-0.5">Pi Network Default Kit</p>
              <p className="text-[10px] text-slate-400">Faceless aesthetic designs</p>
            </div>
          </div>

          <button
            onClick={() => setAuthStep('signin')}
            className="w-full py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-yellow-950/45 transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            PLAY GAME
          </button>
        </div>
      </div>
    );
  }

  // 2. Sign In Screen View
  if (authStep === 'signin') {
    const cd = checkGuestCooldown();
    return (
      <div 
        className="min-h-screen w-full flex flex-col justify-between items-center relative p-6 bg-cover bg-center overflow-x-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(2, 6, 23, 0.98)), url('https://raw.githubusercontent.com/B168OSS/Soccer/9f9ab13fd48ca62082c01b723fb21e6323fc9d20/med/WSoccer_Sign.png')`
        }}
      >
        <div className="w-full max-w-sm flex flex-col items-center gap-4 mt-8 z-10 animate-scale-up">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1 rounded">
              <Flame className="w-4 h-4 fill-white" />
            </div>
            <span className="text-sm font-black tracking-widest text-white">WORLD SOCCER</span>
          </div>
          <h2 className="text-2xl font-black uppercase text-center text-white mt-2">
            Player Authentication
          </h2>
          <p className="text-[10px] text-slate-400 text-center tracking-wide uppercase font-extrabold">
            Choose your signature credentials gate
          </p>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-4 my-auto z-10">
          {/* Pi Network login button */}
          <button
            onClick={manualSignIn}
            disabled={isAuthenticating}
            className="w-full bg-gradient-to-r from-indigo-950 to-purple-950 border-2 border-indigo-500/50 rounded-xl p-5 text-left transition-all hover:border-indigo-400 group cursor-pointer flex flex-col gap-2 shadow-lg shadow-indigo-950/50"
          >
            <div className="flex justify-between items-center w-full">
              <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">RECOMMENDED PIN APP</span>
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-extrabold px-2.5 py-0.5 rounded uppercase">Unlimited</span>
            </div>
            <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
              {isAuthenticating ? 'AUTHENTICATING...' : 'SIGN IN WITH PI ACCOUNT'}
            </h3>
            <p className="text-[10px] text-slate-350 leading-relaxed font-bold">
              • Access to all 55 World Cup teams & stadiums<br />
              • Permanent records, global leaderboards & chat rooms<br />
              • Unlock boots, jerseys & gloves boosters
            </p>
          </button>

          {/* Guest login button */}
          <button
            onClick={() => {
              if (!cd.allowed) {
                alert(`Cooldown active! Please wait ${cd.text} before next Guest match, or log in with Pi!`);
                return;
              }
              initializeUser('Guest_User_' + Math.floor(Math.random() * 9999), true);
              setAuthStep('lobby');
            }}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-5 text-left transition-colors hover:border-slate-700 cursor-pointer flex flex-col gap-2 relative overflow-hidden"
          >
            <div className="flex justify-between items-center w-full">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">LOCAL SANDBOX</span>
              {!cd.allowed ? (
                <span className="text-[9px] bg-red-950 text-red-300 font-extrabold px-2 py-0.5 rounded uppercase border border-red-900/60 font-mono">
                  LOCK: {cd.text}
                </span>
              ) : (
                <span className="text-[9px] bg-slate-950 text-amber-500 font-black px-2 py-0.5 rounded uppercase border border-slate-800">
                  1 Play / 24 Hours
                </span>
              )}
            </div>
            <h3 className="text-base font-black text-slate-200">
              PLAY AS GUEST
            </h3>
            <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
              • Limited to exactly 1 match per 24 hours<br />
              • Forces default Pi Network purple jersey<br />
              • Booster stores and team customizers are locked
            </p>
          </button>
        </div>

        <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest pb-4 z-10 text-center">
          GAMES BY TE_ER™ • POWERED BY PI NETWORK
        </div>
      </div>
    );
  }

  // 3. Regular Lobby View
  return (
    <div 
      className="min-h-screen text-slate-100 flex flex-col justify-between items-center relative overflow-hidden font-sans select-none pb-20 bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.94)), url('https://raw.githubusercontent.com/B168OSS/Soccer/975cde043bfdeffb341dd9b6cc2e7472fe74a7e9/med/PlayBack.png')`
      }}
    >
      {/* Stadium lights layout overlay */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
      
      {/* Upper Navigation Bar */}
      <header className="w-full max-w-lg px-4 py-4 flex justify-between items-center bg-slate-900 border-b border-slate-805 z-25 font-sans">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded text-white animate-pulse">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <span className="text-lg font-black uppercase tracking-wider text-white">
            {translate('appName', language)}
          </span>
        </div>

        {/* Language Selection */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as any)}
          className="bg-slate-950 border border-slate-800 text-xs text-white rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer font-bold font-sans uppercase"
        >
          {Object.entries(langFlags).map(([code, flag]) => (
            <option key={code} value={code}>
              {flag} {code.toUpperCase()}
            </option>
          ))}
        </select>
      </header>

      {/* Main Container Core Views */}
      <main className="flex-grow w-full max-w-lg px-4 py-4 flex flex-col items-center justify-start gap-4 z-10 overflow-x-hidden">
        
        {/* User Identity HUD Card */}
        <div className="w-full bg-slate-900/90 border border-slate-800 rounded-lg p-4 flex justify-between items-center shadow relative overflow-hidden font-sans">
          <div className="absolute -right-3 -top-3 text-indigo-500/10 rotate-12">
            <Sparkles size={50} />
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded ${user.avatarBg || 'bg-slate-800'} flex items-center justify-center text-2xl border border-white/20 shadow`}>
              {user.avatarEmoji || '⚽'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-white leading-tight uppercase tracking-wider">{user.username}</span>
                {user.isGuest ? (
                  <span className="text-[9px] bg-slate-950 text-indigo-300 uppercase px-1.5 py-0.5 rounded font-black border border-indigo-900/55 leading-none">Guest</span>
                ) : (
                  <span className="text-[9px] bg-indigo-650 text-white uppercase px-1.5 py-0.5 rounded font-black border border-indigo-550 leading-none">Pi User</span>
                )}
              </div>
              <p className="text-[9px] text-slate-500 mt-1 uppercase font-bold tracking-wider">Lobby connected session verified</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user.isGuest ? (
              <button
                onClick={manualSignIn}
                disabled={isAuthenticating}
                className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-black uppercase tracking-wider transition-all shadow shadow-indigo-600/10 flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn size={11} />
                <span>{isAuthenticating ? '...' : translate('signIn', language)}</span>
              </button>
            ) : (
              <div className="bg-black p-2 rounded border border-slate-800 flex items-center gap-1.5 text-red-500 leading-none font-sans">
                <Heart size={14} className="fill-red-500 animate-pulse" />
                <span className="text-xs font-mono font-black">UNLIMITED</span>
              </div>
            )}
          </div>
        </div>

        {/* Challenge Monitor widget */}
        <ChallengeTimer />

        {/* Interactive Tab views selector */}
        {isPlaying && selectedUserTeam && selectedAiTeam ? (
          <PenaltyGame onClose={handleCloseGame} />
        ) : (
          <div className="w-full flex flex-col gap-4">
            {activeTab === 'play' && (
              <CountrySelection onSelected={handleSelectedGame} />
            )}
            {activeTab === 'store' && <PiPayModule />}
            {activeTab === 'leaderboard' && <Leaderboard />}
            {activeTab === 'settings' && <SettingsTab />}
            {activeTab === 'history' && <HistoryTab />}
          </div>
        )}
      </main>

      {/* Persistent Global bottom tabs navigator */}
      {!isPlaying && (
        <nav className="fixed bottom-0 inset-x-0 bg-slate-900/98 border-t border-slate-800 p-2 flex justify-around items-center z-40 backdrop-blur max-w-lg mx-auto rounded-t-lg shadow-inner">
          <button
            onClick={() => setActiveTab('play')}
            className={`flex flex-col items-center gap-1.5 py-1.5 px-2 rounded transition-all cursor-pointer ${activeTab === 'play' ? 'text-indigo-400 bg-indigo-500/5 font-black' : 'text-slate-500 hover:text-slate-200 font-sans'}`}
          >
            <Flame size={18} className={activeTab === 'play' ? 'text-indigo-400 animate-pulse' : ''} />
            <span className="text-[9px] uppercase font-black tracking-widest">{translate('playBtn', language)}</span>
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={`flex flex-col items-center gap-1.5 py-1.5 px-2 rounded transition-all cursor-pointer ${activeTab === 'store' ? 'text-indigo-400 bg-indigo-500/5 font-black' : 'text-slate-500 hover:text-slate-200 font-sans'}`}
          >
            <ShoppingBag size={18} className={activeTab === 'store' ? 'text-indigo-400 animate-pulse' : ''} />
            <span className="text-[9px] uppercase font-black tracking-widest">STORE</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex flex-col items-center gap-1.5 py-1.5 px-2 rounded transition-all cursor-pointer ${activeTab === 'leaderboard' ? 'text-indigo-400 bg-indigo-500/5 font-black' : 'text-slate-500 hover:text-slate-200 font-sans'}`}
          >
            <Trophy size={18} className={activeTab === 'leaderboard' ? 'text-indigo-400 animate-pulse' : ''} />
            <span className="text-[9px] uppercase font-black tracking-widest font-sans">LEADER</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-1.5 py-1.5 px-2 rounded transition-all cursor-pointer ${activeTab === 'history' ? 'text-indigo-400 bg-indigo-500/5 font-black' : 'text-slate-500 hover:text-slate-200 font-sans'}`}
          >
            <Clock size={18} className={activeTab === 'history' ? 'text-indigo-400 animate-pulse' : ''} />
            <span className="text-[9px] uppercase font-black tracking-widest font-sans">HISTORY</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1.5 py-1.5 px-2 rounded transition-all cursor-pointer ${activeTab === 'settings' ? 'text-indigo-400 bg-indigo-500/5 font-black' : 'text-slate-500 hover:text-slate-200 font-sans'}`}
            id="tab-btn-settings"
          >
            <Settings size={18} className={activeTab === 'settings' ? 'text-indigo-400 animate-pulse' : ''} />
            <span className="text-[9px] uppercase font-black tracking-widest text-center">SETTINGS</span>
          </button>
        </nav>
      )}

      {/* Daily Reward Modal Popup Overlay */}
      {showDailyPopup && (
        <div className="fixed inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in font-sans">
          <div className="w-full max-w-sm bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 border-2 border-indigo-550 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col items-center gap-5 text-center animate-scale-up">
            
            {/* Ambient Background Glow sparkles */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-600/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />

            <div className="bg-gradient-to-r from-amber-500 to-yellow-400 p-3 rounded-full text-slate-910 animate-bounce shadow-lg shadow-amber-500/20">
              <Sparkles size={36} className="text-slate-950 fill-amber-500" />
            </div>

            <div>
              <h2 className="text-xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300">
                DAILY BONUS CLAIMABLE!
              </h2>
              <p className="text-[11px] text-slate-400 uppercase tracking-widest font-black mt-1">
                Welcome back, Champion!
              </p>
            </div>

            <div className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
              <p className="text-xs text-indigo-300 font-extrabold uppercase tracking-wide">
                YOUR EXCLUSIVE 24H REWARD:
              </p>
              
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-900 border border-slate-850 p-2 rounded flex flex-col items-center gap-1">
                  <span className="text-xl">❤️</span>
                  <span className="font-extrabold text-white">1 Lives</span>
                  <span className="text-[8px] text-slate-500 uppercase">Booster</span>
                </div>
                <div className="bg-slate-900 border border-slate-850 p-2 rounded flex flex-col items-center gap-1">
                  <span className="text-xl">⚡</span>
                  <span className="font-extrabold text-white">+1 Boots</span>
                  <span className="text-[8px] text-slate-500 uppercase">Accuracy</span>
                </div>
                <div className="bg-slate-900 border border-slate-850 p-2 rounded flex flex-col items-center gap-1">
                  <span className="text-xl">🛡️</span>
                  <span className="font-extrabold text-white">+1 Glove</span>
                  <span className="text-[8px] text-slate-500 uppercase">Save Power</span>
                </div>
              </div>
            </div>

            <p className="text-[9px] text-slate-500 italic uppercase">
              *Cooldown Resets every 24 Hours
            </p>

            <button
              onClick={handleClaimReward}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-98 cursor-pointer"
            >
              CLAIM FREE REWARDS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
