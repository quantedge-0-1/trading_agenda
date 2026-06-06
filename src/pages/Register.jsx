import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

const inter = { fontFamily: 'Inter, sans-serif' }
const TODAY = new Date().toISOString().slice(0, 10)
const SESSIONS  = ['Londres', 'Nueva York', 'Asiática']
const SETUPS    = ['BSL Sweep', 'SSL Sweep', 'OB', 'FVG', 'CHoCH', 'BOS']
const EMOTIONS  = ['Calmado', 'Confiado', 'Ansioso', 'FOMO', 'Frustrado']

// MGC Micro Gold Futures: 1 pt move = $10 per contract (10 oz × $1/oz)
const MGC_PTS = 10

function SectionHeader({ children }) {
  return (
    <div style={{ padding: '6px 0 4px', borderTop: '1px solid #1a2535', marginTop: 2 }}>
      <span style={{ color: '#3a4a5a', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.14em', ...inter }}>{children}</span>
    </div>
  )
}

function DirButton({ label, active, onClick, color }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '16px 0',
      border: `1px solid ${active ? color : '#1a2535'}`,
      background: active ? `${color}12` : '#060a0f',
      color: active ? color : '#3a4a5a',
      fontSize: 15, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
      letterSpacing: '0.06em', transition: 'all 0.1s',
    }}>{label}</button>
  )
}

function Chip({ label, active, onClick, color = '#00ff88' }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 12px', border: `1px solid ${active ? color : '#1a2535'}`,
      background: active ? `${color}12` : '#060a0f', color: active ? color : '#7a8a9a',
      borderRadius: 4, fontSize: 11, fontWeight: active ? 700 : 400,
      fontFamily: 'inherit', cursor: 'pointer', letterSpacing: '0.02em',
    }}>{label}</button>
  )
}

export default function Register() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { addTrade } = useApp()
  const pre = location.state?.prefill ?? {}

  const [direction,  setDirection]  = useState(pre.direction  ?? '')
  const [session,    setSession]    = useState(pre.session    ?? '')
  const [entry,      setEntry]      = useState(pre.entry      ?? '')
  const [sl,         setSl]         = useState(pre.sl         ?? '')
  const [tp,         setTp]         = useState(pre.tp         ?? '')
  const [exitPrice,  setExitPrice]  = useState('')
  const [contracts,  setContracts]  = useState('1')
  const [pnl,        setPnl]        = useState('')
  const [pnlManual,  setPnlManual]  = useState(false)
  const [result,     setResult]     = useState('')
  const [setup,      setSetup]      = useState('')
  const [note,       setNote]       = useState(pre.note ?? '')
  const [emotion,    setEmotion]    = useState('')

  // Auto-calc P&L when exit price is entered
  useEffect(() => {
    if (pnlManual) return
    const e  = parseFloat(entry)
    const ex = parseFloat(exitPrice)
    const c  = parseFloat(contracts) || 1
    if (!e || !ex || !direction) { if (!exitPrice) setPnl(''); return }
    const pts = direction === 'LONG' ? ex - e : e - ex
    const calc = (pts * MGC_PTS * c).toFixed(2)
    setPnl(calc)
    // Auto-set result
    if (!result) setResult(parseFloat(calc) > 0 ? 'win' : parseFloat(calc) < 0 ? 'loss' : 'breakeven')
  }, [entry, exitPrice, direction, contracts, pnlManual])

  // R:R live calculation
  const rr = (() => {
    const e = parseFloat(entry), s = parseFloat(sl), t = parseFloat(tp)
    if (!e || !s || !t) return null
    return (Math.abs(t - e) / Math.abs(e - s)).toFixed(2)
  })()

  function submit() {
    if (!direction || !result) { alert('Selecciona dirección y resultado'); return }
    addTrade({
      date: TODAY, session, instrument: 'XAUUSD', direction,
      entry_price: parseFloat(entry) || null,
      stop_loss:   parseFloat(sl)    || null,
      take_profit: parseFloat(tp)    || null,
      result_price: parseFloat(exitPrice) || null,
      pnl:         parseFloat(pnl)   || 0,
      rr_planned:  rr ? parseFloat(rr) : null,
      result,
      setup: { entry_zone: setup },
      emotion_before: emotion,
      lesson: note,
      checklist_passed: false,
    })
    navigate('/diary')
  }

  const pnlNum = parseFloat(pnl)
  const pnlColor = isNaN(pnlNum) ? '#7a8a9a' : pnlNum >= 0 ? '#00ff88' : '#ff3355'

  return (
    <div className="page">
      <div style={{ padding: '10px 14px 9px', borderBottom: '1px solid #1a2535', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: '#3a4a5a', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 2px', ...inter }}>XAUUSD · {TODAY}</p>
          <p style={{ color: '#e8edf2', fontSize: 13, fontWeight: 700, margin: 0, letterSpacing: '0.04em' }}>EXECUTION LOG</p>
        </div>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: '1px solid #1a2535', color: '#7a8a9a', padding: '4px 10px', fontSize: 10, fontFamily: 'inherit', cursor: 'pointer', ...inter, letterSpacing: '0.06em' }}>← BACK</button>
      </div>

      <div className="page-content">

        {/* ── INSTRUMENT + DIRECTION ──────────────────────── */}
        <SectionHeader>Instrument</SectionHeader>
        <div style={{ display: 'flex', gap: 6 }}>
          <DirButton label="▲ LONG"  active={direction === 'LONG'}  onClick={() => setDirection('LONG')}  color="#00ff88" />
          <DirButton label="▼ SHORT" active={direction === 'SHORT'} onClick={() => setDirection('SHORT')} color="#ff3355" />
        </div>

        {/* ── LEVELS + R:R ────────────────────────────────── */}
        <SectionHeader>Levels</SectionHeader>
        <div style={{ background: '#111820', border: '1px solid #1a2535' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 60px', borderBottom: '1px solid #1a2535' }}>
            {[['ENTRY', '#e8edf2'], ['STOP', '#ff3355'], ['TARGET', '#00ff88'], ['R:R', '#7a8a9a']].map(([l, c]) => (
              <div key={l} style={{ padding: '4px 8px', borderRight: '1px solid #1a2535' }}>
                <p style={{ margin: 0, fontSize: 8, color: c, textTransform: 'uppercase', letterSpacing: '0.1em', ...inter }}>{l}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 60px' }}>
            <input type="number" inputMode="decimal" value={entry} onChange={e => setEntry(e.target.value)} placeholder="3280" style={{ borderRadius: 0, borderRight: '1px solid #1a2535', borderTop: 'none', borderBottom: 'none', borderLeft: 'none', padding: '8px', fontSize: 13 }} />
            <input type="number" inputMode="decimal" value={sl}    onChange={e => setSl(e.target.value)}    placeholder="3270" style={{ borderRadius: 0, borderRight: '1px solid #1a2535', borderTop: 'none', borderBottom: 'none', borderLeft: 'none', padding: '8px', fontSize: 13 }} />
            <input type="number" inputMode="decimal" value={tp}    onChange={e => setTp(e.target.value)}    placeholder="3300" style={{ borderRadius: 0, borderRight: '1px solid #1a2535', borderTop: 'none', borderBottom: 'none', borderLeft: 'none', padding: '8px', fontSize: 13 }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: rr ? (parseFloat(rr) >= 2 ? '#00ff88' : '#ff3355') : '#3a4a5a' }}>
                {rr ? `1:${rr}` : '—'}
              </span>
            </div>
          </div>
          {rr && (
            <div style={{ padding: '5px 8px', borderTop: '1px solid #1a2535', textAlign: 'center' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: parseFloat(rr) >= 2 ? '#00ff88' : '#ff3355', letterSpacing: '0.04em' }}>
                {parseFloat(rr) >= 2 ? '✓ R:R VÁLIDO' : '✗ MÍNIMO 1:2'}
              </span>
            </div>
          )}
        </div>

        {/* ── AUTO P&L CALCULATOR ─────────────────────────── */}
        <SectionHeader>Precio salida + P&L automático</SectionHeader>
        <div style={{ background: '#111820', border: '1px solid #1a2535' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr', borderBottom: '1px solid #1a2535' }}>
            {[['PRECIO SALIDA', '#e8edf2'], ['CONTRATOS', '#7a8a9a'], ['P&L (AUTO)', pnlColor]].map(([l, c]) => (
              <div key={l} style={{ padding: '4px 8px', borderRight: '1px solid #1a2535' }}>
                <p style={{ margin: 0, fontSize: 8, color: c, textTransform: 'uppercase', letterSpacing: '0.1em', ...inter }}>{l}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr' }}>
            <input type="number" inputMode="decimal" value={exitPrice} onChange={e => { setExitPrice(e.target.value); setPnlManual(false) }} placeholder="3295" style={{ borderRadius: 0, borderRight: '1px solid #1a2535', border: 'none', borderRight: '1px solid #1a2535', padding: '8px', fontSize: 13 }} />
            <input type="number" inputMode="decimal" value={contracts} onChange={e => setContracts(e.target.value)} placeholder="1" style={{ borderRadius: 0, border: 'none', borderRight: '1px solid #1a2535', padding: '8px', fontSize: 13, textAlign: 'center' }} />
            <input type="number" inputMode="decimal" value={pnl} onChange={e => { setPnl(e.target.value); setPnlManual(true) }} placeholder="automático" style={{ borderRadius: 0, border: 'none', padding: '8px', fontSize: 13, color: pnlColor, fontWeight: 700 }} />
          </div>
          <div style={{ padding: '5px 8px', borderTop: '1px solid #1a2535' }}>
            <span style={{ fontSize: 9, color: '#3a4a5a', ...inter }}>MGC: 1 punto = $10 × contratos · Edita P&L manualmente si prefieres</span>
          </div>
        </div>

        {/* ── RESULTADO ───────────────────────────────────── */}
        <SectionHeader>Resultado</SectionHeader>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
          {[['WIN', 'win', '#00ff88'], ['LOSS', 'loss', '#ff3355'], ['BE', 'breakeven', '#ffcc00']].map(([l, v, c]) => (
            <button key={v} onClick={() => setResult(v)} style={{
              padding: '13px 0', border: `1px solid ${result === v ? c : '#1a2535'}`,
              background: result === v ? `${c}12` : '#060a0f',
              color: result === v ? c : '#3a4a5a',
              fontSize: 13, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', letterSpacing: '0.06em',
            }}>{l}</button>
          ))}
        </div>

        {/* ── SESIÓN ──────────────────────────────────────── */}
        <SectionHeader>Sesión</SectionHeader>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SESSIONS.map(s => <Chip key={s} label={s} active={session === s} onClick={() => setSession(s)} />)}
        </div>

        {/* ── SMC SETUP ────────────────────────────────────── */}
        <SectionHeader>SMC Setup — opcional</SectionHeader>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SETUPS.map(s => <Chip key={s} label={s} active={setup === s} onClick={() => setSetup(setup === s ? '' : s)} />)}
        </div>

        {/* ── PSICOLOGÍA ───────────────────────────────────── */}
        <SectionHeader>Psicología — opcional</SectionHeader>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {EMOTIONS.map(e => <Chip key={e} label={e} active={emotion === e} onClick={() => setEmotion(emotion === e ? '' : e)} color="#0088ff" />)}
        </div>

        {/* ── NOTA ─────────────────────────────────────────── */}
        <SectionHeader>Nota — opcional</SectionHeader>
        <textarea rows={2} placeholder="Qué pasó. Lección rápida..." value={note} onChange={e => setNote(e.target.value)} style={{ resize: 'none', width: '100%', borderRadius: 0 }} />

        <button className="btn-primary" onClick={submit} style={{ marginTop: 4 }}>REGISTRAR OPERACIÓN</button>
        <div style={{ height: 8 }} />
      </div>
    </div>
  )
}
