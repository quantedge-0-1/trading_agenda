# ESTADO DEL PROYECTO — Trading Agenda PWA
**Última actualización:** 2026-06-06  
**Commit activo:** `d5a5a40` — feat: terminal connection badge + manual bias fields  
**Branch:** `main`

---

## 1. ARQUITECTURA GENERAL

### Dos apps separadas — división estricta de responsabilidades

**Economic Intelligence Terminal** (app separada — NO está en este repo):
- Corre en `http://localhost:8001` en el desktop del trader
- Fuente: FRED API + Claude AI
- Responsabilidades: fetching de eventos reales, Surprise Score, impacto USD/Gold/Bond, análisis SMC de 4 líneas, sesgo de sesión
- Endpoints que consume la Agenda:
  - `GET /health` — verificación de conexión
  - `GET /api/v1/market/session-bias` → `{ usd_bias, xau_bias, session_bias }`
  - `GET /api/v1/news/live` → `{ events: [{ event_name, actual, forecast, surprise_pct, usd_score, xau_score, analysis: string[] }] }`
  - `GET /api/v1/pre-release/status` → `{ active, event_name, minutes_until }`

**Trading Agenda** (este repo — PWA móvil):
- Companion del terminal — NO genera análisis propios
- Reglas de datos:
  - XAUUSD en vivo: Yahoo Finance GC=F cada 30s — **ÚNICA fuente de datos en vivo**
  - Calendario económico: hardcodeado en `api/_events.js` — no necesita API externa
  - Régimen macro: lo escribe manualmente el trader en `WEEKLY_PLAN` en `apex_data.js`
  - NFP Mayo: actual=172K, forecast=85K — LARGE BEAT +102% — hardcodeado correcto
- Flujo: Terminal analiza → Trader lee en desktop → Abre agenda en teléfono → Registra trade

---

## 2. DEPLOYMENT

| Campo | Valor |
|-------|-------|
| URL pública | `https://tradingagenda.vercel.app` |
| Plataforma | Vercel (free tier) |
| Repo GitHub | `https://github.com/quantedge-0-1/trading_agenda` |
| Deploy automático | Push a `main` → Vercel build en ~2 min |
| Build command | `npm run build` |
| Output directory | `dist` |
| Framework | Vite + React |
| Routing | SPA — rewrite `/((?!api/).*) → /index.html` |

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }],
  "headers": [{ "source": "/api/(.*)", "headers": [{"key":"Cache-Control","value":"no-cache, no-store"}] }]
}
```

### Notas de deploy
- El terminal local (`localhost:8001`) **nunca es accesible desde el teléfono** — siempre aparecerá `○ TERMINAL OFFLINE` en Vercel
- Cuando se usa en desktop con el terminal corriendo, la conexión es automática
- Las serverless functions de Vercel (`api/`) son las que sirven precio y calendario al teléfono

---

## 3. STACK TÉCNICO

```
React 18 + Vite + Tailwind CSS
React Router v6
vite-plugin-pwa (PWA Android)
Vercel serverless functions (Node.js)
```

**Design system:**
- Background: `#060a0f`
- Surface: `#111820`
- Border: `#1a2535`
- Green (win/bull): `#00ff88`
- Red (loss/bear): `#ff3355`
- Yellow (warning): `#ffcc00`
- Text primary: `#e8edf2`
- Text muted: `#7a8a9a`
- Fuente: Inter (body) + Roboto Mono (precios)
- `src/utils/styles.js`: exporta `inter` y `mono` como objetos de estilo

**MGC Micro Gold Futures:** 1 punto = $10 por contrato

---

## 4. ESTRUCTURA DE ARCHIVOS

```
trading_agenda/
├── api/                          ← Vercel serverless functions
│   ├── _events.js                ← Calendario hardcodeado 2026 (60+ eventos)
│   ├── prices.js                 ← Proxy Yahoo Finance GC=F (XAUUSD)
│   ├── calendar/
│   │   ├── upcoming.js           ← Próximos 10 eventos (filtro futuro)
│   │   └── just-released.js     ← Eventos últimas 4 horas
│   └── pre-release/
│       └── status.js             ← Alerta 30 min antes de high-impact
│
├── src/
│   ├── main.jsx                  ← Entry point
│   ├── App.jsx                   ← Shell: TerminalHeader, modales, rutas
│   │
│   ├── context/
│   │   ├── AppContext.jsx         ← trades, dailyPnL, rules, account, reminder
│   │   ├── TerminalContext.jsx   ← xauPrice, upcoming, released, preRelease,
│   │   │                            terminalStatus, terminalData (localhost:8001)
│   │   └── ToastContext.jsx      ← Sistema de notificaciones toast
│   │
│   ├── pages/
│   │   ├── Home.jsx              ← Dashboard principal (macro, sesgo, eventos)
│   │   ├── Checklist.jsx         ← Checklist pre-trading
│   │   ├── Register.jsx          ← Formulario de registro de operaciones
│   │   ├── Diary.jsx             ← Historial de trades + CSV export
│   │   ├── Progress.jsx          ← Analytics: métricas, sesiones, setups, calendario P&L
│   │   ├── Rules.jsx             ← Reglas institucionales
│   │   ├── Weekly.jsx            ← Plan semanal + notas editables
│   │   ├── Learn.jsx             ← Conceptos SMC
│   │   └── Sizer.jsx             ← Position sizer (calculadora de tamaño)
│   │
│   ├── components/
│   │   └── BottomNav.jsx         ← Navegación inferior (5 tabs)
│   │
│   ├── data/
│   │   ├── apex_data.js          ← APEX_ACCOUNT, SESSIONS, LESSONS, RULES,
│   │   │                            WEEKLY_PLAN, SKILLS — datos del trader
│   │   ├── trade_log.js          ← Historial de trades pre-cargados
│   │   └── smc_data.js           ← Conceptos SMC para la página Learn
│   │
│   ├── services/
│   │   └── terminalApi.js        ← Cliente HTTP para /api/* de Vercel
│   │
│   └── utils/
│       └── styles.js             ← export const inter, export const mono
│
├── vercel.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── package.json
```

---

## 5. DATOS HARDCODEADOS CRÍTICOS (NO CAMBIAR SIN VERIFICAR)

### src/data/apex_data.js — WEEKLY_PLAN

```js
// El trader actualiza estos campos MANUALMENTE cada semana:
usd_bias: "ALCISTA",    // "ALCISTA" | "BAJISTA" | "NEUTRAL"
xau_bias: "BAJISTA",    // "ALCISTA" | "BAJISTA" | "NEUTRAL"
session_bias: "BAJISTA", // sesgo dominante de la sesión

macro_bias: "NFP Mayo BEAT fuerte (172K vs 85K, +102%). USD alcista — mercado descarta recortes Fed. Oro bajo presión bajista estructural. Buscar SHORTs en retrocesos.",

key_levels: {
  XAUUSD: {
    resistance: [4390, 4420, 4455],
    support:    [4320, 4290, 4260],
  },
},
```

### api/_events.js — NFP Mayo (CORRECTO)
```js
{ id:'nfp-2026-06', name:'Non-Farm Payrolls (May)',
  date:'2026-06-05T08:30:00-04:00',
  importance:'high', prev:147, fc:85, actual:172 }
```

### api/_events.js — Días de semana verificados
- Jun 8 = Lunes ✓
- Jun 11 = Jueves (CPI) ✓
- Jun 12 = Viernes (PPI, Michigan) ✓
- Jun 17 = Miércoles (FOMC) ✓
- Initial Jobless Claims = siempre Jueves ✓

### APEX_ACCOUNT
```js
initial_balance: 50000
current_balance: 50426.72
max_trailing_drawdown: 2000
peak_balance: 51000
trailing_limit: 49000      // peak - max_drawdown
daily_stop_loss: 150       // regla personal
max_trades_per_day: 2
```

---

## 6. ESTADO ACTUAL — QUÉ FUNCIONA

### ✅ Funciona correctamente

| Feature | Estado | Notas |
|---------|--------|-------|
| PWA instalable en Android | ✅ | vite-plugin-pwa configurado |
| Precio XAUUSD en vivo | ✅ | Yahoo Finance GC=F, cada 30s |
| Header global (precio, sesión, hora GMT-5) | ✅ | `● LIVE` / `○ OFF` |
| Calendario económico 2026 | ✅ | Hardcodeado, ~60 eventos Jun-Dic |
| Próximos eventos con countdown | ✅ | `3d 17h` format correcto |
| Eventos publicados recientes (4h) | ✅ | Con BEAT/MISS badge expandible |
| Banner pre-release (T-30min) | ✅ | Solo alto impacto |
| Recordatorio de reglas al abrir | ✅ | sessionStorage — aparece cada sesión |
| Banner stop diario ($150) | ✅ | Rojo cuando P&L ≤ -$150 |
| Banner alerta ($100) | ✅ | Amarillo cuando quedan $50 |
| Banner límite trades (2/2) | ✅ | Naranja |
| Modal post-release (dato publicado) | ✅ | Con sorpresa % y botón EJECUTAR |
| Registro de operaciones | ✅ | Formulario completo |
| Diario de trades | ✅ | Historial con filtros |
| CSV Export | ✅ | 14 columnas, descarga directa |
| Progress analytics (4 tabs) | ✅ | Métricas, Sesiones, Setups, Calendario |
| Calendario P&L mensual (heatmap) | ✅ | Verde/rojo por día, navegación meses |
| Reglas institucionales | ✅ | Con checkboxes persistentes |
| Plan semanal editable | ✅ | Notas se guardan en localStorage |
| Position Sizer (Sizer) | ✅ | Calcula contratos MGC |
| Learn (SMC) | ✅ | Conceptos de Smart Money |
| Checklist pre-trading | ✅ | |
| Persistencia localStorage | ✅ | trades, dailyPnL, rules, weeklyNotes |
| Modo trading activo (banner) | ✅ | Toggle en Home |
| Badge TERMINAL CONECTADA/OFFLINE | ✅ | En card Régimen Macro |
| Fallback a WEEKLY_PLAN cuando offline | ✅ | usd_bias, xau_bias, session_bias |
| Cache localStorage cuando terminal conectado | ✅ | "último contexto guardado" |

### ⚠️ Comportamiento conocido (no bugs)

| Situación | Comportamiento esperado |
|-----------|------------------------|
| Teléfono (Vercel) | Siempre `○ TERMINAL OFFLINE` — normal, terminal es local |
| `npm run dev` local | `○ OFF` en precio (Vercel fns no corren) — usar `vercel dev` para datos en vivo |
| Card "ÚLTIMO ANÁLISIS TERMINAL" | Solo aparece cuando terminal conectado Y tiene datos en `terminalData.lastRelease` |

### ❌ Pendiente / No implementado

| Feature | Prioridad | Notas |
|---------|-----------|-------|
| **Actualización semanal de WEEKLY_PLAN desde UI** | Alta | Actualmente requiere editar `apex_data.js` a mano y hacer push |
| **Sincronización de cache entre desktop y teléfono** | Media | localStorage es local — no sincroniza entre dispositivos |
| **Datos reales de account desde Apex** | Baja | `APEX_ACCOUNT` es hardcodeado, no se actualiza automáticamente |
| **Push notifications** (pre-release en teléfono) | Baja | PWA lo permite pero no implementado |
| **Soporte multi-semana en SESSIONS/LESSONS** | Baja | Los arrays son estáticos |

---

## 7. CONTEXTO CRÍTICO PARA PRÓXIMA SESIÓN

### Qué es y qué NO es esta app
> Esta app es un DIARIO PERSONAL y herramienta de decisión para un trader financiado.
> - NO es un terminal de noticias
> - NO genera análisis propios
> - NO conecta a APIs de trading
> - NO calcula sesgo macro automáticamente (lo hace el terminal externo)
> El trader es el que decide. El terminal es el analista. La agenda son las manos (registro + disciplina).

### Flujo de trabajo real del trader
1. Abre Economic Intelligence Terminal en desktop (localhost:8001)
2. Lee el análisis de IA + sesgo de sesión + impacto del dato
3. Abre Trading Agenda en teléfono (tradingagenda.vercel.app)
4. Revisa las reglas (modal automático al abrir)
5. Completa checklist pre-trading
6. Ejecuta la operación en su plataforma
7. Registra la operación en la Agenda

### Cómo actualizar el plan semanal (proceso manual actual)
Editar `src/data/apex_data.js` → `WEEKLY_PLAN`:
1. Cambiar `week`, `usd_bias`, `xau_bias`, `session_bias`
2. Actualizar `macro_bias` (texto del trader)
3. Actualizar `key_levels.XAUUSD` con resistencias y soportes actuales
4. Actualizar `high_impact_events` con los catalizadores de la semana
5. `git push origin main` → Vercel redeploya automáticamente

### Cómo funciona la conexión al terminal (TerminalContext.jsx)
```
Cada 30s → fetch(localhost:8001/health)
  Si OK → fetch session-bias + news/live + pre-release
         → saveCache(data) en localStorage
         → setTerminalStatus('connected')
  Si falla → setTerminalStatus('offline')
             → UI usa WEEKLY_PLAN + cache guardado
```

---

## 8. COMANDOS ÚTILES

```bash
# Desarrollo local
npm run dev           # Vite dev server en localhost:5173 (sin datos en vivo)
vercel dev            # Dev con serverless functions (datos en vivo)

# Deploy
git push origin main  # Vercel redeploya automáticamente en ~2 min

# Ver logs de Vercel
vercel logs           # Requiere Vercel CLI instalado

# Verificar build
npm run build         # Compila a /dist
```

---

## 9. HISTORIAL DE COMMITS (SESIÓN ACTUAL)

```
d5a5a40  feat: terminal connection badge + manual bias fields
68d2ba0  fix: NFP May 172K vs 85K BEAT, USD alcista/gold bajista
8e6716f  fix: calendar dates (FOMC Mié 17, Jobless Thu, no weekend)
b51cc30  feat: full weekly macro calendar Jun-Jul 2026
31b2389  fix: timeUntil shows days (3d 17h) not raw hours
e36a88c  fix: rules reminder via sessionStorage (every session)
759ce43  fix: event field names + UTC ISO dates (Android fix)
8f7cd25  feat: Vercel deployment + live XAUUSD + macro calendar 2026
426bc4b  feat: toast system + position sizer (Fase 1 y 2)
a571975  refactor: clean up duplicate code and dead exports
1d1b340  fix: audit — P&L consistency and date handling
6867fa6  feat: Trading Agenda PWA — institutional terminal UI
```

---

## 10. PARA CONTINUAR LA PRÓXIMA SESIÓN

Lee este archivo primero. Luego revisa:
1. `src/data/apex_data.js` → `WEEKLY_PLAN` para el plan semanal actual
2. `src/context/TerminalContext.jsx` → lógica de conexión al terminal
3. `src/pages/Home.jsx` → dashboard principal
4. `api/_events.js` → calendario económico hardcodeado

**La próxima tarea más importante:**
Implementar una UI en la página Weekly.jsx (o una nueva página) donde el trader pueda actualizar el WEEKLY_PLAN (sesgo, niveles, texto) directamente desde el teléfono sin tener que editar código. Los cambios se guardarían en localStorage y sobreescribirían el WEEKLY_PLAN hardcodeado.
