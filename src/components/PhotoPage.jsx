/* A single magazine photo page. layout: 'trio' | 'hero' | 'mosaic' */
export default function PhotoPage({ issue, title, sub, blurb, theme, layout, photos }) {
  return (
    <div className={`photo-content photo-${theme}`}>
      <div className="photo-head">
        <span className="photo-issue kicker">{issue} · {sub}</span>
        <h2 className="photo-title">{title}</h2>
        <div className="photo-rule" />
        <p className="photo-blurb">{blurb}</p>
      </div>

      <div className={`photo-grid layout-${layout}`}>
        {photos.map((p, i) => (
          <figure className="photo-plate" key={p.src} style={{ '--i': i }}>
            <div className="photo-frame">
              <img src={p.src} alt={p.cap} loading="lazy" />
            </div>
            <figcaption>
              <span className="photo-no">{String(i + 1).padStart(2, '0')}</span>
              {p.cap}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
