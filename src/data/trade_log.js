// ─── ESTRUCTURA DEL DIARIO DE TRADES ────────────────────────────────────────
// Este archivo define la estructura de datos para registrar cada operación.
// Se usa como template para el formulario de nueva operación.

export const TRADE_TEMPLATE = {
  id: null,                    // Auto-generado
  date: "",                    // Fecha de la operación
  session: "",                 // Londres | Nueva York
  instrument: "XAUUSD",        // XAUUSD | NAS100 | EURUSD
  direction: "",               // LONG | SHORT
  entry_price: null,
  stop_loss: null,
  take_profit: null,
  result_price: null,          // Precio de cierre real
  pnl: null,                   // P&L en USD
  rr_planned: null,            // R:R planeado
  rr_actual: null,             // R:R real obtenido

  // Contexto macro
  macro_context: "",           // NFP, CPI, sin noticias, etc.
  bias_before_entry: "",       // Alcista | Bajista | Neutral

  // Setup SMC
  setup: {
    liquidity_swept: false,    // ¿Hubo sweep de liquidez?
    sweep_type: "",            // BSL | SSL
    structure_confirmation: "",// BOS | CHoCH | Ninguno
    entry_zone: "",            // Order Block | FVG | Equilibrio
    price_zone: "",            // Premium | Discount | Equilibrium
    timeframe_entry: "",       // M1 | M5 | M15
  },

  // Resultado
  result: "",                  // win | loss | breakeven
  checklist_passed: false,     // ¿Pasó todos los filtros?
  emotion_before: "",          // Calmado | Ansioso | Confiado | FOMO
  emotion_after: "",           // Satisfecho | Frustrado | Neutral

  // Aprendizaje
  what_went_right: "",
  what_to_improve: "",
  lesson: "",
};

// ─── TRADES REGISTRADOS DE ESTA SEMANA ──────────────────────────────────────
export const TRADE_LOG = [
  {
    id: 1,
    date: "2026-06-04",
    session: "Londres",
    instrument: "XAUUSD",
    direction: "LONG",
    entry_price: 4479,
    stop_loss: 4466,
    take_profit: 4511,
    result_price: 4511,
    pnl: 60,
    rr_planned: 2.46,
    rr_actual: 2.46,
    macro_context: "Pre-NFP — sin noticia aún",
    bias_before_entry: "Alcista",
    setup: {
      liquidity_swept: true,
      sweep_type: "SSL",
      structure_confirmation: "CHoCH",
      entry_zone: "Order Block",
      price_zone: "Discount",
      timeframe_entry: "M5",
    },
    result: "win",
    checklist_passed: true,
    emotion_before: "Calmado",
    emotion_after: "Satisfecho",
    what_went_right: "Entrada en zona correcta después de sweep SSL",
    what_to_improve: "TP fue conservador — el precio siguió subiendo",
    lesson: "Dejar correr más las operaciones ganadoras",
  },
  {
    id: 2,
    date: "2026-06-04",
    session: "Nueva York",
    instrument: "XAUUSD",
    direction: "LONG",
    entry_price: 4479,
    stop_loss: 4466,
    take_profit: 4511,
    result_price: 4466,
    pnl: -83,
    rr_planned: 2.46,
    rr_actual: -1,
    macro_context: "Pre-NFP — dejé posición abierta de noche",
    bias_before_entry: "Alcista",
    setup: {
      liquidity_swept: true,
      sweep_type: "SSL",
      structure_confirmation: "BOS",
      entry_zone: "Order Block",
      price_zone: "Discount",
      timeframe_entry: "M15",
    },
    result: "loss",
    checklist_passed: false,
    emotion_before: "Confiado",
    emotion_after: "Frustrado",
    what_went_right: "Stop respetado — no moví el SL",
    what_to_improve: "Nunca dejar posición abierta antes del NFP",
    lesson: "REGLA CRÍTICA: cerrar todo 15 min antes de datos de alto impacto",
  },
  {
    id: 3,
    date: "2026-06-05",
    session: "Nueva York",
    instrument: "XAUUSD",
    direction: "SHORT",
    entry_price: 4503,
    stop_loss: 4515,
    take_profit: 4490,
    result_price: 4503,
    pnl: -106,
    rr_planned: 0.1,
    rr_actual: -1,
    macro_context: "Post-NFP — NFP fuerte 172K vs 115K",
    bias_before_entry: "Bajista",
    setup: {
      liquidity_swept: false,
      sweep_type: "",
      structure_confirmation: "BOS",
      entry_zone: "Order Block",
      price_zone: "Premium",
      timeframe_entry: "M1",
    },
    result: "loss",
    checklist_passed: false,
    emotion_before: "Ansioso",
    emotion_after: "Frustrado",
    what_went_right: "La dirección era correcta (bajista)",
    what_to_improve: "R:R fue 1:0.1 — inaceptable. TP demasiado cercano.",
    lesson: "R:R mínimo 1:2 SIEMPRE. Esta entrada no debería haberse ejecutado.",
  },
];
