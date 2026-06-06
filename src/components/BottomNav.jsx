import { useLocation, useNavigate } from 'react-router-dom'

const TABS = [
  { path: '/',          icon: HomeIcon,  label: 'Home' },
  { path: '/checklist', icon: CheckIcon, label: 'Check' },
  { path: '/register',  icon: PlusIcon,  label: '',      center: true },
  { path: '/diary',     icon: BookIcon,  label: 'Diario' },
  { path: '/sizer',     icon: CalcIcon,  label: 'Calc' },
]

export default function BottomNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      height: 64,
      background: '#0d1520',
      borderTop: '1px solid #1a2535',
      display: 'flex',
      alignItems: 'center',
      zIndex: 100,
    }}>
      {TABS.map(tab => {
        const active = pathname === tab.path
        if (tab.center) {
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: 'none',
                background: 'transparent',
                padding: 0,
              }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: active ? '#00cc6a' : '#00ff88',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(0,255,136,0.4)',
                marginBottom: 4,
              }}>
                <tab.icon size={24} color="#060a0f" />
              </div>
            </button>
          )
        }
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              border: 'none',
              background: 'transparent',
              padding: '8px 0',
              color: active ? '#00ff88' : '#6b7a8d',
              transition: 'color 0.15s',
            }}
          >
            <tab.icon size={20} color={active ? '#00ff88' : '#6b7a8d'} />
            <span style={{ fontSize: 10, letterSpacing: '0.04em' }}>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

function HomeIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}

function CheckIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  )
}

function PlusIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
}

function BookIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  )
}

function CalcIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2"/>
      <line x1="8" y1="6" x2="16" y2="6"/>
      <line x1="8" y1="10" x2="10" y2="10"/>
      <line x1="14" y1="10" x2="16" y2="10"/>
      <line x1="8" y1="14" x2="10" y2="14"/>
      <line x1="14" y1="14" x2="16" y2="14"/>
      <line x1="8" y1="18" x2="10" y2="18"/>
      <line x1="14" y1="18" x2="16" y2="18"/>
    </svg>
  )
}
