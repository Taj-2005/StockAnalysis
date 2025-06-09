'use client';

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AnalystDashboard() {
  const [priceData, setPriceData] = useState<{ date: string; price: number }[]>([]);

  useEffect(() => {
    // Fetch stock price history for a symbol (e.g., AAPL)
    fetch('/api/stock/AAPL')
      .then(res => res.json())
      .then(data => setPriceData(data.prices));
  }, []);

  const data = {
    labels: priceData.map(p => new Date(p.date).toLocaleDateString()),
    datasets: [
      {
        label: 'AAPL Price',
        data: priceData.map(p => p.price),
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.5)',
      },
    ],
  };

  return (
    <>
    <div className='flex flex-row min-w-screen justify-end items-end px-10 py-5'>
      <button onClick={() => signOut()} className='p-2 flex flex-row justify-center items-center gap-2 bg-red-500 rounded-xl shadow-2xl border-white'>
        <span>Logout</span>
        <LogOut className="w-5 h-5" />
      </button>
    </div>
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl mb-6">Analyst Dashboard</h1>
      <p>Analyze stock trends and generate recommendations.</p>
      <div className="max-w-2xl">
        <Line options={{ responsive: true, plugins: { legend: { position: 'top' } } }} data={data} />
      </div>
      {/* Add UI to generate recommendations using GPT-4 */}
    </main>
    </>
  );
}
