// Slice selectors — her bileşen yalnızca ihtiyacı olan alanı dinler.
// updateActive spread ile yeni nesne oluştursa da değişmeyen alanların
// referansı aynı kalır; Zustand === karşılaştırmasıyla gereksiz re-render engellenir.

const getActive = (s) =>
  s.projects.find((p) => p.id === s.activeProjectId) || s.projects[0];

export const selectActiveRisks               = (s) => getActive(s)?.risks               ?? [];
export const selectActiveAssumptions         = (s) => getActive(s)?.assumptions         ?? [];
export const selectActiveBusinessRules       = (s) => getActive(s)?.businessRules       ?? [];
export const selectActiveChangeRequests      = (s) => getActive(s)?.changeRequests      ?? [];
export const selectActiveActions             = (s) => getActive(s)?.actions             ?? [];
export const selectActiveStakeholders        = (s) => getActive(s)?.stakeholders        ?? [];
export const selectActiveRequirements        = (s) => getActive(s)?.requirements        ?? [];
export const selectActiveMeetings            = (s) => getActive(s)?.meetings            ?? [];
export const selectActiveGanttTasks          = (s) => getActive(s)?.ganttTasks          ?? [];
export const selectActiveGlossaryTerms       = (s) => getActive(s)?.glossaryTerms       ?? [];
export const selectActiveName                = (s) => getActive(s)?.name                ?? '';
export const selectActiveProjectContext      = (s) => getActive(s)?.projectContext      ?? '';
export const selectActiveCompletedTasks      = (s) => getActive(s)?.completedTasks      ?? [];
export const selectActiveCompletedSubTasks   = (s) => getActive(s)?.completedSubTasks   ?? [];
export const selectActiveCompletedTaskDurs   = (s) => getActive(s)?.completedTaskDurations ?? {};
