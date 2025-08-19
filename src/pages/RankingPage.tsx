import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Matchup from '../components/Matchup'
import { nextUnknownPair, rankWithTransitivityScores, countUnknownPairs, type Comparison } from '../utils/ranking'

export default function RankingPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const items = useMemo(() => {
    try {
      const raw = params.get('items')
      if (!raw) return []
  // URLSearchParams ya decodifica el valor
  return JSON.parse(raw) as string[]
    } catch {
      return []
    }
  }, [params])

  // historial de comparaciones para poda transitiva
  const [history, setHistory] = useState<Comparison[]>([])
  const nextPair = useMemo(() => nextUnknownPair(items, history), [items, history])
  const remaining = useMemo(() => countUnknownPairs(items, history), [items, history])

  // Cuando no quedan enfrentamientos necesarios, navegar automáticamente a resultados
  useEffect(() => {
    if (!nextPair && items.length >= 2) {
      const ranking = rankWithTransitivityScores(items, history)
      const encoded = encodeURIComponent(JSON.stringify(ranking))
      navigate(`/results?ranking=${encoded}`)
    }
  }, [nextPair, items, history, navigate])

  if (items.length < 2) {
    return (
      <div className="container">
        <p>Lista inválida. Volvé al inicio.</p>
        <button className="button" onClick={() => navigate('/')}>Volver</button>
      </div>
    )
  }

  const onPick = (choice: 'a' | 'b') => {
    if (!nextPair) return
    const winner = choice === 'a' ? nextPair.a : nextPair.b
    const loser = choice === 'a' ? nextPair.b : nextPair.a
    setHistory((h) => [...h, { winner, loser }])
  }

  return (
    <div className="container">
      <header className="header">
        <h2>Enfrentamientos</h2>
  <small>Restantes aprox: {remaining}</small>
      </header>
      {nextPair ? (
        <Matchup pair={nextPair} onPick={onPick} index={history.length} total={Infinity} />
      ) : null}
    </div>
  )
}
