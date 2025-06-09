'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'investor' | 'analyst'>('investor')
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, role }),
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Signup failed')
        toast.error(data.error || 'Signup failed')
        return
      }

      toast.success('Signup successful! Please log in.')
      router.push('/login')
    } catch (err: any) {
      console.error('Signup error:', err)
      setError('Something went wrong. Please try again.')
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-gray-50 text-black">
      <form onSubmit={handleSignup} className="flex flex-col gap-2 bg-white shadow-md p-6 rounded w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Signup</h2>

        <label>
          Email
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full mb-3 rounded"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full mb-3 rounded"
          />
        </label>

        <label>
          Role
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'investor' | 'analyst')}
            className="border p-2 w-full mb-4 rounded"
          >
            <option value="investor">Investor</option>
            <option value="analyst">Analyst</option>
          </select>
        </label>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Signup
        </button>

        <p className="text-center p-2">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">Login here</a>
        </p>
      </form>
    </main>
  )
}
