/** EventFund logo mark: a rising arrow inside a blue gradient tile. */
export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ef-logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1d4ed8" />
          <stop offset="1" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#ef-logo-gradient)" />
      <g fill="none" stroke="white" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 28l7-7" />
        <path d="M16 28l13-13" />
        <path d="M21 14.5h8.5V23" />
      </g>
    </svg>
  )
}

/** Logo mark with the EventFund wordmark. */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className="h-9 w-9 shrink-0 drop-shadow-md" />
      <span className={`text-lg font-extrabold tracking-tight sm:text-xl ${light ? 'text-white' : 'text-slate-900'}`}>
        Event<span className={light ? 'text-sky-300' : 'text-blue-600'}>Fund</span>
      </span>
    </span>
  )
}
