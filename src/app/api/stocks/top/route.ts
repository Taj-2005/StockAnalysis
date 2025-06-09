import { NextResponse } from 'next/server';

// Mock top stocks — replace with real API later
const mockTopStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.7 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2789.2 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 205.4 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 122.8 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 344.1 },
];

export async function GET() {
  return NextResponse.json({ stocks: mockTopStocks });
}
