import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Code, Eye, Copy, Download, Check, Scissors, Play, Terminal, Cpu } from 'lucide-react';

export default function CodePreview() {
  const { generatedCode, isGenerating } = useAppContext();
  const [activeTab, setActiveTab ] = useState('code');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isGenerating) {
      setActiveTab('code');
    } else if (generatedCode) {
      if (activeTab !== 'preview') {
         setTimeout(() => setActiveTab('preview'), 150);
      }
    }
  }, [isGenerating, generatedCode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "generated_code.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950/20 backdrop-blur-3xl overflow-hidden animate-entrance shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
      {/* Workspace Controls */}
      <div className="flex h-20 bg-white/5 border-b border-white/5 items-center justify-between px-10 backdrop-blur-3xl shadow-2xl relative">
        <div className="flex items-center space-x-3 bg-slate-950/80 border border-white/10 rounded-3xl p-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.8)] relative">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center space-x-3 px-6 py-3.5 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-700 relative z-10 ${
              activeTab === 'code' ? 'text-white' : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            <Terminal size={14} className={activeTab === 'code' ? 'text-cyan-400' : ''} />
            <span>{activeTab === 'code' ? 'Logic Module' : 'Logic'}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center space-x-3 px-6 py-3.5 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-700 relative z-10 ${
              activeTab === 'preview' ? 'text-white' : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            <Play size={14} className={activeTab === 'preview' ? 'text-fuchsia-400' : ''} />
            <span>{activeTab === 'preview' ? 'Visual Instance' : 'Visual'}</span>
          </button>
          
          {/* Neon Active Slider */}
          <div 
            className={`absolute h-[46px] transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) rounded-2xl border border-white/20`}
            style={{
              width: activeTab === 'code' ? '170px' : '170px',
              left: activeTab === 'code' ? '6px' : '182px',
              backgroundColor: activeTab === 'code' ? 'rgba(79, 70, 229, 0.6)' : 'rgba(192, 38, 211, 0.6)',
              boxShadow: activeTab === 'code' ? '0 0 30px rgba(79, 70, 229, 0.6)' : '0 0 30px rgba(192, 38, 211, 0.6)'
            }}
          ></div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleCopy}
            disabled={!generatedCode || copied}
            className={`group flex items-center space-x-3 px-6 py-3.5 rounded-2xl border border-white/10 transition-all duration-700 hover:scale-105 active:scale-90 shadow-2xl ${
              copied ? 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'text-slate-400 hover:text-white hover:bg-slate-900 border-white/5'
            }`}
          >
            {copied ? <Check size={18} /> : <Scissors size={18} className="group-hover:rotate-45 transition-transform" />}
            <span className="text-[10px] font-black uppercase tracking-widest">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          
          <button
            onClick={handleDownload}
            disabled={!generatedCode}
            className="flex items-center space-x-3 px-6 py-3.5 rounded-2xl border border-white/5 text-slate-400 hover:text-white hover:bg-slate-900 hover:scale-105 active:scale-90 transition-all duration-700 shadow-2xl bg-white/5"
          >
            <Download size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Dist</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'code' ? (
          <div className="h-full w-full p-10 overflow-auto bg-slate-950/40 custom-scrollbar animate-entrance shadow-inner">
            <div className="flex items-start space-x-10">
              <div className="shrink-0 flex flex-col font-mono text-[10px] text-slate-800 leading-[2.2] select-none text-right min-w-[40px] opacity-40">
                {Array.from({length: 100}).map((_, i) => <div key={i}>{i + 1}</div>)}
              </div>
              <pre className="text-sm font-mono text-cyan-50/90 leading-relaxed selection:bg-fuchsia-500/40 select-all whitespace-pre-wrap tracking-wide backdrop-blur-3xl pt-1">
                <code>{generatedCode || '// System ready. Initializing code synthesis neural network...\n// Error code 0: No prompt detected.'}</code>
              </pre>
            </div>
            
            {/* Immersive Dynamic Background Glows */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/5 blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[180px] pointer-events-none"></div>
          </div>
        ) : (
          <div className="h-full w-full bg-white relative animate-entrance group shadow-[0_0_100px_rgba(0,0,0,1)]">
            <iframe
              srcDoc={`
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Inter:wght@400;700&display=swap" rel="stylesheet">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                    <style>
                      * { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                      ::-webkit-scrollbar { width: 4px; }
                      ::-webkit-scrollbar-track { background: transparent; }
                      ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                      body { font-family: 'Outfit', sans-serif; }
                    </style>
                  </head>
                  <body>
                    ${generatedCode.includes('<!DOCTYPE html>') || generatedCode.includes('<body>') ? generatedCode : `<div id="root">${generatedCode}</div>`}
                  </body>
                </html>
              `}
              title="Build Instance"
              className="h-full w-full border-none"
              sandbox="allow-scripts allow-popups allow-modals"
            ></iframe>
            
            {/* High-Tech Info Tag */}
            <div className="absolute top-6 right-6 bg-slate-950/90 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/10 text-[10px] font-black text-white shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none flex items-center space-x-3 scale-90 group-hover:scale-100">
              <Cpu size={12} className="text-cyan-400 animate-spin-slow" />
              <span className="uppercase tracking-[0.2em] italic">Live Build Synchronized</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
