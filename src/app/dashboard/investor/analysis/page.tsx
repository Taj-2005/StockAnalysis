'use client';

import { useEffect, useState } from 'react';

interface Report {
  _id: string;
  stockSymbol: string;
  recommendation: string;
  portfolioPercent: number;
}

export default function InvestorAnalysisPage() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    fetch('/api/analysis/my')
      .then((res) => res.json())
      .then((data) => setReports(data.reports));
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6">
        {reports.length === 0 ? (
            <p className="text-gray-500">You have no analysis reports yet. Request analysis from your dashboard.</p>
            ) : (
            <table className="...">...</table>
            )}
      <h1 className="text-2xl font-bold mb-4">Your Analysis Reports</h1>

      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Stock</th>
            <th className="p-2">Recommendation</th>
            <th className="p-2">Portfolio %</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report._id} className="border-t">
              <td className="p-2">{report.stockSymbol}</td>
              <td className="p-2">{report.recommendation}</td>
              <td className="p-2">{report.portfolioPercent}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
