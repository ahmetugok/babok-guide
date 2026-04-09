import React from 'react';
import { useProjectStore, selectActiveProject } from '../store/projectStore.js';

function getRiskLabel(r) {
  const score = (r.probability || 1) * (r.impact || 1);
  if (score >= 7) return 'Kritik';
  if (score >= 4) return 'Orta';
  return 'Dusuk';
}

const SOURCES = {
  requirement:   { key: 'requirements',   label: r  => `${r.reqId} — ${r.name}` },
  stakeholder:   { key: 'stakeholders',   label: s  => `${s.name} (${s.role})` },
  risk:          { key: 'risks',          label: r  => `[${getRiskLabel(r)}] ${r.title}` },
  assumption:    { key: 'assumptions',    label: a  => `[${a.type}] ${a.title}` },
  businessRule:  { key: 'businessRules',  label: br => `${br.brId} — ${br.title}` },
  meeting:       { key: 'meetings',       label: m  => `${m.date} · ${m.topic}` },
  changeRequest: { key: 'changeRequests', label: cr => `${cr.crId} — ${cr.title}` },
  glossaryTerm:  { key: 'glossaryTerms',  label: t  => `${t.termId} — ${t.term}` },
};

export function EntitySelector({
  entityType,
  value,
  onChange,
  placeholder,
  allowClear = true,
}) {
  const activeProject = useProjectStore(selectActiveProject);
  const source = SOURCES[entityType];
  if (!source) return null;

  const items = activeProject?.[source.key] || [];
  const placeholderText = placeholder || `${entityType} seçin…`;

  return (
    <select
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      {allowClear && (
        <option value="">{placeholderText}</option>
      )}
      {items.length === 0 ? (
        <option disabled value="">Henüz kayıt yok</option>
      ) : (
        items.map(item => (
          <option key={item.id} value={item.id}>
            {source.label(item)}
          </option>
        ))
      )}
    </select>
  );
}
