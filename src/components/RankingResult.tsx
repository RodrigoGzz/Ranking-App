import React from 'react'

type Props = {
  ranking: { item: string; score: number }[]
}

export default function RankingResult({ ranking }: Props) {
  if (ranking.length === 0) return <p>No hay resultados aún.</p>
  return (
    <ol className="card">
      {ranking.map(({ item, score }, i) => (
        <li key={i} className="row" style={{ justifyContent: 'space-between' }}>
          <div className="row" style={{ gap: 8 }}>
            <span className={`num-bullet ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}`}>{i + 1}</span>
            <span>{item}</span>
          </div>
          <small>pts: {score}</small>
        </li>
      ))}
    </ol>
  )
}
