import { useEffect, lazy, Suspense } from 'react';
import {
  Layers,
  LayoutGrid, FileText,
  Sparkles, X,
  AlertTriangle, Trash2, Plus, Download, ListChecks,
  FolderPlus, RotateCcw,
  BookMarked, Upload, Moon, Sun, Settings
} from 'lucide-react';

import { DEFAULT_PROJECT, TAB_ITEMS } from './constants/index.js';
import { babokData, TOTAL_TASKS, TOTAL_SUBTASKS } from './data/babokData.jsx';

import { useProjectStore, selectActiveProject } from './store/projectStore.js';
import { useUIStore } from './store/uiStore.js';

const DashboardTab     = lazy(() => import('./tabs/DashboardTab.jsx').then(m => ({ default: m.DashboardTab })));
const KnowledgeAreasTab= lazy(() => import('./tabs/KnowledgeAreasTab.jsx').then(m => ({ default: m.KnowledgeAreasTab })));
const AssumptionsTab   = lazy(() => import('./tabs/AssumptionsTab.jsx').then(m => ({ default: m.AssumptionsTab })));
const BusinessRulesTab = lazy(() => import('./tabs/BusinessRulesTab.jsx').then(m => ({ default: m.BusinessRulesTab })));
const ChangesTab       = lazy(() => import('./tabs/ChangesTab.jsx').then(m => ({ default: m.ChangesTab })));
const RisksTab         = lazy(() => import('./tabs/RisksTab.jsx').then(m => ({ default: m.RisksTab })));
const ActionsTab       = lazy(() => import('./tabs/ActionsTab.jsx').then(m => ({ default: m.ActionsTab })));
const StakeholdersTab  = lazy(() => import('./tabs/StakeholdersTab.jsx').then(m => ({ default: m.StakeholdersTab })));
const RequirementsTab  = lazy(() => import('./tabs/RequirementsTab.jsx').then(m => ({ default: m.RequirementsTab })));
const TraceabilityTab  = lazy(() => import('./tabs/TraceabilityTab.jsx').then(m => ({ default: m.TraceabilityTab })));
const MeetingsTab      = lazy(() => import('./tabs/MeetingsTab.jsx').then(m => ({ default: m.MeetingsTab })));
const GanttTab         = lazy(() => import('./tabs/GanttTab.jsx').then(m => ({ default: m.GanttTab })));
const TemplatesTab     = lazy(() => import('./tabs/TemplatesTab.jsx').then(m => ({ default: m.TemplatesTab })));
const GlossaryTab      = lazy(() => import('./tabs/GlossaryTab.jsx').then(m => ({ default: m.GlossaryTab })));

import { ModalManager } from './components/ModalManager.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { TabFallback } from './components/LoadingFallback.jsx';
import { openVault, writeProjectFile, readAllProjectFiles, deleteProjectFile } from './utils/vaultStorage.js';

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
    vaultHandle, vaultReady,
    setActiveTab, toggleDarkMode, setShowBackupMenu, setShowFabMenu, setShowMobileMenu,
    openModal,
    setVaultHandle, setVaultReady,
  } = useUIStore();

  // ── Computed totals ───────────────────────────────────────────────────────
  const completedTasks    = activeProject?.completedTasks || [];
  const completedSubTasks = activeProject?.completedSubTasks || [];
  const overallProgress   = Math.round(((completedTasks.length + completedSubTasks.length) / (TOTAL_TASKS + TOTAL_SUBTASKS)) * 100) || 0;

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
    setVaultHandle(handle);
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
      setVaultHandle(handle);
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
            if (id === 'export') { openModal('export'); return; }
            setActiveTab(id);
          }}
            className={`aura-dock-item ${activeTab === id ? 'active' : ''}`} title={label}>
            <Icon className="w-[18px] h-[18px]" />
            <span className="dock-label">{label}</span>
          </button>
        ))}
        <button onClick={() => openModal('documentAnalysis')} className="aura-dock-item" title="Döküman Analiz Et">
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
                <button onClick={() => { openModal('export'); setShowBackupMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors">
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
                    <button onClick={() => openModal('projectCreate')} className="text-xs text-cyan-400/70 hover:text-cyan-300 transition-colors" title="Yeni Proje"><FolderPlus className="w-3.5 h-3.5" /></button>
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
                    <button onClick={() => openModal('resetConfirm')} title="İlerlemeyi sıfırla" className="text-xs text-slate-400 hover:text-rose-400 transition-colors"><RotateCcw className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            </div>
            {/* Right: Theme Toggle + Progress Ring */}
            <div className="flex items-center gap-3">
              <button onClick={() => openModal('settings')} className="theme-toggle" title="Ayarlar">
                <Settings className="w-[18px] h-[18px]" />
              </button>
              <button onClick={toggleDarkMode} className="theme-toggle" title={darkMode ? 'Açık Tema' : 'Koyu Tema'}>
                {darkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
              </button>
              <div className="hidden sm:flex flex-col items-end gap-0.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">İlerleme</span>
                <span className="text-xs text-slate-400">{completedTasks.length + completedSubTasks.length}/{TOTAL_TASKS + TOTAL_SUBTASKS}</span>
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

            <ErrorBoundary key={activeTab}>
              <Suspense fallback={<TabFallback activeTab={activeTab} />}>
                {activeTab === 'dashboard'        && <DashboardTab />}
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
                {activeTab === 'knowledge_areas'  && <KnowledgeAreasTab />}
                {activeTab === 'templates'        && <TemplatesTab />}
                {activeTab === 'glossary'         && <GlossaryTab />}
              </Suspense>
            </ErrorBoundary>

          </div>
        </main>

        {/* ===== MODAL MANAGER ===== */}
        <ModalManager />

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
                  if (id === 'export') { openModal('export'); return; }
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
            <button className="fab-menu-item" onClick={() => { setShowFabMenu(false); setActiveTab('risks'); openModal('risk'); }}>
              <AlertTriangle className="w-6 h-6 text-rose-400" />Risk Ekle
            </button>
            <button className="fab-menu-item" onClick={() => { setShowFabMenu(false); setActiveTab('requirements'); openModal('requirement'); }}>
              <BookMarked className="w-6 h-6 text-cyan-400" />Gereksinim
            </button>
            <button className="fab-menu-item" onClick={() => { setShowFabMenu(false); setActiveTab('actions'); openModal('action'); }}>
              <ListChecks className="w-6 h-6 text-violet-400" />Aksiyon
            </button>
            <button className="fab-menu-item" onClick={() => { setShowFabMenu(false); setActiveTab('knowledge_areas'); }}>
              <Sparkles className="w-6 h-6 text-amber-400" />AI'a Sor
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
