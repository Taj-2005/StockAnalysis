import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getGPTRecommendation(symbol: string, priceHistory: any[]) {
  const prompt = `Analyze the last 30 days of prices for ${symbol}:\n${JSON.stringify(priceHistory)}\n
  Recommend: Should the investor buy/sell/hold? What % of portfolio should be allocated for max profit?`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  const result = response.choices[0].message.content;
  const [recommendation, percent] = (result?.split('\n') || []);

  return {
    recommendation: recommendation?.split(':')[1]?.trim() || 'Hold',
    portfolioPercent: parseFloat(percent?.split(':')[1] || '0'),
  };
}
