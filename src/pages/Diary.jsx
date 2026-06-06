import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { inter } from '../utils/styles.js'
const FILTERS = ['todo', 'semana', 'wins', 'losses']

function fmtDate(iso) {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('es', { month: 'short', day: 'numeric' })
}
function fmt(n) { return (n >= 0 ? '+' : '') + Number(n).toFixed(0) }
function fmtFull(n) { return (n >= 0 ? '+' : '') + Number(n).toFixed(2) }

export default function Diary() {
  const { trades } = useApp()
  const [filter, setFilter] = useState('todo')
  const [expanded, setExpanded] = useState(null)

  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())
  const weekStartStr = weekStart.toISOString().slice(0, 10)

  const filtered = trades.filter(t => {
    if (filter === 'semana')  return t.date >= weekStartStr
    if (filter === 'wins')    return t.result === 'win'
    if (filter === 'losses')  return t.result === 'loss'
    return true
  })

  const totalPnL  = filtered.reduce((s, t) => s + (t.pnl || 0), 0)
  const wins      = filtered.filter(t => t.result === 'win').length
  const winRate   = filtered.length ? Math.round(wins / filtered.length * 100) : 0
  const bestPnL   = filtered.length ? Math.max(...filtered.map(t => t.pnl || 0)) : 0
  const worstPnL  = filtered.length ? Math.min(...filtered.map(t => t.pnl || 0)) : 0

  const filterLabel = { todo: 'Todos', semana: 'Semana', wins: 'Wins', losses: 'Losses' }

  return (
    <div className="page">
      {/* Header */}
      <div style={{ padding: '10px 14px 9px', borderBottom: '1px solid #1a2535' }}>
        <p style={{ color: '#3a4a5a', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 2px', ...inter }}>Historial</p>
        <p style={{ color: '#e8edf2', fontSize: 13, fontWeight: 700, margin: 0, letterSpacing: '0.04em' }}>TRADE LOG</p>
      </div>

      {/* Stats strip */}
      <div style={{ display: 'flex', background: '#111820', borderBottom: '1px solid #1a2535', flexShrink: 0 }}>
        {[
          ['WIN RATE', `${winRate}%`,        winRate >= 50 ? '#00ff88' : '#ff3355'],
          ['P&L TOTAL', fmtFull(totalPnL),   totalPnL >= 0 ? '#00ff88' : '#ff3355'],
          ['TRADES',    filtered.length,      '#e8edf2'],
          ['MEJOR',     `+$${bestPnL.toFixed(0)}`, '#00ff88'],
        ].map(([l, v, c], i, arr) => (
          <div key={l} style={{ flex: 1, padding: '8px 6px', textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid #1a2535' : 'none' }}>
            <p style={{ margin: '0 0 2px', fontSize: 8, color: '#3a4a5a', textTransform: 'uppercase', letterSpacing: '0.1em', ...inter }}>{l}</p>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: c }}>{v}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', background: '#060a0f', borderBottom: '1px solid #1a2535', flexShrink: 0 }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            flex: 1, padding: '8px 0', border: 'none',
            borderBottom: filter === f ? '2px solid #00ff88' : '2px solid transparent',
            background: 'transparent', color: filter === f ? '#00ff88' : '#3a4a5a',
            fontSize: 10, fontWeight: filter === f ? 700 : 400, fontFamily: 'inherit',
            textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer',
            transition: 'color 0.15s',
          }}>{filterLabel[f]}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 4, WebkitOverflowScrolling: 'touch' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ color: '#3a4a5a', fontSize: 12, ...inter }}>Sin operaciones en este filtro</p>
          </div>
        ) : (
          <>
            {/* Column headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '52px 46px 64px 62px 40px 48px', padding: '6px 12px', borderBottom: '1px solid #1a2535', background: '#0d1117' }}>
              {['FECHA', 'DIR', 'ENTRADA', 'P&L', 'R:R', 'RESULT'].map(h => (
                <span key={h} style={{ fontSize: 8, color: '#3a4a5a', textTransform: 'uppercase', letterSpacing: '0.08em', ...inter }}>{h}</span>
              ))}
            </div>

            {filtered.map(t => {
              const isExp     = expanded === t.id
              const pnlColor  = (t.pnl || 0) >= 0 ? '#00ff88' : '#ff3355'
              const dirColor  = t.direction === 'LONG' ? '#00ff88' : '#ff3355'

              return (
                <div key={t.id}>
                  {/* Trade row */}
                  <div
                    onClick={() => setExpanded(isExp ? null : t.id)}
                    style={{ display: 'grid', gridTemplateColumns: '52px 46px 64px 62px 40px 48px', padding: '9px 12px', borderBottom: '1px solid #1a2535', cursor: 'pointer', background: isExp ? '#111820' : 'transparent', alignItems: 'center', transition: 'background 0.1s' }}
                  >
                    <span style={{ fontSize: 11, color: '#7a8a9a' }}>{fmtDate(t.date)}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: dirColor }}>{t.direction || '—'}</span>
                    <span style={{ fontSize: 11, color: '#e8edf2' }}>{t.entry_price ? t.entry_price.toLocaleString() : '—'}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: pnlColor }}>{fmtFull(t.pnl || 0)}</span>
                    <span style={{ fontSize: 11, color: '#7a8a9a' }}>{t.rr_planned ? `1:${t.rr_planned}` : '—'}</span>
                    <span className={t.result === 'win' ? 'badge-win' : t.result === 'loss' ? 'badge-loss' : 'badge-be'}>
                      {(t.result || '?').toUpperCase()}
                    </span>
                  </div>

                  {/* Expanded detail */}
                  {isExp && (
                    <div style={{ padding: '12px', background: '#0d1117', borderBottom: '1px solid #1a2535' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 10 }}>
                        {[['Sesión', t.session], ['Stop Loss', t.stop_loss || '—'], ['Take Profit', t.take_profit || '—'], ['Cierre', t.result_price || '—'], ['Fecha', t.date], ['Instrumento', t.instrument]].map(([l, v]) => (
                          <div key={l}>
                            <p style={{ margin: '0 0 2px', fontSize: 8, color: '#3a4a5a', textTransform: 'uppercase', ...inter }}>{l}</p>
                            <p style={{ margin: 0, fontSize: 11, color: '#e8edf2' }}>{v}</p>
                          </div>
                        ))}
                      </div>

                      {t.setup?.entry_zone && (
                        <div style={{ padding: '6px 8px', background: '#060a0f', border: '1px solid #1a2535', marginBottom: 6 }}>
                          <span style={{ fontSize: 9, color: '#3a4a5a', textTransform: 'uppercase', ...inter }}>Setup: </span>
                          <span style={{ fontSize: 10, color: '#e8edf2' }}>
                            {[t.setup.sweep_type, t.setup.structure_confirmation, t.setup.entry_zone, t.setup.timeframe_entry].filter(Boolean).join(' · ') || t.setup.entry_zone}
                          </span>
                        </div>
                      )}

                      {t.emotion_before && (
                        <p style={{ margin: '0 0 4px', fontSize: 10, color: '#7a8a9a' }}>
                          <span style={{ color: '#3a4a5a', ...inter }}>Emoción: </span>{t.emotion_before}{t.emotion_after ? ` → ${t.emotion_after}` : ''}
                        </p>
                      )}
                      {t.lesson && (
                        <div style={{ padding: '7px 10px', background: 'rgba(0,255,136,0.04)', borderLeft: '2px solid #00ff8840', marginTop: 4 }}>
                          <p style={{ margin: 0, fontSize: 11, color: '#e8edf2', lineHeight: 1.5 }}>{t.lesson}</p>
                        </div>
                      )}
                      {t.what_went_right && <p style={{ margin: '4px 0 0', fontSize: 10, color: '#00ff88' }}>✓ {t.what_went_right}</p>}
                      {t.what_to_improve && <p style={{ margin: '2px 0 0', fontSize: 10, color: '#ffcc00' }}>△ {t.what_to_improve}</p>}
                    </div>
                  )}
                </div>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}
