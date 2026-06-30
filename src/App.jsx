import { useEffect, useRef, useState } from 'react'
import CoverContent from './components/CoverContent.jsx'
import Puzzle from './components/Puzzle.jsx'
import PhotoPage from './components/PhotoPage.jsx'
import Letter from './components/Letter.jsx'
import HeartGraph from './components/HeartGraph.jsx'
import './App.css'

const spreads = [
  {
    issue: 'No. 03', title: 'Sexy Since 01', sub: 'The Throwback Edition', theme: 'baby', layout: 'trio',
    blurb: 'Filed under: born iconic. The receipts are in — she has been the moment since day one.',
    photos: [
      { src: '/photos/baby-1.jpeg', cap: 'Exhibit A — the original it-girl' },
      { src: '/photos/baby-2.jpeg', cap: 'Already serving looks at the table' },
      { src: '/photos/baby-3.jpeg', cap: 'Certified since birth' },
    ],
  },
  {
    issue: 'No. 04', title: "She's Fabulous", sub: 'A Study in Style', theme: 'fabulous', layout: 'trio',
    blurb: 'Stylish, hard-working, a whole muse. Photographed in full bloom — flowers recognise flowers.',
    photos: [
      { src: '/photos/floral-1.jpeg', cap: 'Among the flowers, the rarest one' },
      { src: '/photos/floral-2.jpeg', cap: 'Effortless, as always' },
      { src: '/photos/jersey.jpeg', cap: 'Off-duty, still the main character' },
    ],
  },
  {
    issue: 'No. 05', title: 'A Real Life Princess', sub: 'Royalty, Documented', theme: 'princess', layout: 'hero',
    blurb: 'Every queen was once a princess who believed she was worthy of love. My princess, my fairytale.',
    photos: [{ src: '/photos/reddress.jpeg', cap: 'Her Royal Highness, in red' }],
  },
  {
    issue: 'No. 06', title: 'Hottest Girl, Industrial Maths', sub: 'Brains & Beauty', theme: 'maths', layout: 'mosaic',
    blurb: 'My big-brained baby, my genius, the Maths goddess. The proof is left as an exercise for the reader.',
    photos: [
      { src: '/photos/corporate.jpeg', cap: 'Boardroom-ready, runway-worthy' },
      { src: '/photos/tv-1.jpeg', cap: 'On every screen' },
      { src: '/photos/tv-2.jpeg', cap: 'Genius at work' },
      { src: '/photos/campus-1.jpeg', cap: 'Campus legend' },
      { src: '/photos/campus-2.jpeg', cap: 'Top of the class' },
    ],
  },
]

const BAR = 64

function calcSize() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const mobile = vw < 760
  if (mobile) return { w: vw, h: Math.max(vh - BAR, 360), mobile: true }
  let h = Math.min(vh * 0.92, 920)
  let w = Math.round(h * 0.66)
  const maxW = vw * 0.6
  if (w > maxW) { w = Math.round(maxW); h = Math.round(w / 0.66) }
  return { w, h, mobile: false }
}

function useBookSize() {
  const [size, setSize] = useState(calcSize)
  useEffect(() => {
    let lastW = window.innerWidth
    const maybe = () => {
      if (window.innerWidth !== lastW) { lastW = window.innerWidth; setSize(calcSize()) }
    }
    const onOrient = () => setSize(calcSize())
    window.addEventListener('resize', maybe)
    window.addEventListener('orientationchange', onOrient)
    return () => {
      window.removeEventListener('resize', maybe)
      window.removeEventListener('orientationchange', onOrient)
    }
  }, [])
  return size
}

const FLIP_MS = 880

export default function App() {
  const { w, h, mobile } = useBookSize()
  const [index, setIndex] = useState(0)
  const [flip, setFlip] = useState(null) // { id, dir } while a leaf is turning
  const lock = useRef(false)
  const touch = useRef(null)

  const HEART_INDEX = 8

  const leaves = [
    { key: 'cover', cls: 'page-cover', node: <CoverContent /> },
    { key: 'puzzle', cls: 'page-paper', node: <Puzzle /> },
    ...spreads.map((s) => ({ key: s.issue, cls: 'page-photo', node: <PhotoPage {...s} /> })),
    { key: 'letter1', cls: 'page-letter', node: <Letter part={1} /> },
    { key: 'letter2', cls: 'page-letter', node: <Letter part={2} /> },
    { key: 'heart', cls: 'page-heart', node: <HeartGraph active={index === HEART_INDEX} /> },
    {
      key: 'back', cls: 'page-back', node: (
        <div className="back-content">
          <p className="kicker">End of Issue</p>
          <p className="back-line">Universal Tola&rsquo;s Day</p>
          <p className="back-sub">A one-of-one print run of love</p>
          <p className="back-credit">Words, pictures &amp; whole heart — xoxo&nbsp;Tobi</p>
        </div>
      ),
    },
  ]
  const total = leaves.length
  const LAST = total - 1

  const go = (dir) => {
    if (lock.current) return
    const ni = index + dir
    if (ni < 0 || ni > LAST) return
    lock.current = true
    setFlip({ id: dir > 0 ? index : ni, dir }) // the leaf that physically turns
    setIndex(ni)
    window.setTimeout(() => { lock.current = false; setFlip(null) }, FLIP_MS)
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const onTouchStart = (e) => {
    const t = e.touches[0]
    touch.current = { x: t.clientX, y: t.clientY, t: Date.now() }
  }
  const onTouchEnd = (e) => {
    if (!touch.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touch.current.x
    const dy = t.clientY - touch.current.y
    const dt = Date.now() - touch.current.t
    touch.current = null
    // horizontal, decisive, not a vertical scroll
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.3 && dt < 800) {
      go(dx < 0 ? 1 : -1)
    }
  }

  return (
    <div className={`stage${mobile ? ' is-mobile' : ''}`}>
      <div className="stage-glow" />

      <div
        className={`flip${flip ? (flip.dir > 0 ? ' flipping-next' : ' flipping-prev') : ''}`}
        style={{ width: w, height: h, '--ft': `${FLIP_MS}ms` }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {leaves.map((leaf, i) => {
          const turned = i < index
          const isFlip = flip && flip.id === i
          const z = isFlip ? 9999 : turned ? i : total - i
          return (
            <div
              key={leaf.key}
              className={`leaf page ${leaf.cls}${turned ? ' is-turned' : ''}`}
              style={{ zIndex: z }}
              data-flip={isFlip ? (flip.dir > 0 ? 'next' : 'prev') : undefined}
              aria-hidden={i !== index}
            >
              <div className="page-inner">{leaf.node}</div>
              <span className="leaf-shade" />
            </div>
          )
        })}
        <span className="fold-shadow" />
      </div>

      <div className="controls">
        <button className="nav-btn" onClick={() => go(-1)} aria-label="Previous page" disabled={index === 0}>
          ‹
        </button>
        <span className="page-count">{index + 1} / {total}</span>
        <button className="nav-btn nav-next" onClick={() => go(1)} aria-label="Next page" disabled={index === LAST}>
          ›
        </button>
      </div>
    </div>
  )
}
