/**
 * Right-panel illustration for login/register: headline, features with icons, and dashboard-style cards.
 * Uses app violet/indigo theme with leveled layout and detailed icons.
 */

function IconProgress() {
  return (
    <svg className="h-6 w-6 shrink-0 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}

function IconJourneys() {
  return (
    <svg className="h-6 w-6 shrink-0 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function IconChallenges() {
  return (
    <svg className="h-6 w-6 shrink-0 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg className="h-5 w-5 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function AuthHero() {
  const features = [
    'Track progress across all your journeys',
    'Structured paths from basics to advanced',
    'Practice with real algorithm challenges',
  ]

  const cards = [
    { label: 'Progress', value: '—', Icon: IconProgress },
    { label: 'Journeys', value: '—', Icon: IconJourneys },
    { label: 'Challenges', value: '—', Icon: IconChallenges },
  ]

  return (
    <div className="relative flex min-h-0 flex-1 flex-col justify-center px-6 py-10 sm:px-8 md:px-10 lg:px-14">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative flex flex-col gap-8">
        {/* Headline block */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-[1.75rem] xl:text-3xl">
            Level up your algorithm skills.
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
            Sign in to track your progress, manage journeys, and practice with structured challenges.
          </p>
        </div>

        {/* Feature list with check icons */}
        <ul className="flex flex-col gap-3" role="list">
          {features.map((text, i) => (
            <li key={i} className="flex items-center gap-3">
              <IconCheck />
              <span className="text-sm text-white/90 sm:text-base">{text}</span>
            </li>
          ))}
        </ul>

        {/* Leveled dashboard cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {cards.map(({ label, value, Icon }) => (
            <div
              key={label}
              className="flex min-h-[88px] flex-col rounded-xl border border-white/10 bg-white/[0.06] p-4 shadow-lg backdrop-blur-sm transition hover:bg-white/[0.08] sm:min-h-[96px]"
            >
              <div className="flex items-center gap-2">
                <Icon />
                <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                  {label}
                </p>
              </div>
              <p className="mt-2 text-lg font-bold tabular-nums text-white sm:text-xl">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Mini progress bar visual */}
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium text-white/80">Your progress</span>
            <span className="tabular-nums text-white/60">Sign in to see</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400"
              style={{ width: '0%' }}
              aria-hidden
            />
          </div>
        </div>
      </div>

      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -right-16 -top-8 h-48 w-48 rounded-full bg-violet-400/15 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-12 right-1/4 h-36 w-36 rounded-full bg-fuchsia-400/10 blur-3xl" aria-hidden />
    </div>
  )
}
