"use client"

interface BackCoverProps {
  image?: string
  description?: string
  footer?: string
  overlayOpacity?: number
}

export default function BackCover({
  image,
  description,
  footer,
  overlayOpacity = 0.4,
}: BackCoverProps) {
  return (
    <div
      className="cover back"
      style={
        {
          "--cover-image": `url(${image || "/default-cover.jpg"})`,
          "--overlay-opacity": overlayOpacity,
        } as React.CSSProperties
      }
    >
      <div className="cover-overlay" />

      <div className="cover-text back-text">
        {description && <p>{description}</p>}
        {footer && <span>{footer}</span>}
      </div>
    </div>
  )
}