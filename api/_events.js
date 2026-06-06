// Macro calendar — XAUUSD gold-relevant events 2026
// Sources: Federal Reserve, BLS, BEA, Census Bureau
// Times: ISO 8601 — EDT = -04:00 (Mar–Nov), EST = -05:00 (Nov–Mar)
//
// Día de semana verificado para junio 2026:
// Jun 1=Lun | Jun 8=Lun | Jun 9=Mar | Jun 10=Mié | Jun 11=Jue | Jun 12=Vie
// Jun 15=Lun | Jun 16=Mar | Jun 17=Mié(FOMC) | Jun 18=Jue | Jun 19=Vie
// Jun 22=Lun | Jun 23=Mar | Jun 24=Mié | Jun 25=Jue | Jun 26=Vie
// Jun 29=Lun | Jun 30=Mar | Jul 1=Mié | Jul 2=Jue(NFP) | Jul 3=Vie(Holiday)

export const EVENTS = [

  // ══ NFP MAYO — YA LIBERADO ══════════════════════════════════════════════════
  // Miss fuerte: 139K vs 185K → bearish USD, bullish gold
  { id:'nfp-2026-06',      name:'Non-Farm Payrolls (May)',          date:'2026-06-05T08:30:00-04:00', importance:'high',   prev:177,  fc:185,  actual:139  },

  // ══ SEMANA 1 — Jun 9–13 ════════════════════════════════════════════════════
  // Martes 9 Jun
  { id:'nfib-2026-06',     name:'NFIB Small Business Index (May)',  date:'2026-06-09T06:00:00-04:00', importance:'medium', prev:95.8, fc:96.0, actual:null },

  // Jueves 11 Jun ← CPI + Jobless Claims (ambos 8:30 AM ET)
  { id:'cpi-2026-06',      name:'CPI YoY (May)',                    date:'2026-06-11T08:30:00-04:00', importance:'high',   prev:2.3,  fc:2.3,  actual:null },
  { id:'claims-w1-06',     name:'Initial Jobless Claims',           date:'2026-06-11T08:30:00-04:00', importance:'medium', prev:229,  fc:225,  actual:null },

  // Viernes 12 Jun ← PPI + Michigan Sentiment
  { id:'ppi-2026-06',      name:'PPI MoM (May)',                    date:'2026-06-12T08:30:00-04:00', importance:'medium', prev:0.5,  fc:0.2,  actual:null },
  { id:'umich-2026-06a',   name:'Michigan Sentiment Prel. (Jun)',   date:'2026-06-12T10:00:00-04:00', importance:'medium', prev:52.2, fc:53.0, actual:null },

  // ══ SEMANA 2 — Jun 15–19 (Semana FOMC) ════════════════════════════════════
  // Lunes 15 Jun
  { id:'empire-2026-06',   name:'Empire Manufacturing (Jun)',        date:'2026-06-15T08:30:00-04:00', importance:'medium', prev:-8.1, fc:-5.0, actual:null },

  // Martes 16 Jun
  { id:'retail-2026-06',   name:'Retail Sales MoM (May)',           date:'2026-06-16T08:30:00-04:00', importance:'medium', prev:0.1,  fc:0.2,  actual:null },
  { id:'indpro-2026-06',   name:'Industrial Production (May)',       date:'2026-06-16T09:15:00-04:00', importance:'medium', prev:0.3,  fc:0.2,  actual:null },

  // Miércoles 17 Jun ← FOMC a las 2:00 PM ET + Housing Starts 8:30 AM ET
  { id:'housing-2026-06',  name:'Housing Starts (May)',              date:'2026-06-17T08:30:00-04:00', importance:'medium', prev:1.36, fc:1.34, actual:null },
  { id:'fomc-2026-06',     name:'FOMC Rate Decision',                date:'2026-06-17T14:00:00-04:00', importance:'high',   prev:4.25, fc:4.25, actual:null },

  // Jueves 18 Jun ← Jobless Claims + Philly Fed
  { id:'claims-w2-06',     name:'Initial Jobless Claims',           date:'2026-06-18T08:30:00-04:00', importance:'medium', prev:229,  fc:227,  actual:null },
  { id:'philly-2026-06',   name:'Philly Fed Manufacturing (Jun)',    date:'2026-06-18T08:30:00-04:00', importance:'medium', prev:-4.0, fc:-2.0, actual:null },

  // Viernes 19 Jun ← Existing Home Sales
  { id:'exhome-2026-06',   name:'Existing Home Sales (May)',         date:'2026-06-19T10:00:00-04:00', importance:'medium', prev:4.0,  fc:4.1,  actual:null },

  // ══ SEMANA 3 — Jun 22–26 ═══════════════════════════════════════════════════
  // Martes 23 Jun ← New Home Sales + PMI Flash
  { id:'pmi-flash-2026-06',name:'S&P Global PMI Composite (Jun)',   date:'2026-06-23T09:45:00-04:00', importance:'medium', prev:52.1, fc:52.0, actual:null },
  { id:'newhome-2026-06',  name:'New Home Sales (May)',              date:'2026-06-24T10:00:00-04:00', importance:'medium', prev:743,  fc:730,  actual:null },

  // Miércoles 24 Jun ← Durable Goods
  { id:'durable-2026-06',  name:'Durable Goods Orders MoM (May)',   date:'2026-06-24T08:30:00-04:00', importance:'medium', prev:7.4,  fc:0.3,  actual:null },

  // Jueves 25 Jun ← Jobless Claims + GDP Q1 Final
  { id:'claims-w3-06',     name:'Initial Jobless Claims',           date:'2026-06-25T08:30:00-04:00', importance:'medium', prev:229,  fc:225,  actual:null },
  { id:'gdp-2026-q1f',     name:'GDP Q1 Final (Anualizado)',        date:'2026-06-25T08:30:00-04:00', importance:'medium', prev:-0.3, fc:-0.2, actual:null },

  // Viernes 26 Jun ← PCE Core + Michigan Sentiment Final (los más importantes de la semana)
  { id:'pce-2026-06',      name:'PCE Core YoY (May)',               date:'2026-06-26T08:30:00-04:00', importance:'high',   prev:2.6,  fc:2.6,  actual:null },
  { id:'umich-2026-06b',   name:'Michigan Sentiment Final (Jun)',    date:'2026-06-26T10:00:00-04:00', importance:'medium', prev:52.2, fc:53.0, actual:null },

  // ══ SEMANA 4 — Jun 29 – Jul 3 ══════════════════════════════════════════════
  // Lunes 29 Jun
  { id:'psi-2026-06',      name:'Personal Income / Spending (May)', date:'2026-06-29T08:30:00-04:00', importance:'medium', prev:0.5,  fc:0.4,  actual:null },

  // Martes 30 Jun
  { id:'chipmi-2026-06',   name:'Chicago PMI (Jun)',                 date:'2026-06-30T09:45:00-04:00', importance:'medium', prev:40.5, fc:42.0, actual:null },
  { id:'conf-2026-06',     name:'Consumer Confidence (Jun)',         date:'2026-06-30T10:00:00-04:00', importance:'medium', prev:98.0, fc:99.5, actual:null },

  // Miércoles 1 Jul ← ADP + ISM Manufacturing + JOLTS
  { id:'adp-2026-07',      name:'ADP Employment Change (Jun)',       date:'2026-07-01T08:15:00-04:00', importance:'medium', prev:152,  fc:140,  actual:null },
  { id:'ism-m-2026-07',    name:'ISM Manufacturing PMI (Jun)',       date:'2026-07-01T10:00:00-04:00', importance:'medium', prev:48.7, fc:49.0, actual:null },
  { id:'jolts-2026-06',    name:'JOLTS Job Openings (May)',          date:'2026-07-01T10:00:00-04:00', importance:'medium', prev:7.19, fc:7.1,  actual:null },

  // Jueves 2 Jul ← NFP movido (Jul 4=Sábado → observado Vie Jul 3 = Holiday)
  { id:'nfp-2026-07',      name:'Non-Farm Payrolls (Jun)',           date:'2026-07-02T08:30:00-04:00', importance:'high',   prev:139,  fc:160,  actual:null },
  { id:'claims-w4-07',     name:'Initial Jobless Claims',            date:'2026-07-02T08:30:00-04:00', importance:'medium', prev:229,  fc:225,  actual:null },

  // ══ SEMANA 5 — Jul 7–11 ════════════════════════════════════════════════════
  // Lunes 7 Jul ← ISM Services (delayed from holiday week)
  { id:'ism-s-2026-07',    name:'ISM Services PMI (Jun)',            date:'2026-07-07T10:00:00-04:00', importance:'medium', prev:51.6, fc:52.0, actual:null },

  // Martes 8 Jul
  { id:'nfib-2026-07',     name:'NFIB Small Business Index (Jun)',   date:'2026-07-08T06:00:00-04:00', importance:'medium', prev:96.0, fc:96.5, actual:null },

  // Jueves 10 Jul ← Jobless Claims + FOMC Minutes
  { id:'fomc-min-2026-06', name:'FOMC Minutes (Jun Meeting)',        date:'2026-07-09T14:00:00-04:00', importance:'medium', prev:null, fc:null, actual:null },
  { id:'claims-w5-07',     name:'Initial Jobless Claims',            date:'2026-07-10T08:30:00-04:00', importance:'medium', prev:229,  fc:225,  actual:null },

  // Viernes 11 Jul
  { id:'umich-2026-07a',   name:'Michigan Sentiment Prel. (Jul)',    date:'2026-07-11T10:00:00-04:00', importance:'medium', prev:53.0, fc:54.0, actual:null },

  // ══ SEMANA 6 — Jul 14–18 ═══════════════════════════════════════════════════
  // Martes 14 Jul ← CPI
  { id:'cpi-2026-07',      name:'CPI YoY (Jun)',                    date:'2026-07-14T08:30:00-04:00', importance:'high',   prev:2.3,  fc:null, actual:null },

  // Miércoles 15 Jul ← PPI + Retail Sales
  { id:'ppi-2026-07',      name:'PPI MoM (Jun)',                    date:'2026-07-15T08:30:00-04:00', importance:'medium', prev:0.2,  fc:null, actual:null },
  { id:'retail-2026-07',   name:'Retail Sales MoM (Jun)',           date:'2026-07-15T08:30:00-04:00', importance:'medium', prev:0.2,  fc:null, actual:null },

  // Jueves 16 Jul ← Jobless Claims + Philly Fed
  { id:'claims-w6-07',     name:'Initial Jobless Claims',           date:'2026-07-16T08:30:00-04:00', importance:'medium', prev:null, fc:null, actual:null },
  { id:'philly-2026-07',   name:'Philly Fed Manufacturing (Jul)',   date:'2026-07-16T08:30:00-04:00', importance:'medium', prev:null, fc:null, actual:null },

  // Viernes 17 Jul
  { id:'umich-2026-07b',   name:'Michigan Sentiment Final (Jul)',   date:'2026-07-17T10:00:00-04:00', importance:'medium', prev:null, fc:null, actual:null },

  // ══ FIN DE JULIO — FOMC + GDP Q2 ══════════════════════════════════════════
  // Miércoles 29 Jul ← FOMC
  { id:'fomc-2026-07',     name:'FOMC Rate Decision',               date:'2026-07-29T14:00:00-04:00', importance:'high',   prev:4.25, fc:4.25, actual:null },

  // Jueves 30 Jul ← GDP Q2 Advance
  { id:'gdp-2026-q2a',     name:'GDP Q2 Advance (Anualizado)',      date:'2026-07-30T08:30:00-04:00', importance:'high',   prev:null, fc:null, actual:null },

  // Viernes 31 Jul ← PCE Core Jun
  { id:'pce-2026-07',      name:'PCE Core YoY (Jun)',               date:'2026-07-31T08:30:00-04:00', importance:'high',   prev:null, fc:null, actual:null },

  // ══ AGOSTO 2026 ══════════════════════════════════════════════════════════════
  { id:'nfp-2026-08',      name:'Non-Farm Payrolls (Jul)',          date:'2026-08-07T08:30:00-04:00', importance:'high',   prev:null, fc:null, actual:null },
  { id:'cpi-2026-08',      name:'CPI YoY (Jul)',                    date:'2026-08-12T08:30:00-04:00', importance:'high',   prev:null, fc:null, actual:null },
  { id:'jkh-2026-08',      name:'Jackson Hole — Fed Chair Speech',  date:'2026-08-27T09:00:00-04:00', importance:'high',   prev:null, fc:null, actual:null },
  { id:'pce-2026-08',      name:'PCE Core YoY (Jul)',               date:'2026-08-28T08:30:00-04:00', importance:'high',   prev:null, fc:null, actual:null },

  // ══ SEPTIEMBRE 2026 ══════════════════════════════════════════════════════════
  { id:'nfp-2026-09',      name:'Non-Farm Payrolls (Aug)',          date:'2026-09-04T08:30:00-04:00', importance:'high',   prev:null, fc:null, actual:null },
  { id:'cpi-2026-09',      name:'CPI YoY (Aug)',                    date:'2026-09-10T08:30:00-04:00', importance:'high',   prev:null, fc:null, actual:null },
  { id:'fomc-2026-09',     name:'FOMC Rate Decision',               date:'2026-09-16T14:00:00-04:00', importance:'high',   prev:4.25, fc:4.25, actual:null },
  { id:'pce-2026-09',      name:'PCE Core YoY (Aug)',               date:'2026-09-25T08:30:00-04:00', importance:'high',   prev:null, fc:null, actual:null },

  // ══ OCTUBRE 2026 ══════════════════════════════════════════════════════════════
  { id:'nfp-2026-10',      name:'Non-Farm Payrolls (Sep)',          date:'2026-10-02T08:30:00-04:00', importance:'high',   prev:null, fc:null, actual:null },
  { id:'cpi-2026-10',      name:'CPI YoY (Sep)',                    date:'2026-10-13T08:30:00-04:00', importance:'high',   prev:null, fc:null, actual:null },
  { id:'fomc-2026-10',     name:'FOMC Rate Decision',               date:'2026-10-28T14:00:00-04:00', importance:'high',   prev:4.25, fc:4.25, actual:null },
  { id:'pce-2026-10',      name:'PCE Core YoY (Sep)',               date:'2026-10-30T08:30:00-04:00', importance:'high',   prev:null, fc:null, actual:null },

  // ══ NOVIEMBRE 2026 ════════════════════════════════════════════════════════════
  { id:'nfp-2026-11',      name:'Non-Farm Payrolls (Oct)',          date:'2026-11-06T08:30:00-05:00', importance:'high',   prev:null, fc:null, actual:null },
  { id:'cpi-2026-11',      name:'CPI YoY (Oct)',                    date:'2026-11-12T08:30:00-05:00', importance:'high',   prev:null, fc:null, actual:null },
  { id:'fomc-2026-11',     name:'FOMC Rate Decision',               date:'2026-11-04T14:00:00-05:00', importance:'high',   prev:4.25, fc:4.25, actual:null },
  { id:'pce-2026-11',      name:'PCE Core YoY (Oct)',               date:'2026-11-25T08:30:00-05:00', importance:'high',   prev:null, fc:null, actual:null },

  // ══ DICIEMBRE 2026 ════════════════════════════════════════════════════════════
  { id:'nfp-2026-12',      name:'Non-Farm Payrolls (Nov)',          date:'2026-12-04T08:30:00-05:00', importance:'high',   prev:null, fc:null, actual:null },
  { id:'cpi-2026-12',      name:'CPI YoY (Nov)',                    date:'2026-12-10T08:30:00-05:00', importance:'high',   prev:null, fc:null, actual:null },
  { id:'fomc-2026-12',     name:'FOMC Rate Decision',               date:'2026-12-16T14:00:00-05:00', importance:'high',   prev:4.25, fc:4.25, actual:null },
  { id:'pce-2026-12',      name:'PCE Core YoY (Nov)',               date:'2026-12-23T08:30:00-05:00', importance:'high',   prev:null, fc:null, actual:null },
]

export function toShape(e) {
  const utc = new Date(e.date).toISOString()
  return {
    id:             e.id,
    event_name:     e.name,
    event_at:       utc,
    event_date:     utc,
    importance:     e.importance,
    is_high_impact: e.importance === 'high',
    currency:       'USD',
    previous:       e.prev  ?? null,
    forecast:       e.fc    ?? null,
    actual:         e.actual ?? null,
    unit:           e.unit  ?? '',
  }
}
