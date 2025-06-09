'use client';

import { useEffect, useState } from 'react';

export default function AssignedInvestors({ analystId }: { analystId: string }) {
  const [investors, setInvestors] = useState<any[]>([]);

    useEffect(() => {
    if (!analystId) return;

    async function fetchInvestors() {
        try {
        const meRes = await fetch(`/api/me/${analystId}`);
        const meData = await meRes.json();
        const investorIds = meData.user.assignedInvestors || [];

        if (investorIds.length === 0) {
            setInvestors([]);
            return;
        }

        const detailsRes = await fetch(`/api/investors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: investorIds }),
        });
        const detailsData = await detailsRes.json();

        if (detailsData.investors) {
            setInvestors(detailsData.investors);
        }
        } catch (error) {
        console.error('Failed to fetch assigned investors details:', error);
        }
    }

    fetchInvestors();
    }, [analystId]);


  return (
    <div className="bg-gray-800 p-4 mt-6 rounded-lg text-white">
      <h2 className="text-xl mb-2">🎯 Your Assigned Investors</h2>
      {investors.length === 0 ? (
        <p>No assigned investors yet.</p>
      ) : (
        <ul className="list-disc ml-6">
          {investors.map(inv => (
            <li key={inv._id}>{inv.email}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
