import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { api } from '../services/terminalApi.js'

const Ctx = createContext(null)
export const useTerminal = () => useContext(Ctx)

// Public Railway URL (set in .env.production / Vercel dashboard) — falls back to localhost
const TERMINAL_BASE = (import.meta.env.VITE_TERMINAL_URL || 'http://localhost:8001').replace(/\/$/, '')
const DELAY_THRESHOLD_MS = 120_000  // 2 min → yellow badge

function saveCache(data) {
  try {
    localStorage.setItem('terminal_cache', JSON.stringify({ ...data, ts: Date.now() }))
  } catch {}
}

function loadCache() {
  try {
    const raw = localStorage.getItem('terminal_cache')
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

async function terminalFetch(path, timeoutMs = 5000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(`${TERMINAL_BASE}${path}`, { signal: controller.signal })
    if (!res.ok) throw new Error(`${res.status}`)
    return res.json()
  } finally {
    clearTimeout(timer)
  }
}

export function TerminalProvider({ children }) {
  const [xauPrice, setXauPrice]     = useState(null)
  const [xauDir, setXauDir]         = useState(null)   // 'up' | 'down' | null
  const [upcoming, setUpcoming]     = useState([])
  const [released, setReleased]     = useState([])
  const [preRelease, setPreRelease] = useState({ active: false })
  const [postSignal, setPostSignal] = useState(null)

  // 'checking' | 'connected' | 'delay' | 'offline'
  const [terminalStatus, setTerminalStatus] = useState('checking')
  const [terminalData, setTerminalData]     = useState(() => loadCache())
  const [lastUpdateTs, setLastUpdateTs]     = useState(null)

  const connected = terminalStatus === 'connected' || terminalStatus === 'delay'

  const prevPrice   = useRef(null)
  const seenIds     = useRef(new Set())
  const wsRef       = useRef(null)
  const wsRetry     = useRef(null)

  // Keep a ref in sync so interval callbacks always read the latest connection state
  // without needing to be recreated (avoids stale closure in setInterval)
  const connectedRef = useRef(false)
  useEffect(() => { connectedRef.current = connected }, [connected])

  // ── Price: terminal first, Vercel Yahoo Finance fallback ──────────────────
  const fetchPrice = useCallback(async () => {
    try {
      let price = null
      if (connectedRef.current) {
        const data = await terminalFetch('/api/v1/prices/XAUUSD')
        price = data?.price ?? null
      } else {
        const data = await api.prices()
        price = data?.prices?.XAUUSD?.price ?? null
      }
      if (price != null) {
        setXauDir(prevPrice.current != null
          ? price > prevPrice.current ? 'up' : price < prevPrice.current ? 'down' : null
          : null)
        prevPrice.current = price
        setXauPrice(price)
      }
    } catch {
      // Price failure is silent — keep last value
    }
  }, []) // stable — reads connectedRef.current at call time

  // ── Calendar: terminal first, Vercel serverless fallback ─────────────────
  const fetchCalendar = useCallback(async () => {
    try {
      let upData = null, relData = null

      if (connectedRef.current) {
        const [upResult, relResult] = await Promise.allSettled([
          terminalFetch('/api/v1/calendar/upcoming?hours=48&currencies=USD&importance=high'),
          terminalFetch('/api/v1/calendar/recent?hours=4&currencies=USD'),
        ])
        if (upResult.status === 'fulfilled')  upData  = upResult.value
        if (relResult.status === 'fulfilled') relData = relResult.value
      }

      // Fall back to Vercel serverless if terminal didn't supply data
      if (!upData)  upData  = await api.upcoming().catch(() => null)
      if (!relData) relData = await api.released().catch(() => null)

      setUpcoming((upData?.events || []).slice(0, 5))

      const rel       = relData?.events || []
      const firstLoad = seenIds.current.size === 0
      rel.forEach(e => {
        const key = e.id ?? `${e.event_name}:${e.event_at}`
        if (!firstLoad && !seenIds.current.has(key)) setPostSignal(e)
        seenIds.current.add(key)
      })
      if (firstLoad) rel.forEach(e => seenIds.current.add(e.id ?? `${e.event_name}:${e.event_at}`))
      setReleased(rel.slice(0, 3))
    } catch { /* silent */ }
  }, []) // stable — reads connectedRef.current at call time

  // ── Pre-release: from terminal when connected, Vercel otherwise ──────────
  const fetchPreRelease = useCallback(async () => {
    try {
      if (connectedRef.current) {
        setPreRelease(await terminalFetch('/api/v1/pre-release/status'))
      } else {
        setPreRelease(await api.preRelease())
      }
    } catch {
      setPreRelease({ active: false })
    }
  }, []) // stable — reads connectedRef.current at call time

  // ── Terminal health + bias + live release ─────────────────────────────────
  const fetchTerminal = useCallback(async () => {
    try {
      await terminalFetch('/health', 8000)

      const [biasRes, newsRes] = await Promise.allSettled([
        terminalFetch('/api/v1/market/session-bias'),
        terminalFetch('/api/v1/news/live'),
      ])

      const now = Date.now()
      const data = {
        sessionBias:  biasRes.status === 'fulfilled' ? biasRes.value : null,
        lastRelease:  newsRes.status === 'fulfilled' ? (newsRes.value?.events?.[0] ?? null) : null,
        ts:           now,
      }

      saveCache(data)
      setTerminalData(data)
      setLastUpdateTs(now)
      setTerminalStatus('connected')
    } catch {
      setTerminalStatus('offline')
    }
  }, [])

  // ── DELAY watchdog: connected but no update in 2+ min ────────────────────
  useEffect(() => {
    if (terminalStatus !== 'connected') return
    const id = setInterval(() => {
      if (lastUpdateTs && Date.now() - lastUpdateTs > DELAY_THRESHOLD_MS) {
        setTerminalStatus('delay')
      }
    }, 15_000)
    return () => clearInterval(id)
  }, [terminalStatus, lastUpdateTs])

  // ── WebSocket for real-time release alerts ────────────────────────────────
  const connectWS = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    const wsUrl = TERMINAL_BASE.replace(/^http/, 'ws') + '/ws/terminal'
    let ws
    try {
      ws = new WebSocket(wsUrl)
    } catch {
      return
    }

    ws.onopen = () => {
      wsRef.current = ws
      ws._pingId = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) ws.send('ping')
      }, 30_000)
    }

    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data)
        if (msg.type === 'release' && msg.event) {
          const ev = msg.event
          setPostSignal(ev)
          if ('vibrate' in navigator) navigator.vibrate([200, 100, 200])
        }
      } catch {}
    }

    ws.onclose = () => {
      clearInterval(ws._pingId)
      wsRef.current = null
      wsRetry.current = setTimeout(connectWS, 10_000)
    }

    ws.onerror = () => {
      ws.close()
    }
  }, [])

  // ── Bootstrap ─────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchTerminal()
    fetchPrice()
    fetchCalendar()
    fetchPreRelease()
    connectWS()

    const t1 = setInterval(fetchTerminal,   30_000)
    const t2 = setInterval(fetchPrice,      30_000)
    const t3 = setInterval(fetchCalendar,   30_000)
    const t4 = setInterval(fetchPreRelease, 60_000)

    return () => {
      clearInterval(t1); clearInterval(t2); clearInterval(t3); clearInterval(t4)
      clearTimeout(wsRetry.current)
      if (wsRef.current) { wsRef.current.close(); wsRef.current = null }
    }
  }, [fetchTerminal, fetchPrice, fetchCalendar, fetchPreRelease, connectWS])

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
