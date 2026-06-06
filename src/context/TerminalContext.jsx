import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { api } from '../services/terminalApi.js'

const Ctx = createContext(null)
export const useTerminal = () => useContext(Ctx)

export function TerminalProvider({ children }) {
  const [connected, setConnected]     = useState(null)   // null=checking, true, false
  const [xauPrice, setXauPrice]       = useState(null)
  const [xauDir, setXauDir]           = useState(null)   // 'up' | 'down' | null
  const [upcoming, setUpcoming]       = useState([])
  const [released, setReleased]       = useState([])
  const [preRelease, setPreRelease]   = useState({ active: false })
  const [postSignal, setPostSignal]   = useState(null)   // event that just released → modal

  const prevPrice = useRef(null)
  const seenIds   = useRef(new Set())

  const fetchPrices = useCallback(async () => {
    try {
      const data = await api.prices()
      const p = data.prices?.XAUUSD?.price
      if (p != null) {
        if (prevPrice.current != null) {
          setXauDir(p > prevPrice.current ? 'up' : p < prevPrice.current ? 'down' : null)
        }
        prevPrice.current = p
        setXauPrice(p)
        setConnected(true)
      }
    } catch {
      setConnected(false)
    }
  }, [])

  const fetchCalendar = useCallback(async () => {
    try {
      const [upData, relData] = await Promise.all([api.upcoming(), api.released()])
      setUpcoming((upData.events || []).slice(0, 5))

      const rel = relData.events || []
      const firstLoad = seenIds.current.size === 0

      rel.forEach(e => {
        if (!firstLoad && !seenIds.current.has(e.id)) {
          setPostSignal(e)
        }
        seenIds.current.add(e.id)
      })

      if (firstLoad) rel.forEach(e => seenIds.current.add(e.id))
      setReleased(rel.slice(0, 3))
    } catch { /* silent — no error to user */ }
  }, [])

  const fetchPreRelease = useCallback(async () => {
    try {
      setPreRelease(await api.preRelease())
    } catch {
      setPreRelease({ active: false })
    }
  }, [])

  useEffect(() => {
    fetchPrices()
    fetchCalendar()
    fetchPreRelease()

    const t1 = setInterval(fetchPrices,     30_000)
    const t2 = setInterval(fetchCalendar,   30_000)
    const t3 = setInterval(fetchPreRelease, 60_000)

    return () => { clearInterval(t1); clearInterval(t2); clearInterval(t3) }
  }, [fetchPrices, fetchCalendar, fetchPreRelease])

  return (
    <Ctx.Provider value={{
      connected,
      xauPrice,
      xauDir,
      upcoming,
      released,
      preRelease,
      postSignal,
      clearSignal: () => setPostSignal(null),
    }}>
      {children}
    </Ctx.Provider>
  )
}
