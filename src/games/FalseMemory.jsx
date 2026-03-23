import React, { useState, useEffect, useRef } from 'react'
import { buildRound } from '../data/wordData'
import './FalseMemory.css'

const SHOW_INTERVAL_MS = 1200
const SHOW_PAUSE_MS = 500
const REAL_ROUNDS = 4

const styleOptions = [
  { type: 'color', value: '#e05c2a' },
  { type: 'color', value: '#2a7de0' },
  { type: 'color', value: '#b83ab8' },
  { type: 'fontSize', value: '5rem' },
  { type: 'fontSize', value: '2rem' },
  { type: 'font', value: "'Georgia', serif" },
  { type: 'font', value: "'Courier New', monospace" },
]

// gamePhase: 'intro' | 'tutorial_showing' | 'tutorial_quiz' | 'between' | 'showing' | 'quiz' | 'summary'
export default function FalseMemory() {
  const [gamePhase, setGamePhase] = useState('intro')
  const [round, setRound] = useState(null)
  const [roundNum, setRoundNum] = useState(0) // 1–4 for real rounds
  const [currentWordIdx, setCurrentWordIdx] = useState(0)
  const [currentWordVisible, setCurrentWordVisible] = useState(false)
  const [wordStyle, setWordStyle] = useState(null)
  const [selected, setSelected] = useState(new Set())
  const [submitted, setSubmitted] = useState(false)
  const [roundResults, setRoundResults] = useState([]) // array of { correct, total, roundNum }
  const timerRef = useRef(null)

  function buildAndSetRound() {
    const r = buildRound(10)
    setRound(r)
    setCurrentWordIdx(0)
    setCurrentWordVisible(false)
    setWordStyle(null)
    setSelected(new Set())
    setSubmitted(false)
  }

  function startTutorial() {
    buildAndSetRound()
    setGamePhase('tutorial_showing')
  }

  function startRealRound(num) {
    buildAndSetRound()
    setRoundNum(num)
    setGamePhase('showing')
  }

  // Word-by-word display effect — runs for both tutorial and real rounds
  const isShowing = gamePhase === 'tutorial_showing' || gamePhase === 'showing'
  useEffect(() => {
    if (!isShowing || !round) return

    const mid = Math.floor(round.shown.length / 2)
    const distractorIdxs = new Set()
    for (let d = mid - 1; d <= mid + 1; d++) {
      if (d >= 0 && d < round.shown.length && Math.random() < 0.6) distractorIdxs.add(d)
    }

    function showNextWord(idx) {
      if (idx >= round.shown.length) {
        timerRef.current = setTimeout(() => {
          setGamePhase(gamePhase === 'tutorial_showing' ? 'tutorial_quiz' : 'quiz')
        }, 800)
        return
      }
      setCurrentWordIdx(idx)
      if (distractorIdxs.has(idx)) {
        setWordStyle(styleOptions[Math.floor(Math.random() * styleOptions.length)])
      } else {
        setWordStyle(null)
      }
      setCurrentWordVisible(true)
      timerRef.current = setTimeout(() => {
        setCurrentWordVisible(false)
        setWordStyle(null)
        timerRef.current = setTimeout(() => showNextWord(idx + 1), SHOW_PAUSE_MS)
      }, SHOW_INTERVAL_MS)
    }

    timerRef.current = setTimeout(() => showNextWord(0), 400)
    return () => clearTimeout(timerRef.current)
  }, [isShowing, round])

  function toggleWord(word) {
    if (submitted) return
    setSelected(prev => {
      const next = new Set(prev)
      next.has(word) ? next.delete(word) : next.add(word)
      return next
    })
  }

  function handleSubmit() {
    if (submitted) return
    setSubmitted(true)
    const correct = round.gridWords.filter(item => {
      const isShown = round.shownSet.has(item.word)
      const wasSelected = selected.has(item.word)
      return isShown === wasSelected
    }).length

    if (gamePhase === 'quiz') {
      setRoundResults(prev => [...prev, { roundNum, correct, total: round.gridWords.length }])
    }
  }

  function handleNextAfterQuiz() {
    if (gamePhase === 'tutorial_quiz') {
      // Go to between screen before round 1
      setGamePhase('between')
    } else if (roundNum < REAL_ROUNDS) {
      setGamePhase('between')
    } else {
      setGamePhase('summary')
    }
  }

  function resetAll() {
    setGamePhase('intro')
    setRound(null)
    setRoundNum(0)
    setRoundResults([])
    setSelected(new Set())
    setSubmitted(false)
  }

  function getWordState(item) {
    if (!submitted) return selected.has(item.word) ? 'selected' : 'idle'
    const isShown = round.shownSet.has(item.word)
    const wasSelected = selected.has(item.word)
    if (isShown && wasSelected) return 'correct'
    if (isShown && !wasSelected) return 'missed'
    if (!isShown && wasSelected) return 'false'
    return 'idle'
  }

  function correctCount() {
    return round.gridWords.filter(item => {
      const isShown = round.shownSet.has(item.word)
      const wasSelected = selected.has(item.word)
      return isShown === wasSelected
    }).length
  }

  const isTutorial = gamePhase === 'tutorial_showing' || gamePhase === 'tutorial_quiz'

  // ── INTRO ──
  if (gamePhase === 'intro') {
    return (
      <div className="fm-container">
        <div className="fm-header">
          <h2>False Memory</h2>
          <p className="fm-desc">
            Words will flash on screen one by one. Afterwards, a grid of 16 words
            appears — some you saw, some are traps. Select every word you remember seeing.
          </p>
        </div>
        <div className="fm-rules">
          <div className="fm-rule"><span>01</span>Watch each word carefully as it appears</div>
          <div className="fm-rule"><span>02</span>In the grid, select every word you saw</div>
          <div className="fm-rule"><span>03</span>Beware — similar words are mixed in to trick you</div>
        </div>
        <div className="fm-session-info">
          1 tutorial round + {REAL_ROUNDS} scored rounds
        </div>
        <button className="fm-btn" onClick={startTutorial}>Start Tutorial</button>
      </div>
    )
  }

  // ── BETWEEN ROUNDS ──
  if (gamePhase === 'between') {
    const nextRound = roundNum + 1
    return (
      <div className="fm-container">
        <div className="fm-header">
          <h2>False Memory</h2>
        </div>
        <div className="fm-between">
          <div className="fm-between-label">Round {nextRound} of {REAL_ROUNDS}</div>
          <p className="fm-between-desc">Get ready. A new set of words is coming.</p>
          {roundResults.length > 0 && (
            <div className="fm-between-progress">
              {roundResults.map(r => (
                <div key={r.roundNum} className="fm-between-pill">
                  R{r.roundNum}: {r.correct}/{r.total}
                </div>
              ))}
            </div>
          )}
          <button className="fm-btn" onClick={() => startRealRound(nextRound)}>
            Start Round {nextRound}
          </button>
        </div>
      </div>
    )
  }

  // ── SHOWING (tutorial or real) ──
  if (gamePhase === 'tutorial_showing' || gamePhase === 'showing') {
    return (
      <div className="fm-container">
        <div className="fm-header">
          <h2>False Memory</h2>
          <div className="fm-round-badge">
            {isTutorial ? 'Tutorial' : `Round ${roundNum} of ${REAL_ROUNDS}`}
          </div>
        </div>
        <div className="fm-stage-label">Memorise these words</div>
        <div className="fm-word-display">
          <div
            className={`fm-word ${currentWordVisible ? 'visible' : ''}`}
            style={{
              color: wordStyle?.type === 'color' ? wordStyle.value : undefined,
              fontSize: wordStyle?.type === 'fontSize' ? wordStyle.value : undefined,
              fontFamily: wordStyle?.type === 'font' ? wordStyle.value : undefined,
            }}
          >
            {round?.shown[currentWordIdx]}
          </div>
        </div>
      </div>
    )
  }

  // ── QUIZ (tutorial or real) ──
  if (gamePhase === 'tutorial_quiz' || gamePhase === 'quiz') {
    const count = submitted ? correctCount() : 0
    const isLastRound = roundNum === REAL_ROUNDS

    return (
      <div className="fm-container fm-container--wide">
        <div className="fm-header">
          <h2>False Memory</h2>
          <div className="fm-round-badge">
            {isTutorial ? 'Tutorial' : `Round ${roundNum} of ${REAL_ROUNDS}`}
          </div>
          {isTutorial && (
            <p className="fm-desc fm-tutorial-hint">
              This is practice — your score here won't count.
            </p>
          )}
          {!isTutorial && !submitted && (
            <p className="fm-desc">Select every word you remember seeing</p>
          )}
        </div>

        <div className="fm-grid">
          {round.gridWords.map((item, i) => {
            const state = getWordState(item)
            return (
              <button
                key={i}
                className={`fm-cell fm-cell--${state}`}
                onClick={() => toggleWord(item.word)}
                disabled={submitted}
              >
                {item.word}
                {submitted && state === 'correct' && <span className="fm-cell-icon">✓</span>}
                {submitted && state === 'missed' && <span className="fm-cell-icon">!</span>}
                {submitted && state === 'false' && <span className="fm-cell-icon">✗</span>}
              </button>
            )
          })}
        </div>

        {!submitted ? (
          <button className="fm-btn fm-btn--submit" onClick={handleSubmit}>Submit</button>
        ) : (
          <div className="fm-quiz-result">
            <div className="fm-quiz-score">{count} / {round.gridWords.length} correct</div>
            <div className="fm-quiz-legend">
              <span className="legend-correct">✓ Correct</span>
              <span className="legend-missed">! Missed</span>
              <span className="legend-false">✗ False memory</span>
            </div>
            <button className="fm-btn" onClick={handleNextAfterQuiz}>
              {isTutorial ? 'Start Round 1' : isLastRound ? 'See Summary' : `Next Round`}
            </button>
          </div>
        )}
      </div>
    )
  }

  // ── SUMMARY ──
  if (gamePhase === 'summary') {
    const totalCorrect = roundResults.reduce((s, r) => s + r.correct, 0)
    const totalPossible = roundResults.reduce((s, r) => s + r.total, 0)
    const overallPct = Math.round((totalCorrect / totalPossible) * 100)

    return (
      <div className="fm-container">
        <div className="fm-header">
          <h2>Summary</h2>
          <p className="fm-desc">Your results across {REAL_ROUNDS} rounds</p>
        </div>

        <div className="fm-summary-score">
          <div className="fm-summary-big">{overallPct}%</div>
          <div className="fm-summary-sub">{totalCorrect} / {totalPossible} correct overall</div>
        </div>

        <div className="fm-summary-rounds">
          {roundResults.map(r => {
            const pct = Math.round((r.correct / r.total) * 100)
            return (
              <div key={r.roundNum} className="fm-summary-row">
                <span className="fm-summary-round-label">Round {r.roundNum}</span>
                <div className="fm-summary-bar-wrap">
                  <div className="fm-summary-bar" style={{ width: `${pct}%` }} />
                </div>
                <span className="fm-summary-round-score">{r.correct}/{r.total} — {pct}%</span>
              </div>
            )
          })}
        </div>

        <button className="fm-btn" onClick={resetAll}>Play Again</button>
      </div>
    )
  }

  return null
}