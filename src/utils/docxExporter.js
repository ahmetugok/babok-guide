import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, HeadingLevel, AlignmentType, WidthType, ShadingType,
} from 'docx';
import { saveAs } from 'file-saver';

// ── Helpers ──────────────────────────────────────────────────────────────────

const hasData = (arr) => Array.isArray(arr) && arr.length > 0;

const spacer = () => new Paragraph({ text: '' });

const h1 = (text) =>
  new Paragraph({ text, heading: HeadingLevel.HEADING_1 });

const h2 = (text) =>
  new Paragraph({ text, heading: HeadingLevel.HEADING_2 });

const cell = (text, opts = {}) =>
  new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: String(text ?? '—'),
            bold: opts.bold || false,
            color: opts.color || undefined,
            size: opts.size || undefined,
          }),
        ],
        alignment: opts.align || AlignmentType.LEFT,
      }),
    ],
    shading: opts.shading || undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    width: opts.width
      ? { size: opts.width, type: WidthType.PERCENTAGE }
      : undefined,
  });

const headerShading = { fill: '1e3a5f', type: ShadingType.CLEAR, color: 'auto' };

const makeTable = (headers, rows) => {
  const colWidth = Math.floor(100 / headers.length);
  const headerRow = new TableRow({
    children: headers.map((h) =>
      cell(h, { bold: true, color: 'FFFFFF', shading: headerShading, width: colWidth })
    ),
    tableHeader: true,
  });
  const dataRows = rows.map(
    (row) =>
      new TableRow({
        children: row.map((v) => cell(v, { width: colWidth })),
      })
  );
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
  });
};

// ── Section builders ─────────────────────────────────────────────────────────

function buildCover(project) {
  const contextFirstLine = (project.projectContext || '').split('\n')[0].trim();
  return [
    new Paragraph({
      children: [new TextRun({ text: project.name || 'Proje', bold: true, size: 56 })],
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.HEADING_1,
    }),
    new Paragraph({
      children: [new TextRun({ text: 'BABOK Proje Raporu', size: 32, color: '4A90A4' })],
      alignment: AlignmentType.CENTER,
    }),
    spacer(),
    new Paragraph({
      children: [
        new TextRun({ text: 'Tarih: ', bold: true }),
        new TextRun({ text: new Date().toLocaleDateString('tr-TR') }),
      ],
      alignment: AlignmentType.CENTER,
    }),
    ...(contextFirstLine
      ? [
          new Paragraph({
            children: [
              new TextRun({ text: 'Hazırlayan: ', bold: true }),
              new TextRun({ text: contextFirstLine }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ]
      : []),
  ];
}

function buildSummary(project) {
  const reqs = project.requirements || [];
  const risks = project.risks || [];
  const crs = project.changeRequests || [];
  const asms = project.assumptions || [];

  return [
    h2('Proje Özeti'),
    makeTable(
      ['Alan', 'Değer'],
      [
        ['Toplam Gereksinim', reqs.length],
        ['Açık Risk', risks.filter((r) => r.status === 'Açık').length],
        ['Bekleyen Değişiklik Talebi', crs.filter((c) => c.status === 'Bekliyor').length],
        ['Doğrulanmamış Varsayım', asms.filter((a) => a.validationStatus === 'Dogrulanmadi').length],
      ]
    ),
  ];
}

function buildStakeholders(stakeholders) {
  if (!hasData(stakeholders)) return [];
  return [
    h2('Paydaş ve RACI Matrisi'),
    makeTable(
      ['Ad', 'Rol', 'Departman', 'İlgi (1-4)', 'Etki (1-4)', 'RACI'],
      stakeholders.map((s) => [
        s.name || '—',
        s.role || '—',
        s.department || '—',
        s.interest ?? '—',
        s.influence ?? '—',
        s.raci || '—',
      ])
    ),
  ];
}

function buildAssumptions(assumptions) {
  const varsayimlar = (assumptions || []).filter((a) => a.type === 'Varsayim');
  const kisitlar = (assumptions || []).filter((a) => a.type === 'Kisit');
  const out = [];

  if (hasData(varsayimlar)) {
    out.push(h2('Varsayımlar'));
    varsayimlar.forEach((a) => {
      out.push(
        new Paragraph({
          children: [new TextRun({ text: `• ${a.title}`, bold: true })],
        })
      );
      if (a.content?.trim()) {
        out.push(
          new Paragraph({
            children: [new TextRun({ text: `  ${a.content}`, color: '555555' })],
            indent: { left: 360 },
          })
        );
      }
    });
  }

  if (hasData(kisitlar)) {
    out.push(h2('Kısıtlar'));
    kisitlar.forEach((k) => {
      out.push(
        new Paragraph({
          children: [new TextRun({ text: `• ${k.title}`, bold: true })],
        })
      );
      if (k.content?.trim()) {
        out.push(
          new Paragraph({
            children: [new TextRun({ text: `  ${k.content}`, color: '555555' })],
            indent: { left: 360 },
          })
        );
      }
    });
  }

  return out;
}

function buildBusinessRules(businessRules) {
  if (!hasData(businessRules)) return [];
  return [
    h2('İş Kuralları'),
    makeTable(
      ['BR ID', 'Başlık', 'Kural Metni', 'Kategori', 'Durum'],
      businessRules.map((br) => [
        br.brId || '—',
        br.title || '—',
        br.ruleText || '—',
        br.category || '—',
        br.status || '—',
      ])
    ),
  ];
}

function buildRequirements(requirements) {
  if (!hasData(requirements)) return [];
  return [
    h2('Gereksinim Kataloğu'),
    makeTable(
      ['REQ ID', 'Başlık', 'Açıklama', 'MoSCoW', 'Tür', 'Durum'],
      requirements.map((r) => [
        r.reqId || '—',
        r.name || '—',
        r.objective || '—',
        r.moscow || '—',
        r.requirementType || '—',
        r.status || '—',
      ])
    ),
  ];
}

function buildRisks(risks) {
  if (!hasData(risks)) return [];
  return [
    h2('Risk Kayıt Defteri'),
    makeTable(
      ['No', 'Başlık', 'Olasılık', 'Etki', 'O×E', 'Durum'],
      risks.map((r, i) => [
        i + 1,
        r.title || '—',
        r.probability ?? '—',
        r.impact ?? '—',
        r.probability && r.impact ? r.probability * r.impact : '—',
        r.status || '—',
      ])
    ),
  ];
}

function buildChangeRequests(changeRequests) {
  if (!hasData(changeRequests)) return [];
  return [
    h2('Değişiklik Talepleri'),
    makeTable(
      ['CR ID', 'Başlık', 'Tür', 'Durum', 'Açıklama', 'Tarih'],
      changeRequests.map((c) => [
        c.crId || '—',
        c.title || '—',
        c.changeType || '—',
        c.status || '—',
        c.changeDescription || '—',
        c.createdAt || '—',
      ])
    ),
  ];
}

function buildActions(actions) {
  if (!hasData(actions)) return [];
  return [
    h2('Aksiyon Takip Listesi'),
    makeTable(
      ['No', 'Başlık', 'Sorumlu', 'Son Tarih', 'Durum'],
      actions.map((a, i) => [
        i + 1,
        a.title || '—',
        a.owner || '—',
        a.dueDate || '—',
        a.status || '—',
      ])
    ),
  ];
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function generateDocx(project) {
  const sections = [
    ...buildCover(project),
    spacer(),
    spacer(),
    ...buildSummary(project),
    spacer(),
    ...buildStakeholders(project.stakeholders),
    ...(hasData(project.stakeholders) ? [spacer()] : []),
    ...buildAssumptions(project.assumptions),
    ...((project.assumptions || []).some((a) => a.type === 'Varsayim' || a.type === 'Kisit') ? [spacer()] : []),
    ...buildBusinessRules(project.businessRules),
    ...(hasData(project.businessRules) ? [spacer()] : []),
    ...buildRequirements(project.requirements),
    ...(hasData(project.requirements) ? [spacer()] : []),
    ...buildRisks(project.risks),
    ...(hasData(project.risks) ? [spacer()] : []),
    ...buildChangeRequests(project.changeRequests),
    ...(hasData(project.changeRequests) ? [spacer()] : []),
    ...buildActions(project.actions),
  ];

  const doc = new Document({
    creator: 'BABOK Guide App',
    title: `${project.name || 'Proje'} — BABOK Raporu`,
    sections: [{ children: sections }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${project.name || 'proje'}_BABOK.docx`);
}
