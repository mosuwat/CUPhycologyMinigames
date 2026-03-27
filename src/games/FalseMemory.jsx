import React, { useState, useEffect, useRef } from 'react'
import { buildRound } from '../data/wordData'
import './FalseMemory.css'

const SHOW_INTERVAL_MS = 1000
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

const UI = {
  en: {
    title: 'False Memory',
    selectLang: 'Choose a language',
    english: 'English',
    thai: 'Thai',
    introDesc: 'Words will flash on screen one by one. Afterwards, a grid of words appears — some you saw, some are traps. Select every word you remember seeing.',
    rule1: 'Watch each word carefully as it appears',
    rule2: 'In the grid, select every word you saw',
    rule3: 'Beware — similar words are mixed in to trick you',
    sessionInfo: rounds => `1 tutorial round + ${rounds} scored rounds`,
    startTutorial: 'Start Tutorial',
    memorise: 'Memorise these words',
    tutorial: 'Tutorial',
    tutorialHint: 'This is practice — your score here won\'t count.',
    round: (n, total) => `Round ${n} of ${total}`,
    selectSeen: 'Select every word you remember seeing',
    submit: 'Submit',
    correct: '✓ Correct',
    missed: '! Missed',
    falseMem: '✗ False memory',
    startRound1: 'Start Round 1',
    nextRound: 'Next Round',
    seeSummary: 'See Summary',
    getReady: 'Get ready. A new set of words is coming.',
    start: n => `Start Round ${n}`,
    summary: 'Summary',
    summaryDesc: rounds => `Your results across ${rounds} rounds`,
    overall: 'overall',
    playAgain: 'Play Again',
    changeLang: 'Change Language',
    typeOfStimulus: 'Type of Stimulus',
    you: 'You',
    globalAvg: 'Global avg.',
    origItem: 'Original list item',
    unrelLure: 'Unrelated lure (not in list)',
    relLure: 'Related lure (not in list)',
    summaryNote: 'Global averages based on data from 180,129 participants. A high related-lure rate is the false memory effect — even knowing the experiment, most people still show it.',
  },
  th: {
    title: 'False Memory',
    selectLang: 'เลือกภาษา',
    english: 'อังกฤษ',
    thai: 'ไทย',
    introDesc: 'คำจะปรากฏบนหน้าจอทีละคำ จากนั้นจะมีตารางคำปรากฏขึ้น — บางคำที่คุณเห็น บางคำเป็นกับดัก เลือกทุกคำที่คุณจำได้ว่าเห็น',
    rule1: 'จดจำแต่ละคำที่ปรากฏขึ้นอย่างระมัดระวัง',
    rule2: 'ในตาราง ให้เลือกทุกคำที่คุณเห็น',
    rule3: 'ระวัง — มีคำที่มีความหมายใกล้เคียงปนอยู่เพื่อหลอกคุณ',
    sessionInfo: rounds => `1 รอบฝึก + ${rounds} รอบจริง`,
    startTutorial: 'เริ่มฝึก',
    memorise: 'จดจำคำเหล่านี้',
    tutorial: 'ฝึกซ้อม',
    tutorialHint: 'นี่คือการฝึกซ้อม — คะแนนจะไม่ถูกนับ',
    round: (n, total) => `รอบที่ ${n} จาก ${total}`,
    selectSeen: 'เลือกทุกคำที่คุณจำได้ว่าเห็น',
    submit: 'ส่งคำตอบ',
    correct: '✓ ถูกต้อง',
    missed: '! พลาด',
    falseMem: '✗ ความจำลวง',
    startRound1: 'เริ่มรอบที่ 1',
    nextRound: 'รอบถัดไป',
    seeSummary: 'ดูสรุป',
    getReady: 'เตรียมพร้อม คำชุดใหม่กำลังจะมา',
    start: n => `เริ่มรอบที่ ${n}`,
    summary: 'สรุปผล',
    summaryDesc: rounds => `ผลของคุณใน ${rounds} รอบ`,
    overall: 'รวม',
    playAgain: 'เล่นอีกครั้ง',
    changeLang: 'เปลี่ยนภาษา',
    typeOfStimulus: 'ประเภทสิ่งเร้า',
    you: 'คุณ',
    globalAvg: 'ค่าเฉลี่ยทั่วโลก',
    origItem: 'คำในรายการต้นฉบับ',
    unrelLure: 'คำล่อที่ไม่เกี่ยวข้อง (ไม่อยู่ในรายการ)',
    relLure: 'คำล่อที่เกี่ยวข้อง (ไม่อยู่ในรายการ)',
    summaryNote: 'ค่าเฉลี่ยทั่วโลกอ้างอิงจากข้อมูลผู้เข้าร่วม 180,129 คน อัตราคำล่อที่เกี่ยวข้องสูงคือปรากฏการณ์ความจำลวง — แม้รู้ว่ากำลังทดสอบอะไร คนส่วนใหญ่ก็ยังแสดงอาการนี้',
  },
}

function BarChart({ title, values }) {
  const W = 230, H = 200
  const ml = 44, mt = 12, mb = 52
  const pw = W - ml - 10
  const ph = H - mt - mb
  const groupW = pw / 3
  const barW = Math.min(50, groupW * 0.68)
  const yScale = v => ph - (v / 100) * ph
  const LABELS = [['Original', 'List Item'], ['Unrelated', 'Lure'], ['Related', 'Lure']]
  const TICKS = [0, 20, 40, 60, 80, 100]
  return (
    <div className="fm-chart">
      <div className="fm-chart-title">{title}</div>
      <svg width={W} height={H} style={{ display: 'block' }}>
        <g transform={`translate(${ml},${mt})`}>
          {TICKS.map(v => (
            <g key={v}>
              <line x1={0} y1={yScale(v)} x2={pw} y2={yScale(v)} stroke="var(--border)" strokeWidth={v === 0 ? 1 : 0.5} />
              <text x={-6} y={yScale(v)} textAnchor="end" dominantBaseline="middle" fontSize="9" fill="var(--text-muted)">{v}</text>
            </g>
          ))}
          {values.map((v, i) => {
            const bh = (v / 100) * ph
            const bx = i * groupW + (groupW - barW) / 2
            return (
              <rect key={i} x={bx} y={yScale(v)} width={barW} height={bh}
                fill="var(--red-light)" stroke="var(--red)" strokeWidth={1.5} />
            )
          })}
          {LABELS.map((lines, i) => (
            <g key={i} transform={`translate(${i * groupW + groupW / 2}, ${ph + 10})`}>
              {lines.map((line, li) => (
                <text key={li} x={0} y={li * 12} textAnchor="middle" fontSize="9" fill="var(--text-muted)">{line}</text>
              ))}
            </g>
          ))}
          <line x1={0} y1={0} x2={0} y2={ph} stroke="var(--border)" />
          <text transform="rotate(-90)" x={-ph / 2} y={-34} textAnchor="middle" fontSize="9" fill="var(--text-muted)">Percent Recognized</text>
          <text x={pw / 2} y={ph + 46} textAnchor="middle" fontSize="9" fill="var(--text-muted)">Type Of Stimulus</text>
        </g>
      </svg>
    </div>
  )
}

// gamePhase: 'lang_select' | 'intro' | 'tutorial_showing' | 'tutorial_quiz' | 'between' | 'showing' | 'quiz' | 'summary'
export default function FalseMemory() {
  const [gamePhase, setGamePhase] = useState('lang_select')
  const [lang, setLang] = useState('en')
  const [round, setRound] = useState(null)
  const [roundNum, setRoundNum] = useState(0)
  const [currentWordIdx, setCurrentWordIdx] = useState(0)
  const [currentWordVisible, setCurrentWordVisible] = useState(false)
  const [wordStyle, setWordStyle] = useState(null)
  const [selected, setSelected] = useState(new Set())
  const [submitted, setSubmitted] = useState(false)
  const [roundResults, setRoundResults] = useState([])
  const [usedThemes, setUsedThemes] = useState(new Set())
  const timerRef = useRef(null)

  const t = UI[lang]

  function newRound(isTutorial = false) {
    const themes = isTutorial ? new Set() : usedThemes
    const r = buildRound(lang, themes)
    if (!isTutorial) setUsedThemes(prev => new Set([...prev, r.group.theme]))
    setRound(r)
    setCurrentWordIdx(0)
    setCurrentWordVisible(false)
    setWordStyle(null)
    setSelected(new Set())
    setSubmitted(false)
  }

  function selectLang(l) {
    setLang(l)
    setGamePhase('intro')
  }

  function startTutorial() {
    newRound(true)
    setGamePhase('tutorial_showing')
  }

  function startRealRound(num) {
    newRound(false)
    setRoundNum(num)
    setGamePhase('showing')
  }

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

    let origTotal = 0, origHit = 0
    let relTotal = 0, relFalse = 0
    let unrelTotal = 0, unrelFalse = 0

    round.gridWords.forEach(item => {
      if (item.type === 'shown') {
        origTotal++
        if (selected.has(item.word)) origHit++
      } else if (item.type === 'lure_related') {
        relTotal++
        if (selected.has(item.word)) relFalse++
      } else if (item.type === 'lure_unrelated') {
        unrelTotal++
        if (selected.has(item.word)) unrelFalse++
      }
    })

    const correct = round.gridWords.filter(item =>
      round.shownSet.has(item.word) === selected.has(item.word)
    ).length

    if (gamePhase === 'quiz') {
      setRoundResults(prev => [...prev, {
        roundNum, correct, total: round.gridWords.length,
        origTotal, origHit, relTotal, relFalse, unrelTotal, unrelFalse,
      }])
    }
  }

  function handleNext() {
    if (gamePhase === 'tutorial_quiz') {
      setGamePhase('between')
    } else if (roundNum < REAL_ROUNDS) {
      setGamePhase('between')
    } else {
      setGamePhase('summary')
    }
  }

  function resetAll() {
    setGamePhase('lang_select')
    setRound(null)
    setRoundNum(0)
    setRoundResults([])
    setUsedThemes(new Set())
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
    return round.gridWords.filter(item =>
      round.shownSet.has(item.word) === selected.has(item.word)
    ).length
  }

  const isTutorial = gamePhase === 'tutorial_showing' || gamePhase === 'tutorial_quiz'
  const gridCols = round?.gridSize === 12 ? 3 : 4

  // ── LANGUAGE SELECT ──
  if (gamePhase === 'lang_select') {
    return (
      <div className="fm-container">
        <div className="fm-header">
          <h2>False Memory</h2>
          <p className="fm-desc">{t.selectLang}</p>
        </div>
        <div className="fm-lang-btns">
          <button className="fm-lang-btn" onClick={() => selectLang('en')}>
            <span className="fm-lang-icon">🇪🇳</span>
            English
          </button>
          <button className="fm-lang-btn" onClick={() => selectLang('th')}>
            <span className="fm-lang-icon">🇹🇭</span>
            ภาษาไทย
          </button>
        </div>
      </div>
    )
  }

  // ── INTRO ──
  if (gamePhase === 'intro') {
    return (
      <div className="fm-container">
        <div className="fm-header">
          <h2>{t.title}</h2>
          <p className="fm-desc">{t.introDesc}</p>
        </div>
        <div className="fm-rules">
          <div className="fm-rule"><span>01</span>{t.rule1}</div>
          <div className="fm-rule"><span>02</span>{t.rule2}</div>
          <div className="fm-rule"><span>03</span>{t.rule3}</div>
        </div>
        <div className="fm-session-info">{t.sessionInfo(REAL_ROUNDS)}</div>
        <div className="fm-intro-actions">
          <button className="fm-btn" onClick={startTutorial}>{t.startTutorial}</button>
          <button className="fm-btn-ghost" onClick={() => setGamePhase('lang_select')}>{t.changeLang}</button>
        </div>
      </div>
    )
  }

  // ── BETWEEN ROUNDS ──
  if (gamePhase === 'between') {
    const nextRound = roundNum + 1
    return (
      <div className="fm-container">
        <div className="fm-header"><h2>{t.title}</h2></div>
        <div className="fm-between">
          <div className="fm-between-label">{t.round(nextRound, REAL_ROUNDS)}</div>
          <p className="fm-between-desc">{t.getReady}</p>
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
            {t.start(nextRound)}
          </button>
        </div>
      </div>
    )
  }

  // ── SHOWING ──
  if (gamePhase === 'tutorial_showing' || gamePhase === 'showing') {
    return (
      <div className="fm-container">
        <div className="fm-header">
          <h2>{t.title}</h2>
          <div className="fm-round-badge">
            {isTutorial ? t.tutorial : t.round(roundNum, REAL_ROUNDS)}
          </div>
        </div>
        <div className="fm-stage-label">{t.memorise}</div>
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

  // ── QUIZ ──
  if (gamePhase === 'tutorial_quiz' || gamePhase === 'quiz') {
    const count = submitted ? correctCount() : 0
    const isLastRound = roundNum === REAL_ROUNDS
    const cols = gridCols

    return (
      <div className="fm-container fm-container--wide">
        <div className="fm-header">
          <h2>{t.title}</h2>
          <div className="fm-round-badge">
            {isTutorial ? t.tutorial : t.round(roundNum, REAL_ROUNDS)}
          </div>
          {isTutorial && <p className="fm-desc fm-tutorial-hint">{t.tutorialHint}</p>}
          {!isTutorial && !submitted && <p className="fm-desc">{t.selectSeen}</p>}
        </div>

        <div className={`fm-grid fm-grid--cols${cols}`}>
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
          <button className="fm-btn fm-btn--submit" onClick={handleSubmit}>{t.submit}</button>
        ) : (
          <div className="fm-quiz-result">
            <div className="fm-quiz-score">{count} / {round.gridWords.length}</div>
            <div className="fm-quiz-legend">
              <span className="legend-correct">{t.correct}</span>
              <span className="legend-missed">{t.missed}</span>
              <span className="legend-false">{t.falseMem}</span>
            </div>
            <button className="fm-btn" onClick={handleNext}>
              {isTutorial ? t.startRound1 : isLastRound ? t.seeSummary : t.nextRound}
            </button>
          </div>
        )}
      </div>
    )
  }

  // ── SUMMARY ──
  if (gamePhase === 'summary') {
    const totOrig    = roundResults.reduce((s, r) => s + r.origTotal, 0)
    const hitOrig    = roundResults.reduce((s, r) => s + r.origHit, 0)
    const totRel     = roundResults.reduce((s, r) => s + r.relTotal, 0)
    const falseRel   = roundResults.reduce((s, r) => s + r.relFalse, 0)
    const totUnrel   = roundResults.reduce((s, r) => s + r.unrelTotal, 0)
    const falseUnrel = roundResults.reduce((s, r) => s + r.unrelFalse, 0)

    const origPct  = totOrig  ? Math.round((hitOrig    / totOrig)  * 100) : 0
    const relPct   = totRel   ? Math.round((falseRel   / totRel)   * 100) : 0
    const unrelPct = totUnrel ? Math.round((falseUnrel / totUnrel) * 100) : 0

    const GLOBAL = { orig: 79.7, unrel: 6.8, rel: 75.2 }

    return (
      <div className="fm-container">
        <div className="fm-header">
          <h2>{t.summary}</h2>
          <p className="fm-desc">{t.summaryDesc(REAL_ROUNDS)}</p>
        </div>

        <div className="fm-summary-table">
          <div className="fm-summary-thead">
            <span>{t.typeOfStimulus}</span>
            <span>{t.you}</span>
            <span>{t.globalAvg}</span>
          </div>
          <div className="fm-summary-trow fm-summary-trow--orig">
            <span>{t.origItem}</span>
            <span>{origPct}%</span>
            <span>{GLOBAL.orig}%</span>
          </div>
          <div className="fm-summary-trow fm-summary-trow--unrel">
            <span>{t.unrelLure}</span>
            <span>{unrelPct}%</span>
            <span>{GLOBAL.unrel}%</span>
          </div>
          <div className="fm-summary-trow fm-summary-trow--rel">
            <span>{t.relLure}</span>
            <span>{relPct}%</span>
            <span>{GLOBAL.rel}%</span>
          </div>
        </div>

        <p className="fm-summary-note">{t.summaryNote}</p>

        <div className="fm-charts">
          <BarChart title={lang === 'th' ? 'ผลของคุณ' : 'Your Results'} values={[origPct, unrelPct, relPct]} />
          <BarChart title={lang === 'th' ? 'ค่าเฉลี่ยทั่วโลก' : 'Global Average'} values={[GLOBAL.orig, GLOBAL.unrel, GLOBAL.rel]} />
        </div>

        <div className="fm-summary-rounds">
          {roundResults.map(r => {
            const pct = Math.round((r.correct / r.total) * 100)
            return (
              <div key={r.roundNum} className="fm-summary-row">
                <span className="fm-summary-round-label">
                  {lang === 'th' ? `รอบ ${r.roundNum}` : `Round ${r.roundNum}`}
                </span>
                <div className="fm-summary-bar-wrap">
                  <div className="fm-summary-bar" style={{ width: `${pct}%` }} />
                </div>
                <span className="fm-summary-round-score">{r.correct}/{r.total} — {pct}%</span>
              </div>
            )
          })}
        </div>

        <div className="fm-summary-actions">
          <button className="fm-btn" onClick={resetAll}>{t.playAgain}</button>
        </div>
      </div>
    )
  }

  return null
}