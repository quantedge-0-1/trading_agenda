# PROMPT PARA CLAUDE CODE — TRADING AGENDA MÓVIL

## CONTEXTO COMPLETO

Soy Esteban, trader en desarrollo operando una cuenta de fondeo Apex de $50,000.
Llevo 6 meses aprendiendo trading institucional con enfoque en Smart Money Concepts (SMC).

Mi objetivo: pasar la cuenta Apex generando $3,000 de profit sin superar $2,000 de drawdown.
Opero principalmente XAUUSD (Micro Gold Futures - MGC) en Tradovate.

Los datos reales de mi cuenta están en:
- src/data/apex_data.js — balance, sesiones, reglas, plan semanal
- src/data/smc_data.js — checklist SMC, glosario, conceptos macro
- src/data/trade_log.js — historial de operaciones

---

## TU MISIÓN

Construir una Progressive Web App (PWA) móvil que funcione como mi agenda de trading
personal en el teléfono. Debe verse como una app nativa, instalable desde el navegador.

---

## STACK TÉCNICO

- React 18 + Vite
- Tailwind CSS (mobile-first)
- React Router para navegación entre páginas
- localStorage para persistencia de datos
- PWA con service worker para uso offline
- Sin backend — todo en el cliente

---

## DISEÑO

Estilo: Terminal institucional oscura. Inspiración Bloomberg/Tradovate.
- Fondo: #060a0f (negro profundo)
- Acento verde: #00ff88 (profit, confirmaciones)
- Acento rojo: #ff4444 (pérdidas, alertas)
- Texto principal: #cdd9e5
- Fuente: JetBrains Mono (monospace)
- Sin bordes redondeados exagerados — estilo terminal profesional

---

## PÁGINAS / MÓDULOS

### 1. Home — Dashboard principal
Muestra al abrir la app:
- Balance actual Apex: $50,426.72
- P&L de hoy (editable)
- Drawdown disponible con barra visual (roja si < $300)
- Progreso hacia $3,000 meta
- Botón rápido "Registrar operación"
- Próxima noticia del día (manual)
- Estado del día: OPERANDO / STOP DIARIO ALCANZADO / FIN DE DÍA

### 2. Pre-entrada — Checklist SMC
Antes de cada operación:
- 8 checkboxes con preguntas del checklist SMC
- Calculadora R:R (entrada, stop, TP → calcula ratio automáticamente)
- Indicador visual: ENTRADA VÁLIDA / NO VÁLIDA
- Botón "Ir a registrar" si pasa el checklist

### 3. Registrar operación
Formulario completo:
- Fecha, sesión, instrumento, dirección
- Entrada, stop, TP
- Setup SMC (sweep, estructura, zona)
- Contexto macro
- Emoción antes/después
- Qué salió bien / qué mejorar
- Resultado y P&L real
- Guarda en localStorage

### 4. Diario de trades
Lista de todas las operaciones registradas:
- Filtrar por: semana, resultado, instrumento
- Cada operación: fecha, dirección, P&L, R:R, badge win/loss
- Tap para ver detalle completo
- Estadísticas: win rate, P&L total, mejor/peor día

### 5. Reglas — Las 9 reglas
Las 9 reglas institucionales de Esteban:
- Diseño de tarjetas, una por regla
- Reglas críticas marcadas en rojo
- Botón para marcar si la cumpliste hoy

### 6. Aprender — Glosario SMC + Macro
Referencia rápida en el teléfono:
- BSL, SSL, BOS, CHoCH, OB, FVG, Premium/Discount
- NFP, CPI, FOMC — cómo afectan al oro
- Tap para expandir explicación + ejemplo

### 7. Plan semanal
- Sesgo macro de la semana
- Niveles clave XAUUSD
- Setup preferido
- Noticias de alto impacto
- Notas editables

### 8. Progreso
- Barras de habilidades SMC (6 métricas)
- Registro semanal histórico
- Racha actual (días ganadores consecutivos)
- Gráfico simple de balance por semana

---

## NAVEGACIÓN MÓVIL

Bottom navigation bar con 5 iconos:
- Home (dashboard)
- Checklist (pre-entrada)
- + (registrar operación — botón central destacado)
- Diario
- Aprender

---

## DATOS INICIALES

Importa los datos desde los archivos en src/data/.
Pre-carga el trade log con las 3 operaciones ya registradas.
Pre-carga las 9 reglas, el glosario SMC y el plan semanal.

---

## PWA

Configurar para que sea instalable en Android/iOS:
- manifest.json con nombre "Trading Agenda — Esteban"
- Icono negro con letra E en verde (#00ff88)
- service worker básico para cache offline
- Tema color: #060a0f

---

## FUNCIONALIDADES ADICIONALES

- Al abrir la app cada día: popup con las 3 reglas más importantes (recordatorio diario)
- Alerta visual roja si el P&L del día llega a -$100 (advertencia antes del stop de -$150)
- Contador de operaciones del día (máximo 2 — resalta en rojo si intenta la tercera)
- Modo "trading activo": banner en la parte superior cuando hay una operación abierta

---

## ENTREGABLE

1. App React completa en una sola carpeta
2. Funciona en http://localhost:3000
3. Instalable como PWA en el teléfono de Esteban
4. Todos los datos de apex_data.js, smc_data.js y trade_log.js cargados

Implementa todo de una vez, módulo por módulo.
Confirma cada página antes de pasar a la siguiente.
