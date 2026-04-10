'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { SPEC_SECTIONS } from '@/lib/sections';
import { Project, Answer } from '@/types';

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const supabase = getSupabaseBrowserClient();

  const [project, setProject] = useState<Project | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [activeAnchor, setActiveAnchor] = useState('objective');

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
      (answersData as Answer[] || []).forEach((a) => {
        map[`${a.section_type}::${a.question_key}`] = a.answer_text || '';
      });
      setAnswers(map);
      setLoading(false);
    }
    load();
  }, [id]);

  const getSectionContent = (sectionType: string) => {
    const section = SPEC_SECTIONS.find((s) => s.type === sectionType);
    if (!section) return null;
    const filled = section.questions.filter((q) => answers[`${sectionType}::${q.key}`]);
    return filled.length > 0 ? section : null;
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-surface items-center justify-center">
        <span className="text-on-surface-variant">Loading preview...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 h-14 bg-surface-container-low shadow-sm flex items-center px-6 gap-4">
        <Link href={`/projects/${id}/spec`} className="text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <span className="font-bold text-on-surface">{project?.title || 'Spec Preview'}</span>
        <div className="flex gap-2 ml-auto">
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
        {/* Left anchor nav */}
        <aside className="w-56 bg-surface-container-low border-r border-surface-high py-6 px-4 overflow-y-auto">
          <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-4">
            Sections
          </p>
          <nav className="space-y-0.5">
            {SPEC_SECTIONS.map((section) => {
              const hasContent = getSectionContent(section.type);
              return (
                <a
                  key={section.type}
                  href={`#section-${section.type}`}
                  onClick={() => setActiveAnchor(section.type)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeAnchor === section.type
                      ? 'bg-surface-container text-primary font-bold'
                      : hasContent
                      ? 'text-on-surface hover:bg-surface-container/50'
                      : 'text-on-surface-variant/40'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{section.icon}</span>
                  {section.title}
                  {!hasContent && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-surface-high" />
                  )}
                </a>
              );
            })}
          </nav>
        </aside>

        {/* Main doc */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-12">
          <div className="max-w-3xl mx-auto">
            <div className="mb-12">
              <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-3">
                {project?.title || 'Specification'}
              </h1>
              <div className="flex gap-3">
                {project?.industry && (
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                    {project.industry}
                  </span>
                )}
                {project?.project_type && (
                  <span className="px-3 py-1 bg-tertiary/10 text-tertiary text-xs font-bold rounded-full">
                    {project.project_type}
                  </span>
                )}
                <span className="px-3 py-1 bg-surface-high text-on-surface-variant text-xs font-bold rounded-full capitalize">
                  {project?.status}
                </span>
              </div>
            </div>

            {SPEC_SECTIONS.map((section) => {
              const sectionDef = getSectionContent(section.type);
              return (
                <section
                  key={section.type}
                  id={`section-${section.type}`}
                  className="mb-12 scroll-mt-20"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-[16px]">
                        {section.icon}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-on-surface">{section.title}</h2>
                    {!sectionDef && (
                      <span className="px-2 py-0.5 bg-surface-high text-on-surface-variant/50 text-[10px] rounded-full font-bold ml-auto">
                        Empty
                      </span>
                    )}
                  </div>

                  {sectionDef ? (
                    <div className="clay-card p-8 rounded-lg border border-white/60 space-y-6">
                      {section.questions.map((q) => {
                        const val = answers[`${section.type}::${q.key}`];
                        if (!val) return null;
                        return (
                          <div key={q.key}>
                            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
                              {q.label}
                            </p>
                            <p className="text-on-surface leading-relaxed">{val}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="clay-inset p-6 rounded-lg border-2 border-dashed border-surface-high flex items-center justify-between">
                      <p className="text-on-surface-variant/50 text-sm italic">
                        This section has not been filled in yet.
                      </p>
                      <Link
                        href={`/projects/${id}/spec`}
                        className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                        Fill in
                      </Link>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
