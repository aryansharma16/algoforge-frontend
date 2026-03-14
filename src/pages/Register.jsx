import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/authSlice'
import { useRegisterUserMutation } from '../api/authApi'
import { toast, apiErrorMessage } from '../utils/toast'
import {
  validateEmail,
  validateUsername,
  validatePassword,
  validateConfirmPassword,
} from '../utils/authValidation'
import PasswordInput from '../components/PasswordInput'

const MIN_PASSWORD_LENGTH = 8

export default function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [registerUser, { isLoading, error }] = useRegisterUserMutation()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  })
  const [submitError, setSubmitError] = useState('')

  const usernameError = touched.username ? validateUsername(username) : ''
  const emailError = touched.email ? validateEmail(email) : ''
  const passwordError = touched.password ? validatePassword(password, MIN_PASSWORD_LENGTH) : ''
  const confirmError = touched.confirmPassword
    ? validateConfirmPassword(password, confirmPassword)
    : ''

  async function handleSubmit(e) {
    e.preventDefault()
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    })
    setSubmitError('')

    const uErr = validateUsername(username)
    const eErr = validateEmail(email)
    const pErr = validatePassword(password, MIN_PASSWORD_LENGTH)
    const cErr = validateConfirmPassword(password, confirmPassword)
    if (uErr || eErr || pErr || cErr) return

    try {
      const data = await registerUser({
        username: username.trim(),
        email: email.trim(),
        password,
      }).unwrap()
      dispatch(setCredentials({ token: data.token, user: data.user }))
      toast.success('Account created')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const msg = apiErrorMessage(err, 'Registration failed')
      setSubmitError(msg)
      toast.error('Registration failed', { description: msg })
    }
  }

  return (
    <>
      <h2 className="mb-2 text-xl font-bold tracking-tight text-slate-800 dark:text-slate-200 sm:text-2xl">
        Create an Account
      </h2>
      <p className="mb-6 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        Join now to streamline your experience from day one.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="space-y-2">
          <label htmlFor="register-username" className="block text-xs font-medium text-slate-600 dark:text-slate-400">
            Username <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" aria-hidden>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              id="register-username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, username: true }))}
              required
              aria-invalid={!!usernameError}
              aria-describedby={usernameError ? 'register-username-error' : undefined}
              className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 ${
                usernameError ? 'border-red-500 dark:border-red-500' : 'border-slate-300 dark:border-slate-600'
              }`}
              placeholder="johndoe"
            />
          </div>
          {usernameError && (
            <p id="register-username-error" className="text-xs text-red-500 dark:text-red-400" role="alert">
              {usernameError}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="register-email" className="block text-xs font-medium text-slate-600 dark:text-slate-400">
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
              id="register-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              required
              aria-invalid={!!emailError}
              aria-describedby={emailError ? 'register-email-error' : undefined}
              className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 ${
                emailError ? 'border-red-500 dark:border-red-500' : 'border-slate-300 dark:border-slate-600'
              }`}
              placeholder="you@example.com"
            />
          </div>
          {emailError && (
            <p id="register-email-error" className="text-xs text-red-500 dark:text-red-400" role="alert">
              {emailError}
            </p>
          )}
        </div>

        <PasswordInput
          id="register-password"
          label="Password"
          value={password}
          onChange={setPassword}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          onConfirmBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
          error={passwordError}
          showStrength
          minLength={MIN_PASSWORD_LENGTH}
          confirmValue={confirmPassword}
          onConfirmChange={setConfirmPassword}
          confirmError={confirmError}
          confirmLabel="Confirm password"
          required
        />

        {(submitError || error?.data?.message) && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300" role="alert">
            {submitError || error?.data?.message || 'Registration failed'}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-1 w-full rounded-lg bg-violet-600 py-2.5 font-semibold text-white transition hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-slate-900"
        >
          {isLoading ? 'Creating account…' : 'Register'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-violet-600 hover:underline dark:text-violet-400">
          Sign In
        </Link>
      </p>
    </>
  )
}
