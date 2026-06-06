import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { WEEKLY_PLAN } from '../data/apex_data.js'

export default function Weekly() {
  const navigate = useNavigate()
  const { weeklyNotes, setWeeklyNotes } = useApp()

  const set = (key, val) => setWeeklyNotes(prev => ({ ...prev, [key]: val }))

  const levels = WEEKLY_PLAN.key_levels.XAUUSD
  const allLevels = [
    ...levels.resistance.map(p => ({ price: p, type: 'R' })),
    ...levels.support.map(p => ({ price: p, type: 'S' })),
  ].sort((a, b) => b.price - a.price)

  return (
    <div className="page">
      <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid #1a2535', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: '#6b7a8d', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Estrategia</p>
          <p style={{ color: '#cdd9e5', fontSize: 14, fontWeight: 700, margin: 0 }}>Plan semanal</p>
        </div>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: '1px solid #1a2535', color: '#6b7a8d', padding: '4px 10px', borderRadius: 2, fontSize: 11 }}>← Volver</button>
      </div>

      <div className="page-content">
        {/* Week header */}
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 4px', fontSize: 10, color: '#6b7a8d', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Semana actual</p>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#00ff88' }}>{WEEKLY_PLAN.week}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8 }}>
            <span style={{ fontSize: 11, color: '#6b7a8d' }}>Meta: <span style={{ color: '#00ff88' }}>${WEEKLY_PLAN.goals.min_target}</span></span>
            <span style={{ fontSize: 11, color: '#6b7a8d' }}>Max DD: <span style={{ color: '#ff4444' }}>${WEEKLY_PLAN.goals.max_drawdown}</span></span>
            <span style={{ fontSize: 11, color: '#6b7a8d' }}>Max trades: <span style={{ color: '#ffcc00' }}>{WEEKLY_PLAN.goals.max_trades}/día</span></span>
          </div>
        </div>

        {/* Macro bias */}
        <div className="card">
          <p className="section-title">Sesgo macro</p>
          <textarea
            value={weeklyNotes.bias}
            onChange={e => set('bias', e.target.value)}
            rows={3}
            style={{ resize: 'none', lineHeight: 1.5 }}
          />
        </div>

        {/* Key levels */}
        <div className="card">
          <p className="section-title">Niveles clave XAUUSD</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {allLevels.map(({ price, type }) => (
              <div key={price} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, width: 14, textAlign: 'center',
                  color: type === 'R' ? '#ff4444' : '#00ff88',
                }}>{type}</span>
                <div style={{ flex: 1, height: 1, background: type === 'R' ? 'rgba(255,68,68,0.2)' : 'rgba(0,255,136,0.2)' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: type === 'R' ? '#ff4444' : '#00ff88', fontFamily: 'mono', letterSpacing: '0.03em' }}>
                  {price.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Setup preferido */}
        <div className="card">
          <p className="section-title">Setup preferido esta semana</p>
          <textarea
            value={weeklyNotes.setup}
            onChange={e => set('setup', e.target.value)}
            rows={3}
            style={{ resize: 'none', lineHeight: 1.5 }}
          />
        </div>

        {/* High impact events */}
        <div className="card">
          <p className="section-title">Eventos de alto impacto</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {WEEKLY_PLAN.high_impact_events.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 10px', background: '#060a0f', borderRadius: 3, borderLeft: '2px solid #ffcc00' }}>
                <span style={{ fontSize: 11, color: '#ffcc00', fontWeight: 700, flexShrink: 0 }}>{e.day}</span>
                <span style={{ fontSize: 11, color: '#cdd9e5' }}>{e.event}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="card">
          <p className="section-title">Notas personales</p>
          <textarea
            value={weeklyNotes.notes}
            onChange={e => set('notes', e.target.value)}
            rows={4}
            placeholder="Observaciones, alertas mentales, metas adicionales..."
            style={{ resize: 'none', lineHeight: 1.5 }}
          />
        </div>

        <p style={{ fontSize: 10, color: '#6b7a8d', textAlign: 'center', margin: '4px 0' }}>
          Los cambios se guardan automáticamente
        </p>
      </div>
    </div>
  )
}
