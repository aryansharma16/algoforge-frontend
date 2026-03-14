/** Matches User.socialProfiles[].type (lowercase, max 32) */
export const SOCIAL_PROFILE_TYPES = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'github', label: 'GitHub' },
  { value: 'leetcode', label: 'LeetCode' },
  { value: 'gfg', label: 'GeeksforGeeks' },
  { value: 'codeforces', label: 'Codeforces' },
  { value: 'codechef', label: 'CodeChef' },
  { value: 'twitter', label: 'X / Twitter' },
  { value: 'website', label: 'Website' },
  { value: 'other', label: 'Other' },
]

export const MAX_SOCIAL_PROFILES = 20
