/**
 * App mark — same asset as /favicon.svg (tab icon + sidebar + mobile header).
 * Loaded as <img> so complex SVG filters/ids stay single-instance.
 */
export function AppLogoMark({ size = 36, className = '' }) {
  const w = size
  const h = Math.round((size * 46) / 48)
  return (
    <img
      src="/favicon.svg"
      alt=""
      width={w}
      height={h}
      className={`block shrink-0 object-contain ${className}`}
      draggable={false}
      aria-hidden
    />
  )
}

export default function AppLogo({ size = 36, showWordmark = false, className = '' }) {
  if (!showWordmark) {
    return <AppLogoMark size={size} className={className} />
  }
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <AppLogoMark size={size} />
      <span className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-lg font-bold tracking-tight text-transparent">
        AlgoForge
      </span>
    </div>
  )
}
