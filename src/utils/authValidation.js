/** Email format validation */
export function validateEmail(email) {
  if (!email?.trim()) return 'Email is required'
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!re.test(email.trim())) return 'Please enter a valid email address'
  return ''
}

/** Username: non-empty, reasonable length */
export function validateUsername(username) {
  if (!username?.trim()) return 'Username is required'
  const s = username.trim()
  if (s.length < 2) return 'Username must be at least 2 characters'
  if (s.length > 32) return 'Username must be at most 32 characters'
  if (!/^[a-zA-Z0-9_-]+$/.test(s)) return 'Username can only contain letters, numbers, underscore and hyphen'
  return ''
}

/** Password: min length and optional strength hint */
export function validatePassword(password, minLength = 8) {
  if (!password) return 'Password is required'
  if (password.length < minLength) return `Password must be at least ${minLength} characters`
  return ''
}

/** Confirm password match */
export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return 'Please confirm your password'
  if (password !== confirmPassword) return 'Passwords do not match'
  return ''
}
