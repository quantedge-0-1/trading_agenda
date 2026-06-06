// ─── DATOS REALES CUENTA APEX ───────────────────────────────────────────────
export const APEX_ACCOUNT = {
  id: "APEX-600588-01",
  type: "50k Tradovate Intraday Trail",
  initial_balance: 50000,
  current_balance: 50426.72,
  total_profit: 426.72,
  profit_goal: 3000,
  max_trailing_drawdown: 2000,
  peak_balance: 51000,         // Máximo histórico alcanzado
  trailing_limit: 49000,       // peak_balance - max_drawdown
  daily_stop_loss: 150,        // Regla personal: -$150/día máximo
  max_trades_per_day: 2,
  trading_days: 7,
};

// ─── HISTORIAL DE SESIONES ───────────────────────────────────────────────────
export const SESSIONS = [
  {
    date: "2026-05-26",
    balance: 50435.76,
    pnl: 435.76,
    fills: 12,
    result: "win",
    notes: "Día fuerte — estructura clara alcista",
  },
  {
    date: "2026-05-27",
    balance: 50514.88,
    pnl: 79.12,
    fills: 4,
    result: "win",
    notes: "4 operaciones controladas",
  },
  {
    date: "2026-05-28",
    balance: 50966.54,
    pnl: 451.66,
    fills: 2,
    result: "win",
    notes: "Mejor día — 2 trades perfectos. Máximo de cuenta $51,000",
  },
  {
    date: "2026-05-29",
    balance: 50659.80,
    pnl: -306.74,
    fills: 19,
    result: "loss",
    notes: "SOBRETRADING — 19 fills. Lección: máximo 2 operaciones por día",
  },
  {
    date: "2026-06-01",
    balance: 50670.76,
    pnl: 10.96,
    fills: 12,
    result: "win",
    notes: "Día plano — muchos fills para poco resultado",
  },
  {
    date: "2026-06-02",
    balance: 50613.42,
    pnl: -57.34,
    fills: 2,
    result: "loss",
    notes: "Stop correcto — salida limpia",
  },
  {
    date: "2026-06-04",
    balance: 50426.72,
    pnl: -186.70,
    fills: 10,
    result: "loss",
    notes: "NFP día — R:R malo en entrada post-noticia. Trampa institucional.",
  },
];

// ─── LECCIONES APRENDIDAS ────────────────────────────────────────────────────
export const LESSONS = [
  {
    date: "2026-05-29",
    lesson: "Nunca hacer más de 2 operaciones por día — 19 fills = -$306",
    severity: "critical",
  },
  {
    date: "2026-06-04",
    lesson: "Nunca dejar posiciones abiertas antes del NFP",
    severity: "critical",
  },
  {
    date: "2026-06-04",
    lesson: "El spike inicial del NFP es trampa institucional — no entrar en el primer movimiento",
    severity: "high",
  },
  {
    date: "2026-06-04",
    lesson: "R:R mínimo 1:2 — no entrar con riesgo mayor que el beneficio posible",
    severity: "high",
  },
  {
    date: "2026-06-04",
    lesson: "Esperar 15 minutos después del dato antes de buscar entrada",
    severity: "high",
  },
];

// ─── REGLAS INSTITUCIONALES ──────────────────────────────────────────────────
export const RULES = [
  {
    id: 1,
    rule: "Stop diario: -$150. Si pierdes $150 en el día, cierras todo y no vuelves a abrir.",
    category: "risk",
    critical: true,
  },
  {
    id: 2,
    rule: "R:R mínimo 1:2. Si el TP no da el doble del riesgo, no entras.",
    category: "risk",
    critical: true,
  },
  {
    id: 3,
    rule: "Cerrar todo 15 minutos antes de NFP, CPI, FOMC, o cualquier dato de 3 estrellas.",
    category: "news",
    critical: true,
  },
  {
    id: 4,
    rule: "Máximo 2 operaciones por día. Calidad sobre cantidad.",
    category: "discipline",
    critical: true,
  },
  {
    id: 5,
    rule: "Solo entrar con: sweep de liquidez + CHoCH/BOS confirmado + vela de confirmación cerrada.",
    category: "setup",
    critical: false,
  },
  {
    id: 6,
    rule: "No operar en sesión asiática. Solo Londres (8am-1pm Colombia) y Nueva York (9am-12pm EST).",
    category: "session",
    critical: false,
  },
  {
    id: 7,
    rule: "Nunca mover el stop en contra. El stop protege la cuenta, no el ego.",
    category: "discipline",
    critical: true,
  },
  {
    id: 8,
    rule: "Si pierdes 2 trades seguidos en el día, paras. El mercado te está diciendo algo.",
    category: "discipline",
    critical: false,
  },
  {
    id: 9,
    rule: "Nunca operar con posiciones abiertas durante el fin de semana.",
    category: "discipline",
    critical: false,
  },
];

// ─── PLAN SEMANAL ────────────────────────────────────────────────────────────
export const WEEKLY_PLAN = {
  week: "Jun 9 - Jun 13, 2026",
  macro_bias: "NFP Mayo BEAT fuerte (172K vs 85K forecast, +102%). USD alcista — mercado descarta recortes Fed. Oro bajo presión bajista estructural. Buscar SHORTs en retrocesos.",
  key_levels: {
    XAUUSD: {
      resistance: [4390, 4420, 4455],
      support: [4320, 4290, 4260],
    },
  },
  preferred_setup: "SHORT en retroceso a OB bajista 4,380–4,400. Confirmar CHoCH en M15 + vela de confirmación cerrada. No perseguir — esperar el pullback.",
  sessions_to_trade: ["Londres", "Nueva York"],
  high_impact_events: [
    { day: "Jueves 11 Jun", event: "CPI YoY Mayo — No operar 15 min antes" },
    { day: "Miércoles 17 Jun", event: "FOMC Rate Decision — Cerrar todo 15 min antes" },
  ],
  goals: {
    min_target: 200,
    max_drawdown: 150,
    max_trades: 2,
  },
};

// ─── SKILLS SMC ──────────────────────────────────────────────────────────────
export const SKILLS = [
  { name: "Identificación de liquidez (BSL/SSL)", level: 70, color: "green" },
  { name: "Lectura macro pre-noticia", level: 65, color: "green" },
  { name: "Gestión de riesgo (R:R)", level: 40, color: "yellow" },
  { name: "Psicología — no sobretrading", level: 35, color: "yellow" },
  { name: "Timing post-noticia", level: 30, color: "red" },
  { name: "Disciplina de stop diario", level: 25, color: "red" },
];
