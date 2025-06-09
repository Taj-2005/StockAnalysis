'use client';

import { useEffect, useState } from 'react';

interface CompletedAnalysis {
  _id: string;
  stockSymbol: string;
  result: string;
  analystId: { email: string };
}

export default function CompletedAnalysisList() {
  const [completed, setCompleted] = useState<CompletedAnalysis[]>([]);

  useEffect(() => {
    fetch('/api/analysis/results', {
      headers: { Authorization: `Bearer ${document.cookie.split('token=')[1]}` },
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
          <li key={item._id} className="mb-3 border-b border-gray-600 pb-2">
            <p><b>Stock:</b> {item.stockSymbol}</p>
            <p><b>Analyst:</b> {item.analystId.email}</p>
            <p className="whitespace-pre-wrap">{item.result}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
