import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { useAuth } from '../auth/useAuth'
import { AuthLayout } from '../components/AuthLayout'
import { IconField, PasswordField } from '../components/FormFields'
import { icons } from '../components/icons'

export function RegisterPage() {
  const { user, loading, register } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return null
  }
  if (user) {
    return <Navigate to="/events" replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    // Quick check in the browser; the backend checks this again.
    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: 'Passwords do not match' })
      return
    }

    setSubmitting(true)
    try {
      await register({ fullName, email, password, confirmPassword })
      navigate('/events', { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        // Field errors are shown under each field; the banner is only for other errors.
        if (Object.keys(err.fieldErrors).length === 0) {
          setError(err.message)
        }
        setFieldErrors(err.fieldErrors)
      } else {
        setError("We couldn't create your account right now. Please try again shortly.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Create Your Account" subtitle="Start managing your event finances with confidence.">
      {error && (
        <p role="alert" className="alert-error">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <IconField
          id="fullName"
          label="Full name"
          icon={icons.user}
          autoComplete="name"
          required
          maxLength={150}
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={fieldErrors.fullName}
        />

        <IconField
          id="email"
          label="Email"
          icon={icons.mail}
          type="email"
          autoComplete="email"
          required
          maxLength={255}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
        />

        <PasswordField
          id="password"
          label="Password"
          icon={icons.lock}
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={72}
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          hint="Use 8 to 72 characters."
        />

        <PasswordField
          id="confirmPassword"
          label="Confirm password"
          icon={icons.shield}
          autoComplete="new-password"
          required
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={fieldErrors.confirmPassword}
        />

        <button type="submit" disabled={submitting} className="btn-pill mt-2 w-full">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
          </svg>
          {submitting ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-700">
        Already have an account?{' '}
        <Link to="/login" className="link">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
