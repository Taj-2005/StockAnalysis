import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/models/User';
import { Report } from '@/models/Report';
import { dbConnect } from '@/lib/mongodb';
import { getGPTRecommendation } from '@/lib/gpt';

export async function POST(req: NextRequest) {
    const UserModal : any = User 
  await dbConnect();
  const { analystId, investorIds } = await req.json();

  if (!analystId || !Array.isArray(investorIds)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  try {
    // Assign investors to analyst
    await UserModal.findByIdAndUpdate(analystId, {
      $addToSet: { assignedInvestors: { $each: investorIds } },
    });

    // Assign analyst to each investor
    await Promise.all(
      investorIds.map(async (investorId: string) => {
        await UserModal.findByIdAndUpdate(investorId, {
          assignedAnalyst: analystId,
        });
      })
    );

    // Auto-generate reports for each investor
    await Promise.all(
      investorIds.map(async (investorId: string) => {
        const priceHistory = Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
          price: 100 + Math.sin(i / 5) * 10 + Math.random() * 5,
        }));

        const { recommendation, portfolioPercent } = await getGPTRecommendation(
          'AAPL',
          priceHistory
        );

        await Report.create({
          investor: investorId,
          analyst: analystId,
          stockSymbol: 'AAPL',
          priceHistory,
          recommendation,
          portfolioPercent,
        });
      })
    );

    return NextResponse.json({ message: 'Investors assigned and reports generated' });
  } catch (error) {
    console.error('[ASSIGN ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
