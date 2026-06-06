// API routes are served by Vercel serverless functions (/api/*).
// In local dev (npm run dev), these 404 → connected=false is expected.
// Use `vercel dev` locally if you need live data during development.

async function get(path) {
  const res = await fetch(path, { signal: AbortSignal.timeout(6000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export const api = {
  prices:     () => get('/api/prices'),
  upcoming:   () => get('/api/calendar/upcoming'),
  released:   () => get('/api/calendar/just-released'),
  preRelease: () => get('/api/pre-release/status'),
}
