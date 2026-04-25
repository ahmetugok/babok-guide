import { lazy, Suspense } from 'react';
import { useUIStore } from '../store/uiStore.js';
import { ErrorBoundary } from './ErrorBoundary.jsx';
import { ModalFallback } from './LoadingFallback.jsx';

const BusinessRuleModal     = lazy(() => import('../modals/BusinessRuleModal.jsx').then(m => ({ default: m.BusinessRuleModal })));
const ChangeRequestModal    = lazy(() => import('../modals/ChangeRequestModal.jsx').then(m => ({ default: m.ChangeRequestModal })));
const RiskModal             = lazy(() => import('../modals/RiskModal.jsx').then(m => ({ default: m.RiskModal })));
const AssumptionModal       = lazy(() => import('../modals/AssumptionModal.jsx').then(m => ({ default: m.AssumptionModal })));
const ActionModal           = lazy(() => import('../modals/ActionModal.jsx').then(m => ({ default: m.ActionModal })));
const StakeholderModal      = lazy(() => import('../modals/StakeholderModal.jsx').then(m => ({ default: m.StakeholderModal })));
const RequirementModal      = lazy(() => import('../modals/RequirementModal.jsx').then(m => ({ default: m.RequirementModal })));
const LinkCardModal         = lazy(() => import('../modals/LinkCardModal.jsx').then(m => ({ default: m.LinkCardModal })));
const MeetingModal          = lazy(() => import('../modals/MeetingModal.jsx').then(m => ({ default: m.MeetingModal })));
const GanttModal            = lazy(() => import('../modals/GanttModal.jsx').then(m => ({ default: m.GanttModal })));
const ExportModal           = lazy(() => import('../modals/ExportModal.jsx').then(m => ({ default: m.ExportModal })));
const DocumentAnalysisModal = lazy(() => import('../modals/DocumentAnalysisModal.jsx').then(m => ({ default: m.DocumentAnalysisModal })));
const SettingsModal         = lazy(() => import('../modals/SettingsModal.jsx').then(m => ({ default: m.SettingsModal })));
const AiGenerationModal     = lazy(() => import('../modals/AiGenerationModal.jsx').then(m => ({ default: m.AiGenerationModal })));
const ProjectCreateModal    = lazy(() => import('../modals/ProjectCreateModal.jsx').then(m => ({ default: m.ProjectCreateModal })));
const ResetConfirmModal     = lazy(() => import('../modals/ResetConfirmModal.jsx').then(m => ({ default: m.ResetConfirmModal })));
const GlossaryModal         = lazy(() => import('../modals/GlossaryModal.jsx').then(m => ({ default: m.GlossaryModal })));

export function ModalManager() {
  const activeModal = useUIStore((s) => s.activeModal);

  if (!activeModal) return null;

  return (
    <ErrorBoundary key={activeModal}>
      <Suspense fallback={<ModalFallback />}>
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
      </Suspense>
    </ErrorBoundary>
  );
}
