import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { SESSIONS, SKILLS } from '../data/apex_data.js'

export default function Progress() {
  const navigate = useNavigate()
  const { trades } = useApp()

  // Streak: consecutive winning days from SESSIONS (most recent)
  let streak = 0
  for (let i = SESSIONS.length - 1; i >= 0; i--) {
    if (SESSIONS[i].result === 'win') streak++
    else break
  }

  // Balance chart data from sessions
  const chartData = SESSIONS.map(s => ({ date: s.date.slice(5), balance: s.balance, pnl: s.pnl }))
  const minBal = Math.min(...chartData.map(d => d.balance)) - 200
  const maxBal = Math.max(...chartData.map(d => d.balance)) + 200
  const range = maxBal - minBal

  const W = 320, H = 100
  const points = chartData.map((d, i) => {
    const x = (i / (chartData.length - 1)) * W
    const y = H - ((d.balance - minBal) / range) * H
    return `${x},${y}`
  })

  const skillColors = { green: '#00ff88', yellow: '#ffcc00', red: '#ff4444' }

  return (
    <div className="page">
      <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid #1a2535', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: '#6b7a8d', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Analytics</p>
          <p style={{ color: '#cdd9e5', fontSize: 14, fontWeight: 700, margin: 0 }}>Progreso</p>
        </div>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: '1px solid #1a2535', color: '#6b7a8d', padding: '4px 10px', borderRadius: 2, fontSize: 11 }}>← Volver</button>
      </div>

      <div className="page-content">
        {/* Streak */}
        <div className="card" style={{ textAlign: 'center' }}>
          <p className="section-title" style={{ marginBottom: 8 }}>Racha ganadora</p>
          <p style={{ margin: 0, fontSize: 48, fontWeight: 700, color: streak > 0 ? '#00ff88' : '#6b7a8d', lineHeight: 1 }}>{streak}</p>
          <p style={{ margin: '6px 0 0', fontSize: 11, color: '#6b7a8d' }}>días consecutivos en positivo</p>
        </div>

        {/* Balance chart */}
        <div className="card">
          <p className="section-title">Balance — historial de sesiones</p>
          <div style={{ overflowX: 'auto' }}>
            <svg width={W} height={H + 20} style={{ display: 'block', minWidth: W }}>
              {/* Grid lines */}
              {[0.25, 0.5, 0.75].map(r => (
                <line key={r} x1="0" y1={H * r} x2={W} y2={H * r} stroke="#1a2535" strokeWidth="1" />
              ))}
              {/* Area fill */}
              <defs>
                <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00ff88" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon
                points={`0,${H} ${points.join(' ')} ${W},${H}`}
                fill="url(#fillGrad)"
              />
              {/* Line */}
              <polyline points={points.join(' ')} fill="none" stroke="#00ff88" strokeWidth="2" strokeLinejoin="round" />
              {/* Data points */}
              {chartData.map((d, i) => {
                const x = (i / (chartData.length - 1)) * W
                const y = H - ((d.balance - minBal) / range) * H
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="3" fill={d.pnl >= 0 ? '#00ff88' : '#ff4444'} />
                    <text x={x} y={H + 14} textAnchor="middle" fill="#6b7a8d" fontSize="9" fontFamily="JetBrains Mono, monospace">{d.date}</text>
                  </g>
                )
              })}
            </svg>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 10, color: '#6b7a8d' }}>Min: ${minBal.toFixed(0)}</span>
            <span style={{ fontSize: 10, color: '#6b7a8d' }}>Max: ${maxBal.toFixed(0)}</span>
          </div>
        </div>

        {/* Session history */}
        <div className="card">
          <p className="section-title">Historial de sesiones</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[...SESSIONS].reverse().map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #1a2535' }}>
                <div>
                  <span style={{ fontSize: 12, color: '#cdd9e5' }}>{s.date}</span>
                  <p style={{ margin: '2px 0 0', fontSize: 10, color: '#6b7a8d' }}>{s.notes}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: s.pnl >= 0 ? '#00ff88' : '#ff4444' }}>
                    {s.pnl >= 0 ? '+' : ''}{s.pnl.toFixed(2)}
                  </p>
                  <span style={{ fontSize: 9, color: '#6b7a8d' }}>{s.fills} fills</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SMC Skills */}
        <div className="card">
          <p className="section-title">Habilidades SMC</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SKILLS.map((skill, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: '#cdd9e5' }}>{skill.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: skillColors[skill.color] }}>{skill.level}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${skill.level}%`, background: skillColors[skill.color] }} />
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 10, color: '#6b7a8d', margin: '12px 0 0', textAlign: 'center' }}>
            Basado en autoevaluación personal — actualiza en apex_data.js
          </p>
        </div>

        {/* Stats summary */}
        <div className="card">
          <p className="section-title">Resumen cuenta Apex</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              ['Días operados', SESSIONS.length],
              ['Días ganadores', SESSIONS.filter(s => s.result === 'win').length],
              ['Win rate sesiones', `${Math.round(SESSIONS.filter(s => s.result === 'win').length / SESSIONS.length * 100)}%`],
              ['P&L acumulado', `$${SESSIONS.reduce((s, d) => s + d.pnl, 0).toFixed(2)}`],
            ].map(([label, value]) => (
              <div key={label}>
                <p style={{ margin: '0 0 3px', fontSize: 9, color: '#6b7a8d', textTransform: 'uppercase' }}>{label}</p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#cdd9e5' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
