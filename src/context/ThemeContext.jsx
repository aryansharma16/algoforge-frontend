import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const STORAGE_KEY = 'algoforge-theme'

/** @typedef {'dark' | 'light' | 'system'} ThemePreference */
const ThemeContext = createContext(null)

function getSystemDark() {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function resolve(pref) {
  if (pref === 'system') return getSystemDark() ? 'dark' : 'light'
  return pref
}

export function ThemeProvider({ children }) {
  const [preference, setPreferenceState] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY)
      if (s === 'light' || s === 'dark' || s === 'system') return s
    } catch {
      /* ignore */
    }
    return 'system'
  })

  const [resolved, setResolved] = useState(() => resolve(preference))

  const applyDom = useCallback((mode) => {
    const root = document.documentElement
    root.classList.remove('dark', 'light')
    if (mode === 'dark') root.classList.add('dark')
    else root.classList.add('light')
    root.style.colorScheme = mode === 'dark' ? 'dark' : 'light'
  }, [])

  useEffect(() => {
    const next = resolve(preference)
    setResolved(next)
    applyDom(next)
  }, [preference, applyDom])

  useEffect(() => {
    if (preference !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      const next = resolve('system')
      setResolved(next)
      applyDom(next)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [preference, applyDom])

  const setPreference = useCallback((pref) => {
    if (pref !== 'light' && pref !== 'dark' && pref !== 'system') return
    try {
      localStorage.setItem(STORAGE_KEY, pref)
    } catch {
      /* ignore */
    }
    setPreferenceState(pref)
  }, [])

  const value = useMemo(
    () => ({
      preference,
      setPreference,
      resolved: resolved,
      isDark: resolved === 'dark',
    }),
    [preference, setPreference, resolved]
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme outside ThemeProvider')
  return ctx
}
