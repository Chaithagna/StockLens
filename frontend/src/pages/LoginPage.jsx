import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LogIn, AlertCircle, Loader2, Sparkles, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        <h3 className="text-xl font-bold text-[#172033] tracking-tight">Sign In to StockLens</h3>
        <p className="text-xs text-[#68758A] mt-1">
          Access your research reports, safety diagnostics, and AI assistant.
        </p>
      </div>

      {/* Demo Credentials Quick-Fill Pill */}
      <div className="mb-6 p-3.5 bg-[#F0F4FE] border border-[#DBE4FD] rounded-xl flex items-center justify-between gap-3 shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#315CF5] flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5" /> Instant Review Account
          </span>
          <p className="text-[11px] text-[#68758A] mt-0.5">
            Pre-seeded analyst credentials ready for 1-click test.
          </p>
        </div>
        <button
          type="button"
          onClick={handleUseDemoAccount}
          disabled={loading}
          className="shrink-0 bg-[#315CF5] hover:bg-[#1F47DC] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition-all focus:outline-none"
        >
          {loading ? 'Entering...' : 'Use Demo'}
        </button>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-[#E05252]/10 border border-[#E05252]/20 rounded-lg text-xs text-[#E05252] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider font-mono mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA5B6]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="investor@firm.com"
              className="w-full glass-input pl-9"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider font-mono">
              Password
            </label>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA5B6]" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full glass-input pl-9 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA5B6] hover:text-[#172033] transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 btn-primary !py-2.5 !text-sm"
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

      <div className="mt-6 text-center text-xs text-[#68758A]">
        Don't have an account?{' '}
        <Link to="/register" className="text-[#315CF5] hover:underline font-semibold">
          Create free account
        </Link>
      </div>
    </div>
  );
};
