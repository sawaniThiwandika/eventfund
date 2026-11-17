// Decorative stage-and-crowd scene for the bottom of the login brand panel.

const backRow = Array.from({ length: 34 }, (_, i) => ({
  x: i * 18 + (i % 3) * 3,
  y: 168 + (i % 4) * 4,
  armUp: i % 5 === 2,
}))

const frontRow = Array.from({ length: 22 }, (_, i) => ({
  x: i * 28 + (i % 2) * 6 - 6,
  y: 192 + (i % 3) * 5,
  armUp: i % 4 === 1,
}))

const lights = [322, 346, 370, 394, 418, 442, 466]

export function ConcertIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 240" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="ef-stage-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#7dd3fc" stopOpacity="0.75" />
          <stop offset="1" stopColor="#7dd3fc" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ef-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e0f2fe" stopOpacity="0.55" />
          <stop offset="1" stopColor="#e0f2fe" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Glow behind the stage */}
      <ellipse cx="395" cy="130" rx="230" ry="120" fill="url(#ef-stage-glow)" />

      {/* Light beams */}
      <polygon points="346,72 250,240 330,240" fill="url(#ef-beam)" />
      <polygon points="394,72 360,240 430,240" fill="url(#ef-beam)" />
      <polygon points="442,72 470,240 560,240" fill="url(#ef-beam)" />

      {/* Stage truss */}
      <g stroke="#1e3a8a" strokeWidth="4" fill="none">
        <path d="M300 60 L395 30 L490 60" />
        <rect x="300" y="60" width="190" height="10" />
        <path d="M304 70 V190 M486 70 V190" />
        <path d="M304 90 L316 100 L304 110 L316 120 L304 130 L316 140 L304 150" strokeWidth="2" />
        <path d="M486 90 L474 100 L486 110 L474 120 L486 130 L474 140 L486 150" strokeWidth="2" />
      </g>

      {/* Stage lights */}
      {lights.map((x) => (
        <g key={x}>
          <circle cx={x} cy="72" r="7" fill="#bae6fd" opacity="0.45" />
          <circle cx={x} cy="72" r="3" fill="#ffffff" />
        </g>
      ))}

      {/* Back row of the crowd */}
      <g fill="#1e3a8a">
        {backRow.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="8" />
            <rect x={p.x - 10} y={p.y + 6} width="20" height="60" rx="9" />
            {p.armUp && <path d={`M${p.x + 6} ${p.y + 10} L${p.x + 14} ${p.y - 22}`} stroke="#1e3a8a" strokeWidth="5" strokeLinecap="round" />}
          </g>
        ))}
      </g>

      {/* Front row of the crowd */}
      <g fill="#0b1640">
        {frontRow.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="12" />
            <rect x={p.x - 15} y={p.y + 9} width="30" height="60" rx="13" />
            {p.armUp && (
              <path d={`M${p.x - 9} ${p.y + 14} L${p.x - 18} ${p.y - 30}`} stroke="#0b1640" strokeWidth="7" strokeLinecap="round" />
            )}
          </g>
        ))}
      </g>
    </svg>
  )
}
