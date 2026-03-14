export const SOLVING_METHODS = [
  { id: 'self', label: 'Self' },
  { id: 'hint', label: 'Hint' },
  { id: 'partial_help', label: 'Partial help' },
  { id: 'full_solution', label: 'Full solution' },
  { id: 'failed', label: 'Failed' },
]

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
