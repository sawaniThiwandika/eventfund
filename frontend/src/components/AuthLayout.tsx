import type { ReactNode } from 'react'
import { ConcertIllustration } from './ConcertIllustration'
import { Logo, LogoMark } from './Logo'

const features = [
  {
    label: 'Centralised Event Management',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    label: 'Secure, Role-Based Team Access',
    icon: 'M17 20h5v-2a3 3 0 00-5.36-1.86M17 20H7m10 0v-2c0-.66-.13-1.28-.36-1.86M7 20H2v-2a3 3 0 015.36-1.86M7 20v-2c0-.66.13-1.28.36-1.86m0 0a5 5 0 019.28 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    label: 'Clear Financial Reporting',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
]

/**
 * Layout for the login and register pages.
 * Desktop: dark blue brand panel with a wave edge on the left, form on the right.
 * Mobile and tablet: only the form card, centred.
 */
export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-md lg:grid lg:min-h-[640px] lg:max-w-6xl lg:grid-cols-[1.1fr_1fr] lg:overflow-hidden lg:rounded-[2rem] lg:bg-white lg:shadow-2xl lg:shadow-blue-900/15">
      {/* Brand panel (desktop only) */}
      <aside className="relative hidden overflow-hidden bg-linear-to-br from-[#0a1a6b] via-blue-800 to-blue-600 text-white lg:block">
        {/* Soft light streaks */}
        <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M20 100 C45 70 60 45 95 20" stroke="#7dd3fc" strokeOpacity="0.35" strokeWidth="0.25" fill="none" />
          <path d="M35 100 C55 75 70 50 100 35" stroke="#bae6fd" strokeOpacity="0.2" strokeWidth="0.2" fill="none" />
        </svg>
        <div aria-hidden="true" className="absolute -top-32 right-10 h-96 w-72 rounded-full bg-blue-500/30 blur-3xl" />

        <ConcertIllustration className="absolute inset-x-0 bottom-0 h-[46%] w-full" />

        {/* Wave edge into the form side */}
        <svg aria-hidden="true" className="absolute inset-y-0 right-0 h-full w-32 text-white" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M100 0 H55 C20 25 95 55 45 80 C30 88 35 95 40 100 H100 Z" fill="currentColor" />
          <path d="M55 0 C20 25 95 55 45 80 C30 88 35 95 40 100" stroke="#7dd3fc" strokeOpacity="0.6" strokeWidth="0.6" fill="none" vectorEffect="non-scaling-stroke" />
        </svg>

        <div className="relative flex h-full flex-col p-12 pr-32">
          <Logo light />

          <h2 className="mt-14 text-4xl leading-[1.1] font-extrabold tracking-tight xl:text-5xl">
            Smarter Finances for{' '}
            <span className="bg-linear-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent">Every Event</span>
          </h2>
          <p className="mt-5 max-w-sm text-lg text-blue-100">
            Track income and expenses, collaborate with your team and share clear financial reports, all in one
            secure workspace.
          </p>

          <ul className="mt-8 w-fit space-y-2 rounded-3xl bg-white/5 p-3 pr-6 ring-1 ring-white/15 backdrop-blur-sm">
            {features.map((f) => (
              <li key={f.label} className="flex items-center gap-3 text-sm font-medium">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20">
                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                </span>
                {f.label}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Form side */}
      <section className="relative overflow-hidden rounded-[2rem] bg-white px-6 py-10 shadow-xl shadow-blue-900/10 ring-1 ring-slate-200/70 sm:px-10 lg:flex lg:flex-col lg:justify-center lg:rounded-none lg:px-14 lg:shadow-none lg:ring-0">
        <div aria-hidden="true" className="absolute -top-20 -right-20 h-52 w-52 rounded-full bg-linear-to-br from-blue-300/70 to-sky-200/40" />
        <div aria-hidden="true" className="absolute -right-16 -bottom-24 h-60 w-60 rounded-full bg-linear-to-tl from-blue-400/60 to-sky-200/30" />

        <div className="relative mx-auto w-full max-w-sm">
          <div className="mb-8 text-center">
            <LogoMark className="mx-auto mb-6 h-16 w-16 drop-shadow-[0_10px_20px_rgba(37,99,235,0.35)]" />
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0a1a4f] sm:text-4xl">{title}</h1>
            <p className="mt-3 text-sm text-slate-500 sm:text-base">{subtitle}</p>
          </div>
          {children}
        </div>
      </section>
    </div>
  )
}
