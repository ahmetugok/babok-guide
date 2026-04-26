import React from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { PROB_LABELS, RACI_LABELS } from '../constants/index.js';
import { getRiskLevel } from '../utils.js';
import { useProjectStore } from '../store/projectStore.js';
import {
  selectActiveRequirements, selectActiveBusinessRules, selectActiveChangeRequests,
  selectActiveRisks, selectActiveMeetings, selectActiveActions, selectActiveAssumptions,
  selectActiveStakeholders,
} from '../store/selectors.js';
import { useUIStore } from '../store/uiStore.js';

/* ── shared helpers ──────────────────────────────────── */
function Overlay({ onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="glass-panel p-6 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        {children}
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:bg-white/10 rounded-md">Kapat</button>
        </div>
      </div>
    </div>
  );
}

function Header({ label, sub, onClose }) {
  return (
    <div className="flex items-start justify-between mb-4 gap-3">
      <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2 flex-wrap">
        <ArrowUpRight className="text-cyan-400 w-5 h-5 shrink-0" />
        {label}
        {sub && <span className="text-sm font-normal text-slate-400">{sub}</span>}
      </h3>
      <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 shrink-0"><X className="w-4 h-4" /></button>
    </div>
  );
}

function InfoGrid({ rows }) {
  return (
    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
      {rows.map(([k, v]) => (
        <div key={k} className="bg-white/5 rounded-lg p-2.5">
          <span className="text-xs text-slate-500 block">{k}</span>
          <span className="text-slate-200">{v || '—'}</span>
        </div>
      ))}
    </div>
  );
}

function Section({ title, count, children }) {
  return (
    <div className="mt-3">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
        {title}{count !== undefined && ` (${count})`}
      </p>
      {children}
    </div>
  );
}

function Empty({ text = '— yok' }) {
  return <p className="text-xs text-slate-500 py-1">{text}</p>;
}

function Chip({ left, right, accent = 'slate' }) {
  const colors = {
    slate:   'bg-white/5 text-slate-300',
    cyan:    'bg-cyan-500/10 text-cyan-300',
    amber:   'bg-amber-500/10 text-amber-300',
    rose:    'bg-rose-500/10 text-rose-300',
    emerald: 'bg-emerald-500/10 text-emerald-300',
    blue:    'bg-blue-500/10 text-blue-300',
  };
  return (
    <div className={`flex items-center gap-2 rounded-lg px-3 py-2 mb-1 ${colors[accent]}`}>
      {left && <span className="text-xs font-mono text-slate-400 shrink-0">{left}</span>}
      <span className="text-xs flex-1">{right}</span>
    </div>
  );
}

function CRChip({ cr }) {
  const accent = cr.status === 'Onaylandi' ? 'emerald' : cr.status === 'Bekliyor' ? 'amber' : 'rose';
  return (
    <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 mb-1">
      <span className="text-xs font-mono text-slate-400 shrink-0">{cr.crId}</span>
      <span className="text-xs text-slate-300 flex-1">{cr.title}</span>
      <span className={`text-xs px-2 py-0.5 rounded-full ${accent === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' : accent === 'amber' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>{cr.status}</span>
    </div>
  );
}

function RiskChip({ risk }) {
  const lvl = getRiskLevel(risk.probability, risk.impact);
  return (
    <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 mb-1">
      <span className={`text-xs px-2 py-0.5 rounded-full border font-bold shrink-0 ${lvl.cls}`}>{risk.probability * risk.impact}</span>
      <span className="text-xs text-slate-300 flex-1">{risk.title}</span>
    </div>
  );
}

/* ── REQUIREMENT view ────────────────────────────────── */
function RequirementCard({ entity: req, onClose }) {
  const businessRules  = useProjectStore(selectActiveBusinessRules);
  const changeRequests = useProjectStore(selectActiveChangeRequests);
  const risks          = useProjectStore(selectActiveRisks);
  const meetings       = useProjectStore(selectActiveMeetings);
  const linkedBRs      = businessRules.filter(br => br.linkedRequirements === req.id);
  const linkedCRs      = changeRequests.filter(cr => cr.affectedEntityId === req.id);
  const linkedRisks    = risks.filter(r  => r.linkedRequirementId === req.id);
  const sourceMeeting  = meetings.find(m   => m.id === req.sourceMeetingId);

  return (
    <Overlay onClose={onClose}>
      <Header
        label={<><span className="font-mono text-cyan-400">{req.reqId}</span> {req.name}</>}
        onClose={onClose}
      />
      <div className="flex gap-2 flex-wrap mb-4">
        {req.status  && <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/20">{req.status}</span>}
        {req.moscow  && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">{req.moscow}</span>}
      </div>
      <InfoGrid rows={[
        ['İş Hedefi',         req.objective],
        ['Modül',             req.module],
        ['Kabul Kriteri',     req.acceptanceCriteria],
        ['BABOK Bilgi Alanı', req.babokKnowledgeArea],
        ['Onay Durumu',       req.approvalStatus],
        ['Not',               req.notes],
      ]} />
      <Section title="İş Kuralları" count={linkedBRs.length}>
        {linkedBRs.length === 0
          ? <Empty text="İş kuralı bağlantısı yok" />
          : linkedBRs.map(br => <Chip key={br.id} left={br.brId} right={br.title} accent="blue" />)}
      </Section>
      <Section title="Değişiklik Talepleri" count={linkedCRs.length}>
        {linkedCRs.length === 0
          ? <Empty text="Değişiklik talebi yok" />
          : linkedCRs.map(cr => <CRChip key={cr.id} cr={cr} />)}
      </Section>
      <Section title="Riskler" count={linkedRisks.length}>
        {linkedRisks.length === 0
          ? <Empty text="İlişkili risk yok" />
          : linkedRisks.map(r => <RiskChip key={r.id} risk={r} />)}
      </Section>
      <Section title="Kaynak Toplantı">
        {sourceMeeting
          ? <Chip left={sourceMeeting.date} right={sourceMeeting.topic} accent="cyan" />
          : <Empty text="Toplantıdan üretilmemiş" />}
      </Section>
    </Overlay>
  );
}

/* ── STAKEHOLDER view ────────────────────────────────── */
function StakeholderCard({ entity: s, onClose }) {
  const allRequirements = useProjectStore(selectActiveRequirements);
  const allMeetings     = useProjectStore(selectActiveMeetings);
  const allActions      = useProjectStore(selectActiveActions);
  const allRisks        = useProjectStore(selectActiveRisks);
  const requests  = allRequirements.filter(r => r.requestingStakeholderId === s.id);
  const meetings  = allMeetings.filter(m => m.attendees && m.attendees.toLowerCase().includes(s.name.toLowerCase()));
  const actions   = allActions.filter(a => a.owner && a.owner.toLowerCase() === s.name.toLowerCase());
  const risks     = allRisks.filter(r => r.affectedStakeholderId === s.id);

  return (
    <Overlay onClose={onClose}>
      <Header label={s.name} sub={s.role} onClose={onClose} />
      <InfoGrid rows={[
        ['Departman', s.department],
        ['RACI',      `${s.raci} — ${RACI_LABELS[s.raci] || s.raci}`],
        ['İlgi',      PROB_LABELS[s.interest]],
        ['Etki',      PROB_LABELS[s.influence]],
      ]} />
      <Section title="Talep Ettiği Gereksinimler" count={requests.length}>
        {requests.length === 0
          ? <Empty text="— yok" />
          : requests.map(r => <Chip key={r.id} left={r.reqId} right={r.name} accent="cyan" />)}
      </Section>
      <Section title="Katıldığı Toplantılar" count={meetings.length}>
        {meetings.length === 0
          ? <Empty text="— yok" />
          : meetings.map(m => <Chip key={m.id} left={m.date} right={m.topic} />)}
      </Section>
      <Section title="Üzerindeki Aksiyonlar" count={actions.length}>
        {actions.length === 0
          ? <Empty text="— yok" />
          : actions.map(a => (
            <div key={a.id} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 mb-1">
              <span className="text-xs text-slate-300 flex-1">{a.title}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${a.status === 'Tamamlandı' ? 'bg-emerald-500/10 text-emerald-400' : a.status === 'Devam Ediyor' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'}`}>{a.status}</span>
            </div>
          ))}
      </Section>
      <Section title="İlgili Riskler" count={risks.length}>
        {risks.length === 0
          ? <Empty text="— yok" />
          : risks.map(r => <RiskChip key={r.id} risk={r} />)}
      </Section>
    </Overlay>
  );
}

/* ── RISK view ───────────────────────────────────────── */
function RiskCard({ entity: risk, onClose }) {
  const requirements = useProjectStore(selectActiveRequirements);
  const assumptions  = useProjectStore(selectActiveAssumptions);
  const stakeholders = useProjectStore(selectActiveStakeholders);
  const actions      = useProjectStore(selectActiveActions);
  const lvl          = getRiskLevel(risk.probability, risk.impact);
  const linkedReq   = requirements.find(r => r.id === risk.linkedRequirementId);
  const linkedAss   = assumptions.find(a => a.id === risk.linkedAssumptionId);
  const linkedSH    = stakeholders.find(s => s.id === risk.affectedStakeholderId);
  const mitigActs   = actions.filter(a => a.linkedRequirementId === risk.linkedRequirementId && risk.linkedRequirementId);

  return (
    <Overlay onClose={onClose}>
      <Header label={risk.title} onClose={onClose} />
      <div className="flex gap-2 flex-wrap mb-4">
        <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${lvl.cls}`}>
          Skor {risk.probability * risk.impact} — {lvl.label}
        </span>
        {risk.status && <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-300">{risk.status}</span>}
        {risk.category && <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400">{risk.category}</span>}
      </div>
      <InfoGrid rows={[
        ['Sorumlu',          risk.owner],
        ['Azaltma',          risk.mitigation],
        ['Erken Uyarı',      risk.triggerDescription],
        ['Olasılık / Etki',  `${PROB_LABELS[risk.probability]} / ${PROB_LABELS[risk.impact]}`],
      ]} />
      <Section title="Bağlı Gereksinim">
        {linkedReq
          ? <Chip left={linkedReq.reqId} right={linkedReq.name} accent="cyan" />
          : <Empty />}
      </Section>
      <Section title="Tetikleyici Varsayım">
        {linkedAss
          ? <Chip left={linkedAss.asmId} right={linkedAss.title} accent="amber" />
          : <Empty />}
      </Section>
      <Section title="Etkilenen Paydaş">
        {linkedSH
          ? <Chip left={linkedSH.role} right={linkedSH.name} />
          : <Empty />}
      </Section>
      <Section title="Azaltma Aksiyonları" count={mitigActs.length}>
        {mitigActs.length === 0
          ? <Empty />
          : mitigActs.map(a => <Chip key={a.id} right={a.title} accent="slate" />)}
      </Section>
    </Overlay>
  );
}

/* ── ASSUMPTION view ─────────────────────────────────── */
function AssumptionCard({ entity: ass, onClose }) {
  const requirements   = useProjectStore(selectActiveRequirements);
  const risks          = useProjectStore(selectActiveRisks);
  const linkedReq      = requirements.find(r => r.id === ass.linkedRequirements);
  const triggeredRisks = risks.filter(r => r.linkedAssumptionId === ass.id);

  const validationBanner = {
    'Curutuldu':     'bg-rose-500/10 border border-rose-500/20 text-rose-300',
    'Dogrulandi':    'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300',
    'Dogrulanmadi':  'bg-amber-500/10 border border-amber-500/20 text-amber-300',
  }[ass.validationStatus] || 'bg-white/5 text-slate-300';

  return (
    <Overlay onClose={onClose}>
      <Header label={<><span className="font-mono text-amber-400">{ass.asmId}</span> {ass.title}</>} onClose={onClose} />
      <div className={`text-xs font-bold px-3 py-2 rounded-lg mb-4 ${validationBanner}`}>
        Doğrulama: {ass.validationStatus || 'Belirtilmemiş'}
        {ass.validationDate && <span className="font-normal ml-2">· {ass.validationDate}</span>}
      </div>
      <InfoGrid rows={[
        ['Tip',       ass.type],
        ['Kategori',  ass.category],
        ['Sorumlu',   ass.ownerId],
        ['İçerik',    ass.content],
        ['Not',       ass.notes],
      ]} />
      <Section title="Bağlı Gereksinim">
        {linkedReq
          ? <Chip left={linkedReq.reqId} right={linkedReq.name} accent="cyan" />
          : <Empty />}
      </Section>
      <Section title="Tetiklediği Riskler" count={triggeredRisks.length}>
        {triggeredRisks.length === 0
          ? <Empty />
          : triggeredRisks.map(r => <RiskChip key={r.id} risk={r} />)}
      </Section>
    </Overlay>
  );
}

/* ── MAIN export ─────────────────────────────────────── */
export function LinkCardModal() {
  const businessRules  = useProjectStore(selectActiveBusinessRules);
  const changeRequests = useProjectStore(selectActiveChangeRequests);
  const risks          = useProjectStore(selectActiveRisks);
  const meetings       = useProjectStore(selectActiveMeetings);
  const requirements   = useProjectStore(selectActiveRequirements);
  const actions        = useProjectStore(selectActiveActions);
  const assumptions    = useProjectStore(selectActiveAssumptions);
  const stakeholders   = useProjectStore(selectActiveStakeholders);
  const modalData  = useUIStore((s) => s.modalData);
  const closeModal = useUIStore((s) => s.closeModal);

  const { entityType, entityId } = modalData;

  if (entityType === 'requirement') {
    const entity = (requirements).find(r => r.id === entityId);
    if (!entity) return null;
    return <RequirementCard entity={entity} onClose={closeModal} />;
  }

  if (entityType === 'stakeholder') {
    const entity = (stakeholders).find(s => s.id === entityId);
    if (!entity) return null;
    return <StakeholderCard entity={entity} onClose={closeModal} />;
  }

  if (entityType === 'risk') {
    const entity = (risks || []).find(r => r.id === entityId);
    if (!entity) return null;
    return <RiskCard entity={entity} onClose={closeModal} />;
  }

  if (entityType === 'assumption') {
    const entity = (assumptions || []).find(a => a.id === entityId);
    if (!entity) return null;
    return <AssumptionCard entity={entity} onClose={closeModal} />;
  }

  return null;
}
