import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { question, context } = await req.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const systemPrompt = `You are PRISM-X AI, a privacy-preserving analytics assistant for a secure data clean room system.

Context: You have access to three data sources - Bank transactions, Insurance claims, and Government subsidies. All data is anonymized and privacy-controlled.

Your role:
1. Analyze questions about cross-organizational data patterns
2. Provide insights about risk analysis, fraud detection, and social welfare optimization
3. Be factual, precise, and data-driven in your responses
4. Always emphasize privacy protection and data security
5. If asked about specific individuals, explain that the system only allows aggregate analysis
6. Provide UNIQUE responses each time - vary your analysis approach, examples, and recommendations

Available data patterns:
- Bank: Transaction patterns, default risks, age/income/region demographics
- Insurance: Claim frequencies, claim amounts, risk profiles
- Government: Subsidy distributions, eligibility patterns, regional coverage

${context ? `\nAdditional context: ${context}` : ''}

Instructions: Provide a detailed, data-driven answer in 2-4 paragraphs. Include specific insights about patterns, correlations, and actionable recommendations. Each response should explore different aspects and perspectives.`;

    const data = {
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: question
        }
      ],
      model: 'gpt-4o',
      max_tokens: 1024,
      temperature: 0.9
    };

    const response = await fetch('https://api.aimlapi.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AIMLAPI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    const result = await response.json();
    const text = result.choices?.[0]?.message?.content || 'No response generated';

    return NextResponse.json({ 
      answer: text,
      timestamp: new Date().toISOString() 
    });

  } catch (error: unknown) {
    console.error('AIMLAPI error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('quota') || errorMessage.includes('429')) {
      return NextResponse.json({ 
        error: 'API quota exceeded. Please check your AIMLAPI subscription.',
        details: 'Visit your AIMLAPI dashboard to manage your quota.'
      }, { status: 429 });
    }
    
    if (errorMessage.includes('401') || errorMessage.includes('403')) {
      return NextResponse.json({ 
        error: 'Invalid API key. Please check your AIMLAPI credentials.',
        details: errorMessage
      }, { status: 401 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to generate response', 
      details: errorMessage 
    }, { status: 500 });
  }
}
