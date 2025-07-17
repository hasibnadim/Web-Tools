"use client"
import React, { useState } from 'react'
import { CreditCard, RefreshCcw } from 'lucide-react'

function parseNum(val: string) {
  const n = parseFloat(val)
  return isNaN(n) ? 0 : n
}

type Field = 'initial' | 'withdraw' | 'closing' | 'receive'

type CashOutCalculatorProps = {
  title: string
  defaultRate: number
  altRate: number
  altLabel: string
}

const CashOutCalculator: React.FC<CashOutCalculatorProps> = ({ title, defaultRate, altRate, altLabel }) => {
  const [initialBalance, setInitialBalance] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [closingBalance, setClosingBalance] = useState('')
  const [receiveCash, setReceiveCash] = useState('')
  const [altChecked, setAltChecked] = useState(false)
  const [lastChanged, setLastChanged] = useState<Field>('initial')
  const [customRate, setCustomRate] = useState<string>('')

  // Determine which rate to use
  const rate = customRate !== '' ? parseNum(customRate) / 100 : (altChecked ? altRate : defaultRate)

  // Main sync logic: recalculate all fields based on the last changed field
  React.useEffect(() => {
    const init = parseNum(initialBalance)
    const withdraw = parseNum(withdrawAmount)
    const closing = parseNum(closingBalance)
    const receive = parseNum(receiveCash)
    let newWithdraw = withdrawAmount, newClosing = closingBalance, newReceive = receiveCash

    if (lastChanged === 'initial') {
      // recalc withdraw, closing, receive
      if (withdrawAmount) {
        newClosing = (init - withdraw).toString()
        newReceive = (withdraw - withdraw * rate > 0 ? (withdraw - withdraw * rate).toFixed(2) : '')
      } else if (closingBalance) {
        newWithdraw = (init - closing).toString()
        const w = parseNum(newWithdraw)
        newReceive = (w - w * rate > 0 ? (w - w * rate).toFixed(2) : '')
      } else if (receiveCash) {
        // receive = withdraw - withdraw*rate => withdraw = receive/(1-rate)
        const w = rate < 1 ? receive / (1 - rate) : 0
        newWithdraw = w > 0 ? w.toFixed(2) : ''
        newClosing = (init - w).toString()
      }
    } else if (lastChanged === 'withdraw') {
      newClosing = (init - withdraw).toString()
      newReceive = (withdraw - withdraw * rate > 0 ? (withdraw - withdraw * rate).toFixed(2) : '')
    } else if (lastChanged === 'closing') {
      newWithdraw = (init - closing).toString()
      const w = parseNum(newWithdraw)
      newReceive = (w - w * rate > 0 ? (w - w * rate).toFixed(2) : '')
    } else if (lastChanged === 'receive') {
      // receive = withdraw - withdraw*rate => withdraw = receive/(1-rate)
      const w = rate < 1 ? receive / (1 - rate) : 0
      newWithdraw = w > 0 ? w.toFixed(2) : ''
      newClosing = (init - w).toString()
    }

    // Only update if values have changed to avoid loops
    if (newWithdraw !== withdrawAmount) setWithdrawAmount(newWithdraw)
    if (newClosing !== closingBalance) setClosingBalance(newClosing)
    if (newReceive !== receiveCash) setReceiveCash(newReceive)
    // initialBalance is only updated by user
  // eslint-disable-next-line
  }, [initialBalance, withdrawAmount, closingBalance, receiveCash, rate, lastChanged])

  // Max Withdraw button
  const handleMaxWithdraw = () => {
    setWithdrawAmount(initialBalance)
    setClosingBalance('0')
    setLastChanged('withdraw')
  }

  // Reset button
  const handleReset = () => {
    setInitialBalance('')
    setWithdrawAmount('')
    setClosingBalance('')
    setReceiveCash('')
    setAltChecked(false)
    setCustomRate('')
    setLastChanged('initial')
  }

  // Fee calculation
  const withdraw = parseNum(withdrawAmount)
  const fee = withdraw * rate

  return (
    <div className="p-2">
      <div className="bg-white/90 border border-gray-200 rounded-xl shadow-md p-4 space-y-4 transition-all max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="h-4 w-4 text-blue-500" />
          <span className="font-semibold text-gray-800 text-sm">{title}</span>
          <button
            onClick={handleReset}
            className="ml-auto p-1 rounded hover:bg-gray-100 transition"
            title="Reset"
            type="button"
          >
            <RefreshCcw className="h-4 w-4 text-gray-400" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <label className="text-xs text-gray-600 font-medium">Initial Balance</label>
          <input
            type="number"
            min="0"
            value={initialBalance}
            onChange={e => { setInitialBalance(e.target.value); setLastChanged('initial') }}
            className="rounded-md border border-gray-200 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 bg-gray-50"
            placeholder="0"
          />
        </div>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-600 font-medium">Withdraw Amount</label>
            <button
              type="button"
              onClick={handleMaxWithdraw}
              className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-700 font-medium hover:bg-blue-200 transition"
            >Max Withdraw</button>
          </div>
          <input
            type="number"
            min="0"
            value={withdrawAmount}
            onChange={e => { setWithdrawAmount(e.target.value); setLastChanged('withdraw') }}
            className="rounded-md border border-gray-200 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 bg-gray-50"
            placeholder="0"
          />
        </div>
        <div className="grid grid-cols-1 gap-2">
          <label className="text-xs text-gray-600 font-medium">Closing Balance</label>
          <input
            type="number"
            min="0"
            value={closingBalance}
            onChange={e => { setClosingBalance(e.target.value); setLastChanged('closing') }}
            className="rounded-md border border-gray-200 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 bg-gray-50"
            placeholder="0"
          />
        </div>
        <div className="grid grid-cols-1 gap-2">
          <label className="text-xs text-gray-600 font-medium">Receive Cash</label>
          <input
            type="number"
            min="0"
            value={receiveCash}
            onChange={e => { setReceiveCash(e.target.value); setLastChanged('receive') }}
            className="rounded-md border border-gray-200 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 bg-gray-50"
            placeholder="0"
          />
        </div>
        <div className="flex items-center gap-4 mt-1">
          <label className="inline-flex items-center gap-1 text-xs">
            <input
              type="checkbox"
              checked={altChecked}
              onChange={e => setAltChecked(e.target.checked)}
              className="accent-blue-500 h-3.5 w-3.5 rounded"
            />
            {altLabel}
          </label>
          <span className="text-xs text-gray-500 flex items-center gap-1">
          Charge:
            <input
              type="number"
              min="0"
              step="0.0001"
              value={customRate !== '' ? customRate : ''}
              onChange={e => {
                // Store as percent string, but use as decimal in calculations
                setCustomRate(e.target.value)
              }}
              placeholder={((altChecked ? altRate : defaultRate) * 100).toFixed(2)}
              className="w-14 px-1 py-0.5 text-xs border border-blue-200 rounded bg-white text-blue-700 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-300 text-right"
              style={{ minWidth: 0 }}
            />
            <span className="text-xs text-gray-500">%</span>
          </span>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mt-2 text-xs space-y-1 shadow-sm transition-all">
          <div className="flex items-center gap-1 text-gray-700">
            <span>Fee :</span>
            <span className="font-semibold">{fee > 0 ? fee.toFixed(4) : '0.0000'} ৳</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CashOutCalculator 