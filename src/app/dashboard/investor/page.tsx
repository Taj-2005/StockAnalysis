'use client';

import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import CompletedAnalysisList from '@/app/components/CompletedAnalysis';
interface Stock {
  symbol: string;
  name: string;
  price: number;
}

export default function InvestorDashboard() {
  const [topStocks, setTopStocks] = useState<Stock[]>([]);
  const [message, setMessage] = useState('');
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [analyst, setAnalyst] = useState<any>(null);

  useEffect(() => {
    fetch('/api/assigned-analyst')
      .then(res => res.json())
      .then(data => setAnalyst(data.analyst));
  }, []);

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
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      alert('Unauthorized');
      return;
    }

    const res = await fetch('/api/analysis/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stockSymbol: symbol }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success(`Request sent for ${symbol}`);
    } else {
      toast.error(data.error || 'Error requesting analysis');
    }
  };


  return (
    <>
      <div className='min-w-screen flex flex-row justify-end items-end p-4'>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 md:px-4 md:py-2 px-2 py-1 bg-red-500 hover:bg-red-400 text-white font-medium rounded-md shadow transition-colors duration-200">
            <span>Logout</span>
        <LogOut className="w-5 h-5" />
        </button>
      </div>
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Investor Dashboard</h1>
        {analyst ? (
          <p className="mb-4">📊 Assigned Analyst: <b>{analyst.email}</b></p>
        ) : (
          <p className="mb-4 text-red-500">❌ No analyst assigned yet. Please wait for assignment.</p>
        )}
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
        <CompletedAnalysisList />
      </main>
    </>
  );
}
