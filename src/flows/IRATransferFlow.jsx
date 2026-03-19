import React, { useState } from 'react'
import { ChevronLeft, Repeat, Check, CheckCircle2, Upload, AlertCircle } from 'lucide-react'

const STEPS = ['Source account', 'Transfer type', 'Review', 'Tracking']

const CUSTODIANS = ['Fidelity', 'Schwab', 'Vanguard', 'Merrill Lynch', 'TD Ameritrade', 'Raymond James', 'Other']

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

export default function IRATransferFlow({ account, onBack, onDone }) {
  const [step, setStep] = useState(0)
  const [custodian, setCustodian] = useState('')
  const [accountNum, setAccountNum] = useState('')
  const [transferType, setTransferType] = useState('full')
  const [partialAmount, setPartialAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = () => {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setStep(3)
    }, 1400)
  }

  return (
    <div className="p-6 max-w-xl">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted hover:text-white mb-6 transition-colors">
        <ChevronLeft size={16} />
        {step === 0 ? 'Back' : 'IRA Transfer'}
      </button>

      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
          <Repeat size={15} className="text-amber-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">IRA Transfer</h2>
          <p className="text-xs text-muted">Into {account.label} · {account.number}</p>
        </div>
      </div>

      <StepIndicator steps={STEPS} current={step} />

      {/* Step 0: Source */}
      {step === 0 && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted mb-2 block">Current custodian</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {CUSTODIANS.map(c => (
                <button
                  key={c}
                  onClick={() => setCustodian(c)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                    custodian === c
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card text-muted hover:text-white hover:border-subtle'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted mb-2 block">Account number at current custodian</label>
            <input
              className="input font-mono"
              placeholder="e.g. X12345678"
              value={accountNum}
              onChange={e => setAccountNum(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted mb-2 block">Upload most recent statement (optional)</label>
            <div className="border border-dashed border-border rounded-xl p-4 flex flex-col items-center gap-2 hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-all">
              <Upload size={18} className="text-subtle" />
              <span className="text-xs text-muted">Drag & drop or click to upload</span>
              <span className="text-[11px] text-subtle">PDF · Max 10MB</span>
            </div>
          </div>

          <button
            className="btn-primary w-full"
            disabled={!custodian || !accountNum}
            onClick={() => setStep(1)}
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 1: Transfer type */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="text-sm font-medium text-white mb-1">Transfer type</div>

          <div className="space-y-3">
            {[
              { value: 'full', label: 'Full transfer', desc: 'Transfer entire account balance. Account closes at source.' },
              { value: 'partial', label: 'Partial transfer', desc: 'Transfer a specific cash amount. Source account remains open.' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setTransferType(opt.value)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  transferType === opt.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:border-subtle'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                    transferType === opt.value ? 'border-primary bg-primary' : 'border-border'
                  }`}>
                    {transferType === opt.value && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{opt.label}</div>
                    <div className="text-xs text-muted mt-0.5">{opt.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {transferType === 'partial' && (
            <div>
              <label className="text-xs font-medium text-muted mb-2 block">Amount to transfer</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
                <input
                  className="input pl-7"
                  placeholder="0.00"
                  value={partialAmount}
                  onChange={e => setPartialAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                />
              </div>
            </div>
          )}

          <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs text-amber-400/80">
            IRA-to-IRA transfers are tax-free and not subject to the 60-day rollover rule. Your {custodian} account must be the same IRA type ({account.label.includes('Roth') ? 'Roth' : 'Traditional'}).
          </div>

          <div className="flex gap-3">
            <button className="btn-ghost flex-1" onClick={() => setStep(0)}>Back</button>
            <button className="btn-primary flex-1" onClick={() => setStep(2)}>Review</button>
          </div>
        </div>
      )}

      {/* Step 2: Review */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white mb-1">Review IRA transfer</h3>
            {[
              ['From', custodian + ' ···· ' + accountNum],
              ['To', account.label + ' ' + account.number],
              ['Transfer type', transferType === 'full' ? 'Full transfer (account close)' : 'Partial: $' + parseFloat(partialAmount || 0).toLocaleString()],
              ['Tax treatment', 'Non-reportable trustee-to-trustee transfer'],
              ['ETA', '5–15 business days'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-sm border-b border-border pb-3 last:pb-0 last:border-0">
                <span className="text-muted">{k}</span>
                <span className="text-white font-medium">{v}</span>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2 p-3 bg-surface border border-border rounded-xl">
            <AlertCircle size={13} className="text-muted flex-shrink-0 mt-0.5" />
            <span className="text-xs text-muted">A transfer authorization form will be generated and submitted to {custodian} electronically. You may be asked to sign it.</span>
          </div>

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
              ) : 'Initiate transfer'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Tracking */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-center">
            <CheckCircle2 size={32} className="text-amber-400 mx-auto mb-2" />
            <div className="text-sm font-semibold text-white mb-1">IRA transfer initiated</div>
            <div className="text-xs text-muted">From {custodian} · {transferType === 'full' ? 'Full transfer' : '$' + parseFloat(partialAmount || 0).toLocaleString()}</div>
          </div>

          <div className="card p-5">
            <div className="text-sm font-semibold text-white mb-4">Transfer milestones</div>
            {[
              { label: 'Transfer request submitted', sub: 'Authorization sent to ' + custodian, done: true },
              { label: 'Custodian acknowledgement', sub: '1–3 business days', active: true },
              { label: 'Assets / cash in transit', sub: custodian + ' initiates transfer', done: false },
              { label: 'Assets received', sub: 'Reconciliation in progress', done: false },
              { label: 'Transfer complete', sub: 'Funds available to invest', done: false },
            ].map((s, i, arr) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    s.done ? 'bg-success/20 text-success' :
                    s.active ? 'bg-amber-500/20 text-amber-400' :
                    'bg-surface border border-border'
                  }`}>
                    {s.done ? <Check size={10} /> :
                     s.active ? <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> : null}
                  </div>
                  {i < arr.length - 1 && (
                    <div className={`w-px my-1 ${s.done ? 'bg-success/30' : 'bg-border'}`} style={{height:16}} />
                  )}
                </div>
                <div className="pb-3">
                  <div className={`text-sm font-medium ${s.done ? 'text-white' : s.active ? 'text-amber-300' : 'text-subtle'}`}>{s.label}</div>
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
