import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PRE_ENTRY_CHECKLIST, calculateRR } from '../data/smc_data.js'

const inter = { fontFamily: 'Inter, sans-serif' }

export default function Checklist() {
  const navigate = useNavigate()
  const [checked, setChecked] = useState({})
  const [entry, setEntry] = useState('')
  const [stop,  setStop]  = useState('')
  const [tp,    setTp]    = useState('')
  const [rrResult, setRrResult] = useState(null)

  const criticalIds = PRE_ENTRY_CHECKLIST.filter(c => c.critical).map(c => c.id)
  const allCriticalPassed = criticalIds.every(id => checked[id])
  const passedCount = Object.values(checked).filter(Boolean).length

  function toggle(id) { setChecked(prev => ({ ...prev, [id]: !prev[id] })) }

  function calcRR() {
    const result = calculateRR(parseFloat(entry), parseFloat(stop), parseFloat(tp))
    setRrResult(result)
    if (result?.is_valid) setChecked(prev => ({ ...prev, rr: true }))
  }

  function reset() { setChecked({}); setRrResult(null); setEntry(''); setStop(''); setTp('') }

  const valid = allCriticalPassed && rrResult?.is_valid

  return (
    <div className="page">
      {/* Page header */}
      <div style={{ padding: '10px 14px 9px', borderBottom: '1px solid #1a2535', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: '#3a4a5a', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 2px', ...inter }}>Pre-entrada</p>
          <p style={{ color: '#e8edf2', fontSize: 13, fontWeight: 700, margin: 0, letterSpacing: '0.04em' }}>PRE-ENTRY PROTOCOL</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: valid ? '#00ff88' : '#ff3355', letterSpacing: '0.06em' }}>
            {valid ? '✓ ENTRADA VÁLIDA' : '✗ NO VÁLIDA'}
          </span>
          <span style={{ fontSize: 9, color: '#3a4a5a', ...inter }}>{passedCount}/{PRE_ENTRY_CHECKLIST.length} checks</span>
        </div>
      </div>

      <div className="page-content">

        {/* Checklist — terminal rows */}
        <div style={{ background: '#111820', border: '1px solid #1a2535' }}>
          {PRE_ENTRY_CHECKLIST.map((item, i) => {
            const isChecked = !!checked[item.id]
            return (
              <div
                key={item.id}
                onClick={() => toggle(item.id)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '10px 12px',
                  borderBottom: i < PRE_ENTRY_CHECKLIST.length - 1 ? '1px solid #1a2535' : 'none',
                  borderLeft: `2px solid ${isChecked ? '#00ff88' : item.critical ? '#ff3355' : '#1a2535'}`,
                  cursor: 'pointer', transition: 'background 0.1s',
                  background: isChecked ? 'rgba(0,255,136,0.03)' : 'transparent',
                }}
              >
                {/* Checkbox */}
                <div style={{
                  width: 18, height: 18, border: `1px solid ${isChecked ? '#00ff88' : item.critical ? '#ff3355' : '#3a4a5a'}`,
                  background: isChecked ? '#00ff88' : 'transparent', flexShrink: 0, marginTop: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isChecked && <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#060a0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                </div>
                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: '0 0 2px', fontSize: 12, color: isChecked ? '#e8edf2' : '#7a8a9a', fontWeight: isChecked ? 600 : 400, lineHeight: 1.3 }}>
                    {item.question}
                  </p>
                  <p style={{ margin: 0, fontSize: 10, color: '#3a4a5a', lineHeight: 1.4, ...inter }}>{item.detail}</p>
                </div>
                {item.critical && !isChecked && (
                  <span style={{ fontSize: 8, color: '#ff3355', textTransform: 'uppercase', letterSpacing: '0.08em', ...inter, flexShrink: 0, marginTop: 2 }}>CRÍTICO</span>
                )}
              </div>
            )
          })}
        </div>

        {/* R:R Calculator — terminal box */}
        <div style={{ background: '#111820', border: '1px solid #1a2535' }}>
          <div style={{ padding: '7px 12px', borderBottom: '1px solid #1a2535' }}>
            <span style={{ color: '#3a4a5a', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', ...inter }}>Calculadora R:R</span>
          </div>
          <div style={{ padding: '12px' }}>
            {/* Inputs row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
              {[['ENTRY', entry, setEntry, '#e8edf2'], ['STOP', stop, setStop, '#ff3355'], ['TARGET', tp, setTp, '#00ff88']].map(([lbl, val, setter, color]) => (
                <div key={lbl}>
                  <p style={{ margin: '0 0 4px', fontSize: 9, color, textTransform: 'uppercase', letterSpacing: '0.1em', ...inter }}>{lbl}</p>
                  <input type="number" inputMode="decimal" value={val} onChange={e => setter(e.target.value)} placeholder="0.00" style={{ fontSize: 13, padding: '6px 8px' }} />
                </div>
              ))}
            </div>

            {/* Result box */}
            {rrResult ? (
              <div style={{ background: '#060a0f', border: `1px solid ${rrResult.is_valid ? '#00ff88' : '#ff3355'}`, padding: '12px', marginBottom: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
                  {[['RISK', `${rrResult.risk_points}pts · $${rrResult.risk_dollars}`, '#ff3355'], ['REWARD', `${rrResult.reward_points}pts · $${rrResult.reward_dollars}`, '#00ff88'], ['RATIO', `1:${rrResult.rr_ratio}`, rrResult.is_valid ? '#00ff88' : '#ff3355']].map(([l, v, c]) => (
                    <div key={l} style={{ textAlign: 'center' }}>
                      <p style={{ margin: '0 0 3px', fontSize: 8, color: '#3a4a5a', textTransform: 'uppercase', letterSpacing: '0.1em', ...inter }}>{l}</p>
                      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: c }}>{v}</p>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: 'center', borderTop: '1px solid #1a2535', paddingTop: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: rrResult.is_valid ? '#00ff88' : '#ff3355', letterSpacing: '0.06em' }}>
                    {rrResult.is_valid ? '✓ R:R VÁLIDO — PUEDE PROCEDER' : '✗ R:R INSUFICIENTE — MÍNIMO 1:2'}
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ background: '#060a0f', border: '1px solid #1a2535', padding: '12px', textAlign: 'center', marginBottom: 10 }}>
                <span style={{ color: '#3a4a5a', fontSize: 11, letterSpacing: '0.04em' }}>Ingresa los niveles para calcular</span>
              </div>
            )}

            <button className="btn-secondary" onClick={calcRR} style={{ fontSize: 11 }}>CALCULAR R:R</button>
          </div>
        </div>

        {/* CTA */}
        {valid ? (
          <button className="btn-primary" onClick={() => navigate('/register')}>
            ✓ ENTRADA VÁLIDA — REGISTRAR OPERACIÓN
          </button>
        ) : (
          <div style={{ background: '#111820', border: '1px solid #1a2535', borderLeft: '2px solid #ff3355', padding: '12px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 3px', fontSize: 12, color: '#ff3355', fontWeight: 600 }}>
              {criticalIds.filter(id => !checked[id]).length} check(s) críticos pendientes
            </p>
            <p style={{ margin: 0, fontSize: 10, color: '#3a4a5a', ...inter }}>
              {!rrResult?.is_valid && 'Calcula el R:R antes de proceder'}
            </p>
          </div>
        )}

        <button className="btn-secondary" onClick={reset} style={{ fontSize: 10 }}>REINICIAR CHECKLIST</button>
        <div style={{ height: 4 }} />
      </div>
    </div>
  )
}
