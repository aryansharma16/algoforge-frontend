/**
 * Inline spinner for buttons and loading states.
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {string} [props.className]
 */
export default function Spinner({ size = 'md', className = '' }) {
  const sizeClass =
    size === 'sm' ? 'h-4 w-4 border-2' : size === 'lg' ? 'h-6 w-6 border-2' : 'h-5 w-5 border-2'
  return (
    <span
      className={`inline-block animate-spin rounded-full border-violet-500 border-t-transparent ${sizeClass} ${className}`}
      role="status"
      aria-hidden="true"
    />
  )
}
