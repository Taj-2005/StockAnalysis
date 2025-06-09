'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AssignInvestors({ analystId }: { analystId: string }) {
  const [investors, setInvestors] = useState<any[]>([]);
  const [assignedIds, setAssignedIds] = useState<string[]>([]);

  useEffect(() => {
    // Fetch all investors
    fetch('/api/users?role=investor')
      .then(res => res.json())
      .then(data => setInvestors(data.users));

    // Fetch already assigned investors
    fetch(`/api/me/${analystId}`)
      .then(res => res.json())
      .then(data => setAssignedIds(data.user.assignedInvestors || []));
  }, [analystId]);

  const assignInvestor = async (investorId: string) => {
    const res = await fetch('/api/assign-investor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },  // Add this header
      body: JSON.stringify({ investorIds: [investorId] }), // Send as array
    });

    if (res.ok) {
      setAssignedIds(prev => [...prev, investorId]);
      toast.success('Investor assigned');
    } else {
      toast.error('Failed to assign');
    }
  };

  return (
    <div className="bg-gray-900 p-4 mt-8 rounded-lg shadow text-white">
      <h2 className="text-xl mb-4">👤 Assign Investors</h2>
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-600 text-gray-400">
          <tr>
            <th className="p-2">Investor Email</th>
            <th className="p-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {investors.map(investor => (
            <tr key={investor._id} className="border-t border-gray-700">
              <td className="p-2">{investor.email}</td>
              <td className="p-2 text-center">
                {assignedIds.includes(investor._id) ? (
                  <span className="text-green-400 font-semibold">✅ Assigned</span>
                ) : (
                  <button
                    onClick={() => assignInvestor(investor._id)}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm"
                  >
                    Assign
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
