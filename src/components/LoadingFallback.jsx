import React from 'react';

export function TabFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 select-none">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
        <div className="absolute inset-[6px] rounded-full border border-transparent border-t-cyan-300/50 animate-spin" style={{ animationDuration: '0.6s', animationDirection: 'reverse' }} />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs font-bold tracking-widest uppercase neon-cyan opacity-70">Yükleniyor</span>
        <div className="flex gap-1 mt-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-1 h-1 rounded-full bg-cyan-400/60 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ModalFallback() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-panel rounded-2xl p-8 flex flex-col items-center gap-4 border border-white/10 shadow-2xl">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
        </div>
        <span className="text-xs font-bold tracking-widest uppercase neon-cyan opacity-70">Yükleniyor</span>
      </div>
    </div>
  );
}
