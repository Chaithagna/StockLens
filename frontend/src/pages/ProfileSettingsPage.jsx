import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  User,
  Key,
  Sliders,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Shield,
  MapPin,
  TrendingUp,
  Brain,
} from 'lucide-react';

export const ProfileSettingsPage = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [riskTolerance, setRiskTolerance] = useState(user?.preferences?.riskTolerance || 'moderate');
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.preferences?.notificationsEnabled !== false
  );

  const [apiKeys, setApiKeys] = useState({
    googleMapsApiKey: user?.apiKeys?.googleMapsApiKey || '',
    finnhubApiKey: user?.apiKeys?.finnhubApiKey || '',
    tavilyApiKey: user?.apiKeys?.tavilyApiKey || '',
    geminiApiKey: user?.apiKeys?.geminiApiKey || '',
    openaiApiKey: user?.apiKeys?.openaiApiKey || '',
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', text: '' });

    try {
      await updateProfile({
        name,
        preferences: {
          riskTolerance,
          notificationsEnabled,
        },
        apiKeys,
      });
      setFeedback({ type: 'success', text: 'Settings and API keys updated successfully!' });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-tight">Account Profile & Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your investor credentials, analysis risk tolerance, and external API integration keys.
        </p>
      </div>

      {feedback.text && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
            feedback.type === 'success'
              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-950/20 border-rose-500/30 text-rose-400'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Personal Details */}
        <div className="panel-card p-6 border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <User className="w-4 h-4 text-brand-400" />
            <span>Personal & Account Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full glass-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-1.5">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full glass-input opacity-60 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Investment & Risk Tolerance Preferences */}
        <div className="panel-card p-6 border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Due Diligence Preferences</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-1.5">
                Risk Tolerance Classification
              </label>
              <select
                value={riskTolerance}
                onChange={(e) => setRiskTolerance(e.target.value)}
                className="w-full glass-input"
              >
                <option value="conservative">Conservative (Flag all anomalies)</option>
                <option value="moderate">Moderate (Standard institutional)</option>
                <option value="aggressive">Aggressive (High growth tolerant)</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="notifications"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="rounded border-slate-700 text-brand-600 focus:ring-0 cursor-pointer w-4 h-4"
              />
              <label htmlFor="notifications" className="text-xs text-slate-300 cursor-pointer">
                Enable automated audit notifications and stage alerts
              </label>
            </div>
          </div>
        </div>

        {/* Custom API Integrations */}
        <div className="panel-card p-6 border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Custom API Key Integrations</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Optional: Supply your personal keys to override server defaults. If left empty, pre-calibrated server heuristics remain active.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-1.5">
                Google Maps Platform API Key (Places & Street View)
              </label>
              <input
                type="password"
                value={apiKeys.googleMapsApiKey}
                onChange={(e) => setApiKeys({ ...apiKeys, googleMapsApiKey: e.target.value })}
                placeholder="AIzaSy..."
                className="w-full glass-input font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-1.5">
                Finnhub Financial Market API Key
              </label>
              <input
                type="password"
                value={apiKeys.finnhubApiKey}
                onChange={(e) => setApiKeys({ ...apiKeys, finnhubApiKey: e.target.value })}
                placeholder="c01..."
                className="w-full glass-input font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-1.5">
                Tavily Search API Key (Deep News & Legal Scans)
              </label>
              <input
                type="password"
                value={apiKeys.tavilyApiKey}
                onChange={(e) => setApiKeys({ ...apiKeys, tavilyApiKey: e.target.value })}
                placeholder="tvly-..."
                className="w-full glass-input font-mono text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-1.5">
                  Google Gemini AI API Key
                </label>
                <input
                  type="password"
                  value={apiKeys.geminiApiKey}
                  onChange={(e) => setApiKeys({ ...apiKeys, geminiApiKey: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full glass-input font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-1.5">
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  value={apiKeys.openaiApiKey}
                  onChange={(e) => setApiKeys({ ...apiKeys, openaiApiKey: e.target.value })}
                  placeholder="sk-..."
                  className="w-full glass-input font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile & Preferences</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

