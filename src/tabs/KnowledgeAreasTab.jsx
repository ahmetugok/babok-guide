import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, Circle, ChevronDown, ChevronRight, FileText,
  CheckSquare, Square, Sparkles, Bot, Lightbulb, Play, Square as StopIcon, Clock
} from 'lucide-react';
import { formatDuration, startTimer, stopTimer, getActiveTimer, getAllActiveTimers } from '../utils/timeTracker.js';
import { useProjectStore, selectActiveProject } from '../store/projectStore.js';
import { useUIStore } from '../store/uiStore.js';

export function KnowledgeAreasTab({ babokData }) {
  const activeProject     = useProjectStore(selectActiveProject);
  const updateActive      = useProjectStore((s) => s.updateActive);
  const toggleTask        = useProjectStore((s) => s.toggleTask);
  const toggleSubTask     = useProjectStore((s) => s.toggleSubTask);
  const markAllKA         = useProjectStore((s) => s.markAllKA);
  const expandedKA        = useUIStore((s) => s.expandedKA);
  const setExpandedKA     = useUIStore((s) => s.setExpandedKA);
  const selectedTask      = useUIStore((s) => s.selectedTask);
  const setSelectedTask   = useUIStore((s) => s.setSelectedTask);
  const setIsContextSaved = useUIStore((s) => s.setIsContextSaved);
  const isContextSaved    = useUIStore((s) => s.isContextSaved);
  const handleOpenAIModal = useUIStore((s) => s.handleOpenAIModal);

  const completedTasks    = activeProject?.completedTasks || [];
  const completedSubTasks = activeProject?.completedSubTasks || [];
  const projectContext    = activeProject?.projectContext || '';
  const setProjectContext = (v) => updateActive((p) => ({ ...p, projectContext: typeof v === 'function' ? v(p.projectContext) : v }));

  const handleTaskClick = (task) => {
    setSelectedTask(selectedTask?.id === task.id ? null : task);
  };

  const handleToggleTask = (taskId, e) => {
    e.stopPropagation();
    toggleTask(taskId);
  };

  const handleMarkAllKA = (ka, e) => {
    e.stopPropagation();
    markAllKA(ka);
  };
  const [runningKaId, setRunningKaId] = useState(null);
  const [tick, setTick]               = useState(0); // yeniden render için

  // Mount: localStorage'da aktif BABOK alan timer'ı var mı?
  useEffect(() => {
    const active = getAllActiveTimers();
    const kaKeys = babokData.map(ka => 'babok_area_' + ka.id);
    const found = active.find(id => kaKeys.includes(id));
    if (found) setRunningKaId(found.replace('babok_area_', ''));
  }, []);

  useEffect(() => {
    if (!runningKaId) return;
    const iv = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, [runningKaId]);

  function startKaTimer(kaId) {
    if (runningKaId) stopKaTimer();
    startTimer('babok_area_' + kaId);
    setRunningKaId(kaId);
  }

  function stopKaTimer() {
    const minutes = stopTimer('babok_area_' + runningKaId);
    const key = 'area_' + runningKaId;
    if (minutes > 0 && updateActive) {
      updateActive(p => ({
        ...p,
        completedTaskDurations: {
          ...(p.completedTaskDurations || {}),
          [key]: ((p.completedTaskDurations || {})[key] || 0) + minutes,
        },
      }));
    }
    setRunningKaId(null);
  }

  const pad = n => String(n).padStart(2, '0');
  const elapsedSec = runningKaId ? (getActiveTimer('babok_area_' + runningKaId).elapsedSeconds || 0) : 0;
  const elapsedDisplay = `⏱ ${pad(Math.floor(elapsedSec / 3600))}:${pad(Math.floor((elapsedSec % 3600) / 60))}:${pad(elapsedSec % 60)}`;

  return (
    <>
      {/* AI CONTEXT INPUT SECTION */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-5 rounded-xl border border-indigo-500/15 mb-6 shadow-lg shadow-black/20">
        <div className="flex items-start gap-3 mb-3">
          <Bot className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-indigo-900 text-lg flex items-center gap-2">
              ✨ Yapay Zeka (AI) İçin Proje Bağlamı
            </h3>
            <p className="text-sm text-indigo-700 mt-1">
              Aşağıya projenizi kısaca özetleyin (Örn: "Restoranlar için QR menü uygulaması", "Banka çalışanları için yeni izin sistemi"). Yapay zeka, bu bilgiye dayanarak her BABOK adımı için size özel doküman taslakları üretecektir.
            </p>
          </div>
        </div>
        <textarea
          className="w-full p-3 rounded-lg border border-indigo-500/20 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all text-sm text-slate-300 resize-none"
          rows="3"
          placeholder="Projenizin konusu ve hedefleri nedir?"
          value={projectContext}
          onChange={(e) => {
            setProjectContext(e.target.value);
            setIsContextSaved(false);
          }}
        ></textarea>
        <div className="mt-3 flex justify-end items-center gap-3">
          {isContextSaved && (
            <span className="text-sm text-emerald-600 font-medium flex items-center gap-1.5 animate-in fade-in slide-in-from-right-2 duration-300">
              <CheckCircle2 className="w-4 h-4" /> Bağlam Kaydedildi!
            </span>
          )}
          <button
            onClick={() => {
              if (projectContext.trim()) {
                setIsContextSaved(true);
                setTimeout(() => setIsContextSaved(false), 3000);
              }
            }}
            className="bg-indigo-600/80 hover:bg-indigo-500 text-white text-sm font-medium py-2 px-5 rounded-md transition-colors shadow-lg shadow-black/20 flex items-center gap-2"
          >
            Kaydet ve Onayla
          </button>
        </div>
      </div>

      {babokData.map((ka) => {
        const kaCompletedTasks = ka.tasks.filter(t => completedTasks.includes(t.id)).length;
        const isAllComplete = kaCompletedTasks === ka.tasks.length;
        const isExpanded = expandedKA === ka.id;

        return (
          <div key={ka.id} className={`bg-white/5 rounded-xl shadow-lg shadow-black/20 border overflow-hidden transition-all mb-4 ${isAllComplete ? 'border-green-500/20' : runningKaId === ka.id ? 'ring-2 ring-cyan-400 border-cyan-400/40' : 'border-white/10'}`}>
            {/* KA Header */}
            <div
              className={`p-4 cursor-pointer flex items-center justify-between hover:bg-white/5 transition-colors ${isExpanded ? 'bg-white/5 border-b border-white/10' : ''}`}
              onClick={() => setExpandedKA(isExpanded ? null : ka.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${ka.color} ${isAllComplete ? 'bg-green-100 border-green-500/20' : ''}`}>
                  {isAllComplete ? <CheckCircle2 className="w-6 h-6 text-green-600" /> : ka.icon}
                </div>
                <div>
                  <h2 className={`font-bold text-lg ${ka.headerColor}`}>{ka.title}</h2>
                  <p className="text-sm text-slate-400 hidden md:block">{ka.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isAllComplete && (
                  <button
                    onClick={(e) => handleMarkAllKA(ka, e)}
                    className="text-xs text-emerald-700 bg-emerald-500/10 hover:bg-emerald-100 border border-emerald-500/20 px-2 py-1 rounded-md transition-colors shrink-0"
                  >
                    Tümünü İşaretle
                  </button>
                )}
                {/* Alan bazlı timer + manuel giriş */}
                {runningKaId === ka.id ? (
                  <button
                    onClick={e => { e.stopPropagation(); stopKaTimer(); }}
                    className="flex items-center gap-1 text-xs bg-rose-500/15 text-rose-600 border border-rose-200/30 rounded-lg px-2.5 py-1.5 animate-pulse shrink-0"
                  >
                    <StopIcon className="w-3 h-3" />
                    {`■ ${Math.floor(elapsedSec / 60)} dk`}
                  </button>
                ) : (
                  <button
                    onClick={e => { e.stopPropagation(); startKaTimer(ka.id); }}
                    className="flex items-center gap-1 text-xs bg-emerald-500/15 text-emerald-700 border border-emerald-200/30 rounded-lg px-2.5 py-1.5 hover:bg-emerald-500/25 transition-colors shrink-0"
                  >
                    <Play className="w-3 h-3" />Başlat
                  </button>
                )}
                <input
                  type="number" min="0"
                  value={(activeProject?.completedTaskDurations || {})['area_' + ka.id] || 0}
                  onClick={e => e.stopPropagation()}
                  onChange={e => { e.stopPropagation(); const v = Math.max(0, parseInt(e.target.value) || 0); updateActive && updateActive(p => ({ ...p, completedTaskDurations: { ...(p.completedTaskDurations || {}), ['area_' + ka.id]: v } })); }}
                  className="w-14 text-center text-xs bg-white/5 border border-white/10 rounded-lg px-1 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 shrink-0"
                />
                <span className="text-[10px] text-slate-500 shrink-0">dk</span>
                <span className="text-sm font-medium text-slate-400 bg-white/10 px-2 py-1 rounded-md">
                  {kaCompletedTasks}/{ka.tasks.length}
                </span>
                {isExpanded ? <ChevronDown className="text-slate-400" /> : <ChevronRight className="text-slate-400" />}
              </div>
            </div>

            {runningKaId === ka.id && (
              <div className="px-4 py-1.5 bg-cyan-500/5 border-b border-cyan-500/10 flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-300 animate-pulse">{elapsedDisplay}</span>
                <span className="text-xs text-slate-500">— kayıt devam ediyor</span>
              </div>
            )}

            {/* KA Tasks */}
            {isExpanded && (
              <div className="divide-y divide-slate-100 bg-white/5">
                {ka.tasks.map(task => {
                  const isTaskCompleted = completedTasks.includes(task.id);
                  const isTaskSelected = selectedTask?.id === task.id;

                  const subTasksTotal = task.checklist.length;
                  const subTasksCompleted = task.checklist.filter(c => completedSubTasks.includes(c.id)).length;
                  const subTaskProgress = Math.round((subTasksCompleted / subTasksTotal) * 100) || 0;

                  return (
                    <div key={task.id} className="flex flex-col">
                      <div
                        className={`p-4 pl-6 md:pl-16 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors ${isTaskSelected ? 'bg-white/5' : ''}`}
                        onClick={() => handleTaskClick(task)}
                      >
                        <button
                          onClick={(e) => handleToggleTask(task.id, e)}
                          className="focus:outline-none shrink-0"
                          title="Ana Görevi Tamamla"
                        >
                          {isTaskCompleted ? (
                            <CheckCircle2 className="w-6 h-6 text-green-500 hover:text-green-600 transition-colors" />
                          ) : (
                            <Circle className="w-6 h-6 text-slate-300 hover:text-blue-500 transition-colors" />
                          )}
                        </button>

                        <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <span className={`font-medium ${isTaskCompleted ? 'text-slate-400 line-through' : 'text-slate-300'}`}>
                            {task.name}
                          </span>

                          <div className="flex items-center gap-2 w-24">
                            <div className="w-full bg-slate-200 rounded-full h-1.5">
                              <div className={`h-1.5 rounded-full ${subTaskProgress === 100 ? 'bg-green-500' : 'bg-blue-400'}`} style={{ width: `${subTaskProgress}%` }}></div>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">{subTasksCompleted}/{subTasksTotal}</span>
                          </div>
                        </div>

                        {isTaskSelected ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
                      </div>

                      {/* Task Detail Inline Drawer with Checklist */}
                      {isTaskSelected && (
                        <div className="pl-14 md:pl-24 pr-4 pb-4 bg-white/5">
                          <div className="bg-white/5 border border-white/10 rounded-lg p-5 shadow-lg shadow-black/20">

                            <div className="flex justify-between items-start gap-4 mb-4">
                              <p className="text-sm text-slate-400 italic border-l-2 border-white/15 pl-3">
                                {task.purpose}
                              </p>
                              <button
                                onClick={() => handleOpenAIModal(task, ka.title)}
                                className="shrink-0 bg-indigo-600/80 hover:bg-indigo-500 text-white text-xs font-bold py-2 px-3 rounded-md flex items-center gap-1.5 transition-colors shadow-lg shadow-black/20"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>AI Taslak Üret</span>
                              </button>
                            </div>

                            {/* Deliverables Banner */}
                            <div className="bg-white/5 border border-white/10 rounded-md p-3 mb-5 flex gap-3 items-center">
                              <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                              <div>
                                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Beklenen Çıktılar (Deliverables)</h5>
                                <p className="text-sm font-medium text-slate-100">{task.deliverables}</p>
                              </div>
                            </div>

                            {/* Actionable Detailed Checklist */}
                            <h4 className="font-bold text-slate-100 mb-3 flex items-center gap-2">
                              <CheckSquare className="w-4 h-4 text-blue-600" /> Operasyonel Checklist
                            </h4>

                            <div className="space-y-2 mb-6">
                              {task.checklist.map((item) => {
                                const isChecked = completedSubTasks.includes(item.id);
                                return (
                                  <div
                                    key={item.id}
                                    className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors ${isChecked ? 'bg-green-50/50 border-green-100' : 'bg-white/5 border-white/10 hover:border-blue-500/30 hover:bg-white/5'}`}
                                    onClick={() => toggleSubTask(item.id)}
                                  >
                                    <div className="mt-0.5 shrink-0">
                                      {isChecked ? (
                                        <CheckSquare className="w-5 h-5 text-green-600" />
                                      ) : (
                                        <Square className="w-5 h-5 text-slate-300" />
                                      )}
                                    </div>
                                    <span className={`text-sm leading-relaxed ${isChecked ? 'text-slate-400 line-through' : 'text-slate-300'}`}>
                                      {item.text}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Tip Box */}
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-3 flex gap-3 items-start">
                              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                              <p className="text-sm text-amber-900 leading-relaxed">
                                <strong className="block mb-1">Analist İpucu:</strong> {task.tips}
                              </p>
                            </div>

                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {/* Toplam alan süresi */}
            {(() => {
              const areaTotal = (activeProject?.completedTaskDurations || {})['area_' + ka.id] || 0;
              if (areaTotal === 0) return null;
              return (
                <div className="px-4 py-2 border-t border-white/5 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-xs text-slate-400">Bu alanda toplam: <span className="text-cyan-400 font-medium">{formatDuration(areaTotal)}</span></span>
                </div>
              );
            })()}
          </div>
        );
      })}
    </>
  );
}
