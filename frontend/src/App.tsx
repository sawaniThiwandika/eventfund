import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { Navbar } from './components/Navbar'
import { EventFormPage } from './pages/EventFormPage'
import { EventPage } from './pages/EventPage'
import { EventsPage } from './pages/EventsPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50">
      {/* Decorative background: soft grid and blue glows. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
        <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-400/25 blur-3xl" />
        <div className="absolute top-1/2 -right-40 h-[420px] w-[420px] rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[380px] w-[380px] rounded-full bg-indigo-300/15 blur-3xl" />
      </div>

      <div className="relative">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <Routes>
            <Route path="/" element={<Navigate to="/events" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
            <Route path="/events/new" element={<ProtectedRoute><EventFormPage /></ProtectedRoute>} />
            <Route path="/events/:id/edit" element={<ProtectedRoute><EventFormPage /></ProtectedRoute>} />
            <Route path="/events/:id/*" element={<ProtectedRoute><EventPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
