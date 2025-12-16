import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { question, context } = await req.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const systemPrompt = `You are PRISM-X AI, a privacy-preserving analytics assistant for a secure data clean room system.

Context: You have access to three data sources - Bank transactions, Insurance claims, and Government subsidies. All data is anonymized and privacy-controlled.

Your role:
1. Analyze questions about cross-organizational data patterns
2. Provide insights about risk analysis, fraud detection, and social welfare optimization
3. Be factual, precise, and data-driven in your responses
4. Always emphasize privacy protection and data security
5. If asked about specific individuals, explain that the system only allows aggregate analysis

Available data patterns:
- Bank: Transaction patterns, default risks, age/income/region demographics
- Insurance: Claim frequencies, claim amounts, risk profiles
- Government: Subsidy distributions, eligibility patterns, regional coverage

${context ? `\nAdditional context: ${context}` : ''}

Question: ${question}

Provide a detailed, data-driven answer in 2-4 paragraphs. Include specific insights about patterns, correlations, and actionable recommendations.`;

    const result = await model.generateContent(systemPrompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ 
      answer: text,
      timestamp: new Date().toISOString() 
    });

  } catch (error: unknown) {
    console.error('Gemini API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: 'Failed to generate response', 
      details: errorMessage 
    }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { question, context } = await req.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const systemPrompt = `You are PRISM-X AI, a privacy-preserving analytics assistant for a secure data clean room system.

Context: You have access to three data sources - Bank transactions, Insurance claims, and Government subsidies. All data is anonymized and privacy-controlled.

Your role:
1. Analyze questions about cross-organizational data patterns
2. Provide insights about risk analysis, fraud detection, and social welfare optimization
3. Be factual, precise, and data-driven in your responses
4. Always emphasize privacy protection and data security
5. If asked about specific individuals, explain that the system only allows aggregate analysis

Available data patterns:
- Bank: Transaction patterns, default risks, age/income/region demographics
- Insurance: Claim frequencies, claim amounts, risk profiles
- Government: Subsidy distributions, eligibility patterns, regional coverage

${context ? `\nAdditional context: ${context}` : ''}

Question: ${question}

Provide a detailed, data-driven answer in 2-4 paragraphs. Include specific insights about patterns, correlations, and actionable recommendations.`;

    const result = await model.generateContent(systemPrompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ 
      answer: text,
      timestamp: new Date().toISOString() 
    });

    } catch (error: unknown) {
      console.error('Gemini API error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('quota') || errorMessage.includes('429')) {
        return NextResponse.json({ 
          error: 'API quota exceeded. Please wait ~30 seconds or upgrade your Gemini API plan.',
          details: 'Visit https://ai.google.dev/pricing to increase quota.'
        }, { status: 429 });
      }
      
      if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        return NextResponse.json({ 
          error: 'Model not available. Please check your API key permissions.',
          details: errorMessage
        }, { status: 404 });
      }
      
      return NextResponse.json({ 
        error: 'Failed to generate response', 
        details: errorMessage 
      }, { status: 500 });
    }
}
