import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-kotlin'
import 'prismjs/components/prism-swift'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-sql'
import 'prismjs/themes/prism-tomorrow.min.css'

const GRAMMAR = {
  java: languages.java,
  javascript: languages.javascript,
  typescript: languages.typescript,
  python: languages.python,
  cpp: languages.cpp,
  c: languages.c,
  csharp: languages.csharp,
  go: languages.go,
  rust: languages.rust,
  kotlin: languages.kotlin,
  swift: languages.swift,
  ruby: languages.ruby,
  php: languages.php,
  sql: languages.sql,
  text: null,
}

const FONT =
  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace'
const LINE_HEIGHT = 1.65
const FONT_SIZE = 13
const PAD = 14
const GUTTER_W = 44

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function EditorBody({
  value,
  onChange,
  languageId,
  grammar,
  highlighted,
  readOnly,
  minHeight,
  placeholder,
  showGutter = true,
}) {
  const taRef = useRef(null)
  const preRef = useRef(null)
  const gutterRef = useRef(null)
  const lineCount = Math.max(1, (value || '').split('\n').length)
  const gutterText = Array.from({ length: lineCount }, (_, i) => i + 1).join(
    '\n'
  )

  const onScroll = useCallback(() => {
    const ta = taRef.current
    const pre = preRef.current
    const g = gutterRef.current
    if (ta && pre) {
      pre.scrollTop = ta.scrollTop
      pre.scrollLeft = ta.scrollLeft
    }
    if (ta && g) g.scrollTop = ta.scrollTop
  }, [])

  const onPreScrollReadOnly = useCallback(() => {
    const pre = preRef.current
    const g = gutterRef.current
    if (pre && g) g.scrollTop = pre.scrollTop
  }, [])

  const langClass =
    grammar && languageId !== 'text'
      ? `language-${languageId}`
      : 'language-text'

  const editorBlock = (
    <div
      className="flex min-h-0 flex-1 overflow-hidden rounded-b-lg bg-[#1a1b26]"
      style={{
        minHeight:
          minHeight === undefined
            ? undefined
            : typeof minHeight === 'number'
              ? minHeight
              : minHeight,
        flex: typeof minHeight === 'string' && minHeight === '100%' ? 1 : undefined,
      }}
    >
      {showGutter && !readOnly && (
        <div
          ref={gutterRef}
          className="scrollbar-themed shrink-0 overflow-hidden border-r border-slate-700/80 bg-[#16161e] py-3 text-right text-slate-500 tabular-nums"
          style={{
            width: GUTTER_W,
            paddingTop: PAD,
            paddingRight: 10,
            fontFamily: FONT,
            fontSize: FONT_SIZE,
            lineHeight: LINE_HEIGHT,
            whiteSpace: 'pre',
          }}
        >
          {gutterText}
        </div>
      )}
      {showGutter && readOnly && (
        <div
          ref={gutterRef}
          className="scrollbar-themed shrink-0 overflow-hidden border-r border-slate-700/80 bg-[#16161e] py-3 text-right text-slate-500 tabular-nums"
          style={{
            width: GUTTER_W,
            paddingTop: PAD,
            paddingRight: 10,
            fontFamily: FONT,
            fontSize: FONT_SIZE,
            lineHeight: LINE_HEIGHT,
            whiteSpace: 'pre',
          }}
        >
          {gutterText}
        </div>
      )}
      <div className="relative min-h-0 min-w-0 flex-1" style={{ minHeight }}>
        {grammar ? (
          <pre
            ref={preRef}
            aria-hidden={!readOnly}
            onScroll={readOnly ? onPreScrollReadOnly : undefined}
            className={`scrollbar-themed submission-prism absolute inset-0 m-0 overflow-auto whitespace-pre p-0 ${langClass} ${
              readOnly ? 'text-left' : 'pointer-events-none'
            }`}
            style={{
              fontFamily: FONT,
              fontSize: FONT_SIZE,
              lineHeight: LINE_HEIGHT,
              padding: PAD,
              paddingLeft: showGutter ? PAD : PAD,
              background: 'transparent',
              color: '#c9d1d9',
            }}
            dangerouslySetInnerHTML={{
              __html:
                highlighted + (value?.endsWith('\n') && !readOnly ? ' ' : ''),
            }}
          />
        ) : (
          <pre
            ref={readOnly ? preRef : undefined}
            onScroll={readOnly ? onPreScrollReadOnly : undefined}
            className={`scrollbar-themed absolute inset-0 m-0 overflow-auto whitespace-pre p-0 text-slate-300 ${
              readOnly ? '' : 'pointer-events-none'
            }`}
            style={{
              fontFamily: FONT,
              fontSize: FONT_SIZE,
              padding: PAD,
              lineHeight: LINE_HEIGHT,
            }}
          >
            {value || ''}
          </pre>
        )}
        {!readOnly && (
          <textarea
            ref={taRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onScroll={onScroll}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            placeholder={placeholder}
            className={`scrollbar-themed absolute inset-0 m-0 min-h-full w-full resize-none border-0 bg-transparent p-0 outline-none ${
              grammar
                ? 'text-transparent caret-[#58a6ff] selection:bg-violet-500/20'
                : 'text-slate-300 caret-[#58a6ff]'
            } placeholder:text-slate-600`}
            style={{
              fontFamily: FONT,
              fontSize: FONT_SIZE,
              lineHeight: LINE_HEIGHT,
              padding: PAD,
              tabSize: 4,
              /* One visual row per \\n — same as gutter & Prism layer (no soft-wrap scatter) */
              whiteSpace: 'pre',
              overflowWrap: 'normal',
              overflowX: 'auto',
            }}
          />
        )}
      </div>
    </div>
  )

  if (readOnly) {
    return (
      <div
        className="overflow-hidden rounded-lg border border-slate-700/90 ring-1 ring-black/20"
        style={{ minHeight }}
      >
        {editorBlock}
      </div>
    )
  }
  return editorBlock
}

export default function SubmissionCodeEditor({
  value,
  onChange,
  languageId = 'java',
  readOnly = false,
  minHeight = 280,
  placeholder = '// Your solution…',
  languageLabel = 'Code',
  toolbarRight = null,
  /** Fill parent height (split-pane code column) */
  fillHeight = false,
}) {
  const [fullscreen, setFullscreen] = useState(false)
  const grammar = GRAMMAR[languageId] || GRAMMAR.java

  const highlighted = useMemo(() => {
    if (!grammar) return escapeHtml(value || '')
    try {
      return highlight(value || '', grammar, languageId)
    } catch {
      return escapeHtml(value || '')
    }
  }, [value, grammar, languageId])

  useEffect(() => {
    if (!fullscreen) return
    const onKey = (e) => e.key === 'Escape' && setFullscreen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [fullscreen])

  const header = (
    <div className="flex h-11 shrink-0 items-center gap-3 border-b border-slate-700/90 bg-[#16161e] px-3">
      <span className="text-xs font-medium text-slate-400">{languageLabel}</span>
      <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-violet-300">
        {languageId}
      </span>
      <div className="ml-auto flex items-center gap-2">
        {toolbarRight}
        {!readOnly && (
          <button
            type="button"
            onClick={() => setFullscreen(true)}
            className="rounded-md border border-slate-600 bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300 hover:border-violet-500/50 hover:text-white"
            title="Fullscreen (Esc to exit)"
          >
            ⛶ Full screen
          </button>
        )}
      </div>
    </div>
  )

  const shell = (tall) => (
    <div
      className={`flex min-h-0 flex-col overflow-hidden bg-[#1a1b26] shadow-xl ring-1 ring-black/30 ${
        tall || fillHeight
          ? 'h-full rounded-none border-0 shadow-none ring-0'
          : 'rounded-xl border border-slate-700/90'
      }`}
      style={
        tall || fillHeight ? { height: '100%', minHeight: 0 } : { minHeight }
      }
    >
      {header}
      <EditorBody
        value={value}
        onChange={onChange}
        languageId={languageId}
        grammar={grammar}
        highlighted={highlighted}
        readOnly={readOnly}
        minHeight={
          tall || fillHeight ? '100%' : minHeight - 44
        }
        placeholder={placeholder}
        showGutter
      />
    </div>
  )

  if (readOnly) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-700/90">
        <div className="flex h-9 items-center border-b border-slate-700/80 bg-[#16161e] px-3">
          <span className="text-[11px] text-slate-500">{languageLabel}</span>
        </div>
        <EditorBody
          value={value}
          onChange={() => {}}
          languageId={languageId}
          grammar={grammar}
          highlighted={highlighted}
          readOnly
          minHeight={minHeight}
          placeholder=""
          showGutter
        />
      </div>
    )
  }

  if (fillHeight) {
    return (
      <>
        {shell(true)}
        {fullscreen &&
          createPortal(
            <div className="fixed inset-0 z-[200] flex flex-col bg-[#0d1117]">
              <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-700 bg-[#16161e] px-4">
                <span className="text-sm font-medium text-slate-200">
                  {languageLabel} · fullscreen
                </span>
                <button
                  type="button"
                  onClick={() => setFullscreen(false)}
                  className="rounded-lg bg-slate-800 px-4 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
                >
                  Exit <kbd className="ml-1 text-slate-500">Esc</kbd>
                </button>
              </div>
              <div className="min-h-0 flex-1 p-2 sm:p-4">
                <div className="mx-auto flex h-full max-w-[1400px] flex-col overflow-hidden rounded-xl border border-slate-700 bg-[#1a1b26]">
                  <div className="flex h-11 shrink-0 items-center gap-2 border-b border-slate-700/90 bg-[#16161e] px-3">
                    <span className="font-mono text-[11px] text-violet-300">
                      {languageId}
                    </span>
                    <span className="text-xs text-slate-500">· focused edit</span>
                  </div>
                  <div className="flex min-h-0 flex-1 flex-col">
                    <EditorBody
                      value={value}
                      onChange={onChange}
                      languageId={languageId}
                      grammar={grammar}
                      highlighted={highlighted}
                      readOnly={false}
                      minHeight="100%"
                      placeholder={placeholder}
                      showGutter
                    />
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}
      </>
    )
  }

  return (
    <>
      {shell(false)}
      {fullscreen &&
        createPortal(
          <div className="fixed inset-0 z-[200] flex flex-col bg-[#0d1117]">
            <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-700 bg-[#16161e] px-4">
              <span className="text-sm font-medium text-slate-200">
                {languageLabel} · fullscreen
              </span>
              <button
                type="button"
                onClick={() => setFullscreen(false)}
                className="rounded-lg bg-slate-800 px-4 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
              >
                Exit full screen <kbd className="ml-1 text-slate-500">Esc</kbd>
              </button>
            </div>
            <div className="min-h-0 flex-1 p-2 sm:p-4">
              <div className="mx-auto flex h-full max-w-[1400px] flex-col overflow-hidden rounded-xl border border-slate-700 bg-[#1a1b26]">
                <div className="flex h-11 shrink-0 items-center gap-2 border-b border-slate-700/90 bg-[#16161e] px-3">
                  <span className="font-mono text-[11px] text-violet-300">
                    {languageId}
                  </span>
                  <span className="text-xs text-slate-500">· focused edit</span>
                </div>
                <div className="flex min-h-0 flex-1 flex-col">
                  <EditorBody
                    value={value}
                    onChange={onChange}
                    languageId={languageId}
                    grammar={grammar}
                    highlighted={highlighted}
                    readOnly={false}
                    minHeight="100%"
                    placeholder={placeholder}
                    showGutter
                  />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
