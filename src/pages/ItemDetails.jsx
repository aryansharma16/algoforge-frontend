import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useGetItemByIdQuery } from '../api/itemApi'
import {
  useGetSubmissionsQuery,
  useCreateSubmissionMutation,
} from '../api/submissionApi'
import { toast, apiErrorMessage } from '../utils/toast'
import SubmissionCodeEditor from '../components/SubmissionCodeEditor'
import {
  SOLVING_METHODS,
  SUBMISSION_LANGUAGES,
  COMPLEXITY_OPTIONS,
  SUBMISSION_RESULTS,
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
      className={`w-full rounded-lg border border-slate-600/80 bg-[#0d1117] px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/25 ${className}`}
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
  const [tagsInput, setTagsInput] = useState('')
  const [resultStatus, setResultStatus] = useState('unspecified')
  const [score, setScore] = useState('')
  const [durationSeconds, setDurationSeconds] = useState('')
  const [runtimeMs, setRuntimeMs] = useState('')
  const [memoryKb, setMemoryKb] = useState('')
  const [testCasesPassed, setTestCasesPassed] = useState('')
  const [testCasesTotal, setTestCasesTotal] = useState('')
  const [externalUrl, setExternalUrl] = useState('')
  const [isStarred, setIsStarred] = useState(false)

  function numOrUndef(v) {
    const n = Number(v)
    return v === '' || Number.isNaN(n) ? undefined : n
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    const body = {
      journeyId,
      itemId,
      solvingMethod,
      language: language.trim() || 'java',
      languageVersion: languageVersion.trim(),
      code,
      timeComplexity: timeComplexity.trim(),
      spaceComplexity: spaceComplexity.trim(),
      notes: notes.trim(),
      title: title.trim(),
      tags,
      resultStatus,
      externalUrl: externalUrl.trim(),
      isStarred,
    }
    const sc = numOrUndef(score)
    if (sc !== undefined) body.score = Math.min(100, Math.max(0, sc))
    const d = numOrUndef(durationSeconds)
    if (d !== undefined) body.durationSeconds = d
    const r = numOrUndef(runtimeMs)
    if (r !== undefined) body.runtimeMs = r
    const m = numOrUndef(memoryKb)
    if (m !== undefined) body.memoryKb = m
    const tp = numOrUndef(testCasesPassed)
    if (tp !== undefined) body.testCasesPassed = tp
    const tt = numOrUndef(testCasesTotal)
    if (tt !== undefined) body.testCasesTotal = tt

    try {
      await createSubmission(body).unwrap()
      setCode('')
      setNotes('')
      setTitle('')
      setTagsInput('')
      setTimeComplexity('')
      setSpaceComplexity('')
      setScore('')
      setDurationSeconds('')
      setRuntimeMs('')
      setMemoryKb('')
      setTestCasesPassed('')
      setTestCasesTotal('')
      setExternalUrl('')
      setResultStatus('unspecified')
      setIsStarred(false)
      toast.success('Submission saved')
    } catch (err) {
      toast.error('Could not save submission', {
        description: apiErrorMessage(err),
      })
    }
  }

  if (isLoading) return <p className="p-4 text-slate-400">Loading item…</p>
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
            : 'bg-slate-800 text-slate-400'
    return (
      <span className={`rounded px-2 py-0.5 text-[11px] font-medium ${cls}`}>
        {label}
      </span>
    )
  }

  return (
    <div className="flex w-full max-w-none flex-col">
      {/* Top bar — full width */}
      <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-[#0a0c10]/95 px-4 py-3 backdrop-blur-sm">
        <div className="min-w-0 flex-1">
          <Link
            to={`/journeys/${journeyId}`}
            className="text-xs text-violet-400 hover:underline"
          >
            ← Journey
          </Link>
          <h1 className="truncate text-xl font-semibold text-white">{item.title}</h1>
          {item.description && (
            <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
              {item.description}
            </p>
          )}
        </div>
        <Link
          to={`/journeys/${journeyId}/items/${itemId}/edit`}
          className="shrink-0 rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-1.5 text-sm text-slate-200 hover:border-violet-500/50"
        >
          Edit item
        </Link>
      </header>

      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        {/* Split: left details | right code — uses full main width */}
        <div className="grid min-h-[min(100dvh,920px)] w-full grid-cols-1 lg:grid-cols-[minmax(300px,400px)_1fr] lg:min-h-[calc(100dvh-7rem)]">
          {/* LEFT — metadata & outcome */}
          <aside className="scrollbar-themed flex flex-col gap-0 overflow-y-auto border-b border-slate-800 bg-[#0d1117] lg:border-b-0 lg:border-r lg:border-slate-800">
            <div className="space-y-5 p-4 pb-24">
              <div>
                <h2 className="text-sm font-semibold text-white">Log submission</h2>
                <p className="text-[11px] text-slate-500">
                  Left: details · Right: code · History below
                </p>
              </div>

              <div className="rounded-lg border border-slate-800/80 bg-[#16161e]/40 p-3">
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
                  <div>
                    <FieldLabel htmlFor="sub-tags" hint="comma-separated">
                      Tags
                    </FieldLabel>
                    <TextInput
                      id="sub-tags"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="hashmap, easy, retry"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-800/80 bg-[#16161e]/40 p-3">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  How you solved
                </p>
                <div className="space-y-3">
                  <div>
                    <FieldLabel htmlFor="sub-method">Method</FieldLabel>
                    <select
                      id="sub-method"
                      value={solvingMethod}
                      onChange={(e) => setSolvingMethod(e.target.value)}
                      className="select-ide w-full"
                    >
                      {SOLVING_METHODS.map((m) => (
                        <option key={m.id} value={m.id} className="bg-[#16161e]">
                          {m.label}
                        </option>
                      ))}
                    </select>
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
                      <FieldLabel htmlFor="sub-tc">Time</FieldLabel>
                      <select
                        id="sub-tc"
                        value={timeComplexity}
                        onChange={(e) => setTimeComplexity(e.target.value)}
                        className="select-ide w-full max-w-full text-[11px]"
                      >
                        {COMPLEXITY_OPTIONS.map((o) => (
                          <option key={o || 'e'} value={o} className="bg-[#16161e]">
                            {o || '—'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <FieldLabel htmlFor="sub-sc">Space</FieldLabel>
                      <select
                        id="sub-sc"
                        value={spaceComplexity}
                        onChange={(e) => setSpaceComplexity(e.target.value)}
                        className="select-ide w-full max-w-full text-[11px]"
                      >
                        {COMPLEXITY_OPTIONS.map((o) => (
                          <option key={`s-${o || 'e'}`} value={o} className="bg-[#16161e]">
                            {o || '—'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-800/80 bg-[#16161e]/40 p-3">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Outcome & metrics
                </p>
                <div className="space-y-3">
                  <div>
                    <FieldLabel htmlFor="sub-result">Result</FieldLabel>
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
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <FieldLabel htmlFor="sub-score">Score 0–100</FieldLabel>
                      <TextInput
                        id="sub-score"
                        type="number"
                        min={0}
                        max={100}
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        placeholder="—"
                      />
                    </div>
                    <div>
                      <FieldLabel htmlFor="sub-dur">Duration (s)</FieldLabel>
                      <TextInput
                        id="sub-dur"
                        type="number"
                        min={0}
                        value={durationSeconds}
                        onChange={(e) => setDurationSeconds(e.target.value)}
                        placeholder="—"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <FieldLabel htmlFor="sub-rt">Runtime (ms)</FieldLabel>
                      <TextInput
                        id="sub-rt"
                        type="number"
                        min={0}
                        value={runtimeMs}
                        onChange={(e) => setRuntimeMs(e.target.value)}
                        placeholder="—"
                      />
                    </div>
                    <div>
                      <FieldLabel htmlFor="sub-mem">Memory (KB)</FieldLabel>
                      <TextInput
                        id="sub-mem"
                        type="number"
                        min={0}
                        value={memoryKb}
                        onChange={(e) => setMemoryKb(e.target.value)}
                        placeholder="—"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <FieldLabel htmlFor="sub-tp">Tests passed</FieldLabel>
                      <TextInput
                        id="sub-tp"
                        type="number"
                        min={0}
                        value={testCasesPassed}
                        onChange={(e) => setTestCasesPassed(e.target.value)}
                        placeholder="—"
                      />
                    </div>
                    <div>
                      <FieldLabel htmlFor="sub-tt">Tests total</FieldLabel>
                      <TextInput
                        id="sub-tt"
                        type="number"
                        min={0}
                        value={testCasesTotal}
                        onChange={(e) => setTestCasesTotal(e.target.value)}
                        placeholder="—"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-800/80 bg-[#16161e]/40 p-3">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Notes & links
                </p>
                <div className="space-y-3">
                  <div>
                    <FieldLabel htmlFor="sub-notes">Notes</FieldLabel>
                    <textarea
                      id="sub-notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      className="scrollbar-themed w-full resize-y rounded-lg border border-slate-600/80 bg-[#0d1117] px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/25"
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
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={isStarred}
                      onChange={(e) => setIsStarred(e.target.checked)}
                      className="rounded border-slate-600 bg-[#0d1117] text-violet-600 focus:ring-violet-500"
                    />
                    Star this submission
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-gradient-to-b from-violet-600 to-violet-700 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 hover:from-violet-500 hover:to-violet-600 disabled:opacity-50"
              >
                {submitting ? 'Saving…' : 'Save submission'}
              </button>
            </div>
          </aside>

          {/* RIGHT — code (full height) */}
          <div className="flex min-h-[360px] min-w-0 flex-col bg-[#1a1b26] lg:min-h-0">
            <div className="flex h-11 shrink-0 flex-wrap items-center gap-2 border-b border-slate-700/90 bg-[#16161e] px-3">
              <span className="text-xs font-medium text-slate-400">Code</span>
              <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-violet-300">
                {langConfig.label}
              </span>
              <span className="ml-auto text-[10px] text-slate-600">
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

      {/* History — full width below split */}
      <section className="border-t border-slate-800 bg-[#0a0c10] px-4 py-8">
        <h2 className="mb-4 text-lg font-semibold text-white">Submission history</h2>
        {sLoading ? (
          <p className="text-slate-400">Loading submissions…</p>
        ) : subList.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-800 py-12 text-center text-slate-500">
            No submissions yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {subList.map((s) => (
              <li
                key={s._id}
                className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/50"
              >
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 bg-slate-900/70 px-3 py-2.5 text-xs">
                  {s.isStarred && (
                    <span className="text-amber-400" title="Starred">
                      ★
                    </span>
                  )}
                  {resultBadge(s.resultStatus)}
                  <span className="rounded bg-violet-950/50 px-2 py-0.5 font-medium text-violet-300">
                    {SOLVING_METHODS.find((m) => m.id === s.solvingMethod)
                      ?.label || s.solvingMethod?.replace(/_/g, ' ')}
                  </span>
                  <span className="text-slate-400">{s.language || 'java'}</span>
                  {s.title && (
                    <span className="max-w-[12rem] truncate font-medium text-slate-300">
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
                  <div className="flex flex-wrap gap-1 border-b border-slate-800/80 px-3 py-2">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400"
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
                  <div className="space-y-2 border-t border-slate-800/80 px-4 py-3 text-sm text-slate-400">
                    {s.notes && (
                      <p className="whitespace-pre-wrap">{s.notes}</p>
                    )}
                    {s.externalUrl && (
                      <a
                        href={s.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block truncate text-violet-400 hover:underline"
                      >
                        {s.externalUrl}
                      </a>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
