import { useMemo } from 'react'
import { motion } from 'framer-motion'

/* The exact curve from her equation:  (x^2 + y^2 - 1)^3 - x^2 * y^3 = 0
   For each angle we solve for the outermost radius on that ray, so the
   plotted heart is the real implicit curve, not a stand-in. */
function heartPoints(samples = 260) {
  const f = (r, c2, s3) => Math.pow(r * r - 1, 3) - Math.pow(r, 5) * c2 * s3
  const pts = []
  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * Math.PI * 2
    const cos = Math.cos(t)
    const sin = Math.sin(t)
    const c2 = cos * cos
    const s3 = sin * sin * sin
    let prevR = 1.7
    let prev = f(prevR, c2, s3)
    let root = 1
    for (let r = 1.68; r >= 0.02; r -= 0.01) {
      const val = f(r, c2, s3)
      if (val === 0 || prev * val < 0) {
        let lo = r
        let hi = prevR
        for (let k = 0; k < 28; k++) {
          const mid = (lo + hi) / 2
          const fm = f(mid, c2, s3)
          if (prev * fm < 0) lo = mid
          else { hi = mid; prev = fm }
        }
        root = (lo + hi) / 2
        break
      }
      prevR = r
      prev = val
    }
    pts.push([root * cos, root * sin])
  }
  return pts
}

const VB = 600
const SCALE = 165

function toSvg([x, y]) {
  return [VB / 2 + x * SCALE, VB / 2 - y * SCALE]
}

export default function HeartGraph({ active = false }) {
  const path = useMemo(() => {
    const pts = heartPoints()
    return (
      pts
        .map((p, i) => {
          const [sx, sy] = toSvg(p)
          return `${i === 0 ? 'M' : 'L'} ${sx.toFixed(2)} ${sy.toFixed(2)}`
        })
        .join(' ') + ' Z'
    )
  }, [])

  const gridLines = []
  for (let g = -3; g <= 3; g++) {
    const off = VB / 2 + g * SCALE
    gridLines.push(['v', off], ['h', off])
  }

  return (
    <div className="heart-content">
      <p className="heart-eyebrow kicker">A Mathematical Way to Say I Love You</p>

      <div className="heart-eq">
        (x<sup>2</sup> + y<sup>2</sup> &minus; 1)<sup>3</sup> &minus; x<sup>2</sup>y<sup>3</sup> = 0
      </div>

      <div className="heart-stage">
        <svg viewBox={`0 0 ${VB} ${VB}`} className="heart-svg" role="img" aria-label="A heart plotted from the equation">
          <defs>
            <radialGradient id="fillGrad" cx="50%" cy="42%" r="60%">
              <stop offset="0%" stopColor="#e23150" />
              <stop offset="70%" stopColor="#c01933" />
              <stop offset="100%" stopColor="#7e0f23" />
            </radialGradient>
            <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g className="heart-grid">
            {gridLines.map(([dir, off], i) =>
              dir === 'v' ? (
                <line key={i} x1={off} y1="0" x2={off} y2={VB} />
              ) : (
                <line key={i} x1="0" y1={off} x2={VB} y2={off} />
              ),
            )}
          </g>
          <line className="heart-axis" x1="0" y1={VB / 2} x2={VB} y2={VB / 2} />
          <line className="heart-axis" x1={VB / 2} y1="0" x2={VB / 2} y2={VB} />

          <motion.path
            d={path}
            fill="url(#fillGrad)"
            initial={{ opacity: 0 }}
            animate={active ? { opacity: 0.92 } : { opacity: 0 }}
            transition={{ duration: 1.4, delay: 1.9, ease: 'easeOut' }}
          />
          <motion.path
            d={path}
            fill="none"
            stroke="#ff4d67"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#soft)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={active ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 2.4, ease: 'easeInOut' }}
          />
        </svg>
      </div>

      <div className="heart-finale">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 1, delay: 2.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Happy Birthday, Baby.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 1, delay: 2.9, ease: [0.22, 1, 0.36, 1] }}
        >
          I love you: solved, proven, and forever.
        </motion.p>
      </div>
    </div>
  )
}
