import React from 'react';
import { RefreshCw, Plus, Pencil, Trash2 } from 'lucide-react';
import { useProjectStore } from '../store/projectStore.js';
import { selectActiveChangeRequests } from '../store/selectors.js';
import { useUIStore } from '../store/uiStore.js';

export function ChangesTab() {
  const changeRequests = useProjectStore(selectActiveChangeRequests);
  const openModal      = useUIStore((s) => s.openModal);
  const deleteCR       = useProjectStore((s) => s.deleteCR);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2"><RefreshCw className="text-amber-400 w-5 h-5" />Degisiklik Yonetimi</h2>
          <p className="text-sm text-slate-400">{(changeRequests || []).length} talep kayıtlı</p>
        </div>
        <button onClick={() => openModal('changeRequest')} className="bg-amber-600/80 hover:bg-amber-500 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-black/20"><Plus className="w-4 h-4" />CR Ekle</button>
      </div>
      {/* Summary counters */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Bekliyor', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
          { label: 'Onaylandi', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Reddedildi', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
          { label: 'Ertelendi', color: 'text-slate-400 bg-white/5 border-white/10' },
        ].map(({ label, color }) => (
          <div key={label} className={`glass-card p-3 text-center border ${color}`}>
            <span className="font-stat text-2xl font-bold block">{(changeRequests || []).filter(cr => cr.status === label).length}</span>
            <span className="text-xs">{label}</span>
          </div>
        ))}
      </div>
      {(changeRequests || []).length === 0 ? (
        <div className="text-center py-16 text-slate-400"><RefreshCw className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>Henuz degisiklik talebi eklenmemis.</p></div>
      ) : (
        <div className="space-y-3">
          {(changeRequests || []).map(cr => (
            <div key={cr.id} className={`bg-white/5 rounded-xl border p-4 shadow-lg shadow-black/20 ${cr.status === 'Bekliyor' ? 'border-l-4 border-l-amber-400' : cr.status === 'Onaylandi' ? 'border-l-4 border-l-emerald-400' : cr.status === 'Reddedildi' ? 'border-l-4 border-l-rose-400' : 'border-white/10'}`}>
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-mono text-slate-400">{cr.crId}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cr.status === 'Bekliyor' ? 'bg-amber-500/10 text-amber-400' : cr.status === 'Onaylandi' ? 'bg-emerald-500/10 text-emerald-400' : cr.status === 'Reddedildi' ? 'bg-rose-500/10 text-rose-400' : 'bg-white/10 text-slate-400'}`}>{cr.status}</span>
                    <span className="text-xs bg-white/10 text-slate-400 px-2 py-0.5 rounded-full">{cr.changeType}</span>
                    {cr.affectedEntityId && (() => {
                      const colors = {
                        'Gereksinim': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
                        'Is Kurali':  'bg-violet-500/10 text-violet-400 border-violet-500/20',
                        'Varsayim':   'bg-amber-500/10 text-amber-400 border-amber-500/20',
                        'Risk':       'bg-rose-500/10 text-rose-400 border-rose-500/20',
                      };
                      const cls = colors[cr.affectedEntityType] || 'bg-white/10 text-slate-400 border-white/10';
                      return <span className={`text-xs font-mono border px-2 py-0.5 rounded-full ${cls}`}>{cr.affectedEntityType} · {cr.affectedEntityId}</span>;
                    })()}
                  </div>
                  <p className="font-semibold text-slate-100">{cr.title}</p>
                  {cr.changeDescription && <p className="text-xs text-slate-400 mt-1">{cr.changeDescription}</p>}
                  {cr.businessDriver && <p className="text-xs text-slate-500 mt-0.5">Gerekce: {cr.businessDriver}</p>}
                  {cr.impactAnalysis && <p className="text-xs text-slate-400 mt-0.5 border-l-2 border-amber-400/30 pl-2">Etki: {cr.impactAnalysis}</p>}
                  {cr.decisionDate && <p className="text-xs text-slate-500 mt-0.5">Karar Tarihi: {cr.decisionDate}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openModal('changeRequest', { editingId: cr.id })} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-blue-600 transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => deleteCR(cr.id)} className="p-1.5 hover:bg-rose-500/10 rounded-md text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
