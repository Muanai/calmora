---
source: who_pfa
source_pages: "26-33"
domain: pfa
topic: limits_and_escalation
content_type: clinical_guideline
complexity: low
recommended_states:
  - acute_distress
  - moderate_anxiety
  - reflective
excluded_states:
  - high_risk
---

# Batas Kemampuan & Protokol Eskalasi Krisis (Knowing Your Limits)

Psychological First Aid (PFA) memiliki batas yang sangat tegas. PFA dan sistem AI pertolongan pertama **bukanlah** intervensi klinis, konseling psikiatris, atau pengganti penanganan medis darurat. 

Memaksa menenangkan seseorang yang sedang berada dalam krisis medis atau psikiatris berat menggunakan teks duka/ grounding bukan hanya tidak berguna, tetapi berbahaya dan berisiko merenggut nyawa.

## 1. Indikator Kondisi Kritis (Red Flags)

Jika pengguna atau individu menunjukkan salah satu dari indikator di bawah ini, kognisi mereka telah melewati batas kemampuan PFA dasar. Sistem harus segera membekukan alur percakapan standar dan mengaktifkan **Safety Override / Crisis Protocol**.

### A. Risiko Bunuh Diri & Membahayakan Diri (Suicide & Self-Harm)
- Adanya niat, rencana, atau impuls yang diungkapkan secara eksplisit maupun implisit untuk mengakhiri hidup.
- Ungkapan keputusasaan ekstrem (misalnya: "Saya tidak punya alasan lagi untuk hidup," "Semua orang akan lebih baik tanpa saya").
- Tindakan melukai diri sendiri (*active self-harm*) yang sedang atau baru saja terjadi.

### B. Indikator Psikosis & Kehilangan Kontak Realitas
- Halusinasi pendengaran atau penglihatan yang berat dan mengancam.
- Paranoia ekstrem atau delusi yang membuat mereka tidak mampu merespon instruksi *grounding* sederhana.
- Disosiasi berat di mana individu tidak mengenali identitas diri atau keberadaan mereka sama sekali secara persisten.

### C. Darurat Medis Fisik
- Gejala fisik ekstrem yang menyerupai serangan jantung (nyeri dada hebat, sesak napas akut yang tidak membaik dengan latihan napas, rasa tercekik berat).
- Kehilangan kesadaran, kejang, atau efek samping berat dari konsumsi zat/obat-obatan.

### D. Kehadiran Bahaya Fisik Aktif
- Pengguna berada dalam situasi kekerasan fisik aktif (KDRT, ancaman kejahatan, lingkungan berbahaya).

## 2. Protokol Tindakan: Safety Override

Ketika *Red Flags* terdeteksi oleh sistem (*Risk/State Engine*), alur interaksi PFA biasa **harus dihentikan seketika**. Sistem mengalihkan peran dari pendamping emosional menjadi **papan petunjuk darurat (crisis router)**.

```text
[Red Flag Terdeteksi]
         │
         ▼
[Hentikan RAG / Vector Search]
         │
         ▼
[Aktifkan Crisis Protocol]
         │
         ▼
[Sajikan Hotline Darurat & Kontak Profesional Direct]