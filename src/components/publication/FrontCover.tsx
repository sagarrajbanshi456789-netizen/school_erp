"use client"

interface FrontCoverProps {
  image?: string
  title: string
  subtitle?: string
  author?: string
  overlayOpacity?: number
  textPosition?: "top" | "center" | "bottom"
}

export default function FrontCover({
  image,
  title,
  subtitle,
  author,
  overlayOpacity = 0.4,
  textPosition = "center",
}: FrontCoverProps) {
  return (
    <div
      className={`cover front ${textPosition}`}
      style={
        {
          "--cover-image": `url(${image || "/default-cover.jpg"})`,
          "--overlay-opacity": overlayOpacity,
        } as React.CSSProperties
      }
    >
      <div className="cover-overlay" />

      <div className="cover-text">
        <h1>{title}</h1>

        {subtitle && <h3>{subtitle}</h3>}

        {author && <p>{author}</p>}
      </div>
    </div>
  )
}