import React, { useState } from 'react'
import { ChevronLeft, ArrowUpRight, Check, Shield, AlertCircle, CheckCircle2, Smartphone, Building } from 'lucide-react'
import { linkedBanks } from '../data/mockData'

const STEPS = ['Destination', 'Amount', 'Review', 'PC Approval', 'Done']

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

function PCApprovalMock({ amount, destination, account, onApproved }) {
  const [mfaCode, setMfaCode] = useState('')
  const [approving, setApproving] = useState(false)

  const handleApprove = () => {
    setApproving(true)
    setTimeout(() => {
      setApproving(false)
      onApproved()
    }, 1500)
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone size={14} className="text-primary" />
          <span className="text-xs font-semibold text-primary">Simulating PC Approval</span>
        </div>
        <p className="text-xs text-muted">
          In the real product, the Principal Client receives a secure in-app notification and approves with MFA. This simulates that step.
        </p>
      </div>

      <div className="card p-5">
        <div className="text-sm font-semibold text-white mb-3">James Whitfield — Approval Request</div>
        <div className="p-3 bg-surface rounded-xl mb-4 space-y-2">
          <div className="text-xs text-muted">Your advisor Sarah Chen is requesting to withdraw:</div>
          <div className="text-2xl font-bold text-white">{amount}</div>
          <div className="text-xs text-muted">From: {account.label} {account.number}</div>
          <div className="text-xs text-muted">To: {destination?.name} ···· {destination?.last4}</div>
        </div>

        <div className="mb-4">
          <label className="text-xs font-medium text-muted mb-2 block">Enter MFA code (type any 6 digits)</label>
          <input
            className="input text-center text-xl tracking-[0.4em] font-mono"
            placeholder="000000"
            maxLength={6}
            value={mfaCode}
            onChange={e => setMfaCode(e.target.value.replace(/\D/g, ''))}
          />
        </div>

        <div className="flex gap-3">
          <button className="flex-1 py-2.5 rounded-xl border border-border text-sm text-muted hover:text-white hover:bg-card transition-all">
            Decline
          </button>
          <button
            className="flex-1 btn-primary flex items-center justify-center gap-2"
            disabled={mfaCode.length !== 6 || approving}
            onClick={handleApprove}
          >
            {approving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Approving...
              </>
            ) : 'Approve withdrawal'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function WithdrawalFlow({ account, onBack, onDone }) {
  const [step, setStep] = useState(0)
  const [destination, setDestination] = useState(null)
  const [amount, setAmount] = useState('')

  const handleApproved = () => setStep(4)

  return (
    <div className="p-6 max-w-xl">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted hover:text-white mb-6 transition-colors">
        <ChevronLeft size={16} />
        {step === 0 ? 'Back' : 'Wire Withdrawal'}
      </button>

      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-xl bg-warning/10 flex items-center justify-center">
          <ArrowUpRight size={15} className="text-warning" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">Wire Withdrawal</h2>
          <p className="text-xs text-muted">{account.label} · {account.number}</p>
        </div>
      </div>

      <StepIndicator steps={STEPS} current={step} />

      {/* Step 0: Destination */}
      {step === 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-white mb-1">Select destination account</div>
          <p className="text-xs text-muted mb-3">Funds can only be sent to verified trusted destinations.</p>

          {linkedBanks.map(bank => (
            <button
              key={bank.id}
              onClick={() => setDestination(bank)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                destination?.id === bank.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-subtle'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center">
                <Building size={16} className="text-muted" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{bank.name}</span>
                  {bank.trusted && (
                    <span className="badge bg-success/10 text-success text-[10px]">
                      <Shield size={9} />Trusted
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted">{bank.accountType} ···· {bank.last4}</div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                destination?.id === bank.id ? 'border-primary bg-primary' : 'border-border'
              }`}>
                {destination?.id === bank.id && <Check size={10} className="text-white" />}
              </div>
            </button>
          ))}

          {!linkedBanks.some(b => b.trusted) && (
            <div className="p-3 bg-warning/5 border border-warning/20 rounded-xl flex gap-2">
              <AlertCircle size={13} className="text-warning flex-shrink-0 mt-0.5" />
              <span className="text-xs text-warning/90">New destinations require verification before they can receive withdrawals. This may take 1–2 business days.</span>
            </div>
          )}

          <button
            className="btn-primary w-full mt-2"
            disabled={!destination}
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
            <label className="text-xs font-medium text-muted mb-2 block">Withdrawal amount</label>
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
            <div className="text-xs text-muted mt-1">Available: {account.cash}</div>
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
            <h3 className="text-sm font-semibold text-white mb-1">Review withdrawal</h3>
            {[
              ['From', account.label + ' ' + account.number],
              ['To', destination?.name + ' ···· ' + destination?.last4],
              ['Amount', '$' + parseFloat(amount || 0).toLocaleString()],
              ['Method', 'Domestic wire'],
              ['ETA', '1 business day after PC approval'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-sm border-b border-border pb-3 last:pb-0 last:border-0">
                <span className="text-muted">{k}</span>
                <span className="text-white font-medium">{v}</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl flex gap-2">
            <AlertCircle size={13} className="text-primary flex-shrink-0 mt-0.5" />
            <span className="text-xs text-primary">This withdrawal requires PC approval. James Whitfield will be notified and must approve via the app before funds are released.</span>
          </div>

          <div className="flex gap-3">
            <button className="btn-ghost flex-1" onClick={() => setStep(1)}>Back</button>
            <button className="btn-primary flex-1" onClick={() => setStep(3)}>
              Send for approval →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: PC Approval */}
      {step === 3 && (
        <PCApprovalMock
          amount={'$' + parseFloat(amount || 0).toLocaleString()}
          destination={destination}
          account={account}
          onApproved={handleApproved}
        />
      )}

      {/* Step 4: Done */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="p-5 bg-success/5 border border-success/20 rounded-2xl text-center">
            <CheckCircle2 size={32} className="text-success mx-auto mb-2" />
            <div className="text-sm font-semibold text-white mb-1">Withdrawal approved & processing</div>
            <div className="text-xs text-muted">
              ${parseFloat(amount || 0).toLocaleString()} to {destination?.name} ···· {destination?.last4}
            </div>
          </div>

          <div className="card p-5">
            <div className="text-sm font-semibold text-white mb-3">Timeline</div>
            {[
              { label: 'Withdrawal initiated', sub: 'By Sarah Chen', done: true },
              { label: 'PC approved', sub: 'James Whitfield via app + MFA', done: true },
              { label: 'Wire submitted', sub: 'Processing with bank', active: true },
              { label: 'Funds received by bank', sub: '1 business day', done: false },
            ].map((s, i, arr) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    s.done ? 'bg-success/20 text-success' :
                    s.active ? 'bg-primary/20 text-primary' :
                    'bg-surface border border-border'
                  }`}>
                    {s.done ? <Check size={10} /> :
                     s.active ? <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> : null}
                  </div>
                  {i < arr.length - 1 && (
                    <div className={`w-px my-1 ${s.done ? 'bg-success/30' : 'bg-border'}`} style={{height:16}} />
                  )}
                </div>
                <div className="pb-3">
                  <div className={`text-sm font-medium ${s.done ? 'text-white' : s.active ? 'text-primary' : 'text-subtle'}`}>{s.label}</div>
                  <div className="text-xs text-muted">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-primary w-full" onClick={onDone}>Back to Funding</button>
        </div>
      )}
    </div>
  )
}
