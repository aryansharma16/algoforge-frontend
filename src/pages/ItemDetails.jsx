import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link, useParams } from 'react-router-dom'
import { useGetItemByIdQuery } from '../api/itemApi'
import {
  useGetSubmissionsQuery,
  useCreateSubmissionMutation,
} from '../api/submissionApi'
import { toast, apiErrorMessage } from '../utils/toast'
import SubmissionCodeEditor from '../components/SubmissionCodeEditor'
import MultiPickField from '../components/MultiPickField'
import { TAG_PRESETS } from '../data/itemPicklists'
import { STORAGE_KEYS } from '../utils/itemPicklistStorage'
import Spinner from '../components/Spinner'
import ItemDetailsSkeleton from '../components/skeletons/ItemDetailsSkeleton'
import {
  SOLVING_METHODS,
  SUBMISSION_LANGUAGES,
  COMPLEXITY_OPTIONS,
  SUBMISSION_RESULTS,
  SUBMISSION_FLAG_COLORS,
  SUBMISSION_FLAG_COLOR_OPTIONS,
  submissionFlagColorStyles,
  submissionFlagLeftBorder,
} from '../constants/submissionForm'

function FieldLabel({ children, htmlFor, hint }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-500"
    >
      {children}
      {hint && (
        <span className="ml-1 font-normal normal-case text-slate-600">{hint}</span>
      )}
    </label>
  )
}

function TextInput(props) {
  const { className = '', ...rest } = props
  return (
    <input
      className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/25 dark:border-slate-600/80 dark:bg-[#0d1117] dark:text-slate-200 dark:placeholder:text-slate-600 ${className}`}
      {...rest}
    />
  )
}

export default function ItemDetails() {
  const { journeyId, itemId } = useParams()
  const { data: item, isLoading, isError } = useGetItemByIdQuery({
    journeyId,
    itemId,
  })
  const { data: submissions, isLoading: sLoading } = useGetSubmissionsQuery({
    journeyId,
    itemId,
  })
  const [createSubmission, { isLoading: submitting }] =
    useCreateSubmissionMutation()

  const [solvingMethod, setSolvingMethod] = useState('self')
  const [language, setLanguage] = useState('java')
  const [languageVersion, setLanguageVersion] = useState('')
  const [code, setCode] = useState('')
  const [timeComplexity, setTimeComplexity] = useState('')
  const [spaceComplexity, setSpaceComplexity] = useState('')
  const [notes, setNotes] = useState('')
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState([])
  const [resultStatus, setResultStatus] = useState('unspecified')
  const [externalUrl, setExternalUrl] = useState('')
  const [isStarred, setIsStarred] = useState(false)
  const [flagColor, setFlagColor] = useState('none')
  const [notesFullscreen, setNotesFullscreen] = useState(false)
  const [justSaved, setJustSaved] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({
    method: '',
    timeComplexity: '',
    spaceComplexity: '',
  })

  useEffect(() => {
    if (!notesFullscreen) return
    const onKey = (e) => e.key === 'Escape' && setNotesFullscreen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [notesFullscreen])

  function resetForm() {
    setCode('')
    setNotes('')
    setTitle('')
    setTags([])
    setTimeComplexity('')
    setSpaceComplexity('')
    setExternalUrl('')
    setResultStatus('unspecified')
    setIsStarred(false)
    setFlagColor('none')
    setFieldErrors({ method: '', timeComplexity: '', spaceComplexity: '' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const method = (solvingMethod || '').trim()
    const tc = timeComplexity.trim()
    const sc = spaceComplexity.trim()
    const errors = {
      method: !method ? 'Please select how you solved.' : '',
      timeComplexity: !tc ? 'Time complexity is required.' : '',
      spaceComplexity: !sc ? 'Space complexity is required.' : '',
    }
    setFieldErrors(errors)
    if (errors.method || errors.timeComplexity || errors.spaceComplexity) {
      toast.error('Please fix the errors below.')
      return
    }

    const body = {
      journeyId,
      itemId,
      solvingMethod: method,
      language: language.trim() || 'java',
      languageVersion: languageVersion.trim(),
      code,
      timeComplexity: tc,
      spaceComplexity: sc,
      notes: notes.trim(),
      title: title.trim(),
      tags: Array.isArray(tags) ? tags : [],
      resultStatus,
      externalUrl: externalUrl.trim(),
      isStarred,
      flagColor: SUBMISSION_FLAG_COLOR_OPTIONS.some((o) => o.id === flagColor)
        ? flagColor
        : 'none',
    }

    try {
      await createSubmission(body).unwrap()
      resetForm()
      setJustSaved(true)
      toast.success('Submission saved')
    } catch (err) {
      toast.error('Could not save submission', {
        description: apiErrorMessage(err),
      })
    }
  }

  if (isLoading) return <ItemDetailsSkeleton />
  if (isError || !item) {
    return <p className="p-4 text-red-400">Item not found.</p>
  }

  const subList = Array.isArray(submissions) ? submissions : []
  const langConfig =
    SUBMISSION_LANGUAGES.find((l) => l.id === language) || SUBMISSION_LANGUAGES[0]

  function resolveHistoryLang(saved) {
    const id = String(saved || 'java').toLowerCase()
    return SUBMISSION_LANGUAGES.find((l) => l.id === id)?.prism || 'java'
  }

  const resultBadge = (status) => {
    const r = SUBMISSION_RESULTS.find((x) => x.id === status)
    const label = r?.label || status?.replace(/_/g, ' ') || '—'
    const cls =
      status === 'accepted'
        ? 'bg-emerald-950/60 text-emerald-300'
        : status === 'wrong_answer' || status === 'runtime_error'
          ? 'bg-red-950/50 text-red-300'
          : status === 'partial'
            ? 'bg-amber-950/50 text-amber-200'
            : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
    return (
      <span className={`rounded px-2 py-0.5 text-[11px] font-medium ${cls}`}>
        {label}
      </span>
    )
  }

  return (
    <div className="-mx-3 flex w-[calc(100%+1.5rem)] max-w-none flex-col xs:-mx-4 xs:w-[calc(100%+2rem)] sm:mx-0 sm:w-full">
      {/* Top bar — full width; stack on narrow phones */}
      <header className="sticky top-0 z-10 flex flex-col gap-3 border-b border-slate-200 bg-white/95 px-3 py-3 backdrop-blur-sm dark:border-slate-800 dark:bg-[#0a0c10]/95 xs:px-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <Link
            to={`/journeys/${journeyId}`}
            className="text-xs text-violet-600 hover:underline dark:text-violet-400"
          >
            ← Journey
          </Link>
          <h1 className="truncate text-xl font-semibold text-slate-900 dark:text-white">
            {item.title}
          </h1>
          {item.description && (
            <p className="mt-0.5 line-clamp-2 text-xs text-slate-600 dark:text-slate-500">
              {item.description}
            </p>
          )}
        </div>
        <Link
          to={`/journeys/${journeyId}/items/${itemId}/edit`}
          className="shrink-0 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm text-slate-800 hover:border-violet-500/50 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-200"
        >
          Edit item
        </Link>
      </header>

      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        {/* Split: left details | right code — uses full main width */}
        <div className="grid min-h-0 w-full grid-cols-1 gap-0 md:min-h-[min(88dvh,800px)] lg:min-h-[calc(100dvh-6rem)] lg:grid-cols-[minmax(280px,min(100%,380px))_1fr] xl:grid-cols-[minmax(300px,420px)_1fr]">
          {/* LEFT — metadata & outcome */}
          <aside className="scrollbar-themed max-h-[70dvh] overflow-y-auto border-b border-slate-200 bg-slate-50 sm:max-h-none lg:max-h-none lg:border-b-0 lg:border-r lg:border-slate-200 dark:border-slate-800 dark:bg-[#0d1117] dark:lg:border-slate-800">
            <div className="space-y-4 p-3 pb-20 xs:p-4 sm:space-y-5 sm:pb-24">
              {justSaved ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-12 text-center dark:border-slate-700 dark:bg-slate-900/50">
                  <p className="text-4xl font-medium text-emerald-600 dark:text-emerald-400" aria-hidden>
                    ✓
                  </p>
                  <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                    Thank you!
                  </h2>
                  <p className="mt-2 max-w-xs text-sm text-slate-600 dark:text-slate-400">
                    Your submission was saved. Add another below or check history.
                  </p>
                  <button
                    type="button"
                    onClick={() => setJustSaved(false)}
                    className="mt-6 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 hover:bg-violet-500"
                  >
                    Add another submission
                  </button>
                </div>
              ) : (
                <>
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Log submission
                </h2>
                <p className="text-[11px] text-slate-500">
                  Left: details · Right: code · History below
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800/80 dark:bg-[#16161e]/40">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Identity
                </p>
                <div className="space-y-3">
                  <div>
                    <FieldLabel htmlFor="sub-title">Title</FieldLabel>
                    <TextInput
                      id="sub-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. HashMap two-pass"
                      maxLength={200}
                    />
                  </div>
                  <MultiPickField
                    label="Tags"
                    presets={TAG_PRESETS}
                    storageKey={STORAGE_KEYS.tag}
                    value={tags}
                    onChange={setTags}
                    hint="Same chip picker as items. Search, pick, or add custom."
                    placeholder="Search or add tag…"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800/80 dark:bg-[#16161e]/40">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  How you solved
                </p>
                <div className="space-y-3">
                  <div>
                    <FieldLabel htmlFor="sub-method">Method</FieldLabel>
                    <select
                      id="sub-method"
                      value={solvingMethod}
                      onChange={(e) => {
                        setSolvingMethod(e.target.value)
                        setFieldErrors((prev) => ({ ...prev, method: '' }))
                      }}
                      className={`select-ide w-full ${fieldErrors.method ? 'border-red-500 ring-1 ring-red-500/50' : ''}`}
                    >
                      {SOLVING_METHODS.map((m) => (
                        <option key={m.id} value={m.id} className="bg-[#16161e]">
                          {m.label}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.method && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.method}</p>
                    )}
                  </div>
                  <div>
                    <FieldLabel htmlFor="sub-lang">Language</FieldLabel>
                    <select
                      id="sub-lang"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="select-ide w-full"
                    >
                      {SUBMISSION_LANGUAGES.map((l) => (
                        <option key={l.id} value={l.id} className="bg-[#16161e]">
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <FieldLabel htmlFor="sub-ver" hint="optional">
                      Language version
                    </FieldLabel>
                    <TextInput
                      id="sub-ver"
                      value={languageVersion}
                      onChange={(e) => setLanguageVersion(e.target.value)}
                      placeholder="17, ES2022, 3.11…"
                      maxLength={50}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <FieldLabel htmlFor="sub-tc">Time complexity</FieldLabel>
                      <select
                        id="sub-tc"
                        value={timeComplexity}
                        onChange={(e) => {
                          setTimeComplexity(e.target.value)
                          setFieldErrors((prev) => ({ ...prev, timeComplexity: '' }))
                        }}
                        className={`select-ide w-full max-w-full text-[11px] ${fieldErrors.timeComplexity ? 'border-red-500 ring-1 ring-red-500/50' : ''}`}
                      >
                        {COMPLEXITY_OPTIONS.map((o) => (
                          <option key={o || 'e'} value={o} className="bg-[#16161e]">
                            {o || '—'}
                          </option>
                        ))}
                      </select>
                      {fieldErrors.timeComplexity && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.timeComplexity}</p>
                      )}
                    </div>
                    <div>
                      <FieldLabel htmlFor="sub-sc">Space complexity</FieldLabel>
                      <select
                        id="sub-sc"
                        value={spaceComplexity}
                        onChange={(e) => {
                          setSpaceComplexity(e.target.value)
                          setFieldErrors((prev) => ({ ...prev, spaceComplexity: '' }))
                        }}
                        className={`select-ide w-full max-w-full text-[11px] ${fieldErrors.spaceComplexity ? 'border-red-500 ring-1 ring-red-500/50' : ''}`}
                      >
                        {COMPLEXITY_OPTIONS.map((o) => (
                          <option key={`s-${o || 'e'}`} value={o} className="bg-[#16161e]">
                            {o || '—'}
                          </option>
                        ))}
                      </select>
                      {fieldErrors.spaceComplexity && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.spaceComplexity}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800/80 dark:bg-[#16161e]/40">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Result
                </p>
                <FieldLabel htmlFor="sub-result">How it went</FieldLabel>
                <select
                  id="sub-result"
                  value={resultStatus}
                  onChange={(e) => setResultStatus(e.target.value)}
                  className="select-ide w-full"
                >
                  {SUBMISSION_RESULTS.map((r) => (
                    <option key={r.id} value={r.id} className="bg-[#16161e]">
                      {r.label}
                    </option>
                  ))}
                </select>
                <div className="mt-4 border-t border-slate-200 pt-3 dark:border-slate-800/80">
                  <FieldLabel htmlFor="sub-flag">Flag color</FieldLabel>
                  <p className="mb-2 text-[10px] text-slate-600">
                    Highlights this submission in history (badge + card edge).
                  </p>
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {SUBMISSION_FLAG_COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        title={c.label}
                        onClick={() => setFlagColor(c.id)}
                        className={`rounded-lg px-2 py-1 text-[10px] font-medium ring-1 transition ${
                          flagColor === c.id
                            ? `${submissionFlagColorStyles(c.id)} ring-2 ring-white/30`
                            : `${submissionFlagColorStyles(c.id)} opacity-70 hover:opacity-100`
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                  <select
                    id="sub-flag"
                    value={flagColor}
                    onChange={(e) => setFlagColor(e.target.value)}
                    className="select-ide w-full"
                  >
                    {SUBMISSION_FLAG_COLOR_OPTIONS.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#16161e]">
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800/80 dark:bg-[#16161e]/40">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Notes & links
                </p>
                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <FieldLabel htmlFor="sub-notes">Notes</FieldLabel>
                      <button
                        type="button"
                        onClick={() => setNotesFullscreen(true)}
                        className="shrink-0 rounded-md border border-slate-300 bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:border-violet-500/50 hover:text-violet-800 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:text-white"
                        title="Fullscreen notes (Esc to close)"
                      >
                        ⛶ Full screen
                      </button>
                    </div>
                    <textarea
                      id="sub-notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      className="scrollbar-themed w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/25 dark:border-slate-600/80 dark:bg-[#0d1117] dark:text-slate-200 dark:placeholder:text-slate-600"
                      placeholder="Approach, bugs, what to retry…"
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="sub-url">External URL</FieldLabel>
                    <TextInput
                      id="sub-url"
                      type="url"
                      value={externalUrl}
                      onChange={(e) => setExternalUrl(e.target.value)}
                      placeholder="https://…"
                    />
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-800 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={isStarred}
                      onChange={(e) => setIsStarred(e.target.checked)}
                      className="rounded border-slate-400 bg-white text-violet-600 focus:ring-violet-500 dark:border-slate-600 dark:bg-[#0d1117]"
                    />
                    Star this submission
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-violet-600 to-violet-700 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 hover:from-violet-500 hover:to-violet-600 disabled:opacity-50"
              >
                {submitting && <Spinner size="sm" className="shrink-0" />}
                {submitting ? 'Saving…' : 'Save submission'}
              </button>
                </>
              )}
            </div>
          </aside>

          {/* RIGHT — code (full height) */}
          <div className="flex min-h-[360px] min-w-0 flex-col border-t border-slate-200 bg-slate-100 dark:border-t-0 dark:bg-[#1a1b26] lg:min-h-0 lg:border-t-0">
            <div className="flex h-11 shrink-0 flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-3 dark:border-slate-700/90 dark:bg-[#16161e]">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Code</span>
              <span className="rounded bg-slate-200 px-2 py-0.5 font-mono text-[11px] text-violet-800 dark:bg-slate-800 dark:text-violet-300">
                {langConfig.label}
              </span>
              <span className="ml-auto text-[10px] text-slate-500 dark:text-slate-600">
                Syntax highlight · pre wrap off
              </span>
            </div>
            <div className="min-h-0 flex-1 p-0">
              <SubmissionCodeEditor
                fillHeight
                value={code}
                onChange={setCode}
                languageId={
                  langConfig.prism === 'plaintext' ? 'text' : langConfig.prism
                }
                minHeight={320}
                placeholder={`// ${langConfig.label} solution\n`}
                languageLabel={`Code · ${langConfig.label}`}
              />
            </div>
          </div>
        </div>
      </form>

      {notesFullscreen &&
        createPortal(
          <div className="fixed inset-0 z-[200] flex flex-col bg-white dark:bg-[#0d1117]">
            <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-4 dark:border-slate-700 dark:bg-[#16161e]">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Notes · fullscreen
              </span>
              <button
                type="button"
                onClick={() => setNotesFullscreen(false)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-sm text-slate-800 hover:bg-slate-50 dark:border-0 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Done <kbd className="ml-1 text-slate-500">Esc</kbd>
              </button>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              autoFocus
              className="scrollbar-themed min-h-0 flex-1 resize-none border-0 bg-white p-6 text-base leading-relaxed text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-0 dark:bg-[#0d1117] dark:text-slate-200 dark:placeholder:text-slate-600"
              placeholder="Approach, bugs, what to retry…"
            />
          </div>,
          document.body
        )}

      {/* History — full width below split */}
      <section className="mt-2 border-t border-slate-200 bg-slate-50 px-3 py-6 dark:border-slate-800 dark:bg-[#0a0c10] xs:px-4 sm:py-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          Submission history
        </h2>
        {sLoading ? (
          <p className="text-slate-600 dark:text-slate-400">Loading submissions…</p>
        ) : subList.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 py-12 text-center text-slate-600 dark:border-slate-800 dark:text-slate-500">
            No submissions yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {subList.map((s) => {
              const fc = SUBMISSION_FLAG_COLORS.includes(s.flagColor)
                ? s.flagColor
                : 'none'
              const borderL = submissionFlagLeftBorder(fc)
              return (
              <li
                key={s._id}
                className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/50 ${
                  fc === 'none' ? '' : `border-l-4 ${borderL}`
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2.5 text-xs dark:border-slate-800 dark:bg-slate-900/70">
                  {s.isStarred && (
                    <span className="text-amber-400" title="Starred">
                      ★
                    </span>
                  )}
                  {fc && fc !== 'none' && (
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 ${submissionFlagColorStyles(fc)}`}
                      title="Flag color"
                    >
                      {SUBMISSION_FLAG_COLOR_OPTIONS.find((o) => o.id === fc)?.label || fc}
                    </span>
                  )}
                  {resultBadge(s.resultStatus)}
                  <span className="rounded bg-violet-100 px-2 py-0.5 font-medium text-violet-800 dark:bg-violet-950/50 dark:text-violet-300">
                    {SOLVING_METHODS.find((m) => m.id === s.solvingMethod)
                      ?.label || s.solvingMethod?.replace(/_/g, ' ')}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">{s.language || 'java'}</span>
                  {s.title && (
                    <span className="max-w-[12rem] truncate font-medium text-slate-800 dark:text-slate-300">
                      {s.title}
                    </span>
                  )}
                  {s.score != null && (
                    <span className="text-slate-500">Score {s.score}</span>
                  )}
                  {s.timeComplexity && (
                    <span className="text-slate-500">T {s.timeComplexity}</span>
                  )}
                  {s.spaceComplexity && (
                    <span className="text-slate-500">S {s.spaceComplexity}</span>
                  )}
                  {(s.testCasesTotal > 0 || s.testCasesPassed > 0) && (
                    <span className="text-slate-500">
                      Tests {s.testCasesPassed ?? 0}/{s.testCasesTotal ?? 0}
                    </span>
                  )}
                  <span className="ml-auto shrink-0 text-slate-600">
                    #{s.attemptNumber}{' '}
                    {s.createdAt ? new Date(s.createdAt).toLocaleString() : ''}
                  </span>
                </div>
                {Array.isArray(s.tags) && s.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 border-b border-slate-200 px-3 py-2 dark:border-slate-800/80">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {s.code && (
                  <div className="p-2">
                    <SubmissionCodeEditor
                      value={s.code}
                      onChange={() => {}}
                      languageId={resolveHistoryLang(s.language)}
                      readOnly
                      minHeight={140}
                    />
                  </div>
                )}
                {(s.notes || s.externalUrl) && (
                  <div className="space-y-2 border-t border-slate-200 px-4 py-3 text-sm text-slate-700 dark:border-slate-800/80 dark:text-slate-400">
                    {s.notes && (
                      <p className="whitespace-pre-wrap">{s.notes}</p>
                    )}
                    {s.externalUrl && (
                      <a
                        href={s.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block truncate text-violet-600 hover:underline dark:text-violet-400"
                      >
                        {s.externalUrl}
                      </a>
                    )}
                  </div>
                )}
              </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
