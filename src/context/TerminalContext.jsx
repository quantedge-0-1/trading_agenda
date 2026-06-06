import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { api } from '../services/terminalApi.js'

const Ctx = createContext(null)
export const useTerminal = () => useContext(Ctx)

const TERMINAL_BASE = 'http://localhost:8001'

function saveCache(data) {
  try { localStorage.setItem('terminal_cache', JSON.stringify({ ...data, ts: Date.now() })) } catch {}
}

function loadCache() {
  try {
    const raw = localStorage.getItem('terminal_cache')
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function TerminalProvider({ children }) {
  const [connected, setConnected]         = useState(null)   // null=checking, true, false
  const [xauPrice, setXauPrice]           = useState(null)
  const [xauDir, setXauDir]               = useState(null)   // 'up' | 'down' | null
  const [upcoming, setUpcoming]           = useState([])
  const [released, setReleased]           = useState([])
  const [preRelease, setPreRelease]       = useState({ active: false })
  const [postSignal, setPostSignal]       = useState(null)

  // Local Economic Intelligence Terminal (localhost:8001)
  const [terminalStatus, setTerminalStatus] = useState('checking') // 'checking' | 'connected' | 'offline'
  const [terminalData, setTerminalData]     = useState(() => loadCache())

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
        if (!firstLoad && !seenIds.current.has(e.id)) setPostSignal(e)
        seenIds.current.add(e.id)
      })

      if (firstLoad) rel.forEach(e => seenIds.current.add(e.id))
      setReleased(rel.slice(0, 3))
    } catch { /* silent */ }
  }, [])

  const fetchPreRelease = useCallback(async () => {
    try {
      setPreRelease(await api.preRelease())
    } catch {
      setPreRelease({ active: false })
    }
  }, [])

  // Poll the local Economic Intelligence Terminal
  const fetchTerminal = useCallback(async () => {
    try {
      const health = await fetch(`${TERMINAL_BASE}/health`, {
        signal: AbortSignal.timeout(3000),
      })
      if (!health.ok) throw new Error('unhealthy')

      const [biasRes, newsRes, preRes] = await Promise.allSettled([
        fetch(`${TERMINAL_BASE}/api/v1/market/session-bias`).then(r => r.json()),
        fetch(`${TERMINAL_BASE}/api/v1/news/live`).then(r => r.json()),
        fetch(`${TERMINAL_BASE}/api/v1/pre-release/status`).then(r => r.json()),
      ])

      const data = {
        sessionBias:       biasRes.status === 'fulfilled' ? biasRes.value : null,
        lastRelease:       newsRes.status === 'fulfilled' ? (newsRes.value?.events?.[0] ?? newsRes.value) : null,
        preReleaseTerminal: preRes.status === 'fulfilled' ? preRes.value : null,
      }

      saveCache(data)
      setTerminalData(data)
      setTerminalStatus('connected')
    } catch {
      setTerminalStatus('offline')
    }
  }, [])

  useEffect(() => {
    fetchPrices()
    fetchCalendar()
    fetchPreRelease()
    fetchTerminal()

    const t1 = setInterval(fetchPrices,     30_000)
    const t2 = setInterval(fetchCalendar,   30_000)
    const t3 = setInterval(fetchPreRelease, 60_000)
    const t4 = setInterval(fetchTerminal,   30_000)

    return () => { clearInterval(t1); clearInterval(t2); clearInterval(t3); clearInterval(t4) }
  }, [fetchPrices, fetchCalendar, fetchPreRelease, fetchTerminal])

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
      terminalStatus,
      terminalData,
    }}>
      {children}
    </Ctx.Provider>
  )
}
