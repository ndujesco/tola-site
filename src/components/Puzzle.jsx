import { useMemo, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* Hand-verified crossword. Grid 7 rows x 9 cols.
   1A MATHS · 5A FABULOUS · 2D TOLA · 3D JULY · 4D QUEEN
   Solving it spells her world, and reveals the birthday: 1 · 07 */
const SOLUTION = {
  '0-0': 'M', '0-1': 'A', '0-2': 'T', '0-3': 'H', '0-4': 'S',
  '1-2': 'O',
  '2-2': 'L', '2-4': 'J', '2-7': 'Q',
  '3-1': 'F', '3-2': 'A', '3-3': 'B', '3-4': 'U', '3-5': 'L', '3-6': 'O', '3-7': 'U', '3-8': 'S',
  '4-4': 'L', '4-7': 'E',
  '5-4': 'Y', '5-7': 'E',
  '6-7': 'N',
}
const NUMS = { '0-0': 1, '0-2': 2, '2-4': 3, '2-7': 4, '3-1': 5 }
const ROWS = 7
const COLS = 9

const WORDS = {
  across: [
    { n: 1, clue: "She's the hottest girl in Industrial ___", cells: ['0-0', '0-1', '0-2', '0-3', '0-4'] },
    { n: 5, clue: 'Iconic, amazing: simply ___', cells: ['3-1', '3-2', '3-3', '3-4', '3-5', '3-6', '3-7', '3-8'] },
  ],
  down: [
    { n: 2, clue: "Today's cover star 👑", cells: ['0-2', '1-2', '2-2', '3-2'] },
    { n: 3, clue: 'Her birthday month', cells: ['2-4', '3-4', '4-4', '5-4'] },
    { n: 4, clue: 'Every princess grows into a ___', cells: ['2-7', '3-7', '4-7', '5-7', '6-7'] },
  ],
}

const key = (r, c) => `${r}-${c}`
const isActive = (r, c) => SOLUTION[key(r, c)] !== undefined

export default function Puzzle() {
  const [entries, setEntries] = useState({})
  const [dir, setDir] = useState('across')
  const [active, setActive] = useState('0-0')
  const [solved, setSolved] = useState(false)
  const refs = useRef({})

  const solvedSet = useMemo(
    () => Object.keys(SOLUTION).every((k) => (entries[k] || '').toUpperCase() === SOLUTION[k]),
    [entries],
  )

  const currentWord = useMemo(() => {
    const list = WORDS[dir]
    return list.find((w) => w.cells.includes(active)) || null
  }, [dir, active])

  const focusCell = useCallback((k) => {
    const el = refs.current[k]
    if (el) el.focus()
  }, [])

  const step = useCallback((r, c, d, delta) => {
    let nr = r
    let nc = c
    for (let i = 0; i < Math.max(ROWS, COLS); i++) {
      if (d === 'across') nc += delta
      else nr += delta
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return null
      if (isActive(nr, nc)) return key(nr, nc)
    }
    return null
  }, [])

  const handleChange = (r, c, val) => {
    const ch = val.slice(-1).toUpperCase()
    if (ch && !/[A-Z]/.test(ch)) return
    const k = key(r, c)
    const next = { ...entries, [k]: ch }
    setEntries(next)
    if (ch) {
      const allRight = Object.keys(SOLUTION).every(
        (kk) => (next[kk] || '').toUpperCase() === SOLUTION[kk],
      )
      if (allRight) {
        setSolved(true)
        return
      }
      const nk = step(r, c, dir, 1)
      if (nk) {
        setActive(nk)
        focusCell(nk)
      }
    }
  }

  const handleKeyDown = (r, c, e) => {
    const k = key(r, c)
    if (e.key === 'Backspace') {
      if (entries[k]) {
        setEntries((p) => ({ ...p, [k]: '' }))
      } else {
        const pk = step(r, c, dir, -1)
        if (pk) {
          setActive(pk)
          focusCell(pk)
          setEntries((p) => ({ ...p, [pk]: '' }))
        }
      }
      e.preventDefault()
    } else if (e.key === 'ArrowRight') { const n = step(r, c, 'across', 1); if (n) { setDir('across'); setActive(n); focusCell(n) } }
    else if (e.key === 'ArrowLeft') { const n = step(r, c, 'across', -1); if (n) { setDir('across'); setActive(n); focusCell(n) } }
    else if (e.key === 'ArrowDown') { const n = step(r, c, 'down', 1); if (n) { setDir('down'); setActive(n); focusCell(n) } }
    else if (e.key === 'ArrowUp') { const n = step(r, c, 'down', -1); if (n) { setDir('down'); setActive(n); focusCell(n) } }
  }

  const handleClick = (k) => {
    if (k === active) setDir((d) => (d === 'across' ? 'down' : 'across'))
    setActive(k)
    focusCell(k)
  }

  const reveal = () => {
    setEntries(Object.fromEntries(Object.entries(SOLUTION)))
    setSolved(true)
  }

  return (
    <div className="puzzle-content">
        <div className="paper-flag">
          <span>THE TOLA TIMES</span>
          <span>WED · 1 JULY · EST. 22 YRS AGO</span>
        </div>
        <div className="rule double" style={{ color: '#1a0e12' }} />

        <div className="puzzle-head">
          <p className="puzzle-eyebrow">No. 02 · The Daily Crossword</p>
          <h2 className="puzzle-title">Solve Her Story</h2>
          <p className="puzzle-dek">
            One of those puzzles you lose an hour to. Fill every square: the answers spell out exactly
            who you are. Crack it, and the date reveals itself.
          </p>
        </div>

        <div className="puzzle-body">
          <div
            className="grid"
            style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
            role="grid"
            aria-label="Birthday crossword"
          >
            {Array.from({ length: ROWS }).map((_, r) =>
              Array.from({ length: COLS }).map((__, c) => {
                const k = key(r, c)
                if (!isActive(r, c)) return <div key={k} className="cell cell-blank" />
                const inWord = currentWord?.cells.includes(k)
                const correct = solved
                return (
                  <div
                    key={k}
                    className={
                      'cell' +
                      (k === active ? ' cell-active' : '') +
                      (inWord ? ' cell-lit' : '') +
                      (correct ? ' cell-correct' : '')
                    }
                  >
                    {NUMS[k] && <span className="cell-num">{NUMS[k]}</span>}
                    <input
                      ref={(el) => (refs.current[k] = el)}
                      value={entries[k] || ''}
                      onChange={(e) => handleChange(r, c, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(r, c, e)}
                      onFocus={() => setActive(k)}
                      onClick={() => handleClick(k)}
                      maxLength={1}
                      inputMode="text"
                      autoCapitalize="characters"
                      aria-label={`Row ${r + 1} column ${c + 1}`}
                    />
                  </div>
                )
              }),
            )}
          </div>

          <div className="clues">
            <div className="clue-group">
              <h3>Across</h3>
              {WORDS.across.map((w) => (
                <button
                  key={`a${w.n}`}
                  className={'clue' + (currentWord?.n === w.n && dir === 'across' ? ' clue-on' : '')}
                  onClick={() => { setDir('across'); setActive(w.cells[0]); focusCell(w.cells[0]) }}
                >
                  <b>{w.n}.</b> {w.clue}
                </button>
              ))}
            </div>
            <div className="clue-group">
              <h3>Down</h3>
              {WORDS.down.map((w) => (
                <button
                  key={`d${w.n}`}
                  className={'clue' + (currentWord?.n === w.n && dir === 'down' ? ' clue-on' : '')}
                  onClick={() => { setDir('down'); setActive(w.cells[0]); focusCell(w.cells[0]) }}
                >
                  <b>{w.n}.</b> {w.clue}
                </button>
              ))}
            </div>
            {!solved && (
              <button className="reveal-btn" onClick={reveal}>
                Stuck? Peek at the answers
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {solved && (
            <motion.div
              className="solved-banner"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Confetti />
              <p className="solved-kicker">Puzzle Complete · Front Page News</p>
              <p className="solved-date">
                <span>01</span>
                <span className="solved-slash">/</span>
                <span>07</span>
              </p>
              <p className="solved-line">Happy Birthday for the 1st of July, my Maths genius 🎂</p>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  )
}

function Confetti() {
  const bits = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 460,
        delay: Math.random() * 0.3,
        rot: Math.random() * 360,
        color: ['#c01933', '#c9a24b', '#d98a9a', '#4a0e1f', '#e6c878'][i % 5],
      })),
    [],
  )
  return (
    <div className="confetti" aria-hidden>
      {bits.map((b) => (
        <motion.span
          key={b.id}
          style={{ background: b.color }}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          animate={{ opacity: 0, x: b.x, y: 240, rotate: b.rot }}
          transition={{ duration: 1.6 + Math.random(), delay: b.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
