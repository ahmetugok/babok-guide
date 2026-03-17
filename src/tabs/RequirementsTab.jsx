import React from 'react';
import { BookMarked, Plus, Pencil, Trash2, ArrowUpRight, CheckCircle2, X } from 'lucide-react';
import { REQ_STATUS_COLORS } from '../constants/index.js';

export function RequirementsTab({ activeProject, openReqModal, deleteReq, openLinkCard, reqFilter, setReqFilter }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2"><BookMarked className="text-teal-500 w-5 h-5" />Gereksinim Takip Tablosu</h2>
          <p className="text-sm text-slate-400">{activeProject.requirements.length} gereksinim · {activeProject.requirements.filter(r => r.status === 'Canlıda').length} canlıda</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={reqFilter} onChange={e => setReqFilter(e.target.value)} className="text-xs border border-white/10 rounded-md px-2 py-1.5 bg-white/5 focus:outline-none focus:ring-1 focus:ring-teal-400">
            <option value="all">Tüm Durumlar</option>
            {Object.keys(REQ_STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={() => openReqModal()} className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-black/20"><Plus className="w-4 h-4" />Gereksinim Ekle</button>
        </div>
      </div>
      {activeProject.requirements.length === 0 ? (
        <div className="text-center py-16 text-slate-400"><BookMarked className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>Henüz gereksinim eklenmemiş.</p></div>
      ) : (
        <div className="bg-white/5 rounded-xl border border-white/10 shadow-lg shadow-black/20 overflow-hidden" style={{ maxHeight: 'calc(100vh - 220px)' }}>
          <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10 sticky top-0 z-10" style={{ backdropFilter: 'blur(12px)' }}>
              <tr>{['ID', 'Tip', 'F/NF', 'Gereksinim', 'Tür', 'Modül', 'MoSCoW', 'Durum', 'K.K.', 'Bagl.', 'Not', ''].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeProject.requirements.filter(r => reqFilter === 'all' || r.status === reqFilter).map(r => {
                const linkedCount = [
                  (activeProject.risks          || []).filter(x => x.linkedRequirementId === r.id).length,
                  (activeProject.changeRequests  || []).filter(x => x.affectedEntityId   === r.id).length,
                  (activeProject.businessRules   || []).filter(x => x.linkedRequirements  === r.id).length,
                ].reduce((a, b) => a + b, 0);
                return (
                <tr key={r.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-slate-400 whitespace-nowrap">{r.reqId}</td>
                  <td className="px-4 py-3">{(() => {
                    const colors = {
                      'Is Gereksinimi':     'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
                      'Paydas Gereksinimi': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                      'Cozum Gereksinimi':  'bg-violet-500/10 text-violet-400 border-violet-500/20',
                      'Gecis Gereksinimi':  'bg-slate-500/10 text-slate-400 border-slate-500/20',
                    };
                    const cls = colors[r.requirementType];
                    return cls
                      ? <span className={`text-xs px-2 py-0.5 rounded-full border font-medium whitespace-nowrap ${cls}`}>{r.requirementType}</span>
                      : <span className="text-xs text-slate-600">—</span>;
                  })()}</td>
                  <td className="px-4 py-3">{(() => {
                    if (!r.functionalType) return <span className="text-xs text-slate-600">—</span>;
                    if (r.functionalType === 'Fonksiyonel') return <span className="text-xs px-2 py-0.5 rounded-full border font-medium bg-emerald-500/10 text-emerald-400 border-emerald-500/20 whitespace-nowrap">F</span>;
                    return <span className="text-xs px-2 py-0.5 rounded-full border font-medium bg-amber-500/10 text-amber-400 border-amber-500/20 whitespace-nowrap">{r.nfCategory ? `NF · ${r.nfCategory}` : 'NF'}</span>;
                  })()}</td>
                  <td className="px-4 py-3 font-medium text-slate-100">{r.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 max-w-[150px] truncate">{r.objective || '—'}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{r.module || '—'}</td>
                  <td className="px-4 py-3">{r.moscow ? <span className={`text-xs px-2 py-1 rounded-full font-medium ${r.moscow === 'Must' ? 'moscow-must' : r.moscow === 'Should' ? 'moscow-should' : r.moscow === 'Could' ? 'moscow-could' : 'moscow-wont'}`}>{r.moscow}</span> : <span className="text-xs text-slate-500">—</span>}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${REQ_STATUS_COLORS[r.status] || 'bg-white/10 text-slate-300'}`}>{r.status}</span></td>
                  <td className="px-4 py-3 text-center" title={r.acceptanceCriteria || 'Kabul kriteri girilmemis'}>{r.acceptanceCriteria ? <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /> : <X className="w-4 h-4 text-rose-400 inline" />}</td>
                  <td className="px-4 py-3 text-center">{linkedCount > 0 ? <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">{linkedCount} bagl.</span> : <span className="text-xs text-slate-600">—</span>}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 max-w-[150px] truncate" title={r.notes || ''}>{r.notes || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openLinkCard('requirement', r.id)} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-cyan-400 transition-colors" title="Baglantilar"><ArrowUpRight className="w-3.5 h-3.5" /></button>
                      <button onClick={() => openReqModal(r)} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-blue-600 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => deleteReq(r.id)} className="p-1 hover:bg-rose-500/10 rounded text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
