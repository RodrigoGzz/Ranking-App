import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import RankingPage from './pages/RankingPage'
import ResultsPage from './pages/ResultsPage'

export default function App() {
  return (
    <>
      <nav className="container header">
        <Link to="/" className="btn-topbar">Inicio</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rank" element={<RankingPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  )
}
