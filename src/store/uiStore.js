import { create } from 'zustand';
import { useProjectStore, selectActiveProject } from './projectStore.js';
import { formatMarkdown } from '../utils.js';

// ── Gemini API yardımcısı (sadece uiStore içinde kullanılır) ─────────────────
const generateWithGemini = async (promptText) => {
  const apiKey = ''; // API key will be provided by execution environment
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  let retries = 0;
  const maxRetries = 5;
  const delays = [1000, 2000, 4000, 8000, 16000];

  while (retries <= maxRetries) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: 'Sen 15 yıllık deneyimli, CBAP sertifikalı Kıdemli bir IT İş Analistisin. Kullanıcının verdiği proje bağlamına %100 sadık kalarak eksiksiz, profesyonel, gerçeğe yakın ve doğrudan kullanılabilecek BABOK dokümanları hazırlarsın. Asla tavsiye vermezsin, doğrudan istenen çıktıyı (rapor, taslak vb.) sunarsın.',
              },
            ],
          },
          contents: [{ parts: [{ text: promptText }] }],
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        if (
          response.status >= 400 &&
          response.status < 500 &&
          response.status !== 429
        ) {
          return `API İsteği Reddedildi (${response.status}): Gönderilen bilgilerde bir hata var.\n\nDetay: ${errText}`;
        }
        throw new Error(`HTTP error! status: ${response.status}, message: ${errText}`);
      }

      const data = await response.json();
      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Maalesef geçerli bir yanıt oluşturulamadı.'
      );
    } catch (error) {
      if (retries === maxRetries) {
        console.error('Gemini API Hatası:', error);
        return `Üzgünüm, yapay zeka servisine şu an erişilemiyor veya ağ hatası oluştu. Lütfen daha sonra tekrar deneyin.\n\nDetay: ${error.message}`;
      }
      await new Promise((resolve) => setTimeout(resolve, delays[retries]));
      retries++;
    }
  }
};

// ── Default form değerleri ──────────────────────────────────────────────────
export const DEFAULT_RISK_FORM = {
  title: '',
  category: '',
  probability: 2,
  impact: 2,
  owner: '',
  mitigation: '',
  status: 'Açık',
  linkedRequirementId: '',
  linkedAssumptionId: '',
  affectedStakeholderId: '',
  triggerDescription: '',
};
export const DEFAULT_ASSUMPTION_FORM = {
  title: '',
  content: '',
  type: 'Varsayim',
  category: 'Is',
  ownerId: '',
  validationStatus: 'Dogrulanmadi',
  validationDate: '',
  linkedRequirements: '',
  linkedRisks: '',
  notes: '',
};
export const DEFAULT_ACTION_FORM = {
  title: '',
  owner: '',
  dueDate: '',
  status: 'Bekliyor',
  source: '',
  notes: '',
  linkedRequirementId: '',
  sourceMeetingId: '',
  duration: 0,
  predecessorId: '',              // önkoşul action ID
};
export const DEFAULT_STAKEHOLDER_FORM = {
  name: '',
  role: '',
  department: '',
  interest: 2,
  influence: 2,
  raci: 'I',
  notes: '',
};
export const DEFAULT_BR_FORM = {
  title: '',
  ruleText: '',
  category: 'Surec',
  source: 'Sirket Politikasi',
  sourceRef: '',
  version: 'v1.0',
  status: 'Aktif',
  linkedRequirements: '',
  linkedStakeholderId: '',
  notes: '',
};
export const DEFAULT_CR_FORM = {
  title: '',
  changeType: 'Yeni Ekleme',
  affectedEntityType: 'Gereksinim',
  affectedEntityId: '',
  changeDescription: '',
  businessDriver: '',
  requestingStakeholderId: '',
  impactAnalysis: '',
  linkedMeetingId: '',
  status: 'Bekliyor',
  decisionDate: '',
  decisionNote: '',
};
export const DEFAULT_REQ_FORM = {
  name: '',
  objective: '',
  module: '',
  status: 'Taslak',
  testId: '',
  notes: '',
  moscow: '',
  requirementType: '',
  sourceMeetingId: '',
  acceptanceCriteria: '',
  approvalStatus: 'Taslak',
  approvedById: '',
  babokKnowledgeArea: '',
  functionalType: '',
  nfCategory: '',
  // R4 — Hiyerarşi & User Story
  hierarchyType: 'requirement',   // 'epic' | 'story' | 'requirement'
  parentId: '',                   // parent epic/story ID
  userStoryRole: '',              // "As a [rol]..."
  userStoryAction: '',            // "I want [aksiyon]..."
  userStoryBenefit: '',           // "So that [fayda]..."
  gherkinScenarios: [],           // [{ given, when, then }]
  predecessorId: '',              // önkoşul req ID
};

export const DEFAULT_GLOSSARY_FORM = {
  term: '',
  definition: '',
  source: '',
  linkedRequirementId: '',
};
export const DEFAULT_MEETING_FORM = {
  topic: '',
  attendees: '',
  date: new Date().toISOString().split('T')[0],
  duration: 0,
};
export const DEFAULT_GANTT_FORM = {
  name: '',
  startDate: '',
  endDate: '',
  color: '#3b82f6',
  category: '',
  assignedTo: '',
  progress: 0,
  delayReason: '',
};

export const useUIStore = create((set, get) => ({
  // ── Navigation ────────────────────────────────────────────────────────────
  activeTab: 'dashboard',
  expandedKA: 'ka1',
  selectedTask: null,
  showDashboardDetail: null,
  ganttZoom: 'month',
  reqFilter: 'all',
  focusedStakeholderId: null,

  // ── UI flags ──────────────────────────────────────────────────────────────
  showBackupMenu: false,
  darkMode: localStorage.getItem('babok_darkMode') === 'true',
  showFabMenu: false,
  showMobileMenu: false,

  // ── Project UI ────────────────────────────────────────────────────────────
  newProjectName: '',

  // ── Merkezi Modal State ───────────────────────────────────────────────────
  // activeModal: null | 'risk' | 'assumption' | 'action' | 'stakeholder' |
  //              'businessRule' | 'changeRequest' | 'requirement' | 'meeting' |
  //              'gantt' | 'linkCard' | 'export' | 'settings' |
  //              'documentAnalysis' | 'aiGeneration' | 'projectCreate' | 'resetConfirm'
  activeModal: null,
  modalData: {},       // { editingId?, entityType?, entityId?, loading?, result?, activeTask? }
  isContextSaved: false,

  // ── Meeting notes ─────────────────────────────────────────────────────────
  selectedMeetingId: null,
  newNoteType: 'Karar',
  newNoteText: '',

  // ── Vault ─────────────────────────────────────────────────────────────────
  vaultHandle: null,
  vaultReady: false,

  // ── Navigation actions ────────────────────────────────────────────────────
  setActiveTab: (tab) => set({ activeTab: tab, showDashboardDetail: null }),
  setExpandedKA: (ka) => set({ expandedKA: ka }),
  setSelectedTask: (task) => set({ selectedTask: task }),
  setShowDashboardDetail: (v) => set({ showDashboardDetail: v }),
  setGanttZoom: (zoom) => set({ ganttZoom: zoom }),
  setReqFilter: (f) => set({ reqFilter: f }),
  setFocusedStakeholderId: (id) => set({ focusedStakeholderId: id }),

  // ── UI flag actions ───────────────────────────────────────────────────────
  setShowBackupMenu: (v) => set({ showBackupMenu: v }),
  toggleDarkMode: () =>
    set((s) => {
      const newVal = !s.darkMode;
      localStorage.setItem('babok_darkMode', String(newVal));
      return { darkMode: newVal };
    }),
  setShowFabMenu: (v) => set({ showFabMenu: v }),
  setShowMobileMenu: (v) => set({ showMobileMenu: v }),

  // ── Project UI actions ────────────────────────────────────────────────────
  setNewProjectName: (v) => set({ newProjectName: v }),

  // ── Merkezi Modal actions ─────────────────────────────────────────────────
  openModal: (modalName, data = {}) => set({ activeModal: modalName, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: {} }),

  // ── Meeting notes actions ─────────────────────────────────────────────────
  setSelectedMeetingId: (id) => set({ selectedMeetingId: id }),
  setNewNoteType: (t) => set({ newNoteType: t }),
  setNewNoteText: (t) => set({ newNoteText: t }),

  // ── Vault actions ─────────────────────────────────────────────────────────
  setVaultHandle: (h) => set({ vaultHandle: h }),
  setVaultReady: (v) => set({ vaultReady: v }),

  // ── AI actions ────────────────────────────────────────────────────────────
  setIsContextSaved: (v) => set({ isContextSaved: v }),

  handleRegenerateAI: () => {
    const { modalData } = get();
    if (modalData.activeTask) {
      get().handleOpenAIModal(modalData.activeTask, '');
    }
  },

  handleOpenAIModal: async (task, kaTitle) => {
    const activeProject = selectActiveProject(useProjectStore.getState());
    const projectContext = activeProject?.projectContext || '';

    if (!projectContext.trim()) {
      alert(
        "Lütfen önce ekranın üst kısmından projenizin genel konusunu (bağlamını) girin ve 'Kaydet ve Onayla' butonuna basın. Böylece size özel taslaklar üretebilirim."
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    set({
      activeModal: 'aiGeneration',
      modalData: { loading: true, result: '', activeTask: task },
    });

    const checklistText = task.checklist.map((c) => `- ${c.text}`).join('\n');
    const prompt = `
LÜTFEN ŞU PROJE İÇİN ÖZEL BİR ÇIKTI ÜRET:
"${projectContext}"

BULUNDUĞUN BABOK AŞAMASI:
Bilgi Alanı: ${kaTitle}
Görev: ${task.name}
Görevin Amacı: ${task.purpose}
Beklenen Çıktılar (Deliverables): ${task.deliverables}

Analist olarak kontrol ettiğin detaylı alt görevler şunlar:
${checklistText}

TALİMATLAR (ÇOK ÖNEMLİ):

Yukarıdaki "PROJE BAĞLAMI" dikkate alınarak, bu projeye TAMAMEN ÖZEL, farazi verilerle, örnek metriklerle, aktörlerle ve senaryolarla doldurulmuş bir "${task.deliverables}" raporu/çıktısı YAZ.
Kesinlikle genel geçer BABOK teorisi, tanımı veya "şunu yapmalısınız" gibi TAVSİYELER ANLATMA.
Doğrudan toplantıdan çıkmış bir iş analisti gibi, ekibe sunulmaya hazır DOKÜMANIN KENDİSİNİ ver.
Raporu okuyan kişi "${projectContext}" projesi için özel olarak yazıldığını %100 hissetmeli.
Başlıklar (##, ###), madde işaretleri (-) ve numaralandırmalar kullanarak okunması kolay, şık bir Markdown taslağı oluştur.
Yanıtın tamamı Türkçe olmalıdır.
`;

    const generatedText = await generateWithGemini(prompt);
    set((s) => ({
      modalData: { ...s.modalData, loading: false, result: generatedText },
    }));
  },
}));
