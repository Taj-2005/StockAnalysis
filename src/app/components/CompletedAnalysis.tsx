import { useEffect, useState } from 'react';

interface CompletedAnalysis {
  _id: string;
  stockSymbol: string;
  result: string;
  analystId: { email: string };
  createdAt: string;
}

export default function CompletedAnalysisList() {
  const [completed, setCompleted] = useState<CompletedAnalysis[]>([]);

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
      
    fetch('/api/analysis/results', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setCompleted(data.results || []))
      .catch(console.error);
  }, []);

  if (completed.length === 0) return <p>No completed analyses yet.</p>;

  return (
    <div className="mt-6 bg-gray-800 p-4 rounded text-white">
      <h2 className="text-xl mb-4">✅ Completed Analyses</h2>
      <ul>
        {completed.map((item) => (
          <li key={item._id} className="flex flex-col justify-center mb-3 border-b border-gray-600 shadow-2xl pb-2 bg-black p-4 rounded-2xl">
            <p><b>Stock:</b> {item.stockSymbol}</p>
            <p><b>Analyst:</b> {item.analystId.email}</p>
            <p><b>Date:</b> {new Date(item.createdAt).toLocaleString()}</p>
            <p className="whitespace-pre-wrap">{item.result}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
