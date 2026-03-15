import React from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { REQ_STATUS_COLORS } from '../constants/index.js';

export function TraceabilityTab({ activeProject, setActiveTab }) {
  const reqs = activeProject.requirements || [];
  const brs = activeProject.businessRules || [];
  const crs = activeProject.changeRequests || [];
  const assumptions = activeProject.assumptions || [];
  const noAC = reqs.filter(r => !r.acceptanceCriteria);
  const noObjective = reqs.filter(r => !r.objective);
  const unvalidated = assumptions.filter(a => a.validationStatus === 'Dogrulanmadi');
  const pendingCRs = crs.filter(cr => cr.status === 'Bekliyor');
  const warnings = [
    { count: noAC.length, text: 'Kabul kriteri (Acceptance Criteria) bos gereksinim', tab: 'requirements' },
    { count: noObjective.length, text: 'Bagli is hedefi bos gereksinim', tab: 'requirements' },
    { count: unvalidated.length, text: 'Dogrulanmamis varsayim', tab: 'assumptions' },
    { count: pendingCRs.length, text: 'Bekleyen degisiklik talebi', tab: 'changes' },
  ];
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2"><ArrowUpRight className="text-cyan-400 w-5 h-5" />Traceability & Kalite Kontrol</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Panel A: Kalite Uyarıları */}
        <div className="glass-card p-4 space-y-2">
          <h3 className="font-bold text-sm text-slate-300 mb-3">Kalite Kontrol</h3>
          {warnings.map(({ count, text, tab }) => (
            <div key={text} className={`flex items-center justify-between p-2.5 rounded-lg ${count === 0 ? 'bg-emerald-500/5 border border-emerald-500/10' : 'bg-amber-500/5 border border-amber-500/20'}`}>
              <div className="flex items-center gap-2">
                {count === 0
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  : <span className="text-xs font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full min-w-[24px] text-center">{count}</span>
                }
                <span className="text-xs text-slate-300">{text}</span>
              </div>
              {count > 0 && <button onClick={() => setActiveTab(tab)} className="text-xs text-cyan-400 hover:text-cyan-300 whitespace-nowrap transition-colors">Goruntule →</button>}
            </div>
          ))}
        </div>
        {/* Panel B: Ozet */}
        <div className="glass-card p-4">
          <h3 className="font-bold text-sm text-slate-300 mb-3">Ozet</h3>
          <div className="space-y-1.5 text-xs text-slate-400">
            <p>Toplam gereksinim: <span className="text-slate-200 font-medium">{reqs.length}</span></p>
            <p>Is kurali: <span className="text-slate-200 font-medium">{brs.length}</span></p>
            <p>Degisiklik talebi: <span className="text-slate-200 font-medium">{crs.length}</span></p>
            <p>Varsayim / Kisit: <span className="text-slate-200 font-medium">{assumptions.length}</span></p>
          </div>
        </div>
      </div>
      {/* Panel B: İlişki Tablosu */}
      {reqs.length > 0 && (
        <div className="bg-white/5 rounded-xl border border-white/10 shadow-lg shadow-black/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 border-b border-white/10 sticky top-0 z-10" style={{ backdropFilter: 'blur(12px)' }}>
                <tr>{['Req ID', 'Gereksinim', 'Is Hedefi', 'MoSCoW', 'Test ID', 'Durum', 'Bagli BR', 'CR Sayisi'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {reqs.map(r => {
                  const linkedCRCount = crs.filter(cr => cr.affectedEntityId === r.reqId).length;
                  const linkedBR = brs.find(br => br.linkedRequirements && br.linkedRequirements.includes(r.reqId));
                  return (
                    <tr key={r.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-slate-400 whitespace-nowrap">{r.reqId}</td>
                      <td className="px-4 py-3 font-medium text-slate-100 max-w-[160px] truncate">{r.name}</td>
                      <td className="px-4 py-3 text-xs text-slate-400 max-w-[120px] truncate">{r.objective || <span className="text-amber-400/60">—</span>}</td>
                      <td className="px-4 py-3">{r.moscow ? <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.moscow === 'Must' ? 'moscow-must' : r.moscow === 'Should' ? 'moscow-should' : r.moscow === 'Could' ? 'moscow-could' : 'moscow-wont'}`}>{r.moscow}</span> : <span className="text-xs text-slate-500">—</span>}</td>
                      <td className="px-4 py-3">{r.testId ? <span className="text-xs text-emerald-400 font-mono">{r.testId}</span> : <span className="text-xs text-amber-400/60">Eksik</span>}</td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${REQ_STATUS_COLORS[r.status] || 'bg-white/10 text-slate-300'}`}>{r.status}</span></td>
                      <td className="px-4 py-3 text-xs text-slate-400">{linkedBR ? <span className="text-blue-400 font-mono">{linkedBR.brId}</span> : <span className="text-slate-600">—</span>}</td>
                      <td className="px-4 py-3">{linkedCRCount > 0 ? <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">{linkedCRCount}</span> : <span className="text-xs text-slate-600">—</span>}</td>
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
