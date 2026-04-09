import React from 'react';
import { AlertTriangle, Plus, Pencil, Trash2, ArrowUpRight } from 'lucide-react';
import { getRiskLevel } from '../utils.js';
import { PROB_LABELS, IMPACT_LABELS } from '../constants/index.js';
import { useProjectStore, selectActiveProject } from '../store/projectStore.js';
import { useUIStore } from '../store/uiStore.js';

export function RisksTab() {
  const activeProject = useProjectStore(selectActiveProject);
  const openModal  = useUIStore((s) => s.openModal);
  const deleteRisk = useProjectStore((s) => s.deleteRisk);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2"><AlertTriangle className="text-rose-500 w-5 h-5" />Risk Kayıt Defteri</h2>
          <p className="text-sm text-slate-400">{activeProject.risks.length} risk kayıtlı · {activeProject.risks.filter(r => getRiskLevel(r.probability, r.impact).label === 'Kritik').length} kritik</p>
        </div>
        <button onClick={() => openModal('risk')} className="bg-rose-600/80 hover:bg-rose-500 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-black/20"><Plus className="w-4 h-4" />Risk Ekle</button>
      </div>
      {activeProject.risks.length === 0 ? (
        <div className="text-center py-20 glass-card p-8">
          <AlertTriangle className="w-14 h-14 mx-auto mb-4 text-rose-500/20 empty-state-icon" />
          <p className="text-slate-300 font-medium">Risk radarı temiz görünüyor.</p>
          <p className="text-xs text-slate-400 mt-2">Sahada her şey yolunda mı? İlk riski tespit et.</p>
          <button onClick={() => openModal('risk')} className="mt-4 text-xs text-rose-400 hover:text-rose-300 transition-colors">+ Risk Ekle</button>
        </div>
      ) : (
        <div className="space-y-3">
          {activeProject.risks.map(r => {
            const lvl = getRiskLevel(r.probability, r.impact);
            return (
              <div key={r.id} className={`bg-white/5 rounded-xl border p-4 shadow-lg shadow-black/20 flex items-start gap-4 ${lvl.cls.includes('rose') ? 'border-l-4 border-l-rose-400' : lvl.cls.includes('amber') ? 'border-l-4 border-l-amber-400' : 'border-l-4 border-l-emerald-400'}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${lvl.cls}`}>{lvl.label}</span>
                    <span className="text-xs bg-white/10 text-slate-400 px-2 py-0.5 rounded-full">{r.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === 'Açık' ? 'bg-rose-500/10 text-rose-700' : r.status === 'Azaltıldı' ? 'bg-amber-500/10 text-amber-700' : 'bg-emerald-500/10 text-emerald-700'}`}>{r.status}</span>
                  </div>
                  <p className="font-semibold text-slate-100">{r.title}</p>
                  {r.mitigation && <p className="text-xs text-slate-400 mt-1">Azaltma: {r.mitigation}</p>}
                  <p className="text-xs text-slate-400 mt-1">Sorumlu: {r.owner || '—'} · Olas.: {PROB_LABELS[r.probability]} · Etki: {IMPACT_LABELS[r.impact]} · Skor: {r.probability * r.impact}</p>
                  {(r.linkedRequirementId || r.linkedAssumptionId) && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {r.linkedRequirementId && <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">REQ bagl.</span>}
                      {r.linkedAssumptionId  && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Vars. bagl.</span>}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openModal('linkCard', { entityType: 'risk', entityId: r.id })} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-cyan-400 transition-colors" title="Baglantilar"><ArrowUpRight className="w-4 h-4" /></button>
                  <button onClick={() => openModal('risk', { editingId: r.id })} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-blue-600 transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => deleteRisk(r.id)} className="p-1.5 hover:bg-rose-500/10 rounded-md text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
