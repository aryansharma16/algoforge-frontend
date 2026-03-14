export const SOLVING_METHODS = [
  { id: 'self', label: 'Self' },
  { id: 'hint', label: 'Hint' },
  { id: 'partial_help', label: 'Partial help' },
  { id: 'full_solution', label: 'Full solution' },
  { id: 'failed', label: 'Failed' },
]

/** Matches backend SUBMISSION_FLAG_COLORS — UI badge / accent */
export const SUBMISSION_FLAG_COLORS = [
  'none',
  'gray',
  'blue',
  'green',
  'yellow',
  'orange',
  'red',
  'purple',
]

export const SUBMISSION_FLAG_COLOR_OPTIONS = [
  { id: 'none', label: 'None' },
  { id: 'gray', label: 'Gray' },
  { id: 'blue', label: 'Blue' },
  { id: 'green', label: 'Green' },
  { id: 'yellow', label: 'Yellow' },
  { id: 'orange', label: 'Orange' },
  { id: 'red', label: 'Red' },
  { id: 'purple', label: 'Purple' },
]

/** Tailwind ring/bg for flag chips; left border for history cards */
export function submissionFlagColorStyles(id) {
  const map = {
    none: 'bg-slate-800/50 text-slate-400 ring-slate-600/50',
    gray: 'bg-slate-700/50 text-slate-200 ring-slate-500/40',
    blue: 'bg-blue-950/60 text-blue-200 ring-blue-500/35',
    green: 'bg-emerald-950/55 text-emerald-200 ring-emerald-500/35',
    yellow: 'bg-yellow-950/50 text-yellow-100 ring-yellow-500/35',
    orange: 'bg-orange-950/50 text-orange-200 ring-orange-500/35',
    red: 'bg-red-950/55 text-red-200 ring-red-500/35',
    purple: 'bg-violet-950/55 text-violet-200 ring-violet-500/35',
  }
  return map[id] || map.none
}

export function submissionFlagLeftBorder(id) {
  const map = {
    none: 'border-l-transparent',
    gray: 'border-l-slate-500',
    blue: 'border-l-blue-500',
    green: 'border-l-emerald-500',
    yellow: 'border-l-yellow-500',
    orange: 'border-l-orange-500',
    red: 'border-l-red-500',
    purple: 'border-l-violet-500',
  }
  return map[id] || map.none
}

/** Matches backend SUBMISSION_RESULTS */
export const SUBMISSION_RESULTS = [
  { id: 'unspecified', label: 'Unspecified' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'wrong_answer', label: 'Wrong answer' },
  { id: 'time_limit', label: 'Time limit' },
  { id: 'runtime_error', label: 'Runtime error' },
  { id: 'partial', label: 'Partial' },
]

/** Value sent to API (filename / prism id) */
export const SUBMISSION_LANGUAGES = [
  { id: 'java', label: 'Java', prism: 'java' },
  { id: 'javascript', label: 'JavaScript', prism: 'javascript' },
  { id: 'typescript', label: 'TypeScript', prism: 'typescript' },
  { id: 'python', label: 'Python', prism: 'python' },
  { id: 'cpp', label: 'C++', prism: 'cpp' },
  { id: 'c', label: 'C', prism: 'c' },
  { id: 'csharp', label: 'C#', prism: 'csharp' },
  { id: 'go', label: 'Go', prism: 'go' },
  { id: 'rust', label: 'Rust', prism: 'rust' },
  { id: 'kotlin', label: 'Kotlin', prism: 'kotlin' },
  { id: 'swift', label: 'Swift', prism: 'swift' },
  { id: 'ruby', label: 'Ruby', prism: 'ruby' },
  { id: 'php', label: 'PHP', prism: 'php' },
  { id: 'sql', label: 'SQL', prism: 'sql' },
  { id: 'text', label: 'Plain text', prism: 'plaintext' },
]

export const COMPLEXITY_OPTIONS = [
  '',
  'O(1)',
  'O(log n)',
  'O(n)',
  'O(n log n)',
  'O(n²)',
  'O(n³)',
  'O(2ⁿ)',
  'O(n!)',
  'O(m + n)',
  'O(m × n)',
  'O(V + E)',
  'Other / mixed',
]
