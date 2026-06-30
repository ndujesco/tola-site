import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const cover = [0.22, 1, 0.36, 1]

export default function Cover() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section id="cover" className="cover grain" ref={ref}>
      <motion.div className="cover-photo" style={{ y: photoY }}>
        <img src="/photos/cover.jpeg" alt="Tola, the cover star" />
        <div className="cover-vignette" />
      </motion.div>

      <motion.div className="cover-frame" style={{ opacity: fade }}>
        <header className="masthead">
          <motion.span
            className="masthead-kicker"
            initial={{ opacity: 0, letterSpacing: '0.1em' }}
            animate={{ opacity: 1, letterSpacing: '0.4em' }}
            transition={{ duration: 1.2, delay: 0.2, ease: cover }}
          >
            The Birthday Issue · Sexy 22 · 1 July
          </motion.span>
          <motion.h1
            className="masthead-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: cover }}
          >
            Universal <em>Tola&rsquo;s</em> Day
          </motion.h1>
          <motion.div
            className="masthead-rule"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, delay: 0.7, ease: cover }}
          />
        </header>

        <div className="cover-lines">
          {[
            ['Sexy Since 01', 'born iconic, certified hot'],
            ["She's Fabulous", 'a study in effortless style'],
            ['A Real Life Princess', 'royalty, fully documented'],
            ['Hottest Girl, Industrial Maths', 'brains & beauty, quantified'],
          ].map(([head, dek], i) => (
            <motion.p
              key={head}
              className={`cover-line cover-line-${i % 2 ? 'right' : 'left'}`}
              initial={{ opacity: 0, x: i % 2 ? 24 : -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.9 + i * 0.18, ease: cover }}
            >
              <span className="cover-line-head">{head}</span>
              <span className="cover-line-dek">{dek}</span>
            </motion.p>
          ))}
        </div>

        <motion.div
          className="cover-barcode"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
        >
          <div className="barcode" />
          <span>£0.00 · PRICELESS · ISSUE 22</span>
        </motion.div>

        <motion.div
          className="cover-scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <span className="kicker">Turn the page</span>
          <motion.span
            className="cover-arrow"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            ↓
          </motion.span>
        </motion.div>
      </motion.div>
    </section>
  )
}
