import React from 'react'

export type MatchupPair = { a: string; b: string }

type Props = {
  pair: MatchupPair
  onPick: (winner: 'a' | 'b') => void
  index: number
  total: number
}

export default function Matchup({ pair, onPick, index, total }: Props) {
  return (
    <div className="stack card" role="group" aria-label="Enfrentamiento">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <strong>Enfrentamiento {index + 1} </strong>
      </div>
      <div className="row" style={{ justifyContent: 'space-evenly' }}>
        <button className="button primary button-lg" onClick={() => onPick('a')}>
          {pair.a}
        </button>
        <span>vs</span>
        <button className="button primary button-lg" onClick={() => onPick('b')}>
          {pair.b}
        </button>
      </div>
    </div>
  )
}
