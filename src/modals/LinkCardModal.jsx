import React from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { PROB_LABELS, RACI_LABELS } from '../constants/index.js';
import { getRiskLevel } from '../utils.js';

export function LinkCardModal({ activeProject, linkCardEntity, onClose }) {
  if (!linkCardEntity) return null;
  const { type, id } = linkCardEntity;
  const crs = activeProject.changeRequests || [];
  const meetings = activeProject.meetings || [];
  const actions = activeProject.actions || [];

  if (type === 'requirement') {
    const req = (activeProject.requirements || []).find(r => r.id === id);
    if (!req) return null;
    const linkedCRs = crs.filter(cr => cr.affectedEntityId === req.reqId);
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="glass-panel p-6 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2"><ArrowUpRight className="text-cyan-400 w-5 h-5" /><span className="font-mono text-cyan-400">{req.reqId}</span>{req.name}</h3>
            <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            {[['Is Hedefi', req.objective], ['Modul', req.module], ['MoSCoW', req.moscow], ['Durum', req.status], ['Test ID', req.testId], ['Not', req.notes]].map(([k, v]) => (
              <div key={k} className="bg-white/5 rounded-lg p-2.5"><span className="text-xs text-slate-500 block">{k}</span><span className="text-slate-200">{v || '—'}</span></div>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bagli Degisiklik Talepleri ({linkedCRs.length})</p>
            {linkedCRs.length === 0 ? <p className="text-xs text-slate-500 py-2">Bagli CR bulunamadi.</p> : linkedCRs.map(cr => (
              <div key={cr.id} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                <span className="text-xs font-mono text-slate-400">{cr.crId}</span>
                <span className="text-xs text-slate-300 flex-1">{cr.title}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${cr.status === 'Bekliyor' ? 'bg-amber-500/10 text-amber-400' : cr.status === 'Onaylandi' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>{cr.status}</span>
              </div>
            ))}
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-3">Bagli Is Kurallari</p>
            <p className="text-xs text-slate-500 py-1">Otomatik esleme icin BR olusturma sirasinda req ID girin.</p>
          </div>
          <div className="flex justify-end mt-4"><button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:bg-white/10 rounded-md">Kapat</button></div>
        </div>
      </div>
    );
  }

  if (type === 'stakeholder') {
    const s = (activeProject.stakeholders || []).find(st => st.id === id);
    if (!s) return null;
    const relMeetings = meetings.filter(m => m.attendees && m.attendees.toLowerCase().includes(s.name.toLowerCase()));
    const openActions = actions.filter(a => a.owner && a.owner.toLowerCase() === s.name.toLowerCase() && a.status !== 'Tamamlandi');
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="glass-panel p-6 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2"><ArrowUpRight className="text-cyan-400 w-5 h-5" />{s.name}</h3>
            <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            {[['Rol', s.role], ['Departman', s.department], ['RACI', `${s.raci} — ${RACI_LABELS[s.raci]}`], ['Ilgi / Etki', `${PROB_LABELS[s.interest]} / ${PROB_LABELS[s.influence]}`]].map(([k, v]) => (
              <div key={k} className="bg-white/5 rounded-lg p-2.5"><span className="text-xs text-slate-500 block">{k}</span><span className="text-slate-200">{v || '—'}</span></div>
            ))}
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Katildigi Toplantilar ({relMeetings.length})</p>
              {relMeetings.length === 0 ? <p className="text-xs text-slate-500">Toplanti bulunamadi.</p> : relMeetings.map(m => <div key={m.id} className="text-xs bg-white/5 rounded px-3 py-1.5 text-slate-300">{m.date} — {m.topic}</div>)}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Acik Aksiyonlar ({openActions.length})</p>
              {openActions.length === 0 ? <p className="text-xs text-slate-500">Acik aksiyon yok.</p> : openActions.map(a => <div key={a.id} className="text-xs bg-white/5 rounded px-3 py-1.5 text-slate-300">{a.title} <span className="text-slate-500">· {a.dueDate || 'Tarih yok'}</span></div>)}
            </div>
          </div>
          <div className="flex justify-end mt-4"><button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:bg-white/10 rounded-md">Kapat</button></div>
        </div>
      </div>
    );
  }

  if (type === 'risk') {
    const risk = (activeProject.risks || []).find(r => r.id === id);
    if (!risk) return null;
    const lvl = getRiskLevel(risk.probability, risk.impact);
    const linkedCRs = crs.filter(cr => cr.affectedEntityType === 'Risk');
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="glass-panel p-6 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2"><ArrowUpRight className="text-cyan-400 w-5 h-5" />{risk.title}</h3>
            <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            {[['Kategori', risk.category], ['Risk Skoru', `${risk.probability * risk.impact} — ${lvl.label}`], ['Durum', risk.status], ['Sorumlu', risk.owner], ['Azaltma', risk.mitigation]].map(([k, v]) => (
              <div key={k} className="bg-white/5 rounded-lg p-2.5"><span className="text-xs text-slate-500 block">{k}</span><span className="text-slate-200">{v || '—'}</span></div>
            ))}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Bagli Degisiklik Talepleri ({linkedCRs.length})</p>
            {linkedCRs.length === 0 ? <p className="text-xs text-slate-500 py-1">Bagli CR bulunamadi.</p> : linkedCRs.map(cr => (
              <div key={cr.id} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 mb-1">
                <span className="text-xs font-mono text-slate-400">{cr.crId}</span>
                <span className="text-xs text-slate-300 flex-1">{cr.title}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${cr.status === 'Bekliyor' ? 'bg-amber-500/10 text-amber-400' : cr.status === 'Onaylandi' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>{cr.status}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4"><button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:bg-white/10 rounded-md">Kapat</button></div>
        </div>
      </div>
    );
  }

  return null;
}
