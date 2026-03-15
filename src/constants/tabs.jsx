import {
  LayoutDashboard, LayoutGrid, Lightbulb, BookOpen, RefreshCw, AlertTriangle,
  ListChecks, Users, BookMarked, ArrowUpRight, MessageSquare, CalendarDays,
  Wrench, FileStack, BrainCircuit
} from 'lucide-react';

export const TAB_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'knowledge_areas', label: 'Checklistler', Icon: LayoutGrid },
  { id: 'assumptions', label: 'Varsayimlar', Icon: Lightbulb },
  { id: 'businessrules', label: 'Is Kurallari', Icon: BookOpen },
  { id: 'changes', label: 'Degisiklikler', Icon: RefreshCw },
  { id: 'risks', label: 'Riskler', Icon: AlertTriangle },
  { id: 'actions', label: 'Aksiyonlar', Icon: ListChecks },
  { id: 'stakeholders', label: 'Paydaşlar', Icon: Users },
  { id: 'requirements', label: 'Gereksinimler', Icon: BookMarked },
  { id: 'traceability', label: 'Traceability', Icon: ArrowUpRight },
  { id: 'meetings', label: 'Toplantılar', Icon: MessageSquare },
  { id: 'gantt', label: 'Timeline', Icon: CalendarDays },
  { id: 'techniques', label: 'Teknikler', Icon: Wrench },
  { id: 'templates', label: 'Dokümanlar', Icon: FileStack },
  { id: 'competencies', label: 'Yetkinlikler', Icon: BrainCircuit },
];

export const MOBILE_TABS = TAB_ITEMS.filter(t => ['dashboard','risks','actions','gantt','meetings'].includes(t.id));
