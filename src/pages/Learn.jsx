import { useState } from 'react'
import { SMC_GLOSSARY, MACRO_CONCEPTS, PRE_ENTRY_CHECKLIST } from '../data/smc_data.js'

const TABS = ['Conceptos', 'Macro', 'Checklist']

export default function Learn() {
  const [tab, setTab] = useState('Conceptos')
  const [expanded, setExpanded] = useState(null)

  return (
    <div className="page">
      <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid #1a2535' }}>
        <p style={{ color: '#6b7a8d', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Referencia</p>
        <p style={{ color: '#cdd9e5', fontSize: 14, fontWeight: 700, margin: 0 }}>Aprender SMC</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #1a2535' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => { setTab(t); setExpanded(null) }} style={{
            flex: 1, padding: '10px 0', border: 'none', borderBottom: '2px solid',
            borderBottomColor: tab === t ? '#00ff88' : 'transparent',
            background: 'transparent', color: tab === t ? '#00ff88' : '#6b7a8d',
            fontSize: 12, fontWeight: tab === t ? 700 : 400, fontFamily: 'inherit',
            transition: 'all 0.15s',
          }}>{t}</button>
        ))}
      </div>

      <div className="page-content">
        {tab === 'Conceptos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {SMC_GLOSSARY.map((item, i) => {
              const isOpen = expanded === i
              return (
                <div key={i} className="card" onClick={() => setExpanded(isOpen ? null : i)} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#00ff88' }}>{item.term}</p>
                    <span style={{ color: '#6b7a8d', fontSize: 16, lineHeight: 1 }}>{isOpen ? '▲' : '▼'}</span>
                  </div>
                  {isOpen && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #1a2535' }}>
                      <p style={{ margin: '0 0 8px', fontSize: 13, color: '#cdd9e5', lineHeight: 1.5 }}>{item.definition}</p>
                      <div style={{ padding: '8px 10px', background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.15)', borderRadius: 3 }}>
                        <p style={{ margin: 0, fontSize: 11, color: '#6b7a8d', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Ejemplo</p>
                        <p style={{ margin: 0, fontSize: 12, color: '#cdd9e5', lineHeight: 1.5, fontStyle: 'italic' }}>{item.example}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {tab === 'Macro' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MACRO_CONCEPTS.map((item, i) => (
              <div key={i} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#cdd9e5' }}>{item.event}</p>
                  <span style={{ fontSize: 10, color: '#ff4444', border: '1px solid rgba(255,68,68,0.3)', padding: '2px 6px', borderRadius: 2, whiteSpace: 'nowrap' }}>
                    {item.impact.split('—')[0].trim()}
                  </span>
                </div>
                {[
                  { label: 'Regla', text: item.rule, color: '#00ff88' },
                  { label: 'Trampa', text: item.trap, color: '#ffcc00' },
                  { label: 'Acción', text: item.action, color: '#cdd9e5' },
                ].map(({ label, text, color }) => (
                  <div key={label} style={{ marginBottom: 8 }}>
                    <p style={{ margin: '0 0 3px', fontSize: 9, color: '#6b7a8d', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</p>
                    <p style={{ margin: 0, fontSize: 12, color, lineHeight: 1.5 }}>{text}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {tab === 'Checklist' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <p style={{ fontSize: 11, color: '#6b7a8d', margin: '0 0 8px' }}>
              Referencia rápida — usa la página Checklist para marcar antes de operar
            </p>
            {PRE_ENTRY_CHECKLIST.map((item, i) => (
              <div key={i} className="card" style={{ borderLeft: `3px solid ${item.critical ? '#ff4444' : '#1a2535'}` }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 13, color: item.critical ? '#ff4444' : '#00ff88', flexShrink: 0, marginTop: 1 }}>
                    {item.critical ? '⚠' : '✓'}
                  </span>
                  <div>
                    <p style={{ margin: '0 0 4px', fontSize: 13, color: '#cdd9e5', fontWeight: 500 }}>{item.question}</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#6b7a8d', lineHeight: 1.4 }}>{item.detail}</p>
                    {item.critical && (
                      <span style={{ fontSize: 9, color: '#ff4444', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>CRÍTICO</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
