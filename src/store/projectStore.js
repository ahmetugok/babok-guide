import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_PROJECT } from '../constants/index.js';
import { generateId } from '../utils.js';
import {
  DEFAULT_REQ_FORM, DEFAULT_RISK_FORM, DEFAULT_ASSUMPTION_FORM,
  DEFAULT_BR_FORM, DEFAULT_STAKEHOLDER_FORM, DEFAULT_ACTION_FORM,
} from './uiStore.js';

// ── Entity factory helpers — used by applyDocAnalysisResults and addNote ───
const buildReqFromAnalysis = (r, counter) => ({
  ...DEFAULT_REQ_FORM,
  id: generateId(),
  reqId: `REQ-${String(counter).padStart(3, '0')}`,
  name: r.title,
  objective: r.description,
  moscow: r.priority === 'Yüksek' ? 'M' : r.priority === 'Orta' ? 'S' : 'C',
  requirementType: r.type || '',
});

const buildRiskFromAnalysis = (r) => ({
  ...DEFAULT_RISK_FORM,
  id: generateId(),
  title: r.title,
  probability: r.probability || 2,
  impact: r.impact || 2,
  mitigation: r.description,
});

const buildAssumptionFromAnalysis = (a, type = 'Varsayim') => ({
  ...DEFAULT_ASSUMPTION_FORM,
  id: generateId(),
  title: a.title,
  content: a.description,
  type,
});

const buildBRFromAnalysis = (br, counter) => ({
  ...DEFAULT_BR_FORM,
  id: generateId(),
  brId: `BR-${String(counter).padStart(3, '0')}`,
  title: br.title,
  ruleText: br.description,
  source: 'Döküman Analizi',
});

const buildStakeholderFromAnalysis = (s) => ({
  ...DEFAULT_STAKEHOLDER_FORM,
  id: generateId(),
  name: s.name,
  role: s.role,
  department: s.department,
});

// ── addNote entity creators ────────────────────────────────────────────────
const createActionFromNote = (meetingId, topic, text) => ({
  ...DEFAULT_ACTION_FORM,
  id: generateId(),
  title: text,
  source: topic,
  sourceMeetingId: meetingId,
});

const createReqFromNote = (meetingId, text, counter) => ({
  ...DEFAULT_REQ_FORM,
  id: generateId(),
  reqId: `REQ-${String(counter).padStart(3, '0')}`,
  name: text,
  sourceMeetingId: meetingId,
});

const createAssumptionFromNote = (meetingId, text) => ({
  ...DEFAULT_ASSUMPTION_FORM,
  id: generateId(),
  title: text,
  type: 'Varsayim',
  sourceMeetingId: meetingId,
});

// Custom storage — mevcut localStorage key'lerini korur, veri kaybı olmaz
// Zustand v5: PersistStorage interface — getItem nesne döndürür, setItem nesne alır
const babokStorage = {
  getItem: (_name) => {
    try {
      const raw = localStorage.getItem('babok_v2_projects');
      if (raw) {
        const projects = JSON.parse(raw);
        const activeProjectId =
          localStorage.getItem('babok_v2_activeProjectId') ||
          projects[0]?.id ||
          'proj_1';
        return { state: { projects, activeProjectId }, version: 0 };
      }
      // Legacy migration (babok_project_tasks vb.)
      const projects = [
        {
          ...DEFAULT_PROJECT,
          completedTasks: JSON.parse(
            localStorage.getItem('babok_project_tasks') || '[]'
          ),
          completedSubTasks: JSON.parse(
            localStorage.getItem('babok_project_subtasks') || '[]'
          ),
          projectContext: localStorage.getItem('babok_project_context') || '',
        },
      ];
      return { state: { projects, activeProjectId: 'proj_1' }, version: 0 };
    } catch {
      return null;
    }
  },
  setItem: (_name, value) => {
    try {
      localStorage.setItem('babok_v2_projects', JSON.stringify(value.state.projects));
      if (value.state.activeProjectId !== undefined) {
        localStorage.setItem(
          'babok_v2_activeProjectId',
          value.state.activeProjectId || ''
        );
      }
    } catch {}
  },
  removeItem: () => {
    localStorage.removeItem('babok_v2_projects');
    localStorage.removeItem('babok_v2_activeProjectId');
  },
};

// Ortak selector — aktif projeyi hesaplar
export const selectActiveProject = (s) =>
  s.projects.find((p) => p.id === s.activeProjectId) || s.projects[0];

export const useProjectStore = create(
  persist(
    (set, get) => ({
      projects: [DEFAULT_PROJECT],
      activeProjectId: 'proj_1',

      // ── Core helpers ──────────────────────────────────────────────────────
      setProjects: (projects) => set({ projects }),
      setActiveProjectId: (id) => set({ activeProjectId: id }),

      updateActive: (updater) => {
        const { projects, activeProjectId } = get();
        const active = projects.find((p) => p.id === activeProjectId) || projects[0];
        set({
          projects: projects.map((p) =>
            p.id === active.id
              ? typeof updater === 'function'
                ? updater(p)
                : { ...p, ...updater }
              : p
          ),
        });
      },

      // ── Risk ──────────────────────────────────────────────────────────────
      saveRisk: (form, editingId) => {
        get().updateActive((p) => ({
          ...p,
          risks: editingId
            ? p.risks.map((r) => (r.id === editingId ? { ...form, id: editingId } : r))
            : [...p.risks, { ...form, id: generateId() }],
        }));
      },
      deleteRisk: (id) => {
        get().updateActive((p) => ({ ...p, risks: p.risks.filter((r) => r.id !== id) }));
      },

      // ── Assumption ────────────────────────────────────────────────────────
      saveAssumption: (form, editingId) => {
        get().updateActive((p) => ({
          ...p,
          assumptions: editingId
            ? p.assumptions.map((a) => (a.id === editingId ? { ...form, id: editingId } : a))
            : [...(p.assumptions || []), { ...form, id: generateId() }],
        }));
      },
      deleteAssumption: (id) => {
        get().updateActive((p) => ({
          ...p,
          assumptions: p.assumptions.filter((a) => a.id !== id),
        }));
      },

      // ── Action ────────────────────────────────────────────────────────────
      saveAction: (form, editingId) => {
        get().updateActive((p) => ({
          ...p,
          actions: editingId
            ? p.actions.map((a) => (a.id === editingId ? { ...form, id: editingId } : a))
            : [...p.actions, { ...form, id: generateId() }],
        }));
      },
      deleteAction: (id) => {
        get().updateActive((p) => ({ ...p, actions: p.actions.filter((a) => a.id !== id) }));
      },
      quickUpdateActionStatus: (actionId, newStatus) => {
        get().updateActive((p) => ({
          ...p,
          actions: p.actions.map((a) => (a.id === actionId ? { ...a, status: newStatus } : a)),
        }));
      },

      // ── Stakeholder ───────────────────────────────────────────────────────
      saveStakeholder: (form, editingId) => {
        get().updateActive((p) => ({
          ...p,
          stakeholders: editingId
            ? p.stakeholders.map((s) => (s.id === editingId ? { ...form, id: editingId } : s))
            : [...p.stakeholders, { ...form, id: generateId() }],
        }));
      },
      deleteStakeholder: (id) => {
        get().updateActive((p) => ({
          ...p,
          stakeholders: p.stakeholders.filter((s) => s.id !== id),
        }));
      },

      // ── Business Rule ─────────────────────────────────────────────────────
      saveBR: (form, editingId) => {
        get().updateActive((p) => {
          const cnt = p.brCounter || 1;
          return {
            ...p,
            businessRules: editingId
              ? p.businessRules.map((r) =>
                  r.id === editingId ? { ...form, id: editingId, brId: r.brId } : r
                )
              : [
                  ...(p.businessRules || []),
                  {
                    ...form,
                    id: generateId(),
                    brId: `BR-${String(cnt).padStart(3, '0')}`,
                  },
                ],
            brCounter: editingId ? cnt : cnt + 1,
          };
        });
      },
      deleteBR: (id) => {
        get().updateActive((p) => ({
          ...p,
          businessRules: p.businessRules.filter((r) => r.id !== id),
        }));
      },

      // ── Change Request ────────────────────────────────────────────────────
      saveCR: (form, editingId) => {
        get().updateActive((p) => {
          const cnt = p.crCounter || 1;
          return {
            ...p,
            changeRequests: editingId
              ? p.changeRequests.map((r) =>
                  r.id === editingId
                    ? { ...form, id: editingId, crId: r.crId, createdAt: r.createdAt }
                    : r
                )
              : [
                  ...(p.changeRequests || []),
                  {
                    ...form,
                    id: generateId(),
                    crId: `CR-${String(cnt).padStart(3, '0')}`,
                    createdAt: new Date().toISOString().split('T')[0],
                  },
                ],
            crCounter: editingId ? cnt : cnt + 1,
          };
        });
      },
      deleteCR: (id) => {
        get().updateActive((p) => ({
          ...p,
          changeRequests: p.changeRequests.filter((r) => r.id !== id),
        }));
      },

      // ── Requirement ───────────────────────────────────────────────────────
      saveReq: (form, editingId) => {
        get().updateActive((p) => {
          const cnt = p.reqCounter || 1;
          return {
            ...p,
            requirements: editingId
              ? p.requirements.map((r) =>
                  r.id === editingId ? { ...form, id: editingId, reqId: r.reqId } : r
                )
              : [
                  ...p.requirements,
                  {
                    ...form,
                    id: generateId(),
                    reqId: `REQ-${String(cnt).padStart(3, '0')}`,
                  },
                ],
            reqCounter: editingId ? cnt : cnt + 1,
          };
        });
      },
      deleteReq: (id) => {
        get().updateActive((p) => ({
          ...p,
          requirements: p.requirements.filter((r) => r.id !== id),
        }));
      },

      // ── Glossary ─────────────────────────────────────────────────────────
      saveGlossaryTerm: (form, editingId) => {
        get().updateActive((p) => {
          const cnt = p.glossaryCounter || 1;
          return {
            ...p,
            glossaryTerms: editingId
              ? (p.glossaryTerms || []).map((t) =>
                  t.id === editingId ? { ...form, id: editingId, termId: t.termId } : t
                )
              : [
                  ...(p.glossaryTerms || []),
                  {
                    ...form,
                    id: generateId(),
                    termId: `GLO-${String(cnt).padStart(3, '0')}`,
                  },
                ],
            glossaryCounter: editingId ? cnt : cnt + 1,
          };
        });
      },
      deleteGlossaryTerm: (id) => {
        get().updateActive((p) => ({
          ...p,
          glossaryTerms: (p.glossaryTerms || []).filter((t) => t.id !== id),
        }));
      },

      // ── Meeting ───────────────────────────────────────────────────────────
      saveMeeting: (form) => {
        const nm = { ...form, id: generateId(), notes: [] };
        get().updateActive((p) => ({ ...p, meetings: [...p.meetings, nm] }));
        return nm;
      },
      deleteMeeting: (id) => {
        get().updateActive((p) => ({
          ...p,
          meetings: p.meetings.filter((m) => m.id !== id),
        }));
      },
      addNote: (meetingId, noteType, noteText) => {
        const activeProject = selectActiveProject(get());
        const meeting = activeProject.meetings.find((m) => m.id === meetingId);
        if (!meeting) return;
        const note = { id: generateId(), type: noteType, text: noteText };
        const updatedMeeting = { ...meeting, notes: [...meeting.notes, note] };
        const patchMeetings = (p) => p.meetings.map((m) => (m.id === meetingId ? updatedMeeting : m));

        if (noteType === 'Aksiyon') {
          get().updateActive((p) => ({
            ...p,
            meetings: patchMeetings(p),
            actions: [...p.actions, createActionFromNote(meetingId, meeting.topic, noteText)],
          }));
        } else if (noteType === 'Gereksinim') {
          get().updateActive((p) => {
            const cnt = p.reqCounter || 1;
            return {
              ...p,
              meetings: patchMeetings(p),
              requirements: [...p.requirements, createReqFromNote(meetingId, noteText, cnt)],
              reqCounter: cnt + 1,
            };
          });
        } else if (noteType === 'Varsayim') {
          get().updateActive((p) => ({
            ...p,
            meetings: patchMeetings(p),
            assumptions: [...(p.assumptions || []), createAssumptionFromNote(meetingId, noteText)],
          }));
        } else {
          get().updateActive((p) => ({ ...p, meetings: patchMeetings(p) }));
        }
      },
      deleteNote: (meetingId, noteId) => {
        get().updateActive((p) => ({
          ...p,
          meetings: p.meetings.map((m) =>
            m.id === meetingId
              ? { ...m, notes: m.notes.filter((n) => n.id !== noteId) }
              : m
          ),
        }));
      },

      // ── Gantt ─────────────────────────────────────────────────────────────
      saveGanttTask: (form, editingId) => {
        if (!form.name.trim() || !form.startDate || !form.endDate) return false;
        if (new Date(form.endDate) < new Date(form.startDate)) {
          alert('Bitiş tarihi başlangıç tarihinden önce olamaz!');
          return false;
        }
        get().updateActive((p) => ({
          ...p,
          ganttTasks: editingId
            ? (p.ganttTasks || []).map((t) =>
                t.id === editingId ? { ...form, id: editingId } : t
              )
            : [...(p.ganttTasks || []), { ...form, id: generateId() }],
        }));
        return true;
      },
      deleteGanttTask: (id) => {
        get().updateActive((p) => ({
          ...p,
          ganttTasks: (p.ganttTasks || []).filter((t) => t.id !== id),
        }));
      },

      // ── Project management ────────────────────────────────────────────────
      createProject: (name) => {
        const np = { ...DEFAULT_PROJECT, id: generateId(), name };
        set((s) => ({ projects: [...s.projects, np], activeProjectId: np.id }));
        return np;
      },
      deleteProject: (id) => {
        const { projects, activeProjectId } = get();
        if (projects.length <= 1) {
          alert('En az bir proje olmalıdır!');
          return null;
        }
        const proj = projects.find((p) => p.id === id);
        const rem = projects.filter((p) => p.id !== id);
        set({
          projects: rem,
          activeProjectId: activeProjectId === id ? rem[0].id : activeProjectId,
        });
        return proj;
      },
      importProject: (data) => {
        if (Array.isArray(data)) {
          const newProjects = data.map((d) => ({ ...DEFAULT_PROJECT, ...d, id: generateId() }));
          set((s) => ({ projects: [...s.projects, ...newProjects] }));
          return newProjects;
        }
        const np = { ...DEFAULT_PROJECT, ...data, id: generateId() };
        set((s) => ({ projects: [...s.projects, np], activeProjectId: np.id }));
        return [np];
      },

      // ── Task completion ───────────────────────────────────────────────────
      toggleTask: (taskId) => {
        get().updateActive((p) => ({
          ...p,
          completedTasks: p.completedTasks.includes(taskId)
            ? p.completedTasks.filter((id) => id !== taskId)
            : [...p.completedTasks, taskId],
        }));
      },
      toggleSubTask: (subTaskId) => {
        get().updateActive((p) => ({
          ...p,
          completedSubTasks: p.completedSubTasks.includes(subTaskId)
            ? p.completedSubTasks.filter((id) => id !== subTaskId)
            : [...p.completedSubTasks, subTaskId],
        }));
      },
      markAllKA: (ka) => {
        get().updateActive((p) => ({
          ...p,
          completedTasks: [
            ...new Set([...p.completedTasks, ...ka.tasks.map((t) => t.id)]),
          ],
          completedSubTasks: [
            ...new Set([
              ...p.completedSubTasks,
              ...ka.tasks.flatMap((t) => t.checklist.map((c) => c.id)),
            ]),
          ],
        }));
      },
      resetProgress: () => {
        get().updateActive((p) => ({ ...p, completedTasks: [], completedSubTasks: [] }));
      },

      // ── Document Analysis ─────────────────────────────────────────────────
      applyDocAnalysisResults: (selected) => {
        get().updateActive((p) => {
          let reqCounter = p.reqCounter || 1;
          let brCounter = p.brCounter || 1;

          const newReqs        = (selected.requirements  || []).map((r) => buildReqFromAnalysis(r, reqCounter++));
          const newRisks       = (selected.risks         || []).map((r) => buildRiskFromAnalysis(r));
          const newAssumptions = (selected.assumptions   || []).map((a) => buildAssumptionFromAnalysis(a));
          const newConstraints = (selected.constraints   || []).map((c) => buildAssumptionFromAnalysis(c, 'Kisit'));
          const newBRs         = (selected.business_rules|| []).map((br) => buildBRFromAnalysis(br, brCounter++));
          const newStakeholders= (selected.stakeholders  || []).map((s) => buildStakeholderFromAnalysis(s));

          return {
            ...p,
            requirements:  [...p.requirements, ...newReqs],
            risks:         [...p.risks, ...newRisks],
            assumptions:   [...(p.assumptions || []), ...newAssumptions, ...newConstraints],
            businessRules: [...(p.businessRules || []), ...newBRs],
            stakeholders:  [...p.stakeholders, ...newStakeholders],
            reqCounter,
            brCounter,
          };
        });
      },
    }),
    {
      name: '__babok_store__',
      storage: babokStorage,
      partialize: (state) => ({
        projects: state.projects,
        activeProjectId: state.activeProjectId,
      }),
    }
  )
);
