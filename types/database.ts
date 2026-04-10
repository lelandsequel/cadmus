export type Database = {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string;
          name: string;
          owner_user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          owner_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          owner_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          workspace_id: string | null;
          title: string;
          raw_idea: string | null;
          project_type: string | null;
          industry: string | null;
          status: string;
          clarity_score: number;
          completeness_score: number;
          logic_integrity_score: number;
          edge_case_score: number;
          build_readiness_score: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          workspace_id?: string | null;
          title: string;
          raw_idea?: string | null;
          project_type?: string | null;
          industry?: string | null;
          status?: string;
          clarity_score?: number;
          completeness_score?: number;
          logic_integrity_score?: number;
          edge_case_score?: number;
          build_readiness_score?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
        Update: {
          id?: string;
          workspace_id?: string | null;
          title?: string;
          raw_idea?: string | null;
          project_type?: string | null;
          industry?: string | null;
          status?: string;
          clarity_score?: number;
          completeness_score?: number;
          logic_integrity_score?: number;
          edge_case_score?: number;
          build_readiness_score?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
        Relationships: [];
      };
      spec_sections: {
        Row: {
          id: string;
          project_id: string | null;
          section_type: string;
          title: string;
          content: string | null;
          completeness_score: number;
          status: string;
          order_index: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          section_type: string;
          title: string;
          content?: string | null;
          completeness_score?: number;
          status?: string;
          order_index: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string | null;
          section_type?: string;
          title?: string;
          content?: string | null;
          completeness_score?: number;
          status?: string;
          order_index?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      answers: {
        Row: {
          id: string;
          project_id: string | null;
          section_type: string;
          question_key: string;
          answer_text: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          section_type: string;
          question_key: string;
          answer_text?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string | null;
          section_type?: string;
          question_key?: string;
          answer_text?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      exports: {
        Row: {
          id: string;
          project_id: string | null;
          export_type: string;
          content: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          export_type: string;
          content?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string | null;
          export_type?: string;
          content?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          project_id: string | null;
          section_type: string | null;
          severity: string | null;
          comment: string | null;
          status: string;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          section_type?: string | null;
          severity?: string | null;
          comment?: string | null;
          status?: string;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string | null;
          section_type?: string | null;
          severity?: string | null;
          comment?: string | null;
          status?: string;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
