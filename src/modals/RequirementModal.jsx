import React from 'react';
import { BookMarked } from 'lucide-react';
import { REQ_STATUS_COLORS } from '../constants/index.js';

export function RequirementModal({ form, setForm, onSave, onClose, editingReq, babokData }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel p-6 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-lg text-slate-100 mb-4 flex items-center gap-2"><BookMarked className="text-teal-500 w-5 h-5" />{editingReq ? 'Gereksinimi Düzenle' : 'Yeni Gereksinim'}</h3>
        <div className="space-y-3">
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Gereksinim adı*" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" />
          <input value={form.objective} onChange={e => setForm({ ...form, objective: e.target.value })} placeholder="Bağlı iş hedefi" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.module} onChange={e => setForm({ ...form, module: e.target.value })} placeholder="Modül/Ekran" className="border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none" />
            <input value={form.testId} onChange={e => setForm({ ...form, testId: e.target.value })} placeholder="Test ID" className="border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none">
              {Object.keys(REQ_STATUS_COLORS).map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={form.moscow} onChange={e => setForm({ ...form, moscow: e.target.value })} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option value="">MoSCoW Seçin</option>
              <option value="Must">Must Have</option>
              <option value="Should">Should Have</option>
              <option value="Could">Could Have</option>
              <option value="Wont">Won't Have</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select value={form.requirementType} onChange={e => setForm({ ...form, requirementType: e.target.value })} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option value="">Gereksinim Türü</option>
              {['Is Gereksinimi', 'Paydas Gereksinimi', 'Cozum Gereksinimi', 'Gecis Gereksinimi'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={form.approvalStatus} onChange={e => setForm({ ...form, approvalStatus: e.target.value })} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none">
              {['Taslak', 'Incelemede', 'Onaylandi', 'Reddedildi', 'Revize Gerekiyor'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select value={form.functionalType} onChange={e => setForm({ ...form, functionalType: e.target.value, nfCategory: e.target.value === 'Fonksiyonel' ? '' : form.nfCategory })} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option value="">Fonksiyonel/Non-Fonksiyonel Seçin</option>
              <option value="Fonksiyonel">Fonksiyonel</option>
              <option value="Non-Fonksiyonel">Non-Fonksiyonel</option>
            </select>
            {form.functionalType === 'Non-Fonksiyonel' && (
              <select value={form.nfCategory} onChange={e => setForm({ ...form, nfCategory: e.target.value })} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none">
                <option value="">NF Kategori Seçin</option>
                {['Performans', 'Güvenlik', 'Kullanılabilirlik', 'Güvenilirlik', 'Ölçeklenebilirlik', 'Sürdürülebilirlik', 'Uyumluluk'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
          </div>
          <div className="border-l-4 border-amber-400 pl-3 space-y-1">
            <label className="text-xs font-bold text-amber-400 block">Kabul Kriteri (Acceptance Criteria)</label>
            <textarea value={form.acceptanceCriteria} onChange={e => setForm({ ...form, acceptanceCriteria: e.target.value })} placeholder="Bu gereksinim ne zaman karsilanmis sayilir?" rows="3" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none" />
          </div>
          <select value={form.babokKnowledgeArea} onChange={e => setForm({ ...form, babokKnowledgeArea: e.target.value })} className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option value="">BABOK Bilgi Alani (istege bagli)</option>
            {babokData.map(ka => <option key={ka.id} value={ka.id}>{ka.title}</option>)}
          </select>
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Not / Açıklama (opsiyonel)" rows="2" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" />
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:bg-white/10 rounded-md">İptal</button>
          <button onClick={onSave} className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-md font-medium">Kaydet</button>
        </div>
      </div>
    </div>
  );
}
