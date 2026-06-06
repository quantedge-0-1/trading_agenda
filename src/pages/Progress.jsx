import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { SESSIONS, SKILLS } from '../data/apex_data.js'
import { inter, mono } from '../utils/styles.js'

const TABS = ['MÉTRICAS', 'SESIONES', 'SETUPS']

const skillColors = { green: '#00ff88', yellow: '#ffcc00', red: '#ff3355' }

function pfColor(pf) {
  const n = parseFloat(pf)
  if (isNaN(n)) return '#e8edf2'
  if (n >= 1.5) return '#00ff88'
  if (n >= 1.0) return '#ffcc00'
  return '#ff3355'
}

function MetricCell({ label, value, color = '#e8edf2', sub, border = true }) {
  return (
    <div style={{ flex: 1, padding: '10px 8px', textAlign: 'center', borderRight: border ? '1px solid #1a2535' : 'none' }}>
      <p style={{ margin: '0 0 4px', fontSize: 8, color: '#3a4a5a', textTransform: 'uppercase', letterSpacing: '0.1em', ...inter }}>{label}</p>
      <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color, ...mono }}>{value}</p>
      {sub && <p style={{ margin: '2px 0 0', fontSize: 9, color: '#3a4a5a', ...inter }}>{sub}</p>}
    </div>
  )
}

function TableRow({ cells, header = false, accent }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 52px 52px 64px',
      padding: '8px 12px', borderBottom: '1px solid #1a2535',
      borderLeft: accent ? `2px solid ${accent}` : '2px solid transparent',
      background: header ? '#0d1117' : 'transparent',
    }}>
      {cells.map(([v, c, align], i) => (
        <span key={i} style={{
          fontSize: header ? 8 : 11,
          color: header ? '#3a4a5a' : (c || '#e8edf2'),
          textTransform: header ? 'uppercase' : 'none',
          letterSpacing: header ? '0.08em' : '0.02em',
          fontWeight: !header && i === 0 ? 500 : header ? 400 : 700,
          textAlign: align || (i > 0 ? 'center' : 'left'),
          fontFamily: (i > 0 && !header) ? 'JetBrains Mono, monospace' : 'Inter, sans-serif',
        }}>{v}</span>
      ))}
    </div>
  )
}

export default function Progress() {
  const { trades, account } = useApp()
  const [tab, setTab] = useState('MÉTRICAS')

  // ── Compute live metrics from all trades ────────────────
  const wins   = trades.filter(t => t.result === 'win')
  const losses = trades.filter(t => t.result === 'loss')
  const n      = trades.length

  const totalWinPnL  = wins.reduce((s, t) => s + (t.pnl || 0), 0)
  const totalLossPnL = Math.abs(losses.reduce((s, t) => s + (t.pnl || 0), 0))
  const totalPnL     = trades.reduce((s, t) => s + (t.pnl || 0), 0)

  const winRate = n ? (wins.length / n * 100).toFixed(1) : '—'

  const profitFactor = totalLossPnL > 0
    ? (totalWinPnL / totalLossPnL).toFixed(2)
    : wins.length > 0 ? '∞' : '—'

  const avgWin  = wins.length   ? totalWinPnL  / wins.length   : 0
  const avgLoss = losses.length ? totalLossPnL / losses.length : 0

  const expectancy = n > 0
    ? (wins.length / n) * avgWin - (losses.length / n) * avgLoss
    : 0

  const bestPnL  = n ? Math.max(...trades.map(t => t.pnl || 0)) : 0
  const worstPnL = n ? Math.min(...trades.map(t => t.pnl || 0)) : 0

  // Consecutive streaks (iterate oldest → newest)
  let maxW = 0, curW = 0, maxL = 0, curL = 0
  ;[...trades].reverse().forEach(t => {
    if      (t.result === 'win')  { curW++; curL = 0; if (curW > maxW) maxW = curW }
    else if (t.result === 'loss') { curL++; curW = 0; if (curL > maxL) maxL = curL }
    else                          { curW = 0; curL = 0 }
  })

  // Session breakdown
  const sessMap = {}
  trades.forEach(t => {
    const k = t.session || 'Sin sesión'
    if (!sessMap[k]) sessMap[k] = { trades: 0, wins: 0, pnl: 0 }
    sessMap[k].trades++
    if (t.result === 'win') sessMap[k].wins++
    sessMap[k].pnl += t.pnl || 0
  })
  const sessRows = Object.entries(sessMap).sort((a, b) => b[1].trades - a[1].trades)

  // Setup breakdown
  const setupMap = {}
  trades.forEach(t => {
    const k = t.setup?.entry_zone || 'Sin setup'
    if (!setupMap[k]) setupMap[k] = { trades: 0, wins: 0, pnl: 0 }
    setupMap[k].trades++
    if (t.result === 'win') setupMap[k].wins++
    setupMap[k].pnl += t.pnl || 0
  })
  const setupRows = Object.entries(setupMap).sort((a, b) => b[1].trades - a[1].trades)

  // Balance chart from SESSIONS (historical data)
  const chartData = SESSIONS.map(s => ({ date: s.date.slice(5), balance: s.balance, pnl: s.pnl }))
  const minBal = Math.min(...chartData.map(d => d.balance)) - 150
  const maxBal = Math.max(...chartData.map(d => d.balance)) + 150
  const range  = maxBal - minBal
  const W = 320, H = 90
  const svgPoints = chartData.map((d, i) => {
    const x = (i / (chartData.length - 1)) * W
    const y = H - ((d.balance - minBal) / range) * H
    return `${x},${y}`
  })

  const expColor  = expectancy >= 0 ? '#00ff88' : '#ff3355'
  const pfCol     = pfColor(profitFactor)

  return (
    <div className="page">

      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{ padding: '10px 14px 9px', borderBottom: '1px solid #1a2535' }}>
        <p style={{ color: '#3a4a5a', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 2px', ...inter }}>Apex $50K · XAUUSD</p>
        <p style={{ color: '#e8edf2', fontSize: 13, fontWeight: 700, margin: 0, letterSpacing: '0.04em' }}>ANALYTICS</p>
      </div>

      {/* ── Account summary strip ────────────────────────── */}
      <div style={{ display: 'flex', background: '#111820', borderBottom: '1px solid #1a2535', flexShrink: 0 }}>
        <MetricCell label="Balance"    value={`$${account.current_balance.toLocaleString('en-US', { maximumFractionDigits: 0 })}`} />
        <MetricCell label="Trades reg." value={n} />
        <MetricCell label="Win Rate"   value={n ? `${winRate}%` : '—'} color={parseFloat(winRate) >= 50 ? '#00ff88' : '#ff3355'} />
        <MetricCell label="P&L Total"  value={`${totalPnL >= 0 ? '+' : ''}$${totalPnL.toFixed(0)}`} color={totalPnL >= 0 ? '#00ff88' : '#ff3355'} border={false} />
      </div>

      {/* ── Tabs ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', background: '#060a0f', borderBottom: '1px solid #1a2535', flexShrink: 0 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '8px 0', border: 'none',
            borderBottom: tab === t ? '2px solid #00ff88' : '2px solid transparent',
            background: 'transparent',
            color: tab === t ? '#00ff88' : '#3a4a5a',
            fontSize: 9, fontWeight: tab === t ? 700 : 400,
            fontFamily: 'inherit', textTransform: 'uppercase',
            letterSpacing: '0.1em', cursor: 'pointer',
          }}>{t}</button>
        ))}
      </div>

      <div className="page-content">

        {/* ══════════ TAB: MÉTRICAS ══════════════════════════ */}
        {tab === 'MÉTRICAS' && (
          <>
            {n === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                <p style={{ color: '#3a4a5a', fontSize: 12, margin: 0, ...inter }}>Registra operaciones para ver tus métricas</p>
              </div>
            ) : (
              <>
                {/* Core metrics grid — row 1 */}
                <div style={{ background: '#111820', border: '1px solid #1a2535' }}>
                  <div style={{ display: 'flex', borderBottom: '1px solid #1a2535' }}>
                    <MetricCell label="Profit Factor" value={profitFactor} color={pfCol}
                      sub={parseFloat(profitFactor) >= 1.5 ? 'Rentable' : parseFloat(profitFactor) >= 1 ? 'Breakeven' : 'En pérdida'} />
                    <MetricCell label="Expectancy / trade" value={`${expectancy >= 0 ? '+' : ''}$${Math.abs(expectancy).toFixed(2)}`} color={expColor}
                      sub={expectancy >= 0 ? 'Edge positivo' : 'Corregir sistema'} />
                    <MetricCell label="Avg Win" value={`+$${avgWin.toFixed(0)}`} color="#00ff88" border={false} />
                  </div>
                  <div style={{ display: 'flex' }}>
                    <MetricCell label="Racha W máx" value={maxW} color="#00ff88" sub={`${maxW} wins consec.`} />
                    <MetricCell label="Racha L máx"  value={maxL} color={maxL >= 3 ? '#ff3355' : maxL >= 2 ? '#ffcc00' : '#7a8a9a'}
                      sub={maxL >= 3 ? 'Revisar sistema' : maxL >= 2 ? 'Atención' : 'Controlado'} />
                    <MetricCell label="Avg Loss" value={`-$${avgLoss.toFixed(0)}`} color="#ff3355" border={false} />
                  </div>
                </div>

                {/* Profit Factor explanation */}
                <div style={{ background: '#111820', border: '1px solid #1a2535', padding: '8px 12px' }}>
                  <p style={{ margin: '0 0 4px', fontSize: 9, color: '#3a4a5a', textTransform: 'uppercase', letterSpacing: '0.1em', ...inter }}>
                    Interpretación
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[['< 1.0', 'Pérdidas', '#ff3355'], ['1.0–1.5', 'Breakeven', '#ffcc00'], ['> 1.5', 'Rentable', '#00ff88'], ['> 2.0', 'Excelente', '#00ff88']].map(([range, label, c]) => (
                      <div key={range} style={{ flex: 1, textAlign: 'center', padding: '5px 2px', background: '#060a0f', border: '1px solid #1a2535' }}>
                        <p style={{ margin: '0 0 2px', fontSize: 9, color: c, fontWeight: 700, ...mono }}>{range}</p>
                        <p style={{ margin: 0, fontSize: 8, color: '#3a4a5a', ...inter }}>{label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best / Worst */}
                <div style={{ background: '#111820', border: '1px solid #1a2535' }}>
                  <div style={{ padding: '6px 12px', borderBottom: '1px solid #1a2535' }}>
                    <span style={{ color: '#3a4a5a', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', ...inter }}>Mejor / Peor operación</span>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <div style={{ flex: 1, padding: '10px 12px', borderRight: '1px solid #1a2535' }}>
                      <p style={{ margin: '0 0 2px', fontSize: 8, color: '#3a4a5a', textTransform: 'uppercase', letterSpacing: '0.1em', ...inter }}>Mejor trade</p>
                      <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#00ff88', ...mono }}>+${bestPnL.toFixed(0)}</p>
                    </div>
                    <div style={{ flex: 1, padding: '10px 12px' }}>
                      <p style={{ margin: '0 0 2px', fontSize: 8, color: '#3a4a5a', textTransform: 'uppercase', letterSpacing: '0.1em', ...inter }}>Peor trade</p>
                      <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#ff3355', ...mono }}>${worstPnL.toFixed(0)}</p>
                    </div>
                  </div>
                </div>

                {/* Wins/Losses/BE count */}
                <div style={{ display: 'flex', background: '#111820', border: '1px solid #1a2535' }}>
                  {[
                    ['Wins',     wins.length,                     '#00ff88'],
                    ['Losses',   losses.length,                   '#ff3355'],
                    ['Breakeven',trades.filter(t=>t.result==='breakeven').length, '#ffcc00'],
                  ].map(([l, v, c], i, arr) => (
                    <div key={l} style={{ flex: 1, padding: '10px 6px', textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid #1a2535' : 'none' }}>
                      <p style={{ margin: '0 0 3px', fontSize: 8, color: '#3a4a5a', textTransform: 'uppercase', letterSpacing: '0.1em', ...inter }}>{l}</p>
                      <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: c, ...mono }}>{v}</p>
                    </div>
                  ))}
                </div>

                {/* SMC Skills */}
                <div style={{ background: '#111820', border: '1px solid #1a2535' }}>
                  <div style={{ padding: '7px 12px', borderBottom: '1px solid #1a2535' }}>
                    <span style={{ color: '#3a4a5a', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', ...inter }}>Habilidades SMC</span>
                  </div>
                  <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {SKILLS.map((s, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 11, color: '#e8edf2', ...inter }}>{s.name}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: skillColors[s.color], ...mono }}>{s.level}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${s.level}%`, background: skillColors[s.color] }} />
                        </div>
                      </div>
                    ))}
                    <p style={{ margin: '4px 0 0', fontSize: 9, color: '#3a4a5a', textAlign: 'center', ...inter }}>
                      Autoevaluación — actualizar en apex_data.js
                    </p>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ══════════ TAB: SESIONES ══════════════════════════ */}
        {tab === 'SESIONES' && (
          <>
            {/* Live trades by session */}
            <div style={{ background: '#111820', border: '1px solid #1a2535' }}>
              <div style={{ padding: '7px 12px', borderBottom: '1px solid #1a2535' }}>
                <span style={{ color: '#3a4a5a', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', ...inter }}>Trades registrados por sesión</span>
              </div>
              <TableRow cells={[['Sesión'], ['Trades'], ['Win%'], ['P&L']]} header />
              {sessRows.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <p style={{ color: '#3a4a5a', fontSize: 11, margin: 0, ...inter }}>Sin datos aún</p>
                </div>
              ) : sessRows.map(([name, s]) => {
                const wr  = s.trades ? Math.round(s.wins / s.trades * 100) : 0
                const acc = s.pnl >= 0 ? `+$${s.pnl.toFixed(0)}` : `-$${Math.abs(s.pnl).toFixed(0)}`
                return (
                  <TableRow
                    key={name}
                    accent={name === 'Londres' ? '#0088ff' : name === 'Nueva York' ? '#00ff88' : '#7a8a9a'}
                    cells={[
                      [name],
                      [s.trades, '#e8edf2'],
                      [`${wr}%`, wr >= 50 ? '#00ff88' : '#ff3355'],
                      [acc, s.pnl >= 0 ? '#00ff88' : '#ff3355'],
                    ]}
                  />
                )
              })}
            </div>

            {/* Historical sessions from apex_data */}
            <div style={{ background: '#111820', border: '1px solid #1a2535' }}>
              <div style={{ padding: '7px 12px', borderBottom: '1px solid #1a2535' }}>
                <span style={{ color: '#3a4a5a', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', ...inter }}>Historial de días operados</span>
              </div>
              {[...SESSIONS].reverse().map((s, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '9px 12px', borderBottom: '1px solid #1a2535',
                  borderLeft: `2px solid ${s.pnl >= 0 ? '#00ff88' : '#ff3355'}`,
                }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: '0 0 1px', fontSize: 11, color: '#e8edf2', ...mono }}>{s.date}</p>
                    <p style={{ margin: 0, fontSize: 9, color: '#3a4a5a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', ...inter }}>{s.notes}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: s.pnl >= 0 ? '#00ff88' : '#ff3355', ...mono }}>
                      {s.pnl >= 0 ? '+' : ''}${s.pnl.toFixed(2)}
                    </p>
                    <p style={{ margin: 0, fontSize: 9, color: '#3a4a5a', ...inter }}>{s.fills} fills</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Balance chart */}
            <div style={{ background: '#111820', border: '1px solid #1a2535' }}>
              <div style={{ padding: '7px 12px', borderBottom: '1px solid #1a2535' }}>
                <span style={{ color: '#3a4a5a', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', ...inter }}>Curva de balance</span>
              </div>
              <div style={{ padding: '12px', overflowX: 'auto' }}>
                <svg width={W} height={H + 22} style={{ display: 'block', minWidth: W }}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00ff88" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0.25, 0.5, 0.75].map(r => (
                    <line key={r} x1="0" y1={H * r} x2={W} y2={H * r} stroke="#1a2535" strokeWidth="1" />
                  ))}
                  <polygon points={`0,${H} ${svgPoints.join(' ')} ${W},${H}`} fill="url(#grad)" />
                  <polyline points={svgPoints.join(' ')} fill="none" stroke="#00ff88" strokeWidth="1.5" strokeLinejoin="round" />
                  {chartData.map((d, i) => {
                    const x = (i / (chartData.length - 1)) * W
                    const y = H - ((d.balance - minBal) / range) * H
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="3" fill={d.pnl >= 0 ? '#00ff88' : '#ff3355'} />
                        <text x={x} y={H + 16} textAnchor="middle" fill="#3a4a5a" fontSize="8" fontFamily="JetBrains Mono, monospace">{d.date}</text>
                      </g>
                    )
                  })}
                </svg>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: 9, color: '#3a4a5a', ...mono }}>Min ${minBal.toFixed(0)}</span>
                  <span style={{ fontSize: 9, color: '#3a4a5a', ...mono }}>Max ${maxBal.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══════════ TAB: SETUPS ════════════════════════════ */}
        {tab === 'SETUPS' && (
          <>
            <div style={{ background: '#111820', border: '1px solid #1a2535' }}>
              <div style={{ padding: '7px 12px', borderBottom: '1px solid #1a2535' }}>
                <span style={{ color: '#3a4a5a', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', ...inter }}>Rendimiento por tipo de setup</span>
              </div>
              <TableRow cells={[['Setup'], ['Trades'], ['Win%'], ['P&L']]} header />
              {setupRows.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <p style={{ color: '#3a4a5a', fontSize: 11, margin: 0, ...inter }}>Sin datos aún</p>
                </div>
              ) : setupRows.map(([name, s]) => {
                const wr  = s.trades ? Math.round(s.wins / s.trades * 100) : 0
                const pnl = s.pnl >= 0 ? `+$${s.pnl.toFixed(0)}` : `-$${Math.abs(s.pnl).toFixed(0)}`
                return (
                  <TableRow
                    key={name}
                    cells={[
                      [name],
                      [s.trades, '#e8edf2'],
                      [`${wr}%`,  wr >= 60 ? '#00ff88' : wr >= 40 ? '#ffcc00' : '#ff3355'],
                      [pnl, s.pnl >= 0 ? '#00ff88' : '#ff3355'],
                    ]}
                  />
                )
              })}
            </div>

            {/* Note */}
            <div style={{ background: '#111820', border: '1px solid #1a2535', padding: '10px 12px', borderLeft: '2px solid #ffcc00' }}>
              <p style={{ margin: '0 0 3px', fontSize: 9, color: '#ffcc00', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', ...inter }}>Nota</p>
              <p style={{ margin: 0, fontSize: 10, color: '#7a8a9a', lineHeight: 1.5, ...inter }}>
                Los setups se registran en cada operación (campo "SMC Setup"). A más operaciones registradas, más preciso será este análisis.
              </p>
            </div>

            {/* Top performer */}
            {setupRows.length > 0 && (() => {
              const best = setupRows.filter(([, s]) => s.trades >= 2).sort((a, b) => {
                const wrA = a[1].wins / a[1].trades
                const wrB = b[1].wins / b[1].trades
                return wrB - wrA
              })[0]
              return best ? (
                <div style={{ background: '#111820', border: '1px solid #00ff88' }}>
                  <div style={{ padding: '6px 12px', borderBottom: '1px solid #1a2535' }}>
                    <span style={{ color: '#3a4a5a', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', ...inter }}>Setup más rentable</span>
                  </div>
                  <div style={{ padding: '14px 12px', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: '#00ff88' }}>{best[0]}</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#7a8a9a', ...inter }}>
                      {best[1].trades} trades · {Math.round(best[1].wins / best[1].trades * 100)}% win rate
                    </p>
                  </div>
                </div>
              ) : null
            })()}
          </>
        )}

        <div style={{ height: 4 }} />
      </div>
    </div>
  )
}
