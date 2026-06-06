// Serverless function: live XAUUSD price
// Primary:  Yahoo Finance (GC=F — COMEX Gold Futures front month)
// Fallback: metals.live (spot gold, no key)

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Primary: Yahoo Finance GC=F (Gold Futures — best institutional reference)
  try {
    const r = await fetch(
      'https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1m&range=1d&includePrePost=false',
      { headers: { 'User-Agent': 'Mozilla/5.0 TradingAgenda/1.0' }, signal: AbortSignal.timeout(6000) }
    )
    if (r.ok) {
      const data = await r.json()
      const meta  = data?.chart?.result?.[0]?.meta
      const price = meta?.regularMarketPrice ?? meta?.previousClose
      if (price) {
        return res.json({ prices: { XAUUSD: { price: Math.round(price * 100) / 100 } } })
      }
    }
  } catch (_) { /* fall through */ }

  // Fallback: Yahoo Finance XAUUSD=X (spot)
  try {
    const r = await fetch(
      'https://query2.finance.yahoo.com/v8/finance/chart/XAUUSD=X?interval=1m&range=1d',
      { headers: { 'User-Agent': 'Mozilla/5.0 TradingAgenda/1.0' }, signal: AbortSignal.timeout(5000) }
    )
    if (r.ok) {
      const data  = await r.json()
      const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice
      if (price) {
        return res.json({ prices: { XAUUSD: { price: Math.round(price * 100) / 100 } } })
      }
    }
  } catch (_) { /* fall through */ }

  // Last resort: metals.live (open REST API, no key)
  try {
    const r = await fetch('https://metals.live/api/v1/latest', { signal: AbortSignal.timeout(4000) })
    if (r.ok) {
      const arr   = await r.json()
      const price = arr?.[0]?.gold
      if (price) {
        return res.json({ prices: { XAUUSD: { price: Math.round(price * 100) / 100 } } })
      }
    }
  } catch (_) { /* all sources failed */ }

  res.status(503).json({ error: 'Price unavailable — all sources down' })
}
