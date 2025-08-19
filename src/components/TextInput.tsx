import React from 'react'

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function TextInput({ value, onChange, placeholder }: Props) {
  return (
    <div className="stack">
      <label htmlFor="items">Ingresa uno por línea</label>
      <textarea
        id="items"
        placeholder={placeholder ?? 'Ejemplo:\nManzana\nBanana\nNaranja'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
