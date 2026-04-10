'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { TEMPLATES } from '@/lib/templates';
import { getSupabaseBrowserClient } from '@/lib/supabase';

export default function TemplatesPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [loading, setLoading] = useState<string | null>(null);

  const handleUseTemplate = async (templateId: string) => {
    setLoading(templateId);
    const template = TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }

      // Get or create workspace
      let workspaceId: string;
      const { data: existingWorkspace } = await supabase
        .from('workspaces')
        .select('id')
        .eq('owner_user_id', user.id)
        .single();

      if (existingWorkspace) {
        workspaceId = existingWorkspace.id;
      } else {
        const { data: newWorkspace } = await supabase
          .from('workspaces')
          .insert({ name: 'My Workspace', owner_user_id: user.id })
          .select('id')
          .single();
        if (!newWorkspace) throw new Error('Failed to create workspace');
        workspaceId = newWorkspace.id;
      }

      // Create project from template
      const { data: project } = await supabase
        .from('projects')
        .insert({
          workspace_id: workspaceId,
          title: `${template.name} Spec`,
          project_type: template.projectType,
          industry: template.industry,
          status: 'draft',
          created_by: user.id,
        })
        .select('id')
        .single();

      if (!project) throw new Error('Failed to create project');

      // Pre-fill answers from template
      const answersToInsert = [];
      for (const [sectionType, sectionData] of Object.entries(template.sections)) {
        for (const [questionKey, answerText] of Object.entries(sectionData.questions)) {
          answersToInsert.push({
            project_id: project.id,
            section_type: sectionType,
            question_key: questionKey,
            answer_text: answerText,
          });
        }
      }

      if (answersToInsert.length > 0) {
        await supabase.from('answers').insert(answersToInsert);
      }

      router.push(`/projects/${project.id}/spec`);
    } catch (err) {
      console.error(err);
      setLoading(null);
    }
  };

  return (
    <AppShell breadcrumb="Templates">
      <div className="p-8">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">
            Template Library
          </h1>
          <p className="text-on-surface-variant">
            Start with a pre-structured spec template and customize it for your project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="clay-card p-6 rounded-lg border border-white/60 flex flex-col gap-4 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary material-symbols-outlined flex-shrink-0">
                  {template.icon}
                </div>
                <div>
                  <h3 className="font-bold text-on-surface">{template.name}</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {template.industry} · {template.projectType}
                  </p>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">{template.description}</p>

              <button
                onClick={() => handleUseTemplate(template.id)}
                disabled={loading === template.id}
                className="mt-auto sculpted-pill text-white py-3 rounded-xl font-bold text-sm shadow-md hover:translate-y-[-2px] transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading === template.id ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                    Creating...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">add</span>
                    Use Template
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
