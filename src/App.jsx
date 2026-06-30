import { useEffect, useMemo, useRef, useState } from 'react'
import HTMLFlipBook from 'react-pageflip'
import Page from './components/Page.jsx'
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

function useBookSize() {
  const calc = () => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const ratio = 0.66 // page width / height (portrait)
    let h = Math.min(vh * 0.9, 940)
    let w = h * ratio
    const maxW = Math.min(vw * 0.96, 620)
    if (w > maxW) {
      w = maxW
      h = w / ratio
    }
    return { w: Math.round(w), h: Math.round(h) }
  }
  const [size, setSize] = useState(calc)
  useEffect(() => {
    let t
    const onResize = () => {
      clearTimeout(t)
      t = setTimeout(() => setSize(calc()), 150)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return size
}

export default function App() {
  const bookRef = useRef(null)
  const [active, setActive] = useState(0)
  const [opened, setOpened] = useState(false)
  const { w, h } = useBookSize()

  // page indices: 0 cover · 1 puzzle · 2-5 spreads · 6 letter1 · 7 letter2 · 8 heart · 9 back
  const HEART_INDEX = 8
  const LAST_INDEX = 9

  const flip = (dir) => {
    const pf = bookRef.current?.pageFlip()
    if (!pf) return
    // 'bottom' corner is the reliable one (the 'top' corner won't open a hard cover)
    dir > 0 ? pf.flipNext('bottom') : pf.flipPrev('bottom')
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') flip(1)
      else if (e.key === 'ArrowLeft') flip(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const totalLabel = useMemo(() => `${Math.min(active + 1, LAST_INDEX + 1)} / ${LAST_INDEX + 1}`, [active])

  return (
    <div className="stage">
      <div className="stage-glow" />

      <HTMLFlipBook
        ref={bookRef}
        className="magazine"
        width={w}
        height={h}
        size="fixed"
        minWidth={260}
        maxWidth={640}
        minHeight={400}
        maxHeight={960}
        drawShadow
        maxShadowOpacity={0.5}
        showCover
        usePortrait
        flippingTime={760}
        useMouseEvents
        clickEventForward={false}
        disableFlipByClick
        mobileScrollSupport
        startPage={0}
        onFlip={(e) => {
          setActive(e.data)
          if (e.data > 0) setOpened(true)
        }}
      >
        <Page className="page-cover" density="hard">
          <CoverContent />
        </Page>

        <Page className="page-paper">
          <Puzzle />
        </Page>

        {spreads.map((s) => (
          <Page className="page-photo" key={s.issue}>
            <PhotoPage {...s} />
          </Page>
        ))}

        <Page className="page-letter">
          <Letter part={1} />
        </Page>
        <Page className="page-letter">
          <Letter part={2} />
        </Page>

        <Page className="page-heart" density="hard">
          <HeartGraph active={active === HEART_INDEX} />
        </Page>

        <Page className="page-back" density="hard">
          <div className="back-content">
            <p className="kicker">End of Issue</p>
            <p className="back-line">Universal Tola&rsquo;s Day</p>
            <p className="back-sub">A one-of-one print run of love</p>
            <p className="back-credit">Words, pictures &amp; whole heart — xoxo&nbsp;Tobi</p>
          </div>
        </Page>
      </HTMLFlipBook>

      {!opened && (
        <div className="open-hint" onClick={() => flip(1)}>
          <span>drag the corner to open</span>
          <i className="corner-curl" />
        </div>
      )}

      <div className="controls">
        <button className="nav-btn" onClick={() => flip(-1)} aria-label="Previous page" disabled={active === 0}>
          ‹
        </button>
        <span className="page-count">{totalLabel}</span>
        <button className="nav-btn" onClick={() => flip(1)} aria-label="Next page" disabled={active >= LAST_INDEX}>
          ›
        </button>
      </div>
    </div>
  )
}
