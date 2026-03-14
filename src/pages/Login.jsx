import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/authSlice'
import { useLoginUserMutation } from '../api/authApi'
import { toast, apiErrorMessage } from '../utils/toast'
import { validateEmail } from '../utils/authValidation'
import PasswordInput from '../components/PasswordInput'
import Spinner from '../components/Spinner'

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loginUser, { isLoading, error }] = useLoginUserMutation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState({ email: false, password: false })
  const [submitError, setSubmitError] = useState('')

  const emailError = touched.email ? validateEmail(email) : ''
  const passwordError = touched.password ? (!password ? 'Password is required' : '') : ''

  async function handleSubmit(e) {
    e.preventDefault()
    setTouched({ email: true, password: true })
    setSubmitError('')

    const eErr = validateEmail(email)
    const pErr = !password ? 'Password is required' : ''
    if (eErr || pErr) return

    try {
      const data = await loginUser({ email: email.trim(), password }).unwrap()
      dispatch(setCredentials({ token: data.token, user: data.user }))
      toast.success('Signed in')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const msg = apiErrorMessage(err, 'Sign in failed')
      setSubmitError(msg)
      toast.error('Sign in failed', { description: msg })
    }
  }

  return (
    <>
      <h2 className="mb-2 text-xl font-bold tracking-tight text-slate-800 dark:text-slate-200 sm:text-2xl">
        Welcome Back
      </h2>
      <p className="mb-6 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        Enter your email and password to access your account.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="space-y-2">
          <label htmlFor="login-email" className="block text-xs font-medium text-slate-600 dark:text-slate-400">
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" aria-hidden>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              required
              aria-invalid={!!emailError}
              aria-describedby={emailError ? 'login-email-error' : undefined}
              className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 ${
                emailError ? 'border-red-500 dark:border-red-500' : 'border-slate-300 dark:border-slate-600'
              }`}
              placeholder="you@example.com"
            />
          </div>
          {emailError && (
            <p id="login-email-error" className="text-xs text-red-500 dark:text-red-400" role="alert">
              {emailError}
            </p>
          )}
        </div>

        <PasswordInput
          id="login-password"
          label="Password"
          value={password}
          onChange={setPassword}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          error={passwordError}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />

        {(submitError || error?.data?.message) && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300" role="alert">
            {submitError || error?.data?.message || 'Sign in failed'}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 py-2.5 font-semibold text-white transition hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-slate-900"
        >
          {isLoading && <Spinner size="sm" className="shrink-0" />}
          {isLoading ? 'Signing in…' : 'Log In'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-semibold text-violet-600 hover:underline dark:text-violet-400">
          Register Now
        </Link>
      </p>
    </>
  )
}
