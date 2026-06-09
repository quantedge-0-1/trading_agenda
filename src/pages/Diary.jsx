import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { inter } from '../utils/styles.js'
import { useToast } from '../context/ToastContext.jsx'

const FILTERS = ['todo', 'semana', 'wins', 'losses']

const CSV_HEADERS = ['fecha','instrumento','dirección','sesión','entrada','stop_loss','take_profit','cierre','pnl','resultado','rr_planificado','setup','emoción','lección']

function escapeCSV(v) {
  if (v == null) return ''
  const s = String(v)
  return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s
}

function buildCSV(trades) {
  const rows = [CSV_HEADERS.join(',')]
  trades.forEach(t => {
    rows.push([
      t.date,
      t.instrument || 'XAUUSD',
      t.direction || '',
      t.session || '',
      t.entry_price ?? '',
      t.stop_loss ?? '',
      t.take_profit ?? '',
      t.result_price ?? '',
      t.pnl ?? 0,
      t.result || '',
      t.rr_planned ?? '',
      t.setup?.entry_zone || '',
      t.emotion_before || '',
      t.lesson || '',
    ].map(escapeCSV).join(','))
  })
  return rows.join('\r\n')
}

function fmtDate(iso) {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('es', { month: 'short', day: 'numeric' })
}
function fmt(n) { return (n >= 0 ? '+' : '') + Number(n).toFixed(0) }
function fmtFull(n) { return (n >= 0 ? '+' : '') + Number(n).toFixed(2) }

export default function Diary() {
  const { trades, deleteTrade } = useApp()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('todo')
  const [expanded, setExpanded] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  function exportCSV() {
    if (trades.length === 0) { addToast('No hay operaciones para exportar', 'warning'); return }
    const csv  = buildCSV([...trades].sort((a, b) => a.date.localeCompare(b.date)))
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `trade_log_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    addToast(`${trades.length} operaciones exportadas`, 'success')
  }

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
      <div style={{ padding: '10px 14px 9px', borderBottom: '1px solid #1a2535', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: '#3a4a5a', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 2px', ...inter }}>Historial</p>
          <p style={{ color: '#e8edf2', fontSize: 13, fontWeight: 700, margin: 0, letterSpacing: '0.04em' }}>TRADE LOG</p>
        </div>
        <button onClick={exportCSV} style={{
          background: 'none', border: '1px solid #1a2535', color: '#7a8a9a',
          padding: '5px 10px', fontSize: 9, fontFamily: 'inherit', cursor: 'pointer',
          letterSpacing: '0.08em', textTransform: 'uppercase', ...inter,
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          CSV
        </button>
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

                      {/* Action buttons */}
                      {deleteConfirm === t.id ? (
                        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              deleteTrade(t.id)
                              setExpanded(null)
                              setDeleteConfirm(null)
                              addToast('Operación eliminada', 'warning')
                            }}
                            style={{ flex: 1, padding: '9px 0', background: 'rgba(255,51,85,0.12)', border: '1px solid #ff3355', color: '#ff3355', fontSize: 11, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', letterSpacing: '0.06em', ...inter }}
                          >CONFIRMAR</button>
                          <button
                            onClick={e => { e.stopPropagation(); setDeleteConfirm(null) }}
                            style={{ flex: 1, padding: '9px 0', background: 'none', border: '1px solid #1a2535', color: '#7a8a9a', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', letterSpacing: '0.06em', ...inter }}
                          >CANCELAR</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              navigate('/register', {
                                state: {
                                  editId: t.id,
                                  prefill: {
                                    direction: t.direction          ?? '',
                                    session:   t.session            ?? '',
                                    entry:     t.entry_price  != null ? String(t.entry_price)  : '',
                                    sl:        t.stop_loss    != null ? String(t.stop_loss)    : '',
                                    tp:        t.take_profit  != null ? String(t.take_profit)  : '',
                                    exitPrice: t.result_price != null ? String(t.result_price) : '',
                                    contracts: t.contracts    != null ? String(t.contracts)    : '1',
                                    pnl:       t.pnl          != null ? t.pnl                  : '',
                                    result:    t.result           ?? '',
                                    setup:     t.setup?.entry_zone ?? '',
                                    note:      t.lesson            ?? '',
                                    emotion:   t.emotion_before    ?? '',
                                  },
                                },
                              })
                            }}
                            style={{ flex: 2, padding: '9px 0', background: 'rgba(0,136,255,0.08)', border: '1px solid #0088ff', color: '#0088ff', fontSize: 11, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', letterSpacing: '0.06em', ...inter }}
                          >EDITAR</button>
                          <button
                            onClick={e => { e.stopPropagation(); setDeleteConfirm(t.id) }}
                            style={{ flex: 1, padding: '9px 0', background: 'none', border: '1px solid #ff3355', color: '#ff3355', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', letterSpacing: '0.06em', ...inter }}
                          >ELIMINAR</button>
                        </div>
                      )}
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
