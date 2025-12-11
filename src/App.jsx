import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase - Replace with your credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================================
// AUTH COMPONENTS
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

  const zoomBlue = '#2D8CFF';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    onAuth(data.user);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Create profile
    if (isOwnerSignup) {
      // Agency owner signup
      const agencyId = crypto.randomUUID();
      const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email,
        name,
        role: 'owner',
        agency_id: agencyId,
        agency_name: agencyName,
        invite_code: inviteCode,
      });

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }
    } else {
      // Producer signup with invite code
      const { data: ownerData, error: ownerError } = await supabase
        .from('profiles')
        .select('agency_id, agency_name')
        .eq('invite_code', inviteCode.toUpperCase())
        .single();

      if (ownerError || !ownerData) {
        setError('Invalid invite code');
        setLoading(false);
        return;
      }

      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email,
        name,
        role: 'producer',
        agency_id: ownerData.agency_id,
        agency_name: ownerData.agency_name,
      });

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }
    }

    onAuth(authData.user);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Sales Tracker</h1>
          <p className="text-gray-500 mt-1">Track your daily production</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {isLogin ? (
            // Login Form
            <form onSubmit={handleLogin}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sign In</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm mt-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: zoomBlue }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="font-semibold hover:underline"
                  style={{ color: zoomBlue }}
                >
                  Sign Up
                </button>
              </p>
            </form>
          ) : (
            // Signup Form
            <form onSubmit={handleSignup}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Account</h2>

              {/* Role Selection */}
              <div className="flex gap-2 mb-4 p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setIsOwnerSignup(true)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                    isOwnerSignup ? 'bg-white shadow-sm' : ''
                  }`}
                  style={{ color: isOwnerSignup ? zoomBlue : '#6B7280' }}
                >
                  Agency Owner
                </button>
                <button
                  type="button"
                  onClick={() => setIsOwnerSignup(false)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                    !isOwnerSignup ? 'bg-white shadow-sm' : ''
                  }`}
                  style={{ color: !isOwnerSignup ? zoomBlue : '#6B7280' }}
                >
                  Producer
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="John Smith"
                    required
                  />
                </div>

                {isOwnerSignup ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Agency Name</label>
                    <input
                      type="text"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      placeholder="Smith Insurance Group"
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Invite Code</label>
                    <input
                      type="text"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all uppercase"
                      placeholder="ABC123"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">Get this from your agency owner</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="••••••••"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm mt-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: zoomBlue }}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="font-semibold hover:underline"
                  style={{ color: zoomBlue }}
                >
                  Sign In
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN TRACKER COMPONENT
// ============================================================================

const SalesTracker = ({ user, profile, onLogout }) => {
  const [activeView, setActiveView] = useState('daily');
  const [teamView, setTeamView] = useState(false);
  const [teamPeriod, setTeamPeriod] = useState('today');
  const [currentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [animateIn, setAnimateIn] = useState(true);
  const [dailyData, setDailyData] = useState({});
  const [teamData, setTeamData] = useState([]);
  const [teamWeeklyData, setTeamWeeklyData] = useState([]);
  const [teamMonthlyData, setTeamMonthlyData] = useState([]);
  const [teamYearlyData, setTeamYearlyData] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loadingTeam, setLoadingTeam] = useState(false);

  const zoomBlue = '#2D8CFF';
  const today = new Date().getDate();
  const isOwner = profile?.role === 'owner';

  // Helper function to get local date string
  const getLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Load data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  // Load team data when switching to team view or changing period
  useEffect(() => {
    if (isOwner && teamView) {
      loadTeamData(teamPeriod);
    }
  }, [teamView, teamPeriod]);

  useEffect(() => {
    setAnimateIn(false);
    const timer = setTimeout(() => setAnimateIn(true), 50);
    return () => clearTimeout(timer);
  }, [activeView, selectedDay, teamView, teamPeriod]);

  const loadUserData = async () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startOfMonth = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const endOfMonth = `${year}-${String(month + 1).padStart(2, '0')}-${lastDay}`;

    const { data, error } = await supabase
      .from('daily_activity')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startOfMonth)
      .lte('date', endOfMonth);

    if (data) {
      const dataByDay = {};
      data.forEach((entry) => {
        const day = parseInt(entry.date.split('-')[2]);
        dataByDay[day] = entry;
      });
      setDailyData(dataByDay);
    }
  };

  const loadTeamData = async (period) => {
    setLoadingTeam(true);
    
    // Get team members
    const { data: members } = await supabase
      .from('profiles')
      .select('*')
      .eq('agency_id', profile.agency_id);

    if (!members) {
      setLoadingTeam(false);
      return;
    }
    
    setTeamMembers(members);
    const memberIds = members.map((m) => m.id);
    const now = new Date();
    
    let startDate, endDate;
    
    if (period === 'today') {
      startDate = getLocalDateString(now);
      endDate = startDate;
    } else if (period === 'week') {
      // Get Monday of current week
      const dayOfWeek = now.getDay();
      const monday = new Date(now);
      monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      startDate = getLocalDateString(monday);
      endDate = getLocalDateString(now);
    } else if (period === 'month') {
      const year = now.getFullYear();
      const month = now.getMonth();
      startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      endDate = getLocalDateString(now);
    } else if (period === 'year') {
      const year = now.getFullYear();
      startDate = `${year}-01-01`;
      endDate = getLocalDateString(now);
    }

    const { data: activityData } = await supabase
      .from('daily_activity')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .in('user_id', memberIds);

    // Aggregate data by user
    const aggregatedData = memberIds.map((userId) => {
      const userActivities = activityData?.filter((a) => a.user_id === userId) || [];
      const totals = userActivities.reduce((acc, day) => {
        acc.calls += day.calls || 0;
        acc.households_quoted += day.households_quoted || 0;
        acc.households_closed += day.households_closed || 0;
        acc.pivots += day.pivots || 0;
        acc.appointments += day.appointments || 0;
        acc.referrals += day.referrals || 0;
        acc.policies_auto += day.policies_auto || 0;
        acc.policies_home += day.policies_home || 0;
        acc.policies_life += day.policies_life || 0;
        acc.policies_health += day.policies_health || 0;
        return acc;
      }, {
        calls: 0,
        households_quoted: 0,
        households_closed: 0,
        pivots: 0,
        appointments: 0,
        referrals: 0,
        policies_auto: 0,
        policies_home: 0,
        policies_life: 0,
        policies_health: 0,
      });
      return { user_id: userId, ...totals };
    });

    if (period === 'today') {
      setTeamData(aggregatedData);
    } else if (period === 'week') {
      setTeamWeeklyData(aggregatedData);
    } else if (period === 'month') {
      setTeamMonthlyData(aggregatedData);
    } else if (period === 'year') {
      setTeamYearlyData(aggregatedData);
    }
    
    setLoadingTeam(false);
  };

  const saveData = async (dayData) => {
    setSaving(true);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDay).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const { error } = await supabase.from('daily_activity').upsert(
      {
        user_id: user.id,
        date: dateStr,
        ...dayData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,date' }
    );

    setSaving(false);
    if (!error) {
      setDailyData((prev) => ({ ...prev, [selectedDay]: dayData }));
    }
  };

  const getEmptyDay = () => ({
    calls: 0,
    households_quoted: 0,
    households_closed: 0,
    pivots: 0,
    appointments: 0,
    referrals: 0,
    policies_auto: 0,
    policies_home: 0,
    policies_life: 0,
    policies_health: 0,
  });

  const currentDay = dailyData[selectedDay] || getEmptyDay();
  const isToday = selectedDay === today;

  const updateValue = (field, value) => {
    const newData = { ...currentDay, [field]: Math.max(0, parseInt(value) || 0) };
    setDailyData((prev) => ({ ...prev, [selectedDay]: newData }));
    saveData(newData);
  };

  const incrementValue = (field, amount) => {
    const newValue = Math.max(0, (currentDay[field] || 0) + amount);
    const newData = { ...currentDay, [field]: newValue };
    setDailyData((prev) => ({ ...prev, [selectedDay]: newData }));
    saveData(newData);
  };

  const getTotalPolicies = (data) =>
    (data?.policies_auto || 0) + (data?.policies_home || 0) + (data?.policies_life || 0) + (data?.policies_health || 0);

  const getLifeHealthPolicies = (data) => (data?.policies_life || 0) + (data?.policies_health || 0);

  const getWeekDays = () => {
    const dayOfWeek = currentDate.getDay();
    const monday = today - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
    return [0, 1, 2, 3, 4].map((i) => monday + i).filter((d) => d > 0 && d <= 31);
  };

  const weekDays = getWeekDays();

  const weeklyTotals = weekDays.reduce((acc, day) => {
    const dayData = dailyData[day] || getEmptyDay();
    Object.keys(getEmptyDay()).forEach((key) => {
      acc[key] = (acc[key] || 0) + (dayData[key] || 0);
    });
    return acc;
  }, {});

  const monthlyTotals = Object.values(dailyData).reduce((acc, dayData) => {
    Object.keys(getEmptyDay()).forEach((key) => {
      acc[key] = (acc[key] || 0) + (dayData[key] || 0);
    });
    return acc;
  }, {});

  const getFullDate = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  // Goals
  const dailyGoals = {
    calls: 30,
    households_quoted: 3,
    households_closed: 2,
    pivots: 3,
    appointments: 2,
    referrals: 5,
  };

  const weeklyGoals = {
    calls: 150,
    households_quoted: 15,
    households_closed: 10,
    pivots: 15,
    policies_total: 25,
  };

  const monthlyGoals = {
    calls: 600,
    households_quoted: 60,
    households_closed: 40,
    pivots: 60,
    policies_total: 100,
    policies_auto: 40,
    policies_home: 30,
    policies_life: 20,
    policies_health: 10,
  };

  // Components
  const InputRow = ({ label, field, goal, subtitle }) => {
    const value = currentDay[field] || 0;
    const hitGoal = goal > 0 && value >= goal;

    return (
      <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-base font-medium ${hitGoal ? 'text-emerald-600' : 'text-gray-800'}`}>{label}</span>
            {hitGoal && (
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => incrementValue(field, -1)}
            className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 font-medium text-lg transition-all active:scale-95"
          >
            −
          </button>
          <input
            type="number"
            value={value}
            onChange={(e) => updateValue(field, e.target.value)}
            className={`w-14 h-10 text-center text-xl font-semibold bg-transparent border-none outline-none tabular-nums ${
              hitGoal ? 'text-emerald-600' : 'text-gray-900'
            }`}
          />
          <button
            onClick={() => incrementValue(field, 1)}
            className="w-9 h-9 rounded-lg text-white font-medium text-lg transition-all active:scale-95 hover:opacity-90"
            style={{ backgroundColor: zoomBlue }}
          >
            +
          </button>
        </div>
      </div>
    );
  };

  const ProgressBar = ({ current, goal, label }) => {
    const percent = Math.min((current / goal) * 100, 100);
    const isComplete = current >= goal;

    return (
      <div className="mb-4 last:mb-0">
        <div className="flex justify-between items-baseline mb-1.5">
          <span className="text-sm text-gray-600">{label}</span>
          <div className="flex items-baseline gap-1">
            <span className={`text-sm font-semibold tabular-nums ${isComplete ? 'text-emerald-600' : 'text-gray-900'}`}>
              {current}
            </span>
            <span className="text-xs text-gray-400">/ {goal}</span>
          </div>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${percent}%`, backgroundColor: isComplete ? '#10B981' : zoomBlue }}
          />
        </div>
      </div>
    );
  };

  // Date Picker Modal
  const DatePicker = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const days = [];
    for (let i = 0; i < adjustedFirstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDatePicker(false)}>
        <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <button onClick={() => setShowDatePicker(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div key={i} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              if (!day) return <div key={i} />;
              const hasData = dailyData[day] && getTotalPolicies(dailyData[day]) > 0;
              const isSelected = day === selectedDay;
              const isTodayDate = day === today;
              const isFuture = day > today;

              return (
                <button
                  key={i}
                  onClick={() => { setSelectedDay(day); setShowDatePicker(false); }}
                  disabled={isFuture}
                  className={`relative w-10 h-10 rounded-lg text-sm font-medium transition-all
                    ${isSelected ? 'text-white' : isFuture ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}
                    ${isTodayDate && !isSelected ? 'ring-2 ring-blue-200' : ''}`}
                  style={{ backgroundColor: isSelected ? zoomBlue : 'transparent' }}
                >
                  {day}
                  {hasData && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => { setSelectedDay(today); setShowDatePicker(false); }}
            className="w-full mt-4 py-2 text-sm font-semibold rounded-lg transition-all"
            style={{ backgroundColor: `${zoomBlue}15`, color: zoomBlue }}
          >
            Go to Today
          </button>
        </div>
      </div>
    );
  };

  // Invite Modal
  const InviteModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowInviteModal(false)}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Invite Producers</h3>
        <p className="text-sm text-gray-500 mb-4">Share this code with your team members so they can join your agency.</p>
        
        <div className="bg-gray-100 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Your Invite Code</p>
          <p className="text-3xl font-bold tracking-wider" style={{ color: zoomBlue }}>{profile.invite_code}</p>
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText(profile.invite_code);
          }}
          className="w-full mt-4 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90"
          style={{ backgroundColor: zoomBlue }}
        >
          Copy Code
        </button>

        <button
          onClick={() => setShowInviteModal(false)}
          className="w-full mt-2 py-3 rounded-xl text-gray-500 font-semibold transition-all hover:bg-gray-100"
        >
          Close
        </button>
      </div>
    </div>
  );

  // Daily View
  const DailyView = () => {
    const totalPolicies = getTotalPolicies(currentDay);
    const householdsQuoted = currentDay.households_quoted || 0;
    const householdsClosed = currentDay.households_closed || 0;
    const pivots = currentDay.pivots || 0;
    const lifeHealthPolicies = getLifeHealthPolicies(currentDay);

    const householdCloseRate = householdsQuoted > 0 ? Math.round((householdsClosed / householdsQuoted) * 100) : 0;
    const policiesPerHousehold = householdsClosed > 0 ? (totalPolicies / householdsClosed).toFixed(1) : '0.0';
    const pivotCloseRate = pivots > 0 ? Math.round((lifeHealthPolicies / pivots) * 100) : 0;

    return (
      <div className={`transition-all duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
        {/* Date Navigator */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSelectedDay((d) => Math.max(1, d - 1))}
            disabled={selectedDay <= 1}
            className="w-10 h-10 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 disabled:opacity-30 transition-all flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => setShowDatePicker(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-all"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-semibold text-gray-700">{getFullDate(selectedDay)}</span>
            {isToday && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600">Today</span>}
          </button>

          <button
            onClick={() => setSelectedDay((d) => Math.min(today, d + 1))}
            disabled={selectedDay >= today}
            className="w-10 h-10 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 disabled:opacity-30 transition-all flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Saving indicator */}
        {saving && (
          <div className="text-center text-xs text-gray-400 mb-2">Saving...</div>
        )}

        {/* Policies Written */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Policies Written</h2>
            <div className="text-3xl font-bold text-gray-900 tabular-nums">{totalPolicies}</div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Auto', field: 'policies_auto' },
              { label: 'Home', field: 'policies_home' },
              { label: 'Life', field: 'policies_life' },
              { label: 'Health', field: 'policies_health' },
            ].map(({ label, field }) => {
              const value = currentDay[field] || 0;
              return (
                <div key={field} className="text-center">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">{label}</p>
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => incrementValue(field, -1)}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-400 text-sm transition-all active:scale-95"
                    >
                      −
                    </button>
                    <span className="w-10 text-xl font-bold text-gray-900 tabular-nums">{value}</span>
                    <button
                      onClick={() => incrementValue(field, 1)}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-400 text-sm transition-all active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Closing Ratios */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-4 border border-gray-100">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4 text-center">Closing Ratios</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold tabular-nums" style={{ color: householdCloseRate >= 50 ? '#10B981' : zoomBlue }}>
                {householdCloseRate}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Household Close</p>
              <p className="text-xs text-gray-400">{householdsClosed} / {householdsQuoted}</p>
            </div>
            <div className="text-center border-l border-r border-gray-200">
              <p className="text-2xl font-bold tabular-nums" style={{ color: parseFloat(policiesPerHousehold) >= 2.5 ? '#10B981' : zoomBlue }}>
                {policiesPerHousehold}
              </p>
              <p className="text-xs text-gray-500 mt-1">Policies / HH</p>
              <p className="text-xs text-gray-400">{totalPolicies} / {householdsClosed}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold tabular-nums" style={{ color: pivotCloseRate >= 20 ? '#10B981' : zoomBlue }}>
                {pivotCloseRate}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Pivot Close</p>
              <p className="text-xs text-gray-400">{lifeHealthPolicies} / {pivots}</p>
            </div>
          </div>
        </div>

        {/* Activity Inputs */}
        <div className="bg-white rounded-2xl px-5 shadow-sm border border-gray-100">
          <InputRow label="Households Quoted" field="households_quoted" goal={dailyGoals.households_quoted} subtitle="1 family = 1 quote" />
          <InputRow label="Households Closed" field="households_closed" goal={dailyGoals.households_closed} subtitle="New accounts won" />
          <InputRow label="Pivots" field="pivots" goal={dailyGoals.pivots} subtitle="Life & Health conversations" />
          <InputRow label="Appointments" field="appointments" goal={dailyGoals.appointments} />
          <InputRow label="Referral Asks" field="referrals" goal={dailyGoals.referrals} />
          <InputRow label="Outbound Calls" field="calls" goal={dailyGoals.calls} />
        </div>
      </div>
    );
  };

  // Weekly View
  const WeeklyView = () => {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

    return (
      <div className={`space-y-4 transition-all duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Weekly Progress</h2>
          <ProgressBar current={getTotalPolicies(weeklyTotals)} goal={weeklyGoals.policies_total} label="Policies Written" />
          <ProgressBar current={weeklyTotals.households_closed || 0} goal={weeklyGoals.households_closed} label="Households Closed" />
          <ProgressBar current={weeklyTotals.households_quoted || 0} goal={weeklyGoals.households_quoted} label="Households Quoted" />
          <ProgressBar current={weeklyTotals.pivots || 0} goal={weeklyGoals.pivots} label="Pivots" />
          <ProgressBar current={weeklyTotals.calls || 0} goal={weeklyGoals.calls} label="Calls" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 px-4 text-left font-semibold text-gray-400 uppercase text-xs">Day</th>
                <th className="py-3 px-3 text-center font-semibold text-gray-400 uppercase text-xs">Policies</th>
                <th className="py-3 px-3 text-center font-semibold text-gray-400 uppercase text-xs">HH Closed</th>
                <th className="py-3 px-3 text-center font-semibold text-gray-400 uppercase text-xs">Pivots</th>
              </tr>
            </thead>
            <tbody>
              {weekDays.map((day, i) => {
                const dayData = dailyData[day] || getEmptyDay();
                const isTodayRow = day === today;
                return (
                  <tr
                    key={day}
                    className={`cursor-pointer hover:bg-gray-50 ${isTodayRow ? 'bg-blue-50/50' : ''}`}
                    onClick={() => { setSelectedDay(day); setActiveView('daily'); }}
                  >
                    <td className={`py-3 px-4 font-medium ${isTodayRow ? 'text-blue-600' : 'text-gray-700'}`}>{dayNames[i]}</td>
                    <td className="py-3 px-3 text-center font-semibold text-gray-900 tabular-nums">{getTotalPolicies(dayData)}</td>
                    <td className="py-3 px-3 text-center text-gray-600 tabular-nums">{dayData.households_closed || 0}</td>
                    <td className="py-3 px-3 text-center text-gray-600 tabular-nums">{dayData.pivots || 0}</td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-gray-200 bg-gray-50">
                <td className="py-3 px-4 font-semibold text-gray-700">Total</td>
                <td className="py-3 px-3 text-center font-bold text-gray-900 tabular-nums">{getTotalPolicies(weeklyTotals)}</td>
                <td className="py-3 px-3 text-center font-semibold text-gray-700 tabular-nums">{weeklyTotals.households_closed || 0}</td>
                <td className="py-3 px-3 text-center font-semibold text-gray-700 tabular-nums">{weeklyTotals.pivots || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Monthly View
  const MonthlyView = () => {
    return (
      <div className={`space-y-4 transition-all duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Monthly Progress</h2>
          <ProgressBar current={getTotalPolicies(monthlyTotals)} goal={monthlyGoals.policies_total} label="Policies Written" />
          <ProgressBar current={monthlyTotals.households_closed || 0} goal={monthlyGoals.households_closed} label="Households Closed" />
          <ProgressBar current={monthlyTotals.households_quoted || 0} goal={monthlyGoals.households_quoted} label="Households Quoted" />
          <ProgressBar current={monthlyTotals.pivots || 0} goal={monthlyGoals.pivots} label="Pivots" />
          <ProgressBar current={monthlyTotals.calls || 0} goal={monthlyGoals.calls} label="Calls" />
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Policies by Line</h2>
          <div className="space-y-3">
            {[
              { label: 'Auto', value: monthlyTotals.policies_auto || 0, goal: monthlyGoals.policies_auto },
              { label: 'Home', value: monthlyTotals.policies_home || 0, goal: monthlyGoals.policies_home },
              { label: 'Life', value: monthlyTotals.policies_life || 0, goal: monthlyGoals.policies_life },
              { label: 'Health', value: monthlyTotals.policies_health || 0, goal: monthlyGoals.policies_health },
            ].map(({ label, value, goal }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{label}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((value / goal) * 100, 100)}%`, backgroundColor: value >= goal ? '#10B981' : zoomBlue }}
                    />
                  </div>
                  <span className={`text-sm font-semibold tabular-nums w-12 text-right ${value >= goal ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {value}/{goal}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Team View (Owner only)
  const TeamView = () => {
    // Get the right data based on selected period
    const getTeamDataForPeriod = () => {
      switch (teamPeriod) {
        case 'today': return teamData;
        case 'week': return teamWeeklyData;
        case 'month': return teamMonthlyData;
        case 'year': return teamYearlyData;
        default: return teamData;
      }
    };

    const periodData = getTeamDataForPeriod();
    
    const teamWithData = teamMembers.map((member) => {
      const memberData = periodData.find((d) => d.user_id === member.id) || getEmptyDay();
      return { ...member, data: memberData };
    });

    const teamTotalPolicies = teamWithData.reduce((sum, m) => sum + getTotalPolicies(m.data), 0);
    const teamTotalHHClosed = teamWithData.reduce((sum, m) => sum + (m.data.households_closed || 0), 0);
    const teamTotalHHQuoted = teamWithData.reduce((sum, m) => sum + (m.data.households_quoted || 0), 0);
    const teamTotalPivots = teamWithData.reduce((sum, m) => sum + (m.data.pivots || 0), 0);
    const teamTotalCalls = teamWithData.reduce((sum, m) => sum + (m.data.calls || 0), 0);
    const teamTotalAuto = teamWithData.reduce((sum, m) => sum + (m.data.policies_auto || 0), 0);
    const teamTotalHome = teamWithData.reduce((sum, m) => sum + (m.data.policies_home || 0), 0);
    const teamTotalLife = teamWithData.reduce((sum, m) => sum + (m.data.policies_life || 0), 0);
    const teamTotalHealth = teamWithData.reduce((sum, m) => sum + (m.data.policies_health || 0), 0);

    const getPeriodLabel = () => {
      switch (teamPeriod) {
        case 'today': return "Today's";
        case 'week': return "This Week's";
        case 'month': return "This Month's";
        case 'year': return "This Year's";
        default: return "Today's";
      }
    };

    return (
      <div className={`space-y-4 transition-all duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
        {/* Period Selector */}
        <nav className="flex gap-1 p-1 bg-gray-100 rounded-xl">
          {[
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'Week' },
            { id: 'month', label: 'Month' },
            { id: 'year', label: 'Year' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTeamPeriod(id)}
              className="flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all"
              style={{
                backgroundColor: teamPeriod === id ? 'white' : 'transparent',
                color: teamPeriod === id ? zoomBlue : '#6B7280',
                boxShadow: teamPeriod === id ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        {loadingTeam ? (
          <div className="text-center py-8 text-gray-400">Loading team data...</div>
        ) : (
          <>
            {/* Team Summary */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">{getPeriodLabel()} Team Total</h2>
                <div className="text-3xl font-bold text-gray-900 tabular-nums">{teamTotalPolicies} <span className="text-lg text-gray-400">policies</span></div>
              </div>
              
              {/* Policy breakdown */}
              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900 tabular-nums">{teamTotalAuto}</p>
                  <p className="text-xs text-gray-400">Auto</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900 tabular-nums">{teamTotalHome}</p>
                  <p className="text-xs text-gray-400">Home</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900 tabular-nums">{teamTotalLife}</p>
                  <p className="text-xs text-gray-400">Life</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900 tabular-nums">{teamTotalHealth}</p>
                  <p className="text-xs text-gray-400">Health</p>
                </div>
              </div>
            </div>

            {/* Team Activity Summary */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4 text-center">Team Activity</h2>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900 tabular-nums">{teamTotalHHQuoted}</p>
                  <p className="text-xs text-gray-500">Quoted</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900 tabular-nums">{teamTotalHHClosed}</p>
                  <p className="text-xs text-gray-500">Closed</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900 tabular-nums">{teamTotalPivots}</p>
                  <p className="text-xs text-gray-500">Pivots</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900 tabular-nums">{teamTotalCalls}</p>
                  <p className="text-xs text-gray-500">Calls</p>
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Team Leaderboard</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {teamWithData
                  .sort((a, b) => getTotalPolicies(b.data) - getTotalPolicies(a.data))
                  .map((member, i) => {
                    const policies = getTotalPolicies(member.data);
                    const hhClosed = member.data.households_closed || 0;
                    const hit330 = teamPeriod === 'today' && (member.data.calls || 0) >= 30 && (member.data.households_quoted || 0) >= 3 && (member.data.pivots || 0) >= 3;

                    return (
                      <div key={member.id} className="flex items-center justify-between px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {i + 1}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-xs text-gray-400">{hhClosed} households closed</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {hit330 && (
                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-600">3-30 ✓</span>
                          )}
                          <span className="text-xl font-bold text-gray-900 tabular-nums">{policies}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Invite Button */}
            <button
              onClick={() => setShowInviteModal(true)}
              className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 font-semibold hover:border-gray-400 hover:text-gray-600 transition-all"
            >
              + Invite Producer
            </button>
          </>
        )}
      </div>
    );
  };

  const triple330Status = dailyData[today] || getEmptyDay();
  const triple330Complete = (triple330Status.calls || 0) >= 30 && (triple330Status.households_quoted || 0) >= 3 && (triple330Status.pivots || 0) >= 3;

  return (
    <div className="min-h-screen bg-gray-50">
      {showDatePicker && <DatePicker />}
      {showInviteModal && <InviteModal />}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-bold text-gray-900">{profile?.agency_name || 'Sales Tracker'}</h1>
              <p className="text-sm text-gray-500">{profile?.name}</p>
            </div>

            <div className="flex items-center gap-2">
              {/* 3-30 Status */}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: triple330Complete ? '#ECFDF5' : '#F3F4F6',
                  color: triple330Complete ? '#059669' : '#6B7280',
                }}
              >
                <span>3-30</span>
                <div className="flex gap-1">
                  <span className={`w-2 h-2 rounded-full ${(triple330Status.calls || 0) >= 30 ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                  <span className={`w-2 h-2 rounded-full ${(triple330Status.households_quoted || 0) >= 3 ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                  <span className={`w-2 h-2 rounded-full ${(triple330Status.pivots || 0) >= 3 ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                </div>
              </div>

              {/* Logout */}
              <button onClick={onLogout} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>

          {/* Owner Toggle */}
          {isOwner && (
            <div className="flex gap-2 mb-4 p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setTeamView(false)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${!teamView ? 'bg-white shadow-sm' : ''}`}
                style={{ color: !teamView ? zoomBlue : '#6B7280' }}
              >
                My Numbers
              </button>
              <button
                onClick={() => setTeamView(true)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${teamView ? 'bg-white shadow-sm' : ''}`}
                style={{ color: teamView ? zoomBlue : '#6B7280' }}
              >
                Team View
              </button>
            </div>
          )}

          {/* Navigation (only show when not in team view) */}
          {!teamView && (
            <nav className="flex gap-1 p-1 bg-gray-100 rounded-xl">
              {['daily', 'weekly', 'monthly'].map((id) => (
                <button
                  key={id}
                  onClick={() => setActiveView(id)}
                  className="flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all capitalize"
                  style={{
                    backgroundColor: activeView === id ? 'white' : 'transparent',
                    color: activeView === id ? zoomBlue : '#6B7280',
                    boxShadow: activeView === id ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  }}
                >
                  {id === 'daily' ? 'Today' : id === 'weekly' ? 'Week' : 'Month'}
                </button>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-5 py-5">
        {teamView ? (
          <TeamView />
        ) : (
          <>
            {activeView === 'daily' && <DailyView />}
            {activeView === 'weekly' && <WeeklyView />}
            {activeView === 'monthly' && <MonthlyView />}
          </>
        )}
      </main>
    </div>
  );
};

// ============================================================================
// MAIN APP
// ============================================================================

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    setProfile(data);
    setLoading(false);
  };

  const handleAuth = async (user) => {
    setUser(user);
    await loadProfile(user.id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  return <SalesTracker user={user} profile={profile} onLogout={handleLogout} />;
}
