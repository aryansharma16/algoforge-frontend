import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

const VIEWS = ['map', 'summary', 'quickstart']

function IconMap({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  )
}
function IconDoc({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}
function IconRocket({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.9-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  )
}

const NODES = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', desc: 'Overview of your progress' },
  { id: 'journeys', label: 'Journeys', path: '/journeys', desc: 'Learning paths (e.g. DSA, system design)' },
  { id: 'items', label: 'Items', path: null, desc: 'Problems or topics inside a journey' },
  { id: 'submissions', label: 'Submissions', path: null, desc: 'Your solutions, code & notes per item' },
  { id: 'profile', label: 'Profile', path: '/profile', desc: 'Skills, work, education, links' },
  { id: 'settings', label: 'Settings', path: '/settings', desc: 'Account and preferences' },
]

// Main flow: Dashboard → Journeys → Items → Submissions (vertical chain).
// Profile & Settings branch from Dashboard via curved paths to avoid overlapping the chain.
const FLOW_EDGES = [
  ['dashboard', 'journeys'],
  ['journeys', 'items'],
  ['items', 'submissions'],
]

const BRANCH_EDGES = [
  ['dashboard', 'profile'],
  ['dashboard', 'settings'],
]

function NodeMap() {
  const [hovered, setHovered] = useState(null)
  // Vertical flow down the center (Journey → Items → Submissions); Profile & Settings on bottom row, well apart
  const positions = {
    dashboard: { x: 50, y: 8 },
    journeys: { x: 50, y: 26 },
    items: { x: 50, y: 46 },
    submissions: { x: 50, y: 66 },
    profile: { x: 22, y: 88 },
    settings: { x: 78, y: 88 },
  }

  const cardBase =
    'absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 rounded-2xl border-2 text-center min-w-[160px] max-w-[200px] px-4 py-3 flex flex-col items-center justify-center gap-0'

  const cardState = (id) =>
    hovered === id
      ? 'scale-105 border-violet-500 bg-violet-500/15 shadow-xl shadow-violet-500/20 dark:bg-violet-500/20 z-10'
      : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800/90 hover:border-violet-400 dark:hover:border-violet-500/60 z-0'

  const lineClass = 'text-violet-400/60 dark:text-violet-500/50'
  const flowLineClass = 'text-violet-500/70 dark:text-violet-400/60'

  return (
    <div className="relative h-[480px] w-full max-w-2xl mx-auto sm:h-[520px]">
      <svg
        className="absolute inset-0 h-full w-full overflow-visible pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* Main flow: straight vertical line — Journey → Items → Submissions (emphasized) */}
        {FLOW_EDGES.map(([a, b], i) => {
          const from = positions[a]
          const to = positions[b]
          if (!from || !to) return null
          const active = hovered === a || hovered === b
          return (
            <line
              key={`flow-${i}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="currentColor"
              strokeWidth={active ? 1.2 : 1}
              strokeDasharray="0"
              className={flowLineClass}
              style={{ strokeLinecap: 'round' }}
            />
          )
        })}
        {/* Branch edges: curved paths from Dashboard to Profile/Settings so they don't cross the center */}
        {BRANCH_EDGES.map(([a, b], i) => {
          const from = positions[a]
          const to = positions[b]
          if (!from || !to) return null
          const ctrlX = to.x < 50 ? 8 : 92
          const ctrlY = 50
          const d = `M ${from.x} ${from.y} Q ${ctrlX} ${ctrlY} ${to.x} ${to.y}`
          const active = hovered === a || hovered === b
          return (
            <path
              key={`branch-${i}`}
              d={d}
              fill="none"
              stroke="currentColor"
              strokeWidth={active ? 1 : 0.8}
              strokeDasharray={active ? '0' : '3 3'}
              className={lineClass}
              style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
            />
          )
        })}
      </svg>
      {NODES.map((node) => (
        <div
          key={node.id}
          className={`${cardBase} ${cardState(node.id)}`}
          style={{ left: `${positions[node.id].x}%`, top: `${positions[node.id].y}%` }}
          onMouseEnter={() => setHovered(node.id)}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="w-full">
            {node.path ? (
              <Link
                to={node.path}
                className="block text-base font-semibold text-slate-800 dark:text-slate-200 no-underline hover:text-violet-600 dark:hover:text-violet-400"
              >
                {node.label}
              </Link>
            ) : (
              <span className="block text-base font-semibold text-slate-700 dark:text-slate-300">
                {node.label}
              </span>
            )}
            {/* Description: small, at bottom of card, only on hover */}
            <p
              className={`mt-1.5 min-h-[2rem] text-[11px] leading-snug text-slate-500 dark:text-slate-400 transition-opacity duration-150 line-clamp-2 ${
                hovered === node.id ? 'opacity-100' : 'opacity-0 h-0 min-h-0 mt-0 overflow-hidden'
              }`}
            >
              {node.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function About() {
  const [view, setView] = useState('map')
  const summaryRef = useRef(null)
  const quickstartRef = useRef(null)

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-2">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          How to use AlgoForge
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Choose a view below to explore the app structure and get started.
        </p>
      </header>

      {/* View tabs */}
      <div
        className="mb-8 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50/80 p-2 dark:border-slate-700 dark:bg-slate-800/50"
        role="tablist"
        aria-label="About view"
      >
        {VIEWS.map((v, idx) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={view === v}
            aria-controls={`about-panel-${v}`}
            id={`about-tab-${v}`}
            tabIndex={view === v ? 0 : -1}
            onClick={() => setView(v)}
            onKeyDown={(e) => {
              const next = e.key === 'ArrowRight' ? VIEWS[idx + 1] : e.key === 'ArrowLeft' ? VIEWS[idx - 1] : null
              if (next) {
                e.preventDefault()
                setView(next)
              }
            }}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 ${
              view === v
                ? 'bg-violet-600 text-white shadow-md dark:bg-violet-500'
                : 'text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700'
            }`}
          >
            {v === 'map' && <IconMap className="h-4 w-4" />}
            {v === 'summary' && <IconDoc className="h-4 w-4" />}
            {v === 'quickstart' && <IconRocket className="h-4 w-4" />}
            <span className="capitalize">
              {v === 'map' ? 'App map' : v === 'summary' ? 'Summary' : 'Quick start'}
            </span>
          </button>
        ))}
      </div>

      {/* Map view */}
      {view === 'map' && (
        <section
          id="about-panel-map"
          role="tabpanel"
          aria-labelledby="about-tab-map"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900/50"
          aria-label="App structure map"
        >
          <p className="mb-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Hover a card to see a short description at the bottom. Click linked cards to go there.
          </p>
          <p className="mb-6 text-center text-xs font-medium text-violet-600 dark:text-violet-400">
            Main flow: Journeys → Items → Submissions (top to bottom)
          </p>
          <NodeMap />
        </section>
      )}

      {/* Summary view */}
      {view === 'summary' && (
        <section
          id="about-panel-summary"
          ref={summaryRef}
          role="tabpanel"
          aria-labelledby="about-tab-summary"
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900/50"
          aria-label="App summary"
        >
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              What is AlgoForge?
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              AlgoForge helps you track learning journeys (e.g. DSA, system design, interview prep).
              You create journeys, add items (problems or topics) to each journey, and log
              submissions—solutions, code, time/space complexity, and notes—so you can review and
              improve over time.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Main areas
            </h2>
            <ul className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                <span className="font-semibold text-violet-600 dark:text-violet-400">Dashboard</span>
                <span>— Your overview: recent activity and quick links to journeys.</span>
              </li>
              <li className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                <span className="font-semibold text-violet-600 dark:text-violet-400">Journeys</span>
                <span>— Create and manage learning paths. Open a journey to add items and see
                  progress (timeline, stats).</span>
              </li>
              <li className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                <span className="font-semibold text-violet-600 dark:text-violet-400">Items</span>
                <span>— Problems or topics inside a journey. Each item can have multiple
                  submissions (solutions, code, TC/SC, notes).</span>
              </li>
              <li className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                <span className="font-semibold text-violet-600 dark:text-violet-400">Profile</span>
                <span>— Edit your profile (skills, work, education, links) from the bottom of the
                  sidebar.</span>
              </li>
              <li className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                <span className="font-semibold text-violet-600 dark:text-violet-400">Settings</span>
                <span>— Account and app preferences.</span>
              </li>
            </ul>
          </div>
        </section>
      )}

      {/* Quick start view */}
      {view === 'quickstart' && (
        <section
          id="about-panel-quickstart"
          ref={quickstartRef}
          role="tabpanel"
          aria-labelledby="about-tab-quickstart"
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900/50"
          aria-label="Quick start guide"
        >
          {[
            {
              step: 1,
              title: 'Create a journey',
              body: 'Go to Learning Journeys and click "New journey". Give it a title (e.g. "DSA grind") and optional description, then save. You’ll see a thank-you screen with a "Go to journey" button.',
              link: '/journeys/new',
              linkLabel: 'Create journey',
            },
            {
              step: 2,
              title: 'Add items to the journey',
              body: 'On the journey page, use the Items section to add problems or topics. Each item can have a title, description, and resources. You can view items as tiles, cards, or a list.',
              link: null,
              linkLabel: null,
            },
            {
              step: 3,
              title: 'Log submissions',
              body: 'Open an item to add submissions. Fill in how you solved it, time/space complexity, result, and code. Required: method, time complexity, and space complexity. After saving, you’ll see a thank-you message and can "Add another submission".',
              link: null,
              linkLabel: null,
            },
            {
              step: 4,
              title: 'Complete your profile',
              body: 'Click your name at the bottom of the sidebar to open your profile. Add skills, work experience, education, and social links so your profile is ready to share.',
              link: '/profile',
              linkLabel: 'Go to profile',
            },
          ].map(({ step, title, body, link, linkLabel }) => (
            <div
              key={step}
              className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition-colors hover:border-violet-300 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-violet-700"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white dark:bg-violet-500"
                aria-hidden
              >
                {step}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{body}</p>
                {link && linkLabel && (
                  <Link
                    to={link}
                    className="mt-2 inline-block text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
                  >
                    {linkLabel} →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-500">
        Need help? Check the summary and quick start above, or explore the app from the sidebar.
      </p>
    </div>
  )
}
