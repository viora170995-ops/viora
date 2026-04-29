import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { url, fullReport } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

 const freePrompt = `You are a UX and SEO expert. Analyze this website: ${url}

Return ONLY a JSON object (no markdown):
{
  "scores": {
    "UX": 75,
    "SEO": 80,
    "Performance": 70,
    "Accessibility": 65,
    "Content": 72
  },
  "categories": {
    "UX": {
      "positives": ["One specific good thing about UX"],
      "negatives": ["Issue 1", "Issue 2", "Issue 3"]
    },
    "SEO": {
      "positives": ["One specific good thing about SEO"],
      "negatives": ["Issue 1", "Issue 2", "Issue 3"]
    },
    "Performance": {
      "positives": ["One specific good thing about Performance"],
      "negatives": ["Issue 1", "Issue 2", "Issue 3"]
    },
    "Accessibility": {
      "positives": ["One specific good thing about Accessibility"],
      "negatives": ["Issue 1", "Issue 2", "Issue 3"]
    },
    "Content": {
      "positives": ["One specific good thing about Content"],
      "negatives": ["Issue 1", "Issue 2", "Issue 3"]
    }
  }
}`;

    const fullPrompt = `You are a senior UX/UI and digital marketing expert. Analyze this website thoroughly: ${url}

Return ONLY a JSON object with this exact structure (no markdown):
{
  "scores": {
    "UX": 75,
    "SEO": 80,
    "Performance": 70,
    "Security": 85
  },
  "summary": "2-3 sentence overall assessment",
  "sections": [
    {
      "title": "UX & User Experience",
      "icon": "🎯",
      "score": 75,
      "issues": [
        {
          "level": "high",
          "problem": "Clear problem title",
          "description": "Detailed description of the issue",
          "solution": "Specific actionable solution"
        }
      ]
    },
    {
      "title": "UI & Visual Design",
      "icon": "🎨",
      "score": 80,
      "issues": []
    },
    {
      "title": "Navigation & Layout",
      "icon": "🗺️",
      "score": 70,
      "issues": []
    },
    {
      "title": "CTAs & Conversion",
      "icon": "💡",
      "score": 65,
      "issues": []
    },
    {
      "title": "Content & Messaging",
      "icon": "✍️",
      "score": 72,
      "issues": []
    },
    {
      "title": "Mobile Experience",
      "icon": "📱",
      "score": 68,
      "issues": []
    },
    {
      "title": "SEO Fundamentals",
      "icon": "🔍",
      "score": 80,
      "issues": []
    },
    {
      "title": "Performance & Speed",
      "icon": "⚡",
      "score": 70,
      "issues": []
    },
    {
      "title": "Accessibility",
      "icon": "♿",
      "score": 60,
      "issues": []
    },
    {
      "title": "Trust & Credibility",
      "icon": "🛡️",
      "score": 75,
      "issues": []
    }
  ],
  "priorities": [
    {"order": 1, "action": "First thing to fix", "impact": "high"},
    {"order": 2, "action": "Second thing to fix", "impact": "med"},
    {"order": 3, "action": "Third thing to fix", "impact": "med"}
  ]
}

Fill all sections with 2-3 real issues each. Be specific and actionable.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: fullReport ? 8000 : 1024,
      messages: [
        {
          role: 'user',
          content: fullReport ? fullPrompt : freePrompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const text = content.text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(text);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    );
  }
}