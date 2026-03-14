/** Mirrors backend Journey model enums */
export const JOURNEY_STATUSES = [
  'planned',
  'active',
  'paused',
  'completed',
  'archived',
]

export const JOURNEY_TYPES = [
  'DSA',
  'SYSTEM_DESIGN',
  'DBMS',
  'OS',
  'WEB_DEV',
  'CUSTOM',
]

export const JOURNEY_VISIBILITY = ['private', 'unlisted', 'public']

export const JOURNEY_LIMITS = {
  titleMax: 200,
  descriptionMax: 5000,
  categoryMax: 100,
}

export const JOURNEY_LABELS = {
  DSA: 'DSA',
  SYSTEM_DESIGN: 'System design',
  DBMS: 'DBMS',
  OS: 'OS',
  WEB_DEV: 'Web dev',
  CUSTOM: 'Custom',
  planned: 'Planned',
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
  archived: 'Archived',
  private: 'Private',
  unlisted: 'Unlisted',
  public: 'Public',
}
