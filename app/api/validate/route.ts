import { NextRequest, NextResponse } from 'next/server';
import { callClaude } from '@/lib/anthropic';

export async function POST(req: NextRequest) {
  try {
    const { sectionType, answerText } = await req.json();

    if (!sectionType || !answerText) {
      return NextResponse.json({ error: 'sectionType and answerText are required' }, { status: 400 });
    }

    const systemPrompt = `You are CADMUS, an expert spec reviewer. 
Analyze the user's answer to a spec section question and provide feedback.
Return ONLY valid JSON matching this schema:
{
  "strength": "good" | "warning" | "critical",
  "feedback": "A short, actionable feedback sentence",
  "issues": ["issue 1", "issue 2"]
}

Strength guidelines:
- "good": The answer is specific, measurable, and complete
- "warning": The answer is vague or missing key details
- "critical": The answer is too abstract, contradictory, or indicates a spec gap`;

    const result = await callClaude(
      'claude-3-5-haiku-20241022',
      systemPrompt,
      `Section: ${sectionType}\nAnswer: ${answerText}\n\nEvaluate this spec answer.`,
      512
    );

    const parsed = JSON.parse(result);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Validate error:', error);
    return NextResponse.json({ error: 'Failed to validate answer' }, { status: 500 });
  }
}
