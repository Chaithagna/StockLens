import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { assistantService } from '../services/assistantService.js';
import { researchService } from '../services/researchService.js';
import { useResearch } from '../context/ResearchContext.jsx';
import {
  Bot,
  User,
  Send,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  HelpCircle,
  FileText,
} from 'lucide-react';

export const AIAssistantPage = () => {
  const [searchParams] = useSearchParams();
  const { currentReport, setCurrentReport } = useResearch();
  const researchId = searchParams.get('researchId') || currentReport?._id;

  const [availableReports, setAvailableReports] = useState([]);
  const [activeReportId, setActiveReportId] = useState(researchId || '');
  const [activeReport, setActiveReport] = useState(currentReport);

  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const chatBottomRef = useRef(null);

  // Load user's recent reports for quick switching
  useEffect(() => {
    researchService
      .getHistory({ limit: 20 })
      .then((res) => {
        const list = res.data || [];
        setAvailableReports(list);
        if (!activeReportId && list.length > 0) {
          setActiveReportId(list[0]._id);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // When activeReportId changes, fetch active report & past conversation
  useEffect(() => {
    if (!activeReportId) return;

    setLoadingChat(true);
    Promise.all([
      researchService.getById(activeReportId),
      assistantService.getConversation(activeReportId),
    ])
      .then(([rep, conv]) => {
        setActiveReport(rep);
        setCurrentReport(rep);

        if (conv?.messages && conv.messages.length > 0) {
          setMessages(conv.messages);
        } else {
          // Initialize friendly welcome message
          setMessages([
            {
              sender: 'assistant',
              content: `Hello! I am your **StockLens AI Research Assistant**. I have loaded the verified due diligence dossier for **${rep.companyName}** (${rep.ticker || 'N/A'}).\n\nI can explain risk scores, verify physical location credibility, audit balance sheet leverage, or point out regulatory discrepancies based on verified public records. What would you like to investigate?`,
              citedSources: [],
              timestamp: new Date(),
            },
          ]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingChat(false));
  }, [activeReportId, setCurrentReport]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend = null) => {
    const q = textToSend || inputQuery;
    if (!q.trim() || !activeReportId || sending) return;

    const userMessage = {
      sender: 'user',
      content: q.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setSending(true);

    try {
      const res = await assistantService.sendMessage(activeReportId, q.trim());
      setMessages((prev) => [...prev, res.message]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          content: `⚠️ Error: ${err.message || 'Failed to process inquiry. Please check your connection or query.'}`,
          citedSources: [],
          timestamp: new Date(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const SUGGESTED_PROMPTS = [
    'Explain the primary red flags identified for this company.',
    'Is the physical office address legitimate or a virtual coworking suite?',
    'Analyze the debt-to-equity and short-term solvency risk.',
    'Are there any active SEC regulatory warnings or lawsuits?',
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Header & Report Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-brand-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">AI Due Diligence Assistant</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive inquiry engine grounded strictly in verified corporate records.
          </p>
        </div>

        {/* Company Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Dossier:</span>
          <select
            value={activeReportId}
            onChange={(e) => setActiveReportId(e.target.value)}
            className="glass-input text-xs py-1.5 font-semibold text-brand-300"
          >
            {availableReports.map((r) => (
              <option key={r._id} value={r._id}>
                {r.companyName} {r.ticker ? `(${r.ticker})` : ''} — {r.overallSafetyScore}/100
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="panel-card p-4 sm:p-6 border-slate-800 flex-1 flex flex-col overflow-hidden relative">
        {loadingChat ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
            <p className="text-xs text-slate-400 font-mono">Loading dossier context...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-mono font-bold ${
                      isUser
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-800 border border-slate-700 text-brand-400'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 ${
                      isUser
                        ? 'bg-brand-600 text-white rounded-tr-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line'
                    }`}
                  >
                    <div>{msg.content}</div>

                    {/* Cited sources */}
                    {msg.citedSources?.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                        <span className="font-bold text-brand-400 uppercase tracking-wider block text-[10px]">
                          Cited Sources & Evidence:
                        </span>
                        {msg.citedSources.map((cs, i) => (
                          <div key={i} className="bg-slate-950/50 p-1.5 rounded border border-slate-800/80">
                            <span className="font-semibold text-slate-300">• {cs.title}</span> ({cs.type}):{' '}
                            <span className="italic">{cs.excerpt}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {sending && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-brand-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-500" />
                  <span>Cross-referencing evidence and synthesizing response...</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>
        )}

        {/* Suggested Quick Prompts */}
        <div className="pt-3 pb-2 border-t border-slate-800/80 shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 shrink-0">Suggestions:</span>
            {SUGGESTED_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(p)}
                disabled={sending}
                className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors disabled:opacity-50"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 pt-2 border-t border-slate-800/80 shrink-0"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={sending || loadingChat}
            placeholder={`Ask a question regarding ${activeReport?.companyName || 'this company'}...`}
            className="flex-1 glass-input text-xs sm:text-sm"
          />
          <button
            type="submit"
            disabled={sending || !inputQuery.trim() || loadingChat}
            className="bg-brand-600 hover:bg-brand-500 text-white p-2.5 rounded-xl shadow-md transition-all disabled:opacity-50 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

