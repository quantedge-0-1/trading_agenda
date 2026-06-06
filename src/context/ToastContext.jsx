import { createContext, useContext, useState, useCallback } from 'react'
import { inter } from '../utils/styles.js'

const Ctx = createContext(null)
export const useToast = () => useContext(Ctx)

const COLORS = { success: '#00ff88', error: '#ff3355', warning: '#ffcc00', info: '#0088ff' }
const PREFIX  = { success: '✓', error: '✗', warning: '⚠', info: '◆' }

function ToastList({ toasts, remove }) {
  if (!toasts.length) return null
  return (
    <div style={{
      position: 'fixed', top: 8, left: '50%', transform: 'translateX(-50%)',
      width: 'calc(100% - 28px)', maxWidth: 402,
      display: 'flex', flexDirection: 'column', gap: 6,
      zIndex: 999, pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 14px', background: '#111820',
          border: `1px solid ${COLORS[t.type]}`,
          borderLeft: `3px solid ${COLORS[t.type]}`,
          pointerEvents: 'auto',
        }}>
          <span style={{ color: COLORS[t.type], fontSize: 12, fontWeight: 700, letterSpacing: '0.04em' }}>
            {PREFIX[t.type]} {t.message}
          </span>
          <button
            onClick={() => remove(t.id)}
            style={{ background: 'none', border: 'none', color: '#3a4a5a', fontSize: 18, cursor: 'pointer', padding: '0 0 0 12px', lineHeight: 1, fontFamily: 'inherit' }}
          >×</button>
        </div>
      ))}
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), [])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(p => [...p.slice(-2), { id, message, type }])
    setTimeout(() => remove(id), 3500)
  }, [remove])

  return (
    <Ctx.Provider value={{ addToast }}>
      {children}
      <ToastList toasts={toasts} remove={remove} />
    </Ctx.Provider>
  )
}
