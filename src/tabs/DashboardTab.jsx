import React, { useState } from 'react';
import {
  AlertTriangle, ListChecks, BookMarked, CalendarDays, Shield, CheckCircle2,
  LayoutGrid, Lightbulb, RefreshCw, Clock, Sparkles, X, Download, ChevronDown
} from 'lucide-react';
import { getRiskLevel, isOverdue } from '../utils.js';
import { REQ_STATUS_COLORS } from '../constants/index.js';
import { formatDuration } from '../utils/timeTracker.js';
import { babokData, TOTAL_TASKS, TOTAL_SUBTASKS } from '../data/babokData.jsx';
import { useProjectStore } from '../store/projectStore.js';
import {
  selectActiveCompletedTasks, selectActiveCompletedSubTasks, selectActiveCompletedTaskDurs,
  selectActiveMeetings, selectActiveActions, selectActiveRisks, selectActiveRequirements,
  selectActiveStakeholders, selectActiveAssumptions, selectActiveChangeRequests,
  selectActiveGanttTasks, selectActiveName,
} from '../store/selectors.js';
import { useUIStore } from '../store/uiStore.js';
import { RingChart } from '../components/RingChart.jsx';

const KA_COLORS = {
  ka1: { bar: '#a855f7', bg: 'bg-purple-500/10',  text: 'text-purple-400'  },
  ka2: { bar: '#3b82f6', bg: 'bg-blue-500/10',    text: 'text-blue-400'    },
  ka3: { bar: '#f97316', bg: 'bg-orange-500/10',  text: 'text-orange-400'  },
  ka4: { bar: '#14b8a6', bg: 'bg-teal-500/10',    text: 'text-teal-400'    },
  ka5: { bar: '#6366f1', bg: 'bg-indigo-500/10',  text: 'text-indigo-400'  },
  ka6: { bar: '#10b981', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
};

export function DashboardTab() {
  const completedTasks        = useProjectStore(selectActiveCompletedTasks);
  const completedSubTasks     = useProjectStore(selectActiveCompletedSubTasks);
  const completedTaskDurations = useProjectStore(selectActiveCompletedTaskDurs);
  const meetings              = useProjectStore(selectActiveMeetings);
  const actions               = useProjectStore(selectActiveActions);
  const risks                 = useProjectStore(selectActiveRisks);
  const requirements          = useProjectStore(selectActiveRequirements);
  const stakeholders          = useProjectStore(selectActiveStakeholders);
  const assumptions           = useProjectStore(selectActiveAssumptions);
  const changeRequests        = useProjectStore(selectActiveChangeRequests);
  const ganttTasks            = useProjectStore(selectActiveGanttTasks);
  const projectName           = useProjectStore(selectActiveName);
  const setActiveTab    = useUIStore((s) => s.setActiveTab);
  const setExpandedKA   = useUIStore((s) => s.setExpandedKA);
  const openModal = useUIStore((s) => s.openModal);

  const overallProgress   = Math.round(((completedTasks.length + completedSubTasks.length) / (TOTAL_TASKS + TOTAL_SUBTASKS)) * 100) || 0;
  // ── Zaman analizi hesaplamaları ──────────────────────────────────────────
  const totalMeetingMinutes  = (meetings  || []).reduce((s, m) => s + (m.duration  || 0), 0);
  const totalActionMinutes   = (actions   || []).reduce((s, a) => s + (a.duration  || 0), 0);
  const totalChecklistMinutes = Object.values(completedTaskDurations || {}).reduce((s, d) => s + d, 0);
  const totalMinutes = totalMeetingMinutes + totalActionMinutes + totalChecklistMinutes;

  const babokEforData = babokData.map(ka => {
    const taskIds = ka.tasks.map(t => t.id);
    const minutes = taskIds.reduce((s, id) => s + (completedTaskDurations?.[id] || 0), 0);
    return { id: ka.id, title: ka.title, minutes };
  }).filter(ka => ka.minutes > 0);
  const totalBabokMinutes = babokEforData.reduce((s, ka) => s + ka.minutes, 0);

  const [zamanExpanded, setZamanExpanded] = useState(false);

  const openRisks = risks.filter(r => r.status === 'Açık');
  const highRisks = openRisks.filter(r => getRiskLevel(r.probability, r.impact).label === 'Yüksek' || getRiskLevel(r.probability, r.impact).label === 'Kritik');
  const pendingActions = actions.filter(a => a.status !== 'Tamamlandı');
  const overdueActions = pendingActions.filter(isOverdue);
  const overdueTasks = ganttTasks.filter(gt => gt.progress < 100 && gt.endDate && new Date(gt.endDate) < new Date());
  const stakeholderCount = stakeholders?.length || 0;
  const meetingCount = meetings?.length || 0;

  return (
    <div className="space-y-3">

      {/* ── ROW 1: Hero Progress ── */}
      <div className="glass-card p-4 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl" />
        {/* Export icon — top right */}
        <button
          onClick={() => openModal('export')}
          title="Raporu Dışa Aktar"
          className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-white/10 transition-colors z-10"
        >
          <Download className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-5">
          {/* Ring Chart */}
          <div className="relative flex-shrink-0">
            <RingChart progress={overallProgress} label={projectName} size={110} stroke={10} />
          </div>
          {/* Stats Grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h2 className="text-lg font-bold text-white">Proje Özeti</h2>
              <span className="text-sm text-slate-500">· {projectName}</span>
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
                <span className="text-xs text-slate-500 uppercase tracking-wider block mb-0.5">Ana Görev</span>
                <span className="font-stat text-xl font-bold text-white">{completedTasks.length}<span className="text-sm text-slate-500">/{TOTAL_TASKS}</span></span>
              </div>
              <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
                <span className="text-xs text-slate-500 uppercase tracking-wider block mb-0.5">Alt Görev</span>
                <span className="font-stat text-xl font-bold text-white">{completedSubTasks.length}<span className="text-sm text-slate-500">/{TOTAL_SUBTASKS}</span></span>
              </div>
              <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
                <span className="text-xs text-slate-500 uppercase tracking-wider block mb-0.5">Paydaş</span>
                <span className="font-stat text-xl font-bold text-white">{stakeholderCount}</span>
              </div>
              <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
                <span className="text-xs text-slate-500 uppercase tracking-wider block mb-0.5">Toplantı</span>
                <span className="font-stat text-xl font-bold text-white">{meetingCount}</span>
              </div>
            </div>
            <div className="mt-2">
              <div className="liquid-bar w-full h-1.5">
                <div className="liquid-bar-fill bg-gradient-to-r from-cyan-500 to-cyan-400" style={{ width: `${overallProgress}%` }} />
              </div>
            </div>

            {/* Zaman analizi — progress bar altına gömülü */}
            {totalMinutes > 0 && (
              <div className="mt-2 pt-2 border-t border-white/5">
                <div
                  className="flex items-center justify-between cursor-pointer select-none group"
                  onClick={() => setZamanExpanded(z => !z)}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <Clock className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <span className="text-xs font-semibold text-cyan-400">{formatDuration(totalMinutes)}</span>
                    <span className="text-xs text-slate-500 hidden sm:inline">
                      · Toplantı: {formatDuration(totalMeetingMinutes)}
                      · Aksiyon: {formatDuration(totalActionMinutes)}
                      · Analiz: {formatDuration(totalChecklistMinutes)}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform shrink-0 group-hover:text-slate-300 ${zamanExpanded ? 'rotate-180' : ''}`} />
                </div>

                {zamanExpanded && babokEforData.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {babokEforData.map(ka => {
                      const pct = totalBabokMinutes > 0 ? Math.round((ka.minutes / totalBabokMinutes) * 100) : 0;
                      const color = KA_COLORS[ka.id] || { bar: '#6366f1', text: 'text-indigo-400' };
                      return (
                        <div key={ka.id} className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 w-32 truncate flex-shrink-0" title={ka.title}>{ka.title}</span>
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color.bar, opacity: 0.75 }} />
                          </div>
                          <span className={`text-[10px] font-medium w-14 text-right flex-shrink-0 ${color.text}`}>{formatDuration(ka.minutes)}</span>
                          <span className="text-[10px] text-slate-600 w-6 text-right flex-shrink-0">{pct}%</span>
                        </div>
                      );
                    })}
                    {totalMeetingMinutes > 0 && (() => {
                      const pct = Math.round((totalMeetingMinutes / totalMinutes) * 100);
                      return pct > 50 ? (
                        <p className="text-[10px] text-amber-400 flex items-center gap-1 pt-0.5">
                          ⚠ Toplantı süresi analiz süresinin {pct}%'ini oluşturuyor
                        </p>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── PROAKTIF BLOK: Bugun Ne Yapmaliyim? ── */}
      {(() => {
        const today = new Date();
        const weekLater = new Date(today.getTime() + 7 * 86400000);
        const allReqs = requirements || [];
        const allAss = assumptions || [];
        const allCRs = changeRequests || [];
        const allGantt = ganttTasks || [];

        const noAC = allReqs.filter(r => !r.acceptanceCriteria);
        const refutedAss = allAss.filter(a => a.validationStatus === 'Curutuldu');
        const approvedNoBiz = allCRs.filter(cr => cr.status === 'Onaylandi' && !cr.impactAnalysis);
        const unvalidatedAss = allAss.filter(a => a.validationStatus === 'Dogrulanmadi');
        const dueSoonGantt = allGantt.filter(gt => gt.progress < 100 && gt.endDate && new Date(gt.endDate) <= weekLater && new Date(gt.endDate) >= today);
        const pendingCRs = allCRs.filter(cr => cr.status === 'Bekliyor');
        const overdue = overdueActions;

        const redItems = [
          { count: noAC.length, icon: <X className="w-3.5 h-3.5" />, text: 'Kabul kriteri bos gereksinim', tab: 'requirements' },
          { count: refutedAss.length, icon: <AlertTriangle className="w-3.5 h-3.5" />, text: 'Curutulmus varsayim', tab: 'assumptions' },
          { count: approvedNoBiz.length, icon: <RefreshCw className="w-3.5 h-3.5" />, text: 'Etki analizi bos onaylanmis CR', tab: 'changes' },
        ].filter(i => i.count > 0);

        const yellowItems = [
          { count: unvalidatedAss.length, icon: <Lightbulb className="w-3.5 h-3.5" />, text: 'Dogrulanmamis varsayim', tab: 'assumptions' },
          { count: dueSoonGantt.length, icon: <CalendarDays className="w-3.5 h-3.5" />, text: 'Bu hafta biten timeline gorevi', tab: 'gantt' },
          { count: pendingCRs.length, icon: <RefreshCw className="w-3.5 h-3.5" />, text: 'Bekleyen degisiklik talebi', tab: 'changes' },
        ].filter(i => i.count > 0);

        const blueItems = [
          { count: overdue.length, icon: <Clock className="w-3.5 h-3.5" />, text: 'Gecikmi aksiyonlar', tab: 'actions' },
        ].filter(i => i.count > 0);

        const allClear = redItems.length + yellowItems.length + blueItems.length === 0;

        return (
          <div className="glass-card p-4">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Bugun Ne Yapmaliyim?
            </h3>
            {allClear ? (
              <div className="text-center py-3 text-emerald-400 font-medium text-sm bg-emerald-500/5 rounded-lg border border-emerald-500/15">
                🎉 Her sey yolunda gorunuyor. Harika is!
              </div>
            ) : (
              <div className="space-y-1.5">
                {redItems.map(({ count, icon, text, tab }) => (
                  <button key={text} onClick={() => setActiveTab(tab)} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/15 transition-colors text-left">
                    <span className="text-rose-400 shrink-0">{icon}</span>
                    <span className="text-xs text-rose-300 flex-1">{text}</span>
                    <span className="text-xs font-bold bg-rose-500/30 text-rose-200 px-2 py-0.5 rounded-full shrink-0">{count}</span>
                  </button>
                ))}
                {yellowItems.map(({ count, icon, text, tab }) => (
                  <button key={text} onClick={() => setActiveTab(tab)} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 transition-colors text-left">
                    <span className="text-amber-400 shrink-0">{icon}</span>
                    <span className="text-xs text-amber-300 flex-1">{text}</span>
                    <span className="text-xs font-bold bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded-full shrink-0">{count}</span>
                  </button>
                ))}
                {blueItems.map(({ count, icon, text, tab }) => (
                  <button key={text} onClick={() => setActiveTab(tab)} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/15 transition-colors text-left">
                    <span className="text-blue-400 shrink-0">{icon}</span>
                    <span className="text-xs text-blue-300 flex-1">{text}</span>
                    <span className="text-xs font-bold bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full shrink-0">{count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* ── ROW 2: 5 Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5">
        {/* Unvalidated Assumptions */}
        <div onClick={() => setActiveTab('assumptions')} className="glass-card p-3.5 cursor-pointer hover:scale-[1.02] transition-transform group" style={{ borderLeft: '2px solid rgba(251,191,36,0.4)' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/10">
              <Lightbulb className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <span className="font-stat text-3xl font-black text-amber-400">{(assumptions || []).filter(a => a.validationStatus === 'Dogrulanmadi').length}</span>
          <span className="text-sm text-slate-400 block mt-0.5">Dogrulanmamis Varsayim</span>
          <span className="text-xs text-slate-500 block">{(assumptions || []).length} toplam</span>
        </div>
        {/* Open Risks */}
        <div onClick={() => setActiveTab('risks')} className="glass-card p-3.5 cursor-pointer hover:scale-[1.02] transition-transform neon-border-crimson group">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/10">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            {highRisks.length > 0 && <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold animate-pulse">{highRisks.length} kritik</span>}
          </div>
          <span className="font-stat text-3xl font-black neon-crimson">{openRisks.length}</span>
          <span className="text-sm text-slate-400 block mt-0.5">Açık Risk</span>
          <span className="text-xs text-slate-500 block">{risks.length} toplam</span>
        </div>
        {/* Pending Actions */}
        <div onClick={() => setActiveTab('actions')} className="glass-card p-3.5 cursor-pointer hover:scale-[1.02] transition-transform neon-border-amethyst group">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/10">
              <ListChecks className="w-5 h-5 text-violet-400" />
            </div>
            {overdueActions.length > 0 && <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold animate-pulse">{overdueActions.length} gecikmiş</span>}
          </div>
          <span className="font-stat text-3xl font-black neon-amethyst">{pendingActions.length}</span>
          <span className="text-sm text-slate-400 block mt-0.5">Bekleyen Aksiyon</span>
          <span className="text-xs text-slate-500 block">{actions.length} toplam</span>
        </div>
        {/* Requirements */}
        <div onClick={() => setActiveTab('requirements')} className="glass-card p-3.5 cursor-pointer hover:scale-[1.02] transition-transform neon-border-cyan group">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/10">
              <BookMarked className="w-5 h-5 text-cyan-400" />
            </div>
            {requirements.filter(r => r.status === 'Canlıda').length > 0 && <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">{requirements.filter(r => r.status === 'Canlıda').length} canlıda</span>}
          </div>
          <span className="font-stat text-3xl font-black neon-cyan">{requirements.length}</span>
          <span className="text-sm text-slate-400 block mt-0.5">Gereksinim</span>
          <span className="text-xs text-slate-500 block">{Object.entries(REQ_STATUS_COLORS).map(([st]) => requirements.filter(r => r.status === st).length > 0 ? st.slice(0,3) + ':' + requirements.filter(r => r.status === st).length : null).filter(Boolean).join(' · ')}</span>
        </div>
        {/* Gantt */}
        <div onClick={() => setActiveTab('gantt')} className="glass-card p-3.5 cursor-pointer hover:scale-[1.02] transition-transform group" style={{ borderLeft: '2px solid rgba(251,191,36,0.3)' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/10">
              <CalendarDays className="w-5 h-5 text-amber-400" />
            </div>
            {overdueTasks.length > 0 && <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold animate-pulse">{overdueTasks.length} gecikmiş</span>}
          </div>
          <span className="font-stat text-3xl font-black text-amber-400">{ganttTasks.length}</span>
          <span className="text-sm text-slate-400 block mt-0.5">Timeline Görevi</span>
          <span className="text-xs text-slate-500 block">{ganttTasks.filter(gt => gt.progress === 100).length} tamamlandı</span>
        </div>
      </div>

      {/* ── ROW 2b: CR Banner ── */}
      {(() => { const pendingCRs = (changeRequests || []).filter(cr => cr.status === 'Bekliyor'); return pendingCRs.length > 0 ? (
        <div onClick={() => setActiveTab('changes')} className="glass-card px-4 py-3 cursor-pointer hover:scale-[1.01] transition-transform flex items-center justify-between" style={{ borderLeft: '3px solid rgba(251,191,36,0.6)' }}>
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-amber-400 text-lg">{pendingCRs.length}</span>
              <span className="text-sm text-slate-400 ml-2">bekleyen degisiklik talebi</span>
            </div>
          </div>
          <span className="text-xs text-amber-400 hover:text-amber-300">Tamamini gor →</span>
        </div>
      ) : null; })()}

      {/* ── ROW 3: Open Risks & Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
        {/* Open Risks List */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-rose-400" />Açık Riskler</h3>
            <button onClick={() => setActiveTab('risks')} className="text-xs text-rose-400 hover:text-rose-300 transition-colors">Tümünü gör →</button>
          </div>
          {openRisks.length === 0 ? (
            <div className="text-center py-4 text-slate-500"><Shield className="w-7 h-7 mx-auto mb-1.5 opacity-30" /><p className="text-xs">Açık risk bulunmuyor 🎉</p></div>
          ) : (
            <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
              {openRisks.slice(0, 10).map(r => {
                const lvl = getRiskLevel(r.probability, r.impact);
                return (
                  <div key={r.id} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group/item">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${lvl.cls}`}>{lvl.label}</span>
                    <span className="text-sm text-slate-300 flex-1 truncate">{r.title}</span>
                    <span className="text-xs text-slate-500 hidden sm:inline">{r.owner || '—'}</span>
                  </div>
                );
              })}
              {openRisks.length > 10 && <button onClick={() => setActiveTab('risks')} className="text-[10px] text-cyan-400 hover:text-cyan-300 text-center pt-1 w-full cursor-pointer hover:underline transition-colors">+{openRisks.length - 10} daha →</button>}
            </div>
          )}
        </div>

        {/* Requirements Summary */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2"><BookMarked className="w-4 h-4 text-cyan-400" />Gereksinimler</h3>
            <button onClick={() => setActiveTab('requirements')} className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Tümünü gör →</button>
          </div>
          {requirements.length === 0 ? (
            <div className="text-center py-4 text-slate-500"><BookMarked className="w-7 h-7 mx-auto mb-1.5 opacity-30" /><p className="text-xs">Henüz gereksinim eklenmemiş</p></div>
          ) : (
            <>
              {/* Status pills */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {Object.keys(REQ_STATUS_COLORS).map(st => {
                  const cnt = requirements.filter(r => r.status === st).length;
                  return cnt > 0 ? <span key={st} className={`text-xs px-2.5 py-1 rounded-full font-medium ${REQ_STATUS_COLORS[st]}`}>{st}: {cnt}</span> : null;
                })}
              </div>
              {/* Requirement list */}
              <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                {requirements.slice(0, 6).map(r => (
                  <div key={r.id} className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <span className="text-xs font-mono text-slate-500 w-14">{r.reqId}</span>
                    <span className="text-sm text-slate-300 flex-1 truncate">{r.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${REQ_STATUS_COLORS[r.status] || 'bg-white/10 text-slate-400'}`}>{r.status}</span>
                  </div>
                ))}
                {requirements.length > 6 && <button onClick={() => setActiveTab('requirements')} className="text-[10px] text-cyan-400 hover:text-cyan-300 text-center pt-1 w-full cursor-pointer hover:underline transition-colors">+{requirements.length - 6} daha →</button>}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── ROW 4: Pending Actions & Timeline ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
        {/* Pending Actions List */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2"><ListChecks className="w-4 h-4 text-violet-400" />Bekleyen Aksiyonlar</h3>
            <button onClick={() => setActiveTab('actions')} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Tümünü gör →</button>
          </div>
          {pendingActions.length === 0 ? (
            <div className="text-center py-4 text-slate-500"><CheckCircle2 className="w-7 h-7 mx-auto mb-1.5 opacity-30" /><p className="text-xs">Tüm aksiyonlar tamamlandı 🎉</p></div>
          ) : (
            <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
              {pendingActions.slice(0, 10).map(a => (
                <div key={a.id} className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-colors ${isOverdue(a) ? 'bg-rose-500/10 hover:bg-rose-500/15' : 'bg-white/5 hover:bg-white/10'}`}>
                  {isOverdue(a) && <span className="text-[10px] bg-rose-500/25 text-rose-300 px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap">GECİKMİŞ</span>}
                  <span className="text-sm text-slate-300 flex-1 truncate">{a.title}</span>
                  <span className="text-xs text-slate-500 hidden sm:inline">{a.owner || '—'}</span>
                  {a.dueDate && <span className={`text-xs ${isOverdue(a) ? 'text-rose-400' : 'text-slate-500'}`}>{a.dueDate}</span>}
                </div>
              ))}
              {pendingActions.length > 10 && <button onClick={() => setActiveTab('actions')} className="text-[10px] text-cyan-400 hover:text-cyan-300 text-center pt-1 w-full cursor-pointer hover:underline transition-colors">+{pendingActions.length - 10} daha →</button>}
            </div>
          )}
        </div>

        {/* Gantt Mini Chart */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2"><CalendarDays className="w-4 h-4 text-amber-400" />Timeline</h3>
            <button onClick={() => setActiveTab('gantt')} className="text-xs text-amber-400 hover:text-amber-300 transition-colors">Tam ekran →</button>
          </div>
          {ganttTasks.length === 0 ? (
            <div className="text-center py-4 text-slate-500"><CalendarDays className="w-7 h-7 mx-auto mb-1.5 opacity-30" /><p className="text-xs">Henüz timeline görevi eklenmemiş</p></div>
          ) : (() => {
            const gt = ganttTasks;
            const gStarts = gt.map(t => new Date(t.startDate).getTime());
            const gEnds = gt.map(t => new Date(t.endDate).getTime());
            const gRangeStart = new Date(Math.min(...gStarts));
            const gRangeEnd = new Date(Math.max(...gEnds));
            gRangeStart.setDate(gRangeStart.getDate() - 3);
            gRangeEnd.setDate(gRangeEnd.getDate() + 3);
            const gTotalDays = Math.max(Math.round((gRangeEnd - gRangeStart) / 86400000) + 1, 7);
            const gToday = new Date(); gToday.setHours(0,0,0,0);
            const gTodayPct = Math.max(0, Math.min(100, ((gToday - gRangeStart) / (gRangeEnd - gRangeStart)) * 100));

            // Month labels
            const gMonths = [];
            const gMCur = new Date(gRangeStart.getFullYear(), gRangeStart.getMonth(), 1);
            while (gMCur <= gRangeEnd) {
              const mS = gMCur < gRangeStart ? gRangeStart : new Date(gMCur);
              const leftPct = ((mS - gRangeStart) / (gRangeEnd - gRangeStart)) * 100;
              gMonths.push({ label: gMCur.toLocaleDateString('tr-TR', { month: 'short', year: '2-digit' }), left: leftPct });
              gMCur.setMonth(gMCur.getMonth() + 1);
            }

            return (
              <div className="space-y-1">
                {/* Month header row */}
                <div className="relative h-5 mb-2 border-b border-white/5">
                  {gMonths.map((m, i) => (
                    <span key={i} className="absolute text-[10px] text-slate-500 font-medium capitalize" style={{ left: `${m.left}%` }}>{m.label}</span>
                  ))}
                </div>
                {/* Task bars */}
                <div className="relative space-y-1.5">
                  {/* Today marker */}
                  {gTodayPct > 0 && gTodayPct < 100 && (
                    <div className="absolute top-0 bottom-0 w-px bg-rose-500/60 z-10 pointer-events-none" style={{ left: `${gTodayPct}%` }}>
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[7px] bg-rose-500/80 text-white px-1 rounded-sm font-bold">Bugün</div>
                    </div>
                  )}
                  {gt.slice(0, 12).map(task => {
                    const s = new Date(task.startDate); s.setHours(0,0,0,0);
                    const e = new Date(task.endDate); e.setHours(0,0,0,0);
                    const leftPct = Math.max(0, ((s - gRangeStart) / (gRangeEnd - gRangeStart)) * 100);
                    const widthPct = Math.max(2, ((e - s + 86400000) / (gRangeEnd - gRangeStart)) * 100);
                    const isLate = task.progress < 100 && e < gToday;
                    return (
                      <div key={task.id} className="flex items-center gap-2 group/bar">
                        <span className="text-xs text-slate-400 w-20 truncate flex-shrink-0" title={task.name}>{task.name}</span>
                        <div className="flex-1 relative h-5 rounded bg-white/5">
                          <div
                            className={`absolute top-0.5 bottom-0.5 rounded-sm transition-all ${isLate ? 'ring-1 ring-rose-400/50' : ''}`}
                            style={{ left: `${leftPct}%`, width: `${widthPct}%`, backgroundColor: task.color || '#3b82f6', opacity: 0.85 }}
                            title={`${task.name} (${task.startDate} → ${task.endDate}) %${task.progress}`}
                          >
                            {/* Progress fill inside bar */}
                            <div className="absolute inset-0 rounded-sm overflow-hidden">
                              <div className="h-full bg-white/20" style={{ width: `${task.progress}%` }} />
                            </div>
                            {widthPct > 10 && <span className="absolute inset-0 flex items-center justify-center text-[8px] text-white font-bold drop-shadow">{task.progress}%</span>}
                          </div>
                          {isLate && <span className="absolute text-[8px] text-rose-400 font-bold" style={{ left: `${leftPct + widthPct + 0.5}%`, top: '2px' }}>⚠️</span>}
                        </div>
                      </div>
                    );
                  })}
                  {gt.length > 12 && <p className="text-[10px] text-slate-500 text-center pt-1">+{gt.length - 12} görev daha</p>}
                </div>
                {/* Mini summary */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                  <span className="text-xs text-slate-500">{gt.length} görev · Ort. %{gt.length > 0 ? Math.round(gt.reduce((a, t) => a + (t.progress || 0), 0) / gt.length) : 0}</span>
                  {gt.filter(t => t.progress < 100 && t.endDate && new Date(t.endDate) < gToday).length > 0 && (
                    <span className="text-xs text-rose-400 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />{gt.filter(t => t.progress < 100 && t.endDate && new Date(t.endDate) < gToday).length} gecikmiş</span>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── ROW 5: 6 BABOK Döngü Kartları ── */}
      <div>
        <h3 className="text-base font-bold text-white mb-2.5 flex items-center gap-2"><LayoutGrid className="w-5 h-5 text-cyan-400" />BABOK Bilgi Alanları</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {babokData.map(ka => {
            const done = ka.tasks.filter(t => completedTasks.includes(t.id)).length;
            const subDone = ka.tasks.flatMap(t => t.checklist).filter(c => completedSubTasks.includes(c.id)).length;
            const subTotal = ka.tasks.reduce((a, t) => a + t.checklist.length, 0);
            const totalItems = ka.tasks.length + subTotal;
            const doneItems = done + subDone;
            const pct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;
            const isComplete = totalItems > 0 && doneItems === totalItems;
            return (
              <div key={ka.id} onClick={() => { setActiveTab('knowledge_areas'); setExpandedKA(ka.id); }}
                className={`glass-card p-4 cursor-pointer hover:scale-[1.02] transition-all group ${isComplete ? 'neon-border-cyan' : 'hover:border-white/20'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${isComplete ? 'bg-emerald-500/15 border border-emerald-500/20' : ka.color}`}>
                    {isComplete ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : React.cloneElement(ka.icon, { className: 'w-5 h-5' })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold text-sm truncate ${isComplete ? 'text-emerald-400' : 'text-white'}`}>{ka.title}</h4>
                    <span className="text-xs text-slate-500">{doneItems}/{totalItems} görev</span>
                  </div>
                  {isComplete && <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-bold">✓</span>}
                </div>
                <div className="liquid-bar w-full h-2 mb-1.5">
                  <div className={`liquid-bar-fill ${isComplete ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`} style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-stat font-bold text-base text-slate-300">{pct}%</span>
                  <span className="text-xs text-slate-500">{done}/{ka.tasks.length} ana · {subDone}/{subTotal} alt</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
