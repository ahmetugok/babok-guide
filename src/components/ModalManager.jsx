import { useUIStore } from '../store/uiStore.js';

import { BusinessRuleModal }     from '../modals/BusinessRuleModal.jsx';
import { ChangeRequestModal }    from '../modals/ChangeRequestModal.jsx';
import { RiskModal }             from '../modals/RiskModal.jsx';
import { AssumptionModal }       from '../modals/AssumptionModal.jsx';
import { ActionModal }           from '../modals/ActionModal.jsx';
import { StakeholderModal }      from '../modals/StakeholderModal.jsx';
import { RequirementModal }      from '../modals/RequirementModal.jsx';
import { LinkCardModal }         from '../modals/LinkCardModal.jsx';
import { MeetingModal }          from '../modals/MeetingModal.jsx';
import { GanttModal }            from '../modals/GanttModal.jsx';
import { ExportModal }           from '../modals/ExportModal.jsx';
import { DocumentAnalysisModal } from '../modals/DocumentAnalysisModal.jsx';
import { SettingsModal }         from '../modals/SettingsModal.jsx';
import { AiGenerationModal }     from '../modals/AiGenerationModal.jsx';
import { ProjectCreateModal }    from '../modals/ProjectCreateModal.jsx';
import { ResetConfirmModal }     from '../modals/ResetConfirmModal.jsx';
import { GlossaryModal }         from '../modals/GlossaryModal.jsx';

export function ModalManager() {
  const activeModal = useUIStore((s) => s.activeModal);

  return (
    <>
      {activeModal === 'businessRule'     && <BusinessRuleModal />}
      {activeModal === 'changeRequest'    && <ChangeRequestModal />}
      {activeModal === 'risk'             && <RiskModal />}
      {activeModal === 'assumption'       && <AssumptionModal />}
      {activeModal === 'action'           && <ActionModal />}
      {activeModal === 'stakeholder'      && <StakeholderModal />}
      {activeModal === 'requirement'      && <RequirementModal />}
      {activeModal === 'linkCard'         && <LinkCardModal />}
      {activeModal === 'meeting'          && <MeetingModal />}
      {activeModal === 'gantt'            && <GanttModal />}
      {activeModal === 'export'           && <ExportModal />}
      {activeModal === 'documentAnalysis' && <DocumentAnalysisModal />}
      {activeModal === 'settings'         && <SettingsModal />}
      {activeModal === 'aiGeneration'     && <AiGenerationModal />}
      {activeModal === 'projectCreate'    && <ProjectCreateModal />}
      {activeModal === 'resetConfirm'     && <ResetConfirmModal />}
      {activeModal === 'glossary'         && <GlossaryModal />}
    </>
  );
}
