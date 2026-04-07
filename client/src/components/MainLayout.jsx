import React from 'react';
import Navbar from './Navbar';
import PromptInput from './PromptInput';
import CodePreview from './CodePreview';

export default function MainLayout() {
  return (
    <div className="flex flex-col h-screen h-[100dvh] bg-[#020617] overflow-hidden relative selection:bg-indigo-500/30">
      {/* Dynamic Background Mesh */}
      <div className="mesh-bg"></div>
      
      {/* Navigation */}
      <Navbar />
      
      {/* Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
        {/* Left Side: Chat Interface */}
        <div className="w-full lg:w-[400px] xl:w-[480px] flex shrink-0 border-b lg:border-b-0 lg:border-r border-white/5 backdrop-blur-3xl z-10 transition-all duration-300">
          <PromptInput />
        </div>
        
        {/* Right Side: Code & Preview */}
        <div className="flex-1 flex bg-transparent relative z-0">
          <CodePreview />
        </div>
      </div>
      
      {/* Subtle Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent blur-sm"></div>
    </div>
  );
}
