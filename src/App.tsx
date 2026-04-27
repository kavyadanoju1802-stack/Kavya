import React from 'react';
import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="flex flex-col h-screen w-full relative bg-[#050505] text-white overflow-hidden font-sans">
      <div className="absolute inset-0 scanline z-50"></div>
      
      <header className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-white/10 glass-panel z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#39FF14] animate-pulse shadow-[0_0_10px_#39FF14]"></div>
          <span className="text-xl font-black tracking-tighter italic hidden sm:inline">NEO-SYNTH <span className="text-[#39FF14]">V1.0</span></span>
        </div>
        <div className="flex gap-4 md:gap-12 items-center">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-white/50 mono">Target Score</span>
            <span className="text-xl font-bold mono text-[#00FFFF]">02,450</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden p-4 md:p-6 gap-6 z-10">
        <section className="flex-1 relative flex items-center justify-center order-1 lg:order-2">
          <SnakeGame />
        </section>

        <section className="w-full lg:w-72 flex flex-col gap-4 order-2 lg:order-3">
          <MusicPlayer />
          
          <div className="glass-panel rounded-2xl p-4 flex-1 flex flex-col gap-2 justify-center hidden lg:flex shrink-0 min-h-[100px]">
             <div className="flex justify-between text-[10px] uppercase text-white/40 mb-2">
                <span className="mono">Game Speed</span>
                <span className="mono">1.2x</span>
             </div>
             <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mb-4">
                <div className="bg-[#00FFFF] h-full w-3/4 shadow-[0_0_10px_#00FFFF]"></div>
             </div>
             
             <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1 mono mt-2">Game Controls</p>
             <div className="space-y-1 text-xs text-white/70 mono">
                <p><span className="text-white font-bold">Arrows/WASD</span> : Move</p>
                <p><span className="text-white font-bold">Spacebar</span> : Pause</p>
             </div>
          </div>
        </section>
      </main>

      <footer className="h-12 px-4 md:px-8 flex items-center justify-between glass-panel border-t border-white/10 shrink-0 z-10">
        <div className="flex gap-4 text-[10px] mono text-white/30 uppercase">
          <span className="hidden md:inline">CPU: 42%</span>
          <span className="hidden md:inline">MEM: 1.2GB</span>
          <span>LATENCY: 12ms</span>
        </div>
        <div className="text-[10px] mono text-[#39FF14]">SYSTEM STATUS: OPTIMAL</div>
      </footer>
    </div>
  );
}
