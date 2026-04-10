export interface Workspace {
  id: string;
  name: string;
  owner_user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  workspace_id: string | null;
  title: string;
  raw_idea?: string | null;
  project_type?: string | null;
  industry?: string | null;
  status: string;
  clarity_score: number;
  completeness_score: number;
  logic_integrity_score: number;
  edge_case_score: number;
  build_readiness_score: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  archived_at?: string | null;
}

export interface SpecSection {
  id: string;
  project_id: string;
  section_type: string;
  title: string;
  content?: string;
  completeness_score: number;
  status: 'empty' | 'partial' | 'complete';
  order_index: number;
  updated_at: string;
}

export interface Answer {
  id: string;
  project_id: string;
  section_type: string;
  question_key: string;
  answer_text?: string;
  updated_at: string;
}

export interface Export {
  id: string;
  project_id: string;
  export_type: string;
  content?: string;
  created_at: string;
}

export interface Review {
  id: string;
  project_id: string;
  section_type?: string;
  severity?: 'good' | 'warning' | 'critical';
  comment?: string;
  status: 'open' | 'resolved';
  created_by: string;
  created_at: string;
}

export type SectionType =
  | 'objective'
  | 'scope'
  | 'inputs'
  | 'outputs'
  | 'logic'
  | 'edge_cases'
  | 'state'
  | 'ux'
  | 'entities'
  | 'phases';
