export interface SectionQuestion {
  key: string;
  label: string;
  placeholder: string;
}

export interface SpecSectionDef {
  type: string;
  title: string;
  icon: string;
  description: string;
  questions: SectionQuestion[];
}

export const SPEC_SECTIONS: SpecSectionDef[] = [
  {
    type: 'objective',
    title: 'Objective',
    icon: 'target',
    description: 'Define the core problem, users, and success criteria for this system.',
    questions: [
      {
        key: 'problem',
        label: 'The Core Problem',
        placeholder: 'What exact problem is this system solving?',
      },
      {
        key: 'users',
        label: 'Primary Users',
        placeholder: 'Who is this system for? Be specific about user roles.',
      },
      {
        key: 'success',
        label: 'Success Definition',
        placeholder: 'What does success look like? Include measurable metrics.',
      },
    ],
  },
  {
    type: 'scope',
    title: 'Scope',
    icon: 'filter_center_focus',
    description: 'Define what is and is not included in this version.',
    questions: [
      {
        key: 'included',
        label: 'In Scope (v1)',
        placeholder: 'What is included in v1? List specific features and capabilities.',
      },
      {
        key: 'excluded',
        label: 'Out of Scope',
        placeholder: 'What is explicitly out of scope? What are you deferring?',
      },
    ],
  },
  {
    type: 'inputs',
    title: 'Inputs',
    icon: 'input',
    description: 'Define all data that enters the system.',
    questions: [
      {
        key: 'data',
        label: 'Data Inputs',
        placeholder: 'What data enters the system? List all input types and formats.',
      },
      {
        key: 'sources',
        label: 'Data Sources',
        placeholder: 'Where does the data come from? APIs, users, files, sensors?',
      },
    ],
  },
  {
    type: 'outputs',
    title: 'Outputs',
    icon: 'output',
    description: 'Define what the system must produce.',
    questions: [
      {
        key: 'products',
        label: 'System Outputs',
        placeholder: 'What must the system produce? List all output types.',
      },
      {
        key: 'validity',
        label: 'Output Validity',
        placeholder: 'What constitutes a valid output? What are the quality criteria?',
      },
    ],
  },
  {
    type: 'logic',
    title: 'Logic Rules',
    icon: 'account_tree',
    description: 'Define the rules and transformations that govern system behavior.',
    questions: [
      {
        key: 'transformation',
        label: 'Core Logic',
        placeholder: 'How do inputs become outputs? Describe the core transformation.',
      },
      {
        key: 'rules',
        label: 'Rules & Thresholds',
        placeholder: 'What rules, thresholds, or conditions matter? If X then Y...',
      },
    ],
  },
  {
    type: 'edge_cases',
    title: 'Edge Cases',
    icon: 'warning',
    description: 'Define how the system handles failures, errors, and unusual inputs.',
    questions: [
      {
        key: 'missing_data',
        label: 'Missing Data',
        placeholder: 'What happens if required data is missing or unavailable?',
      },
      {
        key: 'bad_input',
        label: 'Invalid Inputs',
        placeholder: 'What if the user inputs garbage or unexpected values?',
      },
    ],
  },
  {
    type: 'state',
    title: 'State',
    icon: 'database',
    description: 'Define what the system remembers and how it changes over time.',
    questions: [
      {
        key: 'persistence',
        label: 'Persistent State',
        placeholder: 'What persists over time? What must the system remember?',
      },
      {
        key: 'transitions',
        label: 'State Transitions',
        placeholder: 'What state transitions exist? What triggers state changes?',
      },
    ],
  },
  {
    type: 'ux',
    title: 'UX',
    icon: 'web',
    description: 'Define the user interface requirements and key screens.',
    questions: [
      {
        key: 'screens',
        label: 'Main Screens',
        placeholder: 'What are the main screens or views? List and describe each.',
      },
      {
        key: 'always_visible',
        label: 'Always Visible',
        placeholder: 'What must always be visible or accessible? Navigation, status, etc.',
      },
    ],
  },
  {
    type: 'entities',
    title: 'Entities',
    icon: 'hub',
    description: 'Define the data objects and their relationships.',
    questions: [
      {
        key: 'objects',
        label: 'Core Objects',
        placeholder: 'What objects/entities exist in the system? User, Project, Order, etc.',
      },
      {
        key: 'relationships',
        label: 'Relationships',
        placeholder: 'How do entities relate to each other? One-to-many, many-to-many, etc.',
      },
    ],
  },
  {
    type: 'phases',
    title: 'Phases',
    icon: 'view_timeline',
    description: 'Define the build phases from MVP to future versions.',
    questions: [
      {
        key: 'mvp',
        label: 'MVP (Phase 1)',
        placeholder: 'What is the minimum viable product? What is the smallest thing you can ship?',
      },
      {
        key: 'phase2',
        label: 'Phase 2',
        placeholder: 'What comes after MVP? What is the next major milestone?',
      },
    ],
  },
];
