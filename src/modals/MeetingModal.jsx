import React, { useState, useEffect } from 'react';
import { MessageSquare, Play, Square, Clock } from 'lucide-react';
import { useProjectStore } from '../store/projectStore.js';
import { useUIStore, DEFAULT_MEETING_FORM } from '../store/uiStore.js';

export function MeetingModal() {
  const saveMeeting     = useProjectStore((s) => s.saveMeeting);
  const closeMeetingModal = useUIStore((s) => s.closeMeetingModal);

  const [form, setForm] = useState({ ...DEFAULT_MEETING_FORM });
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsed, setElapsed]           = useState(0);

  useEffect(() => {
    if (!timerRunning) return;
    const iv = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(iv);
  }, [timerRunning]);

  function toggleTimer() {
    if (timerRunning) {
      const added = Math.round(elapsed / 60);
      setForm(f => ({ ...f, duration: (f.duration || 0) + added }));
      setElapsed(0);
      setTimerRunning(false);
    } else {
      setElapsed(0);
      setTimerRunning(true);
    }
  }

  const onSave = () => {
    if (!form.topic.trim()) return;
    saveMeeting(form);
    closeMeetingModal();
  };

  const pad = n => String(n).padStart(2, '0');
  const elapsedDisplay = `${pad(Math.floor(elapsed / 60))}:${pad(elapsed % 60)}`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel p-6 shadow-2xl max-w-md w-full">
        <h3 className="font-bold text-lg text-slate-100 mb-4 flex items-center gap-2"><MessageSquare className="text-violet-500 w-5 h-5" />Yeni Toplantı</h3>
        <div className="space-y-3">
          <input value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} placeholder="Toplantı konusu*" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
          <input value={form.attendees} onChange={e => setForm({ ...form, attendees: e.target.value })} placeholder="Katılımcılar (ör. Ahmet, Ayşe, Mehmet)" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none" />

          {/* Süre girişi + canlı timer */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-3 space-y-2">
            <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />Toplantı Süresi</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={form.duration || 0}
                onChange={e => setForm({ ...form, duration: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-24 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none text-center"
              />
              <span className="text-xs text-slate-500">dakika</span>
              <div className="flex-1" />
              {timerRunning && (
                <span className="font-mono text-sm text-violet-300 animate-pulse">{elapsedDisplay}</span>
              )}
              <button
                type="button"
                onClick={toggleTimer}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${timerRunning ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30' : 'bg-violet-500/20 text-violet-300 hover:bg-violet-500/30'}`}
              >
                {timerRunning ? <><Square className="w-3 h-3" />Durdur</> : <><Play className="w-3 h-3" />Başlat</>}
              </button>
            </div>
            {timerRunning && <p className="text-[10px] text-slate-500">Timer durdurulunca süre otomatik eklenir.</p>}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={closeMeetingModal} className="px-4 py-2 text-sm text-slate-400 hover:bg-white/10 rounded-md">İptal</button>
          <button onClick={onSave} className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-md font-medium">Oluştur</button>
        </div>
      </div>
    </div>
  );
}
