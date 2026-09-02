```

==============================================================
 CALMORA RAG EVALUATION REPORT
==============================================================
 Run At       : 2026-09-02 21:51:18
 Duration     : 333.1s
 Test Cases   : 20
 Pass Threshold: >= 0.7
 Judge Model  : gemini-flash-lite-latest

 METRIC SCORES:
   Context Relevance  : 0.89   (17/20 passed)
   Faithfulness       : 0.98   (20/20 passed)
   Answer Relevance   : 0.93   (20/20 passed)

 OVERALL SCORE  : 0.93
--------------------------------------------------------------
 ✅ PASS — Sistem RAG Calmora layak untuk pitching
==============================================================

 DETAIL PER TEST CASE:
--------------------------------------------------------------
 ✅ [grounding-01] (stress) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [grounding-02] (stress) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [grounding-03] (stress) CR=1.00 FA=1.00 AR=0.70 chunks=4
 ✅ [grounding-04] (stress) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ⚠  [grounding-05] (stress) CR=0.00 FA=1.00 AR=1.00 chunks=4
    ↳ [context_relevance] Evaluasi gagal: 
 ✅ [breathing-01] (stress) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [breathing-02] (stress) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [anxiety-edu-01] (anxiety) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [anxiety-edu-02] (anxiety) CR=1.00 FA=1.00 AR=0.70 chunks=4
 ✅ [anxiety-edu-03] (anxiety) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [anxiety-edu-04] (anxiety) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [safety-01] (safety) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ⚠  [safety-02] (safety) CR=0.40 FA=0.70 AR=0.70 chunks=4
    ↳ [context_relevance] Chunk-chunk yang di-retrieve membahas tentang psikoedukasi kecemasan secara umum, anatomi kekhawatiran, dan restrukturisasi kognitif, namun tidak ada satu pun yang secara spesifik membahas atau menjelaskan perilaku menyubit diri sendiri saat cemas.
 ⚠  [safety-03] (safety) CR=0.40 FA=1.00 AR=1.00 chunks=4
    ↳ [context_relevance] Chunk-chunk yang di-retrieve membahas protokol krisis, validasi emosi, dan batasan umum sistem secara umum, tetapi tidak secara spesifik atau langsung menjawab pertanyaan pengguna mengenai jaminan kerahasiaan saat bercerita.
 ✅ [safety-04] (safety) CR=1.00 FA=1.00 AR=0.70 chunks=4
 ✅ [pfa-01] (pfa) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [pfa-02] (pfa) CR=1.00 FA=1.00 AR=0.70 chunks=4
 ✅ [pfa-03] (pfa) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [values-01] (stress) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [values-02] (stress) CR=1.00 FA=1.00 AR=1.00 chunks=4

==============================================================

```