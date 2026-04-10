import { NextRequest, NextResponse } from 'next/server';
import { callClaude } from '@/lib/anthropic';

export async function POST(req: NextRequest) {
  try {
    const { rawIdea } = await req.json();

    if (!rawIdea || typeof rawIdea !== 'string') {
      return NextResponse.json({ error: 'rawIdea is required' }, { status: 400 });
    }

    const systemPrompt = `You are CADMUS, an expert system architect that extracts structured information from raw product ideas. 
Your job is to parse a vague idea and return structured JSON with no extra text.
Always return valid JSON matching this exact schema:
{
  "objective": "A clear one-sentence objective of the system",
  "users": ["primary user type 1", "primary user type 2"],
  "inputs": ["input 1", "input 2", "input 3"],
  "outputs": ["output 1", "output 2", "output 3"],
  "questions": ["clarifying question 1", "clarifying question 2", "clarifying question 3"]
}`;

    const result = await callClaude(
      'claude-3-5-haiku-20241022',
      systemPrompt,
      `Extract structured information from this product idea:\n\n${rawIdea}`,
      1024
    );

    // Parse and validate the JSON
    const parsed = JSON.parse(result);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Extract error:', error);
    return NextResponse.json({ error: 'Failed to extract idea structure' }, { status: 500 });
  }
}
