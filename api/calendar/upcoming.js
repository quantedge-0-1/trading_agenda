import { EVENTS, toShape } from '../_events.js'

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Access-Control-Allow-Origin', '*')

  const now = Date.now()
  const events = EVENTS
    .filter(e => new Date(e.date).getTime() > now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 8)
    .map(toShape)

  res.json({ events })
}
