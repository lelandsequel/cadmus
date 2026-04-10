'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { SPEC_SECTIONS } from '@/lib/sections';
import { Project, Answer } from '@/types';
import { getScoreLabel, getScoreBarColor } from '@/lib/scoring';
import { cn } from '@/lib/utils';

interface ScoreData {
  clarity: number;
  completeness: number;
  logic_integrity: number;
  edge_case: number;
  build_readiness: number;
  reasoning: string;
}

const SCORE_CARDS = [
  { key: 'clarity' as keyof ScoreData, label: 'Clarity', icon: 'visibility', desc: 'How clear and unambiguous are goals?' },
  { key: 'completeness' as keyof ScoreData, label: 'Completeness', icon: 'checklist', desc: 'Are all sections filled meaningfully?' },
  { key: 'logic_integrity' as keyof ScoreData, label: 'Logic Integrity', icon: 'account_tree', desc: 'Do the rules make sense together?' },
  { key: 'edge_case' as keyof ScoreData, label: 'Edge Cases', icon: 'warning', desc: 'Are failure modes addressed?' },
  { key: 'build_readiness' as keyof ScoreData, label: 'Build Readiness', icon: 'rocket_launch', desc: 'Could an engineer start building today?' },
];

export default function ScorePage() {
  const { id } = useParams<{ id: string }>();
  const supabase = getSupabaseBrowserClient();

  const [project, setProject] = useState<Project | null>(null);
  const [scores, setScores] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: proj } = await supabase.from('projects').select('*').eq('id', id).single();
      setProject(proj);

      if (proj && (proj.clarity_score > 0 || proj.completeness_score > 0)) {
        setScores({
          clarity: proj.clarity_score,
          completeness: proj.completeness_score,
          logic_integrity: proj.logic_integrity_score,
          edge_case: proj.edge_case_score,
          build_readiness: proj.build_readiness_score,
          reasoning: 'Scores from last evaluation.',
        });
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleRefreshScore = async () => {
    setRefreshing(true);
    try {
      // Get answers
      const { data: answersData } = await supabase
        .from('answers')
        .select('*')
        .eq('project_id', id);

      const answers: { section: string; content: string }[] = [];
      const answersMap: Record<string, string> = {};
      (answersData as Answer[] || []).forEach((a) => {
        answersMap[`${a.section_type}::${a.question_key}`] = a.answer_text || '';
      });

      SPEC_SECTIONS.forEach((section) => {
        const parts = section.questions
          .map((q) => {
            const val = answersMap[`${section.type}::${q.key}`];
            return val ? `${q.label}: ${val}` : null;
          })
          .filter(Boolean);

        if (parts.length > 0) {
          answers.push({ section: section.title, content: parts.join('\n') });
        }
      });

      if (answers.length === 0) {
        alert('Fill in some spec sections first!');
        setRefreshing(false);
        return;
      }

      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) throw new Error('Scoring failed');
      const result = await res.json();
      setScores(result);

      // Save to DB
      await supabase
        .from('projects')
        .update({
          clarity_score: result.clarity,
          completeness_score: result.completeness,
          logic_integrity_score: result.logic_integrity,
          edge_case_score: result.edge_case,
          build_readiness_score: result.build_readiness,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
    } catch (err) {
      console.error(err);
      alert('Failed to score. Try again.');
    }
    setRefreshing(false);
  };

  const overallScore = scores
    ? Math.round(
        (scores.clarity * 0.2 +
          scores.completeness * 0.25 +
          scores.logic_integrity * 0.2 +
          scores.edge_case * 0.15 +
          scores.build_readiness * 0.2)
      )
    : 0;

  if (loading) {
    return (
      <div className="flex h-screen bg-surface items-center justify-center">
        <span className="text-on-surface-variant">Loading scores...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-surface overflow-hidden flex-col">
      {/* Header */}
      <div className="h-14 bg-surface-container-low shadow-sm flex items-center px-6 gap-4 flex-shrink-0">
        <Link href={`/projects/${id}/spec`} className="text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <span className="font-bold text-on-surface">{project?.title || 'Readiness Score'}</span>
        <div className="ml-auto flex gap-2">
          <Link
            href={`/projects/${id}/exports`}
            className="sculpted-pill text-white text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Export
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          {/* Overall */}
          <div className="clay-card p-8 rounded-lg border border-white/60 mb-8 flex items-center gap-8">
            <div className="text-center">
              <div
                className={cn(
                  'w-24 h-24 rounded-full flex items-center justify-center text-3xl font-extrabold border-4',
                  overallScore >= 85
                    ? 'border-tertiary text-tertiary bg-tertiary-pale'
                    : overallScore >= 70
                    ? 'border-primary text-primary bg-primary-fixed'
                    : overallScore >= 50
                    ? 'border-secondary text-secondary bg-secondary-pale'
                    : 'border-error text-error bg-error/10'
                )}
              >
                {overallScore}
              </div>
              <p className="text-xs font-bold text-on-surface-variant mt-2 uppercase tracking-widest">
                Overall
              </p>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-extrabold text-on-surface mb-1">
                {getScoreLabel(overallScore).label} Spec
              </h2>
              {scores?.reasoning && (
                <p className="text-on-surface-variant text-sm leading-relaxed">{scores.reasoning}</p>
              )}
              {!scores && (
                <p className="text-on-surface-variant text-sm">
                  Run the scorer to get your readiness assessment.
                </p>
              )}
            </div>
            <button
              onClick={handleRefreshScore}
              disabled={refreshing}
              className="sculpted-pill text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:translate-y-[-2px] transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 flex-shrink-0"
            >
              {refreshing ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                  Scoring...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">analytics</span>
                  Refresh Score
                </>
              )}
            </button>
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SCORE_CARDS.map((card) => {
              const score = scores ? (scores[card.key] as number) : 0;
              const label = getScoreLabel(score);
              const barColor = getScoreBarColor(score);

              return (
                <div key={card.key} className="clay-card p-6 rounded-lg border border-white/60">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        {card.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-on-surface text-sm">{card.label}</h3>
                      <p className="text-[10px] text-on-surface-variant">{card.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-end justify-between mb-2">
                    <span className={cn('text-3xl font-extrabold', label.textColor)}>
                      {scores ? score : '--'}
                    </span>
                    {scores && (
                      <span
                        className={cn(
                          'text-xs font-bold px-2 py-0.5 rounded-full',
                          label.bgColor,
                          label.textColor
                        )}
                      >
                        {label.label}
                      </span>
                    )}
                  </div>
                  <div className="w-full h-2 bg-surface-high rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all', barColor)}
                      style={{ width: scores ? `${score}%` : '0%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {!scores && (
            <div className="mt-8 text-center">
              <p className="text-on-surface-variant text-sm mb-4">
                Fill in your spec sections, then click Refresh Score to get your readiness assessment.
              </p>
              <Link
                href={`/projects/${id}/spec`}
                className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Go to Spec Interview
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
