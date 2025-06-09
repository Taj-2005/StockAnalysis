import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { symbol: string } }) {
  const symbol = params.symbol.toUpperCase();

  const mockPrices = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 3600 * 1000).toISOString(),
    price: 100 + Math.sin(i / 5) * 10 + Math.random() * 5,
  })).reverse();

  return NextResponse.json({ symbol, prices: mockPrices });
}
