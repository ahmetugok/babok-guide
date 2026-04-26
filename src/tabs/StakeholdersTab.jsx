import React from 'react';
import { Users, UserPlus, Plus, Pencil, Trash2, ArrowUpRight } from 'lucide-react';
import { PROB_LABELS, RACI_LABELS, RACI_COLORS } from '../constants/index.js';
import { useProjectStore } from '../store/projectStore.js';
import { selectActiveStakeholders } from '../store/selectors.js';
import { useUIStore } from '../store/uiStore.js';

export function StakeholdersTab() {
  const stakeholders      = useProjectStore(selectActiveStakeholders);
  const openModal         = useUIStore((s) => s.openModal);
  const deleteStakeholder = useProjectStore((s) => s.deleteStakeholder);
  const focusedStakeholderId  = useUIStore((s) => s.focusedStakeholderId);
  const setFocusedStakeholderId = useUIStore((s) => s.setFocusedStakeholderId);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2"><UserPlus className="text-orange-500 w-5 h-5" />Paydaş Yönetimi</h2>
          <p className="text-sm text-slate-400">{stakeholders.length} paydaş kayıtlı</p>
        </div>
        <button onClick={() => openModal('stakeholder')} className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-black/20"><Plus className="w-4 h-4" />Paydaş Ekle</button>
      </div>
      {stakeholders.length > 0 && (
        <div className="bg-white/5 rounded-xl border border-white/10 p-5 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-300">İlgi / Etki Matrisi</h3>
            <div className="flex gap-3">
              {Object.entries(RACI_LABELS).map(([k, v]) => (
                <div key={k} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: k === 'R' ? '#3b82f6' : k === 'A' ? '#8b5cf6' : k === 'C' ? '#f59e0b' : '#94a3b8' }} />
                  <span className="text-[10px] text-slate-400 font-medium">{k} — {v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative border border-white/10 rounded-xl overflow-hidden" onClick={() => setFocusedStakeholderId(null)} style={{ height: Math.max(260, stakeholders.length > 6 ? 340 : 280) }}>
            {/* Quadrant backgrounds */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
              <div className="bg-amber-500/15 border-r border-b border-dashed border-white/15" />
              <div className="bg-rose-500/15 border-b border-dashed border-white/15" />
              <div className="bg-emerald-500/10 border-r border-dashed border-white/15" />
              <div className="bg-blue-500/15" />
            </div>
            {/* Quadrant labels */}
            <span className="absolute top-2 left-3 text-[10px] font-bold text-amber-600/70">İzle</span>
            <span className="absolute top-2 right-3 text-[10px] font-bold text-rose-600/70">Yakından Yönet</span>
            <span className="absolute bottom-2 left-3 text-[10px] font-bold text-emerald-600/60">Minimal Efor</span>
            <span className="absolute bottom-2 right-3 text-[10px] font-bold text-blue-600/70">Bilgilendir</span>
            {/* Axis labels */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] font-bold text-slate-400 tracking-wider">ETKİ →</div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-400 tracking-wider mb-0.5">İLGİ →</div>
            {(() => {
              const ITEM_W = 52, ITEM_H = 34;
              const placed = [];
              return stakeholders.map(s => {
                const baseX = ((s.interest - 1) / 2) * 85 + 5;
                const baseY = 100 - ((s.influence - 1) / 2) * 85 - 10;
                let finalX = baseX, finalY = baseY;
                const collides = (cx, cy) => placed.some(p =>
                  Math.abs(cx - p.x) < ITEM_W / (placed.length > 12 ? 3.5 : 4) &&
                  Math.abs(cy - p.y) < ITEM_H / (placed.length > 12 ? 3.5 : 4)
                );
                if (collides(finalX, finalY)) {
                  const spiralSteps = [
                    [1, 0], [-1, 0], [0, 1], [0, -1],
                    [1, 1], [-1, 1], [1, -1], [-1, -1],
                    [2, 0], [-2, 0], [0, 2], [0, -2],
                    [2, 1], [-2, 1], [2, -1], [-2, -1],
                    [1, 2], [-1, 2], [1, -2], [-1, -2],
                    [3, 0], [-3, 0], [0, 3], [0, -3],
                    [2, 2], [-2, 2], [2, -2], [-2, -2],
                    [3, 1], [-3, 1], [3, -1], [-3, -1],
                    [1, 3], [-1, 3], [1, -3], [-1, -3],
                    [3, 2], [-3, 2], [3, -2], [-3, -2],
                    [4, 0], [-4, 0], [0, 4], [0, -4],
                  ];
                  const stepSize = placed.length > 12 ? 3.5 : 4.5;
                  for (const [dx, dy] of spiralSteps) {
                    const nx = baseX + dx * stepSize;
                    const ny = baseY + dy * stepSize;
                    if (nx >= 2 && nx <= 98 && ny >= 4 && ny <= 96 && !collides(nx, ny)) {
                      finalX = nx; finalY = ny; break;
                    }
                  }
                }
                placed.push({ x: finalX, y: finalY });
                return (
                  <div key={s.id} className={`absolute flex flex-col items-center transition-all duration-200 group/stakeholder ${focusedStakeholderId === s.id ? 'z-50' : 'z-[1]'}`} style={{ left: `${finalX}%`, top: `${finalY}%`, transform: 'translate(-50%,-50%)' }}>
                    <div onClick={(e) => { e.stopPropagation(); setFocusedStakeholderId(focusedStakeholderId === s.id ? null : s.id); }} className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-md ring-2 cursor-pointer transition-all ${focusedStakeholderId === s.id ? 'ring-cyan-400 scale-125' : 'ring-white hover:scale-110'}`} style={{ background: s.raci === 'R' ? '#3b82f6' : s.raci === 'A' ? '#8b5cf6' : s.raci === 'C' ? '#f59e0b' : '#94a3b8' }}>{s.name.charAt(0)}</div>
                    <span className="text-[8px] text-slate-400 whitespace-nowrap mt-0.5 bg-white/60 px-1 rounded shadow-lg shadow-black/20">{s.name}</span>
                    {/* Hover + Click Tooltip */}
                    <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 transition-all duration-200 z-50 ${focusedStakeholderId === s.id ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible group-hover/stakeholder:opacity-100 group-hover/stakeholder:visible pointer-events-none'}`}>
                      <div className="glass-panel px-3 py-2.5 rounded-xl shadow-2xl border border-white/15 min-w-[180px] text-left" style={{ backdropFilter: 'blur(20px)' }}>
                        <p className="text-xs font-bold text-white truncate">{s.name}</p>
                        {s.role && <p className="text-[10px] text-slate-400 mt-0.5">{s.role}</p>}
                        {s.department && <p className="text-[10px] text-slate-500">{s.department}</p>}
                        <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-white/10">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${RACI_COLORS[s.raci]}`}>{s.raci} — {RACI_LABELS[s.raci]}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[9px] text-slate-400">İlgi: <strong className="text-slate-300">{PROB_LABELS[s.interest]}</strong></span>
                          <span className="text-[9px] text-slate-400">Etki: <strong className="text-slate-300">{PROB_LABELS[s.influence]}</strong></span>
                        </div>
                        {s.notes && <p className="text-[9px] text-slate-500 mt-1 italic truncate">{s.notes}</p>}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rotate-45 bg-white/10 border-r border-b border-white/15" />
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}
      {stakeholders.length === 0 ? (
        <div className="text-center py-16 text-slate-400"><Users className="w-10 h-10 mx-auto mb-3 opacity-30" /><p className="mb-1">Paydaş haritası boş. İlk paydaşı ekleyerek RACI analizine başla.</p><button onClick={() => openModal('stakeholder')} className="mt-3 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">+ Paydaş Ekle</button></div>
      ) : (
        <div className="space-y-3">
          {stakeholders.map(s => (
            <div key={s.id} className="bg-white/5 rounded-xl border border-white/10 p-4 shadow-lg shadow-black/20 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0`} style={{ background: s.raci === 'R' ? '#3b82f6' : s.raci === 'A' ? '#8b5cf6' : s.raci === 'C' ? '#f59e0b' : '#94a3b8' }}>{s.name.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-100">{s.name} <span className="text-slate-400 font-normal text-sm">— {s.role}</span></p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${RACI_COLORS[s.raci]}`}>{s.raci} — {RACI_LABELS[s.raci]}</span>
                  {s.department && <span className="text-xs text-slate-400">{s.department}</span>}
                  <span className="text-xs text-slate-400">İlgi: {PROB_LABELS[s.interest]} · Etki: {PROB_LABELS[s.influence]}</span>
                </div>
                {s.notes && <p className="text-xs text-slate-400 mt-1 italic">{s.notes}</p>}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openModal('linkCard', { entityType: 'stakeholder', entityId: s.id })} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-cyan-400 transition-colors" title="Baglantilar"><ArrowUpRight className="w-4 h-4" /></button>
                <button onClick={() => openModal('stakeholder', { editingId: s.id })} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-blue-600 transition-colors"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => { if (window.confirm('Paydaşı silmek istiyor musunuz?')) deleteStakeholder(s.id); }} className="p-1.5 hover:bg-rose-500/10 rounded-md text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
