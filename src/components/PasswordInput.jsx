import { useState } from 'react'

/** SVG eye (visible) and eye-off (hidden) for password toggle */
function EyeIcon({ show }) {
  return show ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

/**
 * Reusable password field with visibility toggle.
 * Optional: showStrength (Register), confirm value + match error for "Confirm Password".
 */
export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder = '••••••••',
  autoComplete = 'current-password',
  showStrength = false,
  confirmValue,
  onConfirmChange,
  onConfirmBlur,
  confirmError,
  confirmLabel = 'Confirm password',
  confirmPlaceholder = '••••••••',
  disabled,
  required = true,
  minLength,
  'aria-describedby': ariaDescribedby,
  className = '',
  inputClassName = '',
}) {
  const [visible, setVisible] = useState(false)

  const inputId = id || `password-${label?.toLowerCase().replace(/\s/g, '-') || 'main'}`
  const confirmId = `${inputId}-confirm`

  return (
    <>
      <div className={`space-y-2 ${className}`.trim()}>
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-slate-600 dark:text-slate-400">
            {label}
            {required && <span className="text-red-500" aria-hidden="true"> *</span>}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={visible ? 'text' : 'password'}
            autoComplete={autoComplete}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            minLength={minLength}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : ariaDescribedby}
            className={`w-full rounded-lg border bg-white py-2.5 pl-3 pr-11 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 ${
              error
                ? 'border-red-500 dark:border-red-500'
                : 'border-slate-300 dark:border-slate-600'
            } ${inputClassName}`}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label={visible ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            <EyeIcon show={visible} />
          </button>
        </div>
        {showStrength && value && (
          <PasswordStrength value={value} id={`${inputId}-strength`} />
        )}
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-500 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>

      {confirmValue !== undefined && (
        <div className={`space-y-2 ${className}`.trim()}>
          <label htmlFor={confirmId} className="block text-xs font-medium text-slate-600 dark:text-slate-400">
            {confirmLabel}
            {required && <span className="text-red-500" aria-hidden="true"> *</span>}
          </label>
          <div className="relative">
            <input
              id={confirmId}
              type={visible ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirmValue}
              onChange={(e) => onConfirmChange?.(e.target.value)}
              onBlur={onConfirmBlur ?? onBlur}
              placeholder={confirmPlaceholder}
              disabled={disabled}
              required={required}
              aria-invalid={!!confirmError}
              aria-describedby={confirmError ? `${confirmId}-error` : undefined}
              className={`w-full rounded-lg border bg-white py-2.5 pl-3 pr-11 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 ${
                confirmError
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-slate-300 dark:border-slate-600'
              } ${inputClassName}`}
            />
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              aria-label={visible ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              <EyeIcon show={visible} />
            </button>
          </div>
          {confirmError && (
            <p id={`${confirmId}-error`} className="text-xs text-red-500 dark:text-red-400" role="alert">
              {confirmError}
            </p>
          )}
        </div>
      )}
    </>
  )
}

/** Returns { level: 0-4, label, color } for password strength */
export function getPasswordStrength(password) {
  if (!password) return { level: 0, label: '', color: '' }
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++
  const level = Math.min(4, score)
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', 'text-red-500', 'text-amber-500', 'text-lime-500', 'text-emerald-500']
  return { level, label: labels[level], color: colors[level] }
}

function PasswordStrength({ value, id }) {
  const { level, label, color } = getPasswordStrength(value)
  if (level === 0) return null
  return (
    <div id={id} className="flex items-center gap-2" aria-live="polite">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={`h-full rounded-full transition-all ${
            level === 1 ? 'bg-red-500' : level === 2 ? 'bg-amber-500' : level === 3 ? 'bg-lime-500' : 'bg-emerald-500'
          }`}
          style={{ width: `${(level / 4) * 100}%` }}
        />
      </div>
      <span className={`text-xs font-medium ${color}`}>{label}</span>
    </div>
  )
}
