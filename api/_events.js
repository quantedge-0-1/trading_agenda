// Macro calendar — XAUUSD gold-relevant events 2026
// Sources: Federal Reserve (federalreserve.gov), BLS, BEA
// Times: ISO 8601 with ET offset (EDT = -04:00, EST = -05:00)

export const EVENTS = [
  // ── JUNE 2026 ──────────────────────────────────────────────────────────
  { id:'nfp-2026-06',  name:'Non-Farm Payrolls (May)',   date:'2026-06-05T08:30:00-04:00', importance:'high',   prev:177,  fc:185,  actual:139 },
  { id:'cpi-2026-06',  name:'CPI YoY (May)',             date:'2026-06-11T08:30:00-04:00', importance:'high',   prev:2.3,  fc:2.3,  actual:null },
  { id:'ppi-2026-06',  name:'PPI MoM (May)',             date:'2026-06-13T08:30:00-04:00', importance:'medium', prev:0.5,  fc:0.2,  actual:null },
  { id:'fomc-2026-06', name:'FOMC Rate Decision',        date:'2026-06-18T14:00:00-04:00', importance:'high',   prev:4.25, fc:4.25, actual:null },
  { id:'retail-2026-06',name:'Retail Sales MoM (May)',   date:'2026-06-17T08:30:00-04:00', importance:'medium', prev:0.1,  fc:0.2,  actual:null },
  { id:'gdp-2026-q1f', name:'GDP Q1 Final',              date:'2026-06-26T08:30:00-04:00', importance:'medium', prev:-0.3, fc:-0.2, actual:null },
  { id:'pce-2026-06',  name:'PCE Core YoY (May)',        date:'2026-06-27T08:30:00-04:00', importance:'high',   prev:2.6,  fc:2.6,  actual:null },
  { id:'ism-m-2026-06',name:'ISM Manufacturing PMI',     date:'2026-07-01T10:00:00-04:00', importance:'medium', prev:48.7, fc:49.0, actual:null },
  // ── JULY 2026 ──────────────────────────────────────────────────────────
  { id:'nfp-2026-07',  name:'Non-Farm Payrolls (Jun)',   date:'2026-07-02T08:30:00-04:00', importance:'high',   prev:null, fc:null, actual:null },
  { id:'cpi-2026-07',  name:'CPI YoY (Jun)',             date:'2026-07-14T08:30:00-04:00', importance:'high',   prev:null, fc:null, actual:null },
  { id:'ppi-2026-07',  name:'PPI MoM (Jun)',             date:'2026-07-15T08:30:00-04:00', importance:'medium', prev:null, fc:null, actual:null },
  { id:'gdp-2026-q2a', name:'GDP Q2 Advance',            date:'2026-07-30T08:30:00-04:00', importance:'high',   prev:null, fc:null, actual:null },
  { id:'fomc-2026-07', name:'FOMC Rate Decision',        date:'2026-07-30T14:00:00-04:00', importance:'high',   prev:4.25, fc:4.25, actual:null },
  { id:'pce-2026-07',  name:'PCE Core Deflator (Jun)',   date:'2026-07-31T08:30:00-04:00', importance:'high',   prev:null, fc:null, actual:null },
  // ── AUGUST 2026 ────────────────────────────────────────────────────────
  { id:'nfp-2026-08',  name:'Non-Farm Payrolls (Jul)',   date:'2026-08-07T08:30:00-04:00', importance:'high',   prev:null, fc:null, actual:null },
  { id:'cpi-2026-08',  name:'CPI YoY (Jul)',             date:'2026-08-11T08:30:00-04:00', importance:'high',   prev:null, fc:null, actual:null },
  { id:'jkh-2026-08',  name:'Jackson Hole Symposium',   date:'2026-08-27T09:00:00-04:00', importance:'high',   prev:null, fc:null, actual:null },
  { id:'pce-2026-08',  name:'PCE Core Deflator (Jul)',   date:'2026-08-28T08:30:00-04:00', importance:'high',   prev:null, fc:null, actual:null },
  // ── SEPTEMBER 2026 ─────────────────────────────────────────────────────
  { id:'nfp-2026-09',  name:'Non-Farm Payrolls (Aug)',   date:'2026-09-04T08:30:00-04:00', importance:'high',   prev:null, fc:null, actual:null },
  { id:'cpi-2026-09',  name:'CPI YoY (Aug)',             date:'2026-09-10T08:30:00-04:00', importance:'high',   prev:null, fc:null, actual:null },
  { id:'fomc-2026-09', name:'FOMC Rate Decision',        date:'2026-09-17T14:00:00-04:00', importance:'high',   prev:4.25, fc:4.25, actual:null },
  { id:'pce-2026-09',  name:'PCE Core Deflator (Aug)',   date:'2026-09-25T08:30:00-04:00', importance:'high',   prev:null, fc:null, actual:null },
  // ── OCTOBER 2026 ───────────────────────────────────────────────────────
  { id:'nfp-2026-10',  name:'Non-Farm Payrolls (Sep)',   date:'2026-10-02T08:30:00-04:00', importance:'high',   prev:null, fc:null, actual:null },
  { id:'cpi-2026-10',  name:'CPI YoY (Sep)',             date:'2026-10-14T08:30:00-04:00', importance:'high',   prev:null, fc:null, actual:null },
  { id:'fomc-2026-10', name:'FOMC Rate Decision',        date:'2026-10-29T14:00:00-04:00', importance:'high',   prev:4.25, fc:4.25, actual:null },
  { id:'pce-2026-10',  name:'PCE Core Deflator (Sep)',   date:'2026-10-30T08:30:00-04:00', importance:'high',   prev:null, fc:null, actual:null },
  // ── NOVEMBER 2026 ──────────────────────────────────────────────────────
  { id:'nfp-2026-11',  name:'Non-Farm Payrolls (Oct)',   date:'2026-11-06T08:30:00-05:00', importance:'high',   prev:null, fc:null, actual:null },
  { id:'cpi-2026-11',  name:'CPI YoY (Oct)',             date:'2026-11-12T08:30:00-05:00', importance:'high',   prev:null, fc:null, actual:null },
  { id:'pce-2026-11',  name:'PCE Core Deflator (Oct)',   date:'2026-11-25T08:30:00-05:00', importance:'high',   prev:null, fc:null, actual:null },
  // ── DECEMBER 2026 ──────────────────────────────────────────────────────
  { id:'nfp-2026-12',  name:'Non-Farm Payrolls (Nov)',   date:'2026-12-04T08:30:00-05:00', importance:'high',   prev:null, fc:null, actual:null },
  { id:'cpi-2026-12',  name:'CPI YoY (Nov)',             date:'2026-12-10T08:30:00-05:00', importance:'high',   prev:null, fc:null, actual:null },
  { id:'fomc-2026-12', name:'FOMC Rate Decision',        date:'2026-12-17T14:00:00-05:00', importance:'high',   prev:4.25, fc:4.25, actual:null },
  { id:'pce-2026-12',  name:'PCE Core Deflator (Nov)',   date:'2026-12-23T08:30:00-05:00', importance:'high',   prev:null, fc:null, actual:null },
]

export function toShape(e) {
  // Normalize to UTC ISO so Android Chrome parses correctly
  const utc = new Date(e.date).toISOString()
  return {
    id:             e.id,
    event_name:     e.name,
    event_at:       utc,          // Home.jsx uses ev.event_at
    event_date:     utc,          // compat alias
    importance:     e.importance,
    is_high_impact: e.importance === 'high',
    currency:       'USD',
    previous:       e.prev ?? null,
    forecast:       e.fc  ?? null,
    actual:         e.actual ?? null,
    unit:           e.unit ?? '',
  }
}
