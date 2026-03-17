// BABOK Export Engine — pure JS, no React
// generateBABOKReport(project) → Markdown string

const PROB_LABELS  = ['', 'Düşük', 'Orta', 'Yüksek'];

function fmtDuration(minutes) {
  if (!minutes || minutes <= 0) return '0 dk';
  if (minutes < 60) return `${minutes} dk`;
  return `${Math.floor(minutes / 60)} sa ${minutes % 60} dk`;
}
const RACI_LABELS  = { R: 'Sorumlu', A: 'Onaylayan', C: 'Danışılan', I: 'Bilgilendirilen' };

function riskLevel(probability, impact) {
  const score = (probability || 1) * (impact || 1);
  if (score >= 7) return 'Kritik';
  if (score >= 4) return 'Orta';
  return 'Dusuk';
}

function today() {
  return new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function hr() {
  return '\n---\n';
}

// ── Section 1: Proje Özeti ────────────────────────────────────────────────────
function section1(p) {
  const reqs  = p.requirements    || [];
  const risks = p.risks           || [];
  const crs   = p.changeRequests  || [];
  const asms  = p.assumptions     || [];

  return [
    `# ${p.name} — BABOK Proje Raporu`,
    ``,
    `**Tarih:** ${today()}`,
    `**Bağlam:** ${p.projectContext || '—'}`,
    hr(),
    `| Gösterge | Değer |`,
    `|---|---|`,
    `| Toplam Gereksinim | ${reqs.length} |`,
    `| Açık Risk | ${risks.filter(r => r.status === 'Açık').length} |`,
    `| Bekleyen CR | ${crs.filter(cr => cr.status === 'Bekliyor').length} |`,
    `| Doğrulanmamış Varsayım | ${asms.filter(a => a.validationStatus === 'Dogrulanmadi').length} |`,
  ].join('\n');
}

// ── Section 2: Paydaş RACI ───────────────────────────────────────────────────
function section2(p) {
  const stakeholders = p.stakeholders || [];
  const lines = [
    `## Paydaş Kayıt ve RACI Matrisi`,
    ``,
    `| Ad | Rol | Departman | İlgi | Etki | RACI |`,
    `|---|---|---|---|---|---|`,
  ];
  for (const s of stakeholders) {
    lines.push(
      `| ${s.name || '—'} | ${s.role || '—'} | ${s.department || '—'} | ${PROB_LABELS[s.interest] || '—'} | ${PROB_LABELS[s.influence] || '—'} | ${s.raci || '—'} |`
    );
  }
  if (stakeholders.length === 0) lines.push(`| — | — | — | — | — | — |`);
  lines.push(``, `**RACI Açıklamaları:** R = ${RACI_LABELS.R} · A = ${RACI_LABELS.A} · C = ${RACI_LABELS.C} · I = ${RACI_LABELS.I}`);
  return lines.join('\n');
}

// ── Section 3: Varsayımlar ve Kısıtlar ───────────────────────────────────────
function section3(p) {
  const assumptions = (p.assumptions || []).filter(a => a.type !== 'Kisit');
  const constraints = (p.assumptions || []).filter(a => a.type === 'Kisit');
  const reqs        = p.requirements || [];

  function renderItem(a) {
    const linkedReq = reqs.find(r => r.id === a.linkedRequirements);
    return [
      `### ${a.title}`,
      `- **Tip:** ${a.type || '—'} | **Kategori:** ${a.category || '—'}`,
      `- **Doğrulama:** ${a.validationStatus || '—'}${a.validationDate ? ` (${a.validationDate})` : ''}`,
      `- **İçerik:** ${a.content || '—'}`,
      `- **Bağlı Gereksinim:** ${linkedReq ? linkedReq.reqId : '—'}`,
      a.notes ? `- **Not:** ${a.notes}` : null,
    ].filter(Boolean).join('\n');
  }

  const lines = [`## Varsayımlar`, ``];
  if (assumptions.length === 0) {
    lines.push('_Varsayım girilmemiş._');
  } else {
    assumptions.forEach(a => { lines.push(renderItem(a)); lines.push(''); });
  }

  lines.push(`## Kısıtlar`, ``);
  if (constraints.length === 0) {
    lines.push('_Kısıt girilmemiş._');
  } else {
    constraints.forEach(a => { lines.push(renderItem(a)); lines.push(''); });
  }

  return lines.join('\n');
}

// ── Section 4: İş Kuralları ───────────────────────────────────────────────────
function section4(p) {
  const brs  = p.businessRules  || [];
  const reqs = p.requirements   || [];

  const lines = [`## İş Kuralları`, ``];
  if (brs.length === 0) {
    lines.push('_İş kuralı girilmemiş._');
    return lines.join('\n');
  }

  for (const br of brs) {
    const linkedReq = reqs.find(r => r.id === br.linkedRequirements);
    lines.push(`### ${br.brId}: ${br.title}`);
    lines.push(`- **Kategori:** ${br.category || '—'} | **Kaynak:** ${br.source || '—'}`);
    lines.push(`- **Versiyon:** ${br.version || '—'} | **Durum:** ${br.status || '—'}`);
    lines.push(`- **Kural Metni:** ${br.ruleText || '—'}`);
    lines.push(`- **Bağlı Gereksinim:** ${linkedReq ? `${linkedReq.reqId} — ${linkedReq.name}` : '—'}`);
    if (br.notes) lines.push(`- **Not:** ${br.notes}`);
    lines.push('');
  }

  return lines.join('\n');
}

// ── Section 5: Gereksinim Kataloğu ───────────────────────────────────────────
function section5(p) {
  const reqs = p.requirements  || [];
  const brs  = p.businessRules || [];
  const risks = p.risks        || [];
  const crs  = p.changeRequests || [];

  const STATUS_ORDER = ['Onaylandi', 'Onaylandı', 'Geliştiriliyor', 'Test', 'Canlıda', 'İncelemede', 'Taslak'];
  const sorted = [...reqs].sort((a, b) => {
    const ia = STATUS_ORDER.indexOf(a.status);
    const ib = STATUS_ORDER.indexOf(b.status);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  const lines = [`## Gereksinim Kataloğu`, ``];
  if (sorted.length === 0) {
    lines.push('_Gereksinim girilmemiş._');
    return lines.join('\n');
  }

  for (const r of sorted) {
    const linkedBRs    = brs.filter(br  => br.linkedRequirements === r.id);
    const linkedRisks  = risks.filter(ri => ri.linkedRequirementId === r.id);
    const linkedCRs    = crs.filter(cr  => cr.affectedEntityId === r.id);

    lines.push(`### ${r.reqId}: ${r.name}`);
    lines.push(`- **Tip:** ${r.requirementType || '—'} | **Durum:** ${r.status || '—'} | **MoSCoW:** ${r.moscow || '—'}`);
    lines.push(`- **İş Hedefi:** ${r.objective || '—'}`);
    lines.push(`- **Modül/Ekran:** ${r.module || '—'}`);
    lines.push(`- **Kabul Kriteri:** ${r.acceptanceCriteria || 'TANIMLANMAMIŞ'}`);
    lines.push(`- **BABOK Bilgi Alanı:** ${r.babokKnowledgeArea || '—'}`);

    if (linkedBRs.length > 0) {
      lines.push(`- **Bağlı İş Kuralları:**`);
      linkedBRs.forEach(br => lines.push(`  - ${br.brId} — ${br.title}`));
    } else {
      lines.push(`- **Bağlı İş Kuralları:** —`);
    }

    if (linkedRisks.length > 0) {
      lines.push(`- **Bağlı Riskler:**`);
      linkedRisks.forEach(ri => lines.push(`  - [${riskLevel(ri.probability, ri.impact)}] ${ri.title}`));
    } else {
      lines.push(`- **Bağlı Riskler:** —`);
    }

    if (linkedCRs.length > 0) {
      lines.push(`- **Değişiklik Geçmişi:**`);
      linkedCRs.forEach(cr => lines.push(`  - ${cr.crId} — ${cr.changeType} — ${cr.status}`));
    } else {
      lines.push(`- **Değişiklik Geçmişi:** —`);
    }

    if (r.notes) lines.push(`- **Not:** ${r.notes}`);
    lines.push('');
  }

  return lines.join('\n');
}

// ── Section 6: Risk Kayıt Defteri ────────────────────────────────────────────
function section6(p) {
  const risks = p.risks        || [];
  const reqs  = p.requirements || [];
  const asms  = p.assumptions  || [];

  const groups = { Kritik: [], Orta: [], Dusuk: [] };
  for (const r of risks) {
    const lvl = riskLevel(r.probability, r.impact);
    groups[lvl].push(r);
  }

  const lines = [`## Risk Kayıt Defteri`, ``];
  if (risks.length === 0) {
    lines.push('_Risk girilmemiş._');
    return lines.join('\n');
  }

  for (const [lvl, list] of Object.entries(groups)) {
    if (list.length === 0) continue;
    lines.push(`### ${lvl} Riskler`, '');
    for (const r of list) {
      const linkedReq = reqs.find(rq => rq.id === r.linkedRequirementId);
      const linkedAsm = asms.find(a  => a.id  === r.linkedAssumptionId);
      lines.push(`#### ${r.title}`);
      lines.push(`- **Kategori:** ${r.category || '—'} | **Skor:** ${(r.probability || 1) * (r.impact || 1)}`);
      lines.push(`- **Durum:** ${r.status || '—'} | **Sorumlu:** ${r.owner || '—'}`);
      lines.push(`- **Azaltma:** ${r.mitigation || '—'}`);
      lines.push(`- **Tetikleyici:** ${r.triggerDescription || '—'}`);
      lines.push(`- **Bağlı Gereksinim:** ${linkedReq ? `${linkedReq.reqId} — ${linkedReq.name}` : '—'}`);
      lines.push(`- **Tetikleyen Varsayım:** ${linkedAsm ? linkedAsm.title : '—'}`);
      lines.push('');
    }
  }

  return lines.join('\n');
}

// ── Section 7: Değişiklik Yönetimi ───────────────────────────────────────────
function section7(p) {
  const crs  = p.changeRequests || [];
  const reqs = p.requirements   || [];
  const brs  = p.businessRules  || [];
  const asms = p.assumptions    || [];
  const risks = p.risks         || [];

  const STATUS_ORDER = ['Bekliyor', 'Onaylandi', 'Ertelendi', 'Reddedildi'];
  const sorted = [...crs].sort((a, b) => {
    return (STATUS_ORDER.indexOf(a.status) + 1 || 99) - (STATUS_ORDER.indexOf(b.status) + 1 || 99);
  });

  function findEntityName(cr) {
    if (!cr.affectedEntityId) return '—';
    const t = cr.affectedEntityType;
    if (t === 'Gereksinim') {
      const r = reqs.find(x => x.id === cr.affectedEntityId);
      return r ? `${r.reqId} — ${r.name}` : cr.affectedEntityId;
    }
    if (t === 'Is Kurali') {
      const b = brs.find(x => x.id === cr.affectedEntityId);
      return b ? `${b.brId} — ${b.title}` : cr.affectedEntityId;
    }
    if (t === 'Varsayim') {
      const a = asms.find(x => x.id === cr.affectedEntityId);
      return a ? a.title : cr.affectedEntityId;
    }
    if (t === 'Risk') {
      const r = risks.find(x => x.id === cr.affectedEntityId);
      return r ? r.title : cr.affectedEntityId;
    }
    return cr.affectedEntityId;
  }

  const lines = [`## Değişiklik Talepleri`, ``];
  if (sorted.length === 0) {
    lines.push('_Değişiklik talebi girilmemiş._');
    return lines.join('\n');
  }

  for (const cr of sorted) {
    lines.push(`### ${cr.crId}: ${cr.title}`);
    lines.push(`- **Tip:** ${cr.changeType || '—'} | **Durum:** ${cr.status || '—'}`);
    lines.push(`- **Etkilenen:** ${cr.affectedEntityType || '—'} — ${findEntityName(cr)}`);
    lines.push(`- **Açıklama:** ${cr.changeDescription || '—'}`);
    lines.push(`- **İş Gerekçesi:** ${cr.businessDriver || '—'}`);
    lines.push(`- **Etki Analizi:** ${cr.impactAnalysis || 'YAPILMADI'}`);
    lines.push(`- **Karar:** ${cr.decisionNote || '—'}`);
    if (cr.decisionDate) lines.push(`- **Karar Tarihi:** ${cr.decisionDate}`);
    lines.push('');
  }

  return lines.join('\n');
}

// ── Section 8: Aksiyon Planları ───────────────────────────────────────────────
function section8(p) {
  const actions = p.actions || [];
  const pending = actions.filter(a => a.status !== 'Tamamlandı');
  const done    = actions.filter(a => a.status === 'Tamamlandı');
  const sorted  = [...pending, ...done];

  const lines = [
    `## Aksiyon Takip Listesi`,
    ``,
    `| Başlık | Sorumlu | Son Tarih | Durum | Kaynak |`,
    `|---|---|---|---|---|`,
  ];

  if (sorted.length === 0) {
    lines.push(`| — | — | — | — | — |`);
  } else {
    for (const a of sorted) {
      lines.push(
        `| ${a.title || '—'} | ${a.owner || '—'} | ${a.dueDate || '—'} | ${a.status || '—'} | ${a.source || '—'} |`
      );
    }
  }

  return lines.join('\n');
}

// ── Section 9: Zaman Analizi ─────────────────────────────────────────────────
function section9(p) {
  const totalMeetingMinutes   = (p.meetings  || []).reduce((s, m) => s + (m.duration  || 0), 0);
  const totalActionMinutes    = (p.actions   || []).reduce((s, a) => s + (a.duration  || 0), 0);
  const totalChecklistMinutes = Object.values(p.completedTaskDurations || {}).reduce((s, d) => s + d, 0);
  const totalMinutes = totalMeetingMinutes + totalActionMinutes + totalChecklistMinutes;

  const lines = [`## Zaman Analizi`, ``];

  if (totalMinutes === 0) {
    lines.push('_Henüz zaman verisi girilmemiş._');
    return lines.join('\n');
  }

  lines.push(`Toplam kayıtlı süre: **${fmtDuration(totalMinutes)}**`, ``);
  lines.push(`- Toplantılar: ${fmtDuration(totalMeetingMinutes)}`);
  lines.push(`- Aksiyonlar: ${fmtDuration(totalActionMinutes)}`);
  lines.push(`- Analiz çalışmaları (checklist): ${fmtDuration(totalChecklistMinutes)}`);
  lines.push(``);

  // BABOK efor dağılımı — babokData yoksa atla
  const taskDurations = p.completedTaskDurations || {};
  if (Object.keys(taskDurations).length > 0) {
    lines.push(`### BABOK Efor Dağılımı`, ``);
    // Bilgi alanı başlıkları babokData'dan gelmiyor (exportEngine'de babokData yok),
    // task ID'lerinin hangi knowledge area'ya ait olduğunu prefix ile tahmin edemeyiz.
    // Bu yüzden ham task süre toplamını listele.
    const taskEntries = Object.entries(taskDurations).filter(([, d]) => d > 0);
    const taskTotal = taskEntries.reduce((s, [, d]) => s + d, 0);
    lines.push(`Toplam checklist süresi: **${fmtDuration(taskTotal)}**`);
    lines.push(`Kayıtlı görev sayısı: ${taskEntries.length}`);
    lines.push(``);
  }

  const meetingPct = totalMinutes > 0 ? Math.round((totalMeetingMinutes / totalMinutes) * 100) : 0;
  lines.push(`> Toplantı süresi analiz süresinin %${meetingPct}'ini oluşturuyor.`);
  if (meetingPct > 50) lines.push(`> ⚠ Toplantı süresi analiz süresini aşıyor.`);

  return lines.join('\n');
}

// ── Section array (for modal preview tabs) ────────────────────────────────────
export function generateBABOKSections(project) {
  const p = project || {};
  return [
    section1(p),
    section2(p),
    section3(p),
    section4(p),
    section5(p),
    section6(p),
    section7(p),
    section8(p),
    section9(p),
  ];
}

// ── Main export ───────────────────────────────────────────────────────────────
export function generateBABOKReport(project) {
  try {
    const p = project || {};
    const sections = [
      section1(p),
      hr(),
      section2(p),
      hr(),
      section3(p),
      hr(),
      section4(p),
      hr(),
      section5(p),
      hr(),
      section6(p),
      hr(),
      section7(p),
      hr(),
      section8(p),
      hr(),
      section9(p),
    ];

    const report = sections.join('\n\n');
    console.log(`[exportEngine] Rapor üretildi: ${report.length} karakter, ${project?.name || '—'}`);
    return report;
  } catch (err) {
    console.error('[exportEngine] Hata:', err);
    throw err;
  }
}
