import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { RULES } from '../data/apex_data.js'

export default function Rules() {
  const navigate = useNavigate()
  const { rulesChecked, toggleRule } = useApp()

  const checkedCount = RULES.filter(r => rulesChecked.includes(r.id)).length

  return (
    <div className="page">
      <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid #1a2535', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: '#6b7a8d', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Disciplina</p>
          <p style={{ color: '#cdd9e5', fontSize: 14, fontWeight: 700, margin: 0 }}>Las 9 Reglas</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#6b7a8d' }}>{checkedCount}/{RULES.length} hoy</span>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: '1px solid #1a2535', color: '#6b7a8d', padding: '4px 10px', borderRadius: 2, fontSize: 11 }}>← Volver</button>
        </div>
      </div>

      <div className="page-content">
        <p style={{ fontSize: 11, color: '#6b7a8d', margin: '0 0 8px' }}>
          Marca cada regla que hayas cumplido hoy. Se reinicia cada día.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {RULES.map(rule => {
            const isChecked = rulesChecked.includes(rule.id)
            return (
              <div
                key={rule.id}
                className="card"
                style={{
                  borderLeft: `3px solid ${rule.critical ? '#ff4444' : '#1a2535'}`,
                  cursor: 'pointer',
                  opacity: isChecked ? 0.8 : 1,
                  transition: 'opacity 0.15s',
                }}
                onClick={() => toggleRule(rule.id)}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  {/* Checkbox */}
                  <div style={{
                    width: 22, height: 22, flexShrink: 0, marginTop: 1,
                    border: `2px solid ${isChecked ? '#00ff88' : rule.critical ? '#ff4444' : '#1a2535'}`,
                    background: isChecked ? '#00ff88' : 'transparent',
                    borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isChecked && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#060a0f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: '#6b7a8d', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Regla #{rule.id} · {rule.category}
                      </span>
                      {rule.critical && (
                        <span style={{ fontSize: 9, color: '#ff4444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>CRÍTICA</span>
                      )}
                    </div>
                    <p style={{
                      margin: 0, fontSize: 13, color: isChecked ? '#6b7a8d' : '#cdd9e5',
                      lineHeight: 1.5, textDecoration: isChecked ? 'line-through' : 'none',
                    }}>
                      {rule.rule}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {checkedCount === RULES.length && (
          <div style={{ padding: '14px', background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 4, textAlign: 'center', marginTop: 8 }}>
            <p style={{ margin: 0, fontSize: 14, color: '#00ff88', fontWeight: 700 }}>✓ ¡Todas las reglas cumplidas hoy!</p>
            <p style={{ margin: '4px 0 0', fontSize: 11, color: '#6b7a8d' }}>Disciplina = consistencia = cuentas fondadas</p>
          </div>
        )}
      </div>
    </div>
  )
}
