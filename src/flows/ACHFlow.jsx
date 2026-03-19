import React, { useState } from 'react'
import { ChevronLeft, Zap, Check, Plus, Shield, CheckCircle2, Building, ChevronRight } from 'lucide-react'
import { linkedBanks } from '../data/mockData'

const STEPS = ['Select bank', 'Amount', 'Review', 'Done']

function StepIndicator({ steps, current }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center gap-1">
            <div className={`step-dot transition-all ${
              i < current ? 'bg-success text-white' :
              i === current ? 'bg-primary text-white' :
              'bg-card border border-border text-subtle'
            }`}>
              {i < current ? <Check size={14} /> : i + 1}
            </div>
            <span className={`text-[10px] font-medium ${i === current ? 'text-white' : 'text-subtle'}`}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-px mb-5 mx-1 ${i < current ? 'bg-success/50' : 'bg-border'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

function BankCard({ bank, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(bank)}
      className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
        selected
          ? 'border-primary bg-primary/10'
          : 'border-border bg-card hover:border-subtle'
      }`}
    >
      <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center">
        <Building size={16} className="text-muted" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-white">{bank.name}</div>
        <div className="text-xs text-muted">{bank.accountType} ···· {bank.last4}</div>
        {bank.trusted && (
          <div className="flex items-center gap-1 mt-1">
            <Shield size={10} className="text-success" />
            <span className="text-[10px] text-success">Trusted source</span>
          </div>
        )}
      </div>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
        selected ? 'border-primary bg-primary' : 'border-border'
      }`}>
        {selected && <Check size={10} className="text-white" />}
      </div>
    </button>
  )
}

const QUICK_AMOUNTS = ['$10,000', '$25,000', '$50,000', '$100,000']

export default function ACHFlow({ account, onBack, onDone }) {
  const [step, setStep] = useState(0)
  const [selectedBank, setSelectedBank] = useState(null)
  const [amount, setAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = () => {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setStep(3)
    }, 1200)
  }

  return (
    <div className="p-6 max-w-xl">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted hover:text-white mb-6 transition-colors">
        <ChevronLeft size={16} />
        {step === 0 ? 'Back' : 'ACH Deposit'}
      </button>

      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <Zap size={15} className="text-emerald-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">ACH Deposit</h2>
            <span className="badge bg-success/15 text-success text-[10px] font-semibold border border-success/20">Fastest</span>
          </div>
          <p className="text-xs text-muted">{account.label} · {account.number}</p>
        </div>
      </div>

      <StepIndicator steps={STEPS} current={step} />

      {/* Step 0: Select bank */}
      {step === 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-white mb-3">Select source bank account</div>
          {linkedBanks.map(bank => (
            <BankCard
              key={bank.id}
              bank={bank}
              selected={selectedBank?.id === bank.id}
              onSelect={setSelectedBank}
            />
          ))}
          <button className="w-full flex items-center gap-3 p-4 rounded-xl border border-dashed border-border hover:border-primary/40 hover:bg-primary/5 text-muted hover:text-primary transition-all text-sm">
            <Plus size={16} />
            Link new bank account
          </button>
          <button
            className="btn-primary w-full mt-4"
            disabled={!selectedBank}
            onClick={() => setStep(1)}
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 1: Amount */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted mb-2 block">Deposit amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
              <input
                className="input pl-7 text-lg font-semibold"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                autoFocus
              />
            </div>
            <div className="flex gap-2 mt-2">
              {QUICK_AMOUNTS.map(a => (
                <button
                  key={a}
                  onClick={() => setAmount(a.replace('$', '').replace(',', ''))}
                  className="px-3 py-1.5 text-xs rounded-lg bg-surface border border-border text-muted hover:text-white hover:border-subtle transition-all"
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 card space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted">From</span>
              <span className="text-white">{selectedBank?.name} ···· {selectedBank?.last4}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted">Daily limit</span>
              <span className="text-white">$100,000</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted">ETA</span>
              <span className="text-emerald-400 font-medium">Same day – next business day</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="btn-ghost flex-1" onClick={() => setStep(0)}>Back</button>
            <button
              className="btn-primary flex-1"
              disabled={!amount || parseFloat(amount) <= 0}
              onClick={() => setStep(2)}
            >
              Review
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Review */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white mb-1">Review deposit</h3>
            {[
              ['From', selectedBank?.name + ' ···· ' + selectedBank?.last4],
              ['To', account.label + ' ' + account.number],
              ['Amount', '$' + parseFloat(amount || 0).toLocaleString()],
              ['Method', 'ACH pull'],
              ['ETA', 'Same day – next business day'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-sm border-b border-border pb-3 last:pb-0 last:border-0">
                <span className="text-muted">{k}</span>
                <span className="text-white font-medium">{v}</span>
              </div>
            ))}
          </div>

          {selectedBank?.trusted && (
            <div className="flex items-center gap-2 p-3 bg-success/5 border border-success/20 rounded-xl">
              <Shield size={14} className="text-success" />
              <span className="text-xs text-success">This is a trusted source. No additional verification required.</span>
            </div>
          )}

          <div className="flex gap-3">
            <button className="btn-ghost flex-1" onClick={() => setStep(1)}>Back</button>
            <button
              className="btn-primary flex-1 flex items-center justify-center gap-2"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : 'Initiate deposit'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="p-6 bg-success/5 border border-success/20 rounded-2xl text-center">
            <CheckCircle2 size={36} className="text-success mx-auto mb-3" />
            <div className="text-base font-semibold text-white mb-1">ACH deposit initiated</div>
            <div className="text-sm text-muted">
              ${parseFloat(amount || 0).toLocaleString()} from {selectedBank?.name} ···· {selectedBank?.last4}
            </div>
          </div>

          <div className="card p-5 space-y-3">
            <div className="text-sm font-semibold text-white mb-2">What happens next</div>
            {[
              { label: 'Pull request sent', time: 'Just now', done: true },
              { label: 'Bank processes transfer', time: 'Today – tomorrow', active: true },
              { label: 'Funds arrive in account', time: 'Same day – next business day', done: false },
              { label: 'Available to invest', time: 'Upon receipt', done: false },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  s.done ? 'bg-success/20 text-success' :
                  s.active ? 'bg-primary/20 text-primary' :
                  'bg-surface border border-border text-subtle'
                }`}>
                  {s.done ? <Check size={10} /> :
                   s.active ? <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> :
                   null}
                </div>
                <div>
                  <div className={`text-sm font-medium ${s.done ? 'text-white' : s.active ? 'text-primary' : 'text-subtle'}`}>{s.label}</div>
                  <div className="text-xs text-muted">{s.time}</div>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-primary w-full" onClick={onDone}>
            Back to Funding
          </button>
        </div>
      )}
    </div>
  )
}
