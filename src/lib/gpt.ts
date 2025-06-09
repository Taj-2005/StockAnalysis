type PricePoint = { date: Date; price: number };

export async function getGPTRecommendation(
  stockSymbol: string,
  priceHistory: PricePoint[]
): Promise<{ recommendation: string; portfolioPercent: number }> {
  const recommendation = Math.random() > 0.5 ? 'Buy' : 'Sell';
  const portfolioPercent = +(Math.random() * 20).toFixed(2);
  return { recommendation, portfolioPercent };
}
