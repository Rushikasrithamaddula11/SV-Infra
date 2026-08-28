import React, { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { user, login, signup } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to={location.state?.from?.pathname || '/admin'} replace />

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isRegistering) {
        await signup(email, password)
      } else {
        await login(email, password)
      }
      navigate(location.state?.from?.pathname || '/admin', { replace: true })
    } catch (err) {
      setError(err.message || 'Authentication failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-sm p-8 rounded-sm shadow-xl">
        <div className="text-center mb-8">
          <div className="h-12 w-12 mx-auto border-2 border-gold flex items-center justify-center text-gold font-display font-bold">SV</div>
          <p className="font-display font-bold text-lg text-navy mt-3">SV Infra projects 972</p>
          <p className="text-xs text-navy/50 uppercase tracking-wide">
            {isRegistering ? 'Create Admin Account' : 'Admin Login'}
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <input className="input-field" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="input-field" type="password" placeholder="Password (min 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60 flex items-center justify-center gap-2">
            {isRegistering ? <UserPlus size={16} /> : <LogIn size={16} />}
            {loading ? (isRegistering ? 'Creating Account…' : 'Signing in…') : (isRegistering ? 'Create Account' : 'Sign In')}
          </button>
        </form>
        <div className="text-center mt-5 pt-4 border-t border-navy/10">
          <button
            type="button"
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
            className="text-xs text-navy/60 hover:text-gold transition-colors underline"
          >
            {isRegistering ? 'Already have an admin account? Sign In' : 'First time? Register initial Admin Account'}
          </button>
        </div>
      </div>
    </div>
  )
}
