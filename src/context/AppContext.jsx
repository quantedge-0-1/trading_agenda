import { createContext, useContext, useState, useEffect } from 'react'
import { TRADE_LOG } from '../data/trade_log.js'
import { APEX_ACCOUNT, WEEKLY_PLAN } from '../data/apex_data.js'

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

const TODAY = new Date().toISOString().slice(0, 10)

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function AppProvider({ children }) {
  // Trades — merge preloaded + stored (dedup by id)
  const [trades, setTrades] = useState(() => {
    const stored = load('trades', [])
    const merged = [...TRADE_LOG]
    stored.forEach(t => {
      if (!merged.find(m => m.id === t.id)) merged.push(t)
    })
    return merged.sort((a, b) => new Date(b.date) - new Date(a.date))
  })

  // Daily P&L — seed from preloaded trades when no localStorage value exists for today
  const [dailyPnL, setDailyPnL] = useState(() => {
    const d = load('daily_pnl', null)
    if (d?.date === TODAY) return d.amount
    return TRADE_LOG.filter(t => t.date === TODAY).reduce((s, t) => s + (Number(t.pnl) || 0), 0)
  })

  // Active trading mode
  const [activeMode, setActiveMode] = useState(false)

  // Rules checked today
  const [rulesChecked, setRulesChecked] = useState(() => {
    const d = load('rules_checked', null)
    return d?.date === TODAY ? d.ruleIds : []
  })

  // Daily reminder shown
  const [reminderShown, setReminderShown] = useState(() => {
    return load('reminder_date', null) === TODAY
  })

  // Weekly plan notes
  const [weeklyNotes, setWeeklyNotes] = useState(() => {
    return load('weekly_plan_notes', {
      bias: WEEKLY_PLAN.macro_bias,
      setup: WEEKLY_PLAN.preferred_setup,
      notes: '',
    })
  })

  // Trades today count
  const todayTrades = trades.filter(t => t.date === TODAY)
  const todayPnL = dailyPnL

  // Save trades to localStorage whenever they change (only non-preloaded ones)
  useEffect(() => {
    const toStore = trades.filter(t => !TRADE_LOG.find(p => p.id === t.id))
    save('trades', toStore)
  }, [trades])

  useEffect(() => {
    save('daily_pnl', { date: TODAY, amount: dailyPnL })
  }, [dailyPnL])

  useEffect(() => {
    save('rules_checked', { date: TODAY, ruleIds: rulesChecked })
  }, [rulesChecked])

  useEffect(() => {
    save('weekly_plan_notes', weeklyNotes)
  }, [weeklyNotes])

  function addTrade(trade) {
    const newTrade = {
      ...trade,
      id: Date.now(),
      date: trade.date || TODAY,
    }
    setTrades(prev => [newTrade, ...prev])
    // Update daily P&L
    if (trade.date === TODAY || !trade.date) {
      setDailyPnL(prev => prev + (Number(trade.pnl) || 0))
    }
    return newTrade
  }

  function toggleRule(ruleId) {
    setRulesChecked(prev =>
      prev.includes(ruleId) ? prev.filter(id => id !== ruleId) : [...prev, ruleId]
    )
  }

  function dismissReminder() {
    save('reminder_date', TODAY)
    setReminderShown(true)
  }

  // Account derived values
  const account = {
    ...APEX_ACCOUNT,
    current_balance: APEX_ACCOUNT.current_balance + todayPnL,
    trailing_limit: APEX_ACCOUNT.trailing_limit,
    drawdown_remaining: APEX_ACCOUNT.current_balance + todayPnL - APEX_ACCOUNT.trailing_limit,
    progress_pct: Math.min(100, (APEX_ACCOUNT.total_profit + todayPnL) / APEX_ACCOUNT.profit_goal * 100),
  }

  // Day status
  let dayStatus = 'OPERANDO'
  if (todayPnL <= -APEX_ACCOUNT.daily_stop_loss) dayStatus = 'STOP ALCANZADO'
  else if (todayTrades.length >= APEX_ACCOUNT.max_trades_per_day) dayStatus = 'LÍMITE TRADES'

  return (
    <AppContext.Provider value={{
      trades,
      addTrade,
      todayTrades,
      todayPnL,
      setDailyPnL,
      activeMode,
      setActiveMode,
      rulesChecked,
      toggleRule,
      reminderShown,
      dismissReminder,
      weeklyNotes,
      setWeeklyNotes,
      account,
      dayStatus,
    }}>
      {children}
    </AppContext.Provider>
  )
}
