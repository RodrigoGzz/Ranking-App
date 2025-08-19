import React, { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import RankingResult from '../components/RankingResult'

export default function ResultsPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const ranking = useMemo(() => {
    try {
      const raw = params.get('ranking')
      if (!raw) return []
  return JSON.parse(raw) as { item: string; score: number }[]
    } catch {
      return []
    }
  }, [params])

  return (
    <div className="container">
      <header className="header">
        <h2>Resultados</h2>
        <button className="button cta" onClick={() => navigate('/')}>Nuevo Ranking</button>
      </header>
      <RankingResult ranking={ranking} />
    </div>
  )
}
