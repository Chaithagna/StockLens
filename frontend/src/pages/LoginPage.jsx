import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LogIn, AlertCircle, Loader2, KeyRound, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemoAccount = async () => {
    setEmail('demo@stocklens.com');
    setPassword('Password123!');
    setLoading(true);
    setErrorMessage('');
    try {
      await login({ email: 'demo@stocklens.com', password: 'Password123!' });
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Could not log in with demo account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white tracking-tight">Sign In to Terminal</h3>
        <p className="text-xs text-slate-400 mt-1">
          Access your research reports, safety diagnostics, and AI assistant.
        </p>
      </div>

      {/* Demo Credentials Quick-Fill Pill */}
      <div className="mb-6 p-3 bg-brand-950/40 border border-brand-500/30 rounded-xl flex items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-brand-300 flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5" /> Instant Review Account
          </span>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Pre-seeded analyst credentials ready for 1-click test.
          </p>
        </div>
        <button
          type="button"
          onClick={handleUseDemoAccount}
          disabled={loading}
          className="shrink-0 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all focus:outline-none"
        >
          {loading ? 'Entering...' : 'Use Demo'}
        </button>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider font-mono mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="investor@firm.com"
            className="w-full glass-input"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider font-mono">
              Password
            </label>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full glass-input"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold">
          Create free account
        </Link>
      </div>
    </div>
  );
};

