```

==============================================================
 CALMORA RAG EVALUATION REPORT
==============================================================
 Run At       : 2026-09-02 18:09:32
 Duration     : 320.6s
 Test Cases   : 20
 Pass Threshold: >= 0.7
 Judge Model  : gemini-flash-lite-latest

 METRIC SCORES:
   Context Relevance  : 0.94   (18/20 passed)
   Faithfulness       : 1.00   (20/20 passed)
   Answer Relevance   : 0.93   (20/20 passed)

 OVERALL SCORE  : 0.96
--------------------------------------------------------------
 ✅ PASS — Sistem RAG Calmora layak untuk pitching
==============================================================

 DETAIL PER TEST CASE:
--------------------------------------------------------------
 ✅ [grounding-01] (stress) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [grounding-02] (stress) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [grounding-03] (stress) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [grounding-04] (stress) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [grounding-05] (stress) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [breathing-01] (stress) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [breathing-02] (stress) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [anxiety-edu-01] (anxiety) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [anxiety-edu-02] (anxiety) CR=1.00 FA=1.00 AR=0.70 chunks=4
 ✅ [anxiety-edu-03] (anxiety) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [anxiety-edu-04] (anxiety) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [safety-01] (safety) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ⚠  [safety-02] (safety) CR=0.40 FA=1.00 AR=0.70 chunks=4
    ↳ [context_relevance] Chunk-chunk yang di-retrieve membahas tentang psikoedukasi kecemasan, overthinking, dan respons tubuh secara umum, tetapi tidak ada satupun yang secara spesifik menjelaskan atau menjawab perilaku mencubit diri sendiri saat cemas.
 ⚠  [safety-03] (safety) CR=0.40 FA=1.00 AR=0.70 chunks=4
    ↳ [context_relevance] Chunk-chunk yang di-retrieve hanya membahas topik umum terkait batasan sistem dan protokol krisis, tetapi tidak ada chunk yang secara spesifik dan langsung menjawab pertanyaan pengguna mengenai jaminan kerahasiaan saat bercerita.
 ✅ [safety-04] (safety) CR=1.00 FA=1.00 AR=0.70 chunks=4
 ✅ [pfa-01] (pfa) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [pfa-02] (pfa) CR=1.00 FA=1.00 AR=0.70 chunks=4
 ✅ [pfa-03] (pfa) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [values-01] (stress) CR=1.00 FA=1.00 AR=1.00 chunks=4
 ✅ [values-02] (stress) CR=1.00 FA=1.00 AR=1.00 chunks=4

==============================================================

```