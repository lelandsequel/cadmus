import { NextRequest, NextResponse } from 'next/server';
import { callClaude } from '@/lib/anthropic';

export async function POST(req: NextRequest) {
  try {
    const { answers } = await req.json();

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'answers array is required' }, { status: 400 });
    }

    const systemPrompt = `You are CADMUS, an expert spec readiness evaluator.
Given a set of spec answers, evaluate and score the specification across 5 dimensions.
Return ONLY valid JSON matching this schema:
{
  "clarity": <0-100>,
  "completeness": <0-100>,
  "logic_integrity": <0-100>,
  "edge_case": <0-100>,
  "build_readiness": <0-100>,
  "reasoning": "2-3 sentences explaining the overall assessment and what needs improvement"
}

Scoring guidelines:
- clarity: How clear and unambiguous are the stated goals and constraints?
- completeness: Are all key sections filled with meaningful content?
- logic_integrity: Do the rules and flows make sense together without contradictions?
- edge_case: Are failure modes, errors, and edge cases addressed?
- build_readiness: Could an engineer start building from this spec today?`;

    const answersText = answers
      .map((a: { section: string; content: string }) => `Section: ${a.section}\nContent: ${a.content}`)
      .join('\n\n---\n\n');

    const result = await callClaude(
      'claude-3-5-haiku-20241022',
      systemPrompt,
      `Score this specification:\n\n${answersText}`,
      1024
    );

    const parsed = JSON.parse(result);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Score error:', error);
    return NextResponse.json({ error: 'Failed to score spec' }, { status: 500 });
  }
}
