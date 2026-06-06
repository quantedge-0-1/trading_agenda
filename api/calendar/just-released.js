import { EVENTS, toShape } from '../_events.js'

const WINDOW_MS = 4 * 60 * 60 * 1000 // 4 hours

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Access-Control-Allow-Origin', '*')

  const now = Date.now()
  const events = EVENTS
    .filter(e => {
      const t = new Date(e.date).getTime()
      return t <= now && (now - t) <= WINDOW_MS
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)
    .map(toShape)

  res.json({ events })
}
