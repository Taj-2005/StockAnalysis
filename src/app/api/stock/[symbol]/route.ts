import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { symbol: string } }) {
  const symbol = params.symbol.toUpperCase();
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
  
  const res = await fetch(url);
  const data = await res.json();

  if (!data['Time Series (Daily)']) {
    return NextResponse.json({ error: 'Invalid stock symbol or API limit' }, { status: 400 });
  }

  const prices = Object.entries(data['Time Series (Daily)'])
    .slice(0, 30)
    .map(([date, value]: any) => ({
      date,
      price: parseFloat(value['4. close']),
    }))
    .reverse();

  return NextResponse.json({ symbol, prices });
}