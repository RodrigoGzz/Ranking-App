import React from 'react'

export type MatchupPair = { a: string; b: string }

type Props = {
  pair: MatchupPair
  onPick: (winner: 'a' | 'b') => void
  index: number
  total: number
  onUndo?: () => void
}

export default function Matchup({ pair, onPick, index, total, onUndo }: Props) {
  return (
    <div className="stack card" role="group" aria-label="Enfrentamiento">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>Enfrentamiento {index + 1} </strong>
        {onUndo ? (
          <button className="button ghost" onClick={onUndo} aria-label="Deshacer última elección">
            Deshacer
          </button>
        ) : null}
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
