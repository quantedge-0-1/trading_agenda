import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useApp } from './context/AppContext.jsx'
import { useTerminal } from './context/TerminalContext.jsx'
import { RULES } from './data/apex_data.js'
import { inter, mono } from './utils/styles.js'
import BottomNav from './components/BottomNav.jsx'
import Home from './pages/Home.jsx'
import Checklist from './pages/Checklist.jsx'
import Register from './pages/Register.jsx'
import Diary from './pages/Diary.jsx'
import Learn from './pages/Learn.jsx'
import Rules from './pages/Rules.jsx'
import Weekly from './pages/Weekly.jsx'
import Progress from './pages/Progress.jsx'
import Sizer from './pages/Sizer.jsx'

function getSession() {
  const h = new Date().getUTCHours()
  if (h >= 7  && h < 12) return { name: 'LONDON',    color: '#0088ff' }
  if (h >= 12 && h < 16) return { name: 'NY · LON',  color: '#00ff88' }
  if (h >= 16 && h < 21) return { name: 'NEW YORK',  color: '#00ff88' }
  if (h >= 21 || h <  2) return { name: 'PRE-ASIA',  color: '#7a8a9a' }
  return                          { name: 'ASIAN',    color: '#7a8a9a' }
}

function TerminalHeader() {
  const { xauPrice, xauDir, connected } = useTerminal()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const session = getSession()
  const gmtOffset = -5
  const utcMs = time.getTime() + time.getTimezoneOffset() * 60000
  const localTime = new Date(utcMs + gmtOffset * 3600000)
  const hh = String(localTime.getHours()).padStart(2, '0')
  const mm = String(localTime.getMinutes()).padStart(2, '0')
  const ss = String(localTime.getSeconds()).padStart(2, '0')

  const priceColor = xauDir === 'up' ? '#00ff88' : xauDir === 'down' ? '#ff3355' : '#e8edf2'
  const priceArrow = xauDir === 'up' ? '▲' : xauDir === 'down' ? '▼' : '◆'

  return (
    <div style={{ background: '#0d1117', borderBottom: '1px solid #1a2535', flexShrink: 0 }}>
      {/* Row 1 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 14px' }}>
        <span style={{ color: '#e8edf2', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' }}>◈ APEX $50K</span>
        {xauPrice != null
          ? <span style={{ color: priceColor, fontSize: 13, fontWeight: 700, letterSpacing: '0.04em' }}>{priceArrow} {xauPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          : <span style={{ color: '#3a4a5a', fontSize: 11 }}>XAUUSD —</span>
        }
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: connected ? '#00ff88' : '#ff3355' }}>
          {connected ? '● LIVE' : '○ OFF'}
        </span>
      </div>
      {/* Row 2 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 14px 5px' }}>
        <span style={{ color: '#7a8a9a', fontSize: 10, fontFamily: 'Inter, sans-serif', letterSpacing: '0.04em' }}>
          GMT-5  {hh}:{mm}:{ss}
        </span>
        <span style={{ color: session.color, fontSize: 10, fontWeight: 700, fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}>
          {session.name} SESSION
        </span>
      </div>
    </div>
  )
}

function surprise(actual, forecast) {
  if (actual == null || forecast == null || forecast === 0) return null
  return (((actual - forecast) / Math.abs(forecast)) * 100).toFixed(1)
}

export default function App() {
  const navigate = useNavigate()
  const { reminderShown, dismissReminder, todayPnL, todayTrades } = useApp()
  const { preRelease, postSignal, clearSignal } = useTerminal()
  const criticalRules = RULES.filter(r => r.critical)

  function executeSignal(event) {
    clearSignal()
    const h = new Date().getUTCHours()
    const session = h >= 7 && h < 16 ? 'Londres' : h >= 13 && h < 21 ? 'Nueva York' : 'Asiática'
    navigate('/register', { state: { prefill: { session, instrument: 'XAUUSD', note: event.event_name } } })
  }

  const surprisePct = postSignal ? surprise(postSignal.actual, postSignal.forecast) : null

  const S = {
    divider: { width: 1, background: '#1a2535', alignSelf: 'stretch' },
    mono,
    inter,
  }

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

      {/* ── Global terminal header ─────────────────────────── */}
      <TerminalHeader />

      {/* ── Risk banners ───────────────────────────────────── */}
      {todayPnL <= -150 && (
        <div style={{ background: 'linear-gradient(90deg,#ff3355,#cc1133)', color: '#fff', textAlign: 'center', padding: '5px 12px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', ...S.inter }}>
          ⛔ STOP DIARIO — NO OPERES MÁS HOY
        </div>
      )}
      {todayPnL <= -100 && todayPnL > -150 && (
        <div style={{ background: 'rgba(255,204,0,0.15)', borderBottom: '1px solid #ffcc00', color: '#ffcc00', textAlign: 'center', padding: '5px 12px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', ...S.inter }}>
          ⚠ ALERTA — quedan ${(150 + todayPnL).toFixed(0)} para el stop
        </div>
      )}
      {todayTrades.length >= 2 && todayPnL > -150 && (
        <div style={{ background: 'rgba(255,119,0,0.15)', borderBottom: '1px solid #ff7700', color: '#ff7700', textAlign: 'center', padding: '4px 12px', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', ...S.inter }}>
          LÍMITE OPERACIONES — 2/2 HOY
        </div>
      )}

      {/* ── Pre-release banner ─────────────────────────────── */}
      {preRelease?.active && (
        <div style={{ background: 'rgba(255,204,0,0.08)', borderBottom: '1px solid rgba(255,204,0,0.3)', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#ffcc00', fontSize: 14 }}>⏱</span>
          <span style={{ color: '#ffcc00', fontSize: 11, fontWeight: 700, flex: 1 }}>
            {preRelease.event_name ?? 'Evento próximo'}
            {preRelease.minutes_until != null && <span style={{ color: '#7a8a9a', fontWeight: 400 }}> — en {Math.round(preRelease.minutes_until)}m</span>}
          </span>
          <span style={{ color: '#ff3355', fontSize: 10, fontWeight: 700, ...S.inter, letterSpacing: '0.08em' }}>NO ENTRES</span>
        </div>
      )}

      {/* ── Routes ────────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/checklist" element={<Checklist />} />
          <Route path="/register"  element={<Register />} />
          <Route path="/diary"     element={<Diary />} />
          <Route path="/learn"     element={<Learn />} />
          <Route path="/rules"     element={<Rules />} />
          <Route path="/weekly"    element={<Weekly />} />
          <Route path="/progress"  element={<Progress />} />
          <Route path="/sizer"     element={<Sizer />} />
        </Routes>
      </div>

      <BottomNav />

      {/* ── Daily reminder modal ───────────────────────────── */}
      {!reminderShown && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6,10,15,0.95)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 200, padding: '0 0 72px' }}>
          <div style={{ background: '#111820', border: '1px solid #1a2535', borderRadius: 0, padding: '20px', width: '100%', maxWidth: 390, margin: '0 0' }}>
            <p style={{ color: '#7a8a9a', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 10px', ...S.inter }}>Recordatorio diario</p>
            <p style={{ color: '#00ff88', fontSize: 13, fontWeight: 700, margin: '0 0 14px', letterSpacing: '0.04em' }}>Antes de operar hoy:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
              {criticalRules.map(r => (
                <div key={r.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 10px', background: 'rgba(255,51,85,0.06)', borderLeft: '2px solid #ff3355' }}>
                  <p style={{ color: '#e8edf2', fontSize: 12, lineHeight: 1.5, margin: 0 }}>{r.rule}</p>
                </div>
              ))}
            </div>
            <button className="btn-primary" onClick={dismissReminder}>ENTENDIDO — VOY A CUMPLIRLAS</button>
          </div>
        </div>
      )}

      {/* ── Post-release modal ─────────────────────────────── */}
      {postSignal && reminderShown && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6,10,15,0.96)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: '0 14px' }}>
          <div style={{ background: '#111820', border: '1px solid var(--green)', borderRadius: 0, padding: '18px', width: '100%', maxWidth: 390 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <p style={{ color: '#7a8a9a', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 3px', ...S.inter }}>Dato publicado</p>
                <p style={{ color: '#e8edf2', fontSize: 14, fontWeight: 700, margin: 0 }}>{postSignal.event_name}</p>
              </div>
              <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, background: postSignal.importance === 'high' ? 'rgba(255,51,85,0.15)' : 'rgba(255,204,0,0.15)', color: postSignal.importance === 'high' ? '#ff3355' : '#ffcc00', ...S.inter }}>
                {(postSignal.importance ?? 'medium').toUpperCase()}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 12 }}>
              {[['Anterior', postSignal.previous], ['Forecast', postSignal.forecast], ['Actual', postSignal.actual]].map(([l, v]) => (
                <div key={l} style={{ background: '#060a0f', border: '1px solid #1a2535', padding: '8px', textAlign: 'center' }}>
                  <p style={{ color: '#7a8a9a', fontSize: 9, textTransform: 'uppercase', margin: '0 0 4px', ...S.inter }}>{l}</p>
                  <p style={{ color: '#e8edf2', fontSize: 15, fontWeight: 700, margin: 0 }}>{v != null ? v : '—'}</p>
                </div>
              ))}
            </div>
            {surprisePct != null && (
              <div style={{ marginBottom: 12, padding: '7px 12px', textAlign: 'center', background: parseFloat(surprisePct) > 0 ? 'rgba(0,255,136,0.07)' : 'rgba(255,51,85,0.07)', borderLeft: `2px solid ${parseFloat(surprisePct) > 0 ? '#00ff88' : '#ff3355'}` }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: parseFloat(surprisePct) > 0 ? '#00ff88' : '#ff3355' }}>
                  SORPRESA  {parseFloat(surprisePct) > 0 ? '+' : ''}{surprisePct}%
                </span>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button onClick={() => executeSignal(postSignal)} style={{ padding: '13px', background: 'rgba(0,255,136,0.1)', border: '1px solid #00ff88', color: '#00ff88', borderRadius: 0, fontSize: 12, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', letterSpacing: '0.06em' }}>EJECUTAR</button>
              <button onClick={clearSignal} style={{ padding: '13px', background: 'rgba(255,51,85,0.07)', border: '1px solid #ff3355', color: '#ff3355', borderRadius: 0, fontSize: 12, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', letterSpacing: '0.06em' }}>IGNORAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
