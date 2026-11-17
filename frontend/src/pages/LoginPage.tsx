import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { useAuth } from '../auth/useAuth'
import { AuthLayout } from '../components/AuthLayout'
import { IconField, PasswordField } from '../components/FormFields'
import { icons } from '../components/icons'

export function LoginPage() {
  const { user, loading, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/events'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return null
  }
  if (user) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    setSubmitting(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
        setFieldErrors(err.fieldErrors)
      } else {
        setError("We couldn't sign you in right now. Please try again shortly.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to access your events and financial dashboard.">
      {error && (
        <p role="alert" className="alert-error">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <IconField
          id="email"
          label="Email"
          icon={icons.mail}
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
        />

        <PasswordField
          id="password"
          label="Password"
          icon={icons.lock}
          autoComplete="current-password"
          required
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
        />

        <button type="submit" disabled={submitting} className="btn-pill mt-2 w-full">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
          </svg>
          {submitting ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-700">
        New to EventFund?{' '}
        <Link to="/register" className="link">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  )
}
