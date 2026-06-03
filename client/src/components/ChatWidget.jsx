import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiMessageCircle, FiSend, FiX, FiZap } from 'react-icons/fi';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

/* ─── Typing Indicator ──────────────────────────────────── */
const TypingBubble = () => (
  <div className="flex items-end gap-2 max-w-[80%]">
    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow">
      <FiZap className="text-white text-xs" />
    </div>
    <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-slate-100 dark:bg-slate-800 flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  </div>
);

/* ─── Message Bubble ────────────────────────────────────── */
const MessageBubble = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'} max-w-[85%] ${isUser ? 'ml-auto' : 'mr-auto'}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow">
          <FiZap className="text-white text-xs" />
        </div>
      )}
      <div
        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm shadow-md shadow-blue-600/20'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm'
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════ */
const ChatWidget = () => {
  const { currentUser } = useAuth();

  const [open,    setOpen]    = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread,  setUnread]  = useState(0);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hi there! 👋 I'm JobBuddy AI.\n\nI can help you with:\n• Resume tips & ATS optimization\n• Career guidance & role recommendations\n• Interview prep & practice questions\n• Skill gap analysis\n\nWhat can I help you with today?`
    }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  /* Auto-scroll */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (open) {
      scrollToBottom();
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages, scrollToBottom]);

  /* Send message */
  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMsg = { role: 'user', text: message.trim() };
    setMessages(prev => [...prev, userMsg]);
    const currentMessage = message.trim();
    setMessage('');
    setLoading(true);

    try {
      // Build context-aware payload
      const contextPayload = {
        message: currentMessage,
        ...(currentUser && {
          skills:     currentUser.skills     || [],
          targetRole: currentUser.preferredRole || '',
        }),
      };

      const res = await API.post('/ai/chat', contextPayload);

      const aiMsg = { role: 'assistant', text: res.data.reply || 'Sorry, I could not generate a response.' };
      setMessages(prev => [...prev, aiMsg]);

      // Badge if window is closed
      if (!open) setUnread(prev => prev + 1);

    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: 'Sorry, something went wrong. Please try again in a moment.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setUnread(0);
  };

  return (
    <>
      {/* ── FLOATING ACTION BUTTON ─────────────────────────────── */}
      {!open && (
        <button
          id="chat-widget-fab"
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 shadow-2xl shadow-blue-600/40 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Open JobBuddy AI Chat"
        >
          <FiMessageCircle className="text-2xl" />
          {/* Badge */}
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce">
              {unread}
            </span>
          )}
        </button>
      )}

      {/* ── CHAT WINDOW ───────────────────────────────────────── */}
      {open && (
        <div
          id="chat-widget-panel"
          className="fixed bottom-6 right-6 z-50 w-96 h-[520px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 shadow-2xl shadow-slate-900/20 flex flex-col"
          style={{ animation: 'slideUp 0.25s ease-out' }}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <FiZap className="text-white text-base" />
              </div>
              <div>
                <h2 className="font-black text-white text-sm">JobBuddy AI Assistant</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-blue-100 text-[11px] font-semibold">
                    {loading ? 'Thinking...' : 'Online — Ready to help'}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition"
            >
              <FiX className="text-base" />
            </button>
          </div>

          {/* MESSAGES AREA */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-[#FAFBFF] dark:bg-slate-950">
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} msg={msg} />
            ))}
            {loading && <TypingBubble />}
            <div ref={messagesEndRef} />
          </div>

          {/* CONTEXT STRIP (shows user's profile context if logged in) */}
          {currentUser?.isOnboarded && (
            <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800/30 flex items-center gap-2 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold truncate">
                Context: {currentUser.preferredRole || 'General'} · {(currentUser.skills || []).length} skills
              </p>
            </div>
          )}

          {/* INPUT BAR */}
          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-end gap-3 shrink-0">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your career, resume, interviews..."
              rows={1}
              className="flex-1 resize-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-slate-900 dark:text-white placeholder:text-slate-400 transition max-h-24 overflow-y-auto"
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim() || loading}
              className="w-11 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition shrink-0"
            >
              <FiSend className="text-sm" />
            </button>
          </div>
        </div>
      )}

      {/* Slide-up animation keyframes injected once */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </>
  );
};

export default ChatWidget;
