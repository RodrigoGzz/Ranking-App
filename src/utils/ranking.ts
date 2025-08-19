export type Pair = { a: string; b: string }

// Genera todos los pares únicos (combinaciones) para comparar.
export function generateAllPairs(items: string[]): Pair[] {
  const res: Pair[] = []
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      res.push({ a: items[i], b: items[j] })
    }
  }
  return res
}

// Registra un voto sumando 1 punto al ganador.
export function tallyVote(
  scores: Record<string, number>,
  pair: Pair,
  choice: 'a' | 'b'
) {
  const winner = choice === 'a' ? pair.a : pair.b
  const next = { ...scores }
  next[winner] = (next[winner] ?? 0) + 1
  // asegura que todos existan en el mapa
  next[pair.a] = next[pair.a] ?? 0
  next[pair.b] = next[pair.b] ?? 0
  return next
}

// Convierte el mapa de puntajes en un ranking ordenado desc.
export function toRanking(scores: Record<string, number>) {
  const arr = Object.entries(scores).map(([item, score]) => ({ item, score }))
  arr.sort((a, b) => b.score - a.score || a.item.localeCompare(b.item))
  return arr
}

// ---------------------------
// Optimización por transitividad
// ---------------------------

export type Comparison = { winner: string; loser: string }

type TransitiveState = {
  above: Map<string, Set<string>>
  below: Map<string, Set<string>>
}

function buildClosure(items: string[], comps: Comparison[]): TransitiveState {
  const unique = Array.from(new Set(items.map((s) => s.trim()).filter(Boolean)))
  const set = new Set(unique)

  const above = new Map<string, Set<string>>()
  const below = new Map<string, Set<string>>()
  for (const it of unique) {
    above.set(it, new Set())
    below.set(it, new Set())
  }

  const addEdgeWithClosure = (a: string, b: string) => {
    if (!set.has(a) || !set.has(b) || a === b) return
    const aAbove = above.get(a)!
    const aBelow = below.get(a)!
    const bAbove = above.get(b)!
    const bBelow = below.get(b)!

    if (aAbove.has(b) || bBelow.has(a)) return // evitar ciclo
    if (aBelow.has(b) || bAbove.has(a)) return // ya conocido

    const winners: Set<string> = new Set([a])
    const losers: Set<string> = new Set([b])
    const up = [a]
    while (up.length) {
      const n = up.pop()!
      for (const u of above.get(n)!) if (!winners.has(u)) { winners.add(u); up.push(u) }
    }
    const down = [b]
    while (down.length) {
      const n = down.pop()!
      for (const d of below.get(n)!) if (!losers.has(d)) { losers.add(d); down.push(d) }
    }

    for (const w of winners) {
      const wBelow = below.get(w)!
      for (const l of losers) {
        if (w === l) continue
        const lAbove = above.get(l)!
        if (lAbove.has(w)) continue // conflicto
        wBelow.add(l)
        lAbove.add(w)
      }
    }
  }

  for (const { winner, loser } of comps) addEdgeWithClosure(winner, loser)

  return { above, below }
}

export function nextUnknownPair(items: string[], comps: Comparison[]): Pair | null {
  const unique = Array.from(new Set(items.map((s) => s.trim()).filter(Boolean)))
  const { above, below } = buildClosure(unique, comps)
  for (let i = 0; i < unique.length; i++) {
    for (let j = i + 1; j < unique.length; j++) {
      const a = unique[i], b = unique[j]
      if (!above.get(a)!.has(b) && !above.get(b)!.has(a) && !below.get(a)!.has(b) && !below.get(b)!.has(a)) {
        return { a, b }
      }
    }
  }
  return null
}

/**
 * Calcula un ranking aplicando poda por transitividad.
 * Regla: si X < Y y Y < Z entonces X < Z (sin comparar X vs Z).
 *
 * - items: conjunto de elementos a rankear (duplicados serán ignorados)
 * - comparisons: historial de enfrentamientos (ganador > perdedor)
 *
 * Retorna lista ordenada de mayor a menor (índice menor = mejor posición).
 * Si se detecta una comparación conflictiva que generaría ciclo, se ignora.
 */
export function rankWithTransitivity(items: string[], comparisons: Comparison[]): string[] {
  const unique = Array.from(new Set(items.map((s) => s.trim()).filter(Boolean)))
  const { above, below } = buildClosure(unique, comparisons)
  const adj = new Map<string, Set<string>>()
  const indeg = new Map<string, number>()
  for (const it of unique) {
    adj.set(it, new Set(below.get(it)))
    indeg.set(it, above.get(it)!.size)
  }

  // Kahn con cola ordenada alfabéticamente para determinismo
  const queue: string[] = unique.filter((it) => indeg.get(it) === 0).sort((a, b) => a.localeCompare(b))
  const result: string[] = []
  while (queue.length) {
    const node = queue.shift()!
    result.push(node)
    for (const nxt of adj.get(node)!) {
      indeg.set(nxt, (indeg.get(nxt) || 0) - 1)
      if (indeg.get(nxt) === 0) {
        // insertar manteniendo orden alfabético simple
        let i = 0
        while (i < queue.length && queue[i].localeCompare(nxt) < 0) i++
        queue.splice(i, 0, nxt)
      }
    }
  }

  // Si por algún motivo quedaron nodos (ciclos), agregarlos al final orden alfabético
  if (result.length < unique.length) {
    const remaining = unique.filter((x) => !result.includes(x)).sort((a, b) => a.localeCompare(b))
    result.push(...remaining)
  }

  return result
}

// Variante: retorna además un puntaje simple basado en cuántos elementos quedan por debajo
export function rankWithTransitivityScores(
  items: string[],
  comparisons: Comparison[]
): { item: string; score: number }[] {
  const unique = Array.from(new Set(items.map((s) => s.trim()).filter(Boolean)))
  const { above, below } = buildClosure(unique, comparisons)
  const order = rankWithTransitivity(unique, comparisons)
  const scores = new Map<string, number>()
  for (const it of unique) {
    scores.set(it, below.get(it)?.size ?? 0)
  }
  return order.map((item) => ({ item, score: scores.get(item) ?? 0 }))
}

// Cuenta los pares aún no decididos ni por comparación directa ni por transitividad
export function countUnknownPairs(items: string[], comparisons: Comparison[]): number {
  const unique = Array.from(new Set(items.map((s) => s.trim()).filter(Boolean)))
  const { above, below } = buildClosure(unique, comparisons)
  let count = 0
  for (let i = 0; i < unique.length; i++) {
    for (let j = i + 1; j < unique.length; j++) {
      const a = unique[i], b = unique[j]
      const decided = above.get(a)!.has(b) || above.get(b)!.has(a) || below.get(a)!.has(b) || below.get(b)!.has(a)
      if (!decided) count++
    }
  }
  return count
}
