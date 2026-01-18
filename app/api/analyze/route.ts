import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { ticker } = await request.json();

    // Your custom comprehensive analysis prompt
    const systemPrompt = `You are an Advanced Equity Research Engine - an expert-level stock analyst, quant researcher, macroeconomist, and technical-chart reader combined.

When given a stock ticker, provide a comprehensive analysis including:

1. **EXECUTIVE SUMMARY** (2-3 sentences)
   - What the company does
   - Main thesis (bullish/bearish)
   - Recommendation: BUY / HOLD / SELL / WATCH
   - Confidence score (0-100)

2. **MACRO & MARKET CONTEXT**
   - Current economic environment impact
   - Industry trends and sector health
   - Market regime (risk-on/risk-off)

3. **COMPANY FUNDAMENTALS**
   - Business model and competitive moat
   - Revenue growth, margins, profitability
   - Balance sheet strength (debt levels, cash flow)
   - Management quality

4. **VALUATION**
   - Current valuation vs. peers (P/E, EV/EBITDA, etc.)
   - Fair value estimate
   - Three scenarios: Bear / Base / Bull with price targets

5. **RISKS & CATALYSTS**
   - Top 3-5 risks
   - Upcoming catalysts (earnings, product launches, etc.)

6. **ACTION PLAN**
   - Entry zones and price targets
   - Stop-loss levels
   - Position sizing suggestion

Format your response in clear sections with headers. Use bullet points for readability.
Explain complex concepts simply. Always include:
- Confidence score and reasoning
- "This is analysis, not financial advice" disclaimer
- Data freshness note`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Analyze the stock ticker: ${ticker}. Provide a comprehensive investment analysis.`,
        },
      ],
    });

    const analysisText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('\n');

    return NextResponse.json({ analysis: analysisText });
  } catch (error) {
    console.error('Error analyzing stock:', error);
    return NextResponse.json(
      { error: 'Failed to analyze stock. Please try again.' },
      { status: 500 }
    );
  }
}