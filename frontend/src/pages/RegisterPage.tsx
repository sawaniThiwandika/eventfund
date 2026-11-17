import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'

// Placeholder so the navbar's Register link works. The registration form comes in a later task.
export function RegisterPage() {
  return (
    <AuthLayout title="Create Your Account" subtitle="Start managing your event finances with confidence. Registration opens soon.">
      <p className="text-center text-sm text-slate-700">
        Already have an account?{' '}
        <Link to="/login" className="link">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
