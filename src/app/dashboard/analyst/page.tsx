'use client';

import { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import AssignInvestors from '@/app/components/AssignInvestors';
import AssignedInvestors from '@/app/components/AssignedInvestors';

interface DecodedToken {
  userId: string;
  email?: string;
  role?: string;
  exp?: number;
}

export default function AnalystDashboard() {
  const [userId, setUserId] = useState('');

  useEffect(() => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
      console.log('Token from cookie:', token);

      if (token) {
        const decoded = jwtDecode<DecodedToken>(token);
        console.log('Decoded token:', decoded);

        if (decoded?.userId) {  // <-- change here
          setUserId(decoded.userId);
        }
      }
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }, []);

  if (!userId) return <p className="text-white">Loading dashboard...</p>;

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
      <div className="p-6">
        <h1 className="text-2xl text-white mb-4">📊 Analyst Dashboard</h1>
        <AssignInvestors analystId={userId} />
        <AssignedInvestors analystId={userId} />
      </div>
    </>
  );
}
