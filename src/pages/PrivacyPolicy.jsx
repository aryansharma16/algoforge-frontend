import { Link } from 'react-router-dom'

export default function PrivacyPolicy() {
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
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Last updated: {new Date().toLocaleDateString('en-US')}
        </p>
        <div className="prose prose-slate mt-8 dark:prose-invert max-w-none">
          <section className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
            <p>
              AlgoForge (&quot;we&quot;, &quot;our&quot;) respects your privacy. This policy describes how we collect, use, and protect your information when you use our learning-tracker application.
            </p>
            <h2 className="mt-6 text-base font-semibold text-slate-900 dark:text-white">
              Information we collect
            </h2>
            <p>
              We collect information you provide when you register and use the app: account details (email, username, password), profile data (name, bio, location, work, education, skills, social links), and learning data (journeys, items, submissions including code and notes). We may also collect usage and device information to improve the service.
            </p>
            <h2 className="mt-6 text-base font-semibold text-slate-900 dark:text-white">
              How we use it
            </h2>
            <p>
              We use your data to operate the service, personalize your experience, and communicate with you. We do not sell your personal information to third parties.
            </p>
            <h2 className="mt-6 text-base font-semibold text-slate-900 dark:text-white">
              Data security
            </h2>
            <p>
              We use industry-standard measures to protect your data. Passwords are stored in hashed form. Access to your data is restricted to what is necessary to run the service.
            </p>
            <h2 className="mt-6 text-base font-semibold text-slate-900 dark:text-white">
              Contact
            </h2>
            <p>
              For privacy-related questions, contact us through the channels provided in the app or on our website.
            </p>
          </section>
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
