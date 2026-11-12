import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { UserPlus, AlertCircle, Loader2, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password });
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-[#172033] tracking-tight">Create Research Account</h3>
        <p className="text-xs text-[#68758A] mt-1">
          Join StockLens for automated corporate due diligence.
        </p>
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
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA5B6]" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full glass-input pl-9"
            />
          </div>
        </div>

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
          <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider font-mono mb-1.5">
            Password (min. 6 characters)
          </label>
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
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Register & Continue</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-[#68758A]">
        Already registered?{' '}
        <Link to="/login" className="text-[#315CF5] hover:underline font-semibold">
          Sign in here
        </Link>
      </div>
    </div>
  );
};
