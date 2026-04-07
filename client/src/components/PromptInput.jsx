import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Send, Mic, MicOff, Sparkles, User, Bot, Loader2, Cpu, MessageSquare, Terminal } from 'lucide-react';

export default function PromptInput() {
  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { generateCode, isGenerating, chatHistory } = useAppContext();
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isGenerating]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    generateCode(prompt);
    setPrompt('');
  };

  const handleMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser doesn't support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
      generateCode(transcript);
    };

    recognition.start();
  };

  const suggestions = [
    "Vibrant login component",
    "Cyber pricing table",
    "Interactive glass dashboard",
    "Animated hero section"
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950/20 backdrop-blur-3xl overflow-hidden animate-entrance relative border-r border-white/5 shadow-2xl">
      {/* Session Header */}
      <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-3xl shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="bg-violet-600/20 p-2.5 rounded-2xl border border-violet-500/30 shadow-inner">
            <MessageSquare className="text-violet-400" size={18} />
          </div>
          <div>
            <span className="text-[11px] font-black tracking-[0.2em] text-slate-200 uppercase">Core Command</span>
            <p className="text-[9px] text-fuchsia-400 font-black uppercase tracking-widest mt-0.5">Neural Link Active</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-slate-950/60 px-3 py-1.5 rounded-full border border-white/5">
          <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Sync Ready</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 scroll-smooth custom-scrollbar">
        <div className="animate-entrance chatbot-bubble-ai flex items-start space-x-5 bg-slate-900 shadow-[0_15px_30px_rgba(0,0,0,0.4)] border border-white/10 group rounded-3xl">
          <div className="bg-violet-600/20 p-3 rounded-2xl text-violet-400 border border-violet-500/30 group-hover:rotate-12 transition-transform duration-700 shadow-inner">
            <Bot size={24} />
          </div>
          <div className="space-y-1">
            <p className="text-sm leading-relaxed font-black opacity-100 text-white tracking-tight">Initiating protocol. Awaiting architect input for high-performance generation.</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 flex items-center space-x-1">
              <Terminal size={10} /> <span>System Terminal V3.0</span>
            </p>
          </div>
        </div>

        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-3 animate-entrance`}>
            <div className={msg.role === 'user' ? 'chatbot-bubble-user' : 'chatbot-bubble-ai'}>
              <p className="text-sm font-bold opacity-100 leading-relaxed tracking-tight">{msg.content}</p>
            </div>
            <div className={`flex items-center space-x-2 px-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <span className={`text-[10px] font-black uppercase tracking-tighter ${msg.role === 'user' ? 'text-fuchsia-400' : 'text-cyan-400'}`}>{msg.role}</span>
              <span className="h-0.5 w-0.5 bg-slate-700 rounded-full"></span>
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">Real-time</span>
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="chatbot-bubble-ai flex items-center space-x-5 animate-pulse bg-slate-900 border border-violet-500/40 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
            <div className="bg-violet-500/10 p-3 rounded-2xl shadow-inner">
              <Loader2 className="animate-spin text-fuchsia-400" size={24} />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-violet-200 font-black uppercase tracking-[0.2em] block">Synthesized Core Logic</span>
              <div className="flex space-x-1.5 mt-2">
                {[0, 1, 2, 3].map(i => <div key={i} className="h-1.5 w-1.5 bg-violet-500 rounded-full animate-bounce shadow-[0_0_8px_rgba(139,92,246,0.8)]" style={{animationDelay: `${i*0.2}s`}}></div>)}
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-8 border-t border-white/5 bg-slate-950/40 backdrop-blur-3xl shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
        <div className="flex flex-wrap gap-3 mb-6">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => { setPrompt(s); generateCode(s); }}
              className="text-[10px] font-black px-5 py-2.5 rounded-2xl border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-500 active:scale-95 group flex items-center space-x-2.5 shadow-xl"
            >
              <Cpu size={14} className="opacity-40 group-hover:opacity-100 group-hover:rotate-90 transition-all text-fuchsia-400" />
              <span>{s}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="relative flex items-center group animate-entrance">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 rounded-3xl blur-[10px] opacity-0 group-focus-within:opacity-20 transition duration-1000"></div>
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Command input..."
            className="w-full glass-input rounded-2xl pl-6 pr-32 py-5 text-sm text-white placeholder:text-slate-700 font-black tracking-tight relative shadow-2xl"
            disabled={isGenerating}
          />
          <div className="absolute right-4 flex items-center space-x-3 z-10">
            <button
              type="button"
              onClick={handleMic}
              className={`p-3 rounded-2xl border transition-all duration-700 ${isListening ? 'bg-red-500 border-red-400 text-white shadow-[0_0_30px_rgba(239,68,68,0.6)] animate-pulse' : 'text-slate-500 border-white/5 hover:text-white hover:bg-white/10 hover:border-white/20'}`}
              title="Mic Protocol"
            >
              {isListening ? <MicOff size={22} /> : <Mic size={22} />}
            </button>
            <button
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              className={`p-3 rounded-2xl border transition-all duration-700 ${prompt.trim() && !isGenerating ? 'bg-violet-600 border-violet-400 text-white shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:scale-110 active:scale-90' : 'text-slate-800 border-white/10'}`}
            >
              <Send size={22} className={prompt.trim() && !isGenerating ? 'rotate-[-15deg]' : ''} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
