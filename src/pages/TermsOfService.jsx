import { Link } from 'react-router-dom'

export default function TermsOfService() {
  return (
    <div className="min-h-[100dvh] bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link
            to="/login"
            className="text-sm text-violet-600 hover:underline dark:text-violet-400"
          >
            ← Back to Sign in
          </Link>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            AlgoForge
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Last updated: {new Date().toLocaleDateString('en-US')}
        </p>
        <div className="mt-8 space-y-4 text-sm text-slate-700 dark:text-slate-300">
          <p>
            By using AlgoForge you agree to these terms. The service is provided for personal learning and preparation. You are responsible for keeping your account credentials secure and for the content you create (journeys, items, submissions). Do not use the service for any illegal or abusive purpose. We may update these terms from time to time; continued use after changes constitutes acceptance.
          </p>
          <p>
            The service is provided &quot;as is&quot;. We are not liable for any indirect or consequential damages arising from your use of the service.
          </p>
          <p>
            <Link to="/privacy-policy" className="font-medium text-violet-600 hover:underline dark:text-violet-400">
              Privacy Policy
            </Link>
          </p>
        </div>
        <p className="mt-10">
          <Link to="/login" className="text-sm font-medium text-violet-600 hover:underline dark:text-violet-400">
            ← Back to Sign in
          </Link>
        </p>
      </main>
    </div>
  )
}
