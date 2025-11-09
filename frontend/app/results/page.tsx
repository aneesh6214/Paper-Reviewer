"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "../../components/header";
import { useRouter } from "next/navigation";
import ScoreSummary, { ScoreCategory } from "../../components/results/ScoreSummary";
import ResultsDocument from "../../components/results/ResultsDocument";
import FeedbackPanel, { FeedbackItem } from "../../components/results/FeedbackPanel";

type StoredScorecard = { id: string; title: string; isNumeric?: boolean };

export default function ResultsPage() {
  const router = useRouter();
  const [fileName, setFileName] = useState<string | null>(null);
  const [categories, setCategories] = useState<ScoreCategory[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('reviewScorecards');
      const storedName = localStorage.getItem('reviewFileName');
      if (storedName) setFileName(storedName);
      if (stored) {
        const parsed: StoredScorecard[] = JSON.parse(stored);
        // For now, generate placeholder scores only for numeric categories
        const cats: ScoreCategory[] = parsed
          .filter((c) => c.isNumeric)
          .map((c, i) => ({ id: c.id, title: c.title || `Category ${i+1}`, score: 5 }));
        setCategories(cats);
      } else {
        setCategories([
          { id: 'cat1', title: 'Category', score: 5 },
          { id: 'cat2', title: 'Category', score: 5 },
          { id: 'cat3', title: 'Category', score: 5 },
          { id: 'cat4', title: 'Category', score: 5 },
        ]);
      }
    } catch {}
  }, []);

  const feedbackItems: FeedbackItem[] = useMemo(() => ([
    { id: 'c1', text: 'Confusing copy around the description of the experimental setup; consider simplifying the sentence structure and clarifying variable definitions for the reader.' },
    { id: 'c2', text: 'The results paragraph could better separate limitations from conclusions. The results paragraph could better separate limitations from conclusions. The results paragraph could better separate limitations from conclusions. The results paragraph could better separate limitations from conclusions. Consider explicitly listing limitations at the end of the paragraph for greater clarity.' },
    { id: 'c3', text: 'Consider moving the ablation table to the appendix and summarizing only the most impactful findings in the main text so the narrative flows more smoothly.' },
    { id: 'c4', text: 'The introduction could benefit from a brief roadmap of contributions to orient the reader before diving into technical details.' },
    { id: 'c5', text: 'A small diagram showing your data processing pipeline would make the methodology easier to grasp at a glance.' },
    { id: 'c6', text: 'Please clarify whether hyperparameters were tuned on the validation set only; this is important for fairness across baselines.' },
  ]), []);

  const [selectedId, setSelectedId] = useState<string | null>(feedbackItems[0]?.id ?? null);
  const [expanded, setExpanded] = useState<boolean>(false);

  const paragraphs = useMemo(() => ([
    [
      { text: 'Consequat nostrud exercitation aute ullamco reprehenderit elit adipisicing culpa non eiusmod veniam nostrud et. ', highlightId: 'c1' },
      { text: 'Amet adipisicing ea nostrud. Aliquip dolor cupidatat qui aliqua eu adipisicing veniam ex excepteur sunt est ea aliquip. Incididunt esse pariatur nisi consequat in incididunt.' }
    ],
    [
      { text: 'Labore laborum proident Lorem incididunt fugiat ea qui consequat ad minim. Excepteur tempor velit est commodo ipsum laborum dolor ipsum cillum et nostrud culpa. Veniam et adipisicing esse amet dolor duis sunt sit deserunt elit consequat dolor adipisicing. Enim laboris in aute pariatur. Ad ea laboris magna anim ea incididunt pariatur in consectetur ut dolor adipisicing consequat dolor. Pariatur pariatur tempor est et voluptate labore ex nostrud laboris. Est velit deserunt dolore.' }
    ],
    [
      { text: 'Consequat nostrud exercitation aute ullamco reprehenderit elit adipisicing culpa non eiusmod veniam nostrud et. ', highlightId: 'c2' },
      { text: 'Amet adipisicing ea nostrud. Aliquip dolor cupidatat qui aliqua eu adipisicing veniam ex excepteur sunt est ea aliquip. Incididunt esse pariatur nisi consequat in incididunt.' }
    ],
    [
      { text: 'Amet adipisicing ea nostrud. Aliquip dolor cupidatat qui aliqua eu adipisicing veniam ex excepteur sunt est ea aliquip. ', highlightId: 'c3' },
      { text: 'Incididunt esse pariatur nisi consequat in incididunt.' }
    ],
    [
      { text: 'The introduction frames an important problem but could better ground the reader with a short bullet style list of contributions. ', highlightId: 'c4' },
      { text: 'A single sentence that previews Sections 2–4 would also improve flow.' }
    ],
    [
      { text: 'We recommend including a small pipeline diagram to summarize the preprocessing and training steps. ', highlightId: 'c5' },
      { text: 'This would reduce the cognitive load on new readers and make replication easier.' }
    ],
    [
      { text: 'Hyperparameter tuning details should clarify which splits were used to avoid leakage and to ensure fairness across baselines. ', highlightId: 'c6' },
      { text: 'This is especially important for benchmarks with limited data.' }
    ]
  ]), []);

  return (
    <div className="relative min-h-dvh" onClick={() => { setSelectedId(null); setExpanded(false); }}>
      {/* Background */}
      <img src="/landing-bg.jpg" alt="Background" className="absolute inset-0 -z-10 h-full w-full object-cover" />
      {/* Header gradient overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 -z-0 bg-gradient-to-b from-[var(--overlay-strong)] via-[var(--overlay-mid)] to-transparent" />
      <Header title="Results" buttonText="Back to Review" buttonHref="#" onButtonClick={() => router.push('/review')} showTitleHelpIcon={false} />
      <main className="relative z-10 mx-auto max-w-7xl px-8 pt-32 pb-16">
        <ScoreSummary fileName={fileName} grade="A+" categories={categories} onUploadNew={() => router.push('/review')} />
        <div className="mt-4 grid h-[calc(100vh-180px)] gap-4" style={{ gridTemplateColumns: '1fr 380px' }} onClick={(e) => e.stopPropagation()}>
          <div className="h-full">
            <ResultsDocument paragraphs={paragraphs} selectedCommentId={selectedId} onSelectHighlight={(id) => { setSelectedId(id); setExpanded(true); }} />
          </div>
          <FeedbackPanel items={feedbackItems} selectedId={selectedId} expanded={expanded} onSelect={(id) => { setSelectedId(id); setExpanded(false); }} onToggleExpand={(exp) => setExpanded(exp)} />
        </div>
      </main>
    </div>
  );
}



