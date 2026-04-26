# BABOK Guide — Interaction Design System
> AURA v2 — Oturum: 26 Nisan 2026

## Kullanıcı Profili

**IT Süreç Analistleri** — BABOK v3 metodolojisini günlük kullanan profesyoneller. Yoğun veri girişi, 14+ sekme arası geçiş, hız öncelikli.

---

## Uygulanan Değişiklikler

### S1 — Tab Skeleton Sistemi (`LoadingFallback.jsx`)

Spinner → içerik şekilli skeleton. Her tab kendi layout'unu yansıtıyor.

| Tab | Skeleton Tipi |
|-----|--------------|
| dashboard | Ring + stat kartlar + progress + bento |
| meetings | Sidebar liste + içerik panel split |
| gantt | Offset horizontal bar rows |
| knowledge_areas | 3-col kart grid |
| templates | 2-col kart grid |
| requirements | 8-kolonlu tablo (ID, Seviye, Tip, F/NF, ...) |
| risks, assumptions, businessrules, actions, stakeholders, changes, glossary, traceability | Tab'a özgü kolon genişlikleri |

**Animasyon:** `skeletonSweep` — soldan sağa 1.8s sweep, `rgba(255,255,255,0.04→0.09→0.04)`. AURA dark void ile uyumlu.

### S2 — AI Modal Progressive Feedback (`DocumentAnalysisModal.jsx`)

3 adımlı step sistemi: ikon + durum rengi + elapsed timer + completion strikethrough.

| Durum | Görünüm |
|-------|---------|
| Tamamlandı | `CheckCircle2` emerald, üstü çizili metin |
| Aktif | `Loader2` spin violet, kalın metin |
| Bekliyor | İkon gri, soluk metin (opacity-25) |

Elapsed timer: `MM:SS` monospace, violet/60 rengi.
Progress bar: done=emerald, active=violet, pending=white/10.

### R1 — Per-tab Precise Skeletons

Her tabloda kolon genişlikleri gerçek içerikle eşleşiyor — requirements için 8 kolon, risks için 6, glossary için 5, vs. Doğal görünüm için satır varyantları arasında genişlik değişimi var.

---

## AURA Sistem Referansı

- **Font:** Inter (body), Space Grotesk (istatistikler)
- **Palet:** cyan `#22d3ee/#06b6d4`, violet `#8b5cf6/#a78bfa`, rose `#f43f5e`
- **Dark void bg:** `#0c1120` + radial gradient katmanlar
- **Glass:** `rgba(16,26,52,0.65)` backdrop-blur-22px
- **Skeleton:** `rgba(255,255,255,0.04)` base, `0.09` sweep peak

---

## Sonraki Adımlar (Öneri)

| Öncelik | Konu | Açıklama |
|---------|------|----------|
| P2 | Groq Streaming | `groqClient.js`'e streaming reader ekle, `AnalysisResultsModal`'ı gerçek zamanlı doldur |
| P3 | Tab geçiş animasyonu | `aura-content-enter` yeterli ama fade+slide yönü tab sırasına göre değişebilir |
| P3 | Boş durum iyileştirme | `empty-state-icon` zaten var, bento kartlara da eklenebilir |
