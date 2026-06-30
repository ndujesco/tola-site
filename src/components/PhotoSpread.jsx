import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

function Plate({ photo, index, total }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])
  const tilt = index % 2 === 0 ? -1.4 : 1.6

  return (
    <motion.figure
      ref={ref}
      className={`plate plate-${total === 1 ? 'solo' : 'multi'}`}
      initial={{ opacity: 0, y: 60, rotate: tilt * 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <div className="plate-frame">
        <motion.img style={{ y }} src={photo.src} alt={photo.cap} loading="lazy" />
      </div>
      <figcaption>
        <span className="plate-no">{String(index + 1).padStart(2, '0')}</span>
        {photo.cap}
      </figcaption>
    </motion.figure>
  )
}

export default function PhotoSpread({ issue, title, sub, blurb, theme, photos }) {
  return (
    <section id={`spread-${theme}`} className={`spread spread-${theme} grain`}>
      <div className="spread-head">
        <motion.span
          className="spread-issue kicker"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {issue} &middot; {sub}
        </motion.span>
        <motion.h2
          className="spread-title"
          initial={{ opacity: 0, y: 30, skewY: 3 }}
          whileInView={{ opacity: 1, y: 0, skewY: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {title}
        </motion.h2>
        <motion.div
          className="spread-rule"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE, delay: 0.15 }}
        />
        <motion.p
          className="spread-blurb"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
        >
          {blurb}
        </motion.p>
      </div>

      <div className={`plates plates-${photos.length}`}>
        {photos.map((p, i) => (
          <Plate key={p.src} photo={p} index={i} total={photos.length} />
        ))}
      </div>
    </section>
  )
}
