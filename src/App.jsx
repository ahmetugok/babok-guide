import { useEffect } from 'react';
import {
  Layers,
  LayoutGrid, FileText,
  Sparkles, X, Copy, Loader2,
  AlertTriangle, Trash2, Plus, Download, ListChecks,
  FolderPlus, RotateCcw,
  BookMarked, Upload, Moon, Sun
} from 'lucide-react';

import { DEFAULT_PROJECT, TAB_ITEMS } from './constants/index.js';
import { babokData } from './data/babokData.jsx';
import { formatMarkdown } from './utils.js';

import { useProjectStore, selectActiveProject } from './store/projectStore.js';
import { useUIStore } from './store/uiStore.js';

import { DashboardTab } from './tabs/DashboardTab.jsx';
import { KnowledgeAreasTab } from './tabs/KnowledgeAreasTab.jsx';
import { AssumptionsTab } from './tabs/AssumptionsTab.jsx';
import { BusinessRulesTab } from './tabs/BusinessRulesTab.jsx';
import { ChangesTab } from './tabs/ChangesTab.jsx';
import { RisksTab } from './tabs/RisksTab.jsx';
import { ActionsTab } from './tabs/ActionsTab.jsx';
import { StakeholdersTab } from './tabs/StakeholdersTab.jsx';
import { RequirementsTab } from './tabs/RequirementsTab.jsx';
import { TraceabilityTab } from './tabs/TraceabilityTab.jsx';
import { MeetingsTab } from './tabs/MeetingsTab.jsx';
import { GanttTab } from './tabs/GanttTab.jsx';
import { TemplatesTab } from './tabs/TemplatesTab.jsx';

import { BusinessRuleModal } from './modals/BusinessRuleModal.jsx';
import { ChangeRequestModal } from './modals/ChangeRequestModal.jsx';
import { RiskModal } from './modals/RiskModal.jsx';
import { AssumptionModal } from './modals/AssumptionModal.jsx';
import { ActionModal } from './modals/ActionModal.jsx';
import { StakeholderModal } from './modals/StakeholderModal.jsx';
import { RequirementModal } from './modals/RequirementModal.jsx';
import { LinkCardModal } from './modals/LinkCardModal.jsx';
import { MeetingModal } from './modals/MeetingModal.jsx';
import { GanttModal } from './modals/GanttModal.jsx';
import { ExportModal } from './modals/ExportModal.jsx';
import { DocumentAnalysisModal } from './modals/DocumentAnalysisModal.jsx';

export default function App() {
  // ── Store reads ──────────────────────────────────────────────────────────
  const activeProject     = useProjectStore(selectActiveProject);
  const projects          = useProjectStore((s) => s.projects);
  const activeProjectId   = useProjectStore((s) => s.activeProjectId);
  const setActiveProjectId = useProjectStore((s) => s.setActiveProjectId);
  const deleteProject     = useProjectStore((s) => s.deleteProject);
  const createProject     = useProjectStore((s) => s.createProject);
  const importProject     = useProjectStore((s) => s.importProject);
  const {
    activeTab, darkMode, showBackupMenu, showFabMenu, showMobileMenu,
    showProjectModal, showResetConfirm,
    newProjectName, vaultHandle, vaultReady,
    riskModal, assumptionModal, actionModal, stakeholderModal,
    brModal, crModal, reqModal, meetingModal, ganttModal, linkCardModal,
    aiModal,
    setActiveTab, toggleDarkMode, setShowBackupMenu, setShowFabMenu, setShowMobileMenu,
    setShowProjectModal, setShowResetConfirm, setShowExportModal, setShowDocAnalysisModal,
    setNewProjectName, setVaultHandle, setVaultReady,
    openRiskModal, openReqModal, openActionModal,
    closeAiModal, handleRegenerateAI,
  } = useUIStore();

  // ── Computed totals ───────────────────────────────────────────────────────
  const completedTasks    = activeProject?.completedTasks || [];
  const completedSubTasks = activeProject?.completedSubTasks || [];
  const totalTasks        = babokData.reduce((acc, ka) => acc + ka.tasks.length, 0);
  const totalSubTasks     = babokData.reduce((acc, ka) => acc + ka.tasks.reduce((a, t) => a + t.checklist.length, 0), 0);
  const overallProgress   = Math.round(((completedTasks.length + completedSubTasks.length) / (totalTasks + totalSubTasks)) * 100) || 0;

  // ── File System API helpers ───────────────────────────────────────────────
  const openVault = async () => {
    try {
      const handle = await window.showDirectoryPicker({ mode: 'readwrite', startIn: 'documents' });
      setVaultHandle(handle);
      localStorage.setItem('babok_vault_name', handle.name);
      return handle;
    } catch { return null; }
  };

  const writeProjectFile = async (handle, project) => {
    if (!handle) return;
    try {
      const safeName = project.name.replace(/[^a-zA-Z0-9çÇğĞıİöÖşŞüÜ _-]/g, '_');
      const fileHandle = await handle.getFileHandle(`${safeName}.babok.json`, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(project, null, 2));
      await writable.close();
    } catch (err) { console.warn('Dosya yazılamadı:', err); }
  };

  const readAllProjectFiles = async (handle) => {
    if (!handle) return [];
    const ps = [];
    try {
      for await (const entry of handle.values()) {
        if (entry.kind === 'file' && entry.name.endsWith('.babok.json')) {
          try {
            const file = await entry.getFile();
            const data = JSON.parse(await file.text());
            if (data?.name) ps.push({ ...DEFAULT_PROJECT, ...data });
          } catch { /* skip invalid */ }
        }
      }
    } catch (err) { console.warn('Vault okunamadı:', err); }
    return ps;
  };

  const deleteProjectFile = async (handle, project) => {
    if (!handle) return;
    try {
      const safeName = project.name.replace(/[^a-zA-Z0-9çÇğĞıİöÖşŞüÜ _-]/g, '_');
      await handle.removeEntry(`${safeName}.babok.json`);
    } catch { /* file may not exist */ }
  };

  // ── Vault auto-save when projects change ─────────────────────────────────
  useEffect(() => {
    if (vaultHandle && vaultReady && activeProject) {
      writeProjectFile(vaultHandle, activeProject);
    }
  }, [projects, activeProjectId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Vault operations ──────────────────────────────────────────────────────
  const openVaultAndLoad = async () => {
    const handle = await openVault();
    if (!handle) return;
    const vaultProjects = await readAllProjectFiles(handle);
    if (vaultProjects.length > 0) {
      useProjectStore.setState({ projects: vaultProjects, activeProjectId: vaultProjects[0].id });
      alert(`Vault açıldı! ${vaultProjects.length} proje yüklendi.`);
    } else {
      alert('Vault bağlandı. Mevcut projeler vault klasörüne kaydedilecek.');
    }
    setVaultReady(true);
  };

  const saveAllToVault = async () => {
    let handle = vaultHandle;
    if (!handle) {
      handle = await openVault();
      if (!handle) return;
    }
    for (const p of projects) await writeProjectFile(handle, p);
    setVaultReady(true);
    alert(`${projects.length} proje vault klasörüne kaydedildi!`);
  };

  const exportProjectJSON = () => {
    const blob = new Blob([JSON.stringify(activeProject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${activeProject.name}_backup.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportProject = () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (data?.name) {
            const [np] = importProject(data);
            if (vaultHandle) writeProjectFile(vaultHandle, np);
            alert(`"${np.name}" projesi başarıyla içe aktarıldı!`);
          } else if (Array.isArray(data)) {
            const newPs = importProject(data);
            newPs.forEach((p) => { if (vaultHandle) writeProjectFile(vaultHandle, p); });
            alert(`${newPs.length} proje başarıyla içe aktarıldı!`);
          } else {
            alert('Geçersiz proje dosyası formatı.');
          }
        } catch { alert('Dosya okunamadı. Lütfen geçerli bir JSON dosyası seçin.'); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // ── Ring Chart SVG component ──────────────────────────────────────────────
  const RingChart = ({ progress, size = 160, stroke = 10 }) => {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (progress / 100) * circ;
    return (
      <div className="ring-chart">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#ringGrad)" strokeWidth={stroke}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }} />
          <defs><linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22d3ee" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs>
        </svg>
        <div className="ring-chart-label">
          <span className="font-stat text-3xl font-bold neon-cyan">{progress}%</span>
          <span className="text-[10px] text-slate-400 mt-0.5">{activeProject.name}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`aura-void min-h-screen font-sans ${darkMode ? 'theme-dark text-slate-200' : 'theme-light text-slate-800'}`}>
      {/* Void Background Beams */}
      <div className="void-beam void-beam-1" />
      <div className="void-beam void-beam-2" />
      <div className="void-beam void-beam-3" />

      {/* ===== FLOATING DOCK NAVIGATION (Desktop) ===== */}
      <nav className="aura-dock hidden lg:flex">
        {TAB_ITEMS.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => {
            if (id === 'export') { setShowExportModal(true); return; }
            setActiveTab(id);
          }}
            className={`aura-dock-item ${activeTab === id ? 'active' : ''}`} title={label}>
            <Icon className="w-[18px] h-[18px]" />
            <span className="dock-label">{label}</span>
          </button>
        ))}
        <button onClick={() => setShowDocAnalysisModal(true)} className="aura-dock-item" title="Döküman Analiz Et">
          <FileText className="w-[18px] h-[18px]" />
          <span className="dock-label">Dok. Analiz</span>
        </button>
        <div className="w-6 h-px bg-slate-700/50 my-1" />
        <div className="relative">
          <button onClick={() => setShowBackupMenu(!showBackupMenu)} className="aura-dock-item" title="Yedekle">
            <Download className="w-[18px] h-[18px]" />
            <span className="dock-label">Yedekle</span>
          </button>
          {showBackupMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowBackupMenu(false)} />
              <div className="absolute left-full bottom-0 ml-2 glass-card rounded-xl shadow-2xl border border-white/10 py-2 px-1 min-w-[160px] z-50">
                <button onClick={() => { exportProjectJSON(); setShowBackupMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors">
                  <Download className="w-4 h-4 text-cyan-400" /><span>JSON Yedek</span>
                </button>
                <button onClick={() => { setShowExportModal(true); setShowBackupMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors">
                  <FileText className="w-4 h-4 text-violet-400" /><span>BABOK Raporu</span>
                </button>
                <div className="border-t border-white/10 my-1" />
                <button onClick={() => { saveAllToVault(); setShowBackupMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors">
                  <FolderPlus className="w-4 h-4 text-amber-400" />
                  <span>{vaultHandle ? 'Vault Senkronla' : 'Vault Bağla'}</span>
                </button>
                {vaultHandle && (
                  <button onClick={async () => {
                    const vp = await readAllProjectFiles(vaultHandle);
                    if (vp.length > 0) {
                      useProjectStore.setState({ projects: vp, activeProjectId: vp[0].id });
                      alert(`${vp.length} proje vault'dan yüklendi!`);
                    } else alert('Vault klasöründe proje dosyası bulunamadı.');
                    setShowBackupMenu(false);
                  }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors">
                    <Upload className="w-4 h-4 text-emerald-400" /><span>Vault'dan Yükle</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </nav>

      {/* ===== MAIN CONTENT AREA ===== */}
      <div className="lg:ml-[78px] relative z-[1]">

        {/* Glass Header */}
        <header className="glass-panel sticky top-2 mx-3 lg:mx-5 mb-2 z-10">
          <div className="px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
            {/* Left: Project Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/10">
                  <Layers className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base font-bold text-white flex items-center gap-2">
                    <span>BABOK v3</span>
                    <span className="text-slate-400">·</span>
                    <span className="neon-cyan truncate max-w-[200px]">{activeProject.name}</span>
                  </h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <select value={activeProjectId} onChange={e => setActiveProjectId(e.target.value)}
                      className="text-xs rounded-lg px-2 py-0.5 max-w-[160px] border-none !bg-transparent !text-slate-400 focus:!text-slate-200 cursor-pointer">
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <button onClick={() => setShowProjectModal(true)} className="text-xs text-cyan-400/70 hover:text-cyan-300 transition-colors" title="Yeni Proje"><FolderPlus className="w-3.5 h-3.5" /></button>
                    <button onClick={handleImportProject} className="text-xs text-emerald-400/70 hover:text-emerald-300 transition-colors" title="JSON İçe Aktar"><Upload className="w-3.5 h-3.5" /></button>
                    {vaultHandle ? (
                      <span className="text-[9px] text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded-full font-medium" title={`Vault: ${vaultHandle.name}`}>📂 Vault</span>
                    ) : (
                      <button onClick={openVaultAndLoad} className="text-xs text-amber-400/70 hover:text-amber-300 transition-colors" title="Vault Klasörü Bağla"><FolderPlus className="w-3.5 h-3.5" /></button>
                    )}
                    {projects.length > 1 && (
                      <button onClick={() => {
                        if (window.confirm(`"${activeProject.name}" projesini silmek istiyor musunuz?`)) {
                          const proj = deleteProject(activeProjectId);
                          if (proj && vaultHandle) deleteProjectFile(vaultHandle, proj);
                        }
                      }} className="text-xs text-rose-400/60 hover:text-rose-400 transition-colors"><Trash2 className="w-3 h-3" /></button>
                    )}
                    <button onClick={() => setShowResetConfirm(true)} title="İlerlemeyi sıfırla" className="text-xs text-slate-400 hover:text-rose-400 transition-colors"><RotateCcw className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            </div>
            {/* Right: Theme Toggle + Progress Ring */}
            <div className="flex items-center gap-3">
              <button onClick={toggleDarkMode} className="theme-toggle" title={darkMode ? 'Açık Tema' : 'Koyu Tema'}>
                {darkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
              </button>
              <div className="hidden sm:flex flex-col items-end gap-0.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">İlerleme</span>
                <span className="text-xs text-slate-400">{completedTasks.length + completedSubTasks.length}/{totalTasks + totalSubTasks}</span>
              </div>
              <div className="relative w-14 h-14">
                <svg width={56} height={56} className="transform -rotate-90">
                  <circle cx={28} cy={28} r={22} fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth={5} />
                  <circle cx={28} cy={28} r={22} fill="none" stroke="url(#headerRingGrad)" strokeWidth={5}
                    strokeDasharray={138.23} strokeDashoffset={138.23 - (overallProgress / 100) * 138.23} strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }} />
                  <defs><linearGradient id="headerRingGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22d3ee" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-stat text-sm font-bold neon-cyan">{overallProgress}%</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="px-3 lg:px-5 pb-20 lg:pb-3">
          <div className="flex-1 space-y-3 min-w-0 aura-content-enter">

            {activeTab === 'dashboard'        && <DashboardTab RingChart={RingChart} />}
            {activeTab === 'assumptions'      && <AssumptionsTab />}
            {activeTab === 'businessrules'    && <BusinessRulesTab />}
            {activeTab === 'changes'          && <ChangesTab />}
            {activeTab === 'risks'            && <RisksTab />}
            {activeTab === 'actions'          && <ActionsTab />}
            {activeTab === 'stakeholders'     && <StakeholdersTab />}
            {activeTab === 'requirements'     && <RequirementsTab />}
            {activeTab === 'traceability'     && <TraceabilityTab />}
            {activeTab === 'meetings'         && <MeetingsTab />}
            {activeTab === 'gantt'            && <GanttTab />}
            {activeTab === 'knowledge_areas'  && <KnowledgeAreasTab babokData={babokData} />}
            {activeTab === 'templates'        && <TemplatesTab />}

          </div>
        </main>

        {/* ===== MODALS ===== */}
        {brModal.isOpen           && <BusinessRuleModal />}
        {crModal.isOpen           && <ChangeRequestModal />}
        {riskModal.isOpen         && <RiskModal />}
        {assumptionModal.isOpen   && <AssumptionModal />}
        {actionModal.isOpen       && <ActionModal />}
        {stakeholderModal.isOpen  && <StakeholderModal />}
        {reqModal.isOpen          && <RequirementModal />}
        {linkCardModal.isOpen     && <LinkCardModal />}
        {meetingModal.isOpen      && <MeetingModal />}
        {ganttModal.isOpen        && <GanttModal />}

        {/* AI GENERATION MODAL */}
        {aiModal.isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel w-full shadow-2xl max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
              <div className="bg-indigo-600/80 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-white">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-bold text-lg">AI Taslak: {aiModal.activeTask?.name}</h3>
                </div>
                <button onClick={closeAiModal} className="text-indigo-100 hover:text-white transition-colors focus:outline-none">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 bg-white/5">
                {aiModal.loading ? (
                  <div className="flex flex-col items-center justify-center h-48 text-indigo-600">
                    <Loader2 className="w-10 h-10 animate-spin mb-4" />
                    <p className="font-medium">Proje bağlamınıza göre özel dokümanlar hazırlanıyor...</p>
                    <p className="text-sm text-slate-400 mt-2">Bu işlem birkaç saniye sürebilir.</p>
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg shadow-black/20 overflow-x-auto">
                    <div className="text-slate-300 leading-relaxed text-[15px]"
                      dangerouslySetInnerHTML={formatMarkdown(aiModal.result)} />
                  </div>
                )}
              </div>
              <div className="bg-white/5 border-t border-white/10 p-4 flex justify-end gap-3">
                <button onClick={closeAiModal} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-white/10 rounded-md transition-colors">Kapat</button>
                {!aiModal.loading && (
                  <button onClick={handleRegenerateAI} className="px-4 py-2 text-sm font-medium bg-white/5 text-slate-300 hover:bg-white/10 rounded-md transition-colors flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />Yeniden Üret
                  </button>
                )}
                {!aiModal.loading && (
                  <button onClick={() => { navigator.clipboard.writeText(aiModal.result); alert('Taslak panoya kopyalandı!'); }}
                    className="px-4 py-2 text-sm font-medium bg-indigo-500/10 text-indigo-700 hover:bg-indigo-100 rounded-md transition-colors flex items-center gap-2">
                    <Copy className="w-4 h-4" />Kopyala
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* RESET CONFIRM MODAL */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel p-6 shadow-2xl max-w-sm w-full">
              <h3 className="font-bold text-lg text-slate-100 mb-2">İlerlemeyi Sıfırla</h3>
              <p className="text-sm text-slate-400 mb-5">Bu proje için tüm checklist ilerlemesi silinecek. Bu işlem geri alınamaz.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowResetConfirm(false)} className="px-4 py-2 text-sm text-slate-400 hover:bg-white/10 rounded-md">İptal</button>
                <button onClick={() => { useProjectStore.getState().resetProgress(); setShowResetConfirm(false); }}
                  className="px-4 py-2 text-sm bg-rose-600/80 hover:bg-rose-500 text-white rounded-md font-medium">Sıfırla</button>
              </div>
            </div>
          </div>
        )}

        {/* PROJECT CREATE MODAL */}
        {showProjectModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel p-6 shadow-2xl max-w-sm w-full">
              <h3 className="font-bold text-lg text-slate-100 mb-4 flex items-center gap-2"><FolderPlus className="text-cyan-400 w-5 h-5" />Yeni Proje Oluştur</h3>
              <input
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newProjectName.trim()) {
                    const np = createProject(newProjectName);
                    if (vaultHandle) writeProjectFile(vaultHandle, np);
                    setNewProjectName('');
                    setShowProjectModal(false);
                  }
                }}
                placeholder="Proje adı*"
                className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300 mb-4"
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowProjectModal(false)} className="px-4 py-2 text-sm text-slate-400 hover:bg-white/10 rounded-md">İptal</button>
                <button onClick={() => {
                  if (!newProjectName.trim()) return;
                  const np = createProject(newProjectName);
                  if (vaultHandle) writeProjectFile(vaultHandle, np);
                  setNewProjectName('');
                  setShowProjectModal(false);
                }} className="px-4 py-2 text-sm bg-cyan-600/80 hover:bg-cyan-500 text-white rounded-md font-medium">Oluştur</button>
              </div>
            </div>
          </div>
        )}

        {/* EXPORT MODAL */}
        <ExportModal />

        {/* DOCUMENT ANALYSIS MODAL */}
        <DocumentAnalysisModal />

      </div>{/* end lg:ml-[78px] */}

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <nav className="aura-mobile-nav lg:hidden">
        {[TAB_ITEMS[0], TAB_ITEMS[5], TAB_ITEMS[6], TAB_ITEMS[8]].map(({ id, Icon }) => (
          <button key={id} onClick={() => { setActiveTab(id); setShowFabMenu(false); setShowMobileMenu(false); }}
            className={`mobile-nav-item ${activeTab === id ? 'active' : ''}`}>
            <Icon className="w-5 h-5" />
          </button>
        ))}
        <button onClick={() => { setShowMobileMenu(true); setShowFabMenu(false); }} className="mobile-nav-item">
          <LayoutGrid className="w-5 h-5" />
        </button>
        <button onClick={() => setShowFabMenu(!showFabMenu)} className="aura-fab">
          {showFabMenu ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </button>
      </nav>

      {/* ===== MOBILE ALL-MODULES DRAWER ===== */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-60 lg:hidden flex flex-col justify-end" onClick={() => setShowMobileMenu(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative glass-panel rounded-t-2xl p-5 pb-8 shadow-2xl" style={{ maxHeight: '70vh' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-slate-300">Tüm Modüller</p>
              <button onClick={() => setShowMobileMenu(false)} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-4 gap-2 overflow-y-auto" style={{ maxHeight: 'calc(70vh - 60px)' }}>
              {TAB_ITEMS.map(({ id, label, Icon }) => (
                <button key={id} onClick={() => {
                  setShowMobileMenu(false);
                  if (id === 'export') { setShowExportModal(true); return; }
                  setActiveTab(id);
                }} className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl text-center transition-colors ${activeTab === id ? 'bg-cyan-500/15 text-cyan-400' : 'hover:bg-white/5 text-slate-400'}`}>
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAB Quick-Add Menu (Mobile) */}
      {showFabMenu && (
        <div className="fab-menu lg:hidden" onClick={() => setShowFabMenu(false)}>
          <div className="fab-menu-items" onClick={e => e.stopPropagation()}>
            <button className="fab-menu-item" onClick={() => { setShowFabMenu(false); setActiveTab('risks'); openRiskModal(); }}>
              <AlertTriangle className="w-6 h-6 text-rose-400" />Risk Ekle
            </button>
            <button className="fab-menu-item" onClick={() => { setShowFabMenu(false); setActiveTab('requirements'); openReqModal(); }}>
              <BookMarked className="w-6 h-6 text-cyan-400" />Gereksinim
            </button>
            <button className="fab-menu-item" onClick={() => { setShowFabMenu(false); setActiveTab('actions'); openActionModal(); }}>
              <ListChecks className="w-6 h-6 text-violet-400" />Aksiyon
            </button>
            <button className="fab-menu-item" onClick={() => { setShowFabMenu(false); setActiveTab('knowledge_areas'); useUIStore.getState().aiModal.isOpen || useUIStore.setState(s => ({ aiModal: { ...s.aiModal, isOpen: true } })); }}>
              <Sparkles className="w-6 h-6 text-amber-400" />AI'a Sor
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
