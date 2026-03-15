import React from 'react';
import { RefreshCw } from 'lucide-react';
import { EntitySelector } from '../components/EntitySelector.jsx';

const ENTITY_TYPE_MAP = {
  'Gereksinim': 'requirement',
  'Is Kurali':  'businessRule',
  'Varsayim':   'assumption',
  'Risk':       'risk',
};

export function ChangeRequestModal({ form, setForm, onSave, onClose, editingCR, activeProject }) {
  const entityType = ENTITY_TYPE_MAP[form.affectedEntityType] || null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel p-6 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-lg text-slate-100 mb-4 flex items-center gap-2"><RefreshCw className="text-amber-400 w-5 h-5" />{editingCR ? 'CR Duzenle' : 'Yeni Degisiklik Talebi'}</h3>
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bolum 1 — Talep Bilgileri</p>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Talep basligi*" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-slate-400 block mb-1">Degisiklik Turu</label>
              <select value={form.changeType} onChange={e => setForm({ ...form, changeType: e.target.value })} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none">
                {['Kapsam Genislemesi', 'Duzeltme', 'Iptal', 'Yeni Ekleme', 'Erteleme'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="text-xs text-slate-400 block mb-1">Etkilenen Alan</label>
              <select value={form.affectedEntityType} onChange={e => setForm({ ...form, affectedEntityType: e.target.value, affectedEntityId: '' })} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none">
                {['Gereksinim', 'Is Kurali', 'Varsayim', 'Risk'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          {entityType && (
            <div><label className="text-xs text-slate-400 block mb-1">Etkilenen Kayıt</label>
              <EntitySelector entityType={entityType} activeProject={activeProject} value={form.affectedEntityId} onChange={id => setForm({ ...form, affectedEntityId: id })} placeholder="Kayıt seçin…" />
            </div>
          )}
          <textarea value={form.changeDescription} onChange={e => setForm({ ...form, changeDescription: e.target.value })} placeholder="Degisiklik aciklamasi*" rows="2" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none" />
          <textarea value={form.businessDriver} onChange={e => setForm({ ...form, businessDriver: e.target.value })} placeholder="Is gerekce / tetikleyici*" rows="2" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none" />
          <div><label className="text-xs text-slate-400 block mb-1">Talep Eden Paydaş</label>
            <EntitySelector entityType="stakeholder" activeProject={activeProject} value={form.requestingStakeholderId} onChange={id => setForm({ ...form, requestingStakeholderId: id })} placeholder="Paydaş seçin…" />
          </div>
          <div><label className="text-xs text-slate-400 block mb-1">Bağlı Toplantı</label>
            <EntitySelector entityType="meeting" activeProject={activeProject} value={form.linkedMeetingId} onChange={id => setForm({ ...form, linkedMeetingId: id })} placeholder="Toplantı seçin…" />
          </div>
          {editingCR && (
            <>
              <div className="border-t border-white/10 pt-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Bolum 2 — Karar</p>
              </div>
              <textarea value={form.impactAnalysis} onChange={e => setForm({ ...form, impactAnalysis: e.target.value })} placeholder="Etki analizi" rows="2" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" />
              <div><label className="text-xs text-slate-400 block mb-1">Durum</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none">
                  {['Bekliyor', 'Onaylandi', 'Reddedildi', 'Ertelendi'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {form.status !== 'Bekliyor' && (
                <div><label className="text-xs text-slate-400 block mb-1">Karar Tarihi</label>
                  <input type="date" value={form.decisionDate} onChange={e => setForm({ ...form, decisionDate: e.target.value })} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                </div>
              )}
              <textarea value={form.decisionNote} onChange={e => setForm({ ...form, decisionNote: e.target.value })} placeholder="Karar notu" rows="2" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" />
            </>
          )}
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:bg-white/10 rounded-md">Iptal</button>
          <button onClick={onSave} className="px-4 py-2 text-sm bg-amber-600/80 hover:bg-amber-500 text-white rounded-md font-medium">Kaydet</button>
        </div>
      </div>
    </div>
  );
}
