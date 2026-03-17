import React, { useState, useEffect } from 'react';
import { ListChecks, Play, Square, Clock } from 'lucide-react';
import { EntitySelector } from '../components/EntitySelector.jsx';

export function ActionModal({ form, setForm, onSave, onClose, editingAction, activeProject }) {
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
      setForm({ ...form, duration: (form.duration || 0) + added });
      setElapsed(0);
      setTimerRunning(false);
    } else {
      setElapsed(0);
      setTimerRunning(true);
    }
  }

  const pad = n => String(n).padStart(2, '0');
  const elapsedDisplay = `${pad(Math.floor(elapsed / 60))}:${pad(elapsed % 60)}`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel p-6 shadow-2xl max-w-md w-full">
        <h3 className="font-bold text-lg text-slate-100 mb-4 flex items-center gap-2"><ListChecks className="text-indigo-500 w-5 h-5" />{editingAction ? 'Aksiyonu Düzenle' : 'Yeni Aksiyon'}</h3>
        <div className="space-y-3">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Aksiyon başlığı*" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} placeholder="Sorumlu kişi" className="border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none" />
            <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          </div>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none">
            {['Bekliyor', 'Devam Ediyor', 'Tamamlandı'].map(s => <option key={s}>{s}</option>)}
          </select>
          <input value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} placeholder="Kaynak (ör. Toplantı adı)" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          <div><label className="text-xs text-slate-400 block mb-1">Bağlı Toplantı</label>
            <EntitySelector entityType="meeting" activeProject={activeProject} value={form.sourceMeetingId || ''} onChange={id => setForm({ ...form, sourceMeetingId: id })} placeholder="Toplantı seçin…" />
          </div>
          <div><label className="text-xs text-slate-400 block mb-1">Bağlı Gereksinim</label>
            <EntitySelector entityType="requirement" activeProject={activeProject} value={form.linkedRequirementId || ''} onChange={id => setForm({ ...form, linkedRequirementId: id })} placeholder="Gereksinim seçin…" />
          </div>
          <textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Not / Açıklama (opsiyonel)" rows="2" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />

          {/* Süre girişi + canlı timer */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-3 space-y-2">
            <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />Harcanan Süre</label>
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
                <span className="font-mono text-sm text-indigo-300 animate-pulse">{elapsedDisplay}</span>
              )}
              <button
                type="button"
                onClick={toggleTimer}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${timerRunning ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30' : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30'}`}
              >
                {timerRunning ? <><Square className="w-3 h-3" />Durdur</> : <><Play className="w-3 h-3" />Başlat</>}
              </button>
            </div>
            {timerRunning && <p className="text-[10px] text-slate-500">Timer durdurulunca süre otomatik eklenir.</p>}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:bg-white/10 rounded-md">İptal</button>
          <button onClick={onSave} className="px-4 py-2 text-sm bg-indigo-600/80 hover:bg-indigo-500 text-white rounded-md font-medium">Kaydet</button>
        </div>
      </div>
    </div>
  );
}
