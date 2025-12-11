import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================================
// ICONS
// ============================================================================
const Icons = {
  Phone: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Quote: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  Target: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Calendar: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Dollar: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Star: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  ChevronLeft: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>,
  ChevronRight: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Logout: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Close: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
};

// ============================================================================
// DONUT CHART
// ============================================================================
const DonutChart = ({ value, max, label, size = 80 }) => {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const color = percentage >= 100 ? '#10B981' : '#3B82F6';

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#E5E7EB" strokeWidth={strokeWidth} />
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-gray-900">{typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value}{max === 100 && '%'}</span>
        </div>
      </div>
      <p className="text-xs font-medium text-gray-500 mt-2 text-center">{label}</p>
    </div>
  );
};

// ============================================================================
// FUNNEL CARD
// ============================================================================
const FunnelCard = ({ icon: Icon, label, value, goal, onIncrement, onDecrement, isLast }) => {
  const hitGoal = goal > 0 && value >= goal;
  const progress = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;

  return (
    <div className="relative">
      <div className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${hitGoal ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${hitGoal ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-500'}`}>
              <Icon />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold tabular-nums ${hitGoal ? 'text-emerald-600' : 'text-gray-900'}`}>{value}</span>
                {goal > 0 && <span className="text-sm text-gray-400">/ {goal}</span>}
                {hitGoal && <span className="text-emerald-500"><Icons.Check /></span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onDecrement} className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xl transition-all active:scale-95 flex items-center justify-center">−</button>
            <button onClick={onIncrement} className="w-11 h-11 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xl transition-all active:scale-95 shadow-lg shadow-blue-500/25 flex items-center justify-center">+</button>
          </div>
        </div>
        {goal > 0 && (
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: hitGoal ? '#10B981' : '#3B82F6' }} />
          </div>
        )}
      </div>
      {!isLast && <div className="flex justify-center my-1"><div className="w-0.5 h-3 bg-gray-200 rounded-full" /></div>}
    </div>
  );
};

// ============================================================================
// AUTH SCREEN
// ============================================================================
const AuthScreen = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isOwnerSignup, setIsOwnerSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    onAuth(data.user);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) { setError(authError.message); setLoading(false); return; }

    if (isOwnerSignup) {
      const agencyId = crypto.randomUUID();
      const invCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id, email, name, role: 'owner', agency_id: agencyId, agency_name: agencyName, invite_code: invCode, show_on_leaderboard: false,
      });
      if (profileError) { setError(profileError.message); setLoading(false); return; }
    } else {
      const { data: ownerData, error: ownerError } = await supabase.from('profiles').select('agency_id, agency_name, show_on_leaderboard').eq('invite_code', inviteCode.toUpperCase()).single();
      if (ownerError || !ownerData) { setError('Invalid invite code'); setLoading(false); return; }
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id, email, name, role: 'producer', agency_id: ownerData.agency_id, agency_name: ownerData.agency_name, show_on_leaderboard: ownerData.show_on_leaderboard,
      });
      if (profileError) { setError(profileError.message); setLoading(false); return; }
    }
    onAuth(authData.user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 mb-4">
            <span className="text-white text-2xl">📊</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Tracker</h1>
          <p className="text-gray-500 mt-1">Track your daily production</p>
        </div>
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8">
          {isLogin ? (
            <form onSubmit={handleLogin}>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Welcome back</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all" placeholder="you@example.com" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all" placeholder="••••••••" required />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm mt-4 p-3 bg-red-50 rounded-lg">{error}</p>}
              <button type="submit" disabled={loading} className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              <p className="text-center text-sm text-gray-500 mt-6">
                Don't have an account? <button type="button" onClick={() => setIsLogin(false)} className="font-semibold text-blue-600 hover:underline">Sign Up</button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Create Account</h2>
              <div className="flex gap-2 mb-6 p-1.5 bg-gray-100 rounded-xl">
                <button type="button" onClick={() => setIsOwnerSignup(true)} className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${isOwnerSignup ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>Agency Owner</button>
                <button type="button" onClick={() => setIsOwnerSignup(false)} className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${!isOwnerSignup ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>Producer</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all" placeholder="John Smith" required />
                </div>
                {isOwnerSignup ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Agency Name</label>
                    <input type="text" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all" placeholder="Smith Insurance Group" required />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Invite Code</label>
                    <input type="text" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all uppercase tracking-widest text-center font-mono" placeholder="ABC123" required />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all" placeholder="you@example.com" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all" placeholder="••••••••" minLength={6} required />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm mt-4 p-3 bg-red-50 rounded-lg">{error}</p>}
              <button type="submit" disabled={loading} className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all disabled:opacity-50">
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
              <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account? <button type="button" onClick={() => setIsLogin(true)} className="font-semibold text-blue-600 hover:underline">Sign In</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN TRACKER
// ============================================================================
const SalesTracker = ({ user, profile, onLogout, onProfileUpdate }) => {
  const [mainView, setMainView] = useState('my-numbers');
  const [activeView, setActiveView] = useState('daily');
  const [teamPeriod, setTeamPeriod] = useState('today');
  const [leaderboardPeriod, setLeaderboardPeriod] = useState('month');
  const [leaderboardType, setLeaderboardType] = useState('producers');
  const [currentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [dailyData, setDailyData] = useState({});
  const [teamData, setTeamData] = useState([]);
  const [teamWeeklyData, setTeamWeeklyData] = useState([]);
  const [teamMonthlyData, setTeamMonthlyData] = useState([]);
  const [teamYearlyData, setTeamYearlyData] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [expandedProducer, setExpandedProducer] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [agencyLeaderboardData, setAgencyLeaderboardData] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [streak, setStreak] = useState(0);

  const today = new Date().getDate();
  const isOwner = profile?.role === 'owner';

  const getLocalDateString = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const formatLeaderboardName = (fullName) => { if (!fullName) return 'Unknown'; const parts = fullName.trim().split(' '); return parts.length === 1 ? parts[0] : `${parts[0]} ${parts[parts.length - 1][0]}.`; };
  const getEmptyDay = () => ({ calls: 0, households_quoted: 0, households_closed: 0, pivots: 0, appointments: 0, referrals: 0, policies_auto: 0, policies_home: 0, policies_life: 0, policies_health: 0 });
  const getTotalPolicies = (data) => (data?.policies_auto || 0) + (data?.policies_home || 0) + (data?.policies_life || 0) + (data?.policies_health || 0);
  const getLifeHealthPolicies = (data) => (data?.policies_life || 0) + (data?.policies_health || 0);

  useEffect(() => { loadUserData(); }, []);
  useEffect(() => { if (isOwner && mainView === 'team') loadTeamData(teamPeriod); }, [mainView, teamPeriod]);
  useEffect(() => { if (mainView === 'leaderboard') loadLeaderboardData(leaderboardPeriod, leaderboardType); }, [mainView, leaderboardPeriod, leaderboardType]);

  const loadUserData = async () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startOfMonth = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const endOfMonth = `${year}-${String(month + 1).padStart(2, '0')}-${lastDay}`;
    const { data } = await supabase.from('daily_activity').select('*').eq('user_id', user.id).gte('date', startOfMonth).lte('date', endOfMonth);
    if (data) {
      const dataByDay = {};
      data.forEach((entry) => { dataByDay[parseInt(entry.date.split('-')[2])] = entry; });
      setDailyData(dataByDay);
      let s = 0; for (let d = today; d >= 1; d--) { if (dataByDay[d] && getTotalPolicies(dataByDay[d]) > 0) s++; else if (d < today) break; }
      setStreak(s);
    }
  };

  const loadTeamData = async (period) => {
    setLoadingTeam(true);
    const { data: members } = await supabase.from('profiles').select('*').eq('agency_id', profile.agency_id);
    if (!members) { setLoadingTeam(false); return; }
    setTeamMembers(members);
    const memberIds = members.map((m) => m.id);
    const now = new Date();
    let startDate, endDate;
    if (period === 'today') { startDate = getLocalDateString(now); endDate = startDate; }
    else if (period === 'week') { const d = now.getDay(); const mon = new Date(now); mon.setDate(now.getDate() - (d === 0 ? 6 : d - 1)); startDate = getLocalDateString(mon); endDate = getLocalDateString(now); }
    else if (period === 'month') { startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`; endDate = getLocalDateString(now); }
    else if (period === 'year') { startDate = `${now.getFullYear()}-01-01`; endDate = getLocalDateString(now); }
    const { data: activityData } = await supabase.from('daily_activity').select('*').gte('date', startDate).lte('date', endDate).in('user_id', memberIds);
    const aggregated = memberIds.map((userId) => {
      const acts = activityData?.filter((a) => a.user_id === userId) || [];
      return acts.reduce((acc, day) => {
        acc.user_id = userId; acc.calls += day.calls || 0; acc.households_quoted += day.households_quoted || 0; acc.households_closed += day.households_closed || 0;
        acc.pivots += day.pivots || 0; acc.appointments += day.appointments || 0; acc.referrals += day.referrals || 0;
        acc.policies_auto += day.policies_auto || 0; acc.policies_home += day.policies_home || 0; acc.policies_life += day.policies_life || 0; acc.policies_health += day.policies_health || 0;
        return acc;
      }, { user_id: userId, calls: 0, households_quoted: 0, households_closed: 0, pivots: 0, appointments: 0, referrals: 0, policies_auto: 0, policies_home: 0, policies_life: 0, policies_health: 0 });
    });
    if (period === 'today') setTeamData(aggregated);
    else if (period === 'week') setTeamWeeklyData(aggregated);
    else if (period === 'month') setTeamMonthlyData(aggregated);
    else if (period === 'year') setTeamYearlyData(aggregated);
    setLoadingTeam(false);
  };

  const loadLeaderboardData = async (period, type) => {
    setLoadingLeaderboard(true);
    const now = new Date();
    let startDate, endDate;
    if (period === 'today') { startDate = getLocalDateString(now); endDate = startDate; }
    else if (period === 'week') { const d = now.getDay(); const mon = new Date(now); mon.setDate(now.getDate() - (d === 0 ? 6 : d - 1)); startDate = getLocalDateString(mon); endDate = getLocalDateString(now); }
    else if (period === 'month') { startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`; endDate = getLocalDateString(now); }
    else if (period === 'year') { startDate = `${now.getFullYear()}-01-01`; endDate = getLocalDateString(now); }
    const { data: optedIn } = await supabase.from('profiles').select('*').eq('show_on_leaderboard', true);
    if (!optedIn?.length) { setLeaderboardData([]); setAgencyLeaderboardData([]); setLoadingLeaderboard(false); return; }
    const { data: activityData } = await supabase.from('daily_activity').select('*').gte('date', startDate).lte('date', endDate).in('user_id', optedIn.map(p => p.id));
    if (type === 'producers') {
      const pData = optedIn.map((p) => {
        const acts = activityData?.filter((a) => a.user_id === p.id) || [];
        const t = acts.reduce((acc, d) => { acc.policies_auto += d.policies_auto || 0; acc.policies_home += d.policies_home || 0; acc.policies_life += d.policies_life || 0; acc.policies_health += d.policies_health || 0; return acc; }, { policies_auto: 0, policies_home: 0, policies_life: 0, policies_health: 0 });
        return { id: p.id, name: p.name, agency_name: p.agency_name, total_policies: t.policies_auto + t.policies_home + t.policies_life + t.policies_health };
      });
      pData.sort((a, b) => b.total_policies - a.total_policies);
      setLeaderboardData(pData.slice(0, 50));
    } else {
      const agencyMap = {};
      optedIn.forEach((p) => { if (!agencyMap[p.agency_id]) agencyMap[p.agency_id] = { agency_id: p.agency_id, agency_name: p.agency_name, total_policies: 0, producer_count: 0 }; agencyMap[p.agency_id].producer_count++; });
      activityData?.forEach((a) => { const p = optedIn.find((x) => x.id === a.user_id); if (p && agencyMap[p.agency_id]) agencyMap[p.agency_id].total_policies += (a.policies_auto || 0) + (a.policies_home || 0) + (a.policies_life || 0) + (a.policies_health || 0); });
      const aData = Object.values(agencyMap); aData.sort((a, b) => b.total_policies - a.total_policies);
      setAgencyLeaderboardData(aData.slice(0, 50));
    }
    setLoadingLeaderboard(false);
  };

  const toggleLeaderboardOptIn = async () => {
    const newValue = !profile.show_on_leaderboard;
    if (isOwner) await supabase.from('profiles').update({ show_on_leaderboard: newValue }).eq('agency_id', profile.agency_id);
    else await supabase.from('profiles').update({ show_on_leaderboard: newValue }).eq('id', profile.id);
    onProfileUpdate({ ...profile, show_on_leaderboard: newValue });
  };

  const saveData = async (dayData) => {
    setSaving(true);
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    await supabase.from('daily_activity').upsert({ user_id: user.id, date: dateStr, ...dayData, updated_at: new Date().toISOString() }, { onConflict: 'user_id,date' });
    setSaving(false);
    setDailyData((prev) => ({ ...prev, [selectedDay]: dayData }));
  };

  const currentDay = dailyData[selectedDay] || getEmptyDay();
  const isToday = selectedDay === today;
  const incrementValue = (field, amt) => { const newVal = Math.max(0, (currentDay[field] || 0) + amt); const newData = { ...currentDay, [field]: newVal }; setDailyData((prev) => ({ ...prev, [selectedDay]: newData })); saveData(newData); };

  const getWeekDays = () => { const d = currentDate.getDay(); const mon = today - (d === 0 ? 6 : d - 1); return [0, 1, 2, 3, 4].map((i) => mon + i).filter((x) => x > 0 && x <= 31); };
  const weekDays = getWeekDays();
  const weeklyTotals = weekDays.reduce((acc, d) => { const data = dailyData[d] || getEmptyDay(); Object.keys(getEmptyDay()).forEach((k) => { acc[k] = (acc[k] || 0) + (data[k] || 0); }); return acc; }, {});
  const monthlyTotals = Object.values(dailyData).reduce((acc, data) => { Object.keys(getEmptyDay()).forEach((k) => { acc[k] = (acc[k] || 0) + (data[k] || 0); }); return acc; }, {});
  const getFullDate = (day) => new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const dailyGoals = { calls: 30, households_quoted: 3, households_closed: 2, pivots: 3, appointments: 2, referrals: 5 };

  const getCoachingInsight = () => {
    const p = getTotalPolicies(currentDay), q = currentDay.households_quoted || 0, pv = currentDay.pivots || 0, c = currentDay.calls || 0;
    if (p >= 5) return { text: "🔥 On fire! Keep the momentum going.", color: '#10B981' };
    if (q >= 3 && pv < 3) return { text: "💬 Quotes solid — time to pivot more!", color: '#3B82F6' };
    if (c >= 30 && q < 3) return { text: "📞 Great calls! Focus on quality quotes.", color: '#F59E0B' };
    if (p >= 2) return { text: "💪 Good progress! One more push.", color: '#3B82F6' };
    if (c < 15) return { text: "📱 Let's get those calls started!", color: '#F59E0B' };
    return { text: "🎯 Every activity counts. Keep building!", color: '#6B7280' };
  };

  // Modals
  const DatePicker = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const adj = firstDay === 0 ? 6 : firstDay - 1;
    const days = [...Array(adj).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowDatePicker(false)}>
        <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
            <button onClick={() => setShowDatePicker(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 flex items-center justify-center"><Icons.Close /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-3">{['M','T','W','T','F','S','S'].map((d,i) => <div key={i} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>)}</div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => day ? (
              <button key={i} onClick={() => { setSelectedDay(day); setShowDatePicker(false); }} disabled={day > today}
                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${day === selectedDay ? 'bg-blue-500 text-white shadow-lg' : day > today ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'} ${day === today && day !== selectedDay ? 'ring-2 ring-blue-200' : ''}`}>
                {day}
              </button>
            ) : <div key={i} />)}
          </div>
          <button onClick={() => { setSelectedDay(today); setShowDatePicker(false); }} className="w-full mt-6 py-3 text-sm font-semibold rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200">Go to Today</button>
        </div>
      </div>
    );
  };

  const InviteModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowInviteModal(false)}>
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Invite Producers</h3>
        <p className="text-sm text-gray-500 mb-6">Share this code with your team.</p>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-center border border-blue-100">
          <p className="text-xs text-blue-600 uppercase tracking-wide font-semibold mb-2">Your Invite Code</p>
          <p className="text-4xl font-bold tracking-widest text-blue-600 font-mono">{profile.invite_code}</p>
        </div>
        <button onClick={() => navigator.clipboard.writeText(profile.invite_code)} className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg shadow-blue-500/30">Copy Code</button>
        <button onClick={() => setShowInviteModal(false)} className="w-full mt-3 py-3 rounded-xl text-gray-500 font-semibold hover:bg-gray-100">Close</button>
      </div>
    </div>
  );

  const SettingsModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowSettingsModal(false)}>
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Settings</h3>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
          <div><p className="font-medium text-gray-900">Community Leaderboard</p><p className="text-sm text-gray-500">{isOwner ? 'Show agency publicly' : 'Controlled by owner'}</p></div>
          {isOwner ? (
            <button onClick={toggleLeaderboardOptIn} className={`relative w-14 h-8 rounded-full transition-all ${profile.show_on_leaderboard ? 'bg-emerald-500' : 'bg-gray-300'}`}>
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${profile.show_on_leaderboard ? 'left-7' : 'left-1'}`} />
            </button>
          ) : <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${profile.show_on_leaderboard ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>{profile.show_on_leaderboard ? 'Visible' : 'Hidden'}</div>}
        </div>
        <button onClick={() => setShowSettingsModal(false)} className="w-full mt-6 py-3 rounded-xl text-gray-500 font-semibold hover:bg-gray-100">Close</button>
      </div>
    </div>
  );

  // ========== DAILY VIEW ==========
  const DailyView = () => {
    const totalPolicies = getTotalPolicies(currentDay);
    const hq = currentDay.households_quoted || 0, hc = currentDay.households_closed || 0, pv = currentDay.pivots || 0;
    const lh = getLifeHealthPolicies(currentDay);
    const hcRate = hq > 0 ? Math.round((hc / hq) * 100) : 0;
    const ppHH = hc > 0 ? (totalPolicies / hc) : 0;
    const pvRate = pv > 0 ? Math.round((lh / pv) * 100) : 0;
    const insight = getCoachingInsight();

    return (
      <div className="space-y-4">
        {/* Date Nav */}
        <div className="flex items-center justify-between">
          <button onClick={() => setSelectedDay((d) => Math.max(1, d - 1))} disabled={selectedDay <= 1} className="w-10 h-10 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 disabled:opacity-30 flex items-center justify-center shadow-sm"><Icons.ChevronLeft /></button>
          <button onClick={() => setShowDatePicker(true)} className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 shadow-sm">
            <Icons.Calendar /><span className="font-semibold text-gray-700">{getFullDate(selectedDay)}</span>
            {isToday && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600">Today</span>}
          </button>
          <button onClick={() => setSelectedDay((d) => Math.min(today, d + 1))} disabled={selectedDay >= today} className="w-10 h-10 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 disabled:opacity-30 flex items-center justify-center shadow-sm"><Icons.ChevronRight /></button>
        </div>

        {/* POLICIES WRITTEN - Clean display, tap numbers to edit */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Policies Written</h2>
            <span className="text-5xl font-bold text-gray-900 tabular-nums">{totalPolicies}</span>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {[{ l: 'Auto', f: 'policies_auto', c: 'text-blue-600', bg: 'bg-blue-600' }, { l: 'Fire', f: 'policies_home', c: 'text-purple-600', bg: 'bg-purple-600' }, { l: 'Life', f: 'policies_life', c: 'text-emerald-600', bg: 'bg-emerald-600' }, { l: 'Health', f: 'policies_health', c: 'text-amber-500', bg: 'bg-amber-500' }].map(({ l, f, c, bg }) => (
              <button key={f} onClick={() => incrementValue(f, 1)} onContextMenu={(e) => { e.preventDefault(); incrementValue(f, -1); }}
                className="text-center group cursor-pointer">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">{l}</p>
                <p className={`text-3xl font-bold tabular-nums ${c} group-hover:scale-110 transition-transform`}>{currentDay[f] || 0}</p>
                <div className={`h-1 ${bg} rounded-full mt-2 opacity-60`} />
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">Tap to add • Right-click to subtract</p>
        </div>

        {/* FUNNEL */}
        <div>
          <FunnelCard icon={Icons.Phone} label="Outbound Calls" value={currentDay.calls || 0} goal={dailyGoals.calls} onIncrement={() => incrementValue('calls', 1)} onDecrement={() => incrementValue('calls', -1)} />
          <FunnelCard icon={Icons.Quote} label="Households Quoted" value={hq} goal={dailyGoals.households_quoted} onIncrement={() => incrementValue('households_quoted', 1)} onDecrement={() => incrementValue('households_quoted', -1)} />
          <FunnelCard icon={Icons.Check} label="Households Closed" value={hc} goal={dailyGoals.households_closed} onIncrement={() => incrementValue('households_closed', 1)} onDecrement={() => incrementValue('households_closed', -1)} />
          <FunnelCard icon={Icons.Target} label="Pivots (Life/Health)" value={pv} goal={dailyGoals.pivots} onIncrement={() => incrementValue('pivots', 1)} onDecrement={() => incrementValue('pivots', -1)} />
          <FunnelCard icon={Icons.Calendar} label="Appointments Set" value={currentDay.appointments || 0} goal={dailyGoals.appointments} onIncrement={() => incrementValue('appointments', 1)} onDecrement={() => incrementValue('appointments', -1)} />
          <FunnelCard icon={Icons.Star} label="Referral Asks" value={currentDay.referrals || 0} goal={dailyGoals.referrals} onIncrement={() => incrementValue('referrals', 1)} onDecrement={() => incrementValue('referrals', -1)} isLast />
        </div>

        {/* DONUT CHARTS */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-5 text-center">Closing Ratios</h3>
          <div className="flex justify-around">
            <DonutChart value={hcRate} max={100} label="Household Close" />
            <DonutChart value={ppHH} max={4} label="Policies / HH" />
            <DonutChart value={pvRate} max={100} label="Pivot Close" />
          </div>
        </div>

        {/* COACHING INSIGHT */}
        <div className="rounded-2xl p-4 border-l-4" style={{ backgroundColor: `${insight.color}15`, borderLeftColor: insight.color }}>
          <p className="text-sm font-medium" style={{ color: insight.color }}>{insight.text}</p>
        </div>

        {saving && <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-900 text-white text-sm rounded-full shadow-lg">Saving...</div>}
      </div>
    );
  };

  // ========== WEEKLY VIEW ==========
  const WeeklyView = () => {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 shadow-xl">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-4">This Week</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center"><p className="text-3xl font-bold text-white tabular-nums">{getTotalPolicies(weeklyTotals)}</p><p className="text-xs text-slate-400 mt-1">Policies</p></div>
            <div className="text-center border-l border-slate-700"><p className="text-3xl font-bold text-white tabular-nums">{weeklyTotals.households_closed || 0}</p><p className="text-xs text-slate-400 mt-1">Closed</p></div>
            <div className="text-center border-l border-slate-700"><p className="text-3xl font-bold text-white tabular-nums">{weeklyTotals.households_quoted || 0}</p><p className="text-xs text-slate-400 mt-1">Quoted</p></div>
            <div className="text-center border-l border-slate-700"><p className="text-3xl font-bold text-white tabular-nums">{weeklyTotals.calls || 0}</p><p className="text-xs text-slate-400 mt-1">Calls</p></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-5 divide-x divide-gray-100">
            {weekDays.map((day, i) => {
              const d = dailyData[day] || getEmptyDay();
              const p = getTotalPolicies(d);
              return (
                <button key={day} onClick={() => { setSelectedDay(day); setActiveView('daily'); }} className={`p-4 text-center hover:bg-gray-50 ${day === today ? 'bg-blue-50' : ''}`}>
                  <p className={`text-xs font-semibold uppercase ${day === today ? 'text-blue-600' : 'text-gray-400'}`}>{dayNames[i]}</p>
                  <p className={`text-2xl font-bold mt-1 tabular-nums ${p > 0 ? 'text-gray-900' : 'text-gray-300'}`}>{p}</p>
                  <p className="text-xs text-gray-400 mt-1">{d.households_closed || 0} HH</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ========== MONTHLY VIEW ==========
  const MonthlyView = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 shadow-xl">
        <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-4">This Month</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center"><p className="text-3xl font-bold text-white tabular-nums">{getTotalPolicies(monthlyTotals)}</p><p className="text-xs text-slate-400 mt-1">Policies</p></div>
          <div className="text-center border-l border-slate-700"><p className="text-3xl font-bold text-white tabular-nums">{monthlyTotals.households_closed || 0}</p><p className="text-xs text-slate-400 mt-1">Closed</p></div>
          <div className="text-center border-l border-slate-700"><p className="text-3xl font-bold text-white tabular-nums">{monthlyTotals.households_quoted || 0}</p><p className="text-xs text-slate-400 mt-1">Quoted</p></div>
          <div className="text-center border-l border-slate-700"><p className="text-3xl font-bold text-white tabular-nums">{monthlyTotals.calls || 0}</p><p className="text-xs text-slate-400 mt-1">Calls</p></div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Policies by Line</h3>
        <div className="grid grid-cols-4 gap-4">
          {[{ l: 'Auto', v: monthlyTotals.policies_auto || 0, c: '#3B82F6' }, { l: 'Home', v: monthlyTotals.policies_home || 0, c: '#8B5CF6' }, { l: 'Life', v: monthlyTotals.policies_life || 0, c: '#10B981' }, { l: 'Health', v: monthlyTotals.policies_health || 0, c: '#F59E0B' }].map(({ l, v, c }) => (
            <div key={l} className="text-center p-3 rounded-xl" style={{ backgroundColor: `${c}10` }}><p className="text-2xl font-bold tabular-nums" style={{ color: c }}>{v}</p><p className="text-xs font-medium text-gray-500 mt-1">{l}</p></div>
          ))}
        </div>
      </div>
    </div>
  );

  // ========== TEAM VIEW ==========
  const TeamView = () => {
    const getData = () => { switch(teamPeriod) { case 'today': return teamData; case 'week': return teamWeeklyData; case 'month': return teamMonthlyData; case 'year': return teamYearlyData; default: return teamData; } };
    const periodData = getData();
    const teamWithData = teamMembers.map((m) => ({ ...m, data: periodData.find((d) => d.user_id === m.id) || getEmptyDay() })).sort((a, b) => getTotalPolicies(b.data) - getTotalPolicies(a.data));
    const totals = teamWithData.reduce((acc, m) => {
      acc.policies += getTotalPolicies(m.data); acc.calls += m.data.calls || 0; acc.households_quoted += m.data.households_quoted || 0; acc.households_closed += m.data.households_closed || 0;
      acc.pivots += m.data.pivots || 0; acc.appointments += m.data.appointments || 0; acc.referrals += m.data.referrals || 0;
      acc.policies_auto += m.data.policies_auto || 0; acc.policies_home += m.data.policies_home || 0; acc.policies_life += m.data.policies_life || 0; acc.policies_health += m.data.policies_health || 0;
      return acc;
    }, { policies: 0, calls: 0, households_quoted: 0, households_closed: 0, pivots: 0, appointments: 0, referrals: 0, policies_auto: 0, policies_home: 0, policies_life: 0, policies_health: 0 });

    return (
      <div className="space-y-4">
        <div className="flex gap-1 p-1.5 bg-gray-100 rounded-xl">
          {['today', 'week', 'month', 'year'].map((id) => <button key={id} onClick={() => setTeamPeriod(id)} className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold capitalize ${teamPeriod === id ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>{id}</button>)}
        </div>
        {loadingTeam ? <div className="text-center py-12 text-gray-400">Loading...</div> : (
          <>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 shadow-xl">
              <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-4">{teamPeriod.charAt(0).toUpperCase() + teamPeriod.slice(1)} — Team Total</h2>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center"><p className="text-3xl font-bold text-white tabular-nums">{totals.policies}</p><p className="text-xs text-slate-400 mt-1">Policies</p></div>
                <div className="text-center border-l border-slate-700"><p className="text-3xl font-bold text-white tabular-nums">{totals.households_closed}</p><p className="text-xs text-slate-400 mt-1">Closed</p></div>
                <div className="text-center border-l border-slate-700"><p className="text-3xl font-bold text-white tabular-nums">{totals.households_quoted}</p><p className="text-xs text-slate-400 mt-1">Quoted</p></div>
                <div className="text-center border-l border-slate-700"><p className="text-3xl font-bold text-white tabular-nums">{totals.calls}</p><p className="text-xs text-slate-400 mt-1">Calls</p></div>
              </div>
              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-700">
                <div className="text-center"><p className="text-lg font-bold text-blue-400 tabular-nums">{totals.policies_auto}</p><p className="text-xs text-slate-500">Auto</p></div>
                <div className="text-center"><p className="text-lg font-bold text-purple-400 tabular-nums">{totals.policies_home}</p><p className="text-xs text-slate-500">Fire</p></div>
                <div className="text-center"><p className="text-lg font-bold text-emerald-400 tabular-nums">{totals.policies_life}</p><p className="text-xs text-slate-500">Life</p></div>
                <div className="text-center"><p className="text-lg font-bold text-amber-400 tabular-nums">{totals.policies_health}</p><p className="text-xs text-slate-500">Health</p></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Team Activity</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-xl"><p className="text-2xl font-bold text-gray-900 tabular-nums">{totals.pivots}</p><p className="text-xs text-gray-500 mt-1">Pivots</p></div>
                <div className="text-center p-3 bg-gray-50 rounded-xl"><p className="text-2xl font-bold text-gray-900 tabular-nums">{totals.appointments}</p><p className="text-xs text-gray-500 mt-1">Appts</p></div>
                <div className="text-center p-3 bg-gray-50 rounded-xl"><p className="text-2xl font-bold text-gray-900 tabular-nums">{totals.referrals}</p><p className="text-xs text-gray-500 mt-1">Referrals</p></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100"><h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Team Performance</h3></div>
              <div className="divide-y divide-gray-100">
                {teamWithData.map((m, i) => {
                  const p = getTotalPolicies(m.data);
                  const hit330 = teamPeriod === 'today' && (m.data.calls || 0) >= 30 && (m.data.households_quoted || 0) >= 3 && (m.data.pivots || 0) >= 3;
                  const hq = m.data.households_quoted || 0;
                  const hc = m.data.households_closed || 0;
                  const pv = m.data.pivots || 0;
                  const lh = (m.data.policies_life || 0) + (m.data.policies_health || 0);
                  const closeRate = hq > 0 ? Math.round((hc / hq) * 100) : 0;
                  const pivotRate = pv > 0 ? Math.round((lh / pv) * 100) : 0;
                  const isExpanded = expandedProducer === m.id;
                  return (
                    <div key={m.id}>
                      <button onClick={() => setExpandedProducer(isExpanded ? null : m.id)} className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-gray-200 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</span>
                          <div className="text-left">
                            <p className="font-semibold text-gray-900">{m.name}</p>
                            {hit330 && <span className="text-xs text-emerald-600 font-semibold">3-30 ✓</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-gray-900 tabular-nums">{p}</span>
                          <svg className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="px-5 pb-5 bg-gray-50 border-t border-gray-100">
                          <div className="grid grid-cols-4 gap-3 py-4">
                            <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                              <p className="text-2xl font-bold text-blue-600 tabular-nums">{m.data.policies_auto || 0}</p>
                              <p className="text-xs text-gray-500 mt-1">Auto</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                              <p className="text-2xl font-bold text-purple-600 tabular-nums">{m.data.policies_home || 0}</p>
                              <p className="text-xs text-gray-500 mt-1">Fire</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                              <p className="text-2xl font-bold text-emerald-600 tabular-nums">{m.data.policies_life || 0}</p>
                              <p className="text-xs text-gray-500 mt-1">Life</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                              <p className="text-2xl font-bold text-amber-600 tabular-nums">{m.data.policies_health || 0}</p>
                              <p className="text-xs text-gray-500 mt-1">Health</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                              <p className="text-xl font-bold text-gray-900 tabular-nums">{m.data.calls || 0}</p>
                              <p className="text-xs text-gray-500 mt-1">Calls</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                              <p className="text-xl font-bold text-gray-900 tabular-nums">{hq}</p>
                              <p className="text-xs text-gray-500 mt-1">Quotes</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                              <p className="text-xl font-bold text-gray-900 tabular-nums">{hc}</p>
                              <p className="text-xs text-gray-500 mt-1">Closed</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                              <p className="text-xl font-bold text-gray-900 tabular-nums">{pv}</p>
                              <p className="text-xs text-gray-500 mt-1">Pivots</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                              <p className="text-xl font-bold text-gray-900 tabular-nums">{m.data.appointments || 0}</p>
                              <p className="text-xs text-gray-500 mt-1">Appts</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                              <p className="text-xl font-bold text-gray-900 tabular-nums">{m.data.referrals || 0}</p>
                              <p className="text-xs text-gray-500 mt-1">Referrals</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                              <p className="text-xl font-bold tabular-nums" style={{ color: closeRate >= 50 ? '#10B981' : '#6B7280' }}>{closeRate}%</p>
                              <p className="text-xs text-gray-500 mt-1">Close Rate</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                              <p className="text-xl font-bold tabular-nums" style={{ color: pivotRate >= 50 ? '#10B981' : '#6B7280' }}>{pivotRate}%</p>
                              <p className="text-xs text-gray-500 mt-1">Pivot Close</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <button onClick={() => setShowInviteModal(true)} className="w-full py-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 font-semibold hover:border-blue-300 hover:text-blue-500">+ Invite Producer</button>
          </>
        )}
      </div>
    );
  };

  // ========== LEADERBOARD ==========
  const CommunityLeaderboard = () => {
    const data = leaderboardType === 'producers' ? leaderboardData : agencyLeaderboardData;
    return (
      <div className="space-y-4">
        <div className="text-center py-4"><h2 className="text-2xl font-bold text-gray-900">🏆 Leaderboard</h2></div>
        <div className="flex gap-1 p-1.5 bg-gray-100 rounded-xl">
          <button onClick={() => setLeaderboardType('producers')} className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold ${leaderboardType === 'producers' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>👤 Producers</button>
          <button onClick={() => setLeaderboardType('agencies')} className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold ${leaderboardType === 'agencies' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>🏢 Agencies</button>
        </div>
        <div className="flex gap-1 p-1.5 bg-gray-100 rounded-xl">
          {['today', 'week', 'month', 'year'].map((id) => <button key={id} onClick={() => setLeaderboardPeriod(id)} className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold capitalize ${leaderboardPeriod === id ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>{id}</button>)}
        </div>
        {loadingLeaderboard ? <div className="text-center py-12 text-gray-400">Loading...</div> : data.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="text-5xl mb-4">🏆</div><h3 className="font-semibold text-gray-900 mb-2">No one yet</h3>
            <p className="text-sm text-gray-500 mb-4">{profile.show_on_leaderboard ? "Log activity to appear!" : "Opt-in to see rankings"}</p>
            {!profile.show_on_leaderboard && isOwner && <button onClick={() => setShowSettingsModal(true)} className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg">Join Leaderboard</button>}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {data.length >= 3 && (
              <div className="bg-gradient-to-b from-blue-50 to-white p-6 border-b border-gray-100">
                <div className="flex items-end justify-center gap-6">
                  <div className="flex flex-col items-center"><div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-lg mb-2"><span className="text-2xl">🥈</span></div><p className="font-semibold text-gray-900 text-sm text-center">{leaderboardType === 'producers' ? formatLeaderboardName(data[1].name) : data[1].agency_name}</p><p className="text-lg font-bold text-blue-600 mt-1">{data[1].total_policies}</p></div>
                  <div className="flex flex-col items-center -mt-4"><div className="w-18 h-18 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-xl mb-2 ring-4 ring-yellow-200" style={{width:'72px',height:'72px'}}><span className="text-3xl">🥇</span></div><p className="font-bold text-gray-900 text-center">{leaderboardType === 'producers' ? formatLeaderboardName(data[0].name) : data[0].agency_name}</p><p className="text-xl font-bold text-blue-600 mt-1">{data[0].total_policies}</p></div>
                  <div className="flex flex-col items-center"><div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg mb-2"><span className="text-2xl">🥉</span></div><p className="font-semibold text-gray-900 text-sm text-center">{leaderboardType === 'producers' ? formatLeaderboardName(data[2].name) : data[2].agency_name}</p><p className="text-lg font-bold text-blue-600 mt-1">{data[2].total_policies}</p></div>
                </div>
              </div>
            )}
            <div className="divide-y divide-gray-100">
              {data.slice(data.length >= 3 ? 3 : 0).map((item, i) => {
                const rank = data.length >= 3 ? i + 4 : i + 1;
                const isMe = leaderboardType === 'producers' ? item.id === profile.id : item.agency_id === profile.agency_id;
                return (
                  <div key={item.id || item.agency_id} className={`flex items-center justify-between px-5 py-4 ${isMe ? 'bg-blue-50' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"><span className="text-lg font-bold text-gray-500">{rank}</span></div>
                      <div><p className={`font-medium ${isMe ? 'text-blue-600' : 'text-gray-900'}`}>{leaderboardType === 'producers' ? formatLeaderboardName(item.name) : item.agency_name}{isMe && <span className="ml-2 text-xs">(You)</span>}</p>{leaderboardType === 'producers' && <p className="text-xs text-gray-400">{item.agency_name}</p>}</div>
                    </div>
                    <p className="text-xl font-bold text-gray-900 tabular-nums">{item.total_policies}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
          <div><p className="text-sm font-medium text-gray-700">Your Status</p><p className="text-xs text-gray-500">{profile.show_on_leaderboard ? 'Visible' : 'Hidden'}</p></div>
          <button onClick={() => setShowSettingsModal(true)} className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50">Settings</button>
        </div>
      </div>
    );
  };

  // ========== RENDER ==========
  return (
    <div className="min-h-screen bg-gray-50">
      {showDatePicker && <DatePicker />}
      {showInviteModal && <InviteModal />}
      {showSettingsModal && <SettingsModal />}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <div><h1 className="text-lg font-bold text-gray-900">{profile?.agency_name || 'Sales Tracker'}</h1><p className="text-sm text-gray-500">{profile?.name}</p></div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowSettingsModal(true)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><Icons.Settings /></button>
              <button onClick={onLogout} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><Icons.Logout /></button>
            </div>
          </div>
          <div className="flex gap-1 p-1.5 bg-gray-100 rounded-xl">
            <button onClick={() => setMainView('my-numbers')} className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 ${mainView === 'my-numbers' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>My Numbers</button>
            {isOwner && <button onClick={() => setMainView('team')} className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 ${mainView === 'team' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}><Icons.Users /> Team</button>}
            <button onClick={() => setMainView('leaderboard')} className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold ${mainView === 'leaderboard' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>Leaderboard</button>
          </div>
          {mainView === 'my-numbers' && (
            <nav className="flex gap-1 p-1.5 bg-gray-100 rounded-xl mt-3">
              {[{ id: 'daily', l: 'Today' }, { id: 'weekly', l: 'Week' }, { id: 'monthly', l: 'Month' }].map(({ id, l }) => <button key={id} onClick={() => setActiveView(id)} className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold ${activeView === id ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>{l}</button>)}
            </nav>
          )}
        </div>
      </header>
      <main className="max-w-lg mx-auto px-5 py-5 pb-24">
        {mainView === 'my-numbers' && <>{activeView === 'daily' && <DailyView />}{activeView === 'weekly' && <WeeklyView />}{activeView === 'monthly' && <MonthlyView />}</>}
        {mainView === 'team' && <TeamView />}
        {mainView === 'leaderboard' && <CommunityLeaderboard />}
      </main>
    </div>
  );
};

// ============================================================================
// APP
// ============================================================================
export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { if (session?.user) { setUser(session.user); loadProfile(session.user.id); } else setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { if (session?.user) { setUser(session.user); loadProfile(session.user.id); } else { setUser(null); setProfile(null); } });
    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId) => { const { data } = await supabase.from('profiles').select('*').eq('id', userId).single(); setProfile(data); setLoading(false); };
  const handleAuth = async (u) => { setUser(u); await loadProfile(u.id); };
  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); setProfile(null); };
  const handleProfileUpdate = (p) => setProfile(p);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!user || !profile) return <AuthScreen onAuth={handleAuth} />;
  return <SalesTracker user={user} profile={profile} onLogout={handleLogout} onProfileUpdate={handleProfileUpdate} />;
}
