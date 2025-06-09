import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { User } from '@/models/User';
import { Report } from '@/models/Report';

export async function POST(req: Request) {
  await dbConnect();

  const token = (await cookies()).get('token')?.value;
  const decoded = verifyJWT(token || '');
  const { symbol } = await req.json();

  if (!decoded || typeof decoded !== 'object' || decoded.role !== 'investor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const investorId = decoded.userId;

  const analyst = await User.findOne({ assignedInvestors: investorId });
  if (!analyst) {
    return NextResponse.json({ error: 'No analyst assigned to you' }, { status: 403 });
  }

  // Dummy price data for now (could fetch from real source)
  const priceHistory = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 3600 * 1000),
    price: 100 + Math.sin(i / 5) * 10 + Math.random() * 5,
  })).reverse();

  const recommendation = Math.random() > 0.5 ? 'Buy' : 'Sell';
  const portfolioPercent = +(Math.random() * 20).toFixed(2);

  const report = new Report({
    investor: investorId,
    analyst: analyst._id,
    stockSymbol: symbol,
    priceHistory,
    recommendation,
    portfolioPercent,
  });

  await report.save();

  return NextResponse.json({ message: 'Analysis requested successfully', report });
}
