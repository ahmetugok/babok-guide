import React, { useState, useMemo } from 'react';
import { X, CheckSquare, Square, AlertTriangle, CheckCircle, Plus } from 'lucide-react';

const TABS = [
  { key: 'requirements',  label: 'Gereksinim',  color: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20' },
  { key: 'risks',         label: 'Risk',         color: 'text-rose-400',    bg: 'bg-rose-500/10',    border: 'border-rose-500/20' },
  { key: 'assumptions',   label: 'Varsayım',     color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20' },
  { key: 'constraints',   label: 'Kısıt',        color: 'text-orange-400',  bg: 'bg-orange-500/10',  border: 'border-orange-500/20' },
  { key: 'business_rules',label: 'İş Kuralı',   color: 'text-violet-400',  bg: 'bg-violet-500/10',  border: 'border-violet-500/20' },
  { key: 'stakeholders',  label: 'Paydaş',       color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
];

const PROB_MAP = { 1: 'Düşük', 2: 'Orta', 3: 'Yüksek' };

function scoreColor(score) {
  if (score >= 70) return { ring: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'İyi' };
  if (score >= 40) return { ring: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   label: 'Orta' };
  return              { ring: 'text-rose-400',    bg: 'bg-rose-500/10',    border: 'border-rose-500/30',    label: 'Zayıf' };
}

function itemSubtitle(tab, item) {
  if (tab === 'requirements') return `${item.type || ''} · ${item.priority || ''}`;
  if (tab === 'risks')        return `Olasılık: ${PROB_MAP[item.probability] || ''} · Etki: ${PROB_MAP[item.impact] || ''}`;
  if (tab === 'stakeholders') return [item.role, item.department].filter(Boolean).join(' · ');
  return '';
}

function itemTitle(tab, item) {
  return tab === 'stakeholders' ? item.name : item.title;
}

function itemDescription(tab, item) {
  return tab === 'stakeholders' ? '' : item.description;
}

export function AnalysisResultsModal({ results, onClose, onApprove }) {
  const [activeTab, setActiveTab] = useState('requirements');
  // selected: { [tab]: Set<index> }
  const [selected, setSelected] = useState(() =>
    Object.fromEntries(TABS.map((t) => [t.key, new Set()]))
  );

  const items = useMemo(() => results[activeTab] || [], [results, activeTab]);

  const toggleItem = (idx) => {
    setSelected((prev) => {
      const next = new Set(prev[activeTab]);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return { ...prev, [activeTab]: next };
    });
  };

  const selectAll = () => {
    setSelected((prev) => ({ ...prev, [activeTab]: new Set(items.map((_, i) => i)) }));
  };

  const clearAll = () => {
    setSelected((prev) => ({ ...prev, [activeTab]: new Set() }));
  };

  const totalSelected = TABS.reduce((sum, t) => sum + selected[t.key].size, 0);

  const handleApprove = () => {
    const payload = {};
    TABS.forEach(({ key }) => {
      payload[key] = [...selected[key]].map((i) => (results[key] || [])[i]);
    });
    onApprove(payload);
  };

  const sc = scoreColor(results.quality_score ?? 0);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
      <div className="glass-card rounded-2xl shadow-2xl border border-white/10 w-full max-w-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
          <h2 className="text-base font-bold text-slate-100">Analiz Sonuçları</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Kalite Skoru */}
        <div className={`mx-5 mt-4 rounded-xl border p-4 flex items-center gap-4 ${sc.bg} ${sc.border} shrink-0`}>
          <div className="relative w-14 h-14 shrink-0">
            <svg viewBox="0 0 56 56" className="w-14 h-14 -rotate-90">
              <circle cx="28" cy="28" r="22" fill="none" stroke="currentColor" strokeWidth="5" className="text-white/10" />
              <circle
                cx="28" cy="28" r="22" fill="none" strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 22}`}
                strokeDashoffset={`${2 * Math.PI * 22 * (1 - (results.quality_score ?? 0) / 100)}`}
                className={`${sc.ring} transition-all`}
                strokeLinecap="round"
              />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${sc.ring}`}>
              {results.quality_score ?? 0}
            </span>
          </div>
          <div>
            <p className={`text-lg font-bold ${sc.ring}`}>Doküman Kalitesi: {sc.label}</p>
            <p className="text-xs text-slate-400">{results.quality_issues?.length || 0} sorun tespit edildi</p>
          </div>
        </div>

        {/* Quality Issues */}
        {results.quality_issues?.length > 0 && (
          <div className="mx-5 mt-3 space-y-1.5 shrink-0">
            {results.quality_issues.map((qi, i) => (
              <div key={i} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300">{qi.issue}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 px-5 mt-4 overflow-x-auto shrink-0">
          {TABS.map((t) => {
            const count = (results[t.key] || []).length;
            const selCount = selected[t.key].size;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === t.key ? `${t.bg} ${t.color} border ${t.border}` : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {t.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === t.key ? t.bg : 'bg-white/10'}`}>
                  {selCount > 0 ? `${selCount}/` : ''}{count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-5 py-3 min-h-0">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <CheckCircle className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">Bu kategoride veri bulunamadı.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400">{items.length} kayıt</span>
                <div className="flex gap-2">
                  <button onClick={selectAll} className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Tümünü seç</button>
                  <span className="text-slate-600">·</span>
                  <button onClick={clearAll} className="text-xs text-slate-400 hover:text-white transition-colors">Tümünü kaldır</button>
                </div>
              </div>
              <div className="space-y-2">
                {items.map((item, idx) => {
                  const isSelected = selected[activeTab].has(idx);
                  const tab = TABS.find((t) => t.key === activeTab);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleItem(idx)}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        isSelected
                          ? `${tab.bg} ${tab.border} border`
                          : 'border-white/5 hover:border-white/10 hover:bg-white/3 bg-white/2'
                      }`}
                    >
                      <div className={`shrink-0 mt-0.5 ${isSelected ? tab.color : 'text-slate-600'}`}>
                        {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-200 leading-snug">{itemTitle(activeTab, item)}</p>
                        {itemSubtitle(activeTab, item) && (
                          <p className={`text-xs mt-0.5 ${tab.color} opacity-80`}>{itemSubtitle(activeTab, item)}</p>
                        )}
                        {itemDescription(activeTab, item) && (
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{itemDescription(activeTab, item)}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-white/10 shrink-0">
          <span className="text-sm text-slate-400">
            {totalSelected > 0 ? (
              <span className="text-white font-medium">{totalSelected} kayıt seçildi</span>
            ) : (
              'Kayıt seçilmedi'
            )}
          </span>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
              İptal
            </button>
            <button
              onClick={handleApprove}
              disabled={totalSelected === 0}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Seçilenleri Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
