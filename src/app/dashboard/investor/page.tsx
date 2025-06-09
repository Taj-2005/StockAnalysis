'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
interface Stock {
  symbol: string;
  name: string;
  price: number;
}

export default function InvestorDashboard() {
  const [topStocks, setTopStocks] = useState<Stock[]>([]);
  const [message, setMessage] = useState('');
  const [watchlist, setWatchlist] = useState<string[]>([]);

  const addToWatchlist = async (symbol: string) => {
    const res = await fetch('/api/watchlist/add', {
      method: 'POST',
      body: JSON.stringify({ symbol }),
    });

    const data = await res.json();

    if (res.ok) {
      setWatchlist((prev) => [...prev, symbol]);
      toast.success(`${symbol} added to Watchlist`);
    } else {
      toast.error(data.error || 'Failed to add');
    }
  };


  useEffect(() => {
    fetch('/api/stocks/top')
      .then(res => res.json())
      .then(data => setTopStocks(data.stocks));
  }, []);

  useEffect(() => {
  fetch('/api/watchlist/get')
    .then(res => res.json())
    .then(data => setWatchlist(data.symbols));
}, []);

  const requestAnalysis = async (symbol: string) => {
    const res = await fetch('/api/analysis/request', {
      method: 'POST',
      body: JSON.stringify({ symbol }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(`Request sent for ${symbol}`);
    } else {
      setMessage(data.error || 'Error requesting analysis');
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Investor Dashboard</h1>
      <p className="mb-6">Explore top stocks and request analysis from your analyst:</p>

      {message && <p className="text-green-600 mb-4">{message}</p>}

      <table className="w-full text-sm text-left text-gray-200 border border-gray-600 rounded-md overflow-hidden">
        <thead className="bg-gray-800 text-gray-300 text-sm uppercase">
          <tr>
            <th className="px-4 py-3">Symbol</th>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {topStocks.map((stock) => (
            <tr key={stock.symbol}>
              <td className="px-4 py-2 font-medium">{stock.symbol}</td>
              <td className="px-4 py-2">{stock.name}</td>
              <td className="px-4 py-2">${stock.price.toFixed(2)}</td>
              <td className="px-4 py-2">
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                    onClick={() => requestAnalysis(stock.symbol)}
                  >
                    📊 Request Analysis
                  </button>

                  {watchlist.includes(stock.symbol) ? (
                    <button
                      className="bg-gray-400 text-gray-800 px-3 py-1 rounded-md text-sm cursor-not-allowed"
                      disabled
                    >
                      ⭐ Watched
                    </button>
                  ) : (
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
                      onClick={() => addToWatchlist(stock.symbol)}
                    >
                      ⭐ Watch
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
