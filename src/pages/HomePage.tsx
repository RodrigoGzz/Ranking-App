import React, { useState } from 'react'
import TextInput from '../components/TextInput'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const [text, setText] = useState('')
  const navigate = useNavigate()

  const onStart = () => {
    const items = text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
    const unique = Array.from(new Set(items))
    if (unique.length < 2) return alert('Ingresa al menos 2 elementos')
    const encoded = encodeURIComponent(JSON.stringify(unique))
    navigate(`/rank?items=${encoded}`)
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Ranking</h1>
      </header>
      <div className="stack">
        <TextInput value={text} onChange={setText} />
  <button className="button cta" onClick={onStart}>Comenzar Ranking</button>
      </div>
    </div>
  )
}
