import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, ChevronDown, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const { technology, setTechnology } = useAppContext();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const technologies = [
    { id: 'HTML + CSS + JS', label: 'HTML + CSS + JS', color: 'text-cyan-400' },
    { id: 'React + Tailwind', label: 'React + Tailwind', color: 'text-violet-400' },
    { id: 'HTML + Bootstrap', label: 'HTML + Bootstrap', color: 'text-fuchsia-400' },
    { id: 'Vue / Next.js', label: 'Vue / Next.js', color: 'text-emerald-400' },
  ];

  return (
    <nav className="h-16 border-b border-white/5 bg-slate-950/20 backdrop-blur-3xl flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center space-x-5">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 rounded-xl blur-[8px] opacity-20 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative bg-slate-950 p-2.5 rounded-2xl border border-white/10 shadow-2xl">
            <Sparkles className="text-violet-400" size={24} />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight vibrant-gradient-text uppercase">
            AI Code Generator <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full ml-1 normal-case tracking-normal border border-indigo-500/30">PRO</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-8">
        <div className="relative group">
          <button className="flex items-center space-x-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-200 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all duration-500 shadow-2xl">
            <Zap size={14} className="text-cyan-400" />
            <span>{technology}</span>
            <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-700 opacity-30" />
          </button>
          
          <div className="absolute right-0 mt-4 w-72 glass-card rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 z-50 overflow-hidden border border-white/10 p-2 shadow-[0_30px_60px_rgba(0,0,0,1)]">
            <div className="px-4 py-3 mb-2 bg-white/5 rounded-xl border border-white/5">
              <p className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest flex items-center justify-between">
                <span>Architecture Protocol</span>
                <ShieldCheck size={12} />
              </p>
            </div>
            {technologies.map((tech) => (
              <button
                key={tech.id}
                onClick={() => setTechnology(tech.id)}
                className={`w-full flex items-center space-x-4 px-5 py-3.5 text-xs font-bold rounded-xl transition-all ${
                  technology === tech.id 
                    ? 'bg-violet-600/30 text-white border border-violet-500/40 shadow-xl' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className={`h-2 w-2 rounded-full shadow-[0_0_8px_currentColor] ${tech.color.replace('text', 'bg')}`}></div>
                <span>{tech.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="group relative h-12 w-12 rounded-2xl border border-white/10 p-0.5 hover:border-violet-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] bg-slate-900/40"
          >
            <div className="h-full w-full rounded-2xl bg-slate-950 flex items-center justify-center text-violet-400 transition-colors">
              <User size={24} className="group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-fuchsia-500 border-2 border-slate-950 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.8)] animate-pulse"></div>
          </button>

          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
              <div className="absolute right-0 mt-5 w-60 glass-card rounded-2xl py-3 z-50 animate-entrance border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,1)] p-2">
                <div className="px-5 py-4 border-b border-white/5 mb-2 bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 rounded-xl border border-white/5 shadow-inner">
                  <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Developer Authenticated</p>
                  <p className="text-xs text-white font-bold truncate opacity-90">{user?.email}</p>
                </div>
                <button 
                  onClick={logout}
                  className="w-full flex items-center space-x-4 px-5 py-4 text-xs font-black uppercase tracking-widest text-red-100 hover:bg-red-500/20 rounded-xl transition-all group"
                >
                  <LogOut size={16} className="text-red-500 group-hover:rotate-45 transition-transform" />
                  <span>Terminate Session</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
