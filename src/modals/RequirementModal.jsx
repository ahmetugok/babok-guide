import React, { useState } from 'react';
import { BookMarked, Link, Plus, X } from 'lucide-react';
import { REQ_STATUS_COLORS } from '../constants/index.js';
import { babokData } from '../data/babokData.jsx';
import { useProjectStore } from '../store/projectStore.js';
import { selectActiveRequirements } from '../store/selectors.js';
import { useUIStore, DEFAULT_REQ_FORM } from '../store/uiStore.js';

export function RequirementModal() {
  const requirements     = useProjectStore(selectActiveRequirements);
  const saveReq       = useProjectStore((s) => s.saveReq);
  const modalData  = useUIStore((s) => s.modalData);
  const closeModal = useUIStore((s) => s.closeModal);

  const editingReq = modalData.editingId
    ? requirements.find((r) => r.id === modalData.editingId)
    : null;

  const [form, setForm] = useState(
    editingReq
      ? { ...DEFAULT_REQ_FORM, ...editingReq }
      : { ...DEFAULT_REQ_FORM }
  );

  const epics   = requirements.filter((r) => r.hierarchyType === 'epic' && r.id !== modalData.editingId);
  const stories = requirements.filter((r) => r.hierarchyType === 'story' && r.id !== modalData.editingId);
  const others  = requirements.filter((r) => r.id !== modalData.editingId);

  const addGherkin = () =>
    setForm({ ...form, gherkinScenarios: [...(form.gherkinScenarios || []), { given: '', when: '', then: '' }] });

  const removeGherkin = (i) =>
    setForm({ ...form, gherkinScenarios: form.gherkinScenarios.filter((_, idx) => idx !== i) });

  const updateGherkin = (i, field, value) =>
    setForm({
      ...form,
      gherkinScenarios: form.gherkinScenarios.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)),
    });

  const onSave = () => {
    if (!form.name.trim()) return;
    saveReq(form, modalData.editingId);
    closeModal();
  };

  const inputCls = 'w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 bg-transparent';
  const selectCls = 'w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none bg-transparent';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
      <div onClick={e => e.stopPropagation()} className="glass-panel p-6 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-lg text-slate-100 mb-4 flex items-center gap-2">
          <BookMarked className="text-teal-500 w-5 h-5" />
          {editingReq ? 'Gereksinimi Düzenle' : 'Yeni Gereksinim'}
        </h3>

        <div className="space-y-3">

          {/* A — Hiyerarşi Tipi */}
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1.5">Hiyerarşi Tipi</label>
            <div className="flex gap-2">
              {[
                { value: 'epic',        label: '🏔 Epic' },
                { value: 'story',       label: '📖 Story' },
                { value: 'requirement', label: '📋 Requirement' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, hierarchyType: value, parentId: '' })}
                  className={`px-3 py-1.5 text-xs rounded-md border font-medium transition-colors ${
                    form.hierarchyType === value
                      ? 'bg-teal-600/80 text-white border-teal-500'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* B — Parent Seçici */}
          {form.hierarchyType === 'story' && (
            <div>
              <label className="text-xs text-slate-400 block mb-1">Bağlı Epic</label>
              <select
                value={form.parentId}
                onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                className={selectCls}
              >
                <option value="">— Seçiniz —</option>
                {epics.map((r) => (
                  <option key={r.id} value={r.id}>{r.reqId} — {r.name}</option>
                ))}
              </select>
            </div>
          )}
          {form.hierarchyType === 'requirement' && (
            <div>
              <label className="text-xs text-slate-400 block mb-1">Bağlı Story (opsiyonel)</label>
              <select
                value={form.parentId}
                onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                className={selectCls}
              >
                <option value="">— Yok —</option>
                {stories.map((r) => (
                  <option key={r.id} value={r.id}>{r.reqId} — {r.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Temel alanlar */}
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Gereksinim adı*" className={inputCls} />
          <input value={form.objective} onChange={e => setForm({ ...form, objective: e.target.value })} placeholder="Bağlı iş hedefi" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none bg-transparent" />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.module} onChange={e => setForm({ ...form, module: e.target.value })} placeholder="Modül/Ekran" className="border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none bg-transparent" />
            <input value={form.testId} onChange={e => setForm({ ...form, testId: e.target.value })} placeholder="Test ID" className="border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none bg-transparent" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={selectCls}>
              {Object.keys(REQ_STATUS_COLORS).map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={form.moscow} onChange={e => setForm({ ...form, moscow: e.target.value })} className={selectCls}>
              <option value="">MoSCoW Seçin</option>
              <option value="Must">Must Have</option>
              <option value="Should">Should Have</option>
              <option value="Could">Could Have</option>
              <option value="Wont">Won't Have</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select value={form.requirementType} onChange={e => setForm({ ...form, requirementType: e.target.value })} className={selectCls}>
              <option value="">Gereksinim Türü</option>
              {['Is Gereksinimi', 'Paydas Gereksinimi', 'Cozum Gereksinimi', 'Gecis Gereksinimi'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={form.approvalStatus} onChange={e => setForm({ ...form, approvalStatus: e.target.value })} className={selectCls}>
              {['Taslak', 'Incelemede', 'Onaylandi', 'Reddedildi', 'Revize Gerekiyor'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.functionalType}
              onChange={e => setForm({ ...form, functionalType: e.target.value, nfCategory: e.target.value === 'Fonksiyonel' ? '' : form.nfCategory })}
              className={selectCls}
            >
              <option value="">Fonksiyonel/Non-Fonksiyonel Seçin</option>
              <option value="Fonksiyonel">Fonksiyonel</option>
              <option value="Non-Fonksiyonel">Non-Fonksiyonel</option>
            </select>
            {form.functionalType === 'Non-Fonksiyonel' && (
              <select value={form.nfCategory} onChange={e => setForm({ ...form, nfCategory: e.target.value })} className={selectCls}>
                <option value="">NF Kategori Seçin</option>
                {['Performans', 'Güvenlik', 'Kullanılabilirlik', 'Güvenilirlik', 'Ölçeklenebilirlik', 'Sürdürülebilirlik', 'Uyumluluk'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
          </div>

          {/* C — User Story alanları (sadece story) */}
          {form.hierarchyType === 'story' && (
            <div className="border-l-4 border-cyan-400 pl-3 space-y-2">
              <label className="text-xs font-bold text-cyan-400 block">User Story Formatı</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 shrink-0 w-12">As a</span>
                <input
                  value={form.userStoryRole}
                  onChange={e => setForm({ ...form, userStoryRole: e.target.value })}
                  placeholder="rol / kullanıcı tipi"
                  className="flex-1 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none bg-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 shrink-0 w-12">I want</span>
                <input
                  value={form.userStoryAction}
                  onChange={e => setForm({ ...form, userStoryAction: e.target.value })}
                  placeholder="gerçekleştirmek istediğim aksiyon"
                  className="flex-1 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none bg-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 shrink-0 w-12">So that</span>
                <input
                  value={form.userStoryBenefit}
                  onChange={e => setForm({ ...form, userStoryBenefit: e.target.value })}
                  placeholder="elde edeceğim fayda"
                  className="flex-1 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none bg-transparent"
                />
              </div>
            </div>
          )}

          {/* D — Gherkin Kabul Kriterleri (epic hariç) */}
          {form.hierarchyType !== 'epic' && (
            <div className="border-l-4 border-amber-400 pl-3 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-400">Gherkin Senaryoları</label>
                <button
                  type="button"
                  onClick={addGherkin}
                  className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <Plus className="w-3 h-3" />Senaryo Ekle
                </button>
              </div>
              {(form.gherkinScenarios || []).map((s, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-3 space-y-2 relative">
                  <button
                    type="button"
                    onClick={() => removeGherkin(i)}
                    className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex gap-2 items-start pr-5">
                    <span className="text-[10px] font-bold text-green-400 w-10 shrink-0 mt-2">GIVEN</span>
                    <input
                      value={s.given}
                      onChange={e => updateGherkin(i, 'given', e.target.value)}
                      placeholder="başlangıç durumu"
                      className="flex-1 border border-white/10 rounded px-2 py-1.5 text-xs focus:outline-none bg-transparent"
                    />
                  </div>
                  <div className="flex gap-2 items-start">
                    <span className="text-[10px] font-bold text-blue-400 w-10 shrink-0 mt-2">WHEN</span>
                    <input
                      value={s.when}
                      onChange={e => updateGherkin(i, 'when', e.target.value)}
                      placeholder="gerçekleşen olay"
                      className="flex-1 border border-white/10 rounded px-2 py-1.5 text-xs focus:outline-none bg-transparent"
                    />
                  </div>
                  <div className="flex gap-2 items-start">
                    <span className="text-[10px] font-bold text-amber-400 w-10 shrink-0 mt-2">THEN</span>
                    <input
                      value={s.then}
                      onChange={e => updateGherkin(i, 'then', e.target.value)}
                      placeholder="beklenen sonuç"
                      className="flex-1 border border-white/10 rounded px-2 py-1.5 text-xs focus:outline-none bg-transparent"
                    />
                  </div>
                </div>
              ))}
              {(form.gherkinScenarios || []).length === 0 && (
                <textarea
                  value={form.acceptanceCriteria}
                  onChange={e => setForm({ ...form, acceptanceCriteria: e.target.value })}
                  placeholder="Bu gereksinim ne zaman karşılanmış sayılır? (veya yukarıdan Gherkin senaryo ekleyin)"
                  rows="3"
                  className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none bg-transparent"
                />
              )}
            </div>
          )}

          <select value={form.babokKnowledgeArea} onChange={e => setForm({ ...form, babokKnowledgeArea: e.target.value })} className={selectCls}>
            <option value="">BABOK Bilgi Alani (istege bagli)</option>
            {babokData.map(ka => <option key={ka.id} value={ka.id}>{ka.title}</option>)}
          </select>
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Not / Açıklama (opsiyonel)" rows="2" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none bg-transparent" />

          {/* E — Predecessor */}
          <div>
            <label className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
              <Link className="w-3 h-3" />Önkoşul Gereksinim (Predecessor)
            </label>
            <select
              value={form.predecessorId}
              onChange={e => setForm({ ...form, predecessorId: e.target.value })}
              className={selectCls}
            >
              <option value="">— Yok —</option>
              {others.map((r) => (
                <option key={r.id} value={r.id}>{r.reqId} — {r.name}</option>
              ))}
            </select>
          </div>

        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button onClick={closeModal} className="px-4 py-2 text-sm text-slate-400 hover:bg-white/10 rounded-md">İptal</button>
          <button onClick={onSave} className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-md font-medium">Kaydet</button>
        </div>
      </div>
    </div>
  );
}
