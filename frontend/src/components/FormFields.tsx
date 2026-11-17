import { useState, type InputHTMLAttributes, type ReactNode } from 'react'

function Icon({ path, className = 'h-5 w-5' }: { path: string; className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  )
}

type IconFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string
  label: string
  icon: string
  error?: string
  hint?: string
  /** Extra element shown inside the input on the right, e.g. a show/hide button. */
  trailing?: ReactNode
}

/** Pill-shaped input with an icon segment on the left, a screen-reader label and an error line. */
export function IconField({ id, label, icon, error, hint, trailing, className = '', ...inputProps }: IconFieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`peer input-pill ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-500/15' : ''} ${className}`}
          {...inputProps}
        />
        <span className="input-pill-icon">
          <Icon path={icon} />
        </span>
        {trailing}
      </div>
      {error ? (
        <p id={`${id}-error`} className="field-error pl-5">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 pl-5 text-xs text-slate-500">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

const eyeOpen = [
  'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  'M2.46 12C3.73 7.94 7.52 5 12 5s8.27 2.94 9.54 7c-1.27 4.06-5.06 7-9.54 7s-8.27-2.94-9.54-7z',
]
const eyeClosed =
  'M3 3l18 18M10.58 10.58a2 2 0 002.83 2.83M9.88 5.09A9.77 9.77 0 0112 4.88c4.48 0 8.27 2.94 9.54 7a10.05 10.05 0 01-4.13 5.26M6.23 6.23A10.05 10.05 0 002.46 12c1.27 4.06 5.06 7 9.54 7a9.8 9.8 0 004.27-.97'

/** IconField for passwords, with a show/hide button on the right. */
export function PasswordField(props: Omit<IconFieldProps, 'type'>) {
  const [visible, setVisible] = useState(false)
  return (
    <IconField
      {...props}
      type={visible ? 'text' : 'password'}
      className="pr-14"
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
            {(visible ? [eyeClosed] : eyeOpen).map((d) => (
              <path key={d} strokeLinecap="round" strokeLinejoin="round" d={d} />
            ))}
          </svg>
        </button>
      }
    />
  )
}
