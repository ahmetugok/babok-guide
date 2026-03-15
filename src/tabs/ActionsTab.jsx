import React from 'react';
import { ListChecks, Plus, Pencil, Trash2, Clock } from 'lucide-react';
import { isOverdue } from '../utils.js';

export function ActionsTab({ activeProject, openActionModal, deleteAction, quickUpdateActionStatus }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2"><ListChecks className="text-indigo-500 w-5 h-5" />Aksiyon Takip Listesi</h2>
          <p className="text-sm text-slate-400">{activeProject.actions.length} aksiyon · {activeProject.actions.filter(isOverdue).length} gecikmiş</p>
        </div>
        <button onClick={() => openActionModal()} className="bg-indigo-600/80 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-black/20"><Plus className="w-4 h-4" />Aksiyon Ekle</button>
      </div>
      {activeProject.actions.length === 0 ? (
        <div className="text-center py-20 glass-card p-8">
          <ListChecks className="w-14 h-14 mx-auto mb-4 text-violet-500/20 empty-state-icon" />
          <p className="text-slate-300 font-medium">Aksiyon listesi boş.</p>
          <p className="text-xs text-slate-400 mt-2">Yapılması gerekeni not düş, takipte kal.</p>
          <button onClick={() => openActionModal()} className="mt-4 text-xs text-violet-400 hover:text-violet-300 transition-colors">+ Aksiyon Ekle</button>
        </div>
      ) : (
        <div className="space-y-3">
          {activeProject.actions.map(a => {
            const od = isOverdue(a);
            return (
              <div key={a.id} className={`bg-white/5 rounded-xl border p-4 shadow-lg shadow-black/20 ${od ? 'border-l-4 border-l-rose-400 bg-rose-500/10' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <select value={a.status} onChange={e => quickUpdateActionStatus(a.id, e.target.value)} className={`text-xs font-bold px-2 py-1 rounded-full border cursor-pointer appearance-none text-center focus:outline-none focus:ring-2 focus:ring-indigo-300 ${a.status === 'Tamamlandı' ? 'bg-emerald-100 text-emerald-800 border-emerald-500/20' : a.status === 'Devam Ediyor' ? 'bg-blue-100 text-blue-800 border-blue-500/20' : 'bg-white/10 text-slate-300 border-white/10'}`} style={{ minWidth: 110 }}>
                        {['Bekliyor', 'Devam Ediyor', 'Tamamlandı'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {od && <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full border border-rose-500/20 flex items-center gap-1"><Clock className="w-3 h-3" />Gecikmiş</span>}
                    </div>
                    <p className={`font-semibold ${a.status === 'Tamamlandı' ? 'line-through text-slate-400' : 'text-slate-100'}`}>{a.title}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                      <span>Sorumlu: {a.owner || '—'} · Tarih: {a.dueDate || '—'}{a.source ? ` · Kaynak: ${a.source}` : ''}</span>
                      {a.linkedRequirementId && <span className="text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full">{a.linkedRequirementId}</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => openActionModal(a)} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-blue-600 transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => deleteAction(a.id)} className="p-1.5 hover:bg-rose-500/10 rounded-md text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                {a.notes && (
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <p className="text-xs text-slate-400"><span className="font-medium text-slate-400">Not:</span> {a.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
