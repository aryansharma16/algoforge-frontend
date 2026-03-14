import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/authSlice'
import { useLoginUserMutation } from '../api/authApi'
import { toast, apiErrorMessage } from '../utils/toast'

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loginUser, { isLoading, error }] = useLoginUserMutation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const data = await loginUser({ email, password }).unwrap()
      dispatch(setCredentials({ token: data.token, user: data.user }))
      toast.success('Signed in')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error('Sign in failed', { description: apiErrorMessage(err) })
    }
  }

  return (
    <>
      <h2 className="mb-4 text-lg font-medium text-slate-800 dark:text-slate-200">
        Sign in
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-xs text-slate-600 dark:text-slate-500">
            Email
          </label>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-600 dark:text-slate-500">
            Password
          </label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>
        {error && (
          <p className="text-sm text-red-400">
            {error.data?.message || 'Login failed'}
          </p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-violet-600 py-2 font-medium text-white hover:bg-violet-500 disabled:opacity-50"
        >
          {isLoading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        No account?{' '}
        <Link to="/register" className="text-violet-400 hover:underline">
          Register
        </Link>
      </p>
    </>
  )
}
