import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Trash2, StickyNote, ClipboardCopy, X, Play, Square } from 'lucide-react';
import { NOTE_TYPE_COLORS } from '../constants/index.js';

export function MeetingsTab({
  activeProject,
  selectedMeeting,
  setSelectedMeeting,
  setShowMeetingModal,
  deleteMeeting,
  newNoteType,
  setNewNoteType,
  newNoteText,
  setNewNoteText,
  addNote,
  deleteNote,
  generateMoM,
  setActiveTab,
  updateActive,
}) {
  const [runningId, setRunningId] = useState(null);
  const [elapsed, setElapsed]     = useState(0);

  useEffect(() => {
    if (!runningId) return;
    const iv = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(iv);
  }, [runningId]);

  function toggleTimer(e, meetingId) {
    e.stopPropagation();
    if (runningId === meetingId) {
      const minutes = Math.round(elapsed / 60);
      if (minutes > 0 && updateActive) {
        updateActive(p => ({
          ...p,
          meetings: p.meetings.map(m =>
            m.id === meetingId ? { ...m, duration: (m.duration || 0) + minutes } : m
          ),
        }));
      }
      setRunningId(null);
      setElapsed(0);
    } else {
      setRunningId(meetingId);
      setElapsed(0);
    }
  }

  const pad = n => String(n).padStart(2, '0');
  const liveDisplay = `⏱ ${pad(Math.floor(elapsed / 3600))}:${pad(Math.floor((elapsed % 3600) / 60))}:${pad(elapsed % 60)}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2"><MessageSquare className="text-violet-500 w-5 h-5" />Toplantı Notları</h2>
          <p className="text-sm text-slate-400">{activeProject.meetings.length} toplantı kaydı</p>
        </div>
        <button onClick={() => setShowMeetingModal(true)} className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-black/20"><Plus className="w-4 h-4" />Yeni Toplantı</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          {activeProject.meetings.length === 0 && <div className="text-center py-12 text-slate-400"><MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" /><p className="text-sm">Henüz toplantı yok.</p></div>}
          {activeProject.meetings.map(m => (
            <div key={m.id} onClick={() => setSelectedMeeting(m)} className={`p-3 rounded-xl border cursor-pointer transition-all ${runningId === m.id ? 'border-l-4 border-l-rose-400 bg-rose-500/5' : selectedMeeting?.id === m.id ? 'border-violet-400 bg-violet-500/10 shadow-lg shadow-black/20' : 'border-white/10 bg-white/5 hover:border-violet-500/20 hover:shadow-lg shadow-black/20'}`}>
              <div className="flex items-start justify-between gap-1">
                <p className="font-semibold text-sm text-slate-100 truncate flex-1">{m.topic}</p>
                {runningId === m.id && <span className="text-[10px] font-mono text-rose-300 animate-pulse shrink-0">{liveDisplay}</span>}
              </div>
              <div className="flex items-center justify-between mt-1.5 gap-1">
                <p className="text-xs text-slate-400">{m.date}{(m.duration || 0) > 0 ? ` · ${m.duration} dk` : ''}</p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={e => toggleTimer(e, m.id)}
                    className={`flex items-center gap-1 text-xs rounded-lg px-2 py-1 transition-colors ${runningId === m.id ? 'bg-rose-500/15 text-rose-600 border border-rose-200/30 animate-pulse' : 'bg-emerald-500/15 text-emerald-700 border border-emerald-200/30 hover:bg-emerald-500/25'}`}
                  >
                    {runningId === m.id ? <><Square className="w-2.5 h-2.5" />■ {Math.floor(elapsed / 60)} dk</> : <><Play className="w-2.5 h-2.5" />▶ Süre Başlat</>}
                  </button>
                  <span className="text-xs text-slate-400">{m.notes.length} not</span>
                  <button onClick={e => { e.stopPropagation(); deleteMeeting(m.id); }} className="p-0.5 hover:text-rose-500 text-slate-300 transition-colors"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-2">
          {!selectedMeeting ? (
            <div className="text-center py-16 text-slate-400 border border-dashed border-white/10 rounded-xl"><StickyNote className="w-8 h-8 mx-auto mb-2 opacity-30" /><p className="text-sm">Sol taraftan bir toplantı seçin.</p></div>
          ) : (
            <div className="bg-white/5 rounded-xl border border-white/10 shadow-lg shadow-black/20 p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div><h3 className="font-bold text-slate-100">{selectedMeeting.topic}</h3><p className="text-xs text-slate-400 mt-0.5">{selectedMeeting.date} · {selectedMeeting.attendees}</p></div>
                <button onClick={() => generateMoM(selectedMeeting)} className="text-xs bg-white/10 hover:bg-slate-200 text-slate-300 px-2 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"><ClipboardCopy className="w-3.5 h-3.5" />MoM Oluştur</button>
              </div>
              <div className="flex gap-2">
                <select value={newNoteType} onChange={e => setNewNoteType(e.target.value)} className="text-sm border border-white/10 rounded-lg px-3 py-2.5 bg-white/5 focus:outline-none focus:ring-1 focus:ring-violet-400 w-36">
                  <option>Karar</option><option>Açık Nokta</option><option>Aksiyon</option><option>Gereksinim</option><option>Varsayim</option>
                </select>
                <textarea value={newNoteText} onChange={e => setNewNoteText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addNote(); } }} placeholder="Not ekle ve Enter'a bas... (Shift+Enter: yeni satır)" rows="2" className="flex-1 text-sm border border-white/10 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-violet-400 resize-none" />
                <button onClick={addNote} className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-lg text-sm transition-colors self-end"><Plus className="w-4 h-4" /></button>
              </div>
              {(() => {
                const mReqs = (activeProject.requirements || []).filter(r => r.sourceMeetingId === selectedMeeting.id);
                const mActions = (activeProject.actions || []).filter(a => a.source === selectedMeeting.topic);
                const mAss = (activeProject.assumptions || []).filter(a => a.sourceMeetingId === selectedMeeting.id);
                if (mReqs.length + mActions.length + mAss.length === 0) return null;
                return (
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="text-slate-500">Bu toplantidan uretilenler:</span>
                    {mReqs.length > 0 && <button onClick={() => setActiveTab('requirements')} className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-full hover:bg-teal-500/20 transition-colors">{mReqs.length} gereksinim</button>}
                    {mActions.length > 0 && <button onClick={() => setActiveTab('actions')} className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full hover:bg-indigo-500/20 transition-colors">{mActions.length} aksiyon</button>}
                    {mAss.length > 0 && <button onClick={() => setActiveTab('assumptions')} className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full hover:bg-amber-500/20 transition-colors">{mAss.length} varsayim</button>}
                  </div>
                );
              })()}
              <div className="space-y-2 max-h-[420px] overflow-y-auto">
                {selectedMeeting.notes.length === 0 && <p className="text-xs text-slate-400 text-center py-4">Henüz not yok. Yukarıdan ekleyin.</p>}
                {selectedMeeting.notes.map(n => (
                  <div key={n.id} className={`flex items-start gap-2 p-2.5 rounded-lg border text-sm ${NOTE_TYPE_COLORS[n.type]}`}>
                    <span className="text-xs font-bold whitespace-nowrap shrink-0 mt-0.5">{n.type}</span>
                    <span className="flex-1">{n.text}</span>
                    <button onClick={() => deleteNote(n.id)} className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
