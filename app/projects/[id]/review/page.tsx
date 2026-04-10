'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { SPEC_SECTIONS } from '@/lib/sections';
import { Project, Answer, Review } from '@/types';
import { cn } from '@/lib/utils';

type Severity = 'good' | 'warning' | 'critical';

const severityConfig: Record<Severity, { label: string; color: string; bg: string; icon: string }> = {
  good: { label: 'Good', color: 'text-tertiary', bg: 'bg-tertiary-pale', icon: 'thumb_up' },
  warning: { label: 'Warning', color: 'text-secondary', bg: 'bg-secondary-pale', icon: 'info' },
  critical: { label: 'Critical', color: 'text-error', bg: 'bg-error/10', icon: 'error' },
};

export default function ReviewPage() {
  const { id } = useParams<{ id: string }>();
  const supabase = getSupabaseBrowserClient();

  const [project, setProject] = useState<Project | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newSeverity, setNewSeverity] = useState<Severity>('warning');
  const [activeSection, setActiveSection] = useState<string>('objective');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: proj } = await supabase.from('projects').select('*').eq('id', id).single();
      setProject(proj);

      const { data: answersData } = await supabase.from('answers').select('*').eq('project_id', id);
      const map: Record<string, string> = {};
      (answersData as Answer[] || []).forEach((a) => {
        map[`${a.section_type}::${a.question_key}`] = a.answer_text || '';
      });
      setAnswers(map);

      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });
      setReviews((reviewsData as Review[]) || []);
    }
    load();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { data: review } = await supabase
      .from('reviews')
      .insert({
        project_id: id,
        section_type: activeSection,
        severity: newSeverity,
        comment: newComment,
        status: 'open',
        created_by: user?.id,
      })
      .select('*')
      .single();

    if (review) {
      setReviews((prev) => [review as Review, ...prev]);
    }
    setNewComment('');
    setSubmitting(false);
  };

  const handleResolve = async (reviewId: string) => {
    await supabase.from('reviews').update({ status: 'resolved' }).eq('id', reviewId);
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status: 'resolved' } : r))
    );
  };

  const sectionReviews = reviews.filter(
    (r) => r.section_type === activeSection
  );

  const openCount = reviews.filter((r) => r.status === 'open').length;
  const criticalCount = reviews.filter((r) => r.severity === 'critical' && r.status === 'open').length;

  return (
    <div className="flex h-screen bg-surface overflow-hidden flex-col">
      {/* Header */}
      <div className="h-14 bg-surface-container-low shadow-sm flex items-center px-6 gap-4 flex-shrink-0">
        <Link href={`/projects/${id}/spec`} className="text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <span className="font-bold text-on-surface">{project?.title || 'Review Mode'}</span>
        <div className="flex gap-2 ml-auto">
          {openCount > 0 && (
            <span className="px-3 py-1 bg-secondary-pale text-secondary text-xs font-bold rounded-full">
              {openCount} open
            </span>
          )}
          {criticalCount > 0 && (
            <span className="px-3 py-1 bg-error/10 text-error text-xs font-bold rounded-full">
              {criticalCount} critical
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Section nav */}
        <aside className="w-56 bg-surface-container-low border-r border-surface-high py-6 px-4 overflow-y-auto">
          <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-4">
            Sections
          </p>
          <nav className="space-y-0.5">
            {SPEC_SECTIONS.map((section) => {
              const sReviews = reviews.filter((r) => r.section_type === section.type && r.status === 'open');
              return (
                <button
                  key={section.type}
                  onClick={() => setActiveSection(section.type)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left',
                    activeSection === section.type
                      ? 'bg-surface-container text-primary font-bold'
                      : 'text-on-surface-variant hover:bg-surface-container/50'
                  )}
                >
                  <span className="material-symbols-outlined text-[16px]">{section.icon}</span>
                  <span className="flex-1">{section.title}</span>
                  {sReviews.length > 0 && (
                    <span className={cn(
                      'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                      sReviews.some((r) => r.severity === 'critical')
                        ? 'bg-error/10 text-error'
                        : 'bg-secondary-pale text-secondary'
                    )}>
                      {sReviews.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main review area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-3xl mx-auto">
            {/* Section content */}
            {(() => {
              const section = SPEC_SECTIONS.find((s) => s.type === activeSection);
              if (!section) return null;
              return (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-on-surface mb-4 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">{section.icon}</span>
                    {section.title}
                  </h2>
                  <div className="clay-card p-6 rounded-lg border border-white/60 space-y-4">
                    {section.questions.map((q) => {
                      const val = answers[`${section.type}::${q.key}`];
                      return (
                        <div key={q.key}>
                          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
                            {q.label}
                          </p>
                          {val ? (
                            <p className="text-on-surface text-sm leading-relaxed">{val}</p>
                          ) : (
                            <p className="text-on-surface-variant/50 text-sm italic">Not filled in</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Add comment */}
            <div className="clay-card p-6 rounded-lg border border-white/60 mb-8">
              <h3 className="font-bold text-on-surface text-sm mb-4">Add Review Comment</h3>
              <div className="flex gap-2 mb-3">
                {(['good', 'warning', 'critical'] as Severity[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setNewSeverity(s)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-bold transition-all',
                      newSeverity === s
                        ? `${severityConfig[s].bg} ${severityConfig[s].color}`
                        : 'bg-surface-high text-on-surface-variant'
                    )}
                  >
                    {severityConfig[s].label}
                  </button>
                ))}
              </div>
              <div className="clay-inset rounded-xl p-1 focus-within:ring-2 ring-primary/20 mb-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Leave a review comment for this section..."
                  rows={3}
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder-outline/60 text-sm resize-none px-4 py-3 outline-none"
                />
              </div>
              <button
                onClick={handleAddComment}
                disabled={submitting || !newComment.trim()}
                className="sculpted-pill text-white px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>

            {/* Existing reviews */}
            {sectionReviews.length > 0 ? (
              <div className="space-y-3">
                <h3 className="font-bold text-on-surface-variant text-xs uppercase tracking-widest">
                  Comments ({sectionReviews.length})
                </h3>
                {sectionReviews.map((review) => {
                  const cfg = severityConfig[review.severity as Severity] || severityConfig.warning;
                  return (
                    <div
                      key={review.id}
                      className={cn(
                        'p-4 rounded-xl border flex items-start gap-3',
                        review.status === 'resolved'
                          ? 'opacity-50 bg-surface-high'
                          : cfg.bg
                      )}
                    >
                      <span className={cn('material-symbols-outlined text-sm mt-0.5', cfg.color)}>
                        {cfg.icon}
                      </span>
                      <div className="flex-1">
                        <p className={cn('text-sm', review.status === 'resolved' ? 'line-through text-on-surface-variant' : 'text-on-surface')}>
                          {review.comment}
                        </p>
                        <p className="text-[10px] text-on-surface-variant mt-1">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {review.status === 'open' && (
                        <button
                          onClick={() => handleResolve(review.id)}
                          className="text-xs text-on-surface-variant hover:text-tertiary transition-colors font-medium"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-on-surface-variant/50">
                <span className="material-symbols-outlined text-3xl block mb-2">reviews</span>
                <p className="text-sm">No comments for this section yet.</p>
              </div>
            )}
          </div>
        </main>

        {/* Summary panel */}
        <aside className="w-64 bg-surface-container-low border-l border-surface-high p-6 overflow-y-auto">
          <h4 className="font-bold text-xs text-on-surface-variant uppercase tracking-widest mb-4">
            Review Summary
          </h4>
          <div className="space-y-3">
            <div className="clay-card p-4 rounded-lg border border-white/60">
              <div className="flex justify-between">
                <span className="text-xs text-on-surface-variant">Total</span>
                <span className="font-bold text-on-surface">{reviews.length}</span>
              </div>
            </div>
            {(['critical', 'warning', 'good'] as Severity[]).map((s) => {
              const count = reviews.filter((r) => r.severity === s && r.status === 'open').length;
              return (
                <div key={s} className={cn('p-3 rounded-lg', severityConfig[s].bg)}>
                  <div className="flex justify-between items-center">
                    <span className={cn('text-xs font-bold', severityConfig[s].color)}>
                      {severityConfig[s].label}
                    </span>
                    <span className={cn('font-extrabold', severityConfig[s].color)}>{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
