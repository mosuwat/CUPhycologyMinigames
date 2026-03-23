import React, { useState, useRef } from 'react'
import './MontyHall.css'

const TOTAL_DOORS = 3

function getInitialDoors() {
  const prizeDoor = Math.floor(Math.random() * TOTAL_DOORS)
  return Array.from({ length: TOTAL_DOORS }, (_, i) => ({
    id: i,
    hasPrize: i === prizeDoor,
    isOpen: false,
    isSelected: false,
  }))
}

// Stages: 'pick' → 'switch_or_stay' → 'result'
export default function MontyHall() {
  const [doors, setDoors] = useState(getInitialDoors)
  const [stage, setStage] = useState('pick')
  const [firstPick, setFirstPick] = useState(null)
  const [stats, setStats] = useState({ played: 0, switchWins: 0, stayWins: 0 })
  const [lastAction, setLastAction] = useState(null)
  const [resultWon, setResultWon] = useState(false)
  const pickHandled = useRef(false)

  function handleDoorClick(id) {
    if (stage === 'pick') {
      if (pickHandled.current) return
      pickHandled.current = true

      setFirstPick(id)
      setDoors(d => d.map(door => ({ ...door, isSelected: door.id === id })))

      setTimeout(() => {
        setDoors(prev => {
          const prizeId = prev.find(d => d.hasPrize).id
          let candidates = prev.filter(d => d.id !== id && d.id !== prizeId)
          if (candidates.length === 0) candidates = prev.filter(d => d.id !== id)
          const toOpen = candidates[Math.floor(Math.random() * candidates.length)]
          return prev.map(d => d.id === toOpen.id ? { ...d, isOpen: true } : d)
        })
        setStage('switch_or_stay')
      }, 600)

    } else if (stage === 'switch_or_stay') {
      const clickedDoor = doors.find(d => d.id === id)
      if (!clickedDoor || clickedDoor.isOpen) return

      const action = id === firstPick ? 'stay' : 'switch'
      const won = clickedDoor.hasPrize

      setLastAction(action)
      setResultWon(won)
      setDoors(d => d.map(door => ({
        ...door,
        isOpen: true,
        isSelected: door.id === id,
      })))
      setStats(s => ({
        played: s.played + 1,
        switchWins: s.switchWins + (action === 'switch' && won ? 1 : 0),
        stayWins: s.stayWins + (action === 'stay' && won ? 1 : 0),
      }))
      setStage('result')
    }
  }

  function reset() {
    pickHandled.current = false
    setDoors(getInitialDoors())
    setStage('pick')
    setFirstPick(null)
    setLastAction(null)
    setResultWon(false)
  }

  const instructions = {
    pick: 'Choose a door — one hides a prize.',
    switch_or_stay: 'A goat was revealed. Switch to the other door, or stay with your pick?',
    result: resultWon ? '🎉 You won!' : '🐐 You got a goat.',
  }

  const totalWins = stats.switchWins + stats.stayWins
  const winRate = stats.played > 0 ? Math.round((totalWins / stats.played) * 100) : 0

  return (
    <div className="mh-container">
      <div className="mh-header">
        <h2>The Monty Hall Problem</h2>
        <p className="mh-desc">
          Pick a door. The host reveals a goat behind another door.
          Should you switch or stay?
        </p>
      </div>

      <div className="mh-instruction">{instructions[stage]}</div>

      <div className="mh-doors">
        {doors.map(door => (
          <button
            key={door.id}
            className={[
              'mh-door',
              door.isOpen ? 'open' : '',
              door.isSelected ? 'selected' : '',
              stage === 'result' && door.hasPrize ? 'prize' : '',
              stage === 'pick' ? 'clickable' : '',
              stage === 'switch_or_stay' && !door.isOpen ? 'clickable' : '',
            ].filter(Boolean).join(' ')}
            onClick={() => handleDoorClick(door.id)}
            disabled={door.isOpen || stage === 'result'}
          >
            <div className="mh-door-inner">
              <div className="mh-door-front">
                <span className="mh-door-num">{door.id + 1}</span>
              </div>
              <div className="mh-door-back">
                {door.hasPrize
                  ? <span className="mh-icon">🏆</span>
                  : <span className="mh-icon">🐐</span>
                }
              </div>
            </div>
            {door.isSelected && stage !== 'result' && (
              <div className="mh-selected-badge">Your pick</div>
            )}
          </button>
        ))}
      </div>

      {stage === 'result' && (
        <div className={`mh-result ${resultWon ? 'won' : 'lost'}`}>
          <div className="mh-result-text">
            You chose to <strong>{lastAction}</strong>.{' '}
            {resultWon ? 'Great call!' : 'Better luck next time.'}
          </div>
          <button className="mh-btn" onClick={reset}>Play Again</button>
        </div>
      )}

      {stats.played > 0 && (
        <>
          <div className="mh-winrate">
            Overall win rate: <strong>{winRate}%</strong>
            <span className="mh-winrate-sub">{totalWins} wins / {stats.played} games</span>
          </div>
          <div className="mh-stats">
            <div className="mh-stat">
              <span className="mh-stat-label">Games played</span>
              <span className="mh-stat-val">{stats.played}</span>
            </div>
            <div className="mh-stat">
              <span className="mh-stat-label">Switch wins</span>
              <span className="mh-stat-val green">{stats.switchWins}</span>
            </div>
            <div className="mh-stat">
              <span className="mh-stat-label">Stay wins</span>
              <span className="mh-stat-val">{stats.stayWins}</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}