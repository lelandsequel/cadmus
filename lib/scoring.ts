export interface ScoreLabel {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
}

export function getScoreLabel(score: number): ScoreLabel {
  if (score >= 85) {
    return {
      label: 'Build-Ready',
      color: 'green',
      bgColor: 'bg-tertiary-pale',
      textColor: 'text-tertiary',
    };
  } else if (score >= 70) {
    return {
      label: 'Solid',
      color: 'blue',
      bgColor: 'bg-primary-fixed',
      textColor: 'text-primary',
    };
  } else if (score >= 50) {
    return {
      label: 'Developing',
      color: 'amber',
      bgColor: 'bg-secondary-pale',
      textColor: 'text-secondary',
    };
  } else {
    return {
      label: 'Weak',
      color: 'red',
      bgColor: 'bg-error/10',
      textColor: 'text-error',
    };
  }
}

export function getScoreBarColor(score: number): string {
  if (score >= 85) return 'bg-tertiary';
  if (score >= 70) return 'bg-primary';
  if (score >= 50) return 'bg-secondary';
  return 'bg-error';
}

export function getOverallScore(scores: {
  clarity: number;
  completeness: number;
  logic_integrity: number;
  edge_case: number;
  build_readiness: number;
}): number {
  const weights = {
    clarity: 0.2,
    completeness: 0.25,
    logic_integrity: 0.2,
    edge_case: 0.15,
    build_readiness: 0.2,
  };
  return Math.round(
    scores.clarity * weights.clarity +
      scores.completeness * weights.completeness +
      scores.logic_integrity * weights.logic_integrity +
      scores.edge_case * weights.edge_case +
      scores.build_readiness * weights.build_readiness
  );
}
