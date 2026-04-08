import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_PROJECT } from '../constants/index.js';
import { generateId } from '../utils.js';

// Custom storage — mevcut localStorage key'lerini korur, veri kaybı olmaz
const babokStorage = {
  getItem: () => {
    try {
      const raw = localStorage.getItem('babok_v2_projects');
      if (raw) {
        const projects = JSON.parse(raw);
        const activeProjectId =
          localStorage.getItem('babok_v2_activeProjectId') ||
          projects[0]?.id ||
          'proj_1';
        return JSON.stringify({ state: { projects, activeProjectId }, version: 0 });
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
      return JSON.stringify({ state: { projects, activeProjectId: 'proj_1' }, version: 0 });
    } catch {
      return null;
    }
  },
  setItem: (_name, value) => {
    try {
      const parsed = JSON.parse(value);
      localStorage.setItem('babok_v2_projects', JSON.stringify(parsed.state.projects));
      if (parsed.state.activeProjectId !== undefined) {
        localStorage.setItem(
          'babok_v2_activeProjectId',
          parsed.state.activeProjectId || ''
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
        if (window.confirm('Riski silmek istiyor musunuz?'))
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
        if (window.confirm('Varsayimi silmek istiyor musunuz?'))
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
        if (window.confirm('Aksiyonu silmek istiyor musunuz?'))
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
        if (window.confirm('Paydaşı silmek istiyor musunuz?'))
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
        if (window.confirm('Is kuralini silmek istiyor musunuz?'))
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
        if (window.confirm('Degisiklik talebini silmek istiyor musunuz?'))
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
        if (window.confirm('Gereksinimi silmek istiyor musunuz?'))
          get().updateActive((p) => ({
            ...p,
            requirements: p.requirements.filter((r) => r.id !== id),
          }));
      },

      // ── Meeting ───────────────────────────────────────────────────────────
      saveMeeting: (form) => {
        const nm = { ...form, id: generateId(), notes: [] };
        get().updateActive((p) => ({ ...p, meetings: [...p.meetings, nm] }));
        return nm;
      },
      deleteMeeting: (id) => {
        if (window.confirm('Toplantıyı silmek istiyor musunuz?')) {
          get().updateActive((p) => ({
            ...p,
            meetings: p.meetings.filter((m) => m.id !== id),
          }));
          return true;
        }
        return false;
      },
      addNote: (meetingId, noteType, noteText) => {
        const activeProject = selectActiveProject(get());
        const meeting = activeProject.meetings.find((m) => m.id === meetingId);
        if (!meeting) return;
        const note = { id: generateId(), type: noteType, text: noteText };
        const updatedMeeting = { ...meeting, notes: [...meeting.notes, note] };

        if (noteType === 'Aksiyon') {
          const newAction = {
            id: generateId(),
            title: noteText,
            owner: '',
            dueDate: '',
            status: 'Bekliyor',
            source: meeting.topic,
            notes: '',
            linkedRequirementId: '',
          };
          get().updateActive((p) => ({
            ...p,
            meetings: p.meetings.map((m) => (m.id === meetingId ? updatedMeeting : m)),
            actions: [...p.actions, newAction],
          }));
        } else if (noteType === 'Gereksinim') {
          get().updateActive((p) => {
            const cnt = p.reqCounter || 1;
            const newReq = {
              id: generateId(),
              reqId: `REQ-${String(cnt).padStart(3, '0')}`,
              name: noteText,
              objective: '',
              module: '',
              status: 'Taslak',
              testId: '',
              moscow: '',
              notes: '',
              requirementType: '',
              acceptanceCriteria: '',
              sourceMeetingId: meetingId,
              approvalStatus: 'Taslak',
              approvedById: '',
              babokKnowledgeArea: '',
            };
            return {
              ...p,
              meetings: p.meetings.map((m) => (m.id === meetingId ? updatedMeeting : m)),
              requirements: [...p.requirements, newReq],
              reqCounter: cnt + 1,
            };
          });
        } else if (noteType === 'Varsayim') {
          const newAss = {
            id: generateId(),
            title: noteText,
            content: '',
            type: 'Varsayim',
            category: 'Is',
            validationStatus: 'Dogrulanmadi',
            ownerId: '',
            linkedRequirements: [],
            linkedRisks: [],
            notes: '',
            sourceMeetingId: meetingId,
          };
          get().updateActive((p) => ({
            ...p,
            meetings: p.meetings.map((m) => (m.id === meetingId ? updatedMeeting : m)),
            assumptions: [...(p.assumptions || []), newAss],
          }));
        } else {
          get().updateActive((p) => ({
            ...p,
            meetings: p.meetings.map((m) => (m.id === meetingId ? updatedMeeting : m)),
          }));
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
        if (window.confirm('Görevi silmek istiyor musunuz?'))
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

          const newReqs = (selected.requirements || []).map((r) => ({
            id: generateId(),
            reqId: `REQ-${String(reqCounter++).padStart(3, '0')}`,
            name: r.title,
            objective: r.description,
            module: '',
            status: 'Taslak',
            testId: '',
            notes: '',
            moscow:
              r.priority === 'Yüksek' ? 'M' : r.priority === 'Orta' ? 'S' : 'C',
            requirementType: r.type || '',
            sourceMeetingId: '',
            acceptanceCriteria: '',
            approvalStatus: 'Taslak',
            approvedById: '',
            babokKnowledgeArea: '',
          }));
          const newRisks = (selected.risks || []).map((r) => ({
            id: generateId(),
            title: r.title,
            category: '',
            probability: r.probability || 2,
            impact: r.impact || 2,
            owner: '',
            mitigation: r.description,
            status: 'Açık',
            linkedRequirementId: '',
            linkedAssumptionId: '',
            affectedStakeholderId: '',
            triggerDescription: '',
          }));
          const newAssumptions = (selected.assumptions || []).map((a) => ({
            id: generateId(),
            title: a.title,
            content: a.description,
            type: 'Varsayim',
            category: 'Is',
            ownerId: '',
            validationStatus: 'Dogrulanmadi',
            validationDate: '',
            linkedRequirements: '',
            linkedRisks: '',
            notes: '',
          }));
          const newConstraints = (selected.constraints || []).map((c) => ({
            id: generateId(),
            title: c.title,
            content: c.description,
            type: 'Kisit',
            category: 'Is',
            ownerId: '',
            validationStatus: 'Dogrulanmadi',
            validationDate: '',
            linkedRequirements: '',
            linkedRisks: '',
            notes: '',
          }));
          const newBRs = (selected.business_rules || []).map((br) => ({
            id: generateId(),
            brId: `BR-${String(brCounter++).padStart(3, '0')}`,
            title: br.title,
            ruleText: br.description,
            category: 'Surec',
            source: 'Döküman Analizi',
            sourceRef: '',
            version: 'v1.0',
            status: 'Aktif',
            linkedRequirements: '',
            linkedStakeholderId: '',
            notes: '',
          }));
          const newStakeholders = (selected.stakeholders || []).map((s) => ({
            id: generateId(),
            name: s.name,
            role: s.role,
            department: s.department,
            interest: 2,
            influence: 2,
            raci: 'I',
            notes: '',
          }));

          return {
            ...p,
            requirements: [...p.requirements, ...newReqs],
            risks: [...p.risks, ...newRisks],
            assumptions: [
              ...(p.assumptions || []),
              ...newAssumptions,
              ...newConstraints,
            ],
            businessRules: [...(p.businessRules || []), ...newBRs],
            stakeholders: [...p.stakeholders, ...newStakeholders],
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
