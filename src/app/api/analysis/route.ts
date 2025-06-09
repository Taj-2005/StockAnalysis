import { NextResponse } from 'next/server';
import { Report } from '@/models/Report';
import {dbConnect} from '@/lib/mongodb';

// This is a dummy example — replace with your actual OpenAI GPT-4 API integration
async function getGPTRecommendation(stockSymbol: string, priceHistory: any[]) {
  // Simulate call to GPT-4 for Buy/Sell recommendation and portfolio %
  const recommendation = Math.random() > 0.5 ? 'Buy' : 'Sell';
  const portfolioPercent = +(Math.random() * 20).toFixed(2);
  return { recommendation, portfolioPercent };
}

export async function POST(req: Request) {
  const { analystId, investorId, stockSymbol, priceHistory } = await req.json();

  if (!analystId || !investorId || !stockSymbol || !priceHistory) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  await dbConnect();

  const { recommendation, portfolioPercent } = await getGPTRecommendation(stockSymbol, priceHistory);

  const report = new Report({
    analyst: analystId,
    investor: investorId,
    stockSymbol,
    priceHistory,
    recommendation,
    portfolioPercent,
  });

  await report.save();

  return NextResponse.json({ report });
}
