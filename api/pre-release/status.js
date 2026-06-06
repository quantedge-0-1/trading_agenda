import { EVENTS } from '../_events.js'

const PRE_WINDOW_MIN = 30 // warn 30 min before

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Access-Control-Allow-Origin', '*')

  const now = Date.now()
  const next = EVENTS
    .filter(e => new Date(e.date).getTime() > now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0]

  if (!next) return res.json({ active: false })

  const minutesUntil = (new Date(next.date).getTime() - now) / 60000

  if (minutesUntil <= PRE_WINDOW_MIN) {
    return res.json({
      active:        true,
      event_name:    next.name,
      importance:    next.importance,
      minutes_until: minutesUntil,
      event_date:    next.date,
    })
  }

  res.json({ active: false, next_event: next.name, minutes_until: minutesUntil })
}
