import { useState } from 'react'

/**
 * Avatar with graceful fallback.
 * - Tries /images/avatars/avatar-{authorId}.webp first
 * - On error, renders a colored circle with the first character of `name`
 * - For personaType="book", uses a serif font (fits book-cover aesthetic)
 */
export default function Avatar({
  authorId,
  name = '',
  color = '#6B7280',
  personaType = 'original',
  size = 32,
  className = '',
  style,
  onClick,
}) {
  const [failed, setFailed] = useState(false)

  const initial = name ? name.charAt(0) : '?'
  const isBook = personaType === 'book'
  const fontSize = Math.max(10, Math.round(size * 0.42))

  if (!failed) {
    return (
      <img
        src={`/images/avatars/avatar-${authorId}.webp`}
        alt={name}
        className={`rounded-full object-cover flex-shrink-0 ${className}`}
        style={{ width: size, height: size, ...style }}
        onClick={onClick}
        onError={() => setFailed(true)}
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={name}
      onClick={onClick}
      className={`rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold select-none ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
        fontSize,
        fontFamily: isBook
          ? "'CoverSerif', Georgia, 'Songti SC', serif"
          : undefined,
        ...style,
      }}
    >
      {initial}
    </div>
  )
}
