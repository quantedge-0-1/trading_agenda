// ─── CHECKLIST PRE-ENTRADA SMC ───────────────────────────────────────────────
export const PRE_ENTRY_CHECKLIST = [
  {
    id: "rr",
    question: "¿El R:R es mínimo 1:2?",
    detail: "El beneficio potencial debe ser al menos el doble del riesgo.",
    critical: true,
  },
  {
    id: "liquidity",
    question: "¿Hubo sweep de liquidez antes de entrar?",
    detail: "El precio debe haber cazado stops (BSL o SSL) antes del movimiento real.",
    critical: true,
  },
  {
    id: "structure",
    question: "¿Hay CHoCH o BOS confirmado?",
    detail: "Cambio de carácter o ruptura de estructura debe estar visible en M5 o M15.",
    critical: true,
  },
  {
    id: "session",
    question: "¿Estoy en sesión Londres o Nueva York?",
    detail: "No operar en sesión asiática. Liquidez institucional está en Londres y NY.",
    critical: true,
  },
  {
    id: "news",
    question: "¿No hay noticias de alto impacto en próximos 15 min?",
    detail: "Revisar calendario. NFP, CPI, FOMC = cerrar todo 15 min antes.",
    critical: true,
  },
  {
    id: "daily_loss",
    question: "¿He perdido menos de $150 hoy?",
    detail: "Si ya llegaste al stop diario de $150, no abres más operaciones hoy.",
    critical: true,
  },
  {
    id: "trade_count",
    question: "¿Es mi primera o segunda operación del día?",
    detail: "Máximo 2 operaciones por día. Calidad sobre cantidad.",
    critical: false,
  },
  {
    id: "confirmation",
    question: "¿Hay vela de confirmación cerrada en dirección de la entrada?",
    detail: "No entrar en velas abiertas. Esperar cierre de vela de confirmación.",
    critical: false,
  },
];

// ─── CALCULADORA R:R ─────────────────────────────────────────────────────────
export function calculateRR(entry, stopLoss, takeProfit) {
  if (!entry || !stopLoss || !takeProfit) return null;

  const risk = Math.abs(entry - stopLoss);
  const reward = Math.abs(takeProfit - entry);
  const rr = reward / risk;
  const isValid = rr >= 2;

  // Para MGC (Micro Gold): 1 punto = $1 por contrato
  const riskDollars = risk * 1;
  const rewardDollars = reward * 1;

  return {
    risk_points: risk.toFixed(1),
    reward_points: reward.toFixed(1),
    rr_ratio: rr.toFixed(2),
    is_valid: isValid,
    risk_dollars: riskDollars.toFixed(2),
    reward_dollars: rewardDollars.toFixed(2),
    message: isValid
      ? `Válido — R:R 1:${rr.toFixed(2)}. Puedes entrar si el setup confirma.`
      : `No válido — R:R 1:${rr.toFixed(2)}. Necesitas mínimo 1:2. Mueve el TP.`,
  };
}

// ─── SMC CONCEPTS GLOSSARY ───────────────────────────────────────────────────
export const SMC_GLOSSARY = [
  {
    term: "BSL (Buy-Side Liquidity)",
    definition: "Stops de vendedores y órdenes de compra acumuladas sobre máximos recientes. Los institucionales suben el precio para cazarlos antes de vender.",
    example: "Precio sube a zona de máximos → barre BSL → revierte bajista = trampa alcista.",
  },
  {
    term: "SSL (Sell-Side Liquidity)",
    definition: "Stops de compradores y órdenes de venta acumuladas bajo mínimos recientes. Los institucionales bajan el precio para cazarlos antes de comprar.",
    example: "Precio baja a zona de mínimos → barre SSL → revierte alcista = tu entrada LONG.",
  },
  {
    term: "BOS (Break of Structure)",
    definition: "Ruptura de un máximo o mínimo previo que confirma continuación de tendencia institucional.",
    example: "Tendencia alcista: precio rompe el último máximo = BOS alcista confirmado.",
  },
  {
    term: "CHoCH (Change of Character)",
    definition: "Primera señal de reversión. El precio rompe en dirección opuesta a la tendencia actual.",
    example: "En tendencia bajista: precio rompe último máximo = CHoCH = posible inicio alcista.",
  },
  {
    term: "Order Block (OB)",
    definition: "Última vela antes de un movimiento impulsivo institucional. Zona donde los bancos colocaron órdenes masivas.",
    example: "Vela bajista antes de caída fuerte = OB bajista. El precio vuelve ahí para re-testearlo.",
  },
  {
    term: "FVG (Fair Value Gap)",
    definition: "Brecha de precio creada por movimiento impulsivo. El mercado tiende a volver a llenarla antes de continuar.",
    example: "Vela grande alcista deja gap entre high de vela anterior y low de vela siguiente = FVG alcista.",
  },
  {
    term: "Premium / Discount",
    definition: "Precio en zona cara (Premium = sobre el 50% del rango) o barata (Discount = bajo el 50%). Comprar en Discount, vender en Premium.",
    example: "Rango 4,400-4,500. Equilibrio = 4,450. Por encima = Premium (vender). Por debajo = Discount (comprar).",
  },
  {
    term: "Discount Score",
    definition: "Métrica -100 a +100 que calcula si el mercado ya descontó la noticia antes de que salga.",
    example: "+80 = mercado ya subió fuerte antes del dato = institucionales ya compraron = vender la noticia.",
  },
];

// ─── MACRO CONCEPTS ──────────────────────────────────────────────────────────
export const MACRO_CONCEPTS = [
  {
    event: "NFP (Non Farm Payrolls)",
    impact: "Crítico — mueve el oro 100-500 puntos",
    rule: "NFP fuerte → USD sube → Oro baja. NFP débil → USD baja → Oro sube.",
    trap: "El spike inicial del NFP es trampa. La dirección real aparece 15 min después.",
    action: "Cerrar todo 15 min antes. Esperar 15 min después. Entrar con el retroceso al FVG.",
  },
  {
    event: "CPI (Consumer Price Index)",
    impact: "Muy alto — inflación = política Fed",
    rule: "CPI alto → Fed sube tasas → USD sube → Oro baja. CPI bajo → Fed baja tasas → Oro sube.",
    trap: "CPI alto con oro subiendo = divergencia. Institucionales ya tenían posición. Fade el movimiento.",
    action: "Analizar surprise score. Si supera forecast > 10% = movimiento explosivo.",
  },
  {
    event: "FOMC Rate Decision",
    impact: "Extremo — decisión de tasas",
    rule: "Sube tasas → USD fuerte → Oro cae. Baja tasas → USD débil → Oro sube.",
    trap: "Buy the rumor, sell the news. El mercado anticipa la decisión semanas antes.",
    action: "No operar durante el comunicado. Solo entrar 30 min después cuando la volatilidad baje.",
  },
];
