import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { PROB_LABELS, IMPACT_LABELS } from '../constants/index.js';
import { getRiskLevel } from '../utils.js';
import { EntitySelector } from '../components/EntitySelector.jsx';
import { useProjectStore, selectActiveProject } from '../store/projectStore.js';
import { useUIStore, DEFAULT_RISK_FORM } from '../store/uiStore.js';

export function RiskModal() {
  const activeProject = useProjectStore(selectActiveProject);
  const saveRisk      = useProjectStore((s) => s.saveRisk);
  const modalData  = useUIStore((s) => s.modalData);
  const closeModal = useUIStore((s) => s.closeModal);

  const editingRisk = modalData.editingId
    ? (activeProject?.risks || []).find((r) => r.id === modalData.editingId)
    : null;

  const [form, setForm] = useState(
    editingRisk
      ? { ...DEFAULT_RISK_FORM, ...editingRisk }
      : { ...DEFAULT_RISK_FORM }
  );

  const onSave = () => {
    if (!form.title.trim()) return;
    saveRisk(form, modalData.editingId);
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel p-6 shadow-2xl max-w-lg w-full">
        <h3 className="font-bold text-lg text-slate-100 mb-4 flex items-center gap-2"><AlertTriangle className="text-rose-500 w-5 h-5" />{editingRisk ? 'Riski Düzenle' : 'Yeni Risk'}</h3>
        <div className="space-y-3">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Risk başlığı*" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-slate-400 block mb-1">Kategori</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none">
                <option value="">Kategori seçin</option>
                {['Paydas', 'Kapsam', 'Veri', 'Degisim Yonetimi', 'Teknik', 'Zaman', 'Butce', 'Yasal'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="text-xs text-slate-400 block mb-1">Durum</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none">
                {['Açık', 'Azaltıldı', 'Kapatıldı'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-slate-400 block mb-1">Olasılık: {PROB_LABELS[form.probability]}</label>
              <input type="range" min="1" max="3" value={form.probability} onChange={e => setForm({ ...form, probability: Number(e.target.value) })} className="w-full accent-rose-500" />
            </div>
            <div><label className="text-xs text-slate-400 block mb-1">Etki: {IMPACT_LABELS[form.impact]}</label>
              <input type="range" min="1" max="3" value={form.impact} onChange={e => setForm({ ...form, impact: Number(e.target.value) })} className="w-full accent-rose-500" />
            </div>
          </div>
          <div className={`text-center text-sm font-bold py-2 rounded-lg border ${getRiskLevel(form.probability, form.impact).cls}`}>
            Risk Skoru: {form.probability * form.impact} — {getRiskLevel(form.probability, form.impact).label}
          </div>
          <input value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} placeholder="Sorumlu kişi" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          <textarea value={form.mitigation} onChange={e => setForm({ ...form, mitigation: e.target.value })} placeholder="Azaltma stratejisi..." rows="2" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" />
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-slate-400 block mb-1">Bağlı Gereksinim</label>
              <EntitySelector entityType="requirement" value={form.linkedRequirementId} onChange={id => setForm({ ...form, linkedRequirementId: id })} placeholder="Gereksinim seçin…" />
            </div>
            <div><label className="text-xs text-slate-400 block mb-1">Tetikleyen Varsayım</label>
              <EntitySelector entityType="assumption" value={form.linkedAssumptionId} onChange={id => setForm({ ...form, linkedAssumptionId: id })} placeholder="Varsayım seçin…" />
            </div>
          </div>
          <div><label className="text-xs text-slate-400 block mb-1">Etkilenen Paydaş</label>
            <EntitySelector entityType="stakeholder" value={form.affectedStakeholderId} onChange={id => setForm({ ...form, affectedStakeholderId: id })} placeholder="Paydaş seçin…" />
          </div>
          <input value={form.triggerDescription} onChange={e => setForm({ ...form, triggerDescription: e.target.value })} placeholder="Erken uyarı işareti (risk gerceklesirse ne olur?)" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none" />
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={closeModal} className="px-4 py-2 text-sm text-slate-400 hover:bg-white/10 rounded-md">İptal</button>
          <button onClick={onSave} className="px-4 py-2 text-sm bg-rose-600/80 hover:bg-rose-500 text-white rounded-md font-medium">Kaydet</button>
        </div>
      </div>
    </div>
  );
}
