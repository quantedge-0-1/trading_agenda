import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { useTerminal } from '../context/TerminalContext.jsx'
import { WEEKLY_PLAN } from '../data/apex_data.js'
import { inter } from '../utils/styles.js'

function timeUntil(isoStr) {
  const diff = new Date(isoStr) - Date.now()
  if (diff <= 0) return 'AHORA'
  const d = Math.floor(diff / 86_400_000)
  const h = Math.floor((diff % 86_400_000) / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  if (d >= 1) return `${d}d ${h}h`
  if (h >= 1) return `${h}h ${m}m`
  return `${m}m`
}

function localTime(isoStr) {
  return new Date(isoStr).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
}

function beatMiss(actual, forecast) {
  if (actual == null || forecast == null) return null
  const pct = forecast !== 0 ? ((actual - forecast) / Math.abs(forecast)) * 100 : 0
  if (Math.abs(pct) < 2) return { label: 'INLINE', color: '#7a8a9a' }
  if (pct > 10)  return { label: '▲▲ BEAT',      color: '#00ff88' }
  if (pct > 2)   return { label: '▲ BEAT',        color: '#00ff88' }
  if (pct < -10) return { label: '▼▼ MISS',       color: '#ff3355' }
  return               { label: '▼ MISS',          color: '#ff3355' }
}

const importanceColor = { high: '#ff3355', medium: '#ffcc00', low: '#3a4a5a' }

// Extract macro bias direction from the weekly plan text
function macroDir(text) {
  const lower = text.toLowerCase()
  if (lower.includes('bajista')) return { usd: 'ALCISTA', xau: 'BAJISTA PRESIÓN', bias: 'bajista', pct: 30 }
  if (lower.includes('alcista')) return { usd: 'ALCISTA', xau: 'BAJISTA PRESIÓN', bias: 'bajista', pct: 30 }
  return { usd: 'NEUTRAL', xau: 'NEUTRAL', bias: 'neutral', pct: 50 }
}

export default function Home() {
  const { account, todayPnL, setDailyPnL, todayTrades, dayStatus, activeMode, setActiveMode } = useApp()
  const { upcoming, released } = useTerminal()
  const navigate = useNavigate()
  const [editingPnL, setEditingPnL] = useState(false)
  const [pnlInput,   setPnlInput]   = useState('')
  const [expandedId, setExpandedId] = useState(null)

  const drawdownPct   = Math.max(0, Math.min(100, account.drawdown_remaining / account.max_trailing_drawdown * 100))
  const progressPct   = Math.min(100, account.progress_pct)
  const drawdownColor = account.drawdown_remaining < 300 ? '#ff3355' : account.drawdown_remaining < 800 ? '#ffcc00' : '#00ff88'
  const pnlColor      = todayPnL >= 0 ? '#00ff88' : '#ff3355'
  const statusColor   = dayStatus === 'OPERANDO' ? '#00ff88' : '#ff3355'
  const stopLeft      = Math.max(0, 150 + todayPnL)

  // Risk manager progress: green→yellow→orange→red based on P&L
  const riskPct = Math.min(100, (Math.abs(Math.min(0, todayPnL)) / 150) * 100)
  const riskColor = riskPct > 80 ? '#ff3355' : riskPct > 50 ? '#ff7700' : riskPct > 25 ? '#ffcc00' : '#00ff88'

  const macro = macroDir(WEEKLY_PLAN.macro_bias)
  const levels = WEEKLY_PLAN.key_levels?.XAUUSD
  const bsl = levels?.resistance?.[0] ?? 4490
  const ssl = levels?.support?.[0] ?? 4442
  const eq  = Math.round((bsl + ssl) / 2)
  const biasBarPct = macro.bias === 'bajista' ? 30 : macro.bias === 'alcista' ? 70 : 50
  const biasLabel  = macro.bias === 'bajista' ? 'BAJISTA' : macro.bias === 'alcista' ? 'ALCISTA' : 'NEUTRAL'
  const biasColor  = macro.bias === 'bajista' ? '#ff3355' : macro.bias === 'alcista' ? '#00ff88' : '#ffcc00'

  function submitPnL() {
    const val = parseFloat(pnlInput)
    if (!isNaN(val)) setDailyPnL(val)
    setEditingPnL(false); setPnlInput('')
  }

  const CELL = (label, value, color = '#e8edf2', onClick) => (
    <div onClick={onClick} style={{ flex: 1, padding: '8px 6px', textAlign: 'center', borderRight: '1px solid #1a2535', cursor: onClick ? 'pointer' : 'default', minWidth: 0 }}>
      <p style={{ margin: '0 0 3px', fontSize: 9, color: '#7a8a9a', textTransform: 'uppercase', letterSpacing: '0.1em', ...inter }}>
        {label}
      </p>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {value}
      </p>
    </div>
  )

  return (
    <div className="page">
      <div className="page-content">

        {/* ── Account Status Strip ─────────────────────────── */}
        <div style={{ display: 'flex', background: '#111820', border: '1px solid #1a2535', marginBottom: 2 }}>
          {CELL('Balance', `$${account.current_balance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`)}
          {editingPnL ? (
            <div style={{ flex: 1, padding: '4px 6px', display: 'flex', gap: 4, borderRight: '1px solid #1a2535' }}>
              <input type="number" value={pnlInput} onChange={e => setPnlInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && submitPnL()} autoFocus style={{ width: '100%', fontSize: 12, padding: '2px 4px', textAlign: 'center' }} />
              <button onClick={submitPnL} style={{ background: '#00ff88', color: '#060a0f', border: 'none', padding: '2px 6px', fontSize: 10, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}>OK</button>
            </div>
          ) : (
            CELL('P&L Hoy', `${todayPnL >= 0 ? '+' : ''}$${todayPnL.toFixed(0)}`, pnlColor, () => { setEditingPnL(true); setPnlInput(todayPnL.toString()) })
          )}
          {CELL('Drawdown', `$${account.drawdown_remaining.toFixed(0)}`, drawdownColor)}
          <div style={{ flex: 1, padding: '8px 6px', textAlign: 'center', minWidth: 0 }}>
            <p style={{ margin: '0 0 3px', fontSize: 9, color: '#7a8a9a', textTransform: 'uppercase', letterSpacing: '0.1em', ...inter }}>Meta</p>
            <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 700, color: '#00ff88' }}>{progressPct.toFixed(1)}%</p>
          </div>
        </div>

        {/* Drawdown bar */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${drawdownPct}%`, background: drawdownColor }} />
        </div>

        {/* ── Active mode banner ───────────────────────────── */}
        {activeMode && (
          <div style={{ background: '#111820', borderLeft: '2px solid #00ff88', border: '1px solid #00ff8840', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#00ff88', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' }}>● OPERACIÓN ACTIVA</span>
            <button onClick={() => setActiveMode(false)} style={{ background: 'none', border: '1px solid #3a4a5a', color: '#7a8a9a', fontSize: 9, padding: '2px 8px', fontFamily: 'inherit', cursor: 'pointer', letterSpacing: '0.06em', ...inter }}>CERRAR</button>
          </div>
        )}

        {/* ── Macro Context Card ───────────────────────────── */}
        <div style={{ background: '#111820', border: '1px solid #1a2535' }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid #1a2535', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#3a4a5a', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', ...inter }}>RÉGIMEN MACRO</span>
            <span style={{ color: '#3a4a5a', fontSize: 9, ...inter }}>XAUUSD</span>
          </div>
          <div style={{ padding: '10px 12px' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
              <span style={{ color: '#7a8a9a', fontSize: 10, ...inter }}>USD:</span>
              <span style={{ color: '#00ff88', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em' }}>ALCISTA</span>
              <span style={{ color: '#3a4a5a', fontSize: 10 }}>◆</span>
              <span style={{ color: '#7a8a9a', fontSize: 10, ...inter }}>ORO:</span>
              <span style={{ color: '#ff3355', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em' }}>BAJISTA PRESIÓN</span>
            </div>
            <p style={{ margin: '0 0 4px', fontSize: 11, color: '#e8edf2', lineHeight: 1.5 }}>{WEEKLY_PLAN.macro_bias}</p>
            {WEEKLY_PLAN.high_impact_events?.[0] && (
              <p style={{ margin: 0, fontSize: 10, color: '#ffcc00', ...inter }}>
                Próx. catalizador: {WEEKLY_PLAN.high_impact_events[0].day} — {WEEKLY_PLAN.high_impact_events[0].event}
              </p>
            )}
          </div>
        </div>

        {/* ── Session Bias ─────────────────────────────────── */}
        <div style={{ background: '#111820', border: '1px solid #1a2535' }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid #1a2535', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#3a4a5a', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', ...inter }}>SESGO SESIÓN</span>
            <span style={{ color: biasColor, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em' }}>{biasLabel}</span>
          </div>
          <div style={{ padding: '10px 12px' }}>
            {/* Bias bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ color: '#00ff88', fontSize: 9, ...inter, letterSpacing: '0.06em', flexShrink: 0 }}>BULL</span>
              <div style={{ flex: 1, height: 4, background: '#1a2535', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${biasBarPct}%`, background: biasColor, transition: 'width 0.4s' }} />
              </div>
              <span style={{ color: '#ff3355', fontSize: 9, ...inter, letterSpacing: '0.06em', flexShrink: 0 }}>BEAR</span>
            </div>
            <p style={{ margin: '0 0 8px', fontSize: 10, color: '#7a8a9a', ...inter }}>Londres 08:00–13:00 Colombia · Nueva York 13:00–18:00</p>
            {/* Key levels */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
              {[['BSL', bsl, '#00ff88'], ['EQ', eq, '#7a8a9a'], ['SSL', ssl, '#ff3355']].map(([l, v, c]) => (
                <div key={l} style={{ textAlign: 'center', padding: '6px', background: '#060a0f', border: '1px solid #1a2535' }}>
                  <p style={{ margin: '0 0 2px', fontSize: 9, color: '#3a4a5a', textTransform: 'uppercase', ...inter }}>{l}</p>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: c }}>{v.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Just-released events ─────────────────────────── */}
        {released.length > 0 && (
          <div style={{ background: '#111820', border: '1px solid #1a2535' }}>
            <div style={{ padding: '7px 12px', borderBottom: '1px solid #1a2535' }}>
              <span style={{ color: '#3a4a5a', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', ...inter }}>PUBLICADO RECIENTEMENTE</span>
            </div>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '46px 1fr 80px 38px 38px', padding: '5px 12px', borderBottom: '1px solid #1a2535' }}>
              {['HORA', 'EVENTO', 'BADGE', 'USD', 'XAU'].map(h => (
                <span key={h} style={{ color: '#3a4a5a', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.08em', ...inter }}>{h}</span>
              ))}
            </div>
            {released.map(ev => {
              const bm = beatMiss(ev.actual, ev.forecast)
              const isExp = expandedId === ev.id
              const xauDir = bm ? (bm.label.includes('▲') ? '▲' : bm.label.includes('▼') ? '▼' : '—') : '—'
              const usdDir = bm ? (bm.label.includes('▲') ? '▲' : bm.label.includes('▼') ? '▼' : '—') : '—'
              return (
                <div key={ev.id} onClick={() => setExpandedId(isExp ? null : ev.id)}>
                  <div style={{ display: 'grid', gridTemplateColumns: '46px 1fr 80px 38px 38px', padding: '8px 12px', borderBottom: '1px solid #1a2535', cursor: 'pointer', alignItems: 'center' }}>
                    <span style={{ color: '#7a8a9a', fontSize: 10 }}>{localTime(ev.event_at)}</span>
                    <span style={{ color: '#e8edf2', fontSize: 10, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.event_name}</span>
                    {bm ? <span style={{ color: bm.color, fontSize: 9, fontWeight: 700, letterSpacing: '0.04em' }}>{bm.label}</span> : <span />}
                    <span style={{ color: usdDir === '▲' ? '#00ff88' : '#ff3355', fontSize: 11, textAlign: 'center' }}>{usdDir}</span>
                    <span style={{ color: xauDir === '▲' ? '#00ff88' : '#ff3355', fontSize: 11, textAlign: 'center' }}>{xauDir}</span>
                  </div>
                  {isExp && (
                    <div style={{ padding: '10px 12px', background: '#0d1117', borderBottom: '1px solid #1a2535' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
                        {[['Anterior', ev.previous], ['Forecast', ev.forecast], ['Actual', ev.actual]].map(([l, v]) => (
                          <div key={l} style={{ textAlign: 'center', padding: '6px', background: '#060a0f', border: '1px solid #1a2535' }}>
                            <p style={{ margin: '0 0 3px', fontSize: 9, color: '#3a4a5a', textTransform: 'uppercase', ...inter }}>{l}</p>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#e8edf2' }}>{v != null ? `${v}${ev.unit ?? ''}` : '—'}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ── Upcoming events ──────────────────────────────── */}
        {upcoming.length > 0 && (
          <div style={{ background: '#111820', border: '1px solid #1a2535' }}>
            <div style={{ padding: '7px 12px', borderBottom: '1px solid #1a2535' }}>
              <span style={{ color: '#3a4a5a', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', ...inter }}>PRÓXIMOS EVENTOS</span>
            </div>
            {upcoming.map(ev => (
              <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid #1a2535', borderLeft: ev.is_high_impact ? '2px solid #ff3355' : '2px solid transparent' }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: '0 0 1px', fontSize: 11, fontWeight: 600, color: ev.is_high_impact ? '#ff8844' : '#e8edf2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ev.is_high_impact && '⚡ '}{ev.event_name}
                  </p>
                  <p style={{ margin: 0, fontSize: 10, color: '#7a8a9a', ...inter }}>{ev.currency} · {localTime(ev.event_at)}</p>
                </div>
                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  <p style={{ margin: '0 0 1px', fontSize: 11, fontWeight: 700, color: importanceColor[ev.importance] ?? '#3a4a5a' }}>en {timeUntil(ev.event_at)}</p>
                  <p style={{ margin: 0, fontSize: 9, color: '#3a4a5a', textTransform: 'uppercase', ...inter }}>{ev.importance}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Quick actions ─────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button className="btn-primary" onClick={() => navigate('/register')} disabled={todayPnL <= -150} style={{ opacity: todayPnL <= -150 ? 0.35 : 1 }}>
            + REGISTRAR OPERACIÓN
          </button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            {[['CHECKLIST', '/checklist'], ['REGLAS', '/rules'], ['PLAN', '/weekly']].map(([l, p]) => (
              <button key={l} className="btn-secondary" onClick={() => navigate(p)} style={{ fontSize: 10, padding: '9px 4px' }}>{l}</button>
            ))}
          </div>
          <button onClick={() => setActiveMode(!activeMode)} style={{ background: activeMode ? 'rgba(255,51,85,0.07)' : 'rgba(0,255,136,0.07)', border: `1px solid ${activeMode ? '#ff3355' : '#00ff88'}`, color: activeMode ? '#ff3355' : '#00ff88', padding: '10px', fontSize: 11, fontWeight: 700, width: '100%', letterSpacing: '0.06em', fontFamily: 'inherit', cursor: 'pointer' }}>
            {activeMode ? '● OPERACIÓN ACTIVA — CERRAR' : '○ INICIAR MODO TRADING'}
          </button>
        </div>

        {/* ── Risk Manager Strip ───────────────────────────── */}
        <div style={{ background: '#111820', border: `1px solid ${riskColor}22` }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #1a2535' }}>
            <div style={{ flex: 1, padding: '7px 10px', borderRight: '1px solid #1a2535', textAlign: 'center' }}>
              <p style={{ margin: '0 0 2px', fontSize: 8, color: '#3a4a5a', textTransform: 'uppercase', letterSpacing: '0.1em', ...inter }}>Trades</p>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: todayTrades.length >= 2 ? '#ff3355' : '#e8edf2' }}>{todayTrades.length}/2</p>
            </div>
            <div style={{ flex: 1, padding: '7px 10px', borderRight: '1px solid #1a2535', textAlign: 'center' }}>
              <p style={{ margin: '0 0 2px', fontSize: 8, color: '#3a4a5a', textTransform: 'uppercase', letterSpacing: '0.1em', ...inter }}>P&L</p>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: pnlColor }}>{todayPnL >= 0 ? '+' : ''}${todayPnL.toFixed(0)}</p>
            </div>
            <div style={{ flex: 2, padding: '7px 10px', textAlign: 'center' }}>
              <p style={{ margin: '0 0 2px', fontSize: 8, color: '#3a4a5a', textTransform: 'uppercase', letterSpacing: '0.1em', ...inter }}>Stop disponible</p>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: riskColor }}>${stopLeft.toFixed(0)} de $150</p>
            </div>
          </div>
          <div className="progress-bar" style={{ height: 3 }}>
            <div className="progress-fill" style={{ width: `${riskPct}%`, background: riskColor }} />
          </div>
        </div>

        <div style={{ height: 4 }} />
      </div>
    </div>
  )
}
