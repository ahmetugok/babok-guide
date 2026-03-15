import React from 'react';
import { Lightbulb, Plus, Pencil, Trash2 } from 'lucide-react';

export function AssumptionsTab({ activeProject, openAssumptionModal, deleteAssumption }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2"><Lightbulb className="text-amber-400 w-5 h-5" />Varsayimlar ve Kisitlar</h2>
          <p className="text-sm text-slate-400">{(activeProject.assumptions || []).length} kayit · {(activeProject.assumptions || []).filter(a => a.validationStatus === 'Dogrulanmadi').length} dogrulanmamis</p>
        </div>
        <button onClick={() => openAssumptionModal()} className="bg-amber-600/80 hover:bg-amber-500 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-black/20"><Plus className="w-4 h-4" />Varsayim Ekle</button>
      </div>
      {(activeProject.assumptions || []).length === 0 ? (
        <div className="text-center py-20 glass-card p-8">
          <Lightbulb className="w-14 h-14 mx-auto mb-4 text-amber-400/20 empty-state-icon" />
          <p className="text-slate-300 font-medium">Henuz varsayim veya kisit eklenmemis.</p>
          <p className="text-xs text-slate-400 mt-2">Projenin dayandigi varsayimlari ve kisitlari belgele.</p>
          <button onClick={() => openAssumptionModal()} className="mt-4 text-xs text-amber-400 hover:text-amber-300 transition-colors">+ Varsayim Ekle</button>
        </div>
      ) : (
        <div className="space-y-3">
          {(activeProject.assumptions || []).map(a => (
            <div key={a.id} className={`bg-white/5 rounded-xl border p-4 shadow-lg shadow-black/20 flex items-start gap-4 ${a.validationStatus === 'Curutuldu' ? 'border-l-4 border-l-rose-400' : 'border-l-4 border-l-amber-400/40'}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${a.type === 'Kisit' ? 'text-rose-700 bg-rose-100 border-rose-500/30' : 'text-amber-700 bg-amber-100 border-amber-500/30'}`}>{a.type === 'Kisit' ? 'Kisit' : 'Varsayim'}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${a.validationStatus === 'Dogrulandi' ? 'bg-emerald-500/10 text-emerald-400' : a.validationStatus === 'Curutuldu' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}`}>{a.validationStatus}</span>
                  <span className="text-xs bg-white/10 text-slate-400 px-2 py-0.5 rounded-full">{a.category}</span>
                </div>
                <p className="font-semibold text-slate-100">{a.title}</p>
                {a.content && <p className="text-xs text-slate-400 mt-1">{a.content}</p>}
                <p className="text-xs text-slate-500 mt-1">Sorumlu: {a.ownerId || '—'}{a.validationDate ? ' · Tarih: ' + a.validationDate : ''}</p>
                {a.linkedRequirements && (
                  <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">GRK bagl.</span>
                )}
                {a.validationStatus === 'Curutuldu' && (
                  <p className="text-xs text-rose-400 mt-1">⚠ Curutuldu — iliskili gereksinimler etkilenebilir</p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openAssumptionModal(a)} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-blue-600 transition-colors"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => deleteAssumption(a.id)} className="p-1.5 hover:bg-rose-500/10 rounded-md text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
