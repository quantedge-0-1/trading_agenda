// In dev: Vite proxies /terminal/* → localhost:8001/*  (no CORS issues, works from phone too)
// In prod build: falls back to direct URL — backend needs CORS enabled for that to work
const BASE = import.meta.env.DEV
  ? '/terminal'
  : `http://${window.location.hostname}:8001`

async function get(path) {
  const res = await fetch(`${BASE}${path}`, { signal: AbortSignal.timeout(5000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export const api = {
  prices:     () => get('/api/v1/prices/live'),
  upcoming:   () => get('/api/v1/calendar/upcoming'),
  released:   () => get('/api/v1/calendar/just-released'),
  preRelease: () => get('/api/v1/pre-release/status'),
  analysis:   () => get('/api/v1/analysis/consolidated'),
  alerts:     () => get('/api/v1/alerts/'),
}
