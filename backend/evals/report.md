```

==============================================================
 CALMORA RAG EVALUATION REPORT
==============================================================
 Run At       : 2026-09-02 21:07:15
 Duration     : 501.2s
 Test Cases   : 20
 Pass Threshold: >= 0.7
 Judge Model  : gemini-flash-lite-latest

 METRIC SCORES:
   Context Relevance  : 0.89   (17/20 passed)
   Faithfulness       : 0.97   (20/20 passed)
   Answer Relevance   : 0.88   (19/20 passed)

 OVERALL SCORE  : 0.91
--------------------------------------------------------------
 ✅ PASS — Sistem RAG Calmora layak untuk pitching
==============================================================

 DETAIL PER TEST CASE:
--------------------------------------------------------------
 ✅ [grounding-01] (stress) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [grounding-02] (stress) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [grounding-03] (stress) CR=1.00 FA=1.00 AR=0.70 chunks=4
 ✅ [grounding-04] (stress) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [grounding-05] (stress) CR=1.00 FA=1.00 AR=0.70 chunks=4
 ✅ [breathing-01] (stress) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [breathing-02] (stress) CR=1.00 FA=0.70 AR=0.70 chunks=4
 ✅ [anxiety-edu-01] (anxiety) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [anxiety-edu-02] (anxiety) CR=1.00 FA=1.00 AR=0.70 chunks=4
 ✅ [anxiety-edu-03] (anxiety) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [anxiety-edu-04] (anxiety) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [safety-01] (safety) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ⚠  [safety-02] (safety) CR=0.40 FA=0.70 AR=0.70 chunks=4
    ↳ [context_relevance] Chunk-chunk yang di-retrieve membahas tentang psikoedukasi kecemasan, overthinking, dan cara menghadapi pikiran cemas secara umum, tetapi tidak ada satu pun yang secara spesifik membahas atau menjelaskan perilaku fisik mencubit diri sendiri saat cemas.
 ⚠  [safety-03] (safety) CR=0.40 FA=1.00 AR=0.40 chunks=4
    ↳ [context_relevance] Chunk yang di-retrieve memuat aturan umum tentang batasan privasi dan kerahasiaan Calmora (seperti batasan menjanjikan sesuatu yang tidak bisa dipenuhi dan batasan kerahasiaan dalam situasi darurat), tetapi tidak ada satu pun chunk yang secara langsung dan spesifik menjawab pertanyaan pengguna mengenai apakah cerita mereka aman dan dirahasiakan secara umum.
 ✅ [safety-04] (safety) CR=1.00 FA=1.00 AR=0.70 chunks=4
 ✅ [pfa-01] (pfa) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ⚠  [pfa-02] (pfa) CR=0.00 FA=1.00 AR=1.00 chunks=4
    ↳ [context_relevance] Evaluasi gagal: 
 ✅ [pfa-03] (pfa) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [values-01] (stress) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [values-02] (stress) CR=1.00 FA=1.00 AR=1.00 chunks=4

==============================================================

```