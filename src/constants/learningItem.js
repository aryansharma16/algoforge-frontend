/** Mirrors backend LearningItem model */
export const LEARNING_ITEM_TYPES = [
  'problem',
  'topic',
  'reading',
  'video',
  'task',
  'other',
]

export const ITEM_STATUSES = [
  'pending',
  'in_progress',
  'completed',
  'skipped',
]

export const ITEM_TYPE_LABELS = {
  problem: 'Problem',
  topic: 'Topic',
  reading: 'Reading',
  video: 'Video',
  task: 'Task',
  other: 'Other',
}

export const ITEM_STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In progress',
  completed: 'Completed',
  skipped: 'Skipped',
}

export const STATUS_SORT_ORDER = {
  pending: 0,
  in_progress: 1,
  completed: 2,
  skipped: 3,
}

export const ITEM_LIMITS = {
  titleMax: 300,
  descriptionMax: 10000,
  notesMax: 20000,
  platformMax: 100,
  platformIdMax: 200,
  platformUrlMax: 2000,
  difficultyMax: 50,
  tagMaxLen: 64,
  tagsMax: 40,
  flagsMax: 20,
  resourcesMax: 30,
}

export const COMMON_DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Expert']

export const SORT_OPTIONS = [
  { id: 'orderIndex', label: 'Order index' },
  { id: 'createdAt', label: 'Created' },
  { id: 'updatedAt', label: 'Updated' },
  { id: 'title', label: 'Title' },
  { id: 'status', label: 'Status' },
  { id: 'type', label: 'Type' },
  { id: 'submissionCount', label: 'Submissions' },
  { id: 'lastSubmissionAt', label: 'Last submission' },
  { id: 'platformDifficulty', label: 'Platform difficulty' },
  { id: 'personalDifficulty', label: 'Personal difficulty' },
  { id: 'platform', label: 'Platform' },
]
