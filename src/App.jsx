import React, { useState } from 'react'
import MontyHall from './games/MontyHall'
import FalseMemory from './games/FalseMemory'
import './App.css'

const games = [
  {
    id: 'monty',
    title: 'Monty Hall',
    subtitle: 'Probability & Decision Making',
    desc: 'Pick a door, watch a goat revealed, then decide — switch or stay? The math will surprise you.',
    tag: 'Strategy',
  },
  {
    id: 'memory',
    title: 'False Memory',
    subtitle: 'Cognition & Recall',
    desc: 'Memorise a sequence of related words, then identify which ones actually appeared. Synonyms are your enemy.',
    tag: 'Memory',
  },
]

export default function App() {
  const [active, setActive] = useState(null)

  if (active === 'monty') {
    return (
      <div className="app">
        <nav className="app-nav">
          <button className="nav-back" onClick={() => setActive(null)}>← Games</button>
          <span className="nav-title">Monty Hall</span>
        </nav>
        <MontyHall />
      </div>
    )
  }

  if (active === 'memory') {
    return (
      <div className="app">
        <nav className="app-nav">
          <button className="nav-back" onClick={() => setActive(null)}>← Games</button>
          <span className="nav-title">False Memory</span>
        </nav>
        <FalseMemory />
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Minigames</h1>
        <p className="app-tagline">Two short experiments in psychology & probability</p>
      </header>

      <main className="app-grid">
        {games.map(g => (
          <button key={g.id} className="game-card" onClick={() => setActive(g.id)}>
            <div className="card-tag">{g.tag}</div>
            <h3>{g.title}</h3>
            <div className="card-subtitle">{g.subtitle}</div>
            <p className="card-desc">{g.desc}</p>
            <div className="card-play">Play →</div>
          </button>
        ))}
      </main>
    </div>
  )
}
