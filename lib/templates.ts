export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  projectType: string;
  industry: string;
  sections: Record<string, { questions: Record<string, string> }>;
}

export const TEMPLATES: Template[] = [
  {
    id: 'saas',
    name: 'SaaS Platform',
    description: 'Multi-tenant software as a service with subscription billing and user management.',
    icon: 'cloud',
    projectType: 'SaaS',
    industry: 'Technology',
    sections: {
      objective: {
        questions: {
          problem: 'Provide a subscription-based software solution that solves a specific business problem for multiple organizations.',
          users: 'Business teams and individuals who need [specific capability] without building it themselves.',
          success: 'Monthly recurring revenue growing 10% MoM, <2% churn, NPS > 50.',
        },
      },
      scope: {
        questions: {
          included: 'User authentication, workspace/organization management, core feature set, subscription billing via Stripe, basic analytics dashboard.',
          excluded: 'Mobile apps (Phase 2), enterprise SSO (Phase 3), API access (Phase 2).',
        },
      },
    },
  },
  {
    id: 'tracker',
    name: 'Task Tracker',
    description: 'Project and task management tool with assignments, deadlines, and progress tracking.',
    icon: 'task_alt',
    projectType: 'Productivity',
    industry: 'Enterprise',
    sections: {
      objective: {
        questions: {
          problem: 'Help teams track work items, deadlines, and progress in a unified interface.',
          users: 'Project managers, developers, and stakeholders who need visibility into project status.',
          success: 'Teams adopt within 1 week, 80%+ daily active usage, tasks never missed.',
        },
      },
    },
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    description: 'Two-sided marketplace connecting buyers and sellers with payments and reviews.',
    icon: 'storefront',
    projectType: 'Marketplace',
    industry: 'Commerce',
    sections: {
      objective: {
        questions: {
          problem: 'Connect supply and demand in a specific market, handling discovery, transactions, and trust.',
          users: 'Buyers seeking [product/service] and sellers offering it.',
          success: 'GMV growing 20% MoM, take rate >15%, repeat purchase rate >40%.',
        },
      },
    },
  },
  {
    id: 'crm',
    name: 'CRM System',
    description: 'Customer relationship management with pipeline tracking, contacts, and activity logging.',
    icon: 'people',
    projectType: 'CRM',
    industry: 'Sales',
    sections: {
      objective: {
        questions: {
          problem: 'Help sales teams manage relationships, track pipeline stages, and close deals faster.',
          users: 'Sales reps, account managers, and sales leaders.',
          success: 'Deal close rate improves 15%, pipeline visibility complete, zero data loss.',
        },
      },
    },
  },
  {
    id: 'internal-tool',
    name: 'Internal Tool',
    description: 'Internal operations tool for a specific business workflow or process automation.',
    icon: 'build',
    projectType: 'Internal Tool',
    industry: 'Operations',
    sections: {
      objective: {
        questions: {
          problem: 'Automate or streamline a specific internal business process currently done manually.',
          users: 'Internal team members performing [specific process] daily.',
          success: 'Process time reduced by 70%, error rate drops to <1%, team satisfaction high.',
        },
      },
    },
  },
  {
    id: 'data-product',
    name: 'Data Product',
    description: 'Data ingestion, processing, and visualization platform for analytics and reporting.',
    icon: 'analytics',
    projectType: 'Data Product',
    industry: 'Analytics',
    sections: {
      objective: {
        questions: {
          problem: 'Ingest, process, and surface data insights that drive business decisions.',
          users: 'Analysts, data scientists, and business stakeholders who need data access.',
          success: 'Data freshness < 1 hour, query response < 2s, self-serve adoption > 80%.',
        },
      },
    },
  },
  {
    id: 'workflow-automation',
    name: 'Workflow Automation',
    description: 'Trigger-based automation platform that connects systems and automates repetitive tasks.',
    icon: 'account_tree',
    projectType: 'Automation',
    industry: 'Operations',
    sections: {
      objective: {
        questions: {
          problem: 'Automate sequences of tasks triggered by events, eliminating manual handoffs between systems.',
          users: 'Operations teams and business users who build and manage automated workflows.',
          success: '10x more workflows running vs. manual, 99.9% reliability, <5min to create new workflow.',
        },
      },
    },
  },
  {
    id: 'enterprise-review',
    name: 'Enterprise Review Tool',
    description: 'Document review, approval, and audit system with role-based access and audit trails.',
    icon: 'fact_check',
    projectType: 'Enterprise',
    industry: 'Compliance',
    sections: {
      objective: {
        questions: {
          problem: 'Streamline document review cycles, approval chains, and maintain audit-ready records.',
          users: 'Reviewers, approvers, compliance officers, and document authors.',
          success: 'Review cycle time cut 50%, 100% audit trail coverage, zero missed approvals.',
        },
      },
    },
  },
  {
    id: 'intelligence-platform',
    name: 'Intelligence Platform',
    description: 'AI-powered intelligence and analysis platform with LLM integration and structured outputs.',
    icon: 'psychology',
    projectType: 'AI Platform',
    industry: 'Technology',
    sections: {
      objective: {
        questions: {
          problem: 'Apply AI/LLM capabilities to a specific domain to surface insights or automate analysis.',
          users: 'Knowledge workers and analysts who need AI-augmented decision support.',
          success: 'Analysis quality exceeds human baseline, 5x faster than manual, users trust outputs.',
        },
      },
    },
  },
];

export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
