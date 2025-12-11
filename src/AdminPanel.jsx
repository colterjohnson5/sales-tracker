import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Admin emails that can access this panel
const ADMIN_EMAILS = ['colter@insurancesalespro.com']; // Add your email here

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leagues, setLeagues] = useState([]);
  const [leagueCounts, setLeagueCounts] = useState({});
  const [newLeagueName, setNewLeagueName] = useState('');
  const [newLeagueCode, setNewLeagueCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (user && ADMIN_EMAILS.includes(user.email)) {
      loadLeagues();
    }
  }, [user]);

  const loadLeagues = async () => {
    // Get all leagues
    const { data: leagueData } = await supabase
      .from('leagues')
      .select('*')
      .order('created_at', { ascending: false });
    
    setLeagues(leagueData || []);

    // Get counts per league
    const { data: profiles } = await supabase
      .from('profiles')
      .select('league_id, agency_id')
      .not('league_id', 'is', null);

    const counts = {};
    const agencySets = {};
    
    profiles?.forEach(p => {
      if (!counts[p.league_id]) {
        counts[p.league_id] = { producers: 0, agencies: new Set() };
      }
      counts[p.league_id].producers++;
      counts[p.league_id].agencies.add(p.agency_id);
    });

    // Convert Sets to counts
    Object.keys(counts).forEach(id => {
      counts[id] = {
        producers: counts[id].producers,
        agencies: counts[id].agencies.size
      };
    });

    setLeagueCounts(counts);
  };

  const generateCode = (name) => {
    // Generate a code from the name (first letters + random)
    const words = name.toUpperCase().split(' ');
    let code = words.map(w => w[0]).join('');
    if (code.length < 4) {
      code += Math.random().toString(36).substring(2, 6 - code.length).toUpperCase();
    }
    return code.substring(0, 8);
  };

  const handleNameChange = (name) => {
    setNewLeagueName(name);
    if (!newLeagueCode || newLeagueCode === generateCode(newLeagueName)) {
      setNewLeagueCode(generateCode(name));
    }
  };

  const createLeague = async () => {
    setError('');
    setSuccess('');

    if (!newLeagueName.trim()) {
      setError('Please enter a league name');
      return;
    }

    if (!newLeagueCode.trim()) {
      setError('Please enter a league code');
      return;
    }

    const code = newLeagueCode.toUpperCase().trim();

    // Check if code already exists
    const { data: existing } = await supabase
      .from('leagues')
      .select('id')
      .eq('code', code)
      .single();

    if (existing) {
      setError('That code is already in use');
      return;
    }

    const { error: insertError } = await supabase
      .from('leagues')
      .insert({ name: newLeagueName.trim(), code });

    if (insertError) {
      setError('Failed to create league');
      return;
    }

    setSuccess(`League "${newLeagueName}" created with code: ${code}`);
    setNewLeagueName('');
    setNewLeagueCode('');
    loadLeagues();
  };

  const deleteLeague = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will remove all agencies from this league.`)) {
      return;
    }

    // Remove league_id from all profiles in this league
    await supabase
      .from('profiles')
      .update({ league_id: null })
      .eq('league_id', id);

    // Delete the league
    await supabase
      .from('leagues')
      .delete()
      .eq('id', id);

    loadLeagues();
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setSuccess(`Copied: ${code}`);
    setTimeout(() => setSuccess(''), 2000);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Panel</h1>
          <p className="text-gray-500 mb-6">Please log in to the main app first, then return here.</p>
          <a href="/" className="text-blue-600 hover:underline">Go to main app →</a>
        </div>
      </div>
    );
  }

  // Not authorized
  if (!ADMIN_EMAILS.includes(user.email)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-500 mb-2">You don't have permission to access this page.</p>
          <p className="text-sm text-gray-400">Logged in as: {user.email}</p>
        </div>
      </div>
    );
  }

  // Admin panel
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">League Admin</h1>
          <p className="text-gray-500">Manage leagues and view membership</p>
        </header>

        {/* Create New League */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New League</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">League Name</label>
              <input
                type="text"
                value={newLeagueName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Utah TMHOF"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">League Code</label>
              <input
                type="text"
                value={newLeagueCode}
                onChange={(e) => setNewLeagueCode(e.target.value.toUpperCase())}
                placeholder="e.g., UTAHTH"
                maxLength={8}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none uppercase tracking-widest font-mono"
              />
              <p className="text-xs text-gray-400 mt-1">This is what agencies will enter to join</p>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-emerald-500 text-sm">{success}</p>}

            <button
              onClick={createLeague}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
            >
              Create League
            </button>
          </div>
        </div>

        {/* Existing Leagues */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">All Leagues ({leagues.length})</h2>
          </div>
          
          {leagues.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No leagues created yet</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {leagues.map((league) => {
                const count = leagueCounts[league.id] || { agencies: 0, producers: 0 };
                return (
                  <div key={league.id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{league.name}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <button
                          onClick={() => copyCode(league.code)}
                          className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          {league.code}
                        </button>
                        <span className="text-sm text-gray-500">
                          {count.agencies} {count.agencies === 1 ? 'agency' : 'agencies'} • {count.producers} {count.producers === 1 ? 'producer' : 'producers'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteLeague(league.id, league.name)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-3xl font-bold text-gray-900">{leagues.length}</p>
            <p className="text-sm text-gray-500">Leagues</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-3xl font-bold text-gray-900">
              {Object.values(leagueCounts).reduce((sum, c) => sum + c.agencies, 0)}
            </p>
            <p className="text-sm text-gray-500">Agencies</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-3xl font-bold text-gray-900">
              {Object.values(leagueCounts).reduce((sum, c) => sum + c.producers, 0)}
            </p>
            <p className="text-sm text-gray-500">Producers</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-blue-600 hover:underline text-sm">← Back to main app</a>
        </div>
      </div>
    </div>
  );
}
