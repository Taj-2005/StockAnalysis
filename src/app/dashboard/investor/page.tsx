'use client';

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function InvestorDashboard() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch('/api/reports/investor') // You'll implement this
      .then(res => res.json())
      .then(setReports);
  }, []);

  return (
    <>
    <div className='flex flex-row min-w-screen justify-end items-end px-10 py-5'>
      <button onClick={() => signOut()} className='p-2 flex flex-row justify-center items-center gap-2 bg-red-500 rounded-xl shadow-2xl border-white'>
        <span>Logout</span>
        <LogOut className="w-5 h-5" />
      </button>
    </div>
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl mb-6">Investor Dashboard</h1>
      <p>Here you can request analyses and view past reports.</p>
    </main>
    </>
  );
}
