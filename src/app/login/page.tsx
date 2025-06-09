'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Login failed')
        toast.error(data.message || 'Login failed')
        return
      }

      localStorage.setItem('token', data.token)

      console.log('JWT token:', data.token)

      const payload = JSON.parse(atob(data.token.split('.')[1]))
      const role = payload.role?.toLowerCase()

      console.log('User role:', role)


      if (role === 'investor') {
        toast.success('Redirecting to Investor Dashboard')
        router.replace('/dashboard/investor')
        } else if (role === 'analyst') {
            toast.success('Redirecting to Analyst Dashboard')
            router.replace('/dashboard/analyst')
        } else {
            toast.error(`Unknown role: ${role}`)
            router.replace('/')
        }
    } catch (err) {
      console.error('Login error:', err)
      setError('Something went wrong. Please try again.')
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-gray-50 text-black">
      <form onSubmit={handleLogin} className="flex flex-col gap-2 bg-white shadow-md p-6 rounded w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <label>
          Email
        <input
          type="email"
          placeholder="Email"
          value={email}
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
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        />
        </label>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
       <p className='text-center p-2'>Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Register here</a></p>
      </form>
    </main>
  )
}
