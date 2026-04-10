'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { SPEC_SECTIONS } from '@/lib/sections';
import { Project, Answer } from '@/types';

const EXPORT_TYPES = [
  { id: 'full_spec', label: 'Full Spec Doc', icon: 'description', desc: 'Complete structured specification document' },
  { id: 'prd', label: 'PRD', icon: 'article', desc: 'Product Requirements Document for stakeholders' },
  { id: 'engineering_handoff', label: 'Engineering Handoff', icon: 'engineering', desc: 'Technical spec for your dev team' },
  { id: 'ai_build_prompt', label: 'AI Build Prompt', icon: 'smart_toy', desc: 'Prompt for Claude Code, Cursor, or Copilot' },
  { id: 'phase_plan', label: 'Phase Plan', icon: 'view_timeline', desc: 'MVP to Phase 3 roadmap' },
  { id: 'test_cases', label: 'Test Cases', icon: 'bug_report', desc: 'Comprehensive test scenarios and acceptance criteria' },
  { id: 'edge_case_checklist', label: 'Edge Case Checklist', icon: 'checklist', desc: 'Exhaustive edge case and failure mode list' },
  { id: 'deck_outline', label: 'Deck Outline', icon: 'slideshow', desc: 'Slide-by-slide presentation outline' },
];

export default function ExportsPage() {
  const { id } = useParams<{ id: string }>();
  const supabase = getSupabaseBrowserClient();

  const [project, setProject] = useState<Project | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<Record<string, string>>({});
  const [activePreview, setActivePreview] = useState<string | null>(null);

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

      // Load existing exports
      const { data: exportsData } = await supabase.from('exports').select('*').eq('project_id', id);
      const exportMap: Record<string, string> = {};
      (exportsData || []).forEach((e) => {
        exportMap[e.export_type] = e.content || '';
      });
      setOutputs(exportMap);
    }
    load();
  }, [id]);

  const buildSpecContent = () => {
    return SPEC_SECTIONS.map((section) => {
      const parts = section.questions
        .map((q) => {
          const val = answers[`${section.type}::${q.key}`];
          return val ? `${q.label}: ${val}` : null;
        })
        .filter(Boolean);
      if (parts.length === 0) return null;
      return `## ${section.title}\n${parts.join('\n\n')}`;
    })
      .filter(Boolean)
      .join('\n\n---\n\n');
  };

  const handleGenerate = async (exportType: string) => {
    const specContent = buildSpecContent();
    if (!specContent) {
      alert('Fill in your spec sections first!');
      return;
    }

    setGenerating(exportType);
    setActivePreview(exportType);
    setOutputs((prev) => ({ ...prev, [exportType]: '' }));

    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exportType, specContent }),
      });

      if (!res.ok || !res.body) throw new Error('Export failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;
        setOutputs((prev) => ({ ...prev, [exportType]: prev[exportType] + chunk }));
      }

      // Save to DB
      await supabase.from('exports').upsert({
        project_id: id,
        export_type: exportType,
        content: fullContent,
      });
    } catch (err) {
      console.error(err);
      setOutputs((prev) => ({ ...prev, [exportType]: 'Generation failed. Try again.' }));
    }
    setGenerating(null);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="flex h-screen bg-surface overflow-hidden flex-col">
      {/* Header */}
      <div className="h-14 bg-surface-container-low shadow-sm flex items-center px-6 gap-4 flex-shrink-0">
        <Link href={`/projects/${id}/spec`} className="text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <span className="font-bold text-on-surface">{project?.title || 'Export Center'}</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Export Cards */}
        <div className="w-96 flex-shrink-0 overflow-y-auto custom-scrollbar p-6 border-r border-surface-high">
          <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">
            Export Formats
          </h2>
          <div className="space-y-3">
            {EXPORT_TYPES.map((type) => {
              const hasOutput = outputs[type.id] && outputs[type.id].length > 0;
              return (
                <div
                  key={type.id}
                  className={`clay-card p-5 rounded-lg border cursor-pointer transition-all ${
                    activePreview === type.id ? 'border-primary/30 ring-1 ring-primary/20' : 'border-white/60'
                  }`}
                  onClick={() => hasOutput && setActivePreview(type.id)}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="material-symbols-outlined text-primary text-[20px]">{type.icon}</span>
                    <div>
                      <h3 className="font-bold text-on-surface text-sm">{type.label}</h3>
                      <p className="text-[11px] text-on-surface-variant">{type.desc}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerate(type.id);
                      }}
                      disabled={generating === type.id}
                      className="flex-1 sculpted-pill text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed hover:translate-y-[-1px] transition-transform active:scale-95"
                    >
                      {generating === type.id ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-xs">refresh</span>
                          Generating...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-xs">auto_awesome</span>
                          {hasOutput ? 'Regenerate' : 'Generate'}
                        </>
                      )}
                    </button>
                    {hasOutput && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(outputs[type.id]);
                        }}
                        className="px-3 py-2 bg-surface-high rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
                        title="Copy to clipboard"
                      >
                        <span className="material-symbols-outlined text-xs">content_copy</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          {activePreview && outputs[activePreview] ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-on-surface">
                  {EXPORT_TYPES.find((t) => t.id === activePreview)?.label}
                </h3>
                <button
                  onClick={() => handleCopy(outputs[activePreview])}
                  className="flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                  Copy All
                </button>
              </div>
              <div className="clay-inset p-6 rounded-xl">
                <pre className="text-xs text-on-surface leading-relaxed whitespace-pre-wrap font-mono">
                  {outputs[activePreview]}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-3xl">download</span>
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2">Generate Your Exports</h3>
              <p className="text-on-surface-variant text-sm max-w-md">
                Click Generate on any export format. The AI will read your spec and produce a
                ready-to-use document.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
