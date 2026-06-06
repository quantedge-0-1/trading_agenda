import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { inter, mono } from '../utils/styles.js'

const MGC_PER_POINT = 10   // $10 per point per contract
const DAILY_STOP    = 150  // personal daily stop loss rule

export default function Sizer() {
  const navigate = useNavigate()
  const { account, todayPnL } = useApp()

  const [riskPct, setRiskPct] = useState('0.5')
  const [entry,   setEntry]   = useState('')
  const [stop,    setStop]    = useState('')

  const balance  = account.current_balance
  const stopLeft = Math.max(0, DAILY_STOP + todayPnL)

  const e    = parseFloat(entry)
  const s    = parseFloat(stop)
  const rPct = parseFloat(riskPct) / 100

  const pts         = e && s ? Math.abs(e - s) : null
  const dollarPerC  = pts ? pts * MGC_PER_POINT : null
  const dollarRisk  = rPct && balance ? balance * rPct : null

  const contracts = dollarPerC && dollarRisk && dollarPerC > 0
    ? Math.max(1, Math.floor(dollarRisk / dollarPerC))
    : null

  const maxLoss        = contracts && dollarPerC ? contracts * dollarPerC : null
  const withinStopLeft = maxLoss != null ? maxLoss <= stopLeft : null

  // Fallback: max safe contracts respecting remaining daily stop
  const safeContracts = dollarPerC && stopLeft > 0 && dollarPerC > 0
    ? Math.max(1, Math.floor(stopLeft / dollarPerC))
    : null

  const RISK_PRESETS = ['0.3', '0.5', '1.0']

  function Row({ label, value, color = '#e8edf2', last = false }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', borderBottom: last ? 'none' : '1px solid #1a2535' }}>
        <span style={{ fontSize: 10, color: '#7a8a9a', textTransform: 'uppercase', letterSpacing: '0.08em', ...inter }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color, ...mono }}>{value}</span>
      </div>
    )
  }

  return (
    <div className="page">

      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{ padding: '10px 14px 9px', borderBottom: '1px solid #1a2535', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: '#3a4a5a', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 2px', ...inter }}>MGC · Micro Gold Futures</p>
          <p style={{ color: '#e8edf2', fontSize: 13, fontWeight: 700, margin: 0, letterSpacing: '0.04em' }}>POSITION SIZER</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#ffcc00', letterSpacing: '0.04em' }}>$10 / PUNTO</p>
          <p style={{ margin: 0, fontSize: 9, color: '#3a4a5a', ...inter }}>por contrato</p>
        </div>
      </div>

      <div className="page-content">

        {/* ── Account context strip ────────────────────────── */}
        <div style={{ display: 'flex', background: '#111820', border: '1px solid #1a2535' }}>
          {[
            ['Balance',       `$${balance.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, '#e8edf2'],
            ['Stop restante', `$${stopLeft.toFixed(0)}`, stopLeft < 50 ? '#ff3355' : stopLeft < 100 ? '#ffcc00' : '#00ff88'],
            ['P&L hoy',       `${todayPnL >= 0 ? '+' : ''}$${todayPnL.toFixed(0)}`, todayPnL >= 0 ? '#00ff88' : '#ff3355'],
          ].map(([l, v, c], i, arr) => (
            <div key={l} style={{ flex: 1, padding: '8px 6px', textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid #1a2535' : 'none' }}>
              <p style={{ margin: '0 0 2px', fontSize: 8, color: '#3a4a5a', textTransform: 'uppercase', letterSpacing: '0.1em', ...inter }}>{l}</p>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: c, ...mono }}>{v}</p>
            </div>
          ))}
        </div>

        {/* ── Risk % presets ───────────────────────────────── */}
        <div style={{ display: 'flex', gap: 6 }}>
          {RISK_PRESETS.map(p => (
            <button
              key={p}
              onClick={() => setRiskPct(p)}
              style={{
                flex: 1, padding: '8px 0',
                border: `1px solid ${riskPct === p ? '#ffcc00' : '#1a2535'}`,
                background: riskPct === p ? 'rgba(255,204,0,0.08)' : '#060a0f',
                color: riskPct === p ? '#ffcc00' : '#3a4a5a',
                fontSize: 11, fontWeight: riskPct === p ? 700 : 400,
                fontFamily: 'inherit', cursor: 'pointer', letterSpacing: '0.04em',
              }}
            >
              {p}%
            </button>
          ))}
        </div>

        {/* ── Inputs ──────────────────────────────────────── */}
        <div style={{ background: '#111820', border: '1px solid #1a2535' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '72px 1fr 1fr', borderBottom: '1px solid #1a2535' }}>
            {[['RIESGO %', '#ffcc00'], ['ENTRADA', '#e8edf2'], ['STOP LOSS', '#ff3355']].map(([l, c], i, arr) => (
              <div key={l} style={{ padding: '4px 8px', borderRight: i < arr.length - 1 ? '1px solid #1a2535' : 'none' }}>
                <p style={{ margin: 0, fontSize: 8, color: c, textTransform: 'uppercase', letterSpacing: '0.1em', ...inter }}>{l}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '72px 1fr 1fr' }}>
            <input
              type="number" inputMode="decimal" value={riskPct}
              onChange={e => setRiskPct(e.target.value)} placeholder="0.5"
              style={{ borderRadius: 0, border: 'none', borderRight: '1px solid #1a2535', padding: '10px 8px', fontSize: 15, color: '#ffcc00', fontWeight: 700 }}
            />
            <input
              type="number" inputMode="decimal" value={entry}
              onChange={e => setEntry(e.target.value)} placeholder="3280"
              style={{ borderRadius: 0, border: 'none', borderRight: '1px solid #1a2535', padding: '10px 8px', fontSize: 15 }}
            />
            <input
              type="number" inputMode="decimal" value={stop}
              onChange={e => setStop(e.target.value)} placeholder="3270"
              style={{ borderRadius: 0, border: 'none', padding: '10px 8px', fontSize: 15, color: '#ff3355' }}
            />
          </div>
        </div>

        {/* ── Result ──────────────────────────────────────── */}
        {contracts != null ? (
          <div style={{ background: '#111820', border: `1px solid ${withinStopLeft ? '#00ff88' : '#ff3355'}` }}>

            {/* Main number */}
            <div style={{
              padding: '20px 16px', textAlign: 'center', borderBottom: '1px solid #1a2535',
              background: withinStopLeft ? 'rgba(0,255,136,0.03)' : 'rgba(255,51,85,0.03)',
            }}>
              <p style={{ margin: '0 0 6px', fontSize: 9, color: '#3a4a5a', textTransform: 'uppercase', letterSpacing: '0.16em', ...inter }}>Contratos a operar</p>
              <p style={{ margin: 0, fontSize: 60, fontWeight: 700, color: withinStopLeft ? '#00ff88' : '#ff3355', lineHeight: 1, ...mono }}>
                {contracts}
              </p>
              <p style={{ margin: '6px 0 0', fontSize: 10, color: '#7a8a9a', ...inter }}>MGC Micro Gold</p>
            </div>

            {/* Metrics */}
            <Row label="Puntos al stop loss" value={`${pts?.toFixed(1)} pts`} />
            <Row label="Riesgo por contrato"  value={`$${dollarPerC?.toFixed(0)}`} color="#7a8a9a" />
            <Row label="Riesgo teórico (% acct)" value={`$${dollarRisk?.toFixed(0)}`} color="#ffcc00" />
            <Row label="Pérdida máxima real"  value={`$${maxLoss?.toFixed(0)}`} color={withinStopLeft ? '#00ff88' : '#ff3355'} />
            <Row label="Stop diario restante" value={`$${stopLeft.toFixed(0)}`} color={stopLeft < 50 ? '#ff3355' : stopLeft < 100 ? '#ffcc00' : '#7a8a9a'} />

            {/* Status */}
            <div style={{ padding: '12px 14px', textAlign: 'center', borderTop: '1px solid #1a2535', background: withinStopLeft ? 'rgba(0,255,136,0.04)' : 'rgba(255,51,85,0.04)' }}>
              {withinStopLeft ? (
                <span style={{ fontSize: 13, fontWeight: 700, color: '#00ff88', letterSpacing: '0.04em' }}>
                  ✓ OPERA {contracts} CONTRATO{contracts !== 1 ? 'S' : ''} — DENTRO DEL STOP
                </span>
              ) : (
                <div>
                  <p style={{ margin: '0 0 5px', fontSize: 12, fontWeight: 700, color: '#ff3355' }}>
                    ✗ EXCEDE STOP DISPONIBLE ${stopLeft.toFixed(0)}
                  </p>
                  {safeContracts != null && (
                    <p style={{ margin: 0, fontSize: 11, color: '#ffcc00', ...inter }}>
                      Máximo seguro: {safeContracts} contrato{safeContracts !== 1 ? 's' : ''} → ${(safeContracts * dollarPerC).toFixed(0)} riesgo
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ background: '#111820', border: '1px solid #1a2535', padding: '36px 20px', textAlign: 'center' }}>
            <p style={{ color: '#3a4a5a', fontSize: 13, margin: '0 0 4px' }}>Ingresa entrada y stop loss</p>
            <p style={{ color: '#1a2535', fontSize: 10, margin: 0, ...inter }}>para calcular el tamaño de posición</p>
          </div>
        )}

        {/* ── Formula reference ────────────────────────────── */}
        <div style={{ background: '#111820', border: '1px solid #1a2535' }}>
          <div style={{ padding: '6px 12px', borderBottom: '1px solid #1a2535' }}>
            <span style={{ color: '#3a4a5a', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', ...inter }}>Fórmula MGC</span>
          </div>
          <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              ['Contratos',  '⌊ (Balance × Riesgo%) ÷ (Pts SL × $10) ⌋'],
              ['1 contrato', '10 oz · $10 por punto de precio'],
              ['Riesgo',     '0.3% conservador · 0.5% estándar · 1% agresivo'],
            ].map(([label, text]) => (
              <div key={label} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ color: '#3a4a5a', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0, paddingTop: 1, minWidth: 60, ...inter }}>{label}</span>
                <span style={{ color: '#7a8a9a', fontSize: 10, lineHeight: 1.5, ...inter }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ─────────────────────────────────────────── */}
        {withinStopLeft && (
          <button className="btn-primary" onClick={() => navigate('/register')}>
            ✓ TAMAÑO CALCULADO — IR A REGISTRAR
          </button>
        )}
        <div style={{ height: 4 }} />
      </div>
    </div>
  )
}
