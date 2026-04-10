'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { SPEC_SECTIONS, SpecSectionDef } from '@/lib/sections';
import { Project, Answer } from '@/types';
import { cn } from '@/lib/utils';

interface ValidationResult {
  strength: 'good' | 'warning' | 'critical';
  feedback: string;
  issues: string[];
}

const strengthConfig = {
  good: { color: 'text-tertiary', icon: 'check_circle', bg: 'bg-tertiary-pale' },
  warning: { color: 'text-secondary', icon: 'info', bg: 'bg-secondary-pale' },
  critical: { color: 'text-error', icon: 'error', bg: 'bg-error/10' },
};

export default function SpecPage() {
  const { id } = useParams<{ id: string }>();
  const supabase = getSupabaseBrowserClient();

  const [project, setProject] = useState<Project | null>(null);
  const [activeSection, setActiveSection] = useState<SpecSectionDef>(SPEC_SECTIONS[0]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [validations, setValidations] = useState<Record<string, ValidationResult>>({});
  const [completionMap, setCompletionMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const saveTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const validateTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Load project + answers
  useEffect(() => {
    async function load() {
      const { data: proj } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      setProject(proj);

      const { data: answersData } = await supabase
        .from('answers')
        .select('*')
        .eq('project_id', id);

      const map: Record<string, string> = {};
      const completions: Record<string, number> = {};

      (answersData as Answer[] || []).forEach((a) => {
        const key = `${a.section_type}::${a.question_key}`;
        map[key] = a.answer_text || '';
      });

      // Calculate completions per section
      SPEC_SECTIONS.forEach((section) => {
        const sectionAnswers = section.questions.filter((q) => {
          const val = map[`${section.type}::${q.key}`];
          return val && val.trim().length > 20;
        });
        completions[section.type] = Math.round((sectionAnswers.length / section.questions.length) * 100);
      });

      setAnswers(map);
      setCompletionMap(completions);
      setLoading(false);
    }
    load();
  }, [id]);

  const handleAnswerChange = useCallback(
    (sectionType: string, questionKey: string, value: string) => {
      const mapKey = `${sectionType}::${questionKey}`;
      setAnswers((prev) => ({ ...prev, [mapKey]: value }));

      // Autosave debounce (1s)
      clearTimeout(saveTimeouts.current[mapKey]);
      saveTimeouts.current[mapKey] = setTimeout(async () => {
        await supabase.from('answers').upsert({
          project_id: id,
          section_type: sectionType,
          question_key: questionKey,
          answer_text: value,
          updated_at: new Date().toISOString(),
        });

        // Update completion
        setCompletionMap((prev) => {
          const section = SPEC_SECTIONS.find((s) => s.type === sectionType);
          if (!section) return prev;
          const currentAnswers = { ...answers, [mapKey]: value };
          const filled = section.questions.filter((q) => {
            const v = currentAnswers[`${sectionType}::${q.key}`];
            return v && v.trim().length > 20;
          });
          return {
            ...prev,
            [sectionType]: Math.round((filled.length / section.questions.length) * 100),
          };
        });
      }, 1000);

      // Validate debounce (2s) - only if answer has enough content
      if (value.trim().length > 30) {
        clearTimeout(validateTimeouts.current[mapKey]);
        validateTimeouts.current[mapKey] = setTimeout(async () => {
          try {
            const res = await fetch('/api/validate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sectionType, answerText: value }),
            });
            if (res.ok) {
              const result = await res.json();
              setValidations((prev) => ({ ...prev, [mapKey]: result }));
            }
          } catch {}
        }, 2000);
      }
    },
    [id, answers]
  );

  // Build live spec content
  const buildSpecContent = () => {
    return SPEC_SECTIONS.map((section) => {
      const sectionAnswers = section.questions
        .map((q) => {
          const val = answers[`${section.type}::${q.key}`];
          return val ? `**${q.label}**: ${val}` : null;
        })
        .filter(Boolean);

      if (sectionAnswers.length === 0) return null;
      return `### ${section.title}\n${sectionAnswers.join('\n\n')}`;
    })
      .filter(Boolean)
      .join('\n\n---\n\n');
  };

  // Get inferred entities
  const getInferredEntities = () => {
    const entitiesAnswer = answers['entities::objects'];
    if (!entitiesAnswer) return [];
    return entitiesAnswer.split(/[,\n]/).map((e) => e.trim()).filter((e) => e.length > 2).slice(0, 6);
  };

  // Get inferred screens
  const getInferredScreens = () => {
    const screensAnswer = answers['ux::screens'];
    if (!screensAnswer) return [];
    return screensAnswer.split(/[,\n]/).map((s) => s.trim()).filter((s) => s.length > 2).slice(0, 6);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-surface items-center justify-center">
        <div className="text-on-surface-variant">Loading spec...</div>
      </div>
    );
  }

  const specContent = buildSpecContent();
  const entities = getInferredEntities();
  const screens = getInferredScreens();

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Top Header */}
      <div className="fixed top-0 left-0 right-0 z-50 h-14 bg-surface-container-low shadow-sm flex items-center px-6 gap-4">
        <Link href="/dashboard" className="text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <span className="font-bold text-on-surface truncate">{project?.title || 'Spec'}</span>
        <div className="flex gap-2 ml-auto">
          <Link
            href={`/projects/${id}/preview`}
            className="text-xs font-bold text-on-surface-variant hover:text-primary px-3 py-1.5 rounded-lg hover:bg-surface-container transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">preview</span>
            Preview
          </Link>
          <Link
            href={`/projects/${id}/score`}
            className="text-xs font-bold text-on-surface-variant hover:text-primary px-3 py-1.5 rounded-lg hover:bg-surface-container transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">analytics</span>
            Score
          </Link>
          <Link
            href={`/projects/${id}/exports`}
            className="sculpted-pill text-white text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Export
          </Link>
        </div>
      </div>

      <div className="flex w-full pt-14">
        {/* Left Nav */}
        <aside className="w-64 bg-surface-container-low flex flex-col py-6 overflow-y-auto custom-scrollbar border-r border-surface-high">
          <div className="px-4 mb-4">
            <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest">
              Specification Map
            </p>
          </div>
          <div className="space-y-0.5 px-2">
            {SPEC_SECTIONS.map((section) => {
              const isActive = activeSection.type === section.type;
              const completion = completionMap[section.type] || 0;
              return (
                <button
                  key={section.type}
                  onClick={() => setActiveSection(section)}
                  className={cn(
                    'w-full flex items-center justify-between p-3 rounded-xl text-sm transition-all cursor-pointer text-left',
                    isActive
                      ? 'bg-surface-container text-primary font-bold'
                      : 'text-on-surface-variant hover:bg-surface-container/50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px]">{section.icon}</span>
                    <span>{section.title}</span>
                  </div>
                  {completion === 100 ? (
                    <span className="w-2 h-2 rounded-full bg-tertiary" />
                  ) : completion > 0 ? (
                    <span className="text-[10px] font-bold opacity-60">{completion}%</span>
                  ) : (
                    <span className="text-[10px] font-bold opacity-30">0%</span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Center: Questions */}
        <section className="flex-1 bg-surface overflow-y-auto custom-scrollbar p-10">
          <div className="max-w-2xl mx-auto w-full">
            <header className="mb-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold tracking-wider uppercase">
                  Section {String(SPEC_SECTIONS.findIndex((s) => s.type === activeSection.type) + 1).padStart(2, '0')}
                </span>
                <span className="text-on-surface-variant text-[10px] font-medium">{activeSection.title}</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-3">
                {activeSection.title}
              </h1>
              <p className="text-on-surface-variant leading-relaxed text-sm">{activeSection.description}</p>
            </header>

            <div className="space-y-8">
              {activeSection.questions.map((question) => {
                const mapKey = `${activeSection.type}::${question.key}`;
                const value = answers[mapKey] || '';
                const validation = validations[mapKey];

                return (
                  <div key={question.key} className="clay-card p-8 rounded-lg border border-white/60 transition-all hover:translate-y-[-2px]">
                    <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3">
                      {question.label}
                    </label>
                    <p className="text-sm text-on-surface-variant mb-4">{question.placeholder}</p>
                    <div className="clay-inset rounded-xl p-1 focus-within:ring-2 ring-primary/20 transition-all">
                      <textarea
                        value={value}
                        onChange={(e) => handleAnswerChange(activeSection.type, question.key, e.target.value)}
                        placeholder={`${question.placeholder}...`}
                        rows={4}
                        className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder-outline/60 text-sm resize-none px-4 py-3 outline-none"
                      />
                    </div>

                    {validation && (
                      <div
                        className={cn(
                          'mt-3 flex items-start gap-2 p-3 rounded-xl text-xs',
                          strengthConfig[validation.strength].bg
                        )}
                      >
                        <span
                          className={cn(
                            'material-symbols-outlined text-sm mt-0.5 flex-shrink-0',
                            strengthConfig[validation.strength].color
                          )}
                        >
                          {strengthConfig[validation.strength].icon}
                        </span>
                        <p className={cn(strengthConfig[validation.strength].color, 'italic')}>
                          {validation.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Section Navigation */}
            <div className="flex justify-between mt-12">
              {SPEC_SECTIONS.findIndex((s) => s.type === activeSection.type) > 0 && (
                <button
                  onClick={() => {
                    const idx = SPEC_SECTIONS.findIndex((s) => s.type === activeSection.type);
                    setActiveSection(SPEC_SECTIONS[idx - 1]);
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Previous
                </button>
              )}
              <div className="ml-auto">
                {SPEC_SECTIONS.findIndex((s) => s.type === activeSection.type) < SPEC_SECTIONS.length - 1 ? (
                  <button
                    onClick={() => {
                      const idx = SPEC_SECTIONS.findIndex((s) => s.type === activeSection.type);
                      setActiveSection(SPEC_SECTIONS[idx + 1]);
                    }}
                    className="sculpted-pill text-white px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2"
                  >
                    Next Section
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                ) : (
                  <Link
                    href={`/projects/${id}/score`}
                    className="sculpted-pill text-white px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2"
                  >
                    Score My Spec
                    <span className="material-symbols-outlined text-sm">analytics</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Right: Live Spec */}
        <aside className="w-80 bg-surface-container-low border-l border-surface-high overflow-y-auto custom-scrollbar p-6">
          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">
            Live Spec
          </h3>

          {specContent ? (
            <div className="text-xs text-on-surface-variant leading-relaxed whitespace-pre-wrap font-mono">
              {specContent.slice(0, 2000)}
              {specContent.length > 2000 && '...'}
            </div>
          ) : (
            <div className="clay-inset p-6 rounded-xl text-center">
              <span className="material-symbols-outlined text-on-surface-variant/30 text-3xl block mb-2">
                article
              </span>
              <p className="text-xs text-on-surface-variant/50">
                Your spec builds here as you answer questions.
              </p>
            </div>
          )}

          {entities.length > 0 && (
            <div className="mt-6">
              <h4 className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-2">
                Inferred Entities
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {entities.map((e) => (
                  <span key={e} className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full font-medium">
                    {e}
                  </span>
                ))}
              </div>
            </div>
          )}

          {screens.length > 0 && (
            <div className="mt-4">
              <h4 className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-2">
                Inferred Screens
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {screens.map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-tertiary/10 text-tertiary text-[10px] rounded-full font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <h4 className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-2">
              Completion
            </h4>
            <div className="space-y-1.5">
              {SPEC_SECTIONS.map((section) => {
                const pct = completionMap[section.type] || 0;
                return (
                  <div key={section.type} className="flex items-center gap-2">
                    <span className="text-[10px] text-on-surface-variant w-20 truncate">{section.title}</span>
                    <div className="flex-1 h-1 bg-surface-high rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-on-surface-variant w-7 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
