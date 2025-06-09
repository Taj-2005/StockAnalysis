'use client';

import { useEffect, useState } from 'react';

interface Request {
  _id: string;
  stockSymbol: string;
  status: string;
  result?: string;
  investorId: {
    _id: string;
    email: string;
  };
}

export default function AnalysisRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);
  const [analysisText, setAnalysisText] = useState('');

  const getToken = () =>
    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    fetch('/api/analysis/pending', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.requests) {
          setRequests(data.requests);
        }
      })
      .catch(console.error);
  }, []);

  // Reset analysisText whenever editingRequestId changes
  useEffect(() => {
    setAnalysisText('');
  }, [editingRequestId]);

  const submitAnalysis = async (id: string) => {
    const token = getToken();
    if (!token) {
      alert('Not authenticated');
      return;
    }

    if (!analysisText.trim()) return alert('Please enter analysis result.');

    const res = await fetch(`/api/analysis/requests/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ result: analysisText }),
    });

    if (res.ok) {
      alert('Analysis submitted');
      setEditingRequestId(null);
      setAnalysisText('');

      // Refresh the list to only include updated pending requests
      const refreshed = await fetch('/api/analysis/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await refreshed.json();
      setRequests(data.requests || []);
    } else {
      alert('Failed to submit analysis');
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white">
      <h2 className="text-xl mb-4">📝 Pending Analysis Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <ul>
          {requests.map((req) => (
            <li key={req._id} className="mb-4 border-b border-gray-600 pb-2">
              <p>
                <b>Stock:</b> {req.stockSymbol}
              </p>
              <p>
                <b>From Investor:</b> {req.investorId.email}
              </p>
              {editingRequestId === req._id ? (
                <>
                  <textarea
                    rows={4}
                    className="w-full mt-2 p-2 rounded bg-gray-700 text-white"
                    value={analysisText}
                    onChange={(e) => setAnalysisText(e.target.value)}
                    placeholder="Write your analysis here..."
                  />
                  <button
                    className="mt-2 px-3 py-1 bg-green-600 rounded hover:bg-green-700"
                    onClick={() => submitAnalysis(req._id)}
                  >
                    Submit
                  </button>
                  <button
                    className="mt-2 ml-2 px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                    onClick={() => setEditingRequestId(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="mt-2 px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
                  onClick={() => setEditingRequestId(req._id)}
                >
                  Add Analysis
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
